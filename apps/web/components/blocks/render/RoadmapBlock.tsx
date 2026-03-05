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

const STATUS_STYLES: Record<RoadmapStatus, string> = {
  shipped: 'bg-success/15 text-success',
  in_progress: 'bg-orange/15 text-orange',
  planned: 'bg-white/10 text-text-muted',
}
const STATUS_LABELS: Record<RoadmapStatus, string> = {
  shipped: '✓ Shipped',
  in_progress: '⟳ In Progress',
  planned: '○ Planned',
}

export function RoadmapBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as RoadmapContent
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {c.heading && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">{c.heading}</h2>
            {c.subheading && <p className="mt-3 text-text-secondary">{c.subheading}</p>}
          </div>
        )}
        <div className="stagger grid gap-6 sm:grid-cols-3">
          {c.cards?.map((card, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-white/8 bg-bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {card.period}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[card.status]}`}
                >
                  {STATUS_LABELS[card.status]}
                </span>
              </div>
              <h3 className="font-bold text-white">{card.title}</h3>
              <ul className="space-y-2">
                {card.items?.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="mt-0.5 text-orange">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
