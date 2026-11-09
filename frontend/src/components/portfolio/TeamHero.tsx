
import { ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router'

import { portfolioData } from '../../data/portfolioData'

function TeamHero() {
  const { group } = portfolioData

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
              INTRODUCING OUR TEAM
            </div>

            <h1
              id="team-hero-title"
              className="mt-7 max-w-3xl font-display text-5xl font-semibold leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              We are

              <span className="mt-2 block bg-linear-to-r from-brand-300 via-brand-400 to-accent-cyan bg-clip-text text-transparent">
                {group.teamName}.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {group.tagline}
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap items-center gap-4">

              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                Explore AI Chat
                <ArrowUpRight size={17} />
              </Link>

              <span className="text-sm text-slate-500">
                Discover what makes us different.
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
                  Featured Project
                </span>

                <span className="rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-3 py-1 text-[10px] font-semibold text-accent-cyan">
                  COLLABORATIVE WORK
                </span>

              </div>

              <h2 className="mt-8 font-display text-3xl font-semibold leading-tight text-white">
                {group.jointProject.title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                {group.jointProject.description}
              </p>

              <div className="mt-8 border-t border-border-subtle pt-7">

                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Our Core Strengths
                </h3>

                <div className="mt-5 space-y-4">

                  {group.coreStrengths.map((strength, index) => (
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
