interface Step {
  number?: string
  icon: string
  title: string
  description: string
  ctaText?: string
  ctaUrl?: string
}
interface HowItWorksContent {
  heading: string
  subheading?: string
  steps: Step[]
}

export function HowItWorksBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as HowItWorksContent
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {c.heading && (
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">{c.heading}</h2>
            {c.subheading && <p className="mt-3 text-text-secondary">{c.subheading}</p>}
          </div>
        )}
        <div className="stagger grid gap-8 sm:grid-cols-3">
          {c.steps?.map((step, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-orange/30 bg-orange/10 text-2xl">
                {step.icon}
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-black text-white">
                  {step.number ?? i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{step.description}</p>
              {step.ctaText && (
                <a
                  href={step.ctaUrl || '#'}
                  className="mt-auto text-sm font-semibold text-orange hover:underline"
                >
                  {step.ctaText} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
