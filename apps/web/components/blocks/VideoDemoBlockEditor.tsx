'use client'

import type { Block } from '../../lib/api'

interface VideoDemoContent {
  heading: string
  subheading?: string
  videoUrl?: string
  thumbnailUrl?: string
  badge?: string
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function VideoDemoBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as VideoDemoContent
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  if (!isSelected) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-2xl font-black text-white">{c.heading}</h2>
        {c.subheading && <p className="mb-6 text-sm text-text-secondary">{c.subheading}</p>}
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/8 bg-bg-raised">
          {c.thumbnailUrl ? (
            <img src={c.thumbnailUrl} className="w-full" alt="thumbnail" />
          ) : (
            <div className="flex h-48 items-center justify-center">
              <span className="text-4xl">▶</span>
            </div>
          )}
          {c.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-orange px-3 py-1 text-xs font-bold text-white">
              {c.badge}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="space-y-4 rounded-xl border border-orange/20 bg-bg-card p-5"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">Video Demo</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={lbl}>Heading</label>
          <input
            className={`${inp} text-xl font-black`}
            value={c.heading ?? ''}
            onChange={e => onChange({ ...c, heading: e.target.value })}
            placeholder="See It in Action"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl}>Subheading</label>
          <input
            className={inp}
            value={c.subheading ?? ''}
            onChange={e => onChange({ ...c, subheading: e.target.value })}
            placeholder="Watch how easy it is to start trading."
          />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl}>Video URL (YouTube, Vimeo, or mp4)</label>
          <input
            className={inp}
            value={c.videoUrl ?? ''}
            onChange={e => onChange({ ...c, videoUrl: e.target.value })}
            placeholder="https://youtube.com/embed/..."
          />
        </div>
        <div>
          <label className={lbl}>Thumbnail URL (optional)</label>
          <input
            className={inp}
            value={c.thumbnailUrl ?? ''}
            onChange={e => onChange({ ...c, thumbnailUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className={lbl}>Badge (optional)</label>
          <input
            className={inp}
            value={c.badge ?? ''}
            onChange={e => onChange({ ...c, badge: e.target.value })}
            placeholder="Live Demo"
          />
        </div>
      </div>
    </div>
  )
}
