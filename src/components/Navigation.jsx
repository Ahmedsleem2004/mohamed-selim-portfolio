
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { navLinks, profile } from '../data/profile'
import { useSitePreferences } from '../context/SitePreferences'
import { Sun, Moon, Languages } from 'lucide-react'

const arabicLabels = {
  PROFILE: 'الملف الشخصي',
  CAREER: 'المسيرة المهنية',
  EXPERTISE: 'الخبرات',
  ARCHIVE: 'الشهادات',
  CONTACT: 'تواصل معي',
}

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState('')
  const menuRef = useRef(null)
  const tlRef = useRef(null)
  const progressRef = useRef(null)

  const {
    language,
    theme,
    toggleLanguage,
    toggleTheme,
  } = useSitePreferences()

  const isArabic = language === 'ar'

  const scrollTo = useCallback((target) => {
    gsap.to(window, {
      scrollTo: { y: target, autoKill: true },
      duration: 1.4,
      ease: 'power3.inOut',
    })
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(menuRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        visibility: 'hidden',
      })

      tlRef.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () =>
            gsap.set(menuRef.current, { visibility: 'hidden' }),
        })
        .set(menuRef.current, { visibility: 'visible' })
        .to(menuRef.current, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.8,
          ease: 'power4.inOut',
        })
        .from(
          '.menu-link-inner',
          {
            yPercent: 110,
            stagger: 0.07,
            duration: 0.7,
            ease: 'power3.out',
          },
          '-=0.3',
        )
        .from(
          '.menu-meta',
          {
            opacity: 0,
            y: 14,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4',
        )

      gsap.set(progressRef.current, {
        scaleY: 0,
        transformOrigin: 'top',
      })

      gsap.to(progressRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: 0.3,
        },
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

  useEffect(() => {
    const triggers = navLinks
      .map((link) => {
        const element = document.querySelector(link.target)
        if (!element) return null

        return ScrollTrigger.create({
          trigger: element,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) setActiveId(link.target)
          },
        })
      })
      .filter(Boolean)

    return () => triggers.forEach((trigger) => trigger.kill())
  }, [])

  const go = (target) => {
    if (open) {
      setOpen(false)
      setTimeout(() => scrollTo(target), 450)
    } else {
      scrollTo(target)
    }
  }

  const getLabel = (link) =>
    isArabic
      ? arabicLabels[link.label] || link.label
      : link.label

  const controls = (
    <div className="relative z-[80] flex shrink-0 items-center gap-3 md:gap-4">
      <button
        type="button"
        onClick={toggleLanguage}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--surface-bg)] px-3 text-xs font-bold tracking-wider text-[var(--text-primary)] transition-colors hover:opacity-80"
        aria-label={isArabic ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
      >
        <Languages size={16} />
        {isArabic ? 'EN' : 'عربي'}
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--surface-bg)] text-[var(--text-primary)] transition-colors hover:opacity-80"
        aria-label={
          theme === 'dark'
            ? isArabic
              ? 'تفعيل الوضع الفاتح'
              : 'Enable light mode'
            : isArabic
              ? 'تفعيل الوضع الداكن'
              : 'Enable dark mode'
        }
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  )

  return (
    <>
      <header
        dir={isArabic ? 'rtl' : 'ltr'}
        className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-6 py-6 md:px-12 md:py-8"
      >
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault()
            go(0)
          }}
          aria-label={`${profile.name} — ${isArabic ? 'العودة إلى الأعلى' : 'back to top'}`}
          className="relative z-[80] shrink-0 font-display text-2xl font-extrabold leading-none tracking-tight text-[var(--text-primary)]"
        >
          S<span className="text-[var(--accent)]">.</span>
        </a>

        <nav
          className="hidden items-center gap-6 lg:gap-10 md:flex"
          aria-label={isArabic ? 'القائمة الرئيسية' : 'Primary navigation'}
        >
          {navLinks.map((link) => (
            <a
              key={link.target}
              href={link.target}
              onClick={(event) => {
                event.preventDefault()
                go(link.target)
              }}
              className={`group relative whitespace-nowrap text-[11px] font-semibold tracking-[0.12em] transition-colors duration-500 ${
                activeId === link.target
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {getLabel(link)}

              <span
                className={`absolute -bottom-2 ${isArabic ? 'right-0' : 'left-0'} h-px bg-[var(--accent)] transition-all duration-500 ${
                  activeId === link.target
                    ? 'w-full'
                    : 'w-0 group-hover:w-full'
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          {controls}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={
              open
                ? isArabic
                  ? 'إغلاق القائمة'
                  : 'Close menu'
                : isArabic
                  ? 'فتح القائمة'
                  : 'Open menu'
            }
            className="relative z-[80] text-[11px] font-semibold tracking-[0.15em] text-[var(--text-primary)] md:hidden"
          >
            {open
              ? isArabic
                ? 'إغلاق'
                : 'CLOSE'
              : isArabic
                ? 'القائمة'
                : 'MENU'}
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        dir={isArabic ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-[55] flex flex-col justify-between bg-[var(--page-bg)] px-6 pb-10 pt-28 md:hidden"
      >
        <ul className="space-y-2">
          {navLinks.map((link, index) => (
            <li key={link.target} className="overflow-hidden">
              <a
                href={link.target}
                onClick={(event) => {
                  event.preventDefault()
                  go(link.target)
                }}
                className="menu-link-inner flex items-baseline gap-4 py-2 font-display text-3xl font-extrabold leading-[1.3] text-[var(--text-primary)] sm:text-4xl"
              >
                <span className="font-sans text-[11px] font-semibold tracking-[0.15em] text-[var(--accent)]">
                  0{index + 1}
                </span>

                {getLabel(link)}
              </a>
            </li>
          ))}
        </ul>

        <div className="menu-meta border-t border-[var(--border-color)] pt-6">
          <p className="font-display text-xl font-bold text-[var(--text-primary)]">
            {isArabic ? 'محمد سليم إسماعيل' : profile.name}
          </p>

          <p className="mt-2 text-xs leading-7 text-[var(--text-muted)]">
            {isArabic
              ? 'مدير مبيعات · المدينة المنورة · المملكة العربية السعودية'
              : `${profile.title.toUpperCase()} · MADINAH · SAUDI ARABIA`}
          </p>
        </div>
      </div>

      <div
        className={`pointer-events-none fixed ${isArabic ? 'left-0' : 'right-0'} top-0 z-40 h-full w-px bg-[var(--border-color)]`}
        aria-hidden="true"
      >
        <div
          ref={progressRef}
          className="h-full w-full bg-[var(--accent)]"
        />
      </div>
    </>
  )
}
