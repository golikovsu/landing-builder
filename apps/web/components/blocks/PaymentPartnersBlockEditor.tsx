'use client'

import type { Block } from '../../lib/api'

interface PaymentPartnersContent {
  heading?: string
  partners: string[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function PaymentPartnersBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as PaymentPartnersContent
  const partners = c.partners ?? []
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  const updatePartner = (i: number, val: string) => {
    const next = [...partners]
    next[i] = val
    onChange({ ...c, partners: next })
  }
  const removePartner = (i: number) => {
    onChange({ ...c, partners: partners.filter((_, idx) => idx !== i) })
  }
  const addPartner = () => {
    onChange({ ...c, partners: [...partners, 'New Partner'] })
  }

  if (!isSelected) {
    return (
      <div className="py-10 text-center">
        {c.heading && (
          <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-text-muted">
            {c.heading}
          </p>
        )}
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4">
          {partners.map((p, i) => (
            <span
              key={i}
              className="rounded-lg border border-white/12 bg-bg-raised px-4 py-2 text-sm font-semibold text-text-secondary"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="space-y-4 rounded-xl border border-orange/20 bg-bg-card p-5"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">Payment Partners</p>
      <div>
        <label className={lbl}>Section Heading (optional)</label>
        <input
          className={inp}
          value={c.heading ?? ''}
          onChange={e => onChange({ ...c, heading: e.target.value })}
          placeholder="Trusted Payment Methods"
        />
      </div>
      <div className="space-y-2">
        <label className={lbl}>Partners / Methods</label>
        {partners.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={`${inp} flex-1 rounded-lg border border-white/8 bg-bg-raised px-3 py-2 text-sm`}
              value={p}
              onChange={e => updatePartner(i, e.target.value)}
              placeholder="Visa / Mastercard / Bitcoin..."
            />
            <button
              onClick={() => removePartner(i)}
              className="shrink-0 text-text-muted hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addPartner}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-text-secondary hover:border-orange/40 hover:text-white"
      >
        + Add Partner
      </button>
    </div>
  )
}
