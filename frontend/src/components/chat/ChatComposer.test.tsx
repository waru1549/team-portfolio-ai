
/**
 * @vitest-environment jsdom
 */

import { useState, type FormEvent } from 'react'

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  cleanup,
  render,
  screen,
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom/vitest'

import { LanguageProvider } from '../../contexts/LanguageProvider'

import ChatComposer from './ChatComposer'

// =========================================
// TEST HARNESS
// =========================================

type TestLanguage = 'en' | 'th'

interface HarnessProps {
  isLoading?: boolean
  language?: TestLanguage
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function ChatComposerHarness({
  isLoading = false,
  language = 'en',
  onSubmit,
}: HarnessProps) {
  const [value, setValue] = useState('')

  window.localStorage.setItem(
    'team-portfolio-ai-language',
    language,
  )

  return (
    <LanguageProvider>
      <ChatComposer
        value={value}
        isLoading={isLoading}
        onChange={setValue}
        onSubmit={onSubmit}
      />
    </LanguageProvider>
  )
}

// =========================================
// TEST SETUP
// =========================================

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
})

// =========================================
// CHAT COMPOSER TESTS
// =========================================

describe('ChatComposer Component', () => {

  // TEST 1: RENDER ENGLISH INPUT

  it('should render the English message input correctly', () => {
    const onSubmit = vi.fn()

    render(
      <ChatComposerHarness onSubmit={onSubmit} />,
    )

    expect(
      screen.getByRole('textbox', {
        name: 'Type your message',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(
        'Ask anything about our team...',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Enter to send · Shift + Enter for a new line',
      ),
    ).toBeInTheDocument()
  })

  // TEST 2: TYPE MESSAGE

  it('should update the input when the user types', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ChatComposerHarness onSubmit={onSubmit} />,
    )

    const textarea = screen.getByRole('textbox', {
      name: 'Type your message',
    })

    await user.type(textarea, 'Hello team')

    expect(textarea).toHaveValue('Hello team')

    expect(
      screen.getByText('10/2000 characters'),
    ).toBeInTheDocument()
  })

  // TEST 3: DISABLE EMPTY SUBMISSION

  it('should disable the send button when the input is empty', () => {
    const onSubmit = vi.fn()

    render(
      <ChatComposerHarness onSubmit={onSubmit} />,
    )

    expect(
      screen.getByRole('button', {
        name: 'Send message',
      }),
    ).toBeDisabled()
  })

  // TEST 4: CLICK SEND BUTTON

  it('should submit the form when the send button is clicked', async () => {
    const user = userEvent.setup()

    const onSubmit = vi.fn(
      (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
      },
    )

    render(
      <ChatComposerHarness onSubmit={onSubmit} />,
    )

    const textarea = screen.getByRole('textbox', {
      name: 'Type your message',
    })

    await user.type(textarea, 'Hello team')

    await user.click(
      screen.getByRole('button', {
        name: 'Send message',
      }),
    )

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  // TEST 5: ENTER KEY

  it('should submit the form when Enter is pressed', async () => {
    const user = userEvent.setup()

    const onSubmit = vi.fn(
      (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
      },
    )

    render(
      <ChatComposerHarness onSubmit={onSubmit} />,
    )

    const textarea = screen.getByRole('textbox', {
      name: 'Type your message',
    })

    await user.type(textarea, 'Hello team')

    await user.keyboard('{Enter}')

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  // TEST 6: SHIFT + ENTER

  it('should insert a new line when Shift + Enter is pressed', async () => {
    const user = userEvent.setup()

    const onSubmit = vi.fn(
      (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
      },
    )

    render(
      <ChatComposerHarness onSubmit={onSubmit} />,
    )

    const textarea = screen.getByRole('textbox', {
      name: 'Type your message',
    })

    await user.type(textarea, 'Hello')

    await user.keyboard('{Shift>}{Enter}{/Shift}')

    expect(textarea).toHaveValue('Hello\n')

    expect(onSubmit).not.toHaveBeenCalled()
  })

  // TEST 7: LOADING STATE

  it('should disable input and send button while loading', () => {
    const onSubmit = vi.fn()

    render(
      <ChatComposerHarness
        isLoading={true}
        onSubmit={onSubmit}
      />,
    )

    expect(
      screen.getByRole('textbox', {
        name: 'Type your message',
      }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', {
        name: 'Send message',
      }),
    ).toBeDisabled()
  })

  // TEST 8: THAI LANGUAGE

  it('should display Thai composer labels and helper text', () => {
    const onSubmit = vi.fn()

    render(
      <ChatComposerHarness
        language="th"
        onSubmit={onSubmit}
      />,
    )

    expect(
      screen.getByRole('textbox', {
        name: 'พิมพ์ข้อความของคุณ',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(
        'ถามอะไรก็ได้เกี่ยวกับทีมของเรา...',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'ส่งข้อความ',
      }),
    ).toBeDisabled()

    expect(
      screen.getByText(
        'กด Enter เพื่อส่ง · Shift + Enter เพื่อขึ้นบรรทัดใหม่',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText('0/2000 ตัวอักษร'),
    ).toBeInTheDocument()
  })

  // TEST 9: THAI CHARACTER COUNT

  it('should update the character count in Thai', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ChatComposerHarness
        language="th"
        onSubmit={onSubmit}
      />,
    )

    const textarea = screen.getByRole('textbox', {
      name: 'พิมพ์ข้อความของคุณ',
    })

    await user.type(textarea, 'สวัสดี')

    expect(
      screen.getByText('6/2000 ตัวอักษร'),
    ).toBeInTheDocument()

    expect(textarea).toHaveValue('สวัสดี')
  })

})
