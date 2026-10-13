
import { profile } from '../data/profile'
import { useSitePreferences } from '../context/SitePreferences'

export default function Footer() {
  const { language } = useSitePreferences()
  const isArabic = language === 'ar'

  return (
    <footer
      dir={isArabic ? 'rtl' : 'ltr'}
      className="border-t border-[var(--border-color)] bg-[var(--page-bg)] px-6 py-8 text-[var(--text-muted)] md:px-12"
    >
      <div
        className={`flex flex-col gap-4 text-[10px] font-semibold md:flex-row md:items-center md:justify-between ${
          isArabic ? 'tracking-normal' : 'tracking-[0.35em]'
        }`}
      >
        <p className="text-[var(--text-primary)]">
          {isArabic ? 'محمد سليم إسماعيل' : profile.name.toUpperCase()}
        </p>

        <p className="text-[var(--text-muted)]">
          {isArabic ? 'مدير المبيعات' : 'SALES MANAGER'}
        </p>

        <p className="text-[var(--text-muted)]">
          {isArabic
            ? 'المدينة المنورة · المملكة العربية السعودية'
            : 'MADINAH · SAUDI ARABIA'}
        </p>

        <p className="text-[var(--text-muted)]" dir="ltr">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
