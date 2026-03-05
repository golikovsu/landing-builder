import { type HTMLAttributes } from 'react'

type CardVariant = 'default' | 'raised' | 'bordered' | 'glow'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-bg-card border border-[rgba(255,255,255,0.06)] shadow-card',
  raised: 'bg-bg-card-alt border border-[rgba(255,255,255,0.08)] shadow-float',
  bordered:
    'bg-bg-card border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.18)] transition-colors',
  glow: 'bg-bg-card border border-[rgba(255,106,0,0.2)] shadow-orange hover:border-[rgba(255,106,0,0.4)] transition-colors',
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={['rounded-lg', variantClasses[variant], paddingClasses[padding], className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
  return (
    <div className={['mb-4', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}
export function CardBody({ className = '', children, ...props }: CardBodyProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}
export function CardFooter({ className = '', children, ...props }: CardFooterProps) {
  return (
    <div
      className={['mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
