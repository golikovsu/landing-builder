interface CTAContent {
  heading: string
  subheading?: string
  ctaText: string
  ctaUrl: string
  variant: 'orange' | 'dark' | 'bordered'
}

const WRAPPER_STYLES: Record<CTAContent['variant'], string> = {
  orange: 'bg-gradient-orange',
  dark: 'bg-bg-raised border border-white/8',
  bordered: 'border-2 border-orange',
}

const BUTTON_STYLES: Record<CTAContent['variant'], string> = {
  orange: 'bg-white text-orange hover:bg-white/90',
  dark: 'bg-orange text-white shadow-orange hover:opacity-90',
  bordered: 'bg-orange text-white shadow-orange hover:opacity-90',
}

export function CTABannerBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as CTAContent

  return (
    <section className="px-6 py-8 sm:px-12">
      <div
        className={`mx-auto max-w-4xl rounded-2xl px-8 py-14 text-center ${WRAPPER_STYLES[c.variant]}`}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{c.heading}</h2>

        {c.subheading && (
          <p className="mx-auto mt-4 max-w-xl text-base text-white/80">{c.subheading}</p>
        )}

        {c.ctaText && (
          <div className="mt-8">
            <a
              href={c.ctaUrl || '#'}
              className={`inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-semibold transition-all ${BUTTON_STYLES[c.variant]}`}
            >
              {c.ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
