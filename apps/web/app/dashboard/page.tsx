'use client'

import { useState, useEffect, useCallback } from 'react'
import { landingsApi } from '../../lib/api'
import type { Landing, LandingStatus } from '../../lib/api'
import { LandingCard } from '../../components/dashboard/LandingCard'
import { CreateLandingModal } from '../../components/dashboard/CreateLandingModal'

const STATUS_FILTERS: Array<{ label: string; value: LandingStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Archived', value: 'ARCHIVED' },
]

const PAGE_SIZE = 12

export default function DashboardPage() {
  const [landings, setLandings] = useState<Landing[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<LandingStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const fetchLandings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await landingsApi.list({
        page,
        limit: PAGE_SIZE,
        ...(status !== 'ALL' ? { status } : {}),
      })
      setLandings(res.data.data.landings)
      setTotal(res.data.data.total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, status])

  useEffect(() => {
    void fetchLandings()
  }, [fetchLandings])

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1)
  }, [status])

  const handleDeleted = (id: string) => {
    setLandings(prev => prev.filter(l => l.id !== id))
    setTotal(t => t - 1)
  }

  const handleDuplicated = (landing: Landing) => {
    setLandings(prev => [landing, ...prev])
    setTotal(t => t + 1)
  }

  // Client-side search filter
  const filtered = search.trim()
    ? landings.filter(
        l =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.slug.toLowerCase().includes(search.toLowerCase()),
      )
    : landings

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Landings</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            {total} landing{total !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-orange px-4 py-2.5 text-sm font-semibold text-white shadow-orange transition-opacity hover:opacity-90"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Landing
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
            <path
              d="M10 10l2.5 2.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search landings…"
            className="rounded-lg border border-white/10 bg-bg-card py-2 pl-8 pr-3 text-sm text-white placeholder-text-muted outline-none transition focus:border-orange focus:ring-1 focus:ring-orange"
          />
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-bg-card p-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                status === f.value ? 'bg-orange text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-bg-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          hasFilters={status !== 'ALL' || !!search.trim()}
          onCreate={() => setShowCreate(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(landing => (
            <LandingCard
              key={landing.id}
              landing={landing}
              onDeleted={handleDeleted}
              onDuplicated={handleDuplicated}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-text-secondary transition-colors hover:border-white/20 hover:text-white disabled:opacity-30"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M7.5 2.5L4 6l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                p === page
                  ? 'bg-orange text-white'
                  : 'border border-white/10 text-text-secondary hover:border-white/20 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-text-secondary transition-colors hover:border-white/20 hover:text-white disabled:opacity-30"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M4.5 2.5L8 6l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateLandingModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false)
            void fetchLandings()
          }}
        />
      )}
    </div>
  )
}

function EmptyState({ hasFilters, onCreate }: { hasFilters: boolean; onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-card">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-30">
          <rect x="4" y="6" width="24" height="20" rx="3" stroke="white" strokeWidth="1.5" />
          <path d="M4 12h24" stroke="white" strokeWidth="1.5" />
          <path d="M10 18h5M10 22h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {hasFilters ? (
        <>
          <p className="text-base font-medium text-text-secondary">No landings match your filter</p>
          <p className="mt-1 text-sm text-text-muted">Try a different status or search term</p>
        </>
      ) : (
        <>
          <p className="text-base font-medium text-text-secondary">No landings yet</p>
          <p className="mt-1 text-sm text-text-muted">Create your first landing to get started</p>
          <button
            onClick={onCreate}
            className="mt-6 flex items-center gap-2 rounded-lg bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-orange transition-opacity hover:opacity-90"
          >
            Create Landing
          </button>
        </>
      )}
    </div>
  )
}
