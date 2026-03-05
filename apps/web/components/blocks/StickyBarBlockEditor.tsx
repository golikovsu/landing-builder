'use client'

import type { Block } from '../../lib/api'

interface StickyBarContent {
  text: string
  boldText?: string
  ctaText: string
  ctaUrl: string
  badge?: string
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function StickyBarBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as StickyBarContent
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const label = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  if (!isSelected) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-bg-raised px-6 py-4">
        <span className="text-sm text-text-secondary">
          {c.text} <strong className="text-white">{c.boldText}</strong>
        </span>
        {c.ctaText && (
          <span className="rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-white">
            {c.ctaText}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className="space-y-4 rounded-xl border border-orange/20 bg-bg-card p-5"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">
        Sticky Bottom Bar
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Text</label>
          <input
            className={inp}
            value={c.text ?? ''}
            onChange={e => onChange({ ...c, text: e.target.value })}
            placeholder="Join 50M+ traders worldwide."
          />
        </div>
        <div>
          <label className={label}>Bold Text</label>
          <input
            className={inp}
            value={c.boldText ?? ''}
            onChange={e => onChange({ ...c, boldText: e.target.value })}
            placeholder="Start with $10K demo account."
          />
        </div>
        <div>
          <label className={label}>CTA Text</label>
          <input
            className={inp}
            value={c.ctaText ?? ''}
            onChange={e => onChange({ ...c, ctaText: e.target.value })}
            placeholder="Open Account"
          />
        </div>
        <div>
          <label className={label}>CTA URL</label>
          <input
            className={inp}
            value={c.ctaUrl ?? ''}
            onChange={e => onChange({ ...c, ctaUrl: e.target.value })}
            placeholder="#"
          />
        </div>
        <div>
          <label className={label}>Badge (optional)</label>
          <input
            className={inp}
            value={c.badge ?? ''}
            onChange={e => onChange({ ...c, badge: e.target.value })}
            placeholder="Free"
          />
        </div>
      </div>
    </div>
  )
}
