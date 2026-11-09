
/**
 * @vitest-environment jsdom
 */

import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest'

import {
  cleanup,
  render,
  screen,
} from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import MessageBubble from './MessageBubble'

import type { ChatMessage } from '../../types/chat'

// Clean up rendered components after every test
afterEach(() => {
  cleanup()
})

// Test Data
const userMessage: ChatMessage = {
  id: 'user-message-001',
  role: 'user',
  content: 'Who are the team members?',
  createdAt: '2026-11-09T12:30:00.000Z',
}

const assistantMessage: ChatMessage = {
  id: 'assistant-message-001',
  role: 'assistant',
  content: 'Our team consists of three members.',
  createdAt: '2026-11-09T12:31:00.000Z',
}

// =========================================
// MESSAGE BUBBLE TESTS
// =========================================

describe('MessageBubble Component', () => {

  // TEST 1: USER MESSAGE

  it('should display a user message correctly', () => {

    render(
      <MessageBubble message={userMessage} />,
    )

    expect(
      screen.getByText('You'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Who are the team members?'),
    ).toBeInTheDocument()

  })

  // TEST 2: ASSISTANT MESSAGE

  it('should display an assistant message correctly', () => {

    render(
      <MessageBubble message={assistantMessage} />,
    )

    expect(
      screen.getByText('Team AI'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Our team consists of three members.'),
    ).toBeInTheDocument()

  })

  // TEST 3: MESSAGE TIMESTAMP

  it('should display the correct message timestamp', () => {

    render(
      <MessageBubble message={userMessage} />,
    )

    const timestamp = document.querySelector('time')

    expect(timestamp).toBeInTheDocument()

    expect(timestamp).toHaveAttribute(
      'datetime',
      userMessage.createdAt,
    )

  })

})
