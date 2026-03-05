'use client'

import type { Block } from '../../lib/api'

type ChangeType = 'new' | 'improved' | 'fixed' | 'deprecated'

interface Change {
  type: ChangeType
  text: string
}

interface ChangelogEntry {
  version: string
  date: string
  changes: Change[]
}

interface ChangelogContent {
  heading: string
  entries: ChangelogEntry[]
}

interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

const TYPE_COLORS: Record<ChangeType, string> = {
  new: 'bg-success/15 text-success',
  improved: 'bg-info/15 text-info',
  fixed: 'bg-warning/15 text-warning',
  deprecated: 'bg-error/15 text-error',
}

export function ChangelogBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as ChangelogContent

  const addEntry = () => {
    const entries: ChangelogEntry[] = [
      {
        version: '1.0.0',
        date: new Date().toISOString().split('T')[0] ?? '',
        changes: [{ type: 'new', text: 'Describe what changed' }],
      },
      ...c.entries,
    ]
    onChange({ ...c, entries })
  }

  const updateEntry = (index: number, patch: Partial<ChangelogEntry>) => {
    const entries = c.entries.map((e, i) => (i === index ? { ...e, ...patch } : e))
    onChange({ ...c, entries })
  }

  const removeEntry = (index: number) => {
    onChange({ ...c, entries: c.entries.filter((_, i) => i !== index) })
  }

  const addChange = (entryIndex: number) => {
    const entries = c.entries.map((e, i) =>
      i === entryIndex
        ? { ...e, changes: [...e.changes, { type: 'new' as ChangeType, text: '' }] }
        : e,
    )
    onChange({ ...c, entries })
  }

  const updateChange = (entryIndex: number, changeIndex: number, patch: Partial<Change>) => {
    const entries = c.entries.map((e, i) =>
      i === entryIndex
        ? {
            ...e,
            changes: e.changes.map((ch, j) => (j === changeIndex ? { ...ch, ...patch } : ch)),
          }
        : e,
    )
    onChange({ ...c, entries })
  }

  const removeChange = (entryIndex: number, changeIndex: number) => {
    const entries = c.entries.map((e, i) =>
      i === entryIndex ? { ...e, changes: e.changes.filter((_, j) => j !== changeIndex) } : e,
    )
    onChange({ ...c, entries })
  }

  return (
    <div className="rounded-xl bg-bg-card px-8 py-12">
      {isSelected ? (
        <input
          type="text"
          value={c.heading}
          onChange={e => onChange({ ...c, heading: e.target.value })}
          className="mb-8 block w-full bg-transparent text-center text-2xl font-bold text-white outline-none focus:underline"
        />
      ) : (
        <h2 className="mb-8 text-center text-2xl font-bold text-white">{c.heading}</h2>
      )}

      {isSelected && (
        <div className="mb-4 text-center">
          <button
            onClick={addEntry}
            className="rounded-lg bg-white/8 px-4 py-2 text-sm text-white transition-colors hover:bg-white/12"
          >
            + Add Entry
          </button>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {c.entries.map((entry, ei) => (
          <div key={ei} className="relative rounded-lg border border-white/8 bg-bg-card-alt p-5">
            {isSelected && (
              <button
                onClick={() => removeEntry(ei)}
                className="absolute right-3 top-3 text-xs text-text-muted hover:text-error"
              >
                Remove
              </button>
            )}

            <div className="mb-4 flex items-center gap-3">
              {isSelected ? (
                <>
                  <input
                    type="text"
                    value={entry.version}
                    onChange={e => updateEntry(ei, { version: e.target.value })}
                    className="w-20 rounded bg-white/8 px-2 py-1 text-sm font-bold text-white outline-none focus:bg-white/12"
                    placeholder="v1.0.0"
                  />
                  <input
                    type="date"
                    value={entry.date}
                    onChange={e => updateEntry(ei, { date: e.target.value })}
                    className="rounded bg-white/8 px-2 py-1 text-xs text-text-secondary outline-none focus:bg-white/12"
                  />
                </>
              ) : (
                <>
                  <span className="rounded bg-orange/15 px-2.5 py-1 text-sm font-bold text-orange">
                    v{entry.version}
                  </span>
                  <span className="text-xs text-text-muted">{entry.date}</span>
                </>
              )}
            </div>

            <ul className="flex flex-col gap-2">
              {entry.changes.map((change, ci) => (
                <li key={ci} className="flex items-start gap-2.5">
                  {isSelected ? (
                    <>
                      <select
                        value={change.type}
                        onChange={e => updateChange(ei, ci, { type: e.target.value as ChangeType })}
                        className="rounded bg-white/8 px-1.5 py-0.5 text-xs text-white outline-none"
                      >
                        <option value="new">New</option>
                        <option value="improved">Improved</option>
                        <option value="fixed">Fixed</option>
                        <option value="deprecated">Deprecated</option>
                      </select>
                      <input
                        type="text"
                        value={change.text}
                        onChange={e => updateChange(ei, ci, { text: e.target.value })}
                        className="flex-1 bg-transparent text-sm text-white outline-none focus:underline"
                        placeholder="Describe the change..."
                      />
                      <button
                        onClick={() => removeChange(ei, ci)}
                        className="text-text-muted hover:text-error"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium capitalize ${TYPE_COLORS[change.type]}`}
                      >
                        {change.type}
                      </span>
                      <span className="text-sm text-text-secondary">{change.text}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {isSelected && (
              <button
                onClick={() => addChange(ei)}
                className="mt-3 text-xs text-text-muted hover:text-orange"
              >
                + Add change
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
