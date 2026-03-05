'use client'

import type { Block } from '../../lib/api'

type RoadmapStatus = 'shipped' | 'in_progress' | 'planned'
interface RoadmapCard {
  period: string
  title: string
  items: string[]
  status: RoadmapStatus
}
interface RoadmapContent {
  heading: string
  subheading?: string
  cards: RoadmapCard[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

const STATUS_COLORS: Record<RoadmapStatus, string> = {
  shipped: 'bg-emerald-500/15 text-emerald-400',
  in_progress: 'bg-orange/15 text-orange',
  planned: 'bg-white/10 text-text-muted',
}

export function RoadmapBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as RoadmapContent
  const cards = c.cards ?? []
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  const updateCard = (i: number, patch: Partial<RoadmapCard>) => {
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
        {
          period: 'Q4 2026',
          title: 'New Release',
          items: ['Feature A', 'Feature B'],
          status: 'planned',
        },
      ],
    })
  }
  const updateItem = (ci: number, ii: number, val: string) => {
    const items = [...(cards[ci].items ?? [])]
    items[ii] = val
    updateCard(ci, { items })
  }
  const addItem = (ci: number) => {
    updateCard(ci, { items: [...(cards[ci].items ?? []), 'New item'] })
  }
  const removeItem = (ci: number, ii: number) => {
    updateCard(ci, { items: cards[ci].items.filter((_, idx) => idx !== ii) })
  }

  if (!isSelected) {
    return (
      <div className="py-12">
        <h2 className="mb-2 text-center text-2xl font-black text-white">{c.heading}</h2>
        {c.subheading && (
          <p className="mb-8 text-center text-sm text-text-secondary">{c.subheading}</p>
        )}
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {cards.map((card, i) => (
            <div key={i} className="rounded-xl border border-white/8 bg-bg-raised p-5">
              <span
                className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[card.status]}`}
              >
                {card.status}
              </span>
              <p className="text-xs text-text-muted">{card.period}</p>
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
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">Product Roadmap</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={lbl}>Heading</label>
          <input
            className={`${inp} font-black`}
            value={c.heading ?? ''}
            onChange={e => onChange({ ...c, heading: e.target.value })}
            placeholder="Product Roadmap"
          />
        </div>
        <div>
          <label className={lbl}>Subheading</label>
          <input
            className={inp}
            value={c.subheading ?? ''}
            onChange={e => onChange({ ...c, subheading: e.target.value })}
            placeholder="What we're building next."
          />
        </div>
      </div>
      <div className="space-y-3">
        {cards.map((card, ci) => (
          <div key={ci} className="rounded-lg border border-white/8 bg-bg-raised p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase text-text-muted">
                Card {ci + 1}
              </span>
              <button
                onClick={() => removeCard(ci)}
                className="text-[10px] text-text-muted hover:text-red-400"
              >
                ✕ Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <label className={lbl}>Period</label>
                <input
                  className={inp}
                  value={card.period}
                  onChange={e => updateCard(ci, { period: e.target.value })}
                  placeholder="Q1 2026"
                />
              </div>
              <div>
                <label className={lbl}>Title</label>
                <input
                  className={`${inp} font-bold`}
                  value={card.title}
                  onChange={e => updateCard(ci, { title: e.target.value })}
                  placeholder="Major Release"
                />
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select
                  value={card.status}
                  onChange={e => updateCard(ci, { status: e.target.value as RoadmapStatus })}
                  onClick={e => e.stopPropagation()}
                  className="w-full rounded bg-bg-card px-2 py-1 text-sm text-white outline-none border border-white/12"
                >
                  <option value="shipped">Shipped</option>
                  <option value="in_progress">In Progress</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <label className={lbl}>Items</label>
              {(card.items ?? []).map((item, ii) => (
                <div key={ii} className="flex items-center gap-2">
                  <input
                    className={`${inp} text-sm flex-1`}
                    value={item}
                    onChange={e => updateItem(ci, ii, e.target.value)}
                    placeholder="Feature..."
                  />
                  <button
                    onClick={() => removeItem(ci, ii)}
                    className="shrink-0 text-text-muted hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem(ci)}
                className="text-xs text-text-muted hover:text-orange"
              >
                + Add item
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addCard}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-text-secondary hover:border-orange/40 hover:text-white"
      >
        + Add Card
      </button>
    </div>
  )
}
