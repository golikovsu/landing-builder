import { type HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

export function Skeleton({
  width,
  height,
  rounded = 'md',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={['animate-pulse bg-[rgba(255,255,255,0.06)]', roundedClasses[rounded], className]
        .filter(Boolean)
        .join(' ')}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden
      {...props}
    />
  )
}

// ── Skeleton presets ──────────────────────────────────────

export function SkeletonText({
  lines = 3,
  className = '',
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height={16} width={i === lines - 1 ? '70%' : '100%'} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={['bg-bg-card border border-[rgba(255,255,255,0.06)] rounded-lg p-6', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Skeleton height={20} width="60%" className="mb-3" />
      <SkeletonText lines={3} />
    </div>
  )
}
