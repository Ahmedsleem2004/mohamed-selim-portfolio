import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { navLinks, profile } from '../data/profile'

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState('')
  const menuRef = useRef(null)
  const tlRef = useRef(null)
  const progressRef = useRef(null)

  const scrollTo = useCallback((target) => {
    gsap.to(window, { scrollTo: { y: target, autoKill: true }, duration: 1.4, ease: 'power3.inOut' })
  }, [])

  // Fullscreen mobile menu + page scroll progress line
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(menuRef.current, { clipPath: 'inset(0 0 100% 0)', visibility: 'hidden' })
      tlRef.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => gsap.set(menuRef.current, { visibility: 'hidden' }),
        })
        .set(menuRef.current, { visibility: 'visible' })
        .to(menuRef.current, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power4.inOut' })
        .from('.menu-link-inner', { yPercent: 110, stagger: 0.07, duration: 0.7, ease: 'power3.out' }, '-=0.3')
        .from('.menu-meta', { opacity: 0, y: 14, duration: 0.6, ease: 'power2.out' }, '-=0.4')

      gsap.set(progressRef.current, { scaleY: 0, transformOrigin: 'top' })
      gsap.to(progressRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      })
    }, menuRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    if (open) {
      document.body.style.overflow = 'hidden'
      tlRef.current.timeScale(1).play()
    } else {
      document.body.style.overflow = ''
      tlRef.current.timeScale(1.4).reverse()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Highlight the active section (created after all sections have mounted)
  useEffect(() => {
    const triggers = navLinks
      .map((l) => {
        const el = document.querySelector(l.target)
        if (!el) return null
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) setActiveId(l.target)
          },
        })
      })
      .filter(Boolean)
    return () => triggers.forEach((t) => t.kill())
  }, [])

  const go = (target) => {
    if (open) {
      setOpen(false)
      setTimeout(() => scrollTo(target), 450)
    } else {
      scrollTo(target)
    }
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            go(0)
          }}
          aria-label={`${profile.name} — back to top`}
          className="relative z-[60] font-display text-2xl font-extrabold leading-none tracking-tight text-paper"
        >
          S<span className="text-gold">.</span>
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <a
              key={l.target}
              href={l.target}
              onClick={(e) => {
                e.preventDefault()
                go(l.target)
              }}
              className={`group relative text-[11px] font-semibold tracking-[0.35em] transition-colors duration-500 ${
                activeId === l.target ? 'text-gold' : 'text-white/45 hover:text-paper'
              }`}
            >
              {l.label}
              <span
                className={`absolute -bottom-2 left-0 h-px bg-gold transition-all duration-500 ${
                  activeId === l.target ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="relative z-[60] text-[11px] font-semibold tracking-[0.35em] text-paper md:hidden"
        >
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </header>

      {/* Fullscreen mobile menu */}
      <div ref={menuRef} className="fixed inset-0 z-[55] flex flex-col justify-between bg-ink px-6 pb-10 pt-28 md:hidden">
        <ul className="space-y-2">
          {navLinks.map((l, i) => (
            <li key={l.target} className="overflow-hidden">
              <a
                href={l.target}
                onClick={(e) => {
                  e.preventDefault()
                  go(l.target)
                }}
                className="menu-link-inner flex items-baseline gap-4 py-1 font-display text-5xl font-extrabold leading-[1.05] text-paper"
              >
                <span className="font-sans text-[11px] font-semibold tracking-[0.3em] text-gold">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="menu-meta border-t border-white/10 pt-6">
          <p className="font-display text-xl font-bold">{profile.name}</p>
          <p className="mt-2 text-[11px] tracking-[0.35em] text-white/45">
            {profile.title.toUpperCase()} · MADINAH · SAUDI ARABIA
          </p>
        </div>
      </div>

      {/* Thin scroll progress line */}
      <div className="pointer-events-none fixed right-0 top-0 z-40 h-full w-px bg-white/[0.06]" aria-hidden="true">
        <div ref={progressRef} className="h-full w-full bg-gold" />
      </div>
    </>
  )
}