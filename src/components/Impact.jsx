
import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { profile } from '../data/profile'
import { useSitePreferences } from '../context/SitePreferences'

const arabicImpact = {
  'Years of Experience': 'سنوات من الخبرة',
  'Years at Al-Dagal': 'سنوات في شركة الدقل',
  'Leadership Roles': 'مناصب قيادية',
}

export default function Impact() {
  const root = useRef(null)
  const nums = useRef([])
  const rows = useRef([])
  const { language } = useSitePreferences()
  const isArabic = language === 'ar'

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      profile.impact.forEach((s, i) => {
        const el = nums.current[i]
        const row = rows.current[i]

        if (!el || !row) return

        const obj = { v: 0 }

        gsap.to(obj, {
          v: s.value,
          duration: 2.2,
          ease: 'power2.out',
          snap: { v: 1 },
          onUpdate: () => {
            el.textContent = String(obj.v)
          },
          scrollTrigger: {
            trigger: row,
            start: 'top 75%',
            once: true,
          },
        })

        gsap.from(row.querySelector('.im-rule'), {
          scaleX: 0,
          transformOrigin: isArabic ? 'right center' : 'left center',
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
          },
        })

        gsap.fromTo(
          row.querySelector('.im-num'),
          { xPercent: isArabic ? 3 : -3 },
          {
            xPercent: isArabic ? -3 : 3,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      gsap.from('.im-head', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 70%',
        },
      })
    }, root)

    return () => ctx.revert()
  }, [isArabic])

  return (
    <section
      id="impact"
      ref={root}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-[var(--surface-bg)] px-6 py-32 text-[var(--text-primary)] md:px-12 md:py-48"
    >
      <p className="im-head eyebrow">
        {isArabic ? '٠٥ — الأثر المهني' : '05 — Professional Impact'}
      </p>

      <h2
        className={`im-head mt-6 max-w-2xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] ${
          isArabic ? 'text-right' : 'text-left leading-[1]'
        }`}
      >
        {isArabic ? (
          <>
            عقد من الزمن،{' '}
            <span className="italic text-[var(--accent)]">من الإنجازات</span>
            .
          </>
        ) : (
          <>
            A decade,{' '}
            <span className="italic text-[var(--accent)]">measured</span> in
            roles.
          </>
        )}
      </h2>

      <div className="mt-20 md:mt-28">
        {profile.impact.map((s, i) => (
          <div
            key={s.label}
            ref={(el) => {
              rows.current[i] = el
            }}
            className="relative grid items-end gap-4 py-10 md:grid-cols-12 md:gap-8 md:py-14"
          >
            <div className="im-rule absolute left-0 top-0 h-px w-full bg-[var(--border-color)]" />

            <div className="im-num col-span-12 md:col-span-9">
              <span
                className="font-display text-[clamp(7rem,28vw,24rem)] font-extrabold leading-[0.8] tracking-[-0.04em] text-[var(--text-primary)]"
                dir="ltr"
              >
                <span ref={(el) => (nums.current[i] = el)}>0</span>

                {s.suffix && (
                  <span className="text-[var(--accent)]">{s.suffix}</span>
                )}
              </span>
            </div>

            <p
              className={`col-span-12 text-[11px] font-semibold text-[var(--text-muted)] md:col-span-3 md:pb-6 md:text-sm ${
                isArabic
                  ? 'text-right tracking-normal'
                  : 'text-left uppercase tracking-[0.4em]'
              }`}
            >
              {isArabic
                ? arabicImpact[s.label] || s.label
                : s.label}
            </p>
          </div>
        ))}

        <div className="h-px w-full bg-[var(--border-color)]" />
      </div>
    </section>
  )
}
