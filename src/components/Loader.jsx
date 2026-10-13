
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const videoRef = useRef(null)
  const hasFinished = useRef(false)
  const progressRef = useRef(0)

  const [progress, setProgress] = useState(0)

  const finishLoader = useCallback(() => {
    if (hasFinished.current) return

    hasFinished.current = true

    const video = videoRef.current

    if (video) {
      video.pause()
    }

    const root = loaderRef.current

    if (!root) {
      onComplete?.()
      return
    }

    const tl = gsap.timeline({
      onComplete: () => onComplete?.(),
    })

    tl.to(
      root.querySelectorAll('.loader-word'),
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
        root.querySelector('.loader-role'),
        {
          y: -15,
          opacity: 0,
          duration: 0.35,
          ease: 'power3.in',
        },
        0.05,
      )
      .to(
        root.querySelector('.loader-top'),
        {
          opacity: 0,
          y: -10,
          duration: 0.3,
        },
        0,
      )
      .to(
        root.querySelector('.loader-progress'),
        {
          opacity: 0,
          y: 15,
          duration: 0.35,
          ease: 'power2.in',
        },
        0,
      )
      .to(
        root.querySelector('.loader-video'),
        {
          scale: 1.08,
          filter: 'brightness(0.08) contrast(1.15) saturate(0.45)',
          duration: 0.8,
          ease: 'power3.inOut',
        },
        0,
      )
      .to(
        root.querySelector('.loader-dark'),
        {
          opacity: 0.92,
          duration: 0.45,
        },
        0,
      )
      .to(
        root,
        {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.15,
          ease: 'power4.inOut',
        },
        0.35,
      )
  }, [onComplete])

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    let startTimer
    let stallTimer
    let started = false
    let attempting = false

    const clearStallTimer = () => {
      window.clearTimeout(stallTimer)
    }

    const handlePlaying = () => {
      started = true
      attempting = false

      window.clearTimeout(startTimer)
      clearStallTimer()
    }

    const handleWaiting = () => {
      if (!started || hasFinished.current) return

      clearStallTimer()

      stallTimer = window.setTimeout(() => {
        if (video.readyState < 3) {
          finishLoader()
        }
      }, 4000)
    }

    const startVideo = async () => {
      if (started || attempting || hasFinished.current) return

      attempting = true

      try {
        video.muted = true
        video.defaultMuted = true
        video.playsInline = true

        video.setAttribute('muted', '')
        video.setAttribute('playsinline', '')
        video.setAttribute('webkit-playsinline', '')

        const playPromise = video.play()

        if (playPromise) {
          await playPromise
        }

        started = true
        attempting = false
        window.clearTimeout(startTimer)
      } catch (error) {
        attempting = false

        console.warn('Loader video playback failed:', error)
      }
    }

    const handleTimeUpdate = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return
      }

      const nextProgress = Math.min(
        99,
        Math.floor((video.currentTime / video.duration) * 100),
      )

      if (nextProgress !== progressRef.current) {
        progressRef.current = nextProgress
        setProgress(nextProgress)
      }
    }

    const handleEnded = () => {
      progressRef.current = 100
      setProgress(100)
      finishLoader()
    }

    const handleError = () => {
      console.error('Loader video failed to load:', video.error)
      finishLoader()
    }

    // Support mobile browsers that require a user interaction.
    const handleUserInteraction = () => {
      if (!started && !hasFinished.current) {
        startVideo()
      }
    }

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = false

    video.addEventListener('playing', handlePlaying)
    video.addEventListener('loadeddata', startVideo)
    video.addEventListener('canplay', startVideo)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('stalled', handleWaiting)

    document.addEventListener('touchstart', handleUserInteraction, {
      passive: true,
    })
    document.addEventListener('click', handleUserInteraction)

    if (video.readyState >= 2) {
      startVideo()
    }

    // Retry after the video has had time to load.
    startTimer = window.setTimeout(() => {
      if (!started && !hasFinished.current) {
        startVideo()
      }

      // Prevent the loader from staying forever if playback is blocked.
      window.setTimeout(() => {
        if (!started && !hasFinished.current) {
          finishLoader()
        }
      }, 5000)
    }, 5000)

    return () => {
      window.clearTimeout(startTimer)
      clearStallTimer()

      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('loadeddata', startVideo)
      video.removeEventListener('canplay', startVideo)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('stalled', handleWaiting)

      document.removeEventListener('touchstart', handleUserInteraction)
      document.removeEventListener('click', handleUserInteraction)
    }
  }, [finishLoader])

  useEffect(() => {
    const root = loaderRef.current

    if (!root) return

    const words = root.querySelectorAll('.loader-word')
    const role = root.querySelector('.loader-role')
    const top = root.querySelector('.loader-top')
    const progressBar = root.querySelector('.loader-progress')
    const video = root.querySelector('.loader-video')

    gsap.set(words, { y: 35, opacity: 0 })
    gsap.set(role, { y: 15, opacity: 0 })
    gsap.set(top, { y: -10, opacity: 0 })
    gsap.set(progressBar, { y: 15, opacity: 0 })

    const intro = gsap.timeline()

    intro
      .to(
        top,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
        },
        0.2,
      )
      .to(
        words,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
        },
        0.35,
      )
      .to(
        role,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
        },
        0.65,
      )
      .to(
        progressBar,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.7,
      )

    if (video) {
      gsap.set(video, {
        scale: 1,
        filter: 'brightness(0.65) contrast(1.08) saturate(0.8)',
      })
    }

    return () => {
      intro.kill()
    }
  }, [])

  useEffect(() => {
    const bar = loaderRef.current?.querySelector('.loader-progress-bar')

    if (!bar) return

    gsap.to(bar, {
      width: `${progress}%`,
      duration: 0.25,
      ease: 'power1.out',
    })
  }, [progress])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] overflow-hidden bg-[#030303]"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      <video
        ref={videoRef}
        className="loader-video absolute inset-0 h-full w-full object-cover"
        src="/videos/isuzu-loader.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
      />

      <div className="loader-dark pointer-events-none absolute inset-0 bg-black/40" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:70px_70px]" />

      <div className="loader-top absolute left-6 right-6 top-6 z-10 flex items-center justify-between md:left-12 md:right-12 md:top-10">
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/60 md:text-xs">
          MADINAH · SAUDI ARABIA
        </span>

        <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 md:text-xs">
          PORTFOLIO
        </span>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
        <div className="mb-5 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#C9A227] md:w-12" />
          <span className="loader-role text-[9px] font-semibold uppercase tracking-[0.4em] text-[#E0BD3D] md:text-xs">
            EXECUTIVE LEADERSHIP
          </span>
          <span className="h-px w-8 bg-[#C9A227] md:w-12" />
        </div>

        <h1 className="flex flex-wrap items-center justify-center gap-x-3 text-3xl font-semibold uppercase tracking-[0.12em] text-white sm:text-4xl md:gap-x-4 md:text-6xl lg:text-7xl">
          <span className="loader-word inline-block">MOHAMED</span>
          <span className="loader-word inline-block text-[#C9A227]">SELIM</span>
          <span className="loader-word inline-block">ISMAIL</span>
        </h1>

        <div className="loader-progress mt-10 w-full max-w-[260px] md:max-w-[320px]">
          <div className="mb-3 flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-white/60">
            <span>Loading experience</span>
            <span>{String(progress).padStart(2, '0')}%</span>
          </div>

          <div className="h-[2px] w-full overflow-hidden bg-white/20">
            <div
              className="loader-progress-bar h-full w-0 bg-[#C9A227]"
              style={{ boxShadow: '0 0 12px rgba(201,162,39,0.6)' }}
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between md:bottom-10 md:left-12 md:right-12">
        <span className="text-[9px] uppercase tracking-[0.25em] text-white/50">
          STRATEGY · DEVELOPMENT · GROWTH
        </span>

        <span className="text-[9px] uppercase tracking-[0.25em] text-white/50">
          EST. 2021
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.7%22/%3E%3C/svg%3E')]" />
    </div>
  )
}
