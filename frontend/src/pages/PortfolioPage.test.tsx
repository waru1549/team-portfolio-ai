
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
} from '@testing-library/react'

import { MemoryRouter } from 'react-router'

import { LanguageProvider } from '../contexts/LanguageProvider'
import PortfolioPage from './PortfolioPage'

type TestLanguage = 'en' | 'th'

function renderPortfolioPage(language: TestLanguage) {
  window.localStorage.setItem(
    'team-portfolio-ai-language',
    language,
  )

  return render(
    <LanguageProvider>
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('PortfolioPage Footer', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should display the English footer content', () => {
    renderPortfolioPage('en')

    expect(
      screen.getByText(/All rights reserved\./),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Built with React, TypeScript & Tailwind CSS.',
      ),
    ).toBeInTheDocument()
  })

  it('should display the Thai footer content', () => {
    renderPortfolioPage('th')

    expect(
      screen.getByText(/สงวนลิขสิทธิ์/),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'พัฒนาด้วย React, TypeScript และ Tailwind CSS',
      ),
    ).toBeInTheDocument()
  })
})
