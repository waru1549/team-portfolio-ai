
import {
  ArrowUpRight,
  ExternalLink,
  FolderKanban,
  Users,
} from 'lucide-react'

import { FaGithub } from 'react-icons/fa'

import { useLanguage } from '../../contexts/language-context'

import {
  getLocalizedText,
  portfolioData,
} from '../../data/portfolioData'

import type {
  Language,
  TeamProject,
} from '../../data/portfolioData'

interface ProjectCopy {
  eyebrow: string
  heading: string
  headingAccent: string
  description: string
  projectsCount: string
  noProjects: string
  noImage: string
  featured: string
  planned: string
  inProgress: string
  completed: string
  contributors: (count: number) => string
  technologies: string
  features: string
  result: string
  sourceCode: string
  liveDemo: string
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

function getProjectCopy(language: Language): ProjectCopy {
  if (language === 'th') {
    return {
      eyebrow: 'ผลงานของทีม',
      heading: 'ผลงานที่เราร่วมกัน',
      headingAccent: 'สร้างสรรค์ขึ้น',
      description:
        'สำรวจโปรเจกต์และประสบการณ์ที่สมาชิกในทีมร่วมกันออกแบบและพัฒนา',
      projectsCount: 'โปรเจกต์',
      noProjects:
        'ผลงานของทีมจะแสดงที่นี่เมื่อมีการเพิ่มและยืนยันข้อมูลเรียบร้อยแล้ว',
      noImage: 'ไม่มีภาพตัวอย่าง',
      featured: 'ผลงานเด่น',
      planned: 'วางแผนไว้',
      inProgress: 'กำลังพัฒนา',
      completed: 'เสร็จสมบูรณ์',
      contributors: (count) => `${count} สมาชิกที่ร่วมพัฒนา`,
      technologies: 'เทคโนโลยีที่ใช้',
      features: 'ฟีเจอร์หลัก',
      result: 'ผลลัพธ์',
      sourceCode: 'ดู Source Code',
      liveDemo: 'ทดลองใช้งาน',
    }
  }

  return {
    eyebrow: 'PROJECT SHOWCASE',
    heading: 'Projects we',
    headingAccent: 'build together.',
    description:
      'Explore the projects and experiences our team designs and develops collaboratively.',
    projectsCount: 'projects',
    noProjects:
      'Team projects will appear here after their information has been added and verified.',
    noImage: 'No preview image',
    featured: 'Featured Project',
    planned: 'Planned',
    inProgress: 'In Progress',
    completed: 'Completed',
    contributors: (count) => `${count} contributors`,
    technologies: 'Technologies',
    features: 'Key Features',
    result: 'Project Result',
    sourceCode: 'Source Code',
    liveDemo: 'Live Demo',
  }
}

interface ProjectCardProps {
  project: TeamProject
  language: Language
  copy: ProjectCopy
}

function ProjectCard({
  project,
  language,
  copy,
}: ProjectCardProps) {
  const title = getLocalizedText(project.title, language)
  const description = getLocalizedText(
    project.description,
    language,
  )

  const projectType = project.projectType
    ? getLocalizedText(project.projectType, language)
    : ''

  const result = project.result
    ? getLocalizedText(project.result, language)
    : ''

  const statusLabels = {
    planned: copy.planned,
    'in-progress': copy.inProgress,
    completed: copy.completed,
  }

  const repositoryUrl = getSafeExternalUrl(
    project.repositoryUrl,
  )

  const demoUrl = getSafeExternalUrl(project.demoUrl)

  return (
    <article
      aria-labelledby={`team-project-${project.id}`}
      className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-900 transition duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      {/* Project Cover */}
      <div className="relative h-52 overflow-hidden bg-linear-to-br from-brand-500/15 to-accent-cyan/5">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={`${title} preview`}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center">
            <div className="text-center">
              <FolderKanban
                size={38}
                className="mx-auto text-brand-300"
                aria-hidden="true"
              />
              <p className="mt-3 text-xs text-slate-500">
                {copy.noImage}
              </p>
            </div>
          </div>
        )}

        {project.isFeatured && (
          <span className="absolute left-4 top-4 rounded-full border border-brand-300/20 bg-ink-950/80 px-3 py-1.5 text-[10px] font-semibold text-brand-300 backdrop-blur">
            {copy.featured}
          </span>
        )}
      </div>

      {/* Project Information */}
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          {projectType && (
            <span className="rounded-full bg-brand-500/10 px-3 py-1.5 text-[10px] font-semibold text-brand-300">
              {projectType}
            </span>
          )}

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-slate-300">
            {statusLabels[project.status]}
          </span>

          {project.year && (
            <span className="text-[10px] text-slate-500">
              {project.year}
            </span>
          )}
        </div>

        <h3
          id={`team-project-${project.id}`}
          className="mt-5 wrap-break-word font-display text-xl font-semibold text-white sm:text-2xl"
        >
          {title}
        </h3>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          {description}
        </p>

        {/* Contributors */}
        <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
          <Users
            size={15}
            className="shrink-0 text-brand-300"
            aria-hidden="true"
          />
          {copy.contributors(project.contributors.length)}
        </div>

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <div className="mt-7">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
              {copy.features}
            </h4>

            <ul className="mt-3 space-y-2">
              {project.features.map((feature, index) => (
                <li
                  key={`${project.id}-feature-${index}`}
                  className="flex items-start gap-2 text-xs leading-6 text-slate-400"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-300"
                  />
                  {getLocalizedText(feature, language)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Project Result */}
        {result && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/3 p-4">
            <h4 className="text-xs font-semibold text-brand-300">
              {copy.result}
            </h4>

            <p className="mt-2 text-xs leading-6 text-slate-400">
              {result}
            </p>
          </div>
        )}

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="mt-7 border-t border-white/10 pt-5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
              {copy.technologies}
            </h4>

            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={`${project.id}-${technology}`}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* External Links */}
        {(repositoryUrl || demoUrl) && (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
            {repositoryUrl && (
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${copy.sourceCode}: ${title}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                <FaGithub size={15} aria-hidden="true" />
                {copy.sourceCode}
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            )}

            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${copy.liveDemo}: ${title}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                <ExternalLink size={14} aria-hidden="true" />
                {copy.liveDemo}
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function TeamProjectSection() {
  const { language } = useLanguage()
  const copy = getProjectCopy(language)

  const projects = portfolioData.teamProjects.filter(
    (project) => !project.isPlaceholder,
  )

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-hidden px-5 py-20 sm:py-28 lg:px-8"
    >
      {/* Background Decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 -z-10 size-96 rounded-full bg-brand-500/5 blur-[120px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-xs font-semibold tracking-[0.15em] text-brand-300">
            <FolderKanban size={14} aria-hidden="true" />
            {copy.eyebrow}
          </div>

          <h2
            id="projects-heading"
            className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          >
            {copy.heading}{' '}
            <span className="mt-2 block text-brand-300">
              {copy.headingAccent}
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
            {copy.description}
          </p>

          {projects.length > 0 && (
            <p className="mt-4 text-xs font-medium text-slate-400">
              {projects.length} {copy.projectsCount}
            </p>
          )}
        </div>

        {/* Project Cards */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                language={language}
                copy={copy}
              />
            ))}
          </div>
        ) : (
          <div
            role="status"
            className="rounded-2xl border border-border-subtle bg-surface-900 px-6 py-12 text-center"
          >
            <FolderKanban
              size={30}
              className="mx-auto text-slate-500"
              aria-hidden="true"
            />
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {copy.noProjects}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default TeamProjectSection
