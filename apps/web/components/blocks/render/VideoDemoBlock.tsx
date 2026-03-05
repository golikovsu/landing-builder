'use client'

import { useState } from 'react'

interface VideoDemoContent {
  heading: string
  subheading?: string
  videoUrl?: string
  thumbnailUrl?: string
  badge?: string
}

export function VideoDemoBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as VideoDemoContent
  const [playing, setPlaying] = useState(false)
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-4xl">
        {c.heading && (
          <div className="mb-10 text-center">
            {c.badge && (
              <span className="mb-3 inline-block rounded-full bg-orange/15 px-3 py-1 text-xs font-semibold text-orange">
                {c.badge}
              </span>
            )}
            <h2 className="text-3xl font-black text-white sm:text-4xl">{c.heading}</h2>
            {c.subheading && <p className="mt-3 text-text-secondary">{c.subheading}</p>}
          </div>
        )}
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-bg-card shadow-float">
          {playing && c.videoUrl ? (
            <iframe
              src={c.videoUrl}
              className="aspect-video w-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <div
              className="group relative flex aspect-video cursor-pointer items-center justify-center"
              onClick={() => setPlaying(true)}
            >
              {c.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.thumbnailUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-bg-card to-bg-card-alt" />
              )}
              <div className="absolute inset-0 bg-bg-base/40" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-orange/80">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1 text-white"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
