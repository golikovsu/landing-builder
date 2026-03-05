'use client'

import { type HTMLAttributes, useEffect, useState } from 'react'

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default'

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant
  title?: string
  message: string
  duration?: number
  onClose?: () => void
  visible?: boolean
}

const variantConfig: Record<ToastVariant, { border: string; icon: string; iconColor: string }> = {
  success: {
    border: 'border-l-success',
    icon: '✓',
    iconColor: 'text-success',
  },
  error: {
    border: 'border-l-error',
    icon: '✕',
    iconColor: 'text-error',
  },
  warning: {
    border: 'border-l-warning',
    icon: '!',
    iconColor: 'text-warning',
  },
  info: {
    border: 'border-l-info',
    icon: 'i',
    iconColor: 'text-info',
  },
  default: {
    border: 'border-l-text-muted',
    icon: '·',
    iconColor: 'text-text-muted',
  },
}

export function Toast({
  variant = 'default',
  title,
  message,
  duration = 4000,
  onClose,
  visible = true,
  className = '',
  ...props
}: ToastProps) {
  const [show, setShow] = useState(visible)
  const config = variantConfig[variant]

  useEffect(() => {
    setShow(visible)
  }, [visible])

  useEffect(() => {
    if (!show || duration === 0) return
    const timer = setTimeout(() => {
      setShow(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [show, duration, onClose])

  if (!show) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'flex items-start gap-3 bg-bg-card-alt border border-[rgba(255,255,255,0.08)] border-l-4 rounded-lg p-4 shadow-float',
        'animate-in slide-in-from-right-5 fade-in duration-200',
        config.border,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span
        className={[
          'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
          config.iconColor,
        ].join(' ')}
        aria-hidden
      >
        {config.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold text-white mb-0.5">{title}</p>}
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={() => {
            setShow(false)
            onClose()
          }}
          className="flex-shrink-0 text-text-muted hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

// ── Toast container ───────────────────────────────────────

export function ToastContainer({ className = '' }: { className?: string }) {
  return (
    <div
      className={['fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full', className]
        .filter(Boolean)
        .join(' ')}
      aria-label="Notifications"
    />
  )
}
