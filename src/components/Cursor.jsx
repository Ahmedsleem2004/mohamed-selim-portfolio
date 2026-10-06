import { useEffect, useRef } from 'react'
import { gsap, isFinePointer } from '../lib/gsap'

/** Very subtle gold cursor — desktop / fine pointers only. */
export default function Cursor() {
  const dot = useRef(null)

  useEffect(() => {
    if (!isFinePointer()) return undefined

    const el = dot.current
    document.documentElement.classList.add('has-custom-cursor')
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 })

    const moveX = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3' })
    const moveY = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3' })
    let shown = false

    const onMove = (e) => {
      moveX(e.clientX)
      moveY(e.clientY)
      if (!shown) {
        shown = true
        gsap.to(el, { opacity: 1, duration: 0.3 })
      }
    }
    const isInteractive = (target) => target && target.closest && target.closest('a, button, [data-cursor]')
    const onOver = (e) => {
      if (isInteractive(e.target)) {
        gsap.to(el, { scale: 3.4, backgroundColor: 'rgba(201,162,39,0.14)', duration: 0.35, ease: 'power3.out' })
      }
    }
    const onOut = (e) => {
      if (isInteractive(e.target)) {
        gsap.to(el, { scale: 1, backgroundColor: 'rgba(201,162,39,1)', duration: 0.35, ease: 'power3.out' })
      }
    }
    const onLeave = () => gsap.to(el, { opacity: 0, duration: 0.2 })
    const onEnter = () => shown && gsap.to(el, { opacity: 1, duration: 0.2 })

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-2.5 w-2.5 rounded-full border border-gold bg-gold opacity-0"
    />
  )
}