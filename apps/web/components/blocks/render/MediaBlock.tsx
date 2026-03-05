interface MediaItem {
  url: string
  caption?: string
  type: 'image' | 'video'
}

interface MediaContent {
  heading: string
  items: MediaItem[]
  layout: 'grid' | 'carousel' | 'single'
}

export function MediaBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as MediaContent

  if (!c.items?.length) return null

  const gridClass =
    c.layout === 'grid'
      ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
      : c.layout === 'single'
        ? 'flex flex-col items-center'
        : 'flex gap-4 overflow-x-auto pb-2'

  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {c.heading && (
          <h2 className="mb-10 text-center text-3xl font-bold text-white sm:text-4xl">
            {c.heading}
          </h2>
        )}

        <div className={gridClass}>
          {c.items.map((item, i) => (
            <figure
              key={i}
              className={c.layout === 'carousel' ? 'shrink-0 w-72 sm:w-96' : undefined}
            >
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  className="w-full rounded-xl object-cover"
                  controls
                  preload="metadata"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.caption ?? ''}
                  className="w-full rounded-xl object-cover"
                  loading="lazy"
                />
              )}
              {item.caption && (
                <figcaption className="mt-2 text-center text-xs text-text-muted">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
