'use client'

import { useState } from 'react'

interface UrgencyBarContent {
  text: string
  boldText?: string
  ctaText: string
  ctaUrl: string
}

export function UrgencyBarBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as UrgencyBarContent
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="relative z-40 bg-bg-raised px-4 py-2.5">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
        </span>
        <p className="text-center text-sm text-text-secondary">
          {c.text} {c.boldText && <strong className="text-white">{c.boldText}</strong>}
        </p>
        {c.ctaText && (
          <a
            href={c.ctaUrl || '#'}
            className="shrink-0 text-sm font-semibold text-orange underline-offset-2 hover:underline"
          >
            {c.ctaText} →
          </a>
        )}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  )
}
