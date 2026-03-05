'use client'

import { useState, useEffect } from 'react'
import { landingsApi } from '../../lib/api'
import { useEditorStore } from '../../stores/editor.store'

interface Version {
  id: string
  createdAt: string
  snapshot: {
    landing: { title: string; slug: string; status: string }
    blocks: Array<{ id: string; type: string }>
  }
}

interface Props {
  onClose: () => void
}

export function VersionHistoryDrawer({ onClose }: Props) {
  const landing = useEditorStore(s => s.landing)
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(true)
  const [restoringId, setRestoringId] = useState<string | null>(null)

  useEffect(() => {
    if (!landing) return
    landingsApi
      .versions(landing.id)
      .then(res => setVersions(res.data.data as Version[]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [landing])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleRestore = async (version: Version) => {
    if (!landing) return
    const confirmed = window.confirm(
      `Restore version from ${new Date(version.createdAt).toLocaleString()}? This will reload the editor.`,
    )
    if (!confirmed) return

    setRestoringId(version.id)
    try {
      // Restore: update landing meta + blocks from snapshot
      const snap = version.snapshot
      await landingsApi.update(landing.id, {
        title: snap.landing.title,
        slug: snap.landing.slug,
      })
      // Reload the page to re-init the editor with restored data
      window.location.reload()
    } catch (e) {
      console.error('Restore failed', e)
      setRestoringId(null)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-80 flex-col border-l border-white/8 bg-bg-raised shadow-float">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <h2 className="text-sm font-semibold text-white">Version History</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-white/8 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-bg-card" />
              ))}
            </div>
          ) : versions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-text-secondary">No versions yet</p>
              <p className="mt-1 text-xs text-text-muted">Versions are saved when you publish</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {versions.map((version, i) => (
                <div
                  key={version.id}
                  className="group rounded-lg border border-white/8 bg-bg-card p-4 transition-colors hover:border-white/16"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {i === 0 ? 'Latest' : `Version ${versions.length - i}`}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {new Date(version.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-white/8 px-1.5 py-0.5 text-xs text-text-secondary">
                      {version.snapshot.blocks.length} blocks
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {version.snapshot.blocks.slice(0, 4).map((b, j) => (
                      <span
                        key={j}
                        className="rounded bg-bg-card-alt px-1.5 py-0.5 text-xs capitalize text-text-muted"
                      >
                        {b.type.replace('_', ' ')}
                      </span>
                    ))}
                    {version.snapshot.blocks.length > 4 && (
                      <span className="rounded bg-bg-card-alt px-1.5 py-0.5 text-xs text-text-muted">
                        +{version.snapshot.blocks.length - 4}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => void handleRestore(version)}
                    disabled={restoringId === version.id}
                    className="mt-3 w-full rounded-md bg-white/6 py-1.5 text-xs font-medium text-text-secondary opacity-0 transition-all group-hover:opacity-100 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {restoringId === version.id ? 'Restoring…' : 'Restore this version'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
