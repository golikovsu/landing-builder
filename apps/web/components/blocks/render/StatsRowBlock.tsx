interface StatItem {
  value: string
  label: string
  icon?: string
}
interface StatsRowContent {
  stats: StatItem[]
}

export function StatsRowBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as StatsRowContent
  return (
    <section className="border-y border-white/6 bg-bg-raised px-6 py-8 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-around gap-8">
          {c.stats?.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              {stat.icon && <span className="mb-1 text-xl">{stat.icon}</span>}
              <div className="text-2xl font-black text-white sm:text-3xl">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
