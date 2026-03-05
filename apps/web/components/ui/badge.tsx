import { type HTMLAttributes } from 'react'

type BadgeVariant = 'new' | 'improved' | 'fixed' | 'coming-soon' | 'deprecated' | 'default'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  new: 'bg-[rgba(46,204,113,0.15)] text-success border-[rgba(46,204,113,0.3)]',
  improved: 'bg-[rgba(52,152,219,0.15)] text-info border-[rgba(52,152,219,0.3)]',
  fixed: 'bg-[rgba(255,106,0,0.15)] text-orange border-[rgba(255,106,0,0.3)]',
  'coming-soon': 'bg-[rgba(243,156,18,0.15)] text-warning border-[rgba(243,156,18,0.3)]',
  deprecated: 'bg-[rgba(231,76,60,0.15)] text-error border-[rgba(231,76,60,0.3)]',
  default: 'bg-[rgba(255,255,255,0.08)] text-text-secondary border-[rgba(255,255,255,0.12)]',
}

const variantLabels: Partial<Record<BadgeVariant, string>> = {
  new: 'New',
  improved: 'Improved',
  fixed: 'Fixed',
  'coming-soon': 'Coming Soon',
  deprecated: 'Deprecated',
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border tracking-wide uppercase',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children ?? variantLabels[variant] ?? null}
    </span>
  )
}
