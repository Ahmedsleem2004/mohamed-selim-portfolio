import { useLayoutEffect, useRef } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { profile } from '../data/profile'

export default function CareerJourney() {
  const section = useRef(null)
  const track = useRef(null)
  const bar = useRef(null)
  const vline = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    // Desktop / tablet: vertical scroll drives a pinned horizontal timeline
    mm.add('(min-width: 768px)', () => {
      const getDist = () => Math.max(0, track.current.scrollWidth - window.innerWidth)

      const tween = gsap.to(track.current, {
        x: () => -getDist(),
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
        { scaleX: 0 },
        {
          scaleX: 1,
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
          { x: 80 },
          {
            x: -120,
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
          { opacity: 0.1, x: 60 },
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

    // Mobile: the same story becomes a vertical cinematic sequence
    mm.add('(max-width: 767px)', () => {
      gsap.fromTo(
        vline.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: track.current, start: 'top 60%', end: 'bottom 60%', scrub: true },
        },
      )
      gsap.utils.toArray('.career-reveal').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <div id="career">
      <section ref={section} className="relative overflow-hidden bg-ink md:h-screen">
        <div ref={track} className="relative flex flex-col md:h-full md:w-max md:flex-row md:items-stretch">
          {/* Mobile vertical timeline */}
          <div className="absolute bottom-0 left-6 top-0 w-px bg-white/10 md:hidden" aria-hidden="true">
            <div ref={vline} className="h-full w-full origin-top bg-gold" />
          </div>

          {/* Intro panel */}
          <div className="career-panel relative flex shrink-0 flex-col justify-center px-6 py-24 pl-16 md:h-full md:w-screen md:px-[8vw] md:py-0">
            <p className="eyebrow">02 — Career Journey</p>
            <h2 className="career-reveal mt-6 font-display text-[clamp(3rem,13vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.02em] md:text-[9vw]">
              THE
              <br />
              <span className="text-gold">JOURNEY</span>
            </h2>
            <p className="career-reveal mt-8 max-w-md text-base leading-relaxed text-white/55 md:text-lg">
              From operations leadership to sales leadership — more than ten years across three management roles in
              Madinah.
            </p>
            <p className="mt-12 hidden items-center gap-3 text-[11px] tracking-[0.4em] text-white/40 md:flex">
              SCROLL TO MOVE THROUGH TIME <ArrowRight size={14} />
            </p>
          </div>

          {/* Career scenes */}
          {profile.career.map((s) => (
            <article
              key={s.no}
              className={`career-panel relative flex shrink-0 items-center px-6 py-20 pl-16 md:h-full md:px-[8vw] md:py-0 ${
                s.current ? 'md:w-[140vw]' : 'md:w-screen'
              }`}
            >
              <span className="absolute left-[22px] top-24 h-2 w-2 bg-gold md:hidden" aria-hidden="true" />

              <span
                aria-hidden="true"
                className={`career-num pointer-events-none absolute right-4 top-6 select-none font-display text-[34vw] font-extrabold leading-none md:left-[4vw] md:right-auto md:top-[calc(50%-25vh)] md:text-[50vh] ${
                  s.current ? 'text-outline-gold' : 'text-outline'
                }`}
              >
                {s.no}
              </span>

              <div className="career-reveal relative z-10">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="eyebrow">Stage {s.no}</span>
                  {s.current && (
                    <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.35em] text-gold">
                      <span className="h-1.5 w-1.5 animate-pulse bg-gold" />
                      CURRENT POSITION
                    </span>
                  )}
                </div>

                <h3
                  className={`mt-6 font-display font-extrabold leading-[0.9] tracking-[-0.02em] ${
                    s.current
                      ? 'text-[clamp(2.6rem,12vw,4.5rem)] text-gold md:text-[11vw]'
                      : 'text-[clamp(2.4rem,9vw,3.5rem)] text-paper md:text-[7.2vw]'
                  }`}
                >
                  {s.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </h3>

                <p className={`mt-6 text-lg text-paper md:mt-8 ${s.current ? 'md:text-[2.2vw]' : 'md:text-[1.8vw]'}`}>
                  {s.role}
                </p>

                <div className="mt-8 flex items-end gap-4 md:mt-10">
                  <span
                    className={`font-display font-extrabold leading-[0.8] ${
                      s.current ? 'text-gold md:text-[12vw]' : 'text-paper md:text-[9vw]'
                    } text-[5.5rem]`}
                  >
                    {s.years}
                  </span>
                  <span className="pb-2 text-xs font-semibold tracking-[0.45em] text-white/70 md:pb-4 md:text-sm">
                    YEARS
                  </span>
                </div>

                <p className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-white/45">
                  <MapPin size={14} className="text-gold" />
                  {s.location}
                </p>
              </div>

              {!s.current && (
                <span
                  className="pointer-events-none absolute right-[4vw] top-1/2 hidden items-center gap-3 text-gold/60 md:flex"
                  aria-hidden="true"
                >
                  <span className="h-px w-20 bg-gold/40" />
                  <ArrowRight size={16} />
                </span>
              )}
            </article>
          ))}
        </div>

        {/* Desktop progress rail with stage ticks */}
        <div className="pointer-events-none absolute inset-x-[8vw] bottom-10 hidden md:block" aria-hidden="true">
          <div className="mb-3 flex justify-between text-[10px] tracking-[0.35em] text-white/35">
            <span>START</span>
            {profile.career.map((s) => (
              <span key={s.no} className={s.current ? 'text-gold' : ''}>
                {s.no}
              </span>
            ))}
          </div>
          <div className="h-px w-full bg-white/10">
            <div ref={bar} className="h-full origin-left bg-gold" />
          </div>
        </div>
      </section>
    </div>
  )
}