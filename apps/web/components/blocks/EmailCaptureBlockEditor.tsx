'use client'

import type { Block } from '../../lib/api'

interface EmailCaptureContent {
  heading: string
  subheading?: string
  placeholder?: string
  ctaText: string
  trustNote?: string
  statsLine?: string
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function EmailCaptureBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as EmailCaptureContent
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  if (!isSelected) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-2xl font-black text-white">{c.heading}</h2>
        {c.subheading && <p className="mb-6 text-sm text-text-secondary">{c.subheading}</p>}
        <div className="mx-auto flex max-w-md gap-2">
          <div className="flex-1 rounded-lg border border-white/12 bg-bg-raised px-4 py-2.5 text-sm text-text-muted">
            {c.placeholder || 'your@email.com'}
          </div>
          <div className="rounded-lg bg-orange px-5 py-2.5 text-sm font-semibold text-white">
            {c.ctaText}
          </div>
        </div>
        {c.trustNote && <p className="mt-3 text-xs text-text-muted">{c.trustNote}</p>}
      </div>
    )
  }

  return (
    <div
      className="space-y-4 rounded-xl border border-orange/20 bg-bg-card p-5"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">Email Capture</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={lbl}>Heading</label>
          <input
            className={`${inp} text-xl font-black`}
            value={c.heading ?? ''}
            onChange={e => onChange({ ...c, heading: e.target.value })}
            placeholder="Get early access"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl}>Subheading</label>
          <input
            className={inp}
            value={c.subheading ?? ''}
            onChange={e => onChange({ ...c, subheading: e.target.value })}
            placeholder="Join 50,000+ traders on the platform."
          />
        </div>
        <div>
          <label className={lbl}>Input Placeholder</label>
          <input
            className={inp}
            value={c.placeholder ?? ''}
            onChange={e => onChange({ ...c, placeholder: e.target.value })}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className={lbl}>CTA Button Text</label>
          <input
            className={inp}
            value={c.ctaText ?? ''}
            onChange={e => onChange({ ...c, ctaText: e.target.value })}
            placeholder="Get Access"
          />
        </div>
        <div>
          <label className={lbl}>Trust Note</label>
          <input
            className={inp}
            value={c.trustNote ?? ''}
            onChange={e => onChange({ ...c, trustNote: e.target.value })}
            placeholder="No spam. Unsubscribe anytime."
          />
        </div>
        <div>
          <label className={lbl}>Stats Line</label>
          <input
            className={inp}
            value={c.statsLine ?? ''}
            onChange={e => onChange({ ...c, statsLine: e.target.value })}
            placeholder="50,000+ traders already joined"
          />
        </div>
      </div>
    </div>
  )
}
