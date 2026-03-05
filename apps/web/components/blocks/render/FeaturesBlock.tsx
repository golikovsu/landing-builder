type FeatureBadge = 'new' | 'improved' | 'fixed' | 'coming'

interface FeatureCard {
  badge?: FeatureBadge
  icon: string
  title: string
  description: string
}

interface FeaturesContent {
  heading: string
  cards: FeatureCard[]
}

const BADGE_STYLES: Record<FeatureBadge, string> = {
  new: 'bg-emerald-500/15 text-emerald-400',
  improved: 'bg-sky-500/15 text-sky-400',
  fixed: 'bg-amber-500/15 text-amber-400',
  coming: 'bg-white/10 text-text-muted',
}

const BADGE_LABELS: Record<FeatureBadge, string> = {
  new: 'New',
  improved: 'Improved',
  fixed: 'Fixed',
  coming: 'Coming Soon',
}

export function FeaturesBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as FeaturesContent

  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {c.heading && (
          <h2 className="mb-12 text-center text-3xl font-black text-white sm:text-4xl">
            {c.heading}
          </h2>
        )}

        <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.cards?.map((card, i) => (
            <div
              key={i}
              className="group flex flex-col rounded-xl border border-white/8 bg-bg-card p-6 transition-all duration-200 hover:border-orange/30 hover:bg-bg-card-alt"
            >
              {/* Badge */}
              {card.badge && (
                <span
                  className={`mb-3 inline-block self-start rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${BADGE_STYLES[card.badge]}`}
                >
                  {BADGE_LABELS[card.badge]}
                </span>
              )}

              <div className="mb-4 text-3xl">{card.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-white">{card.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
