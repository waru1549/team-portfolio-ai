
import {
  ArrowUpRight,
  Code2,
  Mail,
  MessageCircle,
} from 'lucide-react'

import { Link } from 'react-router'
import { portfolioData } from '../../data/portfolioData'

function TeamContact() {
  const { group } = portfolioData

  const { githubUrl, teamEmail } = group.contact

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden px-5 py-20 sm:py-28 lg:px-8"
    >
      {/* Background Decoration */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 -z-10 size-96 rounded-full bg-brand-500/10 blur-[120px]"
      />

      <div className="mx-auto max-w-7xl">

        <div className="relative overflow-hidden rounded-panel border border-border-subtle bg-surface-900 p-8 shadow-glow sm:p-12 lg:p-16">

          {/* Decorative Glow */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-brand-500/10 blur-[100px]"
          />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">

            {/* Contact Introduction */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-brand-300">

                <MessageCircle size={14} />

                LET'S CONNECT

              </div>

              <h2
                id="contact-heading"
                className="mt-7 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
              >
                Have a project in mind?

                <span className="mt-2 block bg-linear-to-r from-brand-300 to-accent-cyan bg-clip-text text-transparent">
                  Let's build something meaningful.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Interested in our work or want to know more
                about {group.teamName}?

                Get in touch with our team or start a
                conversation with our AI assistant.
              </p>

              {/* Contact Actions */}

              <div className="mt-9 flex flex-wrap gap-3">

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${group.teamName} on GitHub`}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                >
                  <Code2 size={17} />

                  GitHub

                  <ArrowUpRight size={15} />
                </a>

                <a
                  href={`mailto:${teamEmail}`}
                  aria-label={`Email ${group.teamName}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                >
                  <Mail size={17} />

                  Email Our Team
                </a>

                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                >
                  <MessageCircle size={17} />

                  Talk to AI

                  <ArrowUpRight size={15} />
                </Link>

              </div>

            </div>

            {/* Contact Information Card */}

            <aside className="w-full rounded-2xl border border-white/10 bg-ink-950/70 p-6 backdrop-blur-xl lg:w-72">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
                CONTACT INFORMATION
              </p>

              <div className="mt-6 space-y-6">

                {/* Email */}

                <div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail size={15} />

                    <span className="text-xs">
                      Team Email
                    </span>
                  </div>

                  <p className="mt-2 break-all text-sm font-medium text-white">
                    {teamEmail}
                  </p>
                </div>

                <div className="h-px bg-border-subtle" />

                {/* GitHub */}

                <div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Code2 size={15} />

                    <span className="text-xs">
                      GitHub Repository
                    </span>
                  </div>

                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex max-w-full items-center gap-1 break-all text-sm font-medium text-brand-300 transition hover:text-brand-100"
                  >
                    Explore our GitHub

                    <ArrowUpRight size={14} className="shrink-0" />
                  </a>
                </div>

              </div>

            </aside>

          </div>

        </div>

      </div>

    </section>
  )
}

export default TeamContact
