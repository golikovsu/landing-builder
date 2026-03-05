'use client'

import type { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { landingsApi } from '../../lib/api'

interface Props {
  onClose: () => void
  onCreated: () => void
}

export function CreateLandingModal({ onClose, onCreated }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 100),
      )
    }
  }, [title, slugManual])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!slug.trim()) {
      setError('Slug is required')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await landingsApi.create({ title: title.trim(), slug: slug.trim() })
      onCreated()
      router.push(`/editor/${res.data.data.id}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Failed to create landing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/8 bg-bg-card p-6 shadow-float">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">New Landing</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-white/8 hover:text-white"
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Title</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="My Awesome Landing"
              className="w-full rounded-lg border border-white/10 bg-bg-card-alt px-3 py-2.5 text-sm text-white placeholder-text-muted outline-none transition focus:border-orange focus:ring-1 focus:ring-orange"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Slug</label>
            <div className="flex items-center overflow-hidden rounded-lg border border-white/10 bg-bg-card-alt transition focus-within:border-orange focus-within:ring-1 focus-within:ring-orange">
              <span className="border-r border-white/10 px-3 py-2.5 text-xs text-text-muted">
                /p/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={e => {
                  setSlugManual(true)
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
                }}
                placeholder="my-awesome-landing"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-text-muted outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-text-muted">Only lowercase letters, numbers, hyphens</p>
          </div>

          {error && <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-text-secondary transition-colors hover:border-white/20 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !slug.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange py-2.5 text-sm font-semibold text-white shadow-orange transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Create & Edit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
