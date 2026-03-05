type ChangeType = 'new' | 'improved' | 'fixed' | 'deprecated'

interface Change {
  type: ChangeType
  text: string
}

interface ChangelogEntry {
  version: string
  date: string
  changes: Change[]
}

interface ChangelogContent {
  heading: string
  entries: ChangelogEntry[]
}

const TYPE_STYLES: Record<ChangeType, string> = {
  new: 'bg-success/15 text-success',
  improved: 'bg-info/15 text-info',
  fixed: 'bg-warning/15 text-warning',
  deprecated: 'bg-error/15 text-error',
}

export function ChangelogBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as ChangelogContent

  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-3xl">
        {c.heading && (
          <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
            {c.heading}
          </h2>
        )}

        <div className="relative flex flex-col gap-8">
          {/* Timeline line */}
          <div className="absolute left-[7.5rem] top-0 hidden h-full w-px bg-white/8 sm:block" />

          {c.entries?.map((entry, i) => (
            <div key={i} className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              {/* Date + version */}
              <div className="flex shrink-0 flex-col items-end gap-1 sm:w-28">
                <span className="rounded-full bg-orange/15 px-3 py-1 text-sm font-bold text-orange">
                  v{entry.version}
                </span>
                <span className="text-xs text-text-muted">{entry.date}</span>
              </div>

              {/* Changes */}
              <div className="relative flex-1 rounded-xl border border-white/8 bg-bg-card p-5">
                {/* Connector dot */}
                <div className="absolute -left-[1.35rem] top-4 hidden h-3 w-3 rounded-full border-2 border-orange bg-bg-base sm:block" />

                <ul className="flex flex-col gap-2.5">
                  {entry.changes?.map((change, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-medium capitalize ${TYPE_STYLES[change.type]}`}
                      >
                        {change.type}
                      </span>
                      <span className="text-sm text-text-secondary">{change.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
