'use client'

import type { Block } from '../../lib/api'

interface TrustCard {
  icon: string
  title: string
  description: string
}
interface RiskReversalContent {
  heading?: string
  cards: TrustCard[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function RiskReversalBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as RiskReversalContent
  const cards = c.cards ?? []
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  const updateCard = (i: number, patch: Partial<TrustCard>) => {
    const next = [...cards]
    next[i] = { ...cards[i], ...patch }
    onChange({ ...c, cards: next })
  }
  const removeCard = (i: number) => {
    onChange({ ...c, cards: cards.filter((_, idx) => idx !== i) })
  }
  const addCard = () => {
    onChange({
      ...c,
      cards: [
        ...cards,
        { icon: '✅', title: 'Guarantee', description: 'Your funds are always safe.' },
      ],
    })
  }

  if (!isSelected) {
    return (
      <div className="py-12">
        {c.heading && (
          <h2 className="mb-8 text-center text-2xl font-black text-white">{c.heading}</h2>
        )}
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {cards.map((card, i) => (
            <div key={i} className="rounded-xl border border-white/8 bg-bg-raised p-5 text-center">
              <div className="mb-3 text-3xl">{card.icon}</div>
              <p className="font-bold text-white">{card.title}</p>
            </div>
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
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">
        Risk Reversal / Trust
      </p>
      <div>
        <label className={lbl}>Section Heading (optional)</label>
        <input
          className={`${inp} text-xl font-black`}
          value={c.heading ?? ''}
          onChange={e => onChange({ ...c, heading: e.target.value })}
          placeholder="Zero Risk. Total Trust."
        />
      </div>
      <div className="space-y-3">
        {cards.map((card, i) => (
          <div key={i} className="rounded-lg border border-white/8 bg-bg-raised p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase text-text-muted">
                Card {i + 1}
              </span>
              <button
                onClick={() => removeCard(i)}
                className="text-[10px] text-text-muted hover:text-red-400"
              >
                ✕ Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <label className={lbl}>Icon (emoji)</label>
                <input
                  className={inp}
                  value={card.icon}
                  onChange={e => updateCard(i, { icon: e.target.value })}
                  placeholder="✅"
                />
              </div>
              <div>
                <label className={lbl}>Title</label>
                <input
                  className={`${inp} font-semibold`}
                  value={card.title}
                  onChange={e => updateCard(i, { title: e.target.value })}
                  placeholder="Guarantee"
                />
              </div>
              <div>
                <label className={lbl}>Description</label>
                <input
                  className={inp}
                  value={card.description}
                  onChange={e => updateCard(i, { description: e.target.value })}
                  placeholder="Short trust statement."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addCard}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-text-secondary hover:border-orange/40 hover:text-white"
      >
        + Add Trust Card
      </button>
    </div>
  )
}
