interface Award {
  icon?: string
  title: string
  org: string
  year?: string
}
interface AwardsContent {
  heading: string
  awards: Award[]
  mediaHeading?: string
  mediaLogos?: string[]
}

export function AwardsBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as AwardsContent
  return (
    <section className="px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {c.heading && (
          <h2 className="mb-10 text-center text-2xl font-black text-white sm:text-3xl">
            {c.heading}
          </h2>
        )}
        <div className="stagger mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.awards?.map((award, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 rounded-xl border border-white/8 bg-bg-card p-6 text-center"
            >
              <div className="text-4xl">{award.icon || '🏆'}</div>
              <p className="text-sm font-bold text-white">{award.title}</p>
              <p className="text-xs text-text-muted">{award.org}</p>
              {award.year && (
                <span className="rounded bg-orange/15 px-2 py-0.5 text-[10px] font-semibold text-orange">
                  {award.year}
                </span>
              )}
            </div>
          ))}
        </div>
        {c.mediaHeading && (c.mediaLogos?.length ?? 0) > 0 && (
          <>
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-text-muted">
              {c.mediaHeading}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {c.mediaLogos!.map((logo, i) => (
                <span key={i} className="text-sm font-bold text-text-muted opacity-50">
                  {logo}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
