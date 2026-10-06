
import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const videoRef = useRef(null)
  const hasFinished = useRef(false)

  const [progress, setProgress] = useState(0)

  const finishLoader = () => {
    if (hasFinished.current) return

    hasFinished.current = true

    const video = videoRef.current

    if (video) {
      video.pause()
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.()
      },
    })

    /*
      ---------------------------------------------------------
      FINAL EXIT
      Everything disappears before the portfolio is revealed.
      This prevents the loader text from visually overlapping
      with the Hero text.
      ---------------------------------------------------------
    */

    tl.to(
      '.loader-word',
      {
        y: -35,
        opacity: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power3.in',
      },
      0,
    )

      .to(
        '.loader-role',
        {
          y: -15,
          opacity: 0,
          duration: 0.35,
          ease: 'power3.in',
        },
        0.05,
      )

      .to(
        '.loader-top',
        {
          opacity: 0,
          y: -10,
          duration: 0.3,
        },
        0,
      )

      .to(
        '.loader-progress',
        {
          opacity: 0,
          y: 15,
          duration: 0.35,
          ease: 'power2.in',
        },
        0,
      )

      .to(
        '.loader-video',
        {
          scale: 1.08,
          filter:
            'brightness(0.08) contrast(1.15) saturate(0.45)',
          duration: 0.8,
          ease: 'power3.inOut',
        },
        0,
      )

      .to(
        '.loader-dark',
        {
          opacity: 0.92,
          duration: 0.45,
        },
        0,
      )

      .to(
        loaderRef.current,
        {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.15,
          ease: 'power4.inOut',
        },
        0.35,
      )
  }

  useEffect(() => {
    const video = videoRef.current

    if (!video) return undefined

    let fallback

    const startVideo = () => {
      video.currentTime = 0

      const playPromise = video.play()

      if (playPromise?.catch) {
        playPromise.catch(() => {})
      }

      /*
        Safety fallback.
        Even if the browser doesn't fire video events correctly,
        the loader will still finish.
      */
      fallback = window.setTimeout(() => {
        setProgress(100)
        finishLoader()
      }, 6100)
    }

    const handleTimeUpdate = () => {
      if (!video.duration || Number.isNaN(video.duration)) {
        return
      }

      const value = Math.min(
        100,
        Math.round(
          (video.currentTime / video.duration) * 100,
        ),
      )

      setProgress(value)

      if (value >= 100) {
        finishLoader()
      }
    }

    const handleEnded = () => {
      setProgress(100)
      finishLoader()
    }

    video.addEventListener('loadedmetadata', startVideo)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener(
        'loadedmetadata',
        startVideo,
      )

      video.removeEventListener(
        'timeupdate',
        handleTimeUpdate,
      )

      video.removeEventListener(
        'ended',
        handleEnded,
      )

      if (fallback) {
        clearTimeout(fallback)
      }
    }
  }, [])

  /*
    Smooth progress animation
  */
  useEffect(() => {
    gsap.to('.loader-progress-fill', {
      width: `${progress}%`,
      duration: 0.3,
      ease: 'power2.out',
    })

    const number = document.querySelector(
      '.loader-number',
    )

    if (number) {
      gsap.to(number, {
        innerText: progress,
        duration: 0.25,
        ease: 'none',
        snap: {
          innerText: 1,
        },
        onUpdate: () => {
          number.innerText = String(
            Math.round(Number(number.innerText)),
          ).padStart(2, '0')
        },
      })
    }
  }, [progress])

  /*
    ---------------------------------------------------------
    INITIAL TEXT ANIMATION
    Words appear one after another.
    ---------------------------------------------------------
  */

  useEffect(() => {
    const intro = gsap.timeline({
      delay: 0.45,
    })

    intro
      .fromTo(
        '.loader-small-label',
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
        },
      )

      .fromTo(
        '.loader-word',
        {
          opacity: 0,
          y: 55,
          filter: 'blur(8px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.22,
          ease: 'power4.out',
        },
        '-=0.15',
      )

      .fromTo(
        '.loader-line',
        {
          scaleX: 0,
          transformOrigin: 'center',
        },
        {
          scaleX: 1,
          duration: 0.7,
          ease: 'power3.inOut',
        },
        '-=0.3',
      )

      .fromTo(
        '.loader-role',
        {
          opacity: 0,
          y: 18,
          letterSpacing: '0.8em',
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.5em',
          duration: 0.9,
          ease: 'power3.out',
        },
        '-=0.2',
      )

    return () => {
      intro.kill()
    }
  }, [])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] overflow-hidden bg-[#030303]"
      style={{
        clipPath: 'inset(0 0 0 0)',
      }}
    >
      {/* =====================================================
          VIDEO
      ====================================================== */}

      <video
        ref={videoRef}
        className="loader-video absolute inset-0 h-full w-full object-cover"
        src="/videos/isuzu-loader.mp4"
        muted
        playsInline
        preload="auto"
      />

      {/* =====================================================
          DARK CINEMATIC TREATMENT
      ====================================================== */}

      <div className="loader-dark absolute inset-0 bg-black/55" />

      {/* Left cinematic shadow */}
      <div
        className="absolute inset-y-0 left-0 w-[75%]"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,.94) 0%, rgba(0,0,0,.72) 38%, rgba(0,0,0,.25) 75%, transparent 100%)',
        }}
      />

      {/* Bottom shadow */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            'linear-gradient(0deg, rgba(0,0,0,.96) 0%, rgba(0,0,0,.6) 35%, transparent 100%)',
        }}
      />

      {/* Top shadow */}
      <div
        className="absolute inset-x-0 top-0 h-[30%]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,.8), transparent)',
        }}
      />

      {/* Strong vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, transparent 18%, rgba(0,0,0,.25) 48%, rgba(0,0,0,.9) 100%)',
        }}
      />

      {/* =====================================================
          GOLD LIGHT SWEEP
      ====================================================== */}

      <div
        className="pointer-events-none absolute -left-[40%] top-[-20%] h-[150%] w-[25%] opacity-[0.14]"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(201,162,39,.8), transparent)',
          transform: 'skewX(-18deg)',
          animation:
            'luxuryGoldSweep 5.5s ease-in-out infinite',
        }}
      />

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div className="loader-top absolute left-6 right-6 top-6 flex items-center justify-between md:left-12 md:right-12 md:top-9">
        <div className="flex items-center gap-3">
          <span className="h-px w-9 bg-[#C9A227] md:w-16" />

          <span className="text-[8px] uppercase tracking-[0.5em] text-white/45 md:text-[9px]">
            Executive Portfolio
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[8px] tracking-[0.35em] text-white/25">
            MADINAH
          </span>

          <span className="h-1 w-1 rounded-full bg-[#C9A227]" />

          <span className="text-[8px] tracking-[0.35em] text-white/25">
            2026
          </span>
        </div>
      </div>

      {/* =====================================================
          CENTER CONTENT
      ====================================================== */}

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="relative text-center">

          {/* Small label */}

          <div className="loader-small-label mb-7 flex items-center justify-center gap-4 opacity-0 md:mb-9">
            <span className="h-px w-8 bg-[#C9A227]/50 md:w-14" />

            <span className="text-[8px] uppercase tracking-[0.55em] text-[#C9A227] md:text-[9px]">
              Leadership · Sales · Operations
            </span>

            <span className="h-px w-8 bg-[#C9A227]/50 md:w-14" />
          </div>

          {/* =================================================
              NAME
              Each word appears separately.
          ================================================== */}

          <div
            className="font-serif uppercase"
            style={{
              fontFamily:
                'Georgia, "Times New Roman", serif',
            }}
          >
            <div className="loader-word overflow-hidden text-[clamp(3rem,8vw,7.5rem)] font-normal leading-[0.78] tracking-[-0.045em] text-white">
              MOHAMED
            </div>

            <div className="loader-word mt-2 overflow-hidden text-[clamp(3.5rem,9vw,8.5rem)] font-normal italic leading-[0.78] tracking-[-0.055em] text-[#C9A227]">
              SELIM
            </div>

            <div className="loader-word mt-2 overflow-hidden text-[clamp(2.8rem,7vw,6.8rem)] font-normal leading-[0.85] tracking-[-0.035em] text-white/90">
              ISMAIL
            </div>
          </div>

          {/* Gold divider */}

          <div className="loader-line mx-auto mt-8 h-px w-24 bg-[#C9A227] md:mt-10 md:w-40" />

          {/* Role */}

          <div className="loader-role mt-6 opacity-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.5em] text-white md:text-xs">
              SALES MANAGER
            </p>

            <p className="mt-3 text-[7px] uppercase tracking-[0.45em] text-white/35 md:text-[8px]">
              MADINAH · SAUDI ARABIA
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          PROGRESS
      ====================================================== */}

      <div className="loader-progress absolute bottom-7 left-6 right-6 md:bottom-10 md:left-12 md:right-12">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[7px] uppercase tracking-[0.55em] text-white/25">
              Loading Experience
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#C9A227]" />

              <span className="text-[7px] uppercase tracking-[0.4em] text-[#C9A227]/65">
                Preparing Portfolio
              </span>
            </div>
          </div>

          <div className="flex items-baseline">
            <span className="loader-number font-display text-3xl font-medium tracking-[-0.04em] text-white md:text-4xl">
              00
            </span>

            <span className="ml-1 text-xs text-[#C9A227]">
              %
            </span>
          </div>
        </div>

        {/* Progress bar */}

        <div className="relative h-px w-full overflow-hidden bg-white/[0.12]">
          <div
            className="loader-progress-fill absolute left-0 top-0 h-full w-0"
            style={{
              background:
                'linear-gradient(90deg, #7f6416, #C9A227, #fff)',
              boxShadow:
                '0 0 14px rgba(201,162,39,.8)',
            }}
          />
        </div>

        <div className="mt-2 flex justify-between">
          <span className="text-[6px] uppercase tracking-[0.5em] text-white/15">
            M.S.I
          </span>

          <span className="text-[6px] uppercase tracking-[0.5em] text-white/15">
            10+ YEARS
          </span>
        </div>
      </div>

      {/* =====================================================
          FILM GRAIN
      ====================================================== */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          mixBlendMode: 'screen',
        }}
      />

      {/* Cinematic frame */}

      <div className="pointer-events-none absolute inset-4 border border-white/[0.045] md:inset-7" />

      <style>{`
        @keyframes luxuryGoldSweep {
          0% {
            transform: translateX(-180%) skewX(-18deg);
            opacity: 0;
          }

          25% {
            opacity: 0.08;
          }

          50% {
            opacity: 0.18;
          }

          75% {
            opacity: 0.05;
          }

          100% {
            transform: translateX(520%) skewX(-18deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
