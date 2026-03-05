'use client'

import { useState, useEffect } from 'react'

interface NavLink {
  label: string
  href: string
}
interface NavContent {
  logo: string
  links: NavLink[]
  ctaText: string
  ctaUrl: string
  ctaSecondaryText?: string
  ctaSecondaryUrl?: string
}

export function NavBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as unknown as NavContent
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-base/95 shadow-card backdrop-blur-md' : 'bg-transparent'}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-12">
        <a href="/" className="flex items-center gap-2 text-lg font-black text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange text-sm font-black text-white">
            IQ
          </div>
          <span>{c.logo || 'IQ Option'}</span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {c.links?.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {c.ctaSecondaryText && (
            <a
              href={c.ctaSecondaryUrl || '#'}
              className="hidden text-sm font-medium text-text-secondary hover:text-white sm:block"
            >
              {c.ctaSecondaryText}
            </a>
          )}
          {c.ctaText && (
            <a
              href={c.ctaUrl || '#'}
              className="rounded-lg bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-orange transition-opacity hover:opacity-90"
            >
              {c.ctaText}
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
