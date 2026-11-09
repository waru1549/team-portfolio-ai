
import { Sparkles, UserRound } from 'lucide-react'

import type { ChatMessage } from '../../types/chat'

interface MessageBubbleProps {
  message: ChatMessage
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  const formattedTime = new Date(
    message.createdAt,
  ).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`flex w-full gap-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* AI Avatar */}

      {!isUser && (
        <div
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/20"
          aria-hidden="true"
        >
          <Sparkles size={17} />
        </div>
      )}

      {/* Message Content */}

      <div
        className={`flex min-w-0 max-w-[85%] flex-col gap-1 sm:max-w-[75%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <span className="px-1 text-[11px] font-medium text-slate-500">
          {isUser ? 'You' : 'Team AI'}
        </span>

        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'rounded-tr-sm bg-brand-500 text-white'
              : 'rounded-tl-sm border border-white/10 bg-surface-800 text-slate-200'
          }`}
        >
          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7">
            {message.content}
          </p>
        </div>

        <time
          dateTime={message.createdAt}
          className="px-1 text-[10px] text-slate-600"
        >
          {formattedTime}
        </time>
      </div>

      {/* User Avatar */}

      {isUser && (
        <div
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-700 text-slate-200"
          aria-hidden="true"
        >
          <UserRound size={17} />
        </div>
      )}

    </div>
  )
}

export default MessageBubble
