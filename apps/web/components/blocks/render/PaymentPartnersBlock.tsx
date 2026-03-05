interface PaymentPartnersContent {
  heading?: string
  partners: string[]
}

export function PaymentPartnersBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as PaymentPartnersContent
  return (
    <section className="px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-4xl">
        {c.heading && (
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-text-muted">
            {c.heading}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {c.partners?.map((partner, i) => (
            <div
              key={i}
              className="flex h-10 items-center rounded-lg border border-white/8 bg-bg-raised px-4 text-sm font-bold text-text-muted opacity-60 transition-opacity hover:opacity-100"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
