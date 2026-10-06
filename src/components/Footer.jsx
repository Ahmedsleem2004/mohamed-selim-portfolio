import { profile } from '../data/profile'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink px-6 py-8 md:px-12">
      <div className="flex flex-col gap-4 text-[10px] font-semibold tracking-[0.35em] text-white/40 md:flex-row md:items-center md:justify-between">
        <p className="text-paper">{profile.name.toUpperCase()}</p>
        <p>SALES MANAGER</p>
        <p>MADINAH · SAUDI ARABIA</p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}