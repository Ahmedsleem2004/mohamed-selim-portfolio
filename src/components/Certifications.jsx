import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
  gsap,
  isFinePointer,
  prefersReducedMotion,
} from '../lib/gsap'
import { profile } from '../data/profile'
import { useSitePreferences } from '../context/SitePreferences'

import salesCertificate from '../assets/certificate-sales-management.jpeg'
import operationsCertificate from '../assets/certificate-operations-management.jpeg'
import oop from '../assets/oop.jpeg'

const certificates = [
  {
    ...profile.certificates[0],
    image: salesCertificate,
    title: 'Diploma in Sales Management',
    issuer: 'Alison',
    arabicTitle: 'دبلوم إدارة المبيعات',
    arabicIssuer: 'أليسون',
  },
  {
    ...profile.certificates[1],
    image: operationsCertificate,
    title: 'Diploma in Operations Management',
    issuer: 'Alison',
    arabicTitle: 'دبلوم إدارة العمليات',
    arabicIssuer: 'أليسون',
  },
  {
    ...profile.certificates[2],
    image: oop,
    title: 'Certificate of Appreciation — Community Service',
    issuer: 'Seven for Organization',
    arabicTitle: 'شهادة تقدير — خدمة المجتمع',
    arabicIssuer: 'Seven for Organization',
  },
]

const labels = {
  en: {
    view: 'View Certificate',
    viewer: 'Certificate viewer',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Reset zoom',
    close: 'Close',
    hint: 'Scroll or pinch to zoom · drag to move',
  },
  ar: {
    view: 'عرض الشهادة',
    viewer: 'عارض الشهادة',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    reset: 'إعادة الحجم',
    close: 'إغلاق',
    hint: 'مرّر العجلة أو اقرص للتكبير · اسحب للتحريك',
  },
}

/* ---------------------------- Inline icons ---------------------------- */
function Icon({ children, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const ViewIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
    <path d="M11 8v6M8 11h6" />
  </Icon>
)
const ZoomInIcon = () => (
  <Icon>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
  </Icon>
)
const ZoomOutIcon = () => (
  <Icon>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5M8 11h6" />
  </Icon>
)
const ResetIcon = () => (
  <Icon>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </Icon>
)
const CloseIcon = () => (
  <Icon>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
)

/* ------------------------------ Frame -------------------------------- */
function Frame({ item, offset, isArabic, onOpen }) {
  const el = useRef(null)
  const fine = isFinePointer() && !prefersReducedMotion()

  const title = isArabic ? item.arabicTitle : item.title
  const issuer = isArabic ? item.arabicIssuer : item.issuer
  const t = isArabic ? labels.ar : labels.en

  const onMove = (e) => {
    if (!fine || !el.current) return

    const r = el.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5

    gsap.to(el.current, {
      rotationY: nx * 8,
      rotationX: ny * -8,
      transformPerspective: 900,
      duration: 0.6,
      ease: 'power3.out',
    })
  }

  const onLeave = () => {
    if (!fine || !el.current) return

    gsap.to(el.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.9,
      ease: 'power3.out',
    })
  }

  return (
    <figure className={`ar-frame ${offset}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div
        ref={el}
        data-cursor
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={(e) => item.image && onOpen(item, e.currentTarget)}
        className={`relative aspect-[4/3] w-full overflow-hidden border border-[var(--border-color)] bg-[var(--surface-bg)] shadow-gold ${
          item.image ? 'cursor-zoom-in' : ''
        }`}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={title || `Certificate ${item.id}`}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute inset-3 border border-[var(--accent)]/20" />

            <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-[var(--accent)]" />
            <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-[var(--accent)]" />
            <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-[var(--accent)]" />
            <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-[var(--accent)]" />

            <p className="text-center text-[11px] font-semibold tracking-[0.25em] text-[var(--accent)]">
              {isArabic ? 'شهادة' : 'CERTIFICATE'}
            </p>

            <p className="text-outline-gold mt-2 font-display text-7xl font-extrabold leading-none md:text-8xl">
              {item.id}
            </p>

            <p className="absolute bottom-7 px-3 text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              {isArabic
                ? 'سيتم إضافة المستند'
                : 'Placeholder · document to be added'}
            </p>
          </div>
        )}
      </div>

      <figcaption
        className={`mt-4 flex items-start justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] ${
          isArabic ? 'text-right' : 'text-left'
        }`}
      >
        <span className="leading-relaxed">
          {title || (isArabic ? `الشهادة ${item.id}` : `Certificate ${item.id}`)}
        </span>

        <span className="shrink-0 text-[var(--accent)]">
          {issuer || '—'}
        </span>
      </figcaption>

      {item.image && (
        <button
          type="button"
          data-cursor
          onClick={(e) => onOpen(item, e.currentTarget)}
          aria-haspopup="dialog"
          aria-label={`${t.view}: ${title || item.id}`}
          className="mt-5 inline-flex min-h-[44px] items-center gap-3 border-b border-[var(--accent)] pb-1 text-[12px] font-semibold tracking-[0.12em] text-[var(--accent)] transition-opacity duration-300 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        >
          <ViewIcon className="h-4 w-4" />
          {t.view}
        </button>
      )}
    </figure>
  )
}

/* --------------------------- Certificate viewer ----------------------- */
const MIN_SCALE = 1
const MAX_SCALE = 6
const STEP = 1.4

function CertificateViewer({ item, isArabic, onClosed, triggerEl }) {
  const t = isArabic ? labels.ar : labels.en
  const title = isArabic ? item.arabicTitle : item.title
  const issuer = isArabic ? item.arabicIssuer : item.issuer

  const overlayRef = useRef(null)
  const stageRef = useRef(null)
  const imgRef = useRef(null)
  const frameRef = useRef(null)
  const closeBtnRef = useRef(null)
  const closingRef = useRef(false)

  const [view, setView] = useState({ s: 1, x: 0, y: 0, smooth: false })
  const viewRef = useRef(view)

  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const downOnBackdrop = useRef(false)
  const moved = useRef(false)

  /* ---- transform helpers ---- */
  const clampView = useCallback((s, x, y) => {
    const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
    if (ns <= MIN_SCALE) return { s: MIN_SCALE, x: 0, y: 0 }

    const stage = stageRef.current
    const img = imgRef.current
    if (!stage || !img) return { s: ns, x, y }

    const maxX = Math.max(0, (img.offsetWidth * ns - stage.clientWidth) / 2)
    const maxY = Math.max(0, (img.offsetHeight * ns - stage.clientHeight) / 2)

    return {
      s: ns,
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    }
  }, [])

  const apply = useCallback(
    (s, x, y, smooth = false) => {
      const next = { ...clampView(s, x, y), smooth }
      viewRef.current = next
      setView(next)
    },
    [clampView],
  )

  const rel = (clientX, clientY) => {
    const r = stageRef.current.getBoundingClientRect()
    return {
      x: clientX - (r.left + r.width / 2),
      y: clientY - (r.top + r.height / 2),
    }
  }

  const zoomAt = useCallback(
    (factor, cx = 0, cy = 0, smooth = false) => {
      const { s, x, y } = viewRef.current
      const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s * factor))
      const k = ns / s
      apply(ns, cx - (cx - x) * k, cy - (cy - y) * k, smooth)
    },
    [apply],
  )

  const resetZoom = useCallback(() => apply(1, 0, 0, true), [apply])

  /* ---- close with exit animation ---- */
  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true

    if (
      prefersReducedMotion() ||
      !overlayRef.current ||
      !frameRef.current
    ) {
      onClosed()
      return
    }

    gsap.to(frameRef.current, {
      scale: 0.94,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    })

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClosed,
    })
  }, [onClosed])

  /* ---- entry animation ---- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' },
      )

      gsap.fromTo(
        frameRef.current,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' },
      )
    }, overlayRef)

    return () => ctx.revert()
  }, [])

  /* ---- scroll lock, keyboard, focus ---- */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }

      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        zoomAt(STEP, 0, 0, true)
        return
      }

      if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        zoomAt(1 / STEP, 0, 0, true)
        return
      }

      if (e.key === '0') {
        e.preventDefault()
        resetZoom()
        return
      }

      if (e.key === 'Tab' && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll(
          'button:not([disabled])',
        )
        if (!focusable.length) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
      triggerEl?.focus?.()
    }
  }, [close, zoomAt, resetZoom, triggerEl])

  /* ---- mouse wheel (non-passive so the page never scrolls) ---- */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const onWheel = (e) => {
      e.preventDefault()
      const speed = e.ctrlKey ? 0.01 : 0.0018
      const p = rel(e.clientX, e.clientY)
      zoomAt(Math.exp(-e.deltaY * speed), p.x, p.y, false)
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  /* ---- pointer: drag + pinch ---- */
  const startGesture = () => {
    const pts = [...pointers.current.values()]
    const { s, x, y } = viewRef.current

    if (pts.length === 1) {
      gesture.current = { type: 'pan', px: pts[0].x, py: pts[0].y, x, y }
    } else if (pts.length >= 2) {
      const [a, b] = pts
      const mid = rel((a.x + b.x) / 2, (a.y + b.y) / 2)
      gesture.current = {
        type: 'pinch',
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        s,
        x,
        y,
        mid,
      }
    } else {
      gesture.current = null
    }
  }

  const onPointerDown = (e) => {
    downOnBackdrop.current =
      pointers.current.size === 0 &&
      !imgRef.current?.contains(e.target) &&
      e.target === e.currentTarget
    moved.current = false

    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    e.currentTarget.setPointerCapture?.(e.pointerId)
    startGesture()
  }

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    const g = gesture.current
    if (!g) return

    if (g.type === 'pan') {
      const dx = e.clientX - g.px
      const dy = e.clientY - g.py
      if (Math.abs(dx) + Math.abs(dy) > 5) moved.current = true
      if (viewRef.current.s > 1) apply(viewRef.current.s, g.x + dx, g.y + dy)
    } else if (g.type === 'pinch') {
      moved.current = true
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1
      const midNow = rel((a.x + b.x) / 2, (a.y + b.y) / 2)
      const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, g.s * (dist / g.dist)))
      const k = ns / g.s
      apply(
        ns,
        midNow.x - (g.mid.x - g.x) * k,
        midNow.y - (g.mid.y - g.y) * k,
      )
    }
  }

  const onPointerUp = (e) => {
    const wasOnly = pointers.current.size === 1
    pointers.current.delete(e.pointerId)
    e.currentTarget.releasePointerCapture?.(e.pointerId)

    if (wasOnly && downOnBackdrop.current && !moved.current) {
      close()
      return
    }

    startGesture()
  }

  const onDoubleClick = (e) => {
    if (!imgRef.current?.contains(e.target)) return
    if (viewRef.current.s > 1) {
      resetZoom()
    } else {
      const p = rel(e.clientX, e.clientY)
      zoomAt(2.5, p.x, p.y, true)
    }
  }

  const pct = Math.round(view.s * 100)
  const stop = (e) => e.stopPropagation()

  const controlBtn =
    'flex h-11 w-11 items-center justify-center text-[var(--text-primary)] transition-colors duration-300 hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)]'

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${t.viewer}: ${title || item.id}`}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
    >
      {/* Stage: handles wheel, drag, pinch, outside-click */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        className="absolute inset-0 select-none overflow-hidden"
        style={{
          touchAction: 'none',
          cursor: view.s > 1 ? 'grab' : 'default',
        }}
      >
        <div
          ref={frameRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 pb-28 pt-24 md:px-12"
        >
          <img
            ref={imgRef}
            src={item.image}
            alt={title || `Certificate ${item.id}`}
            draggable={false}
            decoding="async"
            className="pointer-events-auto block h-auto max-h-full w-auto max-w-full select-none border border-[var(--border-color)] object-contain shadow-[0_0_80px_rgba(201,162,39,0.18)]"
            style={{
              transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})`,
              transformOrigin: 'center center',
              transition: view.smooth ? 'transform 0.28s ease-out' : 'none',
              willChange: 'transform',
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div
        onPointerDown={stop}
        className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 md:p-6"
      >
        <div className="pointer-events-auto min-w-0 max-w-[70%]">
          <p className="truncate font-display text-base font-bold text-[var(--text-primary)] md:text-xl">
            {title}
          </p>
          <p className="mt-1 text-[11px] tracking-[0.12em] text-[var(--accent)]">
            {issuer}
          </p>
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          data-cursor
          onClick={close}
          aria-label={t.close}
          className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--border-color)] bg-black/50 text-[var(--text-primary)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Controls */}
      <div
        onPointerDown={stop}
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-4 md:p-6"
      >
        <div
          dir="ltr"
          role="group"
          aria-label={t.viewer}
          className="pointer-events-auto flex items-center border border-[var(--border-color)] bg-black/60 backdrop-blur"
        >
          <button
            type="button"
            data-cursor
            onClick={() => zoomAt(1 / STEP, 0, 0, true)}
            disabled={view.s <= MIN_SCALE}
            aria-label={t.zoomOut}
            title={t.zoomOut}
            className={controlBtn}
          >
            <ZoomOutIcon />
          </button>

          <span
            aria-live="polite"
            className="w-16 border-x border-[var(--border-color)] text-center text-[12px] font-semibold tracking-[0.1em] text-[var(--accent)]"
          >
            {pct}%
          </span>

          <button
            type="button"
            data-cursor
            onClick={() => zoomAt(STEP, 0, 0, true)}
            disabled={view.s >= MAX_SCALE}
            aria-label={t.zoomIn}
            title={t.zoomIn}
            className={controlBtn}
          >
            <ZoomInIcon />
          </button>

          <button
            type="button"
            data-cursor
            onClick={resetZoom}
            disabled={view.s === 1}
            aria-label={t.reset}
            title={t.reset}
            className={`${controlBtn} border-l border-[var(--border-color)]`}
          >
            <ResetIcon />
          </button>
        </div>

        <p className="hidden text-[11px] tracking-[0.1em] text-[var(--text-muted)] sm:block">
          {t.hint}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------ Section ------------------------------- */
export default function Certifications() {
  const root = useRef(null)
  const { language } = useSitePreferences()
  const isArabic = language === 'ar'

  const [active, setActive] = useState(null)
  const [triggerEl, setTriggerEl] = useState(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ar-head', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 70%',
        },
      })

      gsap.from('.ar-frame', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.ar-grid',
          start: 'top 80%',
        },
      })
    }, root)

    return () => ctx.revert()
  }, [isArabic])

  const offsets = ['', 'md:mt-24', 'md:mt-12']

  const openViewer = (item, el) => {
    setTriggerEl(el)
    setActive(item)
  }

  const closeViewer = useCallback(() => setActive(null), [])

  return (
    <section
      id="archive"
      ref={root}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative bg-[var(--page-bg)] px-6 py-32 text-[var(--text-primary)] md:px-12 md:py-48"
    >
      <p className="ar-head eyebrow">
        {isArabic ? '٠٦ — الشهادات' : '06 — Certifications'}
      </p>

      <h2 className="ar-head mt-6 font-display text-[clamp(2.4rem,8vw,7.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">
        {isArabic ? (
          <>
            <span className="block">المسيرة</span>
            <span className="block text-[var(--accent)]">
              المهنية
            </span>
          </>
        ) : (
          <>
            PROFESSIONAL
            <br />
            <span className="text-[var(--accent)]">
              ARCHIVE
            </span>
          </>
        )}
      </h2>

      <p className="ar-head mt-6 text-sm tracking-[0.08em] text-[var(--text-muted)] md:text-base">
        {isArabic
          ? 'الشهادات والمؤهلات المهنية'
          : 'Certifications & Qualifications'}
      </p>

      <div className="ar-grid mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8">
        {certificates.map((certificate, i) => (
          <Frame
            key={certificate.id}
            item={certificate}
            offset={offsets[i % offsets.length]}
            isArabic={isArabic}
            onOpen={openViewer}
          />
        ))}
      </div>

      {active &&
        createPortal(
          <CertificateViewer
            item={active}
            isArabic={isArabic}
            triggerEl={triggerEl}
            onClosed={closeViewer}
          />,
          document.body,
        )}
    </section>
  )
}
