'use client'

import type { Block } from '../../lib/api'

interface TimelineEntry {
  year: string
  title: string
  description: string
  badge?: string
}
interface TimelineContent {
  heading: string
  entries: TimelineEntry[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function TimelineBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as TimelineContent
  const entries = c.entries ?? []
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  const updateEntry = (i: number, patch: Partial<TimelineEntry>) => {
    const next = [...entries]
    next[i] = { ...entries[i], ...patch }
    onChange({ ...c, entries: next })
  }
  const removeEntry = (i: number) => {
    onChange({ ...c, entries: entries.filter((_, idx) => idx !== i) })
  }
  const addEntry = () => {
    onChange({
      ...c,
      entries: [
        ...entries,
        { year: '2026', title: 'New Milestone', description: 'Description here.' },
      ],
    })
  }

  if (!isSelected) {
    return (
      <div className="py-12">
        <h2 className="mb-10 text-center text-2xl font-black text-white">{c.heading}</h2>
        <div className="relative mx-auto max-w-2xl space-y-6 border-l border-white/12 pl-8">
          {entries.slice(0, 4).map((entry, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-10 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-black text-white">
                {i + 1}
              </div>
              <p className="text-xs font-bold text-orange">{entry.year}</p>
              <p className="font-bold text-white">{entry.title}</p>
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
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">Timeline</p>
      <div>
        <label className={lbl}>Section Heading</label>
        <input
          className={`${inp} font-black`}
          value={c.heading ?? ''}
          onChange={e => onChange({ ...c, heading: e.target.value })}
          placeholder="Our Journey"
        />
      </div>
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={i} className="rounded-lg border border-white/8 bg-bg-raised p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase text-text-muted">
                Entry {i + 1}
              </span>
              <button
                onClick={() => removeEntry(i)}
                className="text-[10px] text-text-muted hover:text-red-400"
              >
                ✕ Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <label className={lbl}>Year / Date</label>
                <input
                  className={`${inp} font-bold text-orange`}
                  value={entry.year}
                  onChange={e => updateEntry(i, { year: e.target.value })}
                  placeholder="2024"
                />
              </div>
              <div>
                <label className={lbl}>Title</label>
                <input
                  className={`${inp} font-bold`}
                  value={entry.title}
                  onChange={e => updateEntry(i, { title: e.target.value })}
                  placeholder="Major Launch"
                />
              </div>
              <div>
                <label className={lbl}>Badge (optional)</label>
                <input
                  className={inp}
                  value={entry.badge ?? ''}
                  onChange={e => updateEntry(i, { badge: e.target.value })}
                  placeholder="Milestone"
                />
              </div>
              <div className="sm:col-span-3">
                <label className={lbl}>Description</label>
                <textarea
                  className={`${inp} resize-none`}
                  rows={2}
                  value={entry.description}
                  onChange={e => updateEntry(i, { description: e.target.value })}
                  placeholder="What happened at this milestone."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addEntry}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-text-secondary hover:border-orange/40 hover:text-white"
      >
        + Add Entry
      </button>
    </div>
  )
}
