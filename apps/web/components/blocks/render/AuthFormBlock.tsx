'use client'

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'

// ── Types ─────────────────────────────────────────────────

type FormTab = 'register' | 'login' | 'recovery'

export interface AuthFormContent {
  defaultTab?: FormTab
  showTabSwitcher?: boolean
  registerHeading?: string
  registerSubheading?: string
  registerCtaText?: string
  // Social proof line shown in header
  socialProofText?: string
  loginHeading?: string
  loginCtaText?: string
  showSocialLogin?: boolean
  socialLoginGoogleUrl?: string
  socialLoginFacebookUrl?: string
  recoveryHeading?: string
  recoveryCtaText?: string
  registrationApiUrl?: string
  loginApiUrl?: string
  recoveryApiUrl?: string
  successRedirectUrl?: string
  brandId?: string
  companyId?: string
  legalText?: string
  termsUrl?: string
  privacyUrl?: string
  // Trust signals row below CTA
  trustSignals?: string // e.g. "🔒 Secure · Free $10K demo · Instant access"
}

// ── Country data ──────────────────────────────────────────

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AO', name: 'Angola' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CD', name: 'Congo (DRC)' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'HR', name: 'Croatia' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IR', name: 'Iran' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LY', name: 'Libya' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PA', name: 'Panama' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
]

// ── Timezone → country (for auto-detection) ───────────────

const TZ_MAP: Record<string, string> = {
  'America/Sao_Paulo': 'BR',
  'America/Fortaleza': 'BR',
  'America/Manaus': 'BR',
  'America/Recife': 'BR',
  'America/Belem': 'BR',
  'America/Maceio': 'BR',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Phoenix': 'US',
  'America/Anchorage': 'US',
  'Europe/Moscow': 'RU',
  'Europe/Samara': 'RU',
  'Asia/Yekaterinburg': 'RU',
  'Asia/Novosibirsk': 'RU',
  'Asia/Krasnoyarsk': 'RU',
  'Asia/Irkutsk': 'RU',
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Asia/Jakarta': 'ID',
  'Asia/Makassar': 'ID',
  'Asia/Jayapura': 'ID',
  'Asia/Bangkok': 'TH',
  'Europe/Istanbul': 'TR',
  'Asia/Istanbul': 'TR',
  'Asia/Ho_Chi_Minh': 'VN',
  'Asia/Saigon': 'VN',
  'Asia/Manila': 'PH',
  'America/Mexico_City': 'MX',
  'America/Monterrey': 'MX',
  'America/Cancun': 'MX',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Argentina/Cordoba': 'AR',
  'America/Bogota': 'CO',
  'America/Lima': 'PE',
  'America/Santiago': 'CL',
  'America/Caracas': 'VE',
  'Africa/Lagos': 'NG',
  'Africa/Abuja': 'NG',
  'Africa/Cairo': 'EG',
  'Africa/Nairobi': 'KE',
  'Africa/Accra': 'GH',
  'Africa/Johannesburg': 'ZA',
  'Africa/Casablanca': 'MA',
  'Asia/Karachi': 'PK',
  'Asia/Dhaka': 'BD',
  'Europe/Kiev': 'UA',
  'Europe/Kyiv': 'UA',
  'Asia/Almaty': 'KZ',
  'Asia/Qyzylorda': 'KZ',
  'Asia/Tashkent': 'UZ',
  'Europe/Berlin': 'DE',
  'Europe/Paris': 'FR',
  'Europe/Rome': 'IT',
  'Europe/Madrid': 'ES',
  'Europe/Warsaw': 'PL',
  'Europe/Bucharest': 'RO',
  'Europe/London': 'GB',
  'Europe/Lisbon': 'PT',
  'Asia/Tehran': 'IR',
  'Asia/Riyadh': 'SA',
  'Asia/Dubai': 'AE',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Singapore': 'SG',
  'Asia/Shanghai': 'CN',
  'Asia/Chongqing': 'CN',
  'Asia/Harbin': 'CN',
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Asia/Hong_Kong': 'HK',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Pacific/Auckland': 'NZ',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Winnipeg': 'CA',
  'Europe/Minsk': 'BY',
  'Asia/Baku': 'AZ',
  'Asia/Tbilisi': 'GE',
  'Asia/Yerevan': 'AM',
  'Asia/Kuwait': 'KW',
  'Asia/Qatar': 'QA',
  'Asia/Beirut': 'LB',
  'Asia/Amman': 'JO',
}

function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return TZ_MAP[tz] || ''
  } catch {
    return ''
  }
}

// ── Password strength ─────────────────────────────────────

interface Strength {
  level: 0 | 1 | 2 | 3 | 4
  label: string
  color: string
}

function getStrength(pw: string): Strength {
  if (!pw) return { level: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const level = Math.min(4, score) as 0 | 1 | 2 | 3 | 4
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']
  return { level, label: labels[level], color: colors[level] }
}

function StrengthMeter({ pw }: { pw: string }) {
  const s = getStrength(pw)
  if (!pw)
    return (
      <p className="mt-1.5 text-[11px] text-[#3d4361]">
        Min 8 characters · Letters + numbers recommended
      </p>
    )
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {([1, 2, 3, 4] as const).map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= s.level ? s.color : '#1f2335' }}
          />
        ))}
      </div>
      <p className="text-[11px] font-medium transition-colors" style={{ color: s.color }}>
        {s.label} password
        {s.level < 3 && ' — add uppercase, numbers or symbols'}
      </p>
    </div>
  )
}

// ── Email validation ──────────────────────────────────────

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
}

// ── Helpers ───────────────────────────────────────────────

function getFlag(code: string): string {
  const upper = code.toUpperCase()
  return (
    String.fromCodePoint(0x1f1e6 + upper.charCodeAt(0) - 65) +
    String.fromCodePoint(0x1f1e6 + upper.charCodeAt(1) - 65)
  )
}

function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : ''
}

// ── Country selector ──────────────────────────────────────

function CountrySelect({
  value,
  onChange,
  autoDetected,
  error,
}: {
  value: string
  onChange: (code: string) => void
  autoDetected: boolean
  error?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selected = COUNTRIES.find(c => c.code === value)
  const filtered = search.trim()
    ? COUNTRIES.filter(
        c =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase()),
      )
    : COUNTRIES

  const handleOpen = useCallback(() => {
    setOpen(true)
    setSearch('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])
  const handleSelect = useCallback(
    (code: string) => {
      onChange(code)
      setOpen(false)
      setSearch('')
    },
    [onChange],
  )

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open && value && listRef.current) {
      listRef.current.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, value])

  return (
    <div ref={ref} className="space-y-1">
      <div className="relative">
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : handleOpen())}
          className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-sm outline-none transition-all ${
            open
              ? 'border-[#ff6a00]/60 bg-[#1f2335] ring-1 ring-[#ff6a00]/15'
              : error
                ? 'border-red-500/40 bg-[#1a1e2d]'
                : 'border-white/10 bg-[#1a1e2d] hover:border-white/20'
          }`}
        >
          {selected ? (
            <>
              <span className="text-[22px] leading-none">{getFlag(selected.code)}</span>
              <span className="flex-1 text-left font-medium text-white">{selected.name}</span>
            </>
          ) : (
            <>
              <span className="text-[22px] leading-none opacity-25">🌍</span>
              <span className="flex-1 text-left text-[#5e6480]">Select your country</span>
            </>
          )}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`shrink-0 text-[#5e6480] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <path
              d="M2.5 5L7 9.5L11.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Auto-detected badge */}
        {autoDetected && selected && !open && (
          <span className="pointer-events-none absolute right-9 top-1/2 -translate-y-1/2 rounded-full bg-[#ff6a00]/15 px-2 py-0.5 text-[10px] font-semibold text-[#ff6a00]">
            Auto-detected
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1e2d] shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          <div className="border-b border-white/8 p-2.5">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5e6480]"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search country…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-lg bg-white/6 py-2 pl-9 pr-3 text-sm text-white placeholder-[#5e6480] outline-none focus:bg-white/8"
              />
            </div>
          </div>
          <div ref={listRef} className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-5 text-center text-sm text-[#5e6480]">
                No results for &ldquo;{search}&rdquo;
              </p>
            ) : (
              filtered.map(country => {
                const active = country.code === value
                return (
                  <button
                    key={country.code}
                    type="button"
                    data-selected={active}
                    onClick={() => handleSelect(country.code)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      active ? 'bg-[#ff6a00]/10 text-[#ff6a00]' : 'text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[20px] leading-none">{getFlag(country.code)}</span>
                    <span className="flex-1">{country.name}</span>
                    {active && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ff6a00"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Field ─────────────────────────────────────────────────

function Field({
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  autoComplete,
  inputMode,
  append,
  hasError,
}: {
  type: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  append?: React.ReactNode
  hasError?: boolean
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`w-full rounded-xl border px-4 py-3.5 pr-11 text-sm font-medium text-white placeholder-[#5e6480] outline-none transition-all focus:ring-1 ${
          hasError
            ? 'border-red-500/50 bg-[#1a1e2d] focus:border-red-400/60 focus:ring-red-500/10'
            : 'border-white/10 bg-[#1a1e2d] focus:border-[#ff6a00]/60 focus:bg-[#1f2335] focus:ring-[#ff6a00]/15'
        }`}
      />
      {append && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">{append}</div>
      )}
    </div>
  )
}

// ── Inline field icons ────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

// ── Eye toggle ────────────────────────────────────────────

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      className="text-[#5e6480] transition-colors hover:text-[#9aa0b8]"
    >
      {show ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      )}
    </button>
  )
}

// ── Error message ─────────────────────────────────────────

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-3.5 py-2.5">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f87171"
        strokeWidth="2"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="text-[13px] text-red-400">{msg}</p>
    </div>
  )
}

// ── CTA button ────────────────────────────────────────────

function CtaButton({
  children,
  loading,
  loadingText,
}: {
  children: React.ReactNode
  loading?: boolean
  loadingText?: string
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full overflow-hidden rounded-xl py-4 text-[15px] font-black tracking-wide text-white shadow-[0_4px_24px_rgba(255,106,0,0.35)] transition-all hover:shadow-[0_4px_40px_rgba(255,106,0,0.55)] disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg, #ff6a00 0%, #fe7a20 100%)' }}
    >
      <span className="pointer-events-none absolute inset-0 translate-x-[-100%] skew-x-[-15deg] bg-white/15 transition-transform duration-700 group-hover:translate-x-[200%]" />
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
            <path
              className="opacity-75"
              fill="white"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {loadingText || 'Please wait…'}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

// ── Trust signals row ─────────────────────────────────────

function TrustRow({ text }: { text: string }) {
  const parts = text
    .split('·')
    .map(p => p.trim())
    .filter(Boolean)
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1 text-[11px] font-medium text-[#5e6480]">
          {p}
          {i < parts.length - 1 && <span className="ml-3 text-[#2a2f45]">·</span>}
        </span>
      ))}
    </div>
  )
}

// ── Social buttons ────────────────────────────────────────

function OrDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-white/8" />
      <span className="text-[11px] font-medium uppercase tracking-widest text-[#3d4361]">
        {label ?? 'or'}
      </span>
      <div className="h-px flex-1 bg-white/8" />
    </div>
  )
}

function SocialButtons({ c }: { c: AuthFormContent }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <a
        href={c.socialLoginGoogleUrl || '#'}
        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white py-3.5 text-[13px] font-semibold text-[#1a1a2e] transition-all hover:bg-gray-50 hover:shadow-lg active:scale-[.98]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </a>
      <a
        href={c.socialLoginFacebookUrl || '#'}
        className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-[13px] font-semibold text-white transition-all hover:brightness-110 hover:shadow-lg active:scale-[.98]"
        style={{ background: '#1877f2' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook
      </a>
    </div>
  )
}

// ── Switch link ───────────────────────────────────────────

function SwitchLink({
  text,
  action,
  onClick,
}: {
  text: string
  action: string
  onClick: () => void
}) {
  return (
    <p className="text-center text-[13px] text-[#5e6480]">
      {text}
      {text ? ' ' : ''}
      <button
        type="button"
        onClick={onClick}
        className="font-semibold text-[#ff6a00] transition-colors hover:text-[#ffab5e]"
      >
        {action}
      </button>
    </p>
  )
}

// ── Legal text ────────────────────────────────────────────

function LegalText({ c }: { c: AuthFormContent }) {
  if (!c.legalText) return null
  return (
    <p className="text-center text-[11px] leading-relaxed text-[#3d4361]">
      {c.legalText}{' '}
      {c.termsUrl && (
        <a
          href={c.termsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5e6480] underline hover:text-[#9aa0b8]"
        >
          Terms
        </a>
      )}
      {c.termsUrl && c.privacyUrl && ' & '}
      {c.privacyUrl && (
        <a
          href={c.privacyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5e6480] underline hover:text-[#9aa0b8]"
        >
          Privacy Policy
        </a>
      )}
    </p>
  )
}

// ── Register form ─────────────────────────────────────────

function RegisterForm({ c, onSwitchLogin }: { c: AuthFormContent; onSwitchLogin: () => void }) {
  const [country, setCountry] = useState('')
  const [autoDetected, setAutoDetected] = useState(false)
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [countryError, setCountryError] = useState(false)

  // Auto-detect country on mount
  useLayoutEffect(() => {
    const detected = detectCountry()
    if (detected) {
      setCountry(detected)
      setAutoDetected(true)
    }
  }, [])

  const emailValid = email.length > 0 && isValidEmail(email)
  const emailError = emailTouched && email.length > 0 && !emailValid
  const trustText = c.trustSignals || '🔒 Secure · Free $10K demo · Instant access'

  const clearError = () => {
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!country) {
      setCountryError(true)
      setError('Please select your country to continue')
      return
    }
    if (!emailValid) {
      setError('Please enter a valid email address')
      return
    }
    const s = getStrength(password)
    if (s.level < 2) {
      setError('Password is too weak — add numbers or uppercase letters')
      return
    }
    setCountryError(false)
    setLoading(true)
    setError('')
    try {
      const body: Record<string, unknown> = { email, password, country }
      if (c.brandId) body['brand_id'] = Number(c.brandId)
      if (c.companyId) body['company_id'] = Number(c.companyId)
      const touch_id = getCookie('touch_id')
      const lead_id = getCookie('lead_id')
      if (touch_id) body['touch_id'] = touch_id
      if (lead_id) body['lead_id'] = lead_id

      const res = await fetch(c.registrationApiUrl || '/lp/auth/api/v2/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      if (res.ok) {
        if (c.successRedirectUrl) {
          window.location.href = c.successRedirectUrl
        } else {
          setSuccess(true)
        }
      } else {
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
        setError(
          String(data['message'] ?? data['error'] ?? 'Registration failed. Please try again.'),
        )
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="py-6 text-center">
        <div
          className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-4xl"
          style={{ background: 'linear-gradient(135deg, #ff6a00/15, #fe7a20/10)' }}
        >
          🎉
        </div>
        <h3 className="mb-2 text-lg font-black text-white">You&apos;re in!</h3>
        <p className="text-[13px] text-[#9aa0b8]">Account created. Your $10,000 demo is ready.</p>
      </div>
    )
  }

  return (
    <form onSubmit={e => void handleSubmit(e)} className="space-y-3">
      {/* ① Social login FIRST — highest-converting option */}
      {c.showSocialLogin !== false && (
        <>
          <SocialButtons c={c} />
          <OrDivider label="or continue with email" />
        </>
      )}

      {/* ② Country (auto-detected) */}
      <CountrySelect
        value={country}
        onChange={v => {
          setCountry(v)
          setAutoDetected(false)
          setCountryError(false)
          clearError()
        }}
        autoDetected={autoDetected}
        error={countryError}
      />

      {/* ③ Email with real-time validation */}
      <div className="space-y-1">
        <Field
          type="email"
          placeholder="Email address"
          value={email}
          onChange={v => {
            setEmail(v)
            clearError()
          }}
          onBlur={() => setEmailTouched(true)}
          autoComplete="email"
          inputMode="email"
          hasError={emailError}
          append={
            email.length > 0 ? (
              emailValid ? (
                <CheckIcon />
              ) : emailTouched ? (
                <XIcon />
              ) : undefined
            ) : undefined
          }
        />
        {emailError && (
          <p className="pl-1 text-[11px] text-red-400">Please enter a valid email address</p>
        )}
      </div>

      {/* ④ Password with strength meter */}
      <div className="space-y-0">
        <Field
          type={showPass ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={v => {
            setPassword(v)
            clearError()
          }}
          autoComplete="new-password"
          append={<EyeToggle show={showPass} onToggle={() => setShowPass(p => !p)} />}
        />
        <StrengthMeter pw={password} />
      </div>

      {/* Global error */}
      {error && <ErrorMsg msg={error} />}

      {/* ⑤ CTA — action-oriented copy */}
      <div className="pt-1">
        <CtaButton loading={loading} loadingText="Creating account…">
          {c.registerCtaText || 'Start Trading Free'} →
        </CtaButton>
      </div>

      {/* ⑥ Trust signals */}
      <TrustRow text={trustText} />

      {/* ⑦ Legal */}
      <LegalText c={c} />

      {/* ⑧ Switch */}
      <SwitchLink text="Already have an account?" action="Log in" onClick={onSwitchLogin} />
    </form>
  )
}

// ── Login form ────────────────────────────────────────────

function LoginForm({
  c,
  onSwitchRegister,
  onSwitchRecovery,
}: {
  c: AuthFormContent
  onSwitchRegister: () => void
  onSwitchRecovery: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const clearError = () => {
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const body: Record<string, unknown> = { email, password }
      if (c.brandId) body['brand_id'] = Number(c.brandId)
      if (c.companyId) body['company_id'] = Number(c.companyId)
      const res = await fetch(c.loginApiUrl || '/lp/auth/api/v2/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      if (res.ok) {
        if (c.successRedirectUrl) {
          window.location.href = c.successRedirectUrl
        }
      } else {
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
        setError(
          String(data['message'] ?? data['error'] ?? 'Incorrect email or password. Try again.'),
        )
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={e => void handleSubmit(e)} className="space-y-3">
      {c.showSocialLogin !== false && (
        <>
          <SocialButtons c={c} />
          <OrDivider />
        </>
      )}
      <Field
        type="email"
        placeholder="Email address"
        value={email}
        onChange={v => {
          setEmail(v)
          clearError()
        }}
        autoComplete="email"
        inputMode="email"
      />
      <div className="space-y-1">
        <Field
          type={showPass ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={v => {
            setPassword(v)
            clearError()
          }}
          autoComplete="current-password"
          append={<EyeToggle show={showPass} onToggle={() => setShowPass(p => !p)} />}
        />
        <div className="text-right">
          <button
            type="button"
            onClick={onSwitchRecovery}
            className="text-[12px] font-medium text-[#5e6480] transition-colors hover:text-[#ff6a00]"
          >
            Forgot password?
          </button>
        </div>
      </div>
      {error && <ErrorMsg msg={error} />}
      <div className="pt-1">
        <CtaButton loading={loading} loadingText="Logging in…">
          {c.loginCtaText || 'Log in'}
        </CtaButton>
      </div>
      <SwitchLink text="New here?" action="Create free account →" onClick={onSwitchRegister} />
    </form>
  )
}

// ── Recovery form ─────────────────────────────────────────

function RecoveryForm({ c, onBack }: { c: AuthFormContent; onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(c.recoveryApiUrl || '/lp/auth/api/v2/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
        setError(String(data['message'] ?? 'Could not send recovery email. Try again.'))
      }
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="py-6 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ff6a00]/10 text-3xl">
          📧
        </div>
        <h3 className="mb-2 text-lg font-black text-white">Check your inbox</h3>
        <p className="mb-1 text-[13px] text-[#9aa0b8]">
          Instructions sent to <strong className="text-white">{email}</strong>
        </p>
        <p className="mb-6 text-[11px] text-[#3d4361]">
          Usually arrives within 2 minutes. Check your spam folder.
        </p>
        <button
          onClick={onBack}
          className="text-[13px] font-semibold text-[#ff6a00] hover:text-[#ffab5e]"
        >
          ← Back to login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={e => void handleSubmit(e)} className="space-y-3.5">
      <p className="text-[13px] leading-relaxed text-[#9aa0b8]">
        Enter your email and we&apos;ll send a recovery link. Usually arrives within 2 minutes.
      </p>
      <Field
        type="email"
        placeholder="Email address"
        value={email}
        onChange={v => {
          setEmail(v)
          if (error) setError('')
        }}
        autoComplete="email"
        inputMode="email"
      />
      {error && <ErrorMsg msg={error} />}
      <div className="pt-1">
        <CtaButton loading={loading} loadingText="Sending…">
          {c.recoveryCtaText || 'Send recovery link'}
        </CtaButton>
      </div>
      <SwitchLink text="" action="← Back to login" onClick={onBack} />
    </form>
  )
}

// ── Header social proof ───────────────────────────────────

const AVATAR_COLORS = ['#ff6a00', '#fe7a20', '#ffab5e', '#ff8c42', '#ffd166']

function SocialProofLine({ text }: { text: string }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      {/* Stacked avatars */}
      <div className="flex -space-x-1.5">
        {AVATAR_COLORS.map((color, i) => (
          <div
            key={i}
            className="h-5 w-5 rounded-full border border-[#ff6a00] text-[8px] font-bold text-white"
            style={{
              background: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5 - i,
            }}
          >
            {['B', 'J', 'K', 'A', 'M'][i]}
          </div>
        ))}
      </div>
      <span className="text-[12px] font-medium text-white/70">{text}</span>
    </div>
  )
}

// ── Main block ────────────────────────────────────────────

export function AuthFormBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as AuthFormContent
  const [tab, setTab] = useState<FormTab>(c.defaultTab || 'register')

  const headings: Record<FormTab, string> = {
    register: c.registerHeading || 'Create an account',
    login: c.loginHeading || 'Welcome back',
    recovery: c.recoveryHeading || 'Password recovery',
  }
  const subheadings: Record<FormTab, string | undefined> = {
    register: c.registerSubheading || 'with email',
    login: undefined,
    recovery: undefined,
  }
  const socialProof = c.socialProofText || '50M+ traders already joined'

  return (
    <section className="flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-[420px]">
        <div className="relative">
          {/* Orange glow */}
          <div
            className="pointer-events-none absolute -inset-px rounded-[22px] opacity-40 blur-xl"
            style={{ background: 'linear-gradient(135deg, #ff6a00, #fe7a20)' }}
          />

          {/* Card */}
          <div className="relative overflow-hidden rounded-[20px] border border-white/8 bg-[#131620] shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
            {/* Header */}
            <div
              className="relative px-8 pb-5 pt-7"
              style={{
                background: 'linear-gradient(135deg, #ff6a00 0%, #fe7a20 60%, #ffab5e 100%)',
              }}
            >
              {tab === 'recovery' && (
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="mb-3 flex items-center gap-1.5 text-[13px] font-medium text-white/70 hover:text-white"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </button>
              )}
              <h1 className="text-[22px] font-black tracking-tight text-white">{headings[tab]}</h1>
              {subheadings[tab] && (
                <p className="mt-0.5 text-[14px] font-medium text-white/75">{subheadings[tab]}</p>
              )}
              {/* Social proof — shown only on register */}
              {tab === 'register' && <SocialProofLine text={socialProof} />}
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/8" />
              <div className="pointer-events-none absolute -right-2 -top-2 h-11 w-11 rounded-full bg-white/8" />
            </div>

            {/* Tab switcher */}
            {c.showTabSwitcher !== false && tab !== 'recovery' && (
              <div className="grid grid-cols-2 border-b border-white/6 bg-[#0e1018]">
                {(['register', 'login'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors ${
                      tab === t ? 'text-white' : 'text-[#3d4361] hover:text-[#9aa0b8]'
                    }`}
                  >
                    {t === 'register' ? 'Register' : 'Log in'}
                    {tab === t && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                        style={{ background: 'linear-gradient(90deg, #ff6a00, #fe7a20)' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Form body */}
            <div className="px-8 py-6">
              {tab === 'register' && <RegisterForm c={c} onSwitchLogin={() => setTab('login')} />}
              {tab === 'login' && (
                <LoginForm
                  c={c}
                  onSwitchRegister={() => setTab('register')}
                  onSwitchRecovery={() => setTab('recovery')}
                />
              )}
              {tab === 'recovery' && <RecoveryForm c={c} onBack={() => setTab('login')} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
