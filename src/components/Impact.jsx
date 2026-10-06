import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { profile } from '../data/profile'

export default function Impact() {
  const root = useRef(null)
  const nums = useRef([])
  const rows = useRef([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      profile.impact.forEach((s, i) => {
        const el = nums.current[i]
        const row = rows.current[i]
        const obj = { v: 0 }
        gsap.to(obj, {
          v: s.value,
          duration: 2.2,
          ease: 'power2.out',
          snap: { v: 1 },
          onUpdate: () => {
            el.textContent = String(obj.v)
          },
          scrollTrigger: { trigger: row, start: 'top 75%', once: true },
        })
        gsap.from(row.querySelector('.im-rule'), {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%' },
        })
        gsap.fromTo(
          row.querySelector('.im-num'),
          { xPercent: -3 },
          {
            xPercent: 3,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
      gsap.from('.im-head', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="impact" ref={root} className="relative overflow-hidden bg-coal px-6 py-32 md:px-12 md:py-48">
      <p className="im-head eyebrow">05 — Professional Impact</p>
      <h2 className="im-head mt-6 max-w-2xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.02em]">
        A decade, <span className="italic text-gold">measured</span> in roles.
      </h2>

      <div className="mt-20 md:mt-28">
        {profile.impact.map((s, i) => (
          <div
            key={s.label}
            ref={(el) => (rows.current[i] = el)}
            className="relative grid items-end gap-4 py-10 md:grid-cols-12 md:gap-8 md:py-14"
          >
            <div className="im-rule absolute left-0 top-0 h-px w-full bg-white/15" />
            <div className="im-num col-span-12 md:col-span-9">
              <span className="font-display text-[clamp(7rem,28vw,24rem)] font-extrabold leading-[0.8] tracking-[-0.04em] text-paper">
                <span ref={(el) => (nums.current[i] = el)}>0</span>
                {s.suffix && <span className="text-gold">{s.suffix}</span>}
              </span>
            </div>
            <p className="col-span-12 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/50 md:col-span-3 md:pb-6 md:text-sm">
              {s.label}
            </p>
          </div>
        ))}
        <div className="h-px w-full bg-white/15" />
      </div>
    </section>
  )
}