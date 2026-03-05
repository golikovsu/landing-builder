'use client'

import { useEditorStore } from '../../stores/editor.store'

export function SettingsPanel() {
  const { landing, selectedBlockId, blocks, updateLandingMeta } = useEditorStore()

  if (!landing) return null

  const selectedBlock = blocks.find(b => b.id === selectedBlockId)

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-l border-white/8 bg-bg-raised">
      <div className="border-b border-white/8 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          {selectedBlock ? `${selectedBlock.type} block` : 'Landing Settings'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!selectedBlock ? (
          <LandingSettings
            title={landing.title}
            slug={landing.slug}
            seoTitle={landing.seoTitle ?? ''}
            seoDescription={landing.seoDescription ?? ''}
            seoImage={landing.seoImage ?? ''}
            canonicalUrl={landing.canonicalUrl ?? ''}
            onChange={updateLandingMeta}
          />
        ) : (
          <BlockInfo block={selectedBlock} />
        )}
      </div>
    </aside>
  )
}

// ── Landing-level settings ────────────────────────────────

function LandingSettings({
  title,
  slug,
  seoTitle,
  seoDescription,
  seoImage,
  canonicalUrl,
  onChange,
}: {
  title: string
  slug: string
  seoTitle: string
  seoDescription: string
  seoImage: string
  canonicalUrl: string
  onChange: (
    data: Partial<{
      title: string
      slug: string
      seoTitle: string
      seoDescription: string
      seoImage: string
      canonicalUrl: string
    }>,
  ) => void
}) {
  const inp =
    'w-full rounded-md bg-bg-card px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 transition focus:ring-orange'
  const lbl = 'mb-1.5 block text-xs font-medium text-text-secondary'

  return (
    <div className="flex flex-col gap-4">
      {/* ── General ──────────────────────────────────── */}
      <div>
        <label className={lbl}>Title</label>
        <input
          type="text"
          value={title}
          onChange={e => onChange({ title: e.target.value })}
          className={inp}
        />
      </div>

      <div>
        <label className={lbl}>Slug</label>
        <div className="flex items-center rounded-md bg-bg-card ring-1 ring-white/10 transition focus-within:ring-orange">
          <span className="px-3 text-xs text-text-muted">/p/</span>
          <input
            type="text"
            value={slug}
            onChange={e =>
              onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
            }
            className="flex-1 bg-transparent py-2 pr-3 text-sm text-white outline-none"
          />
        </div>
        <p className="mt-1 text-xs text-text-muted">Only lowercase letters, numbers, and hyphens</p>
      </div>

      <div className="rounded-lg border border-white/8 bg-bg-card p-3">
        <p className="mb-1 text-xs font-medium text-text-secondary">Preview URL</p>
        <p className="break-all text-xs text-text-muted">/preview/…</p>
      </div>

      {/* ── SEO ──────────────────────────────────────── */}
      <div className="border-t border-white/8 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-orange/80">SEO</p>

        <div className="flex flex-col gap-3">
          <div>
            <label className={lbl}>Page Title</label>
            <input
              type="text"
              value={seoTitle}
              onChange={e => onChange({ seoTitle: e.target.value })}
              placeholder={title || 'Landing title'}
              className={inp}
            />
            <p className="mt-1 text-xs text-text-muted">Overrides the browser tab title</p>
          </div>

          <div>
            <label className={lbl}>Meta Description</label>
            <textarea
              value={seoDescription}
              onChange={e => onChange({ seoDescription: e.target.value })}
              placeholder="Short summary for search engines…"
              rows={3}
              className={`${inp} resize-none`}
            />
            <p className="mt-1 text-xs text-text-muted">{seoDescription.length}/160 chars</p>
          </div>

          <div>
            <label className={lbl}>OG Image URL</label>
            <input
              type="text"
              value={seoImage}
              onChange={e => onChange({ seoImage: e.target.value })}
              placeholder="https://…/og-image.png"
              className={inp}
            />
            <p className="mt-1 text-xs text-text-muted">
              Shown when shared on social media (1200×630px)
            </p>
          </div>

          <div>
            <label className={lbl}>Canonical URL</label>
            <input
              type="text"
              value={canonicalUrl}
              onChange={e => onChange({ canonicalUrl: e.target.value })}
              placeholder="https://iqoption.com/…"
              className={inp}
            />
            <p className="mt-1 text-xs text-text-muted">
              Optional. Leave blank to use the default page URL
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Block info panel ──────────────────────────────────────

function BlockInfo({ block }: { block: { id: string; type: string; order: number } }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-white/8 bg-bg-card p-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
          Block Info
        </p>
        <div className="flex flex-col gap-1.5">
          <Row label="Type" value={block.type} />
          <Row label="Order" value={String(block.order)} />
          <Row label="ID" value={block.id.slice(0, 8) + '…'} />
        </div>
      </div>

      <div className="rounded-lg border border-white/8 bg-bg-card-alt p-3">
        <p className="text-xs text-text-muted">
          Click inside the block on the canvas to edit its content inline.
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-xs font-medium text-text-secondary">{value}</span>
    </div>
  )
}
