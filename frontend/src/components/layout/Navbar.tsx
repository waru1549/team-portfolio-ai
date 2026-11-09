
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import {
  Menu,
  MessageCircle,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 md:flex"
        >
          <NavLink
            to="/"
            end
            className={navLinkClass}
          >
            <UserRound size={16} />
            Portfolio
          </NavLink>

          <NavLink
            to="/chat"
            className={navLinkClass}
          >
            <MessageCircle size={16} />
            AI Chat
          </NavLink>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label={
            isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
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
          aria-label="Mobile navigation"
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
              Portfolio
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
              AI Chat
            </NavLink>

          </div>
        </nav>
      )}

    </header>
  )
}

export default Navbar
