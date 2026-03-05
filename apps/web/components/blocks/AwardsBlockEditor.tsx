'use client'

import type { Block } from '../../lib/api'

interface Award {
  icon?: string
  title: string
  org: string
  year?: string
}
interface AwardsContent {
  heading: string
  awards: Award[]
  mediaHeading?: string
  mediaLogos?: string[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function AwardsBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as AwardsContent
  const awards = c.awards ?? []
  const mediaLogos = c.mediaLogos ?? []
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  const updateAward = (i: number, patch: Partial<Award>) => {
    const next = [...awards]
    next[i] = { ...awards[i], ...patch }
    onChange({ ...c, awards: next })
  }
  const removeAward = (i: number) => {
    onChange({ ...c, awards: awards.filter((_, idx) => idx !== i) })
  }
  const addAward = () => {
    onChange({
      ...c,
      awards: [
        ...awards,
        { icon: '🏆', title: 'Best Platform', org: 'Forex Awards', year: '2024' },
      ],
    })
  }
  const updateLogo = (i: number, val: string) => {
    const next = [...mediaLogos]
    next[i] = val
    onChange({ ...c, mediaLogos: next })
  }
  const removeLogo = (i: number) => {
    onChange({ ...c, mediaLogos: mediaLogos.filter((_, idx) => idx !== i) })
  }
  const addLogo = () => {
    onChange({ ...c, mediaLogos: [...mediaLogos, 'Forbes'] })
  }

  if (!isSelected) {
    return (
      <div className="py-12">
        <h2 className="mb-8 text-center text-2xl font-black text-white">{c.heading}</h2>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {awards.slice(0, 3).map((a, i) => (
            <div key={i} className="rounded-xl border border-white/8 bg-bg-raised p-5 text-center">
              <div className="mb-2 text-3xl">{a.icon || '🏆'}</div>
              <p className="font-bold text-white">{a.title}</p>
              <p className="text-xs text-text-muted">
                {a.org} {a.year}
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
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">
        Awards & Recognition
      </p>
      <div>
        <label className={lbl}>Section Heading</label>
        <input
          className={`${inp} font-black`}
          value={c.heading ?? ''}
          onChange={e => onChange({ ...c, heading: e.target.value })}
          placeholder="Awards & Recognition"
        />
      </div>
      <div className="space-y-3">
        <label className={lbl}>Awards</label>
        {awards.map((a, i) => (
          <div key={i} className="rounded-lg border border-white/8 bg-bg-raised p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase text-text-muted">
                Award {i + 1}
              </span>
              <button
                onClick={() => removeAward(i)}
                className="text-[10px] text-text-muted hover:text-red-400"
              >
                ✕ Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-4">
              <div>
                <label className={lbl}>Icon</label>
                <input
                  className={inp}
                  value={a.icon ?? ''}
                  onChange={e => updateAward(i, { icon: e.target.value })}
                  placeholder="🏆"
                />
              </div>
              <div>
                <label className={lbl}>Award Title</label>
                <input
                  className={`${inp} font-bold`}
                  value={a.title}
                  onChange={e => updateAward(i, { title: e.target.value })}
                  placeholder="Best Platform"
                />
              </div>
              <div>
                <label className={lbl}>Organization</label>
                <input
                  className={inp}
                  value={a.org}
                  onChange={e => updateAward(i, { org: e.target.value })}
                  placeholder="Forex Awards"
                />
              </div>
              <div>
                <label className={lbl}>Year</label>
                <input
                  className={inp}
                  value={a.year ?? ''}
                  onChange={e => updateAward(i, { year: e.target.value })}
                  placeholder="2024"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addAward}
          className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-text-secondary hover:border-orange/40 hover:text-white"
        >
          + Add Award
        </button>
      </div>
      <div className="space-y-2">
        <label className={lbl}>Media Logos / As Seen In</label>
        <div>
          <label className={lbl}>Section Label</label>
          <input
            className={inp}
            value={c.mediaHeading ?? ''}
            onChange={e => onChange({ ...c, mediaHeading: e.target.value })}
            placeholder="As seen in"
          />
        </div>
        {mediaLogos.map((logo, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={`${inp} flex-1 rounded-lg border border-white/8 bg-bg-raised px-3 py-2 text-sm`}
              value={logo}
              onChange={e => updateLogo(i, e.target.value)}
              placeholder="Forbes / Bloomberg / Reuters"
            />
            <button
              onClick={() => removeLogo(i)}
              className="shrink-0 text-text-muted hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
        <button onClick={addLogo} className="text-xs text-text-muted hover:text-orange">
          + Add media outlet
        </button>
      </div>
    </div>
  )
}
