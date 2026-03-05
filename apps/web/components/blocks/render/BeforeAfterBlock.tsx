interface BeforeAfterContent {
  heading: string
  subheading?: string
  beforeLabel: string
  afterLabel: string
  beforeImage?: string
  afterImage?: string
  bullets?: string[]
}

export function BeforeAfterBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as BeforeAfterContent
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {c.heading && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">{c.heading}</h2>
            {c.subheading && <p className="mt-3 text-text-secondary">{c.subheading}</p>}
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-white/8 bg-bg-card">
            <div className="flex items-center gap-2 border-b border-white/8 bg-bg-raised px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-2 text-xs text-text-muted">{c.beforeLabel}</span>
            </div>
            {c.beforeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.beforeImage} alt={c.beforeLabel} className="w-full object-cover" />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-text-muted opacity-30">
                Screenshot placeholder
              </div>
            )}
          </div>
          <div className="overflow-hidden rounded-xl border border-orange/30 bg-bg-card shadow-orange">
            <div className="flex items-center gap-2 border-b border-orange/20 bg-orange/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange" />
              <span className="h-2.5 w-2.5 rounded-full bg-orange/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-orange/30" />
              <span className="ml-2 text-xs font-semibold text-orange">{c.afterLabel}</span>
            </div>
            {c.afterImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.afterImage} alt={c.afterLabel} className="w-full object-cover" />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-text-muted opacity-30">
                Screenshot placeholder
              </div>
            )}
          </div>
        </div>
        {(c.bullets?.length ?? 0) > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {c.bullets!.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-white/8 bg-bg-raised px-4 py-2"
              >
                <span className="text-success">✓</span>
                <span className="text-sm text-text-secondary">{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
