
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

import { LanguageProvider } from '../../contexts/LanguageProvider'
import TeamIntroduction from './TeamIntroduction'

const LANGUAGE_STORAGE_KEY = 'team-portfolio-ai-language'

function renderTeamIntroduction() {
  return render(
    <LanguageProvider>
      <TeamIntroduction />
    </LanguageProvider>,
  )
}

describe('TeamIntroduction Component', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    window.localStorage.clear()
  })

  it('should display the English introduction by default', () => {
    renderTeamIntroduction()

    expect(
      screen.getByRole('heading', {
        name: 'A little about our team',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Our team introduction will be added after all members confirm the group profile.',
      ),
    ).toBeInTheDocument()
  })

  it('should display Thai content when Thai is selected', () => {
    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      'th',
    )

    renderTeamIntroduction()

    expect(
      screen.getByRole('heading', {
        name: 'รู้จักทีมของเรา',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'ข้อมูลแนะนำทีมจะเพิ่มเติมหลังจากสมาชิกยืนยันข้อมูลของกลุ่มเรียบร้อยแล้ว',
      ),
    ).toBeInTheDocument()
  })

  it('should display the confirmed team member count', () => {
    renderTeamIntroduction()

    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('TEAM MEMBERS')).toBeInTheDocument()
  })

  it('should not display unverified sample core strengths', () => {
    renderTeamIntroduction()

    expect(
      screen.queryByText(
        'Cross-functional collaboration with clear API contracts',
      ),
    ).not.toBeInTheDocument()

    expect(
      screen.getByText(
        'Our confirmed team strengths will appear here after the members review their skills and collaboration.',
      ),
    ).toBeInTheDocument()
  })
})
