
/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { within } from '@testing-library/react'

import { LanguageProvider } from '../../contexts/LanguageProvider'
import TeamProjectSection from './TeamProjectSection'

type TestLanguage = 'en' | 'th'

function renderTeamProjectSection(language: TestLanguage) {
  window.localStorage.setItem(
    'team-portfolio-ai-language',
    language,
  )

  return render(
    <LanguageProvider>
      <TeamProjectSection />
    </LanguageProvider>,
  )
}

describe('TeamProjectSection Component', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should display the English project section', () => {
    renderTeamProjectSection('en')

    expect(
      screen.getByText('PROJECT SHOWCASE'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Projects we build together.',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Chat AI with Group Portfolio',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('In Progress'),
    ).toBeInTheDocument()
  })

  it('should display Thai content when Thai is selected', () => {
    renderTeamProjectSection('th')

    expect(
      screen.getByText('ผลงานของทีม'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'ผลงานที่เราร่วมกัน สร้างสรรค์ขึ้น',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'แชต AI พร้อม Portfolio ของกลุ่ม',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('กำลังพัฒนา'),
    ).toBeInTheDocument()
  })

  it('should display project technologies and features', () => {
    renderTeamProjectSection('en')

    const projectHeading = screen.getByRole('heading', {
      name: 'Chat AI with Group Portfolio',
    })

    const projectCard = projectHeading.closest('article')

    expect(projectCard).not.toBeNull()

    expect(
      within(projectCard!).getByText('React'),
    ).toBeInTheDocument()

    expect(
      within(projectCard!).getByText('TypeScript'),
    ).toBeInTheDocument()

    expect(
      within(projectCard!).getByText('Key Features'),
    ).toBeInTheDocument()

    expect(
      within(projectCard!).getByText(
        'Interactive chat interface with loading and error states',
      ),
    ).toBeInTheDocument()
  })
})
