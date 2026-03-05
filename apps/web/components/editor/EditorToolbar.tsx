'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditorStore } from '../../stores/editor.store'
import { Button } from '../ui/button'
import { PreviewModal } from './PreviewModal'
import { VersionHistoryDrawer } from './VersionHistoryDrawer'

export function EditorToolbar() {
  const router = useRouter()
  const {
    landing,
    isDirty,
    isSaving,
    isPublishing,
    save,
    publish,
    unpublish,
    undo,
    redo,
    past,
    future,
  } = useEditorStore()
  const [showPreview, setShowPreview] = useState(false)
  const [showVersions, setShowVersions] = useState(false)

  if (!landing) return null

  const isPublished = landing.status === 'PUBLISHED'

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/8 bg-bg-raised px-4">
      {/* Back */}
      <button
        onClick={() => router.push('/dashboard')}
        className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-white/6 hover:text-white"
        title="Back to dashboard"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="h-5 w-px bg-white/10" />

      {/* Title */}
      <div className="flex-1 truncate">
        <span className="text-sm font-medium text-white">{landing.title}</span>
        <span className="ml-2 text-xs text-text-muted">{landing.slug}</span>
      </div>

      {/* Status */}
      <span
        className={`rounded px-2 py-0.5 text-xs font-medium ${
          isPublished ? 'bg-success/15 text-success' : 'bg-white/8 text-text-secondary'
        }`}
      >
        {landing.status}
      </span>

      {/* Save indicator */}
      {isDirty && !isSaving && <span className="text-xs text-text-muted">Unsaved changes</span>}
      {isSaving && <span className="text-xs text-text-muted">Saving…</span>}

      <div className="h-5 w-px bg-white/10" />

      {/* Undo / Redo */}
      <button
        onClick={undo}
        disabled={!past.length}
        className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-white/6 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        title="Undo (Ctrl+Z)"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 4h5a4 4 0 0 1 0 8H3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 2L2 4l2 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={redo}
        disabled={!future.length}
        className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-white/6 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        title="Redo (Ctrl+Y)"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M12 4H7a4 4 0 0 0 0 8h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 2l2 2-2 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="h-5 w-px bg-white/10" />

      {/* Preview */}
      <button
        onClick={() => setShowPreview(true)}
        className="flex h-8 items-center gap-1.5 rounded-md px-3 text-xs text-text-secondary transition-colors hover:bg-white/6 hover:text-white"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M1 6S2.5 2 6 2s5 4 5 4-1.5 4-5 4S1 6 1 6Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        Preview
      </button>

      {/* History */}
      <button
        onClick={() => setShowVersions(true)}
        className="flex h-8 items-center gap-1.5 rounded-md px-3 text-xs text-text-secondary transition-colors hover:bg-white/6 hover:text-white"
        title="Version history"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M6 3.5V6l1.5 1.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        History
      </button>

      {/* Save */}
      <Button size="sm" variant="secondary" onClick={save} loading={isSaving} disabled={!isDirty}>
        Save
      </Button>

      {/* Publish / Unpublish */}
      {isPublished ? (
        <Button size="sm" variant="outline" onClick={unpublish} loading={isPublishing}>
          Unpublish
        </Button>
      ) : (
        <Button size="sm" variant="primary" onClick={publish} loading={isPublishing}>
          Publish
        </Button>
      )}

      {/* Modals */}
      {showPreview && (
        <PreviewModal previewToken={landing.previewToken} onClose={() => setShowPreview(false)} />
      )}
      {showVersions && <VersionHistoryDrawer onClose={() => setShowVersions(false)} />}
    </header>
  )
}
