
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'

import {
  AlertCircle,
  MessageCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
} from 'lucide-react'

import Navbar from '../components/layout/Navbar'

import MessageBubble from '../components/chat/MessageBubble'
import TypingIndicator from '../components/chat/TypingIndicator'
import ChatComposer from '../components/chat/ChatComposer'

import { sendChatMessage, ChatApiException } from '../services/chatApi'

import type { ChatMessage } from '../types/chat'

const suggestedPrompts = [
  'Who are the members of this team?',
  'What are your team skills?',
  'Tell me about your collaborative project.',
]

function ChatPage() {
  // Message State
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // Input State
  const [input, setInput] = useState('')

  // Loading State
  const [isLoading, setIsLoading] = useState(false)

  // Conversation State
  const [conversationId, setConversationId] = useState<string | null>(null)

  // Error State
  const [error, setError] = useState<string | null>(null)

  // Failed Message for Retry
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)

  // Scroll Reference
  const bottomRef = useRef<HTMLDivElement>(null)

  // Automatically scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isLoading, error])

  // Send message to Express Backend
  const sendToBackend = async (content: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await sendChatMessage({
        message: content,

        ...(conversationId
          ? { conversationId }
          : {}),
      })

      // Save conversation ID for follow-up messages
      setConversationId(response.conversationId)

      // Add Assistant Response
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.reply,
        createdAt: new Date().toISOString(),
      }

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ])

      // Clear failed message after success
      setLastFailedMessage(null)

    } catch (err: unknown) {

      let errorMessage =
        'Something went wrong. Please try again.'

      if (err instanceof ChatApiException) {
        errorMessage = err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)

      // Keep message for retry
      setLastFailedMessage(content)

    } finally {
      setIsLoading(false)
    }
  }

  // Handle Message Submission
  const handleSendMessage = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const content = input.trim()

    if (!content || isLoading) {
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }

    // Add User Message
    setMessages((previous) => [
      ...previous,
      userMessage,
    ])

    // Clear Input
    setInput('')

    // Send to Backend
    await sendToBackend(content)
  }

  // Retry Failed Request
  const handleRetry = async () => {
    if (!lastFailedMessage || isLoading) {
      return
    }

    await sendToBackend(lastFailedMessage)
  }


// Start a completely new conversation
const handleNewConversation = () => {
  if (isLoading) {
    return
  }

  // Clear existing messages
  setMessages([])

  // Clear input
  setInput('')

  // Reset Backend Conversation ID
  setConversationId(null)

  // Clear previous errors
  setError(null)

  // Clear failed message
  setLastFailedMessage(null)
}

  // Handle Suggested Prompts
  const handleSuggestionClick = (prompt: string) => {
    if (!isLoading) {
      setInput(prompt)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 text-white">

      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">

        {/* Chat Header */}

        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">

              <div className="grid size-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                <Sparkles size={20} />
              </div>

              <h1 className="font-display text-2xl font-semibold text-white">
                Team AI Assistant
              </h1>

            </div>

            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Discover our team, members, skills, and projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            {/* New Conversation Button */}

            <button
              type="button"
              onClick={handleNewConversation}
              disabled={
                isLoading ||
                (messages.length === 0 && conversationId === null)
              }
              aria-label="Start a new conversation"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={15} />
              New Chat
            </button>

            {/* API Integration Status Label */}

            <div className="flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-400/5 px-3 py-2">

              <span className="size-2 rounded-full bg-brand-400" />

              <span className="text-[10px] font-semibold tracking-wide text-amber-300">
                BACKEND PENDING
              </span>

            </div>

          </div>

        </header>

        {/* Chat Container */}

        <section
          aria-label="Chat conversation"
          className="flex min-h-140 flex-1 flex-col overflow-hidden rounded-panel border border-border-subtle bg-surface-900 shadow-glow"
        >

          {/* Message Area */}

          <div
            role="log"
            aria-label="Chat conversation messages"
            aria-live="polite"
            aria-relevant="additions"
            aria-atomic="false"
            aria-busy={isLoading}
            className="min-h-105 flex-1 overflow-y-auto p-4 sm:p-6"
          >

            {messages.length === 0 ? (

              /* Empty State */

              <div className="flex min-h-97.5 flex-col items-center justify-center py-10 text-center">

                <div className="grid size-16 place-items-center rounded-2xl border border-brand-400/20 bg-brand-500/10 text-brand-300 shadow-glow">

                  <MessageCircle size={28} />

                </div>

                <h2 className="mt-6 font-display text-2xl font-semibold text-white">
                  How can we help you?
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                  Ask questions about our team members,
                  technical skills, previous projects,
                  or collaborative work.
                </p>

                {/* Suggested Questions */}

                <div className="mt-8 w-full max-w-lg">

                  <div className="mb-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Users size={14} />
                    TRY ASKING
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">

                    {suggestedPrompts.map((prompt) => (

                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSuggestionClick(prompt)}
                        className="rounded-full border border-white/10 bg-white/4 px-4 py-2.5 text-xs text-slate-300 transition hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-brand-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                      >
                        {prompt}
                      </button>

                    ))}

                  </div>

                </div>

              </div>

            ) : (

              /* Conversation Messages */

              <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">

                {messages.map((message) => (

                  <MessageBubble
                    key={message.id}
                    message={message}
                  />

                ))}

                {/* Error Message */}

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-400/5 p-4"
                  >
                    <div className="flex items-start gap-3">

                      <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0 text-red-400"
                      />

                      <div className="min-w-0 flex-1">

                        <p className="text-sm font-semibold text-red-300">
                          Unable to get AI response
                        </p>

                        <p className="mt-1 wrap-break-word text-xs leading-6 text-slate-400">
                          {error}
                        </p>

                        {lastFailedMessage && (
                          <button
                            type="button"
                            onClick={handleRetry}
                            disabled={isLoading}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/20 disabled:opacity-50"
                          >
                            <RefreshCw size={13} />
                            Retry
                          </button>
                        )}

                      </div>

                    </div>
                  </div>
                )}

                {/* Loading Indicator */}

                {isLoading && <TypingIndicator />}

              </div>

            )}

            <div ref={bottomRef} />

          </div>

          {/* Chat Input */}

          <ChatComposer
            value={input}
            isLoading={isLoading}
            onChange={setInput}
            onSubmit={handleSendMessage}
          />

        </section>

        {/* Footer Disclaimer */}

        <p className="mt-4 text-center text-[10px] leading-5 text-slate-600">
          AI responses are generated through the Team Portfolio API.
        </p>

      </main>

    </div>
  )
}

export default ChatPage
