interface TickerItem {
  avatar: string
  name: string
  action: string
  time: string
}
interface TickerContent {
  items: TickerItem[]
}

export function TickerBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as TickerContent
  const items = c.items ?? []
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-white/6 bg-bg-raised py-3">
      <div className="flex gap-6 animate-ticker" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2.5 rounded-lg border border-white/8 bg-bg-card px-4 py-2"
          >
            <span className="text-xl">{item.avatar}</span>
            <div className="text-xs">
              <span className="font-semibold text-white">{item.name}</span>{' '}
              <span className="text-text-secondary">{item.action}</span>
            </div>
            <span className="ml-1 text-[10px] text-text-muted">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
