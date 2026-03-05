'use client'

import { useState } from 'react'
import { useEditorStore } from '../../stores/editor.store'
import type { BlockType } from '../../lib/api'

interface BlockDef {
  type: BlockType
  label: string
  description: string
  icon: string
  group: string
}

const BLOCK_DEFS: BlockDef[] = [
  // ── Layout ───────────────────────────────────────────────
  {
    type: 'nav',
    label: 'Navigation',
    description: 'Sticky header with logo + links',
    icon: '🧭',
    group: 'Layout',
  },
  {
    type: 'urgency_bar',
    label: 'Urgency Bar',
    description: 'Dismissible top announcement',
    icon: '🔔',
    group: 'Layout',
  },
  {
    type: 'ticker',
    label: 'Ticker',
    description: 'Scrolling social proof stream',
    icon: '📡',
    group: 'Layout',
  },
  {
    type: 'sticky_bar',
    label: 'Sticky Bar',
    description: 'Bottom CTA bar on scroll',
    icon: '📌',
    group: 'Layout',
  },

  // ── Hero & Content ────────────────────────────────────────
  {
    type: 'hero',
    label: 'Hero',
    description: 'Headline, subheading, CTA',
    icon: '🚀',
    group: 'Content',
  },
  {
    type: 'stats_row',
    label: 'Stats Row',
    description: 'Key metrics in a row',
    icon: '📊',
    group: 'Content',
  },
  {
    type: 'how_it_works',
    label: 'How It Works',
    description: '3-step process with icons',
    icon: '📋',
    group: 'Content',
  },
  {
    type: 'features',
    label: 'Features',
    description: 'Feature cards with badges',
    icon: '✨',
    group: 'Content',
  },
  {
    type: 'before_after',
    label: 'Before / After',
    description: 'Side-by-side comparison screens',
    icon: '🔄',
    group: 'Content',
  },
  {
    type: 'video_demo',
    label: 'Video Demo',
    description: 'Embedded video with play button',
    icon: '🎬',
    group: 'Content',
  },

  // ── Social Proof ──────────────────────────────────────────
  {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Customer reviews with stars',
    icon: '⭐',
    group: 'Proof',
  },
  {
    type: 'awards',
    label: 'Awards',
    description: 'Award cards + media logos',
    icon: '🏆',
    group: 'Proof',
  },
  {
    type: 'risk_reversal',
    label: 'Risk Reversal',
    description: 'Trust & guarantee cards',
    icon: '🛡️',
    group: 'Proof',
  },
  {
    type: 'payment_partners',
    label: 'Payment Partners',
    description: 'VISA, Mastercard, crypto, etc.',
    icon: '💳',
    group: 'Proof',
  },

  // ── Conversion ────────────────────────────────────────────
  {
    type: 'pricing',
    label: 'Pricing',
    description: 'Plan cards with CTA buttons',
    icon: '💰',
    group: 'Conversion',
  },
  {
    type: 'cta_banner',
    label: 'CTA Banner',
    description: 'Full-width call-to-action',
    icon: '📣',
    group: 'Conversion',
  },
  {
    type: 'email_capture',
    label: 'Email Capture',
    description: 'Newsletter subscription form',
    icon: '📧',
    group: 'Conversion',
  },
  {
    type: 'auth_form',
    label: 'Auth Form',
    description: 'Register / Login / Recovery form',
    icon: '🔐',
    group: 'Conversion',
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Accordion Q&A section',
    icon: '❓',
    group: 'Conversion',
  },

  // ── Detail ────────────────────────────────────────────────
  {
    type: 'timeline',
    label: 'Timeline',
    description: 'Year-by-year milestones',
    icon: '📅',
    group: 'Detail',
  },
  {
    type: 'roadmap',
    label: 'Roadmap',
    description: 'Shipped / In Progress / Planned',
    icon: '🗺️',
    group: 'Detail',
  },
  {
    type: 'comparison',
    label: 'Comparison',
    description: 'Feature matrix vs competitors',
    icon: '⚖️',
    group: 'Detail',
  },
  {
    type: 'changelog',
    label: 'Changelog',
    description: 'Version history entries',
    icon: '📝',
    group: 'Detail',
  },
  {
    type: 'media',
    label: 'Media',
    description: 'Image or video gallery',
    icon: '🖼️',
    group: 'Detail',
  },
]

const GROUPS = ['Layout', 'Content', 'Proof', 'Conversion', 'Detail']

export function BlockLibrary() {
  const addBlock = useEditorStore(s => s.addBlock)
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const filtered = search
    ? BLOCK_DEFS.filter(
        d =>
          d.label.toLowerCase().includes(search.toLowerCase()) ||
          d.description.toLowerCase().includes(search.toLowerCase()),
      )
    : BLOCK_DEFS

  const toggle = (group: string) => setCollapsed(c => ({ ...c, [group]: !c[group] }))

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-white/8 bg-bg-raised">
      <div className="border-b border-white/8 px-4 py-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
          Blocks
        </p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search blocks..."
          className="w-full rounded-lg border border-white/8 bg-bg-card px-3 py-1.5 text-xs text-white placeholder-text-muted outline-none focus:border-orange"
        />
      </div>

      <div className="flex flex-col overflow-y-auto pb-3">
        {search ? (
          <div className="flex flex-col gap-1 p-3">
            {filtered.map(def => (
              <BlockButton key={def.type} def={def} onAdd={() => void addBlock(def.type)} />
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-xs text-text-muted">No blocks found</p>
            )}
          </div>
        ) : (
          GROUPS.map(group => {
            const defs = BLOCK_DEFS.filter(d => d.group === group)
            return (
              <div key={group}>
                <button
                  onClick={() => toggle(group)}
                  className="flex w-full items-center justify-between px-4 py-2 text-left"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    {group}
                  </span>
                  <span className="text-xs text-text-muted">{collapsed[group] ? '▸' : '▾'}</span>
                </button>
                {!collapsed[group] && (
                  <div className="flex flex-col gap-0.5 px-2 pb-1">
                    {defs.map(def => (
                      <BlockButton key={def.type} def={def} onAdd={() => void addBlock(def.type)} />
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <div className="mt-auto border-t border-white/8 px-4 py-3">
        <p className="text-xs text-text-muted">{BLOCK_DEFS.length} blocks available</p>
      </div>
    </aside>
  )
}

function BlockButton({ def, onAdd }: { def: BlockDef; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/6 active:bg-white/10"
    >
      <span className="mt-0.5 text-base">{def.icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-white">{def.label}</span>
        <span className="block truncate text-[10px] text-text-muted">{def.description}</span>
      </span>
    </button>
  )
}
