'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../contexts/auth.context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-base">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen flex-col bg-bg-base text-white">
      {/* Top nav */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-white/8 bg-bg-raised px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-orange">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 4h10M2 7h6M2 10h8"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-sm font-bold text-white">Landing Constructor</span>
        </Link>

        <div className="flex-1" />

        {/* User menu */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">{user.email}</span>
          {user.role === 'ADMIN' && (
            <span className="rounded bg-orange/15 px-2 py-0.5 text-xs font-medium text-orange">
              Admin
            </span>
          )}
          <button
            onClick={() => void logout().then(() => router.push('/login'))}
            className="rounded-md px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-white/8 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
