'use client'

import { useState, useEffect } from 'react'

interface StickyBarContent {
  text: string
  boldText?: string
  ctaText: string
  ctaUrl: string
  badge?: string
}

export function StickyBarBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as StickyBarContent
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    const h = () => {
      if (!dismissed) setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [dismissed])
  if (dismissed) return null
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex items-center justify-between border-t border-white/10 bg-bg-raised/95 px-4 py-3 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
          </span>
          <p className="text-sm text-text-secondary">
            {c.text} {c.boldText && <strong className="text-white">{c.boldText}</strong>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {c.badge && (
            <span className="hidden rounded-full bg-orange/15 px-2 py-0.5 text-xs font-semibold text-orange sm:block">
              {c.badge}
            </span>
          )}
          <a
            href={c.ctaUrl || '#'}
            className="rounded-lg bg-orange px-5 py-2 text-sm font-semibold text-white shadow-orange transition-opacity hover:opacity-90"
          >
            {c.ctaText}
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-text-muted hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
