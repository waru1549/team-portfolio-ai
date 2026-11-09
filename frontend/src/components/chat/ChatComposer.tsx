
import type { FormEvent } from 'react'

import {
  ArrowUp,
  LoaderCircle,
} from 'lucide-react'

interface ChatComposerProps {
  value: string
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function ChatComposer({
  value,
  isLoading,
  onChange,
  onSubmit,
}: ChatComposerProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-white/10 bg-surface-900/80 p-4 sm:p-5"
    >
      <div className="flex items-end gap-3 rounded-2xl border border-border-subtle bg-ink-950 p-3 transition focus-within:border-brand-400/50">

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder="Ask anything about our team..."
          aria-label="Type your message"
          aria-describedby="chat-composer-hint chat-composer-count"
          rows={2}
          maxLength={2000}
          disabled={isLoading}
          className="max-h-36 min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          aria-label="Send message"
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
        >
          {isLoading ? (
            <LoaderCircle size={19} className="animate-spin" />
          ) : (
            <ArrowUp size={20} />
          )}
        </button>

      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">

        <p
          id="chat-composer-hint"
          className="text-[10px] text-slate-500"
        >
          Enter to send · Shift + Enter for a new line
        </p>

        <p
          id="chat-composer-count"
          className="text-[10px] text-slate-600"
        >
          {value.length}/2000 characters
        </p>

      </div>

    </form>
  )
}

export default ChatComposer
