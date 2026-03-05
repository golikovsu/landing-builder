'use client'

import type { Block } from '../../lib/api'

interface ComparisonRow {
  feature: string
  us: string | boolean
  competitorA: string | boolean
  competitorB: string | boolean
}
interface ComparisonContent {
  heading: string
  ourName: string
  competitorA: string
  competitorB: string
  rows: ComparisonRow[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

const BOOL_DISPLAY: Record<string, string> = { true: '✅', false: '❌' }

export function ComparisonBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as ComparisonContent
  const rows = c.rows ?? []
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  const updateRow = (i: number, patch: Partial<ComparisonRow>) => {
    const next = [...rows]
    next[i] = { ...rows[i], ...patch }
    onChange({ ...c, rows: next })
  }
  const removeRow = (i: number) => {
    onChange({ ...c, rows: rows.filter((_, idx) => idx !== i) })
  }
  const addRow = () => {
    onChange({
      ...c,
      rows: [...rows, { feature: 'New Feature', us: true, competitorA: false, competitorB: false }],
    })
  }

  const cellVal = (v: string | boolean) => (typeof v === 'boolean' ? String(v) : v)

  if (!isSelected) {
    return (
      <div className="py-12">
        <h2 className="mb-8 text-center text-2xl font-black text-white">{c.heading}</h2>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-white/8">
          <div className="grid grid-cols-4 bg-bg-raised px-5 py-3 text-[10px] font-semibold uppercase text-text-muted">
            <span>Feature</span>
            <span className="text-center text-orange">{c.ourName}</span>
            <span className="text-center">{c.competitorA}</span>
            <span className="text-center">{c.competitorB}</span>
          </div>
          {rows.slice(0, 4).map((row, i) => (
            <div key={i} className="grid grid-cols-4 border-t border-white/6 px-5 py-3 text-sm">
              <span className="text-text-secondary">{row.feature}</span>
              <span className="text-center">
                {BOOL_DISPLAY[cellVal(row.us)] ?? cellVal(row.us)}
              </span>
              <span className="text-center text-text-muted">
                {BOOL_DISPLAY[cellVal(row.competitorA)] ?? cellVal(row.competitorA)}
              </span>
              <span className="text-center text-text-muted">
                {BOOL_DISPLAY[cellVal(row.competitorB)] ?? cellVal(row.competitorB)}
              </span>
            </div>
          ))}
          {rows.length > 4 && (
            <div className="px-5 py-2 text-center text-xs text-text-muted">
              +{rows.length - 4} more rows
            </div>
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
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">Comparison Table</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={lbl}>Heading</label>
          <input
            className={`${inp} font-black`}
            value={c.heading ?? ''}
            onChange={e => onChange({ ...c, heading: e.target.value })}
            placeholder="Why Choose IQ Option?"
          />
        </div>
        <div>
          <label className={lbl}>Our Name</label>
          <input
            className={inp}
            value={c.ourName ?? ''}
            onChange={e => onChange({ ...c, ourName: e.target.value })}
            placeholder="IQ Option"
          />
        </div>
        <div>
          <label className={lbl}>Competitor A</label>
          <input
            className={inp}
            value={c.competitorA ?? ''}
            onChange={e => onChange({ ...c, competitorA: e.target.value })}
            placeholder="Competitor A"
          />
        </div>
        <div>
          <label className={lbl}>Competitor B</label>
          <input
            className={inp}
            value={c.competitorB ?? ''}
            onChange={e => onChange({ ...c, competitorB: e.target.value })}
            placeholder="Competitor B"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2">
          <span className={lbl}>Feature</span>
          <span className={`${lbl} text-center`}>Us</span>
          <span className={`${lbl} text-center`}>Comp A</span>
          <span className={`${lbl} text-center`}>Comp B</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-2 rounded-lg bg-bg-raised px-3 py-2 items-center"
          >
            <input
              className={`${inp} text-sm`}
              value={row.feature}
              onChange={e => updateRow(i, { feature: e.target.value })}
              placeholder="Feature name"
            />
            <input
              className={`${inp} text-center text-sm`}
              value={cellVal(row.us)}
              onChange={e => updateRow(i, { us: e.target.value })}
              placeholder="true / ✅ / text"
            />
            <input
              className={`${inp} text-center text-sm`}
              value={cellVal(row.competitorA)}
              onChange={e => updateRow(i, { competitorA: e.target.value })}
              placeholder="false / ❌"
            />
            <div className="flex items-center gap-1">
              <input
                className={`${inp} text-center text-sm flex-1`}
                value={cellVal(row.competitorB)}
                onChange={e => updateRow(i, { competitorB: e.target.value })}
                placeholder="❌"
              />
              <button
                onClick={() => removeRow(i)}
                className="shrink-0 text-text-muted hover:text-red-400 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addRow}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-text-secondary hover:border-orange/40 hover:text-white"
      >
        + Add Row
      </button>
    </div>
  )
}
