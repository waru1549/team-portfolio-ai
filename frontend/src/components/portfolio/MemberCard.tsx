
import { useState } from 'react'

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  ExternalLink,
  FolderKanban,
  Sparkles,
  UserRound,
} from 'lucide-react'

import { FaGithub, FaLinkedin } from 'react-icons/fa'

import { useLanguage } from '../../contexts/language-context'

import {
  getLocalizedText,
} from '../../data/portfolioData'

import type {
  IndividualProject,
  Language,
  Member,
} from '../../data/portfolioData'

interface MemberCardProps {
  member: Member
  index: number
}

interface SkillGroup {
  title: string
  items: readonly string[]
}

function getSkillGroups(
  member: Member,
  language: Language,
): SkillGroup[] {
  const labels =
    language === 'th'
      ? {
          core: 'ทักษะหลัก',
          design: 'การออกแบบและแอนิเมชัน',
          tools: 'เครื่องมือพัฒนา',
          backend: 'การพัฒนา Backend',
          ai: 'เครื่องมือและ AI',
          infrastructure: 'โครงสร้างพื้นฐานและ DevOps',
          testing: 'การทดสอบระบบ',
          server: 'Web Server',
        }
      : {
          core: 'Core Development',
          design: 'Design & Animation',
          tools: 'Development Tools',
          backend: 'Backend Development',
          ai: 'Tools & AI',
          infrastructure: 'Infrastructure & DevOps',
          testing: 'Testing',
          server: 'Web Server',
        }

  let groups: SkillGroup[]

  switch (member.roleKey) {
    case 'frontend':
      groups = [
        { title: labels.core, items: member.skills.core },
        {
          title: labels.design,
          items: member.skills.designAndAnimation,
        },
        { title: labels.tools, items: member.skills.tools },
      ]
      break

    case 'backend':
      groups = [
        { title: labels.backend, items: member.skills.core },
        { title: labels.ai, items: member.skills.toolsAndAI },
      ]
      break

    case 'devops':
      groups = [
        {
          title: labels.infrastructure,
          items: member.skills.core,
        },
        { title: labels.testing, items: member.skills.testing },
        { title: labels.server, items: member.skills.webServer },
      ]
      break
  }

  return groups.filter((group) => group.items.length > 0)
}

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
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

interface MemberAvatarProps {
  src?: string
  fullName: string
  initials: string
  isPlaceholder: boolean
  primaryColor: string
  secondaryColor: string
  glow: string
}

function MemberAvatar({
  src,
  fullName,
  initials,
  isPlaceholder,
  primaryColor,
  secondaryColor,
  glow,
}: MemberAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const showImage =
    Boolean(src) && !isPlaceholder && failedSrc !== src

  return (
    <div
      aria-hidden="true"
      className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 font-display text-xl font-bold text-white"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        boxShadow: `0 0 28px ${glow}`,
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={`${fullName} profile`}
          className="size-full object-cover"
          loading="lazy"
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : isPlaceholder ? (
        <UserRound size={30} />
      ) : (
        initials || 'TM'
      )}
    </div>
  )
}

interface ProjectCardProps {
  project: IndividualProject
  memberName: string
  language: Language
  copy: {
    webDemo: string
    sourceCode: string
    noImage: string
  }
}

function ProjectCard({
  project,
  memberName,
  language,
  copy,
}: ProjectCardProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const projectTitle = getLocalizedText(project.title, language)
  const projectDescription = getLocalizedText(
    project.description,
    language,
  )

  const projectType = project.projectType
    ? getLocalizedText(project.projectType, language)
    : ''

  const repositoryUrl = getSafeExternalUrl(project.repositoryUrl)
  const demoUrl = getSafeExternalUrl(project.demoUrl)

  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-white/3">
      {project.coverImage && failedSrc !== project.coverImage ? (
        <img
          src={project.coverImage}
          alt={`${projectTitle} cover`}
          className="h-36 w-full object-cover"
          loading="lazy"
          onError={() => setFailedSrc(project.coverImage ?? null)}
        />
      ) : (
        <div className="grid h-28 place-items-center bg-linear-to-br from-brand-500/10 to-accent-cyan/5">
          <div className="text-center">
            <FolderKanban
              size={27}
              className="mx-auto text-brand-300"
            />
            <span className="mt-2 block text-[10px] text-slate-500">
              {copy.noImage}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {projectType && (
            <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-[10px] font-semibold text-brand-300">
              {projectType}
            </span>
          )}

          {project.year && (
            <span className="text-[10px] text-slate-500">
              {project.year}
            </span>
          )}
        </div>

        <h5 className="mt-3 text-sm font-semibold leading-6 text-white">
          {projectTitle}
        </h5>

        {projectDescription && (
          <p className="mt-2 text-xs leading-6 text-slate-400">
            {projectDescription}
          </p>
        )}

        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-400"
              >
                {technology}
              </span>
            ))}
          </div>
        )}

        {(repositoryUrl || demoUrl) && (
          <div className="mt-4 flex flex-wrap gap-3 border-t border-white/10 pt-3">
            {repositoryUrl && (
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${copy.sourceCode}: ${projectTitle}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 transition hover:text-brand-300"
              >
                <FaGithub aria-hidden="true" />
                {copy.sourceCode}
                <ArrowUpRight size={12} />
              </a>
            )}

            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${copy.webDemo}: ${projectTitle}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 transition hover:text-brand-300"
              >
                <ExternalLink size={13} />
                {copy.webDemo}
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        )}

        <span className="sr-only">
          Project by {memberName}
        </span>
      </div>
    </article>
  )
}

function MemberCard({ member, index }: MemberCardProps) {
  const { language } = useLanguage()
  const isThai = language === 'th'

  const copy = isThai
    ? {
        member: 'สมาชิก',
        profilePending: 'รอข้อมูลสมาชิก',
        profileDescription:
          'ข้อมูลโปรไฟล์จะแสดงหลังจากสมาชิกยืนยันข้อมูลเรียบร้อยแล้ว',
        rolePending: 'กำลังรอยืนยันบทบาท',
        introduction: 'แนะนำตัว',
        biography: 'เกี่ยวกับสมาชิก',
        skills: 'ทักษะทางเทคนิค',
        responsibilities: 'หน้าที่รับผิดชอบ',
        projects: 'ผลงานส่วนตัว',
        noImage: 'ไม่มีภาพตัวอย่าง',
        sourceCode: 'ดู Source Code',
        webDemo: 'ทดลองใช้งาน',
      }
    : {
        member: 'Member',
        profilePending: 'PROFILE PENDING',
        profileDescription:
          'Member profile information will appear after the team confirms the details.',
        rolePending: 'Role pending confirmation',
        introduction: 'Introduction',
        biography: 'About',
        skills: 'Technical Skills',
        responsibilities: 'Current Responsibilities',
        projects: 'Individual Projects',
        noImage: 'No preview image',
        sourceCode: 'Source Code',
        webDemo: 'Live Demo',
      }

  const displayName = member.isPlaceholder
    ? `${copy.member} ${String(index + 1).padStart(2, '0')}`
    : member.fullName.trim() || `${copy.member} ${index + 1}`

  const initials = member.isPlaceholder
    ? ''
    : getInitials(member.fullName)

  const roleName = member.isPlaceholder
    ? ''
    : getLocalizedText(member.roleNameI18n, language) ||
      member.roleName

  const introduction = member.isPlaceholder
    ? ''
    : getLocalizedText(member.introduction, language)

  const biography = member.isPlaceholder
    ? ''
    : getLocalizedText(member.biography, language)

  const skillGroups = member.isPlaceholder
    ? []
    : getSkillGroups(member, language)

  const responsibilities = member.isPlaceholder
    ? []
    : member.responsibilities
        .map((item) => getLocalizedText(item, language))
        .filter(Boolean)

  const projects = member.isPlaceholder
    ? []
    : member.projects.filter((project) => {
        return (
          !project.isPlaceholder &&
          Boolean(
            project.title.en.trim() || project.title.th.trim(),
          )
        )
      })

  const githubUrl = member.isPlaceholder
    ? undefined
    : getSafeExternalUrl(member.socialLinks.github)

  const linkedinUrl = member.isPlaceholder
    ? undefined
    : getSafeExternalUrl(member.socialLinks.linkedin)

  const portfolioUrl = member.isPlaceholder
    ? undefined
    : getSafeExternalUrl(member.socialLinks.portfolio)

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
        <MemberAvatar
          src={member.avatar}
          fullName={displayName}
          initials={initials}
          isPlaceholder={member.isPlaceholder}
          primaryColor={member.themeColor.primary}
          secondaryColor={member.themeColor.secondary}
          glow={member.themeColor.glow}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              MEMBER {String(index + 1).padStart(2, '0')}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                member.isPlaceholder
                  ? 'bg-amber-400/10 text-amber-300'
                  : 'bg-white/5 text-brand-300'
              }`}
            >
              {member.isPlaceholder
                ? copy.profilePending
                : member.roleKey}
            </span>
          </div>

          <h3
            id={`member-${member.id}-name`}
            className="wrap-break-word font-display text-xl font-semibold text-white"
          >
            {displayName}
          </h3>

          {!member.isPlaceholder && member.nickname.trim() && (
            <p className="mt-1 text-xs text-slate-400">
              @{member.nickname}
            </p>
          )}
        </div>
      </div>

      {/* Placeholder notice */}
      {member.isPlaceholder && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4"
        >
          <p className="text-xs leading-6 text-slate-300">
            {copy.profileDescription}
          </p>
        </div>
      )}

      {/* Verified profile content */}
      {!member.isPlaceholder && (
        <>
          {/* Role */}
          {roleName && (
            <div className="mt-6 flex items-start gap-2">
              <Sparkles
                size={16}
                className="mt-0.5 shrink-0"
                style={{ color: member.themeColor.primary }}
              />

              <p className="text-sm font-medium leading-6 text-slate-200">
                {roleName}
              </p>
            </div>
          )}

          {/* Social Links */}
          {(githubUrl || linkedinUrl || portfolioUrl) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub profile for ${displayName}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-brand-300"
                >
                  <FaGithub size={15} aria-hidden="true" />
                  GitHub
                  <ArrowUpRight size={12} />
                </a>
              )}

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn profile for ${displayName}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-brand-300"
                >
                  <FaLinkedin size={15} aria-hidden="true" />
                  LinkedIn
                  <ArrowUpRight size={12} />
                </a>
              )}

              {portfolioUrl && (
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Personal portfolio for ${displayName}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-brand-300"
                >
                  <ExternalLink size={14} />
                  Portfolio
                  <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          )}

          {/* Introduction */}
          {introduction && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                {copy.introduction}
              </h4>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {introduction}
              </p>
            </div>
          )}

          {/* Biography */}
          {biography && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                {copy.biography}
              </h4>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {biography}
              </p>
            </div>
          )}

          {/* Skills */}
          {skillGroups.length > 0 && (
            <div className="mt-7 border-t border-border-subtle pt-6">
              <div className="mb-4 flex items-center gap-2">
                <Code2 size={16} className="text-brand-300" />

                <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  {copy.skills}
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
          )}

          {/* Responsibilities */}
          {responsibilities.length > 0 && (
            <div className="mt-7 border-t border-border-subtle pt-6">
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                {copy.responsibilities}
              </h4>

              <ul className="mt-4 space-y-3">
                {responsibilities.map((responsibility, responsibilityIndex) => (
                  <li
                    key={`${member.id}-responsibility-${responsibilityIndex}`}
                    className="flex items-start gap-2.5"
                  >
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <span className="text-xs leading-6 text-slate-400">
                      {responsibility}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Individual Projects */}
          {projects.length > 0 && (
            <section className="mt-auto border-t border-border-subtle pt-7">
              <div className="mb-4 flex items-center gap-2">
                <BriefcaseBusiness
                  size={16}
                  className="text-brand-300"
                />

                <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  {copy.projects}
                </h4>

                <span className="ml-auto rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-slate-400">
                  {projects.length}
                </span>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    memberName={displayName}
                    language={language}
                    copy={{
                      webDemo: copy.webDemo,
                      sourceCode: copy.sourceCode,
                      noImage: copy.noImage,
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </article>
  )
}

export default MemberCard
