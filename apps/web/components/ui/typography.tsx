import { type HTMLAttributes } from 'react'

// ── Heading ───────────────────────────────────────────────

type HeadingLevel = 1 | 2 | 3 | 4

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: `h${HeadingLevel}`
  level?: HeadingLevel
  gradient?: boolean
}

const headingClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight',
  2: 'text-3xl sm:text-4xl font-extrabold tracking-tight',
  3: 'text-2xl sm:text-3xl font-bold',
  4: 'text-xl sm:text-2xl font-bold',
}

export function Heading({
  as,
  level = 2,
  gradient = false,
  className = '',
  children,
  ...props
}: HeadingProps) {
  const Tag = as ?? (`h${level}` as const)
  return (
    <Tag
      className={[headingClasses[level], gradient ? 'gradient-text' : 'text-white', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Tag>
  )
}

// ── Text ──────────────────────────────────────────────────

type TextVariant = 'primary' | 'secondary' | 'muted'
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div'
  variant?: TextVariant
  size?: TextSize
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
}

const textVariantClasses: Record<TextVariant, string> = {
  primary: 'text-white',
  secondary: 'text-text-secondary',
  muted: 'text-text-muted',
}

const textSizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

export function Text({
  as: Tag = 'p',
  variant = 'secondary',
  size = 'base',
  weight = 'normal',
  className = '',
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={[
        textVariantClasses[variant],
        textSizeClasses[size],
        weightClasses[weight],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Tag>
  )
}

// ── Label ─────────────────────────────────────────────────

interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'orange' | 'muted'
  size?: 'sm' | 'md'
}

const labelVariantClasses = {
  default: 'text-text-secondary',
  orange: 'text-orange',
  muted: 'text-text-muted',
}

const labelSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
}

export function Label({
  variant = 'default',
  size = 'sm',
  className = '',
  children,
  ...props
}: LabelProps) {
  return (
    <span
      className={[
        'font-semibold uppercase tracking-widest',
        labelVariantClasses[variant],
        labelSizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
