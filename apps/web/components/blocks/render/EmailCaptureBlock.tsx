'use client'

import { useState } from 'react'

interface EmailCaptureContent {
  heading: string
  subheading?: string
  placeholder?: string
  ctaText: string
  trustNote?: string
  statsLine?: string
}

export function EmailCaptureBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as EmailCaptureContent
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-xl text-center">
        {c.statsLine && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
            {c.statsLine}
          </p>
        )}
        <h2 className="mb-3 text-3xl font-black text-white sm:text-4xl">{c.heading}</h2>
        {c.subheading && <p className="mb-8 text-text-secondary">{c.subheading}</p>}
        {submitted ? (
          <div className="rounded-xl border border-success/30 bg-success/10 px-6 py-4">
            <p className="font-semibold text-success">✓ You&apos;re in! Check your email.</p>
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault()
              if (email) setSubmitted(true)
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={c.placeholder || 'Enter your email'}
              className="flex-1 rounded-lg border border-white/12 bg-bg-raised px-4 py-3 text-sm text-white placeholder-text-muted outline-none focus:border-orange"
            />
            <button
              type="submit"
              className="rounded-lg bg-orange px-6 py-3 text-sm font-semibold text-white shadow-orange transition-opacity hover:opacity-90"
            >
              {c.ctaText}
            </button>
          </form>
        )}
        {c.trustNote && <p className="mt-4 text-xs text-text-muted">{c.trustNote}</p>}
      </div>
    </section>
  )
}
