interface TimelineEntry {
  year: string
  title: string
  description: string
  badge?: string
}
interface TimelineContent {
  heading: string
  entries: TimelineEntry[]
}

export function TimelineBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as TimelineContent
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-3xl">
        {c.heading && (
          <h2 className="mb-14 text-center text-3xl font-black text-white sm:text-4xl">
            {c.heading}
          </h2>
        )}
        <div className="relative">
          <div className="absolute left-[72px] top-0 h-full w-px bg-white/8 sm:left-[88px]" />
          <div className="space-y-8">
            {c.entries?.map((entry, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="w-16 shrink-0 text-right sm:w-20">
                  <span className="text-sm font-black text-orange">{entry.year}</span>
                </div>
                <div className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-orange bg-bg-base" />
                <div className="pb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{entry.title}</h3>
                    {entry.badge && (
                      <span className="rounded bg-orange/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-orange">
                        {entry.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
