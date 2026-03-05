'use client'

import type { Block } from '../../lib/api'

interface StatItem {
  value: string
  label: string
}
interface StatsRowContent {
  stats: StatItem[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function StatsRowBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as StatsRowContent
  const stats = c.stats ?? []
  return (
    <div className="border-y border-white/6 bg-bg-raised px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-around gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              {isSelected ? (
                <>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={e => {
                      const s = [...stats]
                      s[i] = { ...stat, value: e.target.value }
                      onChange({ ...c, stats: s })
                    }}
                    onClick={e => e.stopPropagation()}
                    className="w-28 bg-transparent text-center text-2xl font-black text-white outline-none focus:underline"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={e => {
                      const s = [...stats]
                      s[i] = { ...stat, label: e.target.value }
                      onChange({ ...c, stats: s })
                    }}
                    onClick={e => e.stopPropagation()}
                    className="w-32 bg-transparent text-center text-xs text-text-muted outline-none focus:underline"
                  />
                </>
              ) : (
                <>
                  <div className="text-2xl font-black text-white sm:text-3xl">{stat.value}</div>
                  <div className="text-xs text-text-muted">{stat.label}</div>
                </>
              )}
            </div>
          ))}
          {isSelected && (
            <button
              onClick={e => {
                e.stopPropagation()
                onChange({ ...c, stats: [...stats, { value: '0K+', label: 'New metric' }] })
              }}
              className="rounded border border-dashed border-white/20 px-3 py-2 text-xs text-text-muted hover:text-white"
            >
              + Stat
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
