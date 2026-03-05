'use client'

import type { Block } from '../../lib/api'

interface FaqItem {
  question: string
  answer: string
}
interface FaqContent {
  heading: string
  items: FaqItem[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function FaqBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as FaqContent
  const items = c.items ?? []
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  const updateItem = (i: number, patch: Partial<FaqItem>) => {
    const next = [...items]
    next[i] = { ...items[i], ...patch }
    onChange({ ...c, items: next })
  }
  const removeItem = (i: number) => {
    onChange({ ...c, items: items.filter((_, idx) => idx !== i) })
  }
  const addItem = () => {
    onChange({ ...c, items: [...items, { question: 'New question?', answer: 'Answer here.' }] })
  }

  if (!isSelected) {
    return (
      <div className="py-12">
        <h2 className="mb-8 text-center text-2xl font-black text-white">{c.heading}</h2>
        <div className="mx-auto max-w-2xl space-y-3">
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="rounded-xl border border-white/8 bg-bg-raised px-5 py-4">
              <p className="font-semibold text-white">{item.question}</p>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-center text-xs text-text-muted">+{items.length - 3} more</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="space-y-4 rounded-xl border border-orange/20 bg-bg-card p-5"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">FAQ</p>
      <div>
        <label className={lbl}>Section Heading</label>
        <input
          className={`${inp} text-xl font-black`}
          value={c.heading ?? ''}
          onChange={e => onChange({ ...c, heading: e.target.value })}
          placeholder="Frequently Asked Questions"
        />
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-white/8 bg-bg-raised p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase text-text-muted">Q{i + 1}</span>
              <button
                onClick={() => removeItem(i)}
                className="text-[10px] text-text-muted hover:text-red-400"
              >
                ✕ Remove
              </button>
            </div>
            <div className="mb-2">
              <label className={lbl}>Question</label>
              <input
                className={`${inp} font-semibold`}
                value={item.question}
                onChange={e => updateItem(i, { question: e.target.value })}
                placeholder="What is...?"
              />
            </div>
            <div>
              <label className={lbl}>Answer</label>
              <textarea
                className={`${inp} resize-none`}
                rows={2}
                value={item.answer}
                onChange={e => updateItem(i, { answer: e.target.value })}
                placeholder="The answer is..."
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-text-secondary hover:border-orange/40 hover:text-white"
      >
        + Add FAQ Item
      </button>
    </div>
  )
}
