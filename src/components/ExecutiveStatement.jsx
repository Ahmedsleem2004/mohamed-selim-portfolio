import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { profile } from '../data/profile'

const KEYWORDS = /(direction|trust|results)/g

function Line({ text }) {
  const parts = text.split(KEYWORDS)
  return (
    <span className="st-line block overflow-hidden pb-[0.08em]">
      <span className="inner block origin-bottom-left">
        {parts.map((p, i) =>
          i % 2 === 1 ? (
            <em key={i} className="font-display font-extrabold italic text-gold">
              {p}
            </em>
          ) : (
            <Fragment key={i}>{p}</Fragment>
          ),
        )}
      </span>
    </span>
  )
}

export default function ExecutiveStatement() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.st-line .inner').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 115, rotate: 2 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: { trigger: el.parentElement, start: 'top 88%', toggleActions: 'play none none reverse' },
          },
        )
      })
      gsap.from('.st-rule', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-rule', start: 'top 90%' },
      })
      gsap.from('.st-profile', {
        y: 30,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.st-profile', start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="profile"
      ref={root}
      className="relative z-20 -mt-[28vh] px-6 pb-32 pt-[42vh] md:px-12 md:pb-48"
      style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0) 0, #050505 34vh)' }}
    >
      <p className="eyebrow">01 — Executive Statement</p>

      <blockquote className="mt-10 font-display text-[clamp(1.9rem,6.2vw,6.6rem)] font-bold leading-[1.04] tracking-[-0.02em] text-paper md:mt-14">
        {profile.statement.map((line, i) => (
          <Line key={i} text={line} />
        ))}
      </blockquote>

      <div className="st-rule mt-16 h-px w-full bg-gradient-to-r from-gold via-white/15 to-transparent md:mt-24" />

      <div className="mt-10 grid gap-8 md:grid-cols-12">
        <p className="st-profile text-[11px] font-semibold tracking-[0.4em] text-white/45 md:col-span-4">
          PROFILE
        </p>
        <p className="st-profile max-w-2xl text-lg leading-relaxed text-white/65 md:col-span-8 md:text-2xl md:leading-[1.6]">
          {profile.summary}
        </p>
      </div>
    </section>
  )
}