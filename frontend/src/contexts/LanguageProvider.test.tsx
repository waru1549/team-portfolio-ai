
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
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { LanguageProvider } from './LanguageProvider'
import { useLanguage } from './language-context'

const LANGUAGE_STORAGE_KEY = 'team-portfolio-ai-language'

function LanguageProbe() {
  const { language, setLanguage } = useLanguage()

  return (
    <div>
      <output data-testid="current-language">
        {language}
      </output>

      <button
        type="button"
        onClick={() => setLanguage('th')}
      >
        Switch to Thai
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
      >
        Switch to English
      </button>
    </div>
  )
}

function renderLanguageProvider() {
  return render(
    <LanguageProvider>
      <LanguageProbe />
    </LanguageProvider>,
  )
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('lang')
  })

  afterEach(() => {
    cleanup()
    window.localStorage.clear()
    document.documentElement.removeAttribute('lang')
  })

  it('should use English by default', () => {
    renderLanguageProvider()

    expect(screen.getByTestId('current-language'))
      .toHaveTextContent('en')

    expect(document.documentElement.lang).toBe('en')

    expect(
      window.localStorage.getItem(LANGUAGE_STORAGE_KEY),
    ).toBe('en')
  })

  it('should restore Thai from localStorage', () => {
    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      'th',
    )

    renderLanguageProvider()

    expect(screen.getByTestId('current-language'))
      .toHaveTextContent('th')

    expect(document.documentElement.lang).toBe('th')
  })

  it('should save Thai when the language changes', () => {
    renderLanguageProvider()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Switch to Thai',
      }),
    )

    expect(screen.getByTestId('current-language'))
      .toHaveTextContent('th')

    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
      .toBe('th')

    expect(document.documentElement.lang).toBe('th')
  })

  it('should switch back to English', () => {
    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      'th',
    )

    renderLanguageProvider()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Switch to English',
      }),
    )

    expect(screen.getByTestId('current-language'))
      .toHaveTextContent('en')

    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
      .toBe('en')

    expect(document.documentElement.lang).toBe('en')
  })

  it('should fall back to English for an invalid saved language', () => {
    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      'fr',
    )

    renderLanguageProvider()

    expect(screen.getByTestId('current-language'))
      .toHaveTextContent('en')

    expect(document.documentElement.lang).toBe('en')
  })
})
