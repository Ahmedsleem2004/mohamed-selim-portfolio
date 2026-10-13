
import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { profile } from '../data/profile'
import { useSitePreferences } from '../context/SitePreferences'

const KEYWORDS = /(direction|trust|results)/g

function Line({ text, isArabic }) {
  const parts = isArabic ? [text] : text.split(KEYWORDS)

  return (
    <span className="st-line block overflow-hidden pb-[0.08em]">
      <span
        className={`inner block origin-bottom-left ${
          isArabic ? 'origin-bottom-right' : ''
        }`}
      >
        {parts.map((p, i) =>
          !isArabic && KEYWORDS.test(p) ? (
            <em
              key={i}
              className="font-display font-extrabold italic text-[var(--accent)]"
            >
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
  const { language } = useSitePreferences()
  const isArabic = language === 'ar'

  const statement = isArabic
    ? [
        'القيادة برؤية واضحة،',
        'وبناء الثقة،',
        'وتحقيق نتائج ملموسة.',
      ]
    : profile.statement

  const summary = isArabic
    ? 'مدير مبيعات يتمتع بخبرة مهنية تزيد عن عشر سنوات في إدارة المبيعات والعمليات داخل المملكة العربية السعودية، مع التركيز على تطوير الأعمال وبناء علاقات قوية مع العملاء وقيادة الفرق لتحقيق أهداف العمل.'
    : profile.summary

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.st-line .inner').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 115, rotate: isArabic ? -2 : 2 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el.parentElement,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      gsap.from('.st-rule', {
        scaleX: 0,
        transformOrigin: isArabic ? 'right center' : 'left center',
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.st-rule',
          start: 'top 90%',
        },
      })

      gsap.from('.st-profile', {
        y: 30,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.st-profile',
          start: 'top 88%',
        },
      })
    }, root)

    return () => ctx.revert()
  }, [isArabic])

  return (
    <section
      id="profile"
      ref={root}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative z-20 -mt-[28vh] bg-[var(--page-bg)] px-6 pb-32 pt-[42vh] text-[var(--text-primary)] md:px-12 md:pb-48"
      style={{
        background:
          'linear-gradient(to bottom, transparent 0, var(--page-bg) 34vh)',
      }}
    >
      <p className="eyebrow">
        {isArabic ? '٠١ — الملف التنفيذي' : '01 — Executive Statement'}
      </p>

      <blockquote
        className={`mt-10 font-display text-[clamp(1.9rem,6.2vw,6.6rem)] font-bold leading-[1.04] tracking-[-0.02em] text-[var(--text-primary)] md:mt-14 ${
          isArabic ? 'text-right leading-[1.5]' : 'text-left'
        }`}
      >
        {statement.map((line, i) => (
          <Line key={`${language}-${i}`} text={line} isArabic={isArabic} />
        ))}
      </blockquote>

      <div
        className="st-rule mt-16 h-px w-full md:mt-24"
        style={{
          background: isArabic
            ? 'linear-gradient(to left, var(--accent), var(--border-color), transparent)'
            : 'linear-gradient(to right, var(--accent), var(--border-color), transparent)',
        }}
      />

      <div className="mt-10 grid gap-8 md:grid-cols-12">
        <p
          className={`st-profile text-[11px] font-semibold tracking-[0.25em] text-[var(--text-muted)] md:col-span-4 ${
            isArabic ? 'text-right' : 'text-left tracking-[0.4em]'
          }`}
        >
          {isArabic ? 'الملف الشخصي' : 'PROFILE'}
        </p>

        <p
          className={`st-profile max-w-2xl text-lg leading-relaxed text-[var(--text-muted)] md:col-span-8 md:text-2xl md:leading-[1.6] ${
            isArabic ? 'text-right' : 'text-left'
          }`}
        >
          {summary}
        </p>
      </div>
    </section>
  )
}
