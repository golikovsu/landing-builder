interface ComparisonRow {
  feature: string
  us: string | boolean
  competitorA: string | boolean
  competitorB: string | boolean
}
interface ComparisonContent {
  heading: string
  ourName: string
  competitorA: string
  competitorB: string
  rows: ComparisonRow[]
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <span className="text-success text-lg">✓</span>
  if (value === false) return <span className="text-error/60 text-lg">✕</span>
  return <span className="text-sm text-text-secondary">{value as string}</span>
}

export function ComparisonBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as ComparisonContent
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-4xl">
        {c.heading && (
          <h2 className="mb-10 text-center text-3xl font-black text-white sm:text-4xl">
            {c.heading}
          </h2>
        )}
        <div className="overflow-hidden rounded-xl border border-white/8 bg-bg-card">
          <div className="grid grid-cols-4 border-b border-white/8 bg-bg-raised px-4 py-3">
            <div className="text-xs font-semibold uppercase text-text-muted">Feature</div>
            <div className="text-center text-xs font-bold text-orange">{c.ourName}</div>
            <div className="text-center text-xs text-text-muted">{c.competitorA}</div>
            <div className="text-center text-xs text-text-muted">{c.competitorB}</div>
          </div>
          {c.rows?.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-4 items-center px-4 py-3 text-center ${i % 2 === 0 ? '' : 'bg-white/2'}`}
            >
              <div className="text-left text-sm text-white">{row.feature}</div>
              <div>
                <Cell value={row.us} />
              </div>
              <div>
                <Cell value={row.competitorA} />
              </div>
              <div>
                <Cell value={row.competitorB} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
