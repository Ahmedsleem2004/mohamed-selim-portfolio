import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { profile } from '../data/profile'

export default function Language() {
  const root = useRef(null)
  const { name, level } = profile.language

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Outline word fills with solid type as it scrolls through view
      gsap.fromTo(
        '.lg-fill',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 45%', scrub: 1 },
        },
      )
      gsap.from('.lg-letter', {
        yPercent: 120,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.lg-level', start: 'top 90%' },
      })
      gsap.from('.lg-head', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const word = name.toUpperCase()

  return (
    <section id="language" ref={root} className="relative overflow-hidden bg-coal px-6 py-32 md:px-12 md:py-44">
      <p className="lg-head eyebrow">07 — Language</p>

      <div className="relative mt-10 inline-block">
        <h2 className="text-outline font-display text-[clamp(3.6rem,17vw,16rem)] font-extrabold leading-[0.9] tracking-[-0.03em] [-webkit-text-stroke:1.2px_rgba(245,245,245,0.35)]">
          {word}
        </h2>
        <h2
          aria-hidden="true"
          className="lg-fill absolute inset-0 font-display text-[clamp(3.6rem,17vw,16rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-paper"
        >
          {word}
        </h2>
      </div>

      <div className="lg-level mt-8 flex items-center gap-6 md:mt-10">
        <span className="h-px w-12 bg-gold md:w-24" />
        <p className="flex text-lg font-semibold tracking-[0.55em] text-gold md:text-3xl" aria-label={level}>
          {level
            .toUpperCase()
            .split('')
            .map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <span className="lg-letter inline-block">{ch}</span>
              </span>
            ))}
        </p>
      </div>
    </section>
  )
}