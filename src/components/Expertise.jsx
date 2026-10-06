import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { profile } from '../data/profile'

const items = profile.expertise
const STEP = 360 / items.length
const angleOf = (i) => -90 + i * STEP

export default function Expertise() {
  const root = useRef(null)
  const marker = useRef(null)
  const center = useRef(null)
  const rot = useRef(angleOf(0))
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(marker.current, { rotation: angleOf(0), transformOrigin: '0% 50%' })
      gsap.from('.ex-reveal', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
      gsap.from('.ex-node', {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.6)',
        stagger: 0.07,
        scrollTrigger: { trigger: '.ex-stage', start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Move the gold marker and swap the centre copy whenever the active capability changes
  useEffect(() => {
    const target = angleOf(active)
    const delta = ((target - rot.current + 540) % 360) - 180
    rot.current += delta
    gsap.to(marker.current, { rotation: rot.current, duration: 0.9, ease: 'power3.inOut', overwrite: 'auto' })
    gsap.fromTo(
      center.current.children,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, overwrite: 'auto' },
    )
  }, [active])

  return (
    <section id="expertise" ref={root} className="relative overflow-hidden bg-ink px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <p className="ex-reveal eyebrow">04 — Expertise</p>
        <h2 className="ex-reveal mt-6 max-w-3xl font-display text-[clamp(2.4rem,7vw,6.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          A system of <span className="italic text-gold">capabilities</span>.
        </h2>
      </div>

      <div className="ex-stage relative mx-auto mt-20 aspect-square w-[min(86vw,540px)] md:mt-28 lg:w-[min(56vh,520px)] lg:min-w-[440px]">
        {/* Rings */}
        <div className="absolute inset-[8%] rounded-full border border-white/10" />
        <div className="absolute inset-[24%] rounded-full border border-white/[0.06]" />
        <div className="absolute inset-[38%] rounded-full border border-gold/20" />

        {/* Gold marker: line from the centre to the active node */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
          <div ref={marker} className="absolute left-0 top-0 h-px w-[calc(min(86vw,540px)*0.42)] lg:w-[calc(min(56vh,520px)*0.42)]">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-gold/50 to-gold" />
          </div>
        </div>

        {/* Centre copy */}
        <div className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div ref={center} aria-live="polite">
            <p className="text-[11px] font-semibold tracking-[0.4em] text-gold">0{active + 1}</p>
            <h3 className="mt-3 font-display text-xl font-extrabold leading-tight sm:text-2xl lg:text-3xl">
              {items[active].name}
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-white/55 sm:text-sm">{items[active].text}</p>
          </div>
        </div>

        {/* Nodes */}
        {items.map((it, i) => {
          const a = (angleOf(i) * Math.PI) / 180
          const cos = Math.cos(a)
          const sin = Math.sin(a)
          const left = 50 + 42 * cos
          const top = 50 + 42 * sin
          let labelPos
          if (cos > 0.3) labelPos = 'left-full ml-5 text-left'
          else if (cos < -0.3) labelPos = 'right-full mr-5 text-right'
          else if (sin < 0) labelPos = 'bottom-full left-1/2 mb-4 -translate-x-1/2 text-center'
          else labelPos = 'left-1/2 top-full mt-4 -translate-x-1/2 text-center'
          const on = active === i
          return (
            <button
              key={it.name}
              type="button"
              data-cursor
              aria-pressed={on}
              aria-label={it.name}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <span className="ex-node relative block">
                <span
                  className={`flex h-9 w-9 items-center justify-center border text-[10px] font-semibold tracking-wider transition-all duration-500 md:h-10 md:w-10 ${
                    on
                      ? 'border-gold bg-gold text-ink shadow-[0_0_30px_rgba(201,162,39,0.5)]'
                      : 'border-white/25 bg-ink text-white/60 hover:border-gold/60'
                  }`}
                >
                  0{i + 1}
                </span>
                <span
                  className={`absolute hidden whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em] transition-colors duration-500 lg:block ${labelPos} ${
                    on ? 'text-gold' : 'text-white/45'
                  }`}
                >
                  {it.name}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <p className="mx-auto mt-20 max-w-md text-center text-[11px] tracking-[0.35em] text-white/30 lg:hidden">
        TAP A NUMBER TO EXPLORE
      </p>
    </section>
  )
}