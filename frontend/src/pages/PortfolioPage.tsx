
import Navbar from '../components/layout/Navbar'

import TeamHero from '../components/portfolio/TeamHero'
import MemberSection from '../components/portfolio/MemberSection'
import TeamContact from '../components/portfolio/TeamContact'

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-white">

      <Navbar />

      <main>
        {/* Group Introduction */}
        <TeamHero />

        {/* Individual Members */}
        <MemberSection />

        {/* Team Contact */}
        <TeamContact />
      </main>

      <footer className="border-t border-white/10 px-5 py-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Team Portfolio AI.
            All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Built with React, TypeScript & Tailwind CSS.
          </p>

        </div>

      </footer>

    </div>
  )
}

export default PortfolioPage
