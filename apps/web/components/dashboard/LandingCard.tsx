'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Landing, LandingStatus } from '../../lib/api'
import { landingsApi } from '../../lib/api'

const STATUS_STYLES: Record<LandingStatus, string> = {
  DRAFT: 'bg-white/8 text-text-secondary',
  PUBLISHED: 'bg-success/15 text-success',
  ARCHIVED: 'bg-white/6 text-text-muted',
}

interface Props {
  landing: Landing
  onDeleted: (id: string) => void
  onDuplicated: (landing: Landing) => void
}

export function LandingCard({ landing, onDeleted, onDuplicated }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [duplicating, setDuplicating] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete "${landing.title}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await landingsApi.delete(landing.id)
      onDeleted(landing.id)
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(false)
    }
  }

  const handleDuplicate = async () => {
    setDuplicating(true)
    try {
      const slug = `${landing.slug}-copy-${Date.now().toString(36)}`
      const res = await landingsApi.create({ title: `${landing.title} (copy)`, slug })
      onDuplicated(res.data.data)
    } catch (e) {
      console.error(e)
    } finally {
      setDuplicating(false)
    }
  }

  const updatedAt = new Date(landing.updatedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="group relative flex flex-col rounded-xl border border-white/8 bg-bg-card transition-all duration-200 hover:border-white/16 hover:shadow-card">
      {/* Preview thumbnail */}
      <div className="flex h-36 items-center justify-center rounded-t-xl bg-bg-card-alt">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-20">
          <rect x="4" y="8" width="32" height="24" rx="3" stroke="white" strokeWidth="1.5" />
          <path d="M4 14h32" stroke="white" strokeWidth="1.5" />
          <rect x="8" y="19" width="14" height="8" rx="1.5" stroke="white" strokeWidth="1.2" />
          <rect x="25" y="19" width="7" height="3" rx="1" stroke="white" strokeWidth="1.2" />
          <rect x="25" y="24" width="5" height="3" rx="1" stroke="white" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-white">{landing.title}</h3>
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${STATUS_STYLES[landing.status]}`}
          >
            {landing.status}
          </span>
        </div>

        <p className="mb-3 text-xs text-text-muted">/p/{landing.slug}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-text-muted">{updatedAt}</span>
          <span className="text-xs text-text-muted">
            {(landing as Landing & { _count?: { blocks: number } })._count?.blocks ?? 0} blocks
          </span>
        </div>
      </div>

      {/* Actions overlay */}
      <div className="absolute inset-x-0 bottom-0 flex translate-y-1 items-center justify-between gap-1 rounded-b-xl border-t border-white/8 bg-bg-raised px-3 py-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <Link
          href={`/editor/${landing.id}`}
          className="flex h-7 flex-1 items-center justify-center rounded-md bg-orange text-xs font-medium text-white hover:opacity-90"
        >
          Edit
        </Link>

        <a
          href={`/preview/${landing.previewToken}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white/8 text-text-secondary hover:text-white"
          title="Preview"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 6S2.5 2 6 2s5 4 5 4-1.5 4-5 4S1 6 1 6Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </a>

        <button
          onClick={handleDuplicate}
          disabled={duplicating}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white/8 text-text-secondary hover:text-white disabled:opacity-40"
          title="Duplicate"
        >
          {duplicating ? (
            <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect
                x="1"
                y="3"
                width="7"
                height="8"
                rx="1.2"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M4 3V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white/8 text-text-secondary hover:text-error disabled:opacity-40"
          title="Delete"
        >
          {deleting ? (
            <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 3h8M5 3V2h2v1M4.5 5v4M7.5 5v4M3 3l.5 7h5l.5-7H3Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
