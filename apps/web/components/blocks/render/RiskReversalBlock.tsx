interface TrustCard {
  icon: string
  title: string
  description: string
}
interface RiskReversalContent {
  heading?: string
  cards: TrustCard[]
}

export function RiskReversalBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as RiskReversalContent
  return (
    <section className="px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-4xl">
        {c.heading && (
          <h2 className="mb-10 text-center text-2xl font-black text-white">{c.heading}</h2>
        )}
        <div className="stagger grid gap-6 sm:grid-cols-3">
          {c.cards?.map((card, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 rounded-xl border border-white/8 bg-bg-card p-8 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-bg-raised text-3xl">
                {card.icon}
              </div>
              <h3 className="font-bold text-white">{card.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
