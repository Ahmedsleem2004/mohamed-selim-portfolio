
import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { profile } from '../data/profile'

function Row({ icon: Icon, label, value, href, placeholder, external = false }) {
  const inner = (
    <>
      <span className="flex items-center gap-4">
        <Icon size={18} className="text-gold" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/45">{label}</span>
      </span>

      <span className="flex items-center gap-3 text-lg md:text-2xl">
        {value ? (
          <span className="text-paper">{value}</span>
        ) : (
          <span className="italic text-white/30">{placeholder}</span>
        )}

        {href && <ArrowUpRight size={18} className="text-gold" />}
      </span>
    </>
  )

  const cls =
    'ct-row flex flex-col gap-3 border-t border-white/10 py-6 transition-colors duration-500 md:flex-row md:items-center md:justify-between'

  return href ? (
    <a
      href={href}
      className={`${cls} hover:bg-white/[0.02]`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

export default function Contact() {
  const root = useRef(null)
  const { email, phone, location } = profile.contact

  const whatsappNumber = phone?.replace(/\D/g, '')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ct-line .inner', {
        yPercent: 110,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.14,
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      })

      gsap.from('.ct-fade', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.ct-info', start: 'top 85%' },
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
  }, [])

  return (
    <section
      id="contact"
      ref={root}
      className="relative overflow-hidden bg-ink px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-48"
    >
      <div
        aria-hidden="true"
        className="ct-ring pointer-events-none absolute -right-[20vw] top-1/2 h-[80vw] w-[80vw] -translate-y-1/2 rounded-full border border-gold/15"
      >
        <div className="absolute inset-[12%] rounded-full border border-gold/10" />
        <div className="absolute inset-[26%] rounded-full border border-white/5" />
      </div>

      <div className="relative z-10">
        <p className="eyebrow">08 — Contact</p>

        <h2 className="mt-10 font-display text-[clamp(2.4rem,10.4vw,12.5rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-paper">
          <span className="ct-line block overflow-hidden">
            <span className="inner block">LET&apos;S BUILD</span>
          </span>

          <span className="ct-line block overflow-hidden">
            <span className="inner block">
              WHAT&apos;S <span className="text-gold">NEXT.</span>
            </span>
          </span>
        </h2>

        <div className="ct-info mt-16 grid gap-16 md:mt-24 md:grid-cols-12">
          <div className="ct-fade md:col-span-5">
            <p className="font-display text-3xl font-extrabold md:text-4xl">
              {profile.name}
            </p>

            <p className="mt-3 text-[11px] font-semibold tracking-[0.4em] text-gold">
              {profile.title.toUpperCase()}
            </p>

            <p className="mt-2 text-[11px] tracking-[0.4em] text-white/45">
              {profile.location.toUpperCase()}
            </p>
          </div>

          <div className="ct-fade md:col-span-7">
            <Row
              icon={Mail}
              label="Email"
              value={email}
              href={email ? `mailto:${email}` : null}
              placeholder="Email address to be added"
            />

            <Row
              icon={Phone}
              label="WhatsApp"
              value={phone}
              href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : null}
              external
              placeholder="WhatsApp number to be added"
            />

            <Row
              icon={MapPin}
              label="Location"
              value={location}
              href={
                location
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
                  : null
              }
              external
              placeholder="Location to be added"
            />

            <div className="border-t border-white/10" />
          </div>
        </div>
      </div>
    </section>
  )
}

