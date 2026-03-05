'use client'

import type { Block } from '../../lib/api'

type FeatureBadge = 'new' | 'improved' | 'fixed' | 'coming'

interface FeatureCard {
  badge?: FeatureBadge
  icon: string
  title: string
  description: string
}

interface FeaturesContent {
  heading: string
  subtitle?: string
  cards: FeatureCard[]
}

interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

const BADGE_STYLES: Record<FeatureBadge, string> = {
  new: 'bg-success/15 text-success',
  improved: 'bg-info/15 text-info',
  fixed: 'bg-warning/15 text-warning',
  coming: 'bg-text-muted/20 text-text-muted',
}

const BADGE_LABELS: Record<FeatureBadge, string> = {
  new: 'New',
  improved: 'Improved',
  fixed: 'Fixed',
  coming: 'Coming Soon',
}

export function FeaturesBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as FeaturesContent

  const updateCard = (index: number, patch: Partial<FeatureCard>) => {
    const cards = c.cards.map((card, i) => (i === index ? { ...card, ...patch } : card))
    onChange({ ...c, cards })
  }

  const addCard = () => {
    onChange({
      ...c,
      cards: [
        ...c.cards,
        {
          badge: 'new' as FeatureBadge,
          icon: '✨',
          title: 'New Feature',
          description: 'Describe this feature.',
        },
      ],
    })
  }

  const removeCard = (index: number) => {
    onChange({ ...c, cards: c.cards.filter((_, i) => i !== index) })
  }

  return (
    <div className="rounded-xl bg-bg-card px-8 py-12">
      {/* Heading */}
      {isSelected ? (
        <div className="mb-2 text-center">
          <input
            type="text"
            value={c.heading}
            onChange={e => onChange({ ...c, heading: e.target.value })}
            onClick={e => e.stopPropagation()}
            className="block w-full bg-transparent text-center text-2xl font-bold text-white outline-none focus:underline"
            placeholder="Section heading"
          />
          <input
            type="text"
            value={c.subtitle ?? ''}
            onChange={e => onChange({ ...c, subtitle: e.target.value })}
            onClick={e => e.stopPropagation()}
            className="mt-2 block w-full bg-transparent text-center text-sm text-text-secondary outline-none focus:underline"
            placeholder="Subtitle (optional)"
          />
        </div>
      ) : (
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white">{c.heading}</h2>
          {c.subtitle && <p className="mt-2 text-sm text-text-secondary">{c.subtitle}</p>}
        </div>
      )}

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.cards.map((card, i) => (
          <div
            key={i}
            className="group relative rounded-xl border border-white/8 bg-bg-card-alt p-5 transition-all hover:border-orange/30"
          >
            {isSelected && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  removeCard(i)
                }}
                className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded text-text-muted hover:text-error"
                title="Remove card"
              >
                ×
              </button>
            )}

            {isSelected ? (
              <>
                {/* Badge selector */}
                <div className="mb-3 flex flex-wrap gap-1">
                  {(['new', 'improved', 'fixed', 'coming'] as FeatureBadge[]).map(b => (
                    <button
                      key={b}
                      onClick={e => {
                        e.stopPropagation()
                        updateCard(i, { badge: b })
                      }}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-all ${
                        card.badge === b
                          ? BADGE_STYLES[b]
                          : 'bg-white/6 text-text-muted hover:bg-white/12'
                      }`}
                    >
                      {BADGE_LABELS[b]}
                    </button>
                  ))}
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      updateCard(i, { badge: undefined })
                    }}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-all ${
                      !card.badge
                        ? 'bg-white/20 text-white'
                        : 'bg-white/6 text-text-muted hover:bg-white/12'
                    }`}
                  >
                    None
                  </button>
                </div>

                <input
                  type="text"
                  value={card.icon}
                  onChange={e => updateCard(i, { icon: e.target.value })}
                  onClick={e => e.stopPropagation()}
                  className="mb-2 block w-12 bg-transparent text-2xl outline-none"
                  maxLength={2}
                />
                <input
                  type="text"
                  value={card.title}
                  onChange={e => updateCard(i, { title: e.target.value })}
                  onClick={e => e.stopPropagation()}
                  className="mb-2 block w-full bg-transparent text-sm font-semibold text-white outline-none focus:underline"
                  placeholder="Feature title"
                />
                <textarea
                  value={card.description}
                  onChange={e => updateCard(i, { description: e.target.value })}
                  onClick={e => e.stopPropagation()}
                  className="block w-full resize-none bg-transparent text-xs text-text-secondary outline-none"
                  rows={2}
                  placeholder="Description…"
                />
              </>
            ) : (
              <>
                {card.badge && (
                  <span
                    className={`mb-3 inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${BADGE_STYLES[card.badge]}`}
                  >
                    {BADGE_LABELS[card.badge]}
                  </span>
                )}
                <div className="mb-3 text-2xl">{card.icon}</div>
                <h3 className="mb-1.5 text-sm font-semibold text-white">{card.title}</h3>
                <p className="text-xs leading-relaxed text-text-secondary">{card.description}</p>
              </>
            )}
          </div>
        ))}

        {isSelected && (
          <button
            onClick={e => {
              e.stopPropagation()
              addCard()
            }}
            className="flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-white/16 text-text-muted transition-colors hover:border-orange/50 hover:text-orange"
          >
            <span className="text-2xl">+</span>
          </button>
        )}
      </div>
    </div>
  )
}
