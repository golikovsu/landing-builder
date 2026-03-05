interface Testimonial {
  name: string
  location: string
  rating: number
  text: string
  avatar?: string
  isVideo?: boolean
}
interface TestimonialsContent {
  heading?: string
  statsLine?: string
  testimonials: Testimonial[]
}

export function TestimonialsBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as TestimonialsContent
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {c.heading && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">{c.heading}</h2>
            {c.statsLine && <p className="mt-3 text-sm text-text-muted">{c.statsLine}</p>}
          </div>
        )}
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.testimonials?.map((t, i) => (
            <div
              key={i}
              className="relative flex flex-col gap-4 rounded-xl border border-white/8 bg-bg-card p-6"
            >
              {t.isVideo && (
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-orange/20">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-0.5 text-orange"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={j < t.rating ? 'text-warning' : 'text-white/10'}>
                    ★
                  </span>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-raised text-lg">
                  {t.avatar || '👤'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-text-muted">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
