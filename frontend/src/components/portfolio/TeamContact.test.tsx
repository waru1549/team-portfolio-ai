
/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { LanguageProvider } from '../../contexts/LanguageProvider'
import TeamContact from './TeamContact'

type TestLanguage = 'en' | 'th'

function renderTeamContact(language: TestLanguage) {
  window.localStorage.setItem(
    'team-portfolio-ai-language',
    language,
  )

  return render(
    <LanguageProvider>
      <MemoryRouter>
        <TeamContact />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('TeamContact Component', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should display the English contact section', () => {
    renderTeamContact('en')

    expect(
      screen.getByText("LET'S CONNECT"),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: "Have a project in mind? Let's build something meaningful.",
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: 'Talk to AI',
      }),
    ).toHaveAttribute('href', '/chat')
  })

  it('should display Thai content when Thai is selected', () => {
    renderTeamContact('th')

    expect(
      screen.getByText('มาร่วมพูดคุยกัน'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'มีโปรเจกต์อยู่ในใจหรือไม่? มาสร้างสิ่งที่มีความหมายไปด้วยกัน',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: 'พูดคุยกับ AI',
      }),
    ).toHaveAttribute('href', '/chat')
  })

  it('should hide unverified placeholder contact information', () => {
    renderTeamContact('en')

    expect(
      screen.queryByText('team.nexus.alpha@example.com'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Explore our GitHub'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('CONTACT INFORMATION'),
    ).not.toBeInTheDocument()
  })

  it('should keep the AI Chat link available when contact information is unverified', () => {
    renderTeamContact('en')

    const chatLink = screen.getByRole('link', {
      name: 'Talk to AI',
    })

    expect(chatLink).toBeInTheDocument()
    expect(chatLink).toHaveAttribute('href', '/chat')

    expect(
      screen.getAllByRole('link'),
    ).toHaveLength(1)
  })
})
