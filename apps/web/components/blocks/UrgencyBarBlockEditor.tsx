'use client'

import type { Block } from '../../lib/api'

interface UrgencyBarContent {
  text: string
  boldText?: string
  ctaText: string
  ctaUrl: string
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function UrgencyBarBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as UrgencyBarContent
  return (
    <div className="relative bg-bg-raised px-4 py-2.5">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
        </span>
        {isSelected ? (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={c.text}
              onChange={e => onChange({ ...c, text: e.target.value })}
              onClick={e => e.stopPropagation()}
              className="bg-transparent text-sm text-text-secondary outline-none focus:underline"
              placeholder="Urgency text..."
            />
            <input
              type="text"
              value={c.boldText ?? ''}
              onChange={e => onChange({ ...c, boldText: e.target.value })}
              onClick={e => e.stopPropagation()}
              className="bg-transparent text-sm font-bold text-white outline-none focus:underline"
              placeholder="Bold highlight"
            />
            <input
              type="text"
              value={c.ctaText}
              onChange={e => onChange({ ...c, ctaText: e.target.value })}
              onClick={e => e.stopPropagation()}
              className="rounded bg-orange/20 px-2 py-0.5 text-sm font-semibold text-orange outline-none"
              placeholder="CTA"
            />
          </div>
        ) : (
          <p className="text-sm text-text-secondary">
            {c.text} {c.boldText && <strong className="text-white">{c.boldText}</strong>}{' '}
            <span className="text-orange">{c.ctaText} →</span>
          </p>
        )}
      </div>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">✕</span>
    </div>
  )
}
