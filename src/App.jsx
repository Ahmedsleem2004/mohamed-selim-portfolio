
import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'

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
  const [loaderDone, setLoaderDone] = useState(false)

  const handleDone = useCallback(() => {
    setLoaderDone(true)
  }, [])

  // Always start from the top on a fresh page load
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.scrollTo(0, 0)
  }, [])

  // Refresh ScrollTrigger after fonts/images/page load
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

  // Refresh everything after loader disappears
  useEffect(() => {
    if (!loaderDone) return undefined

    const timer = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      window.scrollTo(0, 0)
    })

    return () => cancelAnimationFrame(timer)
  }, [loaderDone])

  return (
    <>
      {/* =====================================================
          PORTFOLIO
          The entire website exists behind the loader.
      ====================================================== */}

      <Cursor />

      <Navigation />

      <main className="relative">
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

      <Footer />

      {/* =====================================================
          LOADER
          Stays above the portfolio until it reaches 100%.
      ====================================================== */}

      {!loaderDone && (
        <Loader onComplete={handleDone} />
      )}

      {/* Global grain */}
      <div
        className="grain"
        aria-hidden="true"
      />
    </>
  )
}