'use client'

import type { Block } from '../../lib/api'

interface TickerItem {
  avatar: string
  name: string
  action: string
  time: string
}
interface TickerContent {
  items: TickerItem[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function TickerBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as TickerContent
  const items = c.items ?? []
  return (
    <div className="border-y border-white/6 bg-bg-raised py-3">
      <div className="flex gap-4 overflow-hidden px-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2.5 rounded-lg border border-white/8 bg-bg-card px-4 py-2"
          >
            {isSelected ? (
              <input
                type="text"
                value={item.avatar}
                onChange={e => {
                  const its = [...items]
                  its[i] = { ...item, avatar: e.target.value }
                  onChange({ ...c, items: its })
                }}
                onClick={e => e.stopPropagation()}
                className="w-8 bg-transparent text-center text-xl outline-none"
              />
            ) : (
              <span className="text-xl">{item.avatar}</span>
            )}
            <div className="text-xs">
              <span className="font-semibold text-white">{item.name}</span>{' '}
              <span className="text-text-secondary">{item.action}</span>
            </div>
            <span className="text-[10px] text-text-muted">{item.time}</span>
          </div>
        ))}
        {isSelected && (
          <button
            onClick={e => {
              e.stopPropagation()
              onChange({
                ...c,
                items: [
                  ...items,
                  { avatar: '👤', name: 'User', action: 'just joined', time: '1 min ago' },
                ],
              })
            }}
            className="shrink-0 rounded-lg border border-dashed border-white/20 px-4 py-2 text-xs text-text-muted hover:text-white"
          >
            + Add
          </button>
        )}
      </div>
    </div>
  )
}
