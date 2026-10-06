import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/gsap'
import { profile } from '../data/profile'

/** CSS-3D "exploded" architectural stack — the four areas of the company's world. */
export default function CurrentRole() {
  const root = useRef(null)
  const tilt = useRef(null)
  const rig = useRef(null)
  const [hover, setHover] = useState(null)
  const areas = profile.companyAreas

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(rig.current, { rotationX: 58, rotationZ: -38 })

      gsap.from('.cr-reveal', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })

      // The stack opens up as the section scrolls through the viewport
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          '.cr-plate',
          { z: (i) => i * 18 },
          {
            z: (i) => i * 105,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'center 30%', scrub: 1 },
          },
        )
        gsap.fromTo(
          '.cr-bg',
          { xPercent: 6 },
          {
            xPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }

      if (isFinePointer() && !prefersReducedMotion()) {
        const rx = gsap.quickTo(tilt.current, 'rotationX', { duration: 1, ease: 'power3.out' })
        const ry = gsap.quickTo(tilt.current, 'rotationY', { duration: 1, ease: 'power3.out' })
        gsap.set(tilt.current, { transformPerspective: 1400 })
        const onMove = (e) => {
          const r = root.current.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / r.height - 0.5
          ry(nx * 10)
          rx(ny * -8)
        }
        const el = root.current
        el.addEventListener('mousemove', onMove)
        return () => el.removeEventListener('mousemove', onMove)
      }
      return undefined
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="current" ref={root} className="blueprint relative overflow-hidden bg-coal px-6 py-32 md:px-12 md:py-48">
      {/* Oversized backdrop word */}
      <span
        aria-hidden="true"
        className="cr-bg text-outline pointer-events-none absolute -left-[4vw] top-[6%] select-none whitespace-nowrap font-display text-[26vw] font-extrabold leading-none"
      >
        AL-DAGAL
      </span>

      <div className="relative z-10 grid items-center gap-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="cr-reveal eyebrow">03 — Current Role</p>
          <h2 className="cr-reveal mt-6 font-display text-[clamp(3.4rem,13vw,11rem)] font-extrabold leading-[0.88] tracking-[-0.03em]">
            AL-<span className="text-gold">DAGAL</span>
          </h2>
          <p className="cr-reveal mt-8 text-2xl font-semibold text-paper md:text-4xl">Sales Manager</p>
          <p className="cr-reveal mt-3 text-[11px] uppercase tracking-[0.35em] text-white/45">
            {profile.company} · 5 years
          </p>

          <ul className="cr-reveal mt-14 max-w-md border-t border-white/10">
            {areas.map((a, i) => (
              <li key={a} className="border-b border-white/10">
                <button
                  type="button"
                  data-cursor
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  onClick={() => setHover((h) => (h === i ? null : i))}
                  className={`flex w-full items-center justify-between py-5 text-left transition-colors duration-500 ${
                    hover === i ? 'text-gold' : 'text-paper/80'
                  }`}
                >
                  <span className="font-display text-xl font-bold md:text-2xl">{a}</span>
                  <span className="text-[11px] tracking-[0.35em] text-white/35">0{i + 1}</span>
                </button>
              </li>
            ))}
          </ul>

          <p className="cr-reveal mt-12 max-w-md font-display text-xl italic leading-relaxed text-white/55 md:text-2xl">
            Inside the professional world of Mohamed Selim.
          </p>
        </div>

        {/* 3D exploded stack */}
        <div className="cr-reveal flex justify-center lg:col-span-6" aria-hidden="true">
          <div className="relative aspect-square w-[min(80vw,460px)]" style={{ perspective: '1400px' }}>
            <div ref={tilt} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
              <div ref={rig} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
                {areas.map((a, i) => (
                  <div
                    key={a}
                    className={`cr-plate absolute inset-0 border transition-colors duration-500 ${
                      hover === i
                        ? 'border-gold bg-gold/[0.12] shadow-[0_0_60px_rgba(201,162,39,0.35)]'
                        : 'border-white/20 bg-white/[0.02]'
                    }`}
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                      backgroundSize: '46px 46px',
                    }}
                  >
                    <span className="absolute left-3 top-3 text-[10px] font-semibold tracking-[0.3em] text-gold">
                      0{i + 1}
                    </span>
                    <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-gold" />
                    <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-gold" />
                  </div>
                ))}
                {/* Vertical axis through the stack */}
                <div
                  className="absolute left-1/2 w-px bg-gold/60"
                  style={{ height: 460, top: 'calc(50% - 230px)', transform: 'translateZ(160px) rotateX(90deg)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}