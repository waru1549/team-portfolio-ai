
/** @vitest-environment jsdom */

import '@testing-library/jest-dom/vitest'

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import {
  cleanup,
  render,
  screen,
  within,
} from '@testing-library/react'

import { LanguageProvider } from '../../contexts/LanguageProvider'

import MemberCard from './MemberCard'

import type { Member } from '../../data/portfolioData'

import { portfolioData } from '../../data/portfolioData'

const LANGUAGE_STORAGE_KEY = 'team-portfolio-ai-language'

const verifiedMember: Member = {
  id: 'member-1',
  roleKey: 'frontend',
  fullName: 'Taylor Example',
  nickname: 'Taylor',
  roleName: 'Frontend Developer',
  roleNameI18n: {
    en: 'Frontend Developer',
    th: 'นักพัฒนา Frontend',
  },
  introduction: {
    en: 'I build accessible web applications.',
    th: 'ฉันพัฒนาเว็บแอปพลิเคชันที่ทุกคนเข้าถึงได้',
  },
  biography: {
    en: 'I enjoy solving problems with technology.',
    th: 'ฉันชอบแก้ปัญหาด้วยเทคโนโลยี',
  },
  avatar: undefined,
  socialLinks: {
    github: 'https://github.com/taylor-example',
    linkedin: 'https://www.linkedin.com/in/taylor-example',
  },
  themeColor: {
    primary: '#22d3ee',
    secondary: '#6366f1',
    glow: 'rgba(34, 211, 238, 0.35)',
  },
  skills: {
    core: ['React', 'TypeScript'],
    designAndAnimation: ['Figma'],
    tools: ['Vite'],
  },
  currentContributions: ['Building frontend components'],
  responsibilities: [
    {
      en: 'Building reusable frontend components',
      th: 'พัฒนา Frontend Components ที่นำกลับมาใช้ซ้ำได้',
    },
  ],
  previousProject: {
    title: 'Legacy Project',
    description: 'Legacy description',
    isPlaceholder: true,
  },
  projects: [
    {
      id: 'taylor-project-1',
      title: {
        en: 'Personal Portfolio Website',
        th: 'เว็บไซต์ Portfolio ส่วนตัว',
      },
      description: {
        en: 'A responsive personal portfolio website.',
        th: 'เว็บไซต์ Portfolio ส่วนตัวที่รองรับหน้าจอหลายขนาด',
      },
      projectType: {
        en: 'Web Application',
        th: 'เว็บแอปพลิเคชัน',
      },
      year: 2025,
      technologies: ['React', 'TypeScript'],
      repositoryUrl: 'https://github.com/taylor-example/portfolio',
      demoUrl: 'https://example.com',
      isPlaceholder: false,
    },
  ],
  isPlaceholder: false,
}

function renderMemberCard(
  member: Member,
  language: 'en' | 'th' = 'en',
) {
  window.localStorage.setItem(
    LANGUAGE_STORAGE_KEY,
    language,
  )

  return render(
    <LanguageProvider>
      <MemberCard member={member} index={0} />
    </LanguageProvider>,
  )
}

describe('MemberCard Component', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    window.localStorage.clear()
  })

  it('should hide unverified placeholder member information', () => {
    const placeholderMember = portfolioData.members[0]

    renderMemberCard(placeholderMember)

    expect(
      screen.getByRole('heading', {
        name: 'Member 01',
      }),
    ).toBeInTheDocument()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Member profile information will appear after the team confirms the details.',
    )

    expect(
      screen.queryByText('Alex Frontier'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('E-Commerce Minimalist Dashboard'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('link', { name: /GitHub/ }),
    ).not.toBeInTheDocument()
  })

  it('should display verified member information in English', () => {
    renderMemberCard(verifiedMember, 'en')

    expect(
      screen.getByRole('heading', {
        name: 'Taylor Example',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Frontend Developer'),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'I build accessible web applications.',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Current Responsibilities'),
    ).toBeInTheDocument()
  })

  it('should display localized member information in Thai', () => {
    renderMemberCard(verifiedMember, 'th')

    expect(
      screen.getByText('นักพัฒนา Frontend'),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'ฉันพัฒนาเว็บแอปพลิเคชันที่ทุกคนเข้าถึงได้',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'พัฒนา Frontend Components ที่นำกลับมาใช้ซ้ำได้',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText('ผลงานส่วนตัว'),
    ).toBeInTheDocument()
  })

  it('should display GitHub and LinkedIn profile links', () => {
    renderMemberCard(verifiedMember)

    expect(
      screen.getByRole('link', {
        name: 'GitHub profile for Taylor Example',
      }),
    ).toHaveAttribute(
      'href',
      'https://github.com/taylor-example',
    )

    expect(
      screen.getByRole('link', {
        name: 'LinkedIn profile for Taylor Example',
      }),
    ).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/taylor-example',
    )
  })

  it('should display individual project details and links', () => {
    renderMemberCard(verifiedMember)

    expect(
      screen.getByRole('heading', {
        name: 'Personal Portfolio Website',
      }),
    ).toBeInTheDocument()

    const projectsSection = screen
      .getByRole('heading', {
        name: 'Individual Projects',
      })
      .closest('section')

    expect(projectsSection).not.toBeNull()

    expect(
      within(projectsSection!).getByText('React'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: 'Source Code: Personal Portfolio Website',
      }),
    ).toHaveAttribute(
      'href',
      'https://github.com/taylor-example/portfolio',
    )

    expect(
      screen.getByRole('link', {
        name: 'Live Demo: Personal Portfolio Website',
      }),
    ).toHaveAttribute(
      'href',
      'https://example.com',
    )
  })

  it('should hide unavailable social links and empty project lists', () => {
    const memberWithoutOptionalLinks: Member = {
      ...verifiedMember,
      socialLinks: {},
      projects: [],
    }

    renderMemberCard(memberWithoutOptionalLinks)

    expect(
      screen.queryByRole('link', {
        name: /GitHub profile/,
      }),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('link', {
        name: /LinkedIn profile/,
      }),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Individual Projects'),
    ).not.toBeInTheDocument()
  })
})
