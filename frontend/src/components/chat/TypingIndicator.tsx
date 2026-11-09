
import { Sparkles } from 'lucide-react'

function TypingIndicator() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3"
    >
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/20">
        <Sparkles size={17} />
      </div>

      <div className="flex items-center gap-3 rounded-2xl rounded-tl-sm border border-white/10 bg-surface-800 px-4 py-3">

        <span className="text-xs text-slate-400">
          Team AI is thinking
        </span>

        <div className="flex items-center gap-1">

          <span className="size-1.5 animate-bounce rounded-full bg-brand-300" />

          <span className="size-1.5 animate-bounce rounded-full bg-brand-300 [animation-delay:150ms]" />

          <span className="size-1.5 animate-bounce rounded-full bg-brand-300 [animation-delay:300ms]" />

        </div>

      </div>
    </div>
  )
}

export default TypingIndicator
