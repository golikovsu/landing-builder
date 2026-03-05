'use client'

import { useState, useEffect } from 'react'

type Device = 'desktop' | 'tablet' | 'mobile'

const DEVICE_CONFIG: Record<Device, { width: string; label: string; icon: React.ReactNode }> = {
  desktop: {
    width: '100%',
    label: 'Desktop',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 14h6M8 12v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  tablet: {
    width: '768px',
    label: 'Tablet',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="2.5"
          y="1"
          width="11"
          height="14"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <circle cx="8" cy="13" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  mobile: {
    width: '375px',
    label: 'Mobile',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="4" y="1" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="8" cy="13" r="0.7" fill="currentColor" />
      </svg>
    ),
  },
}

interface Props {
  previewToken: string
  onClose: () => void
}

export function PreviewModal({ previewToken, onClose }: Props) {
  const [device, setDevice] = useState<Device>('desktop')
  const [copied, setCopied] = useState(false)

  const previewUrl = `/preview/${previewToken}`

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const copyUrl = async () => {
    await navigator.clipboard.writeText(window.location.origin + previewUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-base/95 backdrop-blur-sm">
      {/* Modal toolbar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/8 bg-bg-raised px-4">
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-white/8 hover:text-white"
          title="Close preview (Esc)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="h-5 w-px bg-white/10" />

        {/* Device switcher */}
        <div className="flex items-center gap-1 rounded-lg bg-bg-card p-1">
          {(Object.entries(DEVICE_CONFIG) as [Device, (typeof DEVICE_CONFIG)[Device]][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                onClick={() => setDevice(key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  device === key ? 'bg-orange text-white' : 'text-text-secondary hover:text-white'
                }`}
              >
                {cfg.icon}
                {cfg.label}
              </button>
            ),
          )}
        </div>

        <div className="flex-1" />

        {/* Preview URL + copy */}
        <div className="flex items-center gap-2 rounded-lg bg-bg-card px-3 py-1.5">
          <span className="max-w-xs truncate text-xs text-text-muted">
            {typeof window !== 'undefined' ? window.location.origin : ''}
            {previewUrl}
          </span>
          <button
            onClick={copyUrl}
            className="shrink-0 text-xs text-text-secondary transition-colors hover:text-white"
          >
            {copied ? (
              <span className="text-success">✓ Copied</span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect
                  x="4"
                  y="4"
                  width="8"
                  height="8"
                  rx="1.2"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M2 10V2h8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 items-center gap-1.5 rounded-md px-3 text-xs text-text-secondary transition-colors hover:bg-white/8 hover:text-white"
        >
          Open in new tab
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M4 2H2v6h6V6M6 1h3m0 0v3m0-3L4.5 5.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </header>

      {/* iframe container */}
      <div className="flex flex-1 items-start justify-center overflow-auto bg-bg-base p-6">
        <div
          className="relative h-full overflow-hidden rounded-xl border border-white/8 bg-white shadow-float transition-all duration-300"
          style={{ width: DEVICE_CONFIG[device].width, minHeight: '100%' }}
        >
          <iframe
            src={previewUrl}
            className="h-full w-full border-0"
            style={{ minHeight: '600px' }}
            title="Landing preview"
          />
        </div>
      </div>
    </div>
  )
}
