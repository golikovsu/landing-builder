'use client'

import { useRef, useEffect } from 'react'
import type { Block } from '../../lib/api'

interface HeroBubble {
  value: string // "+18.4%"
  label: string // "Portfolio today"
}

interface HeroContent {
  eyebrow: string // "Platform v3.0 — Now live"
  heading: string
  subheading: string
  ctaText: string
  ctaUrl: string
  ctaSecondaryText: string // "Watch Demo"
  trustLine: string // "$10,000 demo · No credit card · Withdraw anytime"
  imageUrl: string
  bubbles: HeroBubble[]
}

interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

function Editable({
  value,
  onChange,
  className,
  placeholder,
  multiline = false,
}: {
  value: string
  onChange: (v: string) => void
  className?: string
  placeholder?: string
  multiline?: boolean
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value
    }
  }, [value])

  const Tag = multiline ? 'p' : 'span'

  return (
    <Tag
      ref={ref as React.RefObject<HTMLParagraphElement & HTMLSpanElement>}
      contentEditable
      suppressContentEditableWarning
      className={`outline-none ${className ?? ''}`}
      data-placeholder={placeholder}
      onBlur={e => onChange(e.currentTarget.textContent ?? '')}
      onClick={e => e.stopPropagation()}
      onKeyDown={e => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault()
          e.currentTarget.blur()
        }
        if (e.key === 'Escape') {
          e.currentTarget.textContent = value
          e.currentTarget.blur()
        }
      }}
    />
  )
}

export function HeroBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as HeroContent

  const update = (patch: Partial<HeroContent>) => onChange({ ...c, ...patch })

  const updateBubble = (i: number, patch: Partial<HeroBubble>) => {
    const bubbles = (c.bubbles ?? []).map((b, idx) => (idx === i ? { ...b, ...patch } : b))
    update({ bubbles })
  }

  const editRing = isSelected
    ? 'rounded hover:outline hover:outline-1 hover:outline-orange/40 hover:outline-offset-1'
    : ''

  return (
    <div className="relative overflow-hidden rounded-xl bg-bg-card px-6 py-10 lg:px-10 lg:py-14">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_75%_40%,rgba(255,106,0,0.10)_0%,transparent_65%)]" />

      <div className="relative grid items-center gap-10 lg:grid-cols-2">
        {/* ── LEFT: text column ─────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Eyebrow badge */}
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
            <Editable
              value={c.eyebrow ?? 'Platform v3.0 — Now live'}
              onChange={v => update({ eyebrow: v })}
              className={`text-xs font-semibold tracking-wide text-orange ${editRing}`}
              placeholder="Eyebrow text…"
            />
          </div>

          {/* Heading */}
          <Editable
            value={c.heading}
            onChange={v => update({ heading: v })}
            className={`block text-4xl font-black leading-tight tracking-tight text-white lg:text-5xl ${editRing}`}
            placeholder="Your Headline Here"
          />

          {/* Subheading */}
          <Editable
            value={c.subheading}
            onChange={v => update({ subheading: v })}
            className={`block text-base leading-relaxed text-text-secondary ${editRing}`}
            placeholder="Describe your product value in one sentence."
            multiline
          />

          {/* CTA buttons */}
          {isSelected ? (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <input
                value={c.ctaText}
                onChange={e => update({ ctaText: e.target.value })}
                onClick={e => e.stopPropagation()}
                className="rounded-lg bg-orange/20 px-3 py-1.5 text-sm font-semibold text-orange outline-none focus:bg-orange/30"
                placeholder="Primary CTA"
              />
              <input
                value={c.ctaSecondaryText ?? ''}
                onChange={e => update({ ctaSecondaryText: e.target.value })}
                onClick={e => e.stopPropagation()}
                className="rounded-lg border border-white/12 px-3 py-1.5 text-sm font-medium text-text-secondary outline-none focus:border-white/24"
                placeholder="Secondary CTA"
              />
              <input
                value={c.ctaUrl}
                onChange={e => update({ ctaUrl: e.target.value })}
                onClick={e => e.stopPropagation()}
                className="w-full rounded bg-white/6 px-3 py-1 text-xs text-text-muted outline-none focus:bg-white/10"
                placeholder="https://… (link URL)"
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-orange">
                {c.ctaText || 'Get Started'}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {c.ctaSecondaryText && (
                <div className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/16 px-5 py-2.5 text-sm font-medium text-text-secondary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                  </svg>
                  {c.ctaSecondaryText}
                </div>
              )}
            </div>
          )}

          {/* Trust line */}
          <Editable
            value={c.trustLine ?? ''}
            onChange={v => update({ trustLine: v })}
            className={`text-xs text-text-muted ${editRing}`}
            placeholder="$10,000 demo · No credit card · Withdraw anytime"
          />
        </div>

        {/* ── RIGHT: visual column ─────────────────────────────── */}
        <div className="relative">
          {/* Platform image or placeholder */}
          {c.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.imageUrl} alt="" className="w-full rounded-2xl object-cover shadow-float" />
          ) : (
            <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-white/12 bg-bg-card-alt">
              {isSelected ? (
                <input
                  value={c.imageUrl || ''}
                  onChange={e => update({ imageUrl: e.target.value })}
                  onClick={e => e.stopPropagation()}
                  className="w-full max-w-xs rounded bg-white/8 px-3 py-2 text-center text-xs text-text-secondary outline-none focus:bg-white/12"
                  placeholder="Image URL (optional)"
                />
              ) : (
                <span className="text-sm text-text-muted opacity-50">Platform screenshot</span>
              )}
            </div>
          )}

          {/* Floating stat bubbles */}
          {(c.bubbles ?? []).map((bubble, i) => {
            const pos =
              [
                'absolute -top-3 -left-3',
                'absolute top-1/2 -translate-y-1/2 -right-3',
                'absolute -bottom-3 left-8',
              ][i] ?? 'absolute top-2 left-2'

            return (
              <div
                key={i}
                className={`${pos} z-10 rounded-xl border border-white/10 bg-bg-raised/95 px-3 py-2.5 shadow-float backdrop-blur-sm`}
              >
                {isSelected ? (
                  <div className="flex flex-col gap-0.5" onClick={e => e.stopPropagation()}>
                    <input
                      value={bubble.value}
                      onChange={e => updateBubble(i, { value: e.target.value })}
                      className="w-28 bg-transparent text-sm font-bold text-white outline-none"
                      placeholder="+18.4%"
                    />
                    <input
                      value={bubble.label}
                      onChange={e => updateBubble(i, { label: e.target.value })}
                      className="w-28 bg-transparent text-xs text-text-muted outline-none"
                      placeholder="label…"
                    />
                  </div>
                ) : (
                  <>
                    <div className="text-sm font-bold text-white">{bubble.value}</div>
                    <div className="text-xs text-text-muted">{bubble.label}</div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
