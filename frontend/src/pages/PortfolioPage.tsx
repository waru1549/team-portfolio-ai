
import Navbar from '../components/layout/Navbar'

import TeamHero from '../components/portfolio/TeamHero'
import TeamIntroduction from '../components/portfolio/TeamIntroduction'
import MemberSection from '../components/portfolio/MemberSection'
import TeamContact from '../components/portfolio/TeamContact'
import TeamProjectSection from '../components/portfolio/TeamProjectSection'
import { useLanguage } from '../contexts/language-context'

function PortfolioPage() {
  const { language } = useLanguage()
  const isThai = language === 'th'
  return (
    <div className="min-h-screen bg-ink-950 text-white">

      <Navbar />

      <main>
        {/* Group Hero */}
        <TeamHero />

        {/* Team Introduction */}
        <TeamIntroduction />

        {/* Individual Members */}
        <MemberSection />

        {/* Team Project Showcase */}
        <TeamProjectSection />

        {/* Team Contact */}
        <TeamContact />
      </main>

      <footer className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Team Portfolio AI.
            {' '}
            {isThai ? 'สงวนลิขสิทธิ์' : 'All rights reserved.'}
          </p>

          <p className="text-xs text-slate-400">
            {isThai
                ? 'พัฒนาด้วย React, TypeScript และ Tailwind CSS'
                : 'Built with React, TypeScript & Tailwind CSS.'}
          </p>

        </div>
      </footer>

    </div>
  )
}

export default PortfolioPage
