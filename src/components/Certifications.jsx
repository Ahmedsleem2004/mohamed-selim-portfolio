
import { useLayoutEffect, useRef } from 'react'
import {
  gsap,
  isFinePointer,
  prefersReducedMotion,
} from '../lib/gsap'
import { profile } from '../data/profile'
import { useSitePreferences } from '../context/SitePreferences'

import salesCertificate from '../assets/certificate-sales-management.jpeg'
import operationsCertificate from '../assets/certificate-operations-management.jpeg'
import oop from '../assets/oop.jpeg'

const certificates = [
  {
    ...profile.certificates[0],
    image: salesCertificate,
    title: 'Diploma in Sales Management',
    issuer: 'Alison',
    arabicTitle: 'دبلوم إدارة المبيعات',
    arabicIssuer: 'أليسون',
  },
  {
    ...profile.certificates[1],
    image: operationsCertificate,
    title: 'Diploma in Operations Management',
    issuer: 'Alison',
    arabicTitle: 'دبلوم إدارة العمليات',
    arabicIssuer: 'أليسون',
  },
  {
    ...profile.certificates[2],
    image: oop,
    title: 'Certificate of Appreciation — Community Service',
    issuer: 'Seven for Organization',
    arabicTitle: 'شهادة تقدير — خدمة المجتمع',
    arabicIssuer: 'Seven for Organization',
  },
]

function Frame({ item, offset, isArabic }) {
  const el = useRef(null)
  const fine = isFinePointer() && !prefersReducedMotion()

  const title = isArabic ? item.arabicTitle : item.title
  const issuer = isArabic ? item.arabicIssuer : item.issuer

  const onMove = (e) => {
    if (!fine || !el.current) return

    const r = el.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5

    gsap.to(el.current, {
      rotationY: nx * 8,
      rotationX: ny * -8,
      transformPerspective: 900,
      duration: 0.6,
      ease: 'power3.out',
    })
  }

  const onLeave = () => {
    if (!fine || !el.current) return

    gsap.to(el.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.9,
      ease: 'power3.out',
    })
  }

  return (
    <figure className={`ar-frame ${offset}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div
        ref={el}
        data-cursor
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--border-color)] bg-[var(--surface-bg)] shadow-gold"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={title || `Certificate ${item.id}`}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute inset-3 border border-[var(--accent)]/20" />

            <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-[var(--accent)]" />
            <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-[var(--accent)]" />
            <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-[var(--accent)]" />
            <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-[var(--accent)]" />

            <p className="text-center text-[11px] font-semibold tracking-[0.25em] text-[var(--accent)]">
              {isArabic ? 'شهادة' : 'CERTIFICATE'}
            </p>

            <p className="text-outline-gold mt-2 font-display text-7xl font-extrabold leading-none md:text-8xl">
              {item.id}
            </p>

            <p className="absolute bottom-7 px-3 text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              {isArabic
                ? 'سيتم إضافة المستند'
                : 'Placeholder · document to be added'}
            </p>
          </div>
        )}
      </div>

      <figcaption
        className={`mt-4 flex items-start justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] ${
          isArabic ? 'text-right' : 'text-left'
        }`}
      >
        <span className="leading-relaxed">
          {title || (isArabic ? `الشهادة ${item.id}` : `Certificate ${item.id}`)}
        </span>

        <span className="shrink-0 text-[var(--accent)]">
          {issuer || '—'}
        </span>
      </figcaption>
    </figure>
  )
}

export default function Certifications() {
  const root = useRef(null)
  const { language } = useSitePreferences()
  const isArabic = language === 'ar'

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ar-head', {
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

      gsap.from('.ar-frame', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.ar-grid',
          start: 'top 80%',
        },
      })
    }, root)

    return () => ctx.revert()
  }, [isArabic])

  const offsets = ['', 'md:mt-24', 'md:mt-12']

  return (
    <section
      id="archive"
      ref={root}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative bg-[var(--page-bg)] px-6 py-32 text-[var(--text-primary)] md:px-12 md:py-48"
    >
      <p className="ar-head eyebrow">
        {isArabic ? '٠٦ — الشهادات' : '06 — Certifications'}
      </p>

      <h2 className="ar-head mt-6 font-display text-[clamp(2.4rem,8vw,7.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">
        {isArabic ? (
          <>
            <span className="block">المسيرة</span>
            <span className="block text-[var(--accent)]">
              المهنية
            </span>
          </>
        ) : (
          <>
            PROFESSIONAL
            <br />
            <span className="text-[var(--accent)]">
              ARCHIVE
            </span>
          </>
        )}
      </h2>

      <p className="ar-head mt-6 text-sm tracking-[0.08em] text-[var(--text-muted)] md:text-base">
        {isArabic
          ? 'الشهادات والمؤهلات المهنية'
          : 'Certifications & Qualifications'}
      </p>

      <div className="ar-grid mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8">
        {certificates.map((certificate, i) => (
          <Frame
            key={certificate.id}
            item={certificate}
            offset={offsets[i % offsets.length]}
            isArabic={isArabic}
          />
        ))}
      </div>
    </section>
  )
}
