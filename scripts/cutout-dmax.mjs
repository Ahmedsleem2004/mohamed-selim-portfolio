import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'src/assets/dmax-2026-source.jpg')
const dest = path.join(root, 'src/assets/dmax-2026.png')

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width: w, height: h } = info
const px = (x, y) => (y * w + x) * 4

const samples = []
const sampleBox = (sx, sy) => {
  for (let y = sy; y < sy + 8; y++) {
    for (let x = sx; x < sx + 8; x++) {
      const i = px(x, y)
      samples.push([data[i], data[i + 1], data[i + 2]])
    }
  }
}
sampleBox(0, 0)
sampleBox(w - 8, 0)
sampleBox(0, h - 8)
sampleBox(w - 8, h - 8)

const bg = samples
  .reduce((a, s) => [a[0] + s[0], a[1] + s[1], a[2] + s[2]], [0, 0, 0])
  .map((v) => v / samples.length)

const dist = (i) => {
  const dr = data[i] - bg[0]
  const dg = data[i + 1] - bg[1]
  const db = data[i + 2] - bg[2]
  return Math.hypot(dr, dg, db)
}

const visited = new Uint8Array(w * h)
const stack = []
const push = (x, y) => {
  if (x < 0 || y < 0 || x >= w || y >= h) return
  const k = y * w + x
  if (visited[k]) return
  visited[k] = 1
  stack.push(k)
}

for (let x = 0; x < w; x++) {
  push(x, 0)
  push(x, h - 1)
}
for (let y = 0; y < h; y++) {
  push(0, y)
  push(w - 1, y)
}

const THRESH = 26
while (stack.length) {
  const k = stack.pop()
  const i = k * 4
  if (dist(i) > THRESH) continue
  data[i + 3] = 0
  const x = k % w
  const y = (k / w) | 0
  push(x - 1, y)
  push(x + 1, y)
  push(x, y - 1)
  push(x, y + 1)
}

// Feather halo: any remaining near-bg pixel next to transparency fades out.
for (let y = 1; y < h - 1; y++) {
  for (let x = 1; x < w - 1; x++) {
    const i = px(x, y)
    if (data[i + 3] === 0) continue
    const d = dist(i)
    if (d > 40) continue
    let trans = 0
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      if (data[px(x + dx, y + dy) + 3] === 0) trans++
    }
    if (trans) {
      const fade = Math.max(0, 1 - d / 40) * (trans / 4)
      data[i + 3] = Math.round(data[i + 3] * (1 - fade))
    }
  }
}

// Crop to opaque bounds with padding.
let minX = w
let minY = h
let maxX = 0
let maxY = 0
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (data[px(x, y) + 3] < 12) continue
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }
}

const pad = 8
minX = Math.max(0, minX - pad)
minY = Math.max(0, minY - pad)
maxX = Math.min(w - 1, maxX + pad)
maxY = Math.min(h - 1, maxY + pad)
const cw = maxX - minX + 1
const ch = maxY - minY + 1
const cropped = Buffer.alloc(cw * ch * 4)
for (let y = 0; y < ch; y++) {
  data.copy(cropped, y * cw * 4, px(minX, minY + y), px(minX, minY + y) + cw * 4)
}

await sharp(cropped, { raw: { width: cw, height: ch, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(dest)

console.log(`wrote ${dest} (${cw}x${ch}) bg=${bg.map((n) => n.toFixed(1)).join(',')}`)
