
/**
 * @vitest-environment jsdom
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  act,
  cleanup,
  render,
  screen,
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom/vitest'

import { MemoryRouter } from 'react-router'

import ChatPage from './ChatPage'

import { LanguageProvider } from '../contexts/LanguageProvider'

import { sendChatMessage } from '../services/chatApi'

import type { ChatApiResponse } from '../types/chat'

// =========================================
// MOCK API SERVICE
// =========================================

vi.mock('../services/chatApi', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../services/chatApi')>()

  return {
    ...actual,
    sendChatMessage: vi.fn(),
  }
})

const mockSendChatMessage = vi.mocked(sendChatMessage)

// =========================================
// TEST HELPERS
// =========================================


type TestLanguage = 'en' | 'th'

function renderChatPage(language: TestLanguage = 'en') {
  window.localStorage.setItem(
    'team-portfolio-ai-language',
    language,
  )

  return render(
    <LanguageProvider>
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

function createDeferred<T>() {
  let resolve!: (value: T) => void

  const promise = new Promise<T>((res) => {
    resolve = res
  })

  return {
    promise,
    resolve,
  }
}

async function sendMessage(
  user: ReturnType<typeof userEvent.setup>,
  message: string,
) {
  const textarea = screen.getByRole('textbox', {
    name: 'Type your message',
  })

  await user.type(textarea, message)

  await user.click(
    screen.getByRole('button', {
      name: 'Send message',
    }),
  )
}

// =========================================
// TEST SETUP
// =========================================

beforeEach(() => {
  mockSendChatMessage.mockReset()

  // JSDOM does not implement scrollIntoView.
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  })
})

afterEach(() => {
  cleanup()
})

// =========================================
// CHAT PAGE TESTS
// =========================================

describe('ChatPage Component', () => {

  it('should display Thai chat page content', () => {
    renderChatPage('th')

    expect(
      screen.getByRole('heading', {
        name: 'ผู้ช่วย AI ประจำทีม',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'วันนี้ให้เราช่วยอะไรได้บ้าง?',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'เริ่มบทสนทนาใหม่',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('รอการเชื่อมต่อ Backend'),
    ).toBeInTheDocument()
  })

  it('should use Thai suggested prompts', async () => {
    const user = userEvent.setup()

    renderChatPage('th')

    await user.click(
      screen.getByRole('button', {
        name: 'ใครเป็นสมาชิกในทีมนี้บ้าง?',
      }),
    )

    expect(
      screen.getByRole('textbox', {
        name: 'พิมพ์ข้อความของคุณ',
      }),
    ).toHaveValue('ใครเป็นสมาชิกในทีมนี้บ้าง?')

    expect(mockSendChatMessage).not.toHaveBeenCalled()
  })

  // TEST 1: EMPTY STATE

  it('should display the empty state and suggested questions', () => {

    renderChatPage()

    expect(
      screen.getByRole('heading', {
        name: 'How can we help you?',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Who are the members of this team?',
      }),
    ).toBeInTheDocument()

    expect(mockSendChatMessage).not.toHaveBeenCalled()

  })

  // TEST 2: SUGGESTED PROMPT

  it('should put a suggested question into the input', async () => {

    const user = userEvent.setup()

    renderChatPage()

    await user.click(
      screen.getByRole('button', {
        name: 'Who are the members of this team?',
      }),
    )

    expect(
      screen.getByRole('textbox', {
        name: 'Type your message',
      }),
    ).toHaveValue('Who are the members of this team?')

    // Clicking a suggestion must not send it automatically.
    expect(mockSendChatMessage).not.toHaveBeenCalled()

  })

  // TEST 3: SUCCESSFUL MESSAGE

  it('should display user and assistant messages after a successful request', async () => {

    const user = userEvent.setup()

    mockSendChatMessage.mockResolvedValueOnce({
      reply: 'Our team consists of three members.',
      conversationId: 'conversation-001',
    })

    renderChatPage()

    await sendMessage(
      user,
      'Who are the team members?',
    )

    // User message
    expect(
      screen.getByText('Who are the team members?'),
    ).toBeInTheDocument()

    // Assistant response
    expect(
      await screen.findByText(
        'Our team consists of three members.',
      ),
    ).toBeInTheDocument()

    expect(mockSendChatMessage).toHaveBeenCalledWith({
      message: 'Who are the team members?',
    })

  })

  // TEST 4: LOADING STATE

  it('should display the loading indicator while waiting for the API', async () => {

    const user = userEvent.setup()

    const pending = createDeferred<ChatApiResponse>()

    mockSendChatMessage.mockReturnValueOnce(
      pending.promise,
    )

    renderChatPage()

    await sendMessage(
      user,
      'Tell me about the team.',
    )

    // Loading Indicator
    expect(
      screen.getByRole('status'),
    ).toBeInTheDocument()

    // Input must be disabled during loading
    expect(
      screen.getByRole('textbox', {
        name: 'Type your message',
      }),
    ).toBeDisabled()

    // Resolve the mocked backend response
    await act(async () => {
      pending.resolve({
        reply: 'Our team builds digital experiences.',
        conversationId: 'conversation-002',
      })

      await pending.promise
    })

    expect(
      await screen.findByText(
        'Our team builds digital experiences.',
      ),
    ).toBeInTheDocument()

  })

  // TEST 5: ERROR AND RETRY

  it('should display an error and retry a failed request', async () => {

    const user = userEvent.setup()

    mockSendChatMessage
      .mockRejectedValueOnce(
        new Error('Backend is unavailable.'),
      )
      .mockResolvedValueOnce({
        reply: 'The retry was successful.',
        conversationId: 'conversation-003',
      })

    renderChatPage()

    await sendMessage(
      user,
      'Tell me about your team.',
    )

    // Error Message
    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('Backend is unavailable.')

    // Retry Request
    await user.click(
      screen.getByRole('button', {
        name: 'Retry',
      }),
    )

    // Verify Successful Retry
    expect(
      await screen.findByText(
        'The retry was successful.',
      ),
    ).toBeInTheDocument()

    expect(mockSendChatMessage).toHaveBeenCalledTimes(2)

  })

  // TEST 6: CONVERSATION ID AND NEW CHAT

  it('should reuse conversation ID and reset it when starting a new chat', async () => {

    const user = userEvent.setup()

    mockSendChatMessage
      .mockResolvedValueOnce({
        reply: 'First conversation response.',
        conversationId: 'conversation-100',
      })
      .mockResolvedValueOnce({
        reply: 'Follow-up response.',
        conversationId: 'conversation-100',
      })
      .mockResolvedValueOnce({
        reply: 'Fresh conversation response.',
        conversationId: 'conversation-200',
      })

    renderChatPage()

    // First message
    await sendMessage(
      user,
      'First question',
    )

    expect(
      await screen.findByText(
        'First conversation response.',
      ),
    ).toBeInTheDocument()

    // Follow-up message
    await sendMessage(
      user,
      'Follow-up question',
    )

    expect(
      await screen.findByText(
        'Follow-up response.',
      ),
    ).toBeInTheDocument()

    // Reuse previous conversation ID
    expect(mockSendChatMessage).toHaveBeenNthCalledWith(
      2,
      {
        message: 'Follow-up question',
        conversationId: 'conversation-100',
      },
    )

    // Start a new conversation
    await user.click(
      screen.getByRole('button', {
        name: 'Start a new conversation',
      }),
    )

    // Previous messages must disappear
    expect(
      screen.queryByText('First conversation response.'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Follow-up response.'),
    ).not.toBeInTheDocument()

    // Empty State returns
    expect(
      screen.getByRole('heading', {
        name: 'How can we help you?',
      }),
    ).toBeInTheDocument()

    // Send message in a fresh conversation
    await sendMessage(
      user,
      'Start a fresh conversation',
    )

    expect(
      await screen.findByText(
        'Fresh conversation response.',
      ),
    ).toBeInTheDocument()

    // Old conversation ID must not be reused
    expect(mockSendChatMessage).toHaveBeenNthCalledWith(
      3,
      {
        message: 'Start a fresh conversation',
      },
    )

  })

})
