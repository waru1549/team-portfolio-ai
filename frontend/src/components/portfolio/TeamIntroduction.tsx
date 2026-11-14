
import {
  FolderKanban,
  Languages,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'

import { useLanguage } from '../../contexts/language-context'

import {
  getLocalizedText,
  portfolioData,
} from '../../data/portfolioData'

function TeamIntroduction() {
  const { language } = useLanguage()

  const { group, members, teamProjects } = portfolioData

  const isThai = language === 'th'

  const copy = isThai
    ? {
        eyebrow: 'WHO WE ARE',
        heading: 'รู้จักทีมของเรา',
        subtitle: 'แนวคิด วิสัยทัศน์ และสิ่งที่เราให้ความสำคัญ',
        introduction: 'แนะนำทีมของเรา',
        vision: 'วิสัยทัศน์ของทีม',
        strengths: 'จุดแข็งของทีมเรา',
        pendingLabel: 'กำลังเตรียมข้อมูล',
        introductionPending:
          'ข้อมูลแนะนำทีมจะเพิ่มเติมหลังจากสมาชิกยืนยันข้อมูลของกลุ่มเรียบร้อยแล้ว',
        visionPending:
          'วิสัยทัศน์และเป้าหมายร่วมกันของทีมจะแสดงในส่วนนี้เมื่อได้รับการยืนยัน',
        strengthsPending:
          'จุดแข็งของทีมจะเพิ่มเติมหลังจากสมาชิกยืนยันความสามารถและแนวทางการทำงานร่วมกัน',
        members: 'สมาชิกในทีม',
        languages: 'ภาษาที่รองรับ',
        projects: 'โปรเจกต์ของทีมที่ยืนยันแล้ว',
      }
    : {
        eyebrow: 'WHO WE ARE',
        heading: 'A little about our team',
        subtitle:
          'Our ideas, shared vision, and the values behind our work.',
        introduction: 'Team Introduction',
        vision: 'Our Vision',
        strengths: 'Our Core Strengths',
        pendingLabel: 'CONTENT IN PROGRESS',
        introductionPending:
          'Our team introduction will be added after all members confirm the group profile.',
        visionPending:
          'Our shared vision and goals will appear here once they have been confirmed by the team.',
        strengthsPending:
          'Our confirmed team strengths will appear here after the members review their skills and collaboration.',
        members: 'TEAM MEMBERS',
        languages: 'SUPPORTED LANGUAGES',
        projects: 'VERIFIED TEAM PROJECTS',
      }

  // Prevent demonstration text from being displayed as verified facts.
  const introductionText = group.isPlaceholder
    ? copy.introductionPending
    : getLocalizedText(group.introduction, language) ||
      copy.introductionPending

  const visionText = group.isPlaceholder
    ? copy.visionPending
    : getLocalizedText(group.vision, language) ||
      copy.visionPending

  const verifiedStrengths = group.isPlaceholder
    ? []
    : group.coreStrengthsI18n
        .map((strength) => getLocalizedText(strength, language))
        .filter(Boolean)

  const verifiedProjectCount = teamProjects.filter(
    (project) => !project.isPlaceholder,
  ).length

  const stats = [
    {
      icon: Users,
      value: String(members.length).padStart(2, '0'),
      label: copy.members,
    },
    {
      icon: Languages,
      value: '02',
      label: copy.languages,
    },
    {
      icon: FolderKanban,
      value: String(verifiedProjectCount).padStart(2, '0'),
      label: copy.projects,
    },
  ]

  return (
    <section
      id="introduction"
      aria-labelledby="introduction-heading"
      className="relative overflow-hidden px-5 py-20 sm:py-28 lg:px-8"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 -z-10 size-96 rounded-full bg-brand-500/5 blur-[120px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-xs font-semibold tracking-[0.15em] text-brand-300">
            <Sparkles size={14} />
            {copy.eyebrow}
          </div>

          <h2
            id="introduction-heading"
            className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          >
            {copy.heading}
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
            {copy.subtitle}
          </p>
        </div>

        {/* Team introduction and vision */}
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-panel border border-border-subtle bg-surface-900 p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                <Users size={21} />
              </span>

              <h3 className="font-display text-xl font-semibold text-white">
                {copy.introduction}
              </h3>
            </div>

            <p className="mt-6 text-sm leading-8 text-slate-400 sm:text-base">
              {introductionText}
            </p>

            {group.isPlaceholder && (
              <span className="mt-6 inline-flex rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-amber-300">
                {copy.pendingLabel}
              </span>
            )}
          </article>

          <article className="rounded-panel border border-border-subtle bg-surface-900 p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-cyan/10 text-accent-cyan">
                <Target size={21} />
              </span>

              <h3 className="font-display text-xl font-semibold text-white">
                {copy.vision}
              </h3>
            </div>

            <p className="mt-6 text-sm leading-8 text-slate-400 sm:text-base">
              {visionText}
            </p>

            {group.isPlaceholder && (
              <span className="mt-6 inline-flex rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-amber-300">
                {copy.pendingLabel}
              </span>
            )}
          </article>
        </div>

        {/* Core strengths */}
        <article className="mt-6 rounded-panel border border-border-subtle bg-surface-900 p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
              <Sparkles size={21} />
            </span>

            <h3 className="font-display text-xl font-semibold text-white">
              {copy.strengths}
            </h3>
          </div>

          {verifiedStrengths.length > 0 ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {verifiedStrengths.map((strength, index) => (
                <div
                  key={`${index}-${strength}`}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/4 p-4"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-500/15 text-xs font-bold text-brand-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p className="text-sm leading-7 text-slate-300">
                    {strength}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm leading-8 text-slate-400">
              {copy.strengthsPending}
            </p>
          )}
        </article>

        {/* Team statistics */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-border-subtle bg-surface-900/70 p-6 text-center"
              >
                <Icon
                  size={20}
                  className="mx-auto text-brand-300"
                />

                <p className="mt-3 font-display text-3xl font-semibold text-white">
                  {stat.value}
                </p>

                <p className="mt-2 text-[10px] font-semibold tracking-[0.13em] text-slate-400">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TeamIntroduction
