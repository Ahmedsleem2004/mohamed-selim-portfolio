
import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { profile } from '../data/profile'
import { useSitePreferences } from '../context/SitePreferences'

function Row({
  icon: Icon,
  label,
  value,
  href,
  placeholder,
  external = false,
  isArabic,
}) {
  const inner = (
    <>
      <span
        className={`flex items-center gap-4 ${
          isArabic ? 'flex-row-reverse' : ''
        }`}
      >
        <Icon size={18} className="shrink-0 text-[var(--accent)]" />

        <span className="text-[11px] font-semibold tracking-[0.15em] text-[var(--text-muted)]">
          {label}
        </span>
      </span>

      <span
        className={`flex items-center gap-3 break-all text-lg md:text-2xl ${
          isArabic ? 'flex-row-reverse text-right' : ''
        }`}
      >
        {value ? (
          <span className="text-[var(--text-primary)]">{value}</span>
        ) : (
          <span className="italic text-[var(--text-muted)]">
            {placeholder}
          </span>
        )}

        {href && (
          <ArrowUpRight
            size={18}
            className={`shrink-0 text-[var(--accent)] ${
              isArabic ? '-rotate-90' : ''
            }`}
          />
        )}
      </span>
    </>
  )

  const cls =
    'ct-row flex flex-col gap-3 border-t border-[var(--border-color)] py-6 transition-colors duration-500 md:flex-row md:items-center md:justify-between'

  return href ? (
    <a
      href={href}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`${cls} hover:bg-[var(--border-color)]`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {inner}
    </a>
  ) : (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={cls}>
      {inner}
    </div>
  )
}

export default function Contact() {
  const root = useRef(null)
  const { language } = useSitePreferences()
  const isArabic = language === 'ar'

  const { email, phone, location } = profile.contact
  const whatsappNumber = phone?.replace(/\D/g, '')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ct-line .inner', {
        yPercent: 110,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.14,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 65%',
        },
      })

      gsap.from('.ct-fade', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.ct-info',
          start: 'top 85%',
        },
      })

      gsap.fromTo(
        '.ct-ring',
        { scale: 0.85, opacity: 0.3 },
        {
          scale: 1.1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [isArabic])

  return (
    <section
      id="contact"
      ref={root}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-[var(--page-bg)] px-6 pb-24 pt-32 text-[var(--text-primary)] md:px-12 md:pb-32 md:pt-48"
    >
      {/* Decorative rings */}
      <div
        aria-hidden="true"
        className={`ct-ring pointer-events-none absolute top-1/2 h-[80vw] w-[80vw] -translate-y-1/2 rounded-full border border-[var(--accent)]/15 ${
          isArabic ? '-left-[20vw]' : '-right-[20vw]'
        }`}
      >
        <div className="absolute inset-[12%] rounded-full border border-[var(--accent)]/10" />
        <div className="absolute inset-[26%] rounded-full border border-[var(--border-color)]" />
      </div>

      <div className="relative z-10">
        <p className="eyebrow">
          {isArabic ? '٠٨ — تواصل معي' : '08 — Contact'}
        </p>

        <h2 className="mt-10 font-display text-[clamp(2.4rem,10.4vw,12.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)]">
          {isArabic ? (
            <>
              <span className="ct-line block overflow-hidden">
                <span className="inner block">لنبنِ</span>
              </span>

              <span className="ct-line block overflow-hidden">
                <span className="inner block">
                  <span className="text-[var(--accent)]">
                    المستقبل معًا.
                  </span>
                </span>
              </span>
            </>
          ) : (
            <>
              <span className="ct-line block overflow-hidden">
                <span className="inner block">LET&apos;S BUILD</span>
              </span>

              <span className="ct-line block overflow-hidden">
                <span className="inner block">
                  WHAT&apos;S <span className="text-[var(--accent)]">NEXT.</span>
                </span>
              </span>
            </>
          )}
        </h2>

        <div className="ct-info mt-16 grid gap-16 md:mt-24 md:grid-cols-12">
          <div className="ct-fade md:col-span-5">
            <p className="font-display text-3xl font-extrabold md:text-4xl">
              {profile.name}
            </p>

            <p className="mt-3 text-[11px] font-semibold tracking-[0.15em] text-[var(--accent)]">
              {isArabic ? 'مدير المبيعات' : profile.title.toUpperCase()}
            </p>

            <p className="mt-2 text-[11px] tracking-[0.15em] text-[var(--text-muted)]">
              {isArabic
                ? 'المدينة المنورة، المملكة العربية السعودية'
                : profile.location.toUpperCase()}
            </p>
          </div>

          <div className="ct-fade md:col-span-7">
            <Row
              icon={Mail}
              label={isArabic ? 'البريد الإلكتروني' : 'Email'}
              value={email}
              href={email ? `mailto:${email}` : null}
              placeholder={
                isArabic
                  ? 'سيتم إضافة البريد الإلكتروني'
                  : 'Email address to be added'
              }
              isArabic={isArabic}
            />

            <Row
              icon={Phone}
              label={isArabic ? 'واتساب' : 'WhatsApp'}
              value={phone}
              href={
                whatsappNumber
                  ? `https://wa.me/${whatsappNumber}`
                  : null
              }
              external
              placeholder={
                isArabic
                  ? 'سيتم إضافة رقم الواتساب'
                  : 'WhatsApp number to be added'
              }
              isArabic={isArabic}
            />

            <Row
              icon={MapPin}
              label={isArabic ? 'الموقع' : 'Location'}
              value={isArabic ? 'المدينة المنورة، السعودية' : location}
              href={
                location
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
                  : null
              }
              external
              placeholder={
                isArabic ? 'سيتم إضافة الموقع' : 'Location to be added'
              }
              isArabic={isArabic}
            />

            <div className="border-t border-[var(--border-color)]" />
          </div>
        </div>
      </div>
    </section>
  )
}
