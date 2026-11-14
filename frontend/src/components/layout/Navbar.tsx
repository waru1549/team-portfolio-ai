
import { useState } from 'react'
import { Link, NavLink } from 'react-router'

import {
  Menu,
  MessageCircle,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'

import { useLanguage } from '../../contexts/language-context'
import type { Language } from '../../data/portfolioData'

interface LanguageSwitcherProps {
  language: Language
  onChange: (language: Language) => void
}

const languageOptions: readonly {
  value: Language
  label: string
}[] = [
  { value: 'en', label: 'EN' },
  { value: 'th', label: 'TH' },
]

function LanguageSwitcher({
  language,
  onChange,
}: LanguageSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={language === 'th' ? 'เลือกภาษา' : 'Select language'}
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1"
    >
      {languageOptions.map((option) => {
        const isActive = language === option.value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            aria-label={
              option.value === 'en'
                ? 'Switch language to English'
                : 'เปลี่ยนภาษาเป็นภาษาไทย'
            }
            onClick={() => onChange(option.value)}
            className={`min-w-10 rounded-full px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 ${
              isActive
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { language, setLanguage } = useLanguage()

  const copy =
    language === 'th'
      ? {
          portfolio: 'ผลงานทีม',
          aiChat: 'แชต AI',
          mainNavigation: 'เมนูหลัก',
          mobileNavigation: 'เมนูสำหรับมือถือ',
          openMenu: 'เปิดเมนูนำทาง',
          closeMenu: 'ปิดเมนูนำทาง',
        }
      : {
          portfolio: 'Portfolio',
          aiChat: 'AI Chat',
          mainNavigation: 'Main navigation',
          mobileNavigation: 'Mobile navigation',
          openMenu: 'Open navigation menu',
          closeMenu: 'Close navigation menu',
        }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300 ${
      isActive
        ? 'bg-white/10 text-white'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          aria-label="Team Portfolio AI home"
          className="flex items-center gap-3"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/20">
            <Sparkles size={21} />
          </span>

          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-bold tracking-wide text-white">
              TEAM PORTFOLIO
            </span>

            <span className="text-[10px] font-semibold tracking-[0.2em] text-brand-300">
              AI EXPERIENCE
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 md:flex">
          <nav
            aria-label={copy.mainNavigation}
            className="flex items-center gap-2"
          >
            <NavLink to="/" end className={navLinkClass}>
              <UserRound size={16} />
              {copy.portfolio}
            </NavLink>

            <NavLink to="/chat" className={navLinkClass}>
              <MessageCircle size={16} />
              {copy.aiChat}
            </NavLink>
          </nav>

          <LanguageSwitcher
            language={language}
            onChange={setLanguage}
          />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label={
            isMobileMenuOpen ? copy.closeMenu : copy.openMenu
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((previous) => !previous)}
          className="grid size-10 place-items-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300 md:hidden"
        >
          {isMobileMenuOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label={copy.mobileNavigation}
          className="border-t border-white/10 px-5 py-4 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <NavLink
              to="/"
              end
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <UserRound size={18} />
              {copy.portfolio}
            </NavLink>

            <NavLink
              to="/chat"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <MessageCircle size={18} />
              {copy.aiChat}
            </NavLink>

            {/* Mobile Language Switcher */}
            <div className="mt-3 border-t border-white/10 pt-4">
              <p className="mb-3 text-xs font-medium text-slate-500">
                {language === 'th' ? 'เลือกภาษา' : 'Language'}
              </p>

              <LanguageSwitcher
                language={language}
                onChange={(nextLanguage) => {
                  setLanguage(nextLanguage)
                  closeMobileMenu()
                }}
              />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
