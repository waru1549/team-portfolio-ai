/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'

import { LanguageProvider } from '../../contexts/LanguageProvider'
import { portfolioData } from '../../data/portfolioData'
import MemberSection from './MemberSection'

type TestLanguage = 'en' | 'th'

function renderMemberSection(language: TestLanguage) {
  window.localStorage.setItem('team-portfolio-ai-language', language)

  return render(
    <LanguageProvider>
      <MemberSection />
    </LanguageProvider>,
  )
}

describe('MemberSection Component', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should display the English section content by default', () => {
    renderMemberSection('en')

    expect(
      screen.getByText('THE PEOPLE BEHIND THE WORK'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Meet our team members.' }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Different skills, complementary perspectives, and one shared vision. Get to know the people behind our work.',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        `${portfolioData.members.length} team members · One shared direction`,
      ),
    ).toBeInTheDocument()
  })

  it('should display the Thai section content when Thai is selected', () => {
    renderMemberSection('th')

    expect(
      screen.getByText('ผู้คนเบื้องหลังผลงานของเรา'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'ทำความรู้จักกับสมาชิกในทีม' }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'ทักษะที่หลากหลาย มุมมองที่เสริมกัน และวิสัยทัศน์เดียวกัน มาทำความรู้จักกับผู้คนที่อยู่เบื้องหลังผลงานของเรา',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        `${portfolioData.members.length} สมาชิก · หนึ่งเป้าหมายร่วมกัน`,
      ),
    ).toBeInTheDocument()
  })

  it('should render all three team member cards', () => {
    renderMemberSection('en')

    expect(portfolioData.members).toHaveLength(3)

    expect(
      document.querySelectorAll(
        '#members article[aria-labelledby^="member-"]',
      ),
    ).toHaveLength(3)
  })
})