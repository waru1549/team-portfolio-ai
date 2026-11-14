
import { ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router'

import { useLanguage } from '../../contexts/language-context'
import {
  getLocalizedText,
  portfolioData,
} from '../../data/portfolioData'

function TeamHero() {
  const { language } = useLanguage()
  const { group, teamProjects } = portfolioData

  const copy =
    language === 'th'
      ? {
          eyebrow: 'แนะนำทีมของเรา',
          weAre: 'พวกเราคือ',
          talkToAI: 'พูดคุยกับ AI ของเรา',
          discover: 'มาค้นพบสิ่งที่ทำให้เราแตกต่าง',
          featuredProject: 'โปรเจกต์เด่น',
          collaborativeWork: 'ผลงานร่วมกันของทีม',
          coreStrengths: 'จุดแข็งของทีมเรา',
        }
      : {
          eyebrow: 'INTRODUCING OUR TEAM',
          weAre: 'We are',
          talkToAI: 'Talk to Our AI',
          discover: 'Discover what makes us different.',
          featuredProject: 'Featured Project',
          collaborativeWork: 'COLLABORATIVE WORK',
          coreStrengths: 'Our Core Strengths',
        }

  // Use the first featured team project.
  const featuredProject = teamProjects.find(
    (project) => project.isFeatured,
  )

  // Keep the legacy project as a fallback.
  const projectTitle = featuredProject
    ? getLocalizedText(featuredProject.title, language)
    : group.jointProject.title

  const projectDescription = featuredProject
    ? getLocalizedText(featuredProject.description, language)
    : group.jointProject.description

  // Read localized team content.
  const teamName =
    getLocalizedText(group.teamNameI18n, language) || group.teamName

  const tagline =
    getLocalizedText(group.taglineI18n, language) || group.tagline

  const strengths = group.coreStrengthsI18n
    .map((strength) => getLocalizedText(strength, language))
    .filter(Boolean)

  return (
    <section
      aria-labelledby="team-hero-title"
      className="relative isolate overflow-hidden px-5 py-20 sm:py-28 lg:px-8"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 -z-10 size-96 rounded-full bg-brand-500/10 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 size-96 rounded-full bg-accent-cyan/5 blur-[120px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Main Hero */}
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">

          {/* Left: Team Introduction */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-brand-300">
              <Sparkles size={14} />
              {copy.eyebrow}
            </div>

            <h1
              id="team-hero-title"
              className="mt-7 max-w-3xl font-display text-5xl font-semibold leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              {copy.weAre}

              <span className="mt-2 block bg-linear-to-r from-brand-300 via-brand-400 to-accent-cyan bg-clip-text text-transparent">
                {teamName}.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {tagline}
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:-translate-y-0.5 hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                {copy.talkToAI}
                <ArrowUpRight size={17} />
              </Link>

              <span className="text-sm text-slate-400">
                {copy.discover}
              </span>
            </div>
          </div>

          {/* Right: Featured Project Card */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-4xl bg-linear-to-r from-brand-500/15 via-transparent to-accent-cyan/10 blur-2xl"
            />

            <article className="rounded-panel border border-border-subtle bg-surface-900/90 p-7 shadow-glow backdrop-blur-xl sm:p-9">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
                  {copy.featuredProject}
                </span>

                <span className="rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-3 py-1 text-[10px] font-semibold text-accent-cyan">
                  {copy.collaborativeWork}
                </span>
              </div>

              <h2 className="mt-8 font-display text-3xl font-semibold leading-tight text-white">
                {projectTitle}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                {projectDescription}
              </p>

              <div className="mt-8 border-t border-border-subtle pt-7">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {copy.coreStrengths}
                </h3>

                <div className="mt-5 space-y-4">
                  {strengths.map((strength, index) => (
                    <div
                      key={`${index}-${strength}`}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-300">
                        <Check size={12} />
                      </span>

                      <p className="text-sm leading-6 text-slate-300">
                        {strength}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamHero
