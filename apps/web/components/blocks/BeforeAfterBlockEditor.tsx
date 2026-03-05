'use client'

import type { Block } from '../../lib/api'

interface BeforeAfterContent {
  heading: string
  subheading?: string
  beforeLabel: string
  afterLabel: string
  beforeImage?: string
  afterImage?: string
  bullets?: string[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function BeforeAfterBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as BeforeAfterContent
  const bullets = c.bullets ?? []
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  const updateBullet = (i: number, val: string) => {
    const next = [...bullets]
    next[i] = val
    onChange({ ...c, bullets: next })
  }
  const removeBullet = (i: number) => {
    onChange({ ...c, bullets: bullets.filter((_, idx) => idx !== i) })
  }
  const addBullet = () => {
    onChange({ ...c, bullets: [...bullets, 'New benefit'] })
  }

  if (!isSelected) {
    return (
      <div className="py-12">
        <h2 className="mb-8 text-center text-2xl font-black text-white">{c.heading}</h2>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="mb-2 text-xs font-semibold uppercase text-red-400">{c.beforeLabel}</p>
            {c.beforeImage ? (
              <img src={c.beforeImage} className="w-full rounded" alt="before" />
            ) : (
              <div className="h-32 rounded bg-white/5" />
            )}
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="mb-2 text-xs font-semibold uppercase text-emerald-400">{c.afterLabel}</p>
            {c.afterImage ? (
              <img src={c.afterImage} className="w-full rounded" alt="after" />
            ) : (
              <div className="h-32 rounded bg-white/5" />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="space-y-4 rounded-xl border border-orange/20 bg-bg-card p-5"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">Before / After</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={lbl}>Heading</label>
          <input
            className={`${inp} font-black`}
            value={c.heading ?? ''}
            onChange={e => onChange({ ...c, heading: e.target.value })}
            placeholder="Before vs After IQ Option"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl}>Subheading</label>
          <input
            className={inp}
            value={c.subheading ?? ''}
            onChange={e => onChange({ ...c, subheading: e.target.value })}
            placeholder="See the difference for yourself."
          />
        </div>
        <div>
          <label className={lbl}>Before Label</label>
          <input
            className={inp}
            value={c.beforeLabel ?? ''}
            onChange={e => onChange({ ...c, beforeLabel: e.target.value })}
            placeholder="Without IQ Option"
          />
        </div>
        <div>
          <label className={lbl}>After Label</label>
          <input
            className={inp}
            value={c.afterLabel ?? ''}
            onChange={e => onChange({ ...c, afterLabel: e.target.value })}
            placeholder="With IQ Option"
          />
        </div>
        <div>
          <label className={lbl}>Before Image URL (optional)</label>
          <input
            className={inp}
            value={c.beforeImage ?? ''}
            onChange={e => onChange({ ...c, beforeImage: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className={lbl}>After Image URL (optional)</label>
          <input
            className={inp}
            value={c.afterImage ?? ''}
            onChange={e => onChange({ ...c, afterImage: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
      <div>
        <label className={lbl}>Bullet Points</label>
        <div className="space-y-1.5">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={`${inp} flex-1 text-sm`}
                value={b}
                onChange={e => updateBullet(i, e.target.value)}
                placeholder="Benefit..."
              />
              <button
                onClick={() => removeBullet(i)}
                className="shrink-0 text-text-muted hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={addBullet} className="text-xs text-text-muted hover:text-orange">
            + Add bullet
          </button>
        </div>
      </div>
    </div>
  )
}
