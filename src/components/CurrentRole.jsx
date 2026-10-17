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

const arabicAreas = {
  'Waste Transportation': 'نقل المخلفات',
  Contracting: 'المقاولات',
  Operations: 'إدارة العمليات',
  'Business Services': 'خدمات الأعمال',
}

/* ------------------------------------------------------------------ */
/* Service line icons (inline SVG, no new dependencies)                */
/* ------------------------------------------------------------------ */
const iconPaths = {
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  truck: (
    <>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </>
  ),
  shield: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  clipboard: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </>
  ),
}

function ServiceIcon({ name, className = 'h-7 w-7' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Service content (English primary, Arabic supported)                 */
/* ------------------------------------------------------------------ */
const services = [
  {
    id: 'environmental',
    icon: 'leaf',
    en: {
      title: 'Environmental Services & Public Cleanliness',
      summary:
        'Disciplined cleanliness and environmental care that keep public spaces orderly, healthy and welcoming.',
      overview:
        'Environmental services and public cleanliness form the visible foundation of a well-run city. This service line covers the routine cleaning and upkeep of public and commercial spaces, delivered with consistent standards, organized crews and dependable scheduling.',
      importance:
        'A clean environment protects public health, reduces pollution at its source and preserves the character of the places people live, work and visit. Reliable cleanliness services also prevent the build-up of waste that otherwise becomes a source of odors, pests and safety hazards.',
      field:
        'Work is carried out on the ground by organized teams following defined routes, schedules and quality checks, with supervisors verifying standards and responding quickly to changing site conditions.',
      impact:
        'Consistent cleanliness supports public health and safety, strengthens the experience of residents and visitors across the Madinah region, and contributes directly to a higher quality of life.',
    },
    ar: {
      title: 'الخدمات البيئية والنظافة العامة',
      summary:
        'نظافة منضبطة وعناية بيئية تحافظ على المساحات العامة منظمة وصحية ومرحِّبة.',
      overview:
        'تمثل الخدمات البيئية والنظافة العامة الأساس الظاهر لأي مدينة تُدار بكفاءة. يغطي هذا المسار أعمال التنظيف والصيانة الدورية للمساحات العامة والتجارية، بمعايير ثابتة وفرق منظمة وجدولة يمكن الاعتماد عليها.',
      importance:
        'تحمي البيئة النظيفة الصحة العامة وتقلل التلوث من مصدره وتحافظ على طابع الأماكن التي يعيش فيها الناس ويعملون ويزورونها. كما تمنع خدمات النظافة المنتظمة تراكم المخلفات التي تتحول إلى مصدر للروائح والآفات والمخاطر.',
      field:
        'تُنفَّذ الأعمال ميدانيًا عبر فرق منظمة تعمل وفق مسارات وجداول وفحوصات جودة محددة، مع مشرفين يتحققون من المعايير ويستجيبون سريعًا لتغيّر ظروف المواقع.',
      impact:
        'تدعم النظافة المستمرة الصحة والسلامة العامة، وتعزز تجربة السكان والزوار في منطقة المدينة المنورة، وتسهم مباشرة في رفع جودة الحياة.',
    },
  },
  {
    id: 'waste',
    icon: 'truck',
    en: {
      title: 'Waste Collection & Transportation',
      summary:
        'Organized collection and responsible transport of waste, planned for reliability, safety and compliance.',
      overview:
        'Waste collection and transportation is the operational link between the point of generation and responsible handling. The service depends on well-planned collection routes, suitable vehicles and equipment, and disciplined coordination from pickup to delivery.',
      importance:
        'Organized collection prevents accumulation, limits environmental contamination and keeps neighborhoods and commercial areas clean. Responsible transport, with correct handling, secure loading and adherence to applicable regulations, protects people, roads and the wider environment.',
      field:
        'Field work includes scheduled collection rounds, vehicle and fleet coordination, loading and transport supervision, and daily follow-up to keep service on time and on standard.',
      impact:
        'Reliable collection and transport safeguard public health, reduce environmental risk and keep communities in the Madinah region clean, safe and functioning smoothly.',
    },
    ar: {
      title: 'جمع ونقل النفايات',
      summary:
        'جمع منظم ونقل مسؤول للنفايات، بتخطيط يضمن الاعتمادية والسلامة والالتزام.',
      overview:
        'يمثل جمع ونقل النفايات حلقة الوصل التشغيلية بين مصدر النفايات والتعامل المسؤول معها. تعتمد الخدمة على مسارات جمع مخططة جيدًا، ومركبات ومعدات مناسبة، وتنسيق منضبط من الاستلام حتى التسليم.',
      importance:
        'يمنع الجمع المنظم تراكم المخلفات ويحد من التلوث البيئي ويحافظ على نظافة الأحياء والمناطق التجارية. ويحمي النقل المسؤول، بما يشمل التعامل الصحيح والتحميل الآمن والالتزام بالأنظمة المعمول بها، الناس والطرق والبيئة عمومًا.',
      field:
        'تشمل الأعمال الميدانية جولات جمع مجدولة، وتنسيق المركبات والأسطول، والإشراف على التحميل والنقل، ومتابعة يومية للحفاظ على التزام الخدمة بالوقت والمعيار.',
      impact:
        'يحمي الجمع والنقل الموثوقان الصحة العامة ويقللان المخاطر البيئية ويُبقيان المجتمعات في منطقة المدينة المنورة نظيفة وآمنة وتعمل بسلاسة.',
    },
  },
  {
    id: 'pest',
    icon: 'shield',
    en: {
      title: 'Pest Control & Prevention',
      summary:
        'Preventive, risk-aware pest management that limits infestations before they affect health and comfort.',
      overview:
        'Pest control is most effective when it is preventive rather than reactive. This service line focuses on inspection, early intervention and ongoing prevention to reduce the presence and spread of pests in residential, commercial and public settings.',
      importance:
        'Pests carry health risks, damage property and undermine hygiene. Prevention-led programs reduce the need for emergency treatment, limit spread across sites and support the broader goals of sanitation and environmental health.',
      field:
        'Field work involves site inspection, identifying risk points, applying appropriate treatments with close attention to safety, and follow-up visits to confirm that conditions remain under control.',
      impact:
        'Effective prevention protects health and safety, supports clean and comfortable environments, and improves quality of life for residents, workers and visitors in the Madinah region.',
    },
    ar: {
      title: 'مكافحة الحشرات والوقاية منها',
      summary:
        'إدارة وقائية للآفات تراعي المخاطر وتحد من الإصابات قبل أن تؤثر على الصحة والراحة.',
      overview:
        'تكون مكافحة الآفات أكثر فعالية عندما تقوم على الوقاية لا على رد الفعل. يركز هذا المسار على الفحص والتدخل المبكر والوقاية المستمرة للحد من وجود الآفات وانتشارها في البيئات السكنية والتجارية والعامة.',
      importance:
        'تحمل الآفات مخاطر صحية وتتلف الممتلكات وتضعف النظافة. وتقلل البرامج القائمة على الوقاية الحاجة إلى المعالجات الطارئة وتحد من الانتشار بين المواقع وتدعم أهداف الإصحاح والصحة البيئية.',
      field:
        'تشمل الأعمال الميدانية فحص المواقع وتحديد نقاط الخطر وتطبيق المعالجات المناسبة مع عناية كبيرة بالسلامة، وزيارات متابعة للتأكد من بقاء الأوضاع تحت السيطرة.',
      impact:
        'تحمي الوقاية الفعالة الصحة والسلامة وتدعم بيئات نظيفة ومريحة وتحسّن جودة الحياة للسكان والعاملين والزوار في منطقة المدينة المنورة.',
    },
  },
  {
    id: 'operations',
    icon: 'clipboard',
    en: {
      title: 'Field Operations & Service Management',
      summary:
        'Coordinated teams, close follow-up and quality oversight that turn service plans into consistent delivery.',
      overview:
        'Strong services depend on strong operations. Field operations and service management bring together planning, team coordination, execution tracking and quality control, so that every service line is delivered to a consistent standard.',
      importance:
        'Clear coordination reduces delays, avoids duplication and ensures accountability. Careful follow-up keeps safety procedures, service schedules and quality expectations visible at every stage of the work.',
      field:
        'This includes organizing and scheduling crews, aligning teams with client and site requirements, monitoring execution on the ground, resolving issues promptly and maintaining open communication across the operation.',
      impact:
        'Well-managed operations raise the reliability and quality of every service, supporting public cleanliness, health and safety, and the overall quality of life in the areas served.',
    },
    ar: {
      title: 'العمليات الميدانية وإدارة الخدمات',
      summary:
        'فرق منسقة ومتابعة دقيقة ورقابة على الجودة تحوّل خطط الخدمة إلى تنفيذ متسق.',
      overview:
        'تعتمد الخدمات القوية على عمليات قوية. تجمع العمليات الميدانية وإدارة الخدمات بين التخطيط وتنسيق الفرق ومتابعة التنفيذ وضبط الجودة، لتُقدَّم كل خدمة بمعيار ثابت.',
      importance:
        'يقلل التنسيق الواضح التأخير ويمنع الازدواجية ويضمن المساءلة. وتُبقي المتابعة الدقيقة إجراءات السلامة وجداول الخدمة وتوقعات الجودة حاضرة في كل مرحلة من العمل.',
      field:
        'يشمل ذلك تنظيم الفرق وجدولتها، ومواءمة العمل مع متطلبات العميل والموقع، ومراقبة التنفيذ ميدانيًا، ومعالجة المشكلات بسرعة، والحفاظ على تواصل مفتوح عبر العملية كلها.',
      impact:
        'ترفع العمليات المُدارة جيدًا موثوقية وجودة كل خدمة، وتدعم النظافة العامة والصحة والسلامة وجودة الحياة بوجه عام في المناطق التي تخدمها.',
    },
  },
]

const copy = {
  en: {
    eyebrow: 'Service Scope',
    heading: 'Services within scope',
    sub: 'Environmental and operational services delivered across the Madinah region.',
    cta: 'Explore Service',
    close: 'Close',
    sections: {
      overview: 'Service Overview',
      importance: 'Environmental & Operational Importance',
      field: 'Field Operations',
      impact: 'Health, Safety & Quality of Life',
    },
  },
  ar: {
    eyebrow: 'نطاق الخدمات',
    heading: 'الخدمات ضمن نطاق العمل',
    sub: 'خدمات بيئية وتشغيلية تُقدَّم في منطقة المدينة المنورة.',
    cta: 'استكشف الخدمة',
    close: 'إغلاق',
    sections: {
      overview: 'نظرة عامة على الخدمة',
      importance: 'الأهمية البيئية والتشغيلية',
      field: 'الأعمال الميدانية',
      impact: 'الصحة والسلامة وجودة الحياة',
    },
  },
}

export default function CurrentRole() {
  const root = useRef(null)
  const tilt = useRef(null)
  const rig = useRef(null)
  const overlayRef = useRef(null)
  const panelRef = useRef(null)
  const closeBtnRef = useRef(null)
  const triggerRef = useRef(null)
  const closingRef = useRef(false)
  const [hover, setHover] = useState(null)
  const [active, setActive] = useState(null)

  const { language } = useSitePreferences()
  const isArabic = language === 'ar'
  const areas = profile.companyAreas
  const t = isArabic ? copy.ar : copy.en

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(rig.current, { rotationX: 58, rotationZ: -38 })

      gsap.from('.cr-reveal', {
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

      gsap.from('.cr-service', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.cr-services',
          start: 'top 85%',
        },
      })

      if (!prefersReducedMotion()) {
        gsap.fromTo(
          '.cr-plate',
          { z: (i) => i * 18 },
          {
            z: (i) => i * 105,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 80%',
              end: 'center 30%',
              scrub: 1,
            },
          },
        )

        gsap.fromTo(
          '.cr-bg',
          { xPercent: 6 },
          {
            xPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      }

      if (isFinePointer() && !prefersReducedMotion()) {
        const rx = gsap.quickTo(tilt.current, 'rotationX', {
          duration: 1,
          ease: 'power3.out',
        })

        const ry = gsap.quickTo(tilt.current, 'rotationY', {
          duration: 1,
          ease: 'power3.out',
        })

        gsap.set(tilt.current, { transformPerspective: 1400 })

        const onMove = (e) => {
          const r = root.current.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / r.height - 0.5

          ry(nx * 10)
          rx(ny * -8)
        }

        const el = root.current
        el.addEventListener('mousemove', onMove)

        return () => el.removeEventListener('mousemove', onMove)
      }

      return undefined
    }, root)

    return () => ctx.revert()
  }, [isArabic])

  /* ---------------------------- Modal logic ---------------------------- */

  const openService = (index, event) => {
    triggerRef.current = event.currentTarget
    closingRef.current = false
    setActive(index)
  }

  const finishClose = useCallback(() => {
    closingRef.current = false
    setActive(null)
    triggerRef.current?.focus?.()
  }, [])

  const closeModal = useCallback(() => {
    if (closingRef.current) return
    if (!panelRef.current || !overlayRef.current) {
      finishClose()
      return
    }

    closingRef.current = true

    if (prefersReducedMotion()) {
      finishClose()
      return
    }

    gsap.to(panelRef.current, {
      y: 40,
      scale: 0.97,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
    })

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: finishClose,
    })
  }, [finishClose])

  // Entry animation
  useLayoutEffect(() => {
    if (active === null) return undefined

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set([overlayRef.current, panelRef.current], { opacity: 1 })
        return
      }

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' },
      )

      gsap.fromTo(
        panelRef.current,
        { y: 60, scale: 0.96, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' },
      )

      gsap.from('.cr-modal-item', {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.25,
      })
    }, overlayRef)

    return () => ctx.revert()
  }, [active])

  // Escape, focus trap, scroll lock
  useEffect(() => {
    if (active === null) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
        return
      }

      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button, [href], [tabindex]:not([tabindex="-1"])',
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
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [active, closeModal])

  const getAreaLabel = (area) =>
    isArabic ? arabicAreas[area] || area : area

  const activeService = active !== null ? services[active] : null
  const activeContent = activeService
    ? isArabic
      ? activeService.ar
      : activeService.en
    : null

  return (
    <section
      id="current"
      ref={root}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="blueprint relative overflow-hidden bg-[var(--surface-bg)] px-6 py-32 text-[var(--text-primary)] md:px-12 md:py-48"
    >
      {/* Oversized backdrop word */}
      <span
        aria-hidden="true"
        className={`cr-bg text-outline pointer-events-none absolute top-[6%] select-none whitespace-nowrap font-display text-[26vw] font-extrabold leading-none ${
          isArabic ? '-right-[4vw]' : '-left-[4vw]'
        }`}
      >
        M.A.S-Development
      </span>

      <div className="relative z-10 grid items-center gap-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="cr-reveal eyebrow">
            {isArabic ? '٠٣ — المنصب الحالي' : '03 — Current Role'}
          </p>

          <h2 className="cr-reveal mt-6 font-display text-[clamp(3.4rem,13vw,11rem)] font-extrabold leading-[0.88] tracking-[-0.03em]">
            M.A.S-<span className="text-[var(--accent)]">Development</span>
          </h2>

          <p className="cr-reveal mt-8 text-2xl font-semibold text-[var(--text-primary)] md:text-4xl">
            {isArabic ? 'مدير المبيعات' : 'Sales Manager'}
          </p>

          <p className="cr-reveal mt-3 text-[11px] tracking-[0.15em] text-[var(--text-muted)]">
            {isArabic
              ? 'م.ا.س للتطوير · ٥ سنوات'
              : `${profile.company} · 5 years`}
          </p>

          <ul className="cr-reveal mt-14 max-w-md border-t border-[var(--border-color)]">
            {areas.map((area, i) => (
              <li key={area} className="border-b border-[var(--border-color)]">
                <button
                  type="button"
                  data-cursor
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  onClick={() => setHover((current) => (current === i ? null : i))}
                  className={`flex w-full items-center justify-between py-5 transition-colors duration-500 ${
                    isArabic ? 'text-right' : 'text-left'
                  } ${
                    hover === i
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--text-primary)]'
                  }`}
                >
                  <span className="font-display text-xl font-bold md:text-2xl">
                    {getAreaLabel(area)}
                  </span>

                  <span
                    dir="ltr"
                    className="text-[11px] tracking-[0.2em] text-[var(--text-muted)]"
                  >
                    0{i + 1}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="cr-reveal mt-12 max-w-md font-display text-xl italic leading-relaxed text-[var(--text-muted)] md:text-2xl">
            {isArabic
              ? 'اكتشف عالم محمد سليم المهني.'
              : 'Inside the professional world of Mohamed Selim.'}
          </p>
        </div>

        {/* 3D exploded stack */}
        <div
          className="cr-reveal flex justify-center lg:col-span-6"
          aria-hidden="true"
        >
          <div
            className="relative aspect-square w-[min(80vw,460px)]"
            style={{ perspective: '1400px' }}
          >
            <div
              ref={tilt}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                ref={rig}
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {areas.map((area, i) => (
                  <div
                    key={area}
                    className={`cr-plate absolute inset-0 border transition-colors duration-500 ${
                      hover === i
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_60px_rgba(201,162,39,0.2)]'
                        : 'border-[var(--border-color)] bg-[var(--text-primary)]/[0.02]'
                    }`}
                    style={{
                      backgroundImage:
                        'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
                      backgroundSize: '46px 46px',
                    }}
                  >
                    <span
                      dir="ltr"
                      className="absolute left-3 top-3 text-[10px] font-semibold tracking-[0.3em] text-[var(--accent)]"
                    >
                      0{i + 1}
                    </span>

                    <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-[var(--accent)]" />

                    <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-[var(--accent)]" />
                  </div>
                ))}

                {/* Vertical axis through the stack */}
                <div
                  className="absolute left-1/2 w-px bg-[var(--accent)]/60"
                  style={{
                    height: 460,
                    top: 'calc(50% - 230px)',
                    transform: 'translateZ(160px) rotateX(90deg)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services within scope */}
      <div className="cr-services relative z-10 mt-28 md:mt-40">
        <div className="max-w-2xl">
          <p className="eyebrow">{t.eyebrow}</p>

          <h3 className="mt-6 font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.02em] md:text-6xl">
            {t.heading}
          </h3>

          <p className="mt-6 text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
            {t.sub}
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, i) => {
            const content = isArabic ? service.ar : service.en

            return (
              <li
                key={service.id}
                className="cr-service group flex flex-col border border-[var(--border-color)] bg-[var(--text-primary)]/[0.02] p-7 transition-colors duration-500 hover:border-[var(--accent)] focus-within:border-[var(--accent)]"
              >
                <span className="text-[var(--accent)]">
                  <ServiceIcon name={service.icon} />
                </span>

                <h4 className="mt-6 font-display text-xl font-bold leading-snug md:text-2xl">
                  {content.title}
                </h4>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {content.summary}
                </p>

                <button
                  type="button"
                  data-cursor
                  onClick={(e) => openService(i, e)}
                  aria-haspopup="dialog"
                  className="mt-8 inline-flex items-center gap-3 self-start border-b border-[var(--accent)] pb-1 text-[12px] font-semibold tracking-[0.12em] text-[var(--accent)] transition-opacity duration-300 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                >
                  {t.cta}
                  <span
                    aria-hidden="true"
                    className={isArabic ? 'rotate-180' : ''}
                  >
                    →
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Service details modal */}
      {activeService &&
        createPortal(
          <div
            ref={overlayRef}
            dir={isArabic ? 'rtl' : 'ltr'}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal()
            }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cr-modal-title"
              className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto overscroll-contain border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 pb-10 pt-16 text-[var(--text-primary)] shadow-[0_0_90px_rgba(201,162,39,0.15)] sm:max-h-[88vh] md:px-12 md:pb-14"
            >
              {/* Gold top rule */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-[var(--accent)]"
              />

              <button
                ref={closeBtnRef}
                type="button"
                data-cursor
                onClick={closeModal}
                aria-label={t.close}
                className={`absolute top-4 flex h-11 w-11 items-center justify-center border border-[var(--border-color)] text-[var(--text-primary)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                  isArabic ? 'left-4' : 'right-4'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <div className="cr-modal-item text-[var(--accent)]">
                <ServiceIcon name={activeService.icon} className="h-10 w-10" />
              </div>

              <h3
                id="cr-modal-title"
                className="cr-modal-item mt-6 font-display text-3xl font-extrabold leading-tight tracking-[-0.01em] md:text-5xl"
              >
                {activeContent.title}
              </h3>

              <p className="cr-modal-item mt-5 text-lg leading-relaxed text-[var(--text-muted)]">
                {activeContent.summary}
              </p>

              <div className="mt-10 space-y-8 border-t border-[var(--border-color)] pt-8">
                {['overview', 'importance', 'field', 'impact'].map((key) => (
                  <section key={key} className="cr-modal-item">
                    <h4 className="font-display text-lg font-bold text-[var(--accent)]">
                      {t.sections[key]}
                    </h4>
                    <p className="mt-3 text-base leading-relaxed text-[var(--text-primary)]/90">
                      {activeContent[key]}
                    </p>
                  </section>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}
