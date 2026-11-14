
import {
  ArrowUpRight,
  Code2,
  Mail,
  MessageCircle,
} from 'lucide-react'

import { Link } from 'react-router'

import { useLanguage } from '../../contexts/language-context'

import {
  getLocalizedText,
  portfolioData,
} from '../../data/portfolioData'

import type { Language } from '../../data/portfolioData'

interface ContactCopy {
  eyebrow: string
  heading: string
  headingAccent: string
  description: string
  contactInformation: string
  teamEmail: string
  githubRepository: string
  exploreGithub: string
  emailTeam: string
  talkToAI: string
}

function getContactCopy(language: Language): ContactCopy {
  if (language === 'th') {
    return {
      eyebrow: 'มาร่วมพูดคุยกัน',
      heading: 'มีโปรเจกต์อยู่ในใจหรือไม่?',
      headingAccent: 'มาสร้างสิ่งที่มีความหมายไปด้วยกัน',
      description:
        'สนใจผลงานของเราหรือต้องการทำความรู้จักทีมของเราเพิ่มเติม ติดต่อทีมงานหรือเริ่มต้นพูดคุยกับ AI Assistant ได้เลย',
      contactInformation: 'ข้อมูลติดต่อ',
      teamEmail: 'อีเมลทีม',
      githubRepository: 'GitHub Repository',
      exploreGithub: 'ดู GitHub ของทีม',
      emailTeam: 'ส่งอีเมลถึงทีม',
      talkToAI: 'พูดคุยกับ AI',
    }
  }

  return {
    eyebrow: "LET'S CONNECT",
    heading: 'Have a project in mind?',
    headingAccent: "Let's build something meaningful.",
    description:
      'Interested in our work or want to know more about our team? Get in touch with us or start a conversation with our AI assistant.',
    contactInformation: 'CONTACT INFORMATION',
    teamEmail: 'Team Email',
    githubRepository: 'GitHub Repository',
    exploreGithub: 'Explore our GitHub',
    emailTeam: 'Email Our Team',
    talkToAI: 'Talk to AI',
  }
}

function getSafeExternalUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined

  try {
    const url = new URL(value.trim())

    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return value.trim()
    }
  } catch {
    return undefined
  }

  return undefined
}

function getSafeEmail(value?: string): string | undefined {
  const email = value?.trim()

  if (!email) return undefined

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? email
    : undefined
}

function TeamContact() {
  const { group } = portfolioData
  const { language } = useLanguage()

  const isThai = language === 'th'
  const copy = getContactCopy(language)

  // Protect unverified team/contact information.
  const contactIsVerified =
    !group.isPlaceholder && !group.contact.isPlaceholder

  const githubUrl = contactIsVerified
    ? getSafeExternalUrl(group.contact.githubUrl)
    : undefined

  const teamEmail = contactIsVerified
    ? getSafeEmail(group.contact.teamEmail)
    : undefined

  const hasContactInformation = Boolean(githubUrl || teamEmail)

  const teamName = group.isPlaceholder
    ? isThai
      ? 'ทีมของเรา'
      : 'our team'
    : getLocalizedText(group.teamNameI18n, language) ||
      group.teamName

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
                <MessageCircle size={14} aria-hidden="true" />
                {copy.eyebrow}
              </div>

              <h2
                id="contact-heading"
                className="mt-7 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
              >
                {copy.heading}{' '}
                <span className="mt-2 block bg-linear-to-r from-brand-300 to-accent-cyan bg-clip-text text-transparent">
                  {copy.headingAccent}
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                {copy.description}
              </p>

              {/* Contact Actions */}
              <div className="mt-9 flex flex-wrap gap-3">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${teamName} on GitHub`}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                  >
                    <Code2 size={17} aria-hidden="true" />
                    GitHub
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}

                {teamEmail && (
                  <a
                    href={`mailto:${teamEmail}`}
                    aria-label={`${copy.emailTeam}: ${teamEmail}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                  >
                    <Mail size={17} aria-hidden="true" />
                    {copy.emailTeam}
                  </a>
                )}

                <Link
                  to="/chat"
                  aria-label={copy.talkToAI}
                  className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  {copy.talkToAI}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Verified Contact Information */}
            {hasContactInformation && (
              <aside
                aria-label={copy.contactInformation}
                className="w-full rounded-2xl border border-white/10 bg-ink-950/70 p-6 backdrop-blur-xl lg:w-72"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
                  {copy.contactInformation}
                </p>

                <div className="mt-6 space-y-6">
                  {teamEmail && (
                    <div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail size={15} aria-hidden="true" />

                        <span className="text-xs">
                          {copy.teamEmail}
                        </span>
                      </div>

                      <p className="mt-2 wrap-break-word text-sm font-medium text-white">
                        {teamEmail}
                      </p>
                    </div>
                  )}

                  {teamEmail && githubUrl && (
                    <div
                      aria-hidden="true"
                      className="h-px bg-border-subtle"
                    />
                  )}

                  {githubUrl && (
                    <div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Code2 size={15} aria-hidden="true" />

                        <span className="text-xs">
                          {copy.githubRepository}
                        </span>
                      </div>

                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex max-w-full items-center gap-1 wrap-break-word text-sm font-medium text-brand-300 transition hover:text-brand-100"
                      >
                        {copy.exploreGithub}

                        <ArrowUpRight
                          size={14}
                          className="shrink-0"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  )}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamContact
