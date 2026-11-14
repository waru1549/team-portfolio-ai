
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
import { useLanguage } from '../contexts/language-context'

import type { Language } from '../data/portfolioData'
import MessageBubble from '../components/chat/MessageBubble'
import TypingIndicator from '../components/chat/TypingIndicator'
import ChatComposer from '../components/chat/ChatComposer'

import { sendChatMessage, ChatApiException } from '../services/chatApi'

import type { ChatMessage } from '../types/chat'

interface ChatPageCopy {
  title: string
  description: string
  newChat: string
  newChatAria: string
  backendPending: string
  conversationLabel: string
  messagesLabel: string
  emptyTitle: string
  emptyDescription: string
  tryAsking: string
  suggestedPrompts: readonly string[]
  errorTitle: string
  genericError: string
  retry: string
  disclaimer: string
}

const chatPageCopy: Record<Language, ChatPageCopy> = {
  en: {
    title: 'Team AI Assistant',
    description:
      'Discover our team, members, skills, and projects.',
    newChat: 'New Chat',
    newChatAria: 'Start a new conversation',
    backendPending: 'BACKEND PENDING',
    conversationLabel: 'Chat conversation',
    messagesLabel: 'Chat conversation messages',
    emptyTitle: 'How can we help you?',
    emptyDescription:
      'Ask questions about our team members, technical skills, previous projects, or collaborative work.',
    tryAsking: 'TRY ASKING',
    suggestedPrompts: [
      'Who are the members of this team?',
      'What are your team skills?',
      'Tell me about your collaborative project.',
    ],
    errorTitle: 'Unable to get AI response',
    genericError: 'Something went wrong. Please try again.',
    retry: 'Retry',
    disclaimer:
      'AI responses will be handled through the Team Portfolio API after backend integration.',
  },

  th: {
    title: 'ผู้ช่วย AI ประจำทีม',
    description:
      'ค้นพบข้อมูลเกี่ยวกับทีม สมาชิก ทักษะ และผลงานของเรา',
    newChat: 'แชตใหม่',
    newChatAria: 'เริ่มบทสนทนาใหม่',
    backendPending: 'รอการเชื่อมต่อ Backend',
    conversationLabel: 'บทสนทนา',
    messagesLabel: 'ข้อความในการสนทนา',
    emptyTitle: 'วันนี้ให้เราช่วยอะไรได้บ้าง?',
    emptyDescription:
      'สอบถามเกี่ยวกับสมาชิกในทีม ทักษะทางเทคนิค ผลงานที่ผ่านมา หรือโปรเจกต์ที่เราทำร่วมกัน',
    tryAsking: 'ลองถามเราได้เลย',
    suggestedPrompts: [
      'ใครเป็นสมาชิกในทีมนี้บ้าง?',
      'ทีมของเรามีทักษะอะไรบ้าง?',
      'เล่าเกี่ยวกับโปรเจกต์ที่ทีมทำร่วมกันให้ฟังหน่อย',
    ],
    errorTitle: 'ไม่สามารถรับคำตอบจาก AI ได้',
    genericError: 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง',
    retry: 'ลองอีกครั้ง',
    disclaimer:
      'ระบบจะให้บริการคำตอบจาก AI ผ่าน Team Portfolio API หลังจากเชื่อมต่อ Backend แล้ว',
  },
}

function ChatPage() {
  const { language } = useLanguage()
  const copy = chatPageCopy[language]

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

      let errorMessage = copy.genericError

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
                {copy.title}
              </h1>

            </div>

            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              {copy.description}
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
              aria-label={copy.newChatAria}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={15} />
              {copy.newChat}
            </button>

            {/* API Integration Status Label */}

            <div className="flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-400/5 px-3 py-2">

              <span className="size-2 rounded-full bg-brand-400" />

              <span className="text-[10px] font-semibold tracking-wide text-amber-300">
                {copy.backendPending}
              </span>

            </div>

          </div>

        </header>

        {/* Chat Container */}

        <section
          aria-label={copy.conversationLabel}
          className="flex min-h-140 flex-1 flex-col overflow-hidden rounded-panel border border-border-subtle bg-surface-900 shadow-glow"
        >

          {/* Message Area */}

          <div
            role="log"
            aria-label={copy.messagesLabel}
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
                  {copy.emptyTitle}
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                  {copy.emptyDescription}
                </p>

                {/* Suggested Questions */}

                <div className="mt-8 w-full max-w-lg">

                  <div className="mb-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Users size={14} />
                    {copy.tryAsking}
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">

                    {copy.suggestedPrompts.map((prompt) => (

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
                          {copy.errorTitle}
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
                            {copy.retry}
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

        <p className="mt-4 text-center text-[10px] leading-5 text-slate-400">
          {copy.disclaimer}
        </p>

      </main>

    </div>
  )
}

export default ChatPage
