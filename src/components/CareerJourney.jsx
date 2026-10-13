
import { useLayoutEffect, useRef } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { profile } from '../data/profile'
import { useSitePreferences } from '../context/SitePreferences'

const arabicCareer = {
  eyebrow: '٠٢ — المسيرة المهنية',
  title: 'المسيرة',
  titleAccent: 'المهنية',
  description:
    'من قيادة العمليات إلى قيادة المبيعات، أكثر من عشر سنوات من الخبرة عبر ثلاثة مناصب إدارية في المدينة المنورة.',
  scroll: 'مرّر لاستكشاف المسيرة',
  stage: 'المرحلة',
  current: 'المنصب الحالي',
  years: 'سنوات',
  start: 'البداية',
  roles: {
    'Al-Najm Al-Samawi': 'النجم السماوي',
    'Al Andalus Hotel': 'فندق الأندلس',
    'Al-Dagal Waste Transportation & Contracting':
      'الدقل للنقل والمقاولات',
  },
  jobTitles: {
    'Operations Manager': 'مدير العمليات',
    'Sales Manager': 'مدير المبيعات',
  },
  locations: {
    'Madinah, Saudi Arabia': 'المدينة المنورة، المملكة العربية السعودية',
    Madinah: 'المدينة المنورة',
  },
}

const arabicCompaniesByNumber = {
  '01': 'النجم السماوي',
  '02': 'فندق الأندلس',
  '03': 'الدقل للنقل والمقاولات',
}

export default function CareerJourney() {
  const { language } = useSitePreferences()
  const isArabic = language === 'ar'

  const section = useRef(null)
  const track = useRef(null)
  const bar = useRef(null)
  const vline = useRef(null)

  const getText = (value, translations = {}) =>
    isArabic ? translations[value] || value : value

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const getDist = () =>
        Math.max(0, track.current.scrollWidth - window.innerWidth)

      const tween = gsap.to(track.current, {
        x: () => (isArabic ? getDist() : -getDist()),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + getDist(),
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      gsap.fromTo(
        bar.current,
        { scaleX: isArabic ? 1 : 0 },
        {
          scaleX: isArabic ? 0 : 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => '+=' + getDist(),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )

      gsap.utils.toArray('.career-num').forEach((el) => {
        gsap.fromTo(
          el,
          { x: isArabic ? -80 : 80 },
          {
            x: isArabic ? 120 : -120,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('.career-panel'),
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })

      gsap.utils.toArray('.career-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 1, x: isArabic ? -60 : 60 },
          {
            opacity: 1,
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('.career-panel'),
              containerAnimation: tween,
              start: 'left 85%',
              end: 'left 35%',
              scrub: true,
            },
          },
        )
      })
    })

    mm.add('(max-width: 767px)', () => {
      gsap.fromTo(
        vline.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: track.current,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: true,
          },
        },
      )

      gsap.utils.toArray('.career-reveal').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        })
      })
    })

    return () => mm.revert()
  }, [isArabic])

  return (
    <div id="career" dir={isArabic ? 'rtl' : 'ltr'}>
      <section
        ref={section}
        className="relative overflow-hidden bg-[var(--page-bg)] md:h-screen"
      >
        <div
          ref={track}
          className={`relative flex flex-col md:h-full md:w-max md:flex-row md:items-stretch ${
            isArabic ? 'md:flex-row-reverse' : ''
          }`}
        >
          {/* Mobile vertical timeline */}
          <div
            className={`absolute bottom-0 top-0 w-px bg-[var(--border-color)] md:hidden ${
              isArabic ? 'right-6' : 'left-6'
            }`}
            aria-hidden="true"
          >
            <div
              ref={vline}
              className="h-full w-full origin-top bg-[var(--accent)]"
            />
          </div>

          {/* Intro panel */}
          <div
            className={`career-panel relative flex shrink-0 flex-col justify-center px-6 py-24 md:h-full md:w-screen md:px-[8vw] md:py-0 ${
              isArabic ? 'pr-16 text-right' : 'pl-16 text-left'
            }`}
          >
            <p className="eyebrow">
              {isArabic ? arabicCareer.eyebrow : '02 — Career Journey'}
            </p>

            <h2 className="career-reveal mt-6 font-display text-[clamp(3rem,13vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-[var(--text-primary)] md:text-[9vw]">
              {isArabic ? (
                <>
                  <span className="block">{arabicCareer.title}</span>
                  <span className="block text-[var(--accent)]">
                    {arabicCareer.titleAccent}
                  </span>
                </>
              ) : (
                <>
                  THE
                  <br />
                  <span className="text-[var(--accent)]">JOURNEY</span>
                </>
              )}
            </h2>

            <p className="career-reveal mt-8 max-w-md text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
              {isArabic
                ? arabicCareer.description
                : 'From operations leadership to sales leadership — more than ten years across three management roles in Madinah.'}
            </p>

            <p className="mt-12 hidden items-center gap-3 text-[11px] tracking-[0.2em] text-[var(--text-muted)] md:flex">
              {isArabic ? (
                <>
                  <ArrowRight size={14} className="rotate-180" />
                  {arabicCareer.scroll}
                </>
              ) : (
                <>
                  SCROLL TO MOVE THROUGH TIME <ArrowRight size={14} />
                </>
              )}
            </p>
          </div>

          {/* Career scenes */}
          {profile.career.map((s) => (
            <article
              key={s.no}
              className={`career-panel relative flex shrink-0 items-center px-6 py-20 md:h-full md:px-[8vw] md:py-0 ${
                isArabic ? 'pr-16' : 'pl-16'
              } ${s.current ? 'md:w-[140vw]' : 'md:w-screen'}`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-24 h-2 w-2 bg-[var(--accent)] md:hidden ${
                  isArabic ? 'right-[22px]' : 'left-[22px]'
                }`}
              />

              <span
                aria-hidden="true"
                className={`career-num pointer-events-none absolute top-6 select-none font-display text-[34vw] font-extrabold leading-none md:top-[calc(50%-25vh)] md:text-[50vh] ${
                  isArabic
                    ? 'left-4 md:right-[4vw] md:left-auto'
                    : 'right-4 md:left-[4vw] md:right-auto'
                } ${
                  s.current ? 'text-outline-gold' : 'text-outline'
                }`}
              >
                {s.no}
              </span>

              <div className="career-reveal relative z-10 w-full">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="eyebrow">
                    {isArabic
                      ? `${arabicCareer.stage} ${s.no}`
                      : `Stage ${s.no}`}
                  </span>

                  {s.current && (
                    <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-[var(--accent)]">
                      <span className="h-1.5 w-1.5 animate-pulse bg-[var(--accent)]" />
                      {isArabic
                        ? arabicCareer.current
                        : 'CURRENT POSITION'}
                    </span>
                  )}
                </div>

                <h3
                  className={`mt-6 font-display font-extrabold leading-[1.1] tracking-[-0.02em] ${
                    s.current
                      ? 'text-[clamp(2.6rem,12vw,4.5rem)] text-[var(--accent)] md:text-[11vw]'
                      : 'text-[clamp(2.4rem,9vw,3.5rem)] text-[var(--text-primary)] md:text-[7.2vw]'
                  }`}
                >
                  {isArabic ? (
                    <span className="block">
                      {arabicCompaniesByNumber[s.no] ||
                        getText(s.company, arabicCareer.roles) ||
                        s.lines?.join(' ')}
                    </span>
                  ) : (
                    s.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))
                  )}
                </h3>

                <p
                  className={`mt-6 text-[var(--text-primary)] md:mt-8 ${
                    s.current
                      ? 'text-lg md:text-[2.2vw]'
                      : 'text-lg md:text-[1.8vw]'
                  }`}
                >
                  {getText(s.role, arabicCareer.jobTitles)}
                </p>

                <div
                  className={`mt-8 flex items-end gap-4 md:mt-10 ${
                    isArabic ? 'flex-row-reverse justify-end' : ''
                  }`}
                >
                  <span
                    className={`font-display text-[5.5rem] font-extrabold leading-[0.8] ${
                      s.current
                        ? 'text-[var(--accent)] md:text-[12vw]'
                        : 'text-[var(--text-primary)] md:text-[9vw]'
                    }`}
                    dir="ltr"
                  >
                    {s.years}
                  </span>

                  <span className="pb-2 text-xs font-semibold tracking-[0.15em] text-[var(--text-muted)] md:pb-4 md:text-sm">
                    {isArabic ? arabicCareer.years : 'YEARS'}
                  </span>
                </div>

                <p
                  className={`mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] ${
                    isArabic ? 'flex-row-reverse justify-end' : ''
                  }`}
                >
                  <MapPin
                    size={14}
                    className="shrink-0 text-[var(--accent)]"
                  />
                  {getText(s.location, arabicCareer.locations)}
                </p>
              </div>

              {!s.current && (
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-1/2 hidden items-center gap-3 text-[var(--accent)]/60 md:flex ${
                    isArabic ? 'left-[4vw] flex-row-reverse' : 'right-[4vw]'
                  }`}
                >
                  <span className="h-px w-20 bg-[var(--accent)]/40" />
                  <ArrowRight
                    size={16}
                    className={isArabic ? 'rotate-180' : ''}
                  />
                </span>
              )}
            </article>
          ))}
        </div>

        {/* Desktop progress rail */}
        <div
          className="pointer-events-none absolute inset-x-[8vw] bottom-10 hidden md:block"
          aria-hidden="true"
        >
          <div className="mb-3 flex justify-between text-[10px] tracking-[0.2em] text-[var(--text-muted)]">
            <span>{isArabic ? arabicCareer.start : 'START'}</span>

            {profile.career.map((s) => (
              <span
                key={s.no}
                className={s.current ? 'text-[var(--accent)]' : ''}
              >
                {s.no}
              </span>
            ))}
          </div>

          <div className="h-px w-full bg-[var(--border-color)]">
            <div
              ref={bar}
              className={`h-full bg-[var(--accent)] ${
                isArabic ? 'origin-right' : 'origin-left'
              }`}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
