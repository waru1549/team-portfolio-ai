
/**
 * @vitest-environment jsdom
 */

import { useState, type FormEvent } from 'react'

import {
  afterEach,
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

import ChatComposer from './ChatComposer'

// =========================================
// TEST HARNESS
// =========================================

interface HarnessProps {
  isLoading?: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function ChatComposerHarness({
  isLoading = false,
  onSubmit,
}: HarnessProps) {
  const [value, setValue] = useState('')

  return (
    <ChatComposer
      value={value}
      isLoading={isLoading}
      onChange={setValue}
      onSubmit={onSubmit}
    />
  )
}

// Clean up after every test
afterEach(() => {
  cleanup()
})

// =========================================
// CHAT COMPOSER TESTS
// =========================================

describe('ChatComposer Component', () => {

  // TEST 1: RENDER INPUT

  it('should render the message input correctly', () => {

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

})
