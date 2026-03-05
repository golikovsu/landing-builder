'use client'

import type { Block } from '../../lib/api'

interface Testimonial {
  name: string
  location: string
  rating: number
  text: string
  avatar?: string
}
interface TestimonialsContent {
  heading?: string
  statsLine?: string
  testimonials: Testimonial[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function TestimonialsBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as TestimonialsContent
  const testimonials = c.testimonials ?? []
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  const updateT = (i: number, patch: Partial<Testimonial>) => {
    const next = [...testimonials]
    next[i] = { ...testimonials[i], ...patch }
    onChange({ ...c, testimonials: next })
  }
  const removeT = (i: number) => {
    onChange({ ...c, testimonials: testimonials.filter((_, idx) => idx !== i) })
  }
  const addT = () => {
    onChange({
      ...c,
      testimonials: [
        ...testimonials,
        { name: 'Alex M.', location: '🇩🇪 Germany', rating: 5, text: 'Amazing platform!' },
      ],
    })
  }

  if (!isSelected) {
    return (
      <div className="py-12">
        {c.heading && (
          <h2 className="mb-2 text-center text-2xl font-black text-white">{c.heading}</h2>
        )}
        {c.statsLine && (
          <p className="mb-8 text-center text-sm text-text-secondary">{c.statsLine}</p>
        )}
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <div key={i} className="rounded-xl border border-white/8 bg-bg-raised p-5">
              <p className="mb-1 text-xs text-orange">{'★'.repeat(t.rating)}</p>
              <p className="mb-3 text-sm text-text-secondary">&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm font-semibold text-white">
                {t.name} <span className="font-normal text-text-muted">{t.location}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="space-y-4 rounded-xl border border-orange/20 bg-bg-card p-5"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">Testimonials</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={lbl}>Section Heading</label>
          <input
            className={`${inp} font-black`}
            value={c.heading ?? ''}
            onChange={e => onChange({ ...c, heading: e.target.value })}
            placeholder="What Traders Say"
          />
        </div>
        <div>
          <label className={lbl}>Stats Line</label>
          <input
            className={inp}
            value={c.statsLine ?? ''}
            onChange={e => onChange({ ...c, statsLine: e.target.value })}
            placeholder="4.8★ from 50,000+ reviews"
          />
        </div>
      </div>
      <div className="space-y-3">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-lg border border-white/8 bg-bg-raised p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase text-text-muted">
                Review {i + 1}
              </span>
              <button
                onClick={() => removeT(i)}
                className="text-[10px] text-text-muted hover:text-red-400"
              >
                ✕ Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className={lbl}>Name</label>
                <input
                  className={`${inp} font-semibold`}
                  value={t.name}
                  onChange={e => updateT(i, { name: e.target.value })}
                  placeholder="Alex M."
                />
              </div>
              <div>
                <label className={lbl}>Location (flag + country)</label>
                <input
                  className={inp}
                  value={t.location}
                  onChange={e => updateT(i, { location: e.target.value })}
                  placeholder="🇩🇪 Germany"
                />
              </div>
              <div>
                <label className={lbl}>Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className={inp}
                  value={t.rating}
                  onChange={e => updateT(i, { rating: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={lbl}>Avatar URL (optional)</label>
                <input
                  className={inp}
                  value={t.avatar ?? ''}
                  onChange={e => updateT(i, { avatar: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Review Text</label>
                <textarea
                  className={`${inp} resize-none`}
                  rows={2}
                  value={t.text}
                  onChange={e => updateT(i, { text: e.target.value })}
                  placeholder="This platform changed my trading..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addT}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-text-secondary hover:border-orange/40 hover:text-white"
      >
        + Add Testimonial
      </button>
    </div>
  )
}
