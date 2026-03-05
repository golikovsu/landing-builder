'use client'

import type { Block } from '../../lib/api'

interface NavLink {
  label: string
  href: string
}
interface NavContent {
  logo: string
  links: NavLink[]
  ctaText: string
  ctaUrl: string
  ctaSecondaryText?: string
}

interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function NavBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as NavContent
  const links = c.links ?? []
  return (
    <div className="border-b border-white/8 bg-bg-raised px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange text-sm font-black text-white">
            IQ
          </div>
          {isSelected ? (
            <input
              type="text"
              value={c.logo}
              onChange={e => onChange({ ...c, logo: e.target.value })}
              onClick={e => e.stopPropagation()}
              className="bg-transparent text-lg font-black text-white outline-none focus:underline"
              placeholder="Site name"
            />
          ) : (
            <span className="text-lg font-black text-white">{c.logo || 'IQ Option'}</span>
          )}
        </div>
        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link, i) =>
            isSelected ? (
              <input
                key={i}
                type="text"
                value={link.label}
                onChange={e => {
                  const ls = [...links]
                  ls[i] = { ...link, label: e.target.value }
                  onChange({ ...c, links: ls })
                }}
                onClick={e => e.stopPropagation()}
                className="w-20 bg-transparent text-sm text-text-muted outline-none"
              />
            ) : (
              <span key={i} className="text-sm text-text-muted">
                {link.label}
              </span>
            ),
          )}
          {isSelected && (
            <button
              onClick={e => {
                e.stopPropagation()
                onChange({ ...c, links: [...links, { label: 'Page', href: '#' }] })
              }}
              className="text-xs text-orange hover:underline"
            >
              + Add
            </button>
          )}
        </div>
        {isSelected ? (
          <input
            type="text"
            value={c.ctaText}
            onChange={e => onChange({ ...c, ctaText: e.target.value })}
            onClick={e => e.stopPropagation()}
            className="rounded-lg bg-orange/80 px-4 py-2 text-sm font-semibold text-white outline-none"
            placeholder="CTA"
          />
        ) : (
          <span className="rounded-lg bg-orange px-5 py-2.5 text-sm font-semibold text-white">
            {c.ctaText || 'Open Account'}
          </span>
        )}
      </div>
    </div>
  )
}
