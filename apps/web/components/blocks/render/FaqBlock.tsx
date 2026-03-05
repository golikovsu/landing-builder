'use client'

import { useState } from 'react'

interface FaqItem {
  question: string
  answer: string
}
interface FaqContent {
  heading: string
  items: FaqItem[]
}

export function FaqBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as FaqContent
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-2xl">
        {c.heading && (
          <h2 className="mb-10 text-center text-3xl font-black text-white sm:text-4xl">
            {c.heading}
          </h2>
        )}
        <div className="space-y-2">
          {c.items?.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-white/8 bg-bg-card">
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-white">{item.question}</span>
                <span
                  className={`ml-4 shrink-0 text-xl text-orange transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="border-t border-white/8 px-6 py-4">
                  <p className="text-sm leading-relaxed text-text-secondary">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
