import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export default function PreLoader({ onComplete }) {
  const rootRef = useRef(null)
  const anchorRef = useRef(null)
  const ringRef = useRef(null)
  const progressRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const anchor = anchorRef.current
    const ring = ringRef.current
    const progress = progressRef.current
    const glow = glowRef.current

    if (!root || !anchor || !ring || !progress || !glow) return

    const ctx = gsap.context(() => {
      gsap.set(root, {
        autoAlpha: 1,
      })

      gsap.set(anchor, {
        opacity: 0,
        scale: 0.55,
        y: 25,
        rotation: -8,
      })

      gsap.set(ring, {
        opacity: 0,
        scale: 0.7,
        rotation: -90,
      })

      gsap.set(progress, {
        scaleX: 0,
        transformOrigin: 'left center',
      })

      gsap.set(glow, {
        opacity: 0,
        scale: 0.5,
      })

      // Main intro
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.()
        },
      })

      tl.to(glow, {
        opacity: 0.7,
        scale: 1,
        duration: 0.55,
        ease: 'power2.out',
      })

        .to(
          ring,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.75,
            ease: 'power3.out',
          },
          '-=0.3',
        )

        .to(
          anchor,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            duration: 0.8,
            ease: 'power4.out',
          },
          '-=0.55',
        )

        .to(
          progress,
          {
            scaleX: 1,
            duration: 1.25,
            ease: 'power2.inOut',
          },
          '-=0.25',
        )

        // Small breathing movement
        .to(anchor, {
          y: -5,
          duration: 0.35,
          ease: 'sine.inOut',
        })

        .to(anchor, {
          y: 0,
          duration: 0.35,
          ease: 'sine.inOut',
        })

        // Exit
        .to(
          [anchor, ring, glow],
          {
            opacity: 0,
            scale: 1.08,
            duration: 0.38,
            ease: 'power3.in',
          },
          '+=0.05',
        )

        .to(
          root,
          {
            opacity: 0,
            duration: 0.32,
            ease: 'power2.inOut',
          },
          '-=0.18',
        )
    }, root)

    // Continuous ring rotation
    const spin = gsap.to(ring, {
      rotation: 360,
      duration: 2.4,
      repeat: -1,
      ease: 'none',
    })

    // Subtle glow pulse
    const pulse = gsap.to(glow, {
      scale: 1.12,
      opacity: 0.9,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    return () => {
      ctx.revert()
      spin.kill()
      pulse.kill()
    }
  }, [onComplete])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-[#030303]"
      aria-hidden="true"
    >
      {/* Cinematic vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(201,162,39,0.055) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.92) 100%)',
        }}
      />

      {/* Very subtle center light */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-72 w-72 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(201,162,39,0.16) 0%, rgba(201,162,39,0.045) 35%, transparent 72%)',
          filter: 'blur(12px)',
        }}
      />

      <div className="relative flex h-48 w-48 items-center justify-center">
        {/* Outer technical ring */}
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full border border-[#c9a227]/20"
        >
          {/* Gold moving point */}
          <span
            className="absolute left-1/2 top-[-3px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#c9a227]"
            style={{
              boxShadow: '0 0 12px rgba(201,162,39,0.8)',
            }}
          />

          {/* Secondary ring */}
          <span className="absolute inset-[10px] rounded-full border border-white/[0.035]" />

          {/* Small technical marks */}
          <span className="absolute left-1/2 top-[-8px] h-4 w-px -translate-x-1/2 bg-[#c9a227]/40" />
          <span className="absolute bottom-[-8px] left-1/2 h-4 w-px -translate-x-1/2 bg-[#c9a227]/20" />
          <span className="absolute left-[-8px] top-1/2 h-px w-4 -translate-y-1/2 bg-[#c9a227]/20" />
          <span className="absolute right-[-8px] top-1/2 h-px w-4 -translate-y-1/2 bg-[#c9a227]/20" />
        </div>

        {/* Anchor */}
        <div
          ref={anchorRef}
          className="relative flex items-center justify-center"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(201,162,39,0.18))',
          }}
        >
          <svg
            width="82"
            height="92"
            viewBox="0 0 82 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Crown */}
            <circle
              cx="41"
              cy="10"
              r="7"
              stroke="#c9a227"
              strokeWidth="1.8"
            />

            <circle
              cx="41"
              cy="10"
              r="2.2"
              fill="#c9a227"
            />

            {/* Vertical shaft */}
            <path
              d="M41 17V61"
              stroke="#c9a227"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Cross bar */}
            <path
              d="M25 30H57"
              stroke="#c9a227"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Left arm */}
            <path
              d="M41 61C41 61 31 61 23 54C17 49 15 42 15 35"
              stroke="#c9a227"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Right arm */}
            <path
              d="M41 61C41 61 51 61 59 54C65 49 67 42 67 35"
              stroke="#c9a227"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Left fluke */}
            <path
              d="M15 35L9 41"
              stroke="#c9a227"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            <path
              d="M15 35L21 41"
              stroke="#c9a227"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Right fluke */}
            <path
              d="M67 35L61 41"
              stroke="#c9a227"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            <path
              d="M67 35L73 41"
              stroke="#c9a227"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Bottom crown / base */}
            <path
              d="M31 66L41 78L51 66"
              stroke="#c9a227"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Tiny center detail */}
            <circle
              cx="41"
              cy="61"
              r="2"
              fill="#c9a227"
            />
          </svg>
        </div>
      </div>

      {/* Loading line */}
      <div className="absolute bottom-[17%] left-1/2 w-32 -translate-x-1/2">
        <div className="h-px w-full bg-white/[0.06]">
          <div
            ref={progressRef}
            className="h-px w-full bg-[#c9a227]"
            style={{
              boxShadow: '0 0 8px rgba(201,162,39,0.55)',
            }}
          />
        </div>
      </div>

      {/* Corner details */}
      <div className="absolute left-8 top-8 h-8 w-8 border-l border-t border-white/[0.06]" />
      <div className="absolute right-8 top-8 h-8 w-8 border-r border-t border-white/[0.06]" />
      <div className="absolute bottom-8 left-8 h-8 w-8 border-b border-l border-white/[0.06]" />
      <div className="absolute bottom-8 right-8 h-8 w-8 border-b border-r border-white/[0.06]" />
    </div>
  )
}