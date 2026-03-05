'use client'

import type { Block } from '../../lib/api'

interface CTAContent {
  heading: string
  subheading: string
  ctaText: string
  ctaUrl: string
  variant: 'orange' | 'dark' | 'bordered'
}

interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

const VARIANT_WRAPPERS: Record<CTAContent['variant'], string> = {
  orange: 'bg-gradient-orange shadow-orange',
  dark: 'bg-bg-raised border border-white/8',
  bordered: 'border-2 border-orange bg-transparent',
}

const VARIANT_BTN: Record<CTAContent['variant'], string> = {
  orange: 'bg-white text-orange hover:bg-white/90',
  dark: 'bg-orange text-white shadow-orange hover:opacity-90',
  bordered: 'bg-orange text-white shadow-orange hover:opacity-90',
}

export function CTABannerBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as CTAContent

  return (
    <div
      className={`relative overflow-hidden rounded-xl px-8 py-12 text-center ${VARIANT_WRAPPERS[c.variant]}`}
    >
      {/* Decorative radial glow for non-orange variants */}
      {c.variant !== 'orange' && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,106,0,0.07)_0%,transparent_70%)]" />
      )}

      <div className="relative mx-auto max-w-2xl">
        {/* Variant picker (edit mode only) */}
        {isSelected && (
          <div className="mb-6 flex items-center justify-center gap-2">
            {(['orange', 'dark', 'bordered'] as const).map(v => (
              <button
                key={v}
                onClick={e => {
                  e.stopPropagation()
                  onChange({ ...c, variant: v })
                }}
                className={`rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  c.variant === v
                    ? 'bg-white/25 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/15'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {/* Heading */}
        {isSelected ? (
          <input
            type="text"
            value={c.heading}
            onChange={e => onChange({ ...c, heading: e.target.value })}
            onClick={e => e.stopPropagation()}
            className="mb-2 block w-full bg-transparent text-center text-3xl font-black text-white outline-none placeholder-white/40 focus:underline"
            placeholder="Ready to get started?"
          />
        ) : (
          <h2 className="mb-2 text-3xl font-black text-white sm:text-4xl">{c.heading}</h2>
        )}

        {/* Subheading */}
        {isSelected ? (
          <input
            type="text"
            value={c.subheading}
            onChange={e => onChange({ ...c, subheading: e.target.value })}
            onClick={e => e.stopPropagation()}
            className="mb-8 block w-full bg-transparent text-center text-sm text-white/70 outline-none placeholder-white/30 focus:underline"
            placeholder="Subheading…"
          />
        ) : (
          c.subheading && <p className="mb-8 text-sm text-white/80">{c.subheading}</p>
        )}

        {/* CTA button */}
        {isSelected ? (
          <div className="flex flex-col items-center gap-2">
            <input
              type="text"
              value={c.ctaText}
              onChange={e => onChange({ ...c, ctaText: e.target.value })}
              onClick={e => e.stopPropagation()}
              className={`rounded-lg px-6 py-3 text-center text-sm font-semibold outline-none ${VARIANT_BTN[c.variant]} bg-opacity-90`}
              placeholder="Button text"
            />
            <input
              type="url"
              value={c.ctaUrl}
              onChange={e => onChange({ ...c, ctaUrl: e.target.value })}
              onClick={e => e.stopPropagation()}
              className="w-full rounded bg-black/10 px-3 py-1 text-center text-xs text-white/50 outline-none"
              placeholder="https://…"
            />
          </div>
        ) : (
          <a
            href={c.ctaUrl || '#'}
            className={`inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold transition-all ${VARIANT_BTN[c.variant]}`}
          >
            {c.ctaText || 'Get Started'}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
