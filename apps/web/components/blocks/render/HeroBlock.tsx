interface HeroBubble {
  value: string
  label: string
}

interface HeroContent {
  eyebrow?: string
  heading: string
  subheading?: string
  ctaText?: string
  ctaUrl?: string
  ctaBadge?: string
  ctaSecondaryText?: string
  trustLine?: string
  imageUrl?: string
  bubbles?: HeroBubble[]
}

export function HeroBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as HeroContent

  return (
    <section className="relative overflow-hidden px-6 py-20 sm:px-12 sm:py-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_75%_40%,rgba(255,106,0,0.12)_0%,transparent_65%)]" />

      <div className="stagger relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {c.eyebrow && (
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange" />
              <span className="text-xs font-semibold tracking-wide text-orange">{c.eyebrow}</span>
            </div>
          )}

          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {c.heading}
          </h1>

          {c.subheading && (
            <p className="text-lg leading-relaxed text-text-secondary sm:text-xl">{c.subheading}</p>
          )}

          {(c.ctaText || c.ctaSecondaryText) && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {c.ctaText && (
                <div className="relative inline-flex">
                  {c.ctaBadge && (
                    <span className="absolute -right-2 -top-2 z-10 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-black text-orange shadow-sm">
                      {c.ctaBadge}
                    </span>
                  )}
                  <a
                    href={c.ctaUrl || '#'}
                    className="inline-flex items-center gap-2 rounded-lg bg-orange px-7 py-3.5 text-base font-semibold text-white shadow-orange transition-opacity hover:opacity-90"
                  >
                    {c.ctaText}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              )}
              {c.ctaSecondaryText && (
                <a
                  href={c.ctaUrl || '#'}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/16 px-7 py-3.5 text-base font-medium text-text-secondary transition-colors hover:border-white/30 hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                  </svg>
                  {c.ctaSecondaryText}
                </a>
              )}
            </div>
          )}

          {c.trustLine && <p className="text-xs text-text-muted">{c.trustLine}</p>}
        </div>

        {/* Right column: image + floating bubbles */}
        <div className="relative">
          {c.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.imageUrl} alt="" className="w-full rounded-2xl object-cover shadow-float" />
          ) : (
            <div className="flex h-56 items-center justify-center rounded-2xl border border-white/8 bg-bg-card-alt sm:h-72">
              <span className="text-sm text-text-muted opacity-40">Platform screenshot</span>
            </div>
          )}

          {/* Floating stat bubbles */}
          {c.bubbles?.map((bubble, i) => {
            const pos =
              [
                'absolute -top-4 -left-4',
                'absolute top-1/2 -translate-y-1/2 -right-4',
                'absolute -bottom-4 left-8',
              ][i] ?? ''
            return (
              <div
                key={i}
                className={`${pos} z-10 rounded-xl border border-white/10 bg-bg-raised/90 px-3 py-2.5 shadow-float backdrop-blur-sm`}
              >
                <div className="text-sm font-bold text-white">{bubble.value}</div>
                <div className="text-xs text-text-muted">{bubble.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
