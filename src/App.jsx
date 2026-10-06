import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'

import PreLoader from './components/PreLoader'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import ExecutiveStatement from './components/ExecutiveStatement'
import CareerJourney from './components/CareerJourney'
import CurrentRole from './components/CurrentRole'
import Expertise from './components/Expertise'
import Impact from './components/Impact'
import Certifications from './components/Certifications'
import Language from './components/Language'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  // 0 = Anchor PreLoader
  // 1 = Video Loader
  // 2 = Portfolio
  const [stage, setStage] = useState(0)

  const preLoaderDone = useCallback(() => {
    setStage(1)
  }, [])

  const videoLoaderDone = useCallback(() => {
    setStage(2)
  }, [])

  const loaderDone = stage === 2

  // Always start at top
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.scrollTo(0, 0)
  }, [])

  // Refresh ScrollTrigger when page resources are ready
  useEffect(() => {
    const refresh = () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }

    window.addEventListener('load', refresh)

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh)
    }

    return () => {
      window.removeEventListener('load', refresh)
    }
  }, [])

  // Refresh after final loader
  useEffect(() => {
    if (!loaderDone) return

    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh()
      window.scrollTo(0, 0)
    }, 100)

    return () => {
      window.clearTimeout(timer)
    }
  }, [loaderDone])

  return (
    <>
      {/* Cursor */}
      <div
        style={{
          visibility: loaderDone ? 'visible' : 'hidden',
        }}
      >
        <Cursor />
      </div>

      {/* Navigation */}
      <div
        style={{
          visibility: loaderDone ? 'visible' : 'hidden',
        }}
      >
        <Navigation />
      </div>

      {/* =========================
          PORTFOLIO
          Completely hidden until
          video loader is finished.
      ========================== */}
      <main
        className="relative"
        style={{
          visibility: loaderDone ? 'visible' : 'hidden',
        }}
      >
        <Hero introReady={loaderDone} />

        <ExecutiveStatement />

        <CareerJourney />

        <CurrentRole />

        <Expertise />

        <Impact />

        <Certifications />

        <Language />

        <Contact />
      </main>

      {/* Footer */}
      <div
        style={{
          visibility: loaderDone ? 'visible' : 'hidden',
        }}
      >
        <Footer />
      </div>

      {/* =========================
          STAGE 1
          Anchor PreLoader
      ========================== */}
      {stage === 0 && (
        <PreLoader
          onComplete={preLoaderDone}
        />
      )}

      {/* =========================
          STAGE 2
          Isuzu Video Loader
      ========================== */}
      {stage === 1 && (
        <Loader
          onComplete={videoLoaderDone}
        />
      )}

      {/* Grain */}
      <div
        className="grain"
        aria-hidden="true"
      />
    </>
  )
}