import portrait from '../assets/portrait.jpg'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/gsap'
import Scene3D from './Scene3D'
import { profile } from '../data/profile'

function PortraitPlaceholder() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-end bg-coal">
      <svg
        viewBox="0 0 300 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ph-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b1b1b" />
            <stop offset="1" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>

        <circle
          cx="150"
          cy="140"
          r="52"
          fill="url(#ph-body)"
          stroke="#C9A227"
          strokeOpacity="0.35"
        />

        <path
          d="M30 400 C30 300 90 262 150 262 C210 262 270 300 270 400 Z"
          fill="url(#ph-body)"
          stroke="#C9A227"
          strokeOpacity="0.35"
        />

        <line
          x1="150"
          y1="262"
          x2="150"
          y2="400"
          stroke="#C9A227"
          strokeOpacity="0.15"
        />
      </svg>

      <p className="relative z-10 mb-4 text-center text-[9px] font-semibold uppercase leading-relaxed tracking-[0.4em] text-gold/80 md:mb-6 md:text-[10px]">
        Portrait
        <br />
        <span className="text-white/35">to be added</span>
      </p>
    </div>
  )
}

export default function Hero() {
  const root = useRef(null)
  const sceneWrap = useRef(null)
  const content = useRef(null)
  const nameRef = useRef(null)
  const portraitRef = useRef(null)
  const portraitPar = useRef(null)
  const input = useRef({
    mouse: { x: 0, y: 0 },
    scroll: 0,
  })

  const [active, setActive] = useState(true)

  // Intro + scroll choreography
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      })

      tl.from(
        '.hero-line .inner',
        {
          yPercent: 110,
          duration: 1.3,
          stagger: 0.12,
        },
        0.2,
      )
        .from(
          '.hero-fade',
          {
            y: 18,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
          },
          '-=0.7',
        )
        .from(
          portraitRef.current,
          {
            opacity: 0,
            scale: 0.96,
            duration: 1.4,
          },
          0.4,
        )

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
              input.current.scroll = self.progress
            },
          },
        })
        .to(
          content.current,
          {
            scale: 0.9,
            opacity: 0,
            y: -70,
            transformOrigin: '50% 40%',
            ease: 'none',
          },
          0,
        )
        .to(
          sceneWrap.current,
          {
            scale: 1.12,
            opacity: 0.25,
            ease: 'none',
          },
          0,
        )
    }, root)

    return () => ctx.revert()
  }, [])

  // Subtle mouse parallax (desktop only)
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) {
      return undefined
    }

    const nameX = gsap.quickTo(nameRef.current, 'x', {
      duration: 1.2,
      ease: 'power3.out',
    })

    const nameY = gsap.quickTo(nameRef.current, 'y', {
      duration: 1.2,
      ease: 'power3.out',
    })

    const pX = gsap.quickTo(portraitPar.current, 'x', {
      duration: 1.4,
      ease: 'power3.out',
    })

    const pY = gsap.quickTo(portraitPar.current, 'y', {
      duration: 1.4,
      ease: 'power3.out',
    })

    const pR = gsap.quickTo(portraitPar.current, 'rotationY', {
      duration: 1.4,
      ease: 'power3.out',
    })

    gsap.set(portraitPar.current, {
      transformPerspective: 900,
    })

    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1

      input.current.mouse.x = nx
      input.current.mouse.y = -ny

      nameX(nx * -10)
      nameY(ny * -6)

      pX(nx * 16)
      pY(ny * 10)
      pR(nx * 3)
    }

    window.addEventListener('mousemove', onMove, {
      passive: true,
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  // Pause WebGL when the hero is off screen
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      {
        threshold: 0,
      },
    )

    io.observe(root.current)

    return () => io.disconnect()
  }, [])

  return (
    <section
      id="top"
      ref={root}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink"
    >
      <div ref={sceneWrap} className="absolute inset-0">
        <Scene3D input={input} active={active} />
      </div>

      <div className="hero-vignette pointer-events-none absolute inset-0" />

      <div
        ref={content}
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-8 pt-24 md:px-12 md:pb-10"
      >
        {/* Top-left editorial label */}
        <div className="hero-fade absolute left-6 top-24 md:left-12 md:top-28">
          <p className="eyebrow">Executive Profile</p>

          <p className="mt-2 text-[10px] tracking-[0.35em] text-white/35">
            24.47° N · 39.61° E
          </p>
        </div>

        {/* Portrait */}
        <div
          ref={portraitRef}
          className="absolute right-6 top-[17svh] z-[5] w-[40vw] max-w-[190px] md:right-[7vw] md:top-[14svh] md:w-[24vw] md:max-w-[400px]"
        >
          <div
            ref={portraitPar}
            className="relative aspect-[3/4] w-full will-change-transform"
          >
            <div className="absolute inset-0 translate-x-3 translate-y-3 border border-gold/25 md:translate-x-5 md:translate-y-5" />

            <div className="relative h-full w-full overflow-hidden border border-gold/40 bg-coal shadow-gold">
              <img
                src={portrait}
                alt={profile.name}
                className="h-full w-full object-cover"
              />

              <div className="portrait-light pointer-events-none absolute inset-0" />
            </div>

            <span className="absolute -left-2 -top-2 h-4 w-4 border-l border-t border-gold" />
            <span className="absolute -right-2 -top-2 h-4 w-4 border-r border-t border-gold" />
          </div>
        </div>

        {/* Name */}
        <div ref={nameRef} className="relative z-10">
          <h1 className="name-xl font-display font-extrabold leading-[0.9] tracking-[-0.03em] text-paper">
            <span className="hero-line block overflow-hidden">
              <span className="inner block">
                {profile.first}
              </span>
            </span>

            <span className="hero-line block overflow-hidden text-gold md:pl-[8vw]">
              <span className="inner block">
                {profile.middle}
              </span>
            </span>

            <span className="hero-line block overflow-hidden">
              <span className="inner block">
                {profile.last}
              </span>
            </span>
          </h1>
        </div>

        {/* Role / place / experience */}
        <div className="hero-fade mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-gold md:w-16" />

              <p className="text-sm font-semibold tracking-[0.45em] text-paper md:text-lg">
                SALES MANAGER
              </p>
            </div>

            <p className="mt-3 pl-14 text-[11px] tracking-[0.4em] text-white/45 md:pl-20">
              MADINAH · SAUDI ARABIA
            </p>
          </div>

          <p className="max-w-[18rem] text-[11px] leading-relaxed tracking-[0.35em] text-white/45 md:text-right">
            <span className="mr-2 font-display text-2xl tracking-normal text-gold">
              10+
            </span>
            YEARS OF PROFESSIONAL EXPERIENCE
          </p>
        </div>

        {/* Scroll cue */}
        <div className="hero-fade pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.4em] text-white/40 md:flex">
          SCROLL

          <ArrowDown
            size={14}
            className="animate-cue"
          />
        </div>
      </div>
    </section>
  )
}