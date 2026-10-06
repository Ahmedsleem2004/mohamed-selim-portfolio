import { Component, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Edges, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { prefersReducedMotion } from '../lib/gsap'

const GOLD = '#C9A227'
const GOLD_LIGHT = '#E0BD3D'

// Small deterministic RNG so the skyline is identical on every load.
function rng(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// If WebGL is unavailable the hero simply falls back to its CSS background.
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {}
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/** Low-poly field of dark metallic towers with gold edge lines. */
function Skyline({ count }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#101010', metalness: 0.85, roughness: 0.32 }),
    [],
  )
  const accent = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1405',
        metalness: 1,
        roughness: 0.28,
        emissive: '#2a1f04',
        emissiveIntensity: 0.6,
      }),
    [],
  )

  useEffect(
    () => () => {
      geometry.dispose()
      dark.dispose()
      accent.dispose()
    },
    [geometry, dark, accent],
  )

  const towers = useMemo(() => {
    const r = rng(11)
    const out = []
    for (let i = 0; i < count; i++) {
      const row = i % 4
      out.push({
        x: (r() - 0.5) * 40,
        z: -2 - row * 5.5 - r() * 3,
        w: 0.9 + r() * 1.9,
        d: 0.9 + r() * 1.9,
        h: 2.5 + r() * (6 + row * 2.2),
        accent: r() > 0.88,
      })
    }
    return out
  }, [count])

  return (
    <group>
      {towers.map((t, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={t.accent ? accent : dark}
          position={[t.x, t.h / 2, t.z]}
          scale={[t.w, t.h, t.d]}
        >
          <Edges threshold={15} color={t.accent ? GOLD : '#2b2410'} />
        </mesh>
      ))}
    </group>
  )
}

/** Signature golden twisted tower — stacked glass floors with gold edges. */
function TwistedTower({ floors }) {
  const group = useRef()
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  const glass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0b0b0b',
        metalness: 1,
        roughness: 0.18,
        transparent: true,
        opacity: 0.78,
      }),
    [],
  )
  const reduced = useMemo(() => prefersReducedMotion(), [])

  useEffect(
    () => () => {
      geometry.dispose()
      glass.dispose()
    },
    [geometry, glass],
  )

  useFrame((state) => {
    if (!group.current || reduced) return
    group.current.rotation.y = state.clock.elapsedTime * 0.04
  })

  const items = useMemo(() => Array.from({ length: floors }, (_, i) => i), [floors])

  return (
    <group ref={group} position={[5.2, 0, -7]} scale={1.5}>
      {items.map((i) => {
        const k = 1 - i / (floors * 1.6)
        return (
          <mesh
            key={i}
            geometry={geometry}
            material={glass}
            position={[0, 0.3 + i * 0.5, 0]}
            rotation={[0, i * 0.13, 0]}
            scale={[2.6 * k, 0.14, 2.6 * k]}
          >
            <Edges threshold={15} color={i % 4 === 0 ? GOLD_LIGHT : GOLD} />
          </mesh>
        )
      })}
      <mesh
        geometry={geometry}
        material={glass}
        position={[0, floors * 0.25 + 0.3, 0]}
        scale={[0.35, floors * 0.5 + 0.6, 0.35]}
      >
        <Edges threshold={15} color={GOLD} />
      </mesh>
    </group>
  )
}

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]}>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#070707" metalness={0.9} roughness={0.5} />
      </mesh>
      <gridHelper args={[80, 40, '#2a2208', '#141414']} position={[0, 0.01, -10]} />
    </group>
  )
}

/** Sparse gold dust — a single Points draw call. */
function Dust({ count }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const r = rng(5)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (r() - 0.5) * 40
      arr[i * 3 + 1] = r() * 16
      arr[i * 3 + 2] = -r() * 26 + 4
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = t * 0.012
    ref.current.position.y = Math.sin(t * 0.15) * 0.3
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={GOLD_LIGHT}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  )
}

function Lights() {
  const sweep = useRef()
  useFrame((state) => {
    if (!sweep.current) return
    sweep.current.position.x = Math.sin(state.clock.elapsedTime * 0.15) * 10
  })
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 12, 8]} intensity={1.3} color="#fff1c7" />
      <pointLight ref={sweep} position={[-8, 5, -2]} intensity={70} distance={34} color={GOLD} />
    </>
  )
}

/** Slow camera drift + gentle mouse and scroll response. */
function Rig({ input }) {
  const reduced = useMemo(() => prefersReducedMotion(), [])
  useFrame((state, delta) => {
    const cam = state.camera
    const t = state.clock.elapsedTime
    const { mouse, scroll } = input.current
    const drift = reduced ? 0 : 1

    const tx = Math.sin(t * 0.09) * 1.1 * drift + mouse.x * 1.2
    const ty = 3.4 + Math.cos(t * 0.07) * 0.25 * drift + mouse.y * 0.6 - scroll * 1.4
    const tz = 13.5 + scroll * 11

    cam.position.x = THREE.MathUtils.damp(cam.position.x, tx, 2.2, delta)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, ty, 2.2, delta)
    cam.position.z = THREE.MathUtils.damp(cam.position.z, tz, 2.2, delta)
    cam.lookAt(mouse.x * 0.5, 3.6 - scroll * 1.5, -5)
  })
  return null
}

export default function Scene3D({ input, active = true }) {
  const mobile = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
    [],
  )
  const [dpr, setDpr] = useState(mobile ? [1, 1.5] : [1, 1.75])

  return (
    <SceneBoundary>
      <Canvas
        dpr={dpr}
        frameloop={active ? 'always' : 'never'}
        gl={{ antialias: !mobile, powerPreference: 'high-performance' }}
        camera={{ fov: 40, position: [0, 3.4, 13.5], near: 0.1, far: 70 }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 11, 40]} />
        <PerformanceMonitor onDecline={() => setDpr([0.75, 1])} />
        <Rig input={input} />
        <Lights />
        <Ground />
        <Skyline count={mobile ? 14 : 26} />
        <TwistedTower floors={mobile ? 10 : 15} />
        <Dust count={mobile ? 90 : 240} />
      </Canvas>
    </SceneBoundary>
  )
}