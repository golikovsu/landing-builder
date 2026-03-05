interface PricingPlan {
  name: string
  price: string
  period?: string
  description?: string
  ctaText: string
  ctaUrl: string
  highlighted?: boolean
  badge?: string
  features: string[]
}
interface PricingContent {
  heading: string
  subheading?: string
  plans: PricingPlan[]
}

export function PricingBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as PricingContent
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
          {c.plans?.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col gap-6 rounded-xl p-6 ${plan.highlighted ? 'border-2 border-orange bg-orange/5 shadow-orange' : 'border border-white/8 bg-bg-card'}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-orange px-3 py-1 text-xs font-bold text-white shadow-orange">
                    {plan.badge}
                  </span>
                </div>
              )}
              <div>
                <h3 className="mb-1 text-lg font-bold text-white">{plan.name}</h3>
                {plan.description && <p className="text-xs text-text-muted">{plan.description}</p>}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                {plan.period && <span className="text-sm text-text-muted">{plan.period}</span>}
              </div>
              <ul className="flex-1 space-y-2">
                {plan.features?.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="mt-0.5 text-success">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaUrl || '#'}
                className={`block rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all ${plan.highlighted ? 'bg-orange text-white shadow-orange hover:opacity-90' : 'border border-white/15 text-white hover:bg-white/6'}`}
              >
                {plan.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
