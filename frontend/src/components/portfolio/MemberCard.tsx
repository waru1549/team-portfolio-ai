
import {
  BriefcaseBusiness,
  Check,
  Code2,
  Sparkles,
} from 'lucide-react'

import type { Member } from '../../data/portfolioData'

interface MemberCardProps {
  member: Member
  index: number
}

interface SkillGroup {
  title: string
  items: readonly string[]
}

/**
 * Get skill groups based on the member's role.
 * TypeScript narrows the skill structure through roleKey.
 */
function getSkillGroups(member: Member): SkillGroup[] {
  switch (member.roleKey) {
    case 'frontend':
      return [
        {
          title: 'Core Development',
          items: member.skills.core,
        },
        {
          title: 'Design & Animation',
          items: member.skills.designAndAnimation,
        },
        {
          title: 'Development Tools',
          items: member.skills.tools,
        },
      ]

    case 'backend':
      return [
        {
          title: 'Backend Development',
          items: member.skills.core,
        },
        {
          title: 'Tools & AI',
          items: member.skills.toolsAndAI,
        },
      ]

    case 'devops':
      return [
        {
          title: 'Infrastructure & DevOps',
          items: member.skills.core,
        },
        {
          title: 'Testing',
          items: member.skills.testing,
        },
        {
          title: 'Web Server',
          items: member.skills.webServer,
        },
      ]
  }
}

/**
 * Generate initials for the member avatar.
 * No profile image is required at this stage.
 */
function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function MemberCard({ member, index }: MemberCardProps) {
  const skillGroups = getSkillGroups(member)
  const initials = getInitials(member.fullName)

  return (
    <article
      aria-labelledby={`member-${member.id}-name`}
      className="group relative flex h-full flex-col overflow-hidden rounded-panel border border-border-subtle bg-surface-900 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glow sm:p-7"
    >
      {/* Member-specific accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${member.themeColor.primary}, ${member.themeColor.secondary})`,
        }}
      />

      {/* Member Header */}
      <div className="flex items-start gap-4">

        <div
          className="grid size-16 shrink-0 place-items-center rounded-2xl font-display text-xl font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${member.themeColor.primary}, ${member.themeColor.secondary})`,
            boxShadow: `0 0 28px ${member.themeColor.glow}`,
          }}
          aria-hidden="true"
        >
          {initials || 'TM'}
        </div>

        <div className="min-w-0 flex-1">

          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              MEMBER {String(index + 1).padStart(2, '0')}
            </span>

            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-300">
              {member.roleKey}
            </span>
          </div>

          <h3
            id={`member-${member.id}-name`}
            className="truncate font-display text-xl font-semibold text-white"
          >
            {member.fullName}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            @{member.nickname}
          </p>

        </div>

      </div>

      {/* Role */}
      <div className="mt-6 flex items-start gap-2">
        <Sparkles
          size={16}
          className="mt-0.5 shrink-0"
          style={{ color: member.themeColor.primary }}
        />

        <p className="text-sm font-medium leading-6 text-slate-200">
          {member.roleName}
        </p>
      </div>

      {/* Skills */}
      <div className="mt-7">
        <div className="mb-4 flex items-center gap-2">
          <Code2 size={16} className="text-brand-300" />

          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
            Technical Skills
          </h4>
        </div>

        <div className="space-y-4">

          {skillGroups.map((group) => (
            <div key={group.title}>

              <p className="mb-2 text-[11px] font-medium text-slate-500">
                {group.title}
              </p>

              <div className="flex flex-wrap gap-2">

                {group.items.map((skill) => (
                  <span
                    key={`${group.title}-${skill}`}
                    className="rounded-lg border border-white/10 bg-white/4 px-2.5 py-1.5 text-[11px] text-slate-300"
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* Current Contributions */}
      <div className="mt-7 border-t border-border-subtle pt-6">

        <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
          Current Contributions
        </h4>

        <ul className="mt-4 space-y-3">

          {member.currentContributions.map((contribution, contributionIndex) => (
            <li
              key={`${member.id}-contribution-${contributionIndex}`}
              className="flex items-start gap-2.5"
            >
              <Check
                size={15}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <span className="text-xs leading-6 text-slate-400">
                {contribution}
              </span>
            </li>
          ))}

        </ul>

      </div>

      {/* Previous Project */}
      <div className="mt-auto pt-7">

        <div className="rounded-xl border border-white/10 bg-ink-950/70 p-4">

          <div className="flex items-center gap-2">
            <BriefcaseBusiness
              size={15}
              className="text-brand-300"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Previous Project
            </span>
          </div>

          <h4 className="mt-3 text-sm font-semibold text-white">
            {member.previousProject.title}
          </h4>

          <p className="mt-2 text-xs leading-6 text-slate-400">
            {member.previousProject.description}
          </p>

        </div>

      </div>

    </article>
  )
}

export default MemberCard
