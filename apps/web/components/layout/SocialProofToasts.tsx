'use client'

import { useState, useEffect } from 'react'

interface Toast {
  avatar: string
  name: string
  location: string
  action: string
  time: string
}

const TOASTS: Toast[] = [
  {
    avatar: '🇧🇷',
    name: 'Carlos F.',
    location: 'Brazil',
    action: 'just opened an account',
    time: '2 min ago',
  },
  {
    avatar: '🇩🇪',
    name: 'Anna K.',
    location: 'Germany',
    action: 'made a $340 profit',
    time: '5 min ago',
  },
  { avatar: '🇮🇳', name: 'Raj P.', location: 'India', action: 'withdrew $1,200', time: '7 min ago' },
  {
    avatar: '🇫🇷',
    name: 'Marie L.',
    location: 'France',
    action: 'joined VIP status',
    time: '11 min ago',
  },
  {
    avatar: '🇺🇸',
    name: 'James W.',
    location: 'USA',
    action: 'completed 50 trades',
    time: '14 min ago',
  },
  {
    avatar: '🇦🇺',
    name: 'Sophie R.',
    location: 'Australia',
    action: 'deposited $500',
    time: '18 min ago',
  },
]

export function SocialProofToasts() {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    // First toast at 4s
    const first = setTimeout(() => {
      setVisible(true)
    }, 4000)

    return () => clearTimeout(first)
  }, [])

  useEffect(() => {
    if (!visible) return

    // Auto-dismiss after 5s
    const dismiss = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => {
        setLeaving(false)
        setVisible(false)
        // Next toast after 8s
        setTimeout(() => {
          setCurrent(c => (c + 1) % TOASTS.length)
          setVisible(true)
        }, 8000)
      }, 300)
    }, 5000)

    return () => clearTimeout(dismiss)
  }, [visible, current])

  const toast = TOASTS[current]!

  if (!visible) return null

  return (
    <div
      className={`fixed bottom-20 left-4 z-50 sm:bottom-6 sm:left-6 ${
        leaving ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-bg-raised/95 px-4 py-3 shadow-float backdrop-blur-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-card text-2xl">
          {toast.avatar}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white">{toast.name}</span>
            <span className="text-xs text-text-muted">· {toast.location}</span>
          </div>
          <p className="text-xs text-text-secondary">{toast.action}</p>
          <p className="mt-0.5 text-[10px] text-text-muted">{toast.time}</p>
        </div>
        <button
          onClick={() => {
            setLeaving(true)
            setTimeout(() => {
              setLeaving(false)
              setVisible(false)
            }, 300)
          }}
          className="ml-2 shrink-0 text-text-muted transition-colors hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
