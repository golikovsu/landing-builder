import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'

// ── Shared base styles ────────────────────────────────────

const baseInputClasses = [
  'w-full rounded bg-bg-raised border border-[rgba(255,255,255,0.08)] text-white placeholder:text-text-muted',
  'transition-colors duration-150',
  'focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

// ── Input ─────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  inputSize?: 'sm' | 'md' | 'lg'
}

const inputSizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, inputSize = 'md', className = '', id, ...props },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={[
          baseInputClasses,
          inputSizeClasses[inputSize],
          error ? 'border-error focus:border-error focus:ring-error' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  )
})

// ── Textarea ──────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  resize?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, resize = false, className = '', id, rows = 4, ...props },
  ref,
) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={[
          baseInputClasses,
          'px-4 py-3 text-sm',
          resize ? '' : 'resize-none',
          error ? 'border-error focus:border-error focus:ring-error' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  )
})
