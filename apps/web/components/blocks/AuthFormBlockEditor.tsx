'use client'

import type { Block } from '../../lib/api'
import type { AuthFormContent } from './render/AuthFormBlock'

interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

// ── Shared styles ─────────────────────────────────────────

const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'
const inp =
  'w-full rounded-lg border border-white/8 bg-bg-base px-3 py-2 text-sm text-white placeholder-text-muted outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/20 transition-all'
const toggleOff =
  'relative inline-flex h-5 w-9 cursor-pointer rounded-full bg-white/10 transition-colors'
const toggleOn = 'relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors'

function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span
        onClick={() => onChange(!value)}
        className={value ? toggleOn : toggleOff}
        style={value ? { background: '#ff6a00' } : {}}
      >
        <span
          className={`pointer-events-none absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </span>
      <span className="text-xs text-text-secondary">{label}</span>
    </label>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 mb-3 text-[10px] font-bold uppercase tracking-widest text-orange/80 first:mt-0">
      {children}
    </p>
  )
}

// ── Preview (unselected) ──────────────────────────────────

function AuthFormPreview({ c }: { c: AuthFormContent }) {
  return (
    <div className="flex justify-center py-12">
      <div className="w-full max-w-[320px] overflow-hidden rounded-xl border border-white/8 bg-bg-card">
        <div
          className="px-6 py-4 text-center"
          style={{ background: 'linear-gradient(135deg, #ff6a00, #fe7a20)' }}
        >
          <p className="text-base font-black text-white">
            {c.registerHeading || 'Create an account'}
          </p>
          <p className="mt-0.5 text-xs text-white/80">{c.registerSubheading || 'with email'}</p>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-white/8">
          <div className="flex-1 border-b-2 border-orange py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-orange">
            Register
          </div>
          <div className="flex-1 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Log in
          </div>
        </div>
        {/* Fake fields */}
        <div className="space-y-2 p-5">
          <div className="h-9 rounded-lg border border-white/8 bg-bg-base" />
          <div className="h-9 rounded-lg border border-white/8 bg-bg-base" />
          <div className="h-9 rounded-lg border border-white/8 bg-bg-base" />
          <div
            className="mt-1 h-9 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #ff6a00, #fe7a20)' }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Editor ────────────────────────────────────────────────

export function AuthFormBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as AuthFormContent
  const set = (patch: Partial<AuthFormContent>) => onChange({ ...c, ...patch })

  if (!isSelected) {
    return <AuthFormPreview c={c} />
  }

  return (
    <div
      className="space-y-1 rounded-xl border border-orange/20 bg-bg-card p-5"
      onClick={e => e.stopPropagation()}
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-orange">Auth Form</p>

      {/* ─── Register ─────────────────────────────────── */}
      <SectionTitle>Registration form</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={lbl}>Heading</label>
          <input
            className={`${inp} font-bold`}
            value={c.registerHeading ?? 'Create an account'}
            onChange={e => set({ registerHeading: e.target.value })}
            placeholder="Create an account"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl}>Subheading</label>
          <input
            className={inp}
            value={c.registerSubheading ?? 'with email'}
            onChange={e => set({ registerSubheading: e.target.value })}
            placeholder="with email"
          />
        </div>
        <div>
          <label className={lbl}>Register button text</label>
          <input
            className={inp}
            value={c.registerCtaText ?? 'Create an account'}
            onChange={e => set({ registerCtaText: e.target.value })}
            placeholder="Create an account"
          />
        </div>
        <div>
          <label className={lbl}>Login button text</label>
          <input
            className={inp}
            value={c.loginCtaText ?? 'Log in'}
            onChange={e => set({ loginCtaText: e.target.value })}
            placeholder="Log in"
          />
        </div>
      </div>

      {/* ─── Social login ──────────────────────────────── */}
      <SectionTitle>Social login</SectionTitle>
      <Toggle
        value={c.showSocialLogin !== false}
        onChange={v => set({ showSocialLogin: v })}
        label="Show Google / Facebook buttons"
      />
      {c.showSocialLogin !== false && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>Google OAuth URL</label>
            <input
              className={inp}
              value={c.socialLoginGoogleUrl ?? ''}
              onChange={e => set({ socialLoginGoogleUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={lbl}>Facebook OAuth URL</label>
            <input
              className={inp}
              value={c.socialLoginFacebookUrl ?? ''}
              onChange={e => set({ socialLoginFacebookUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      )}

      {/* ─── Recovery ─────────────────────────────────── */}
      <SectionTitle>Password recovery form</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={lbl}>Recovery heading</label>
          <input
            className={inp}
            value={c.recoveryHeading ?? 'Password recovery'}
            onChange={e => set({ recoveryHeading: e.target.value })}
            placeholder="Password recovery"
          />
        </div>
        <div>
          <label className={lbl}>Recovery button text</label>
          <input
            className={inp}
            value={c.recoveryCtaText ?? 'Continue'}
            onChange={e => set({ recoveryCtaText: e.target.value })}
            placeholder="Continue"
          />
        </div>
      </div>

      {/* ─── API settings ──────────────────────────────── */}
      <SectionTitle>API settings</SectionTitle>
      <p className="mb-2 text-[11px] text-text-muted">
        Relative URLs (e.g. <code className="text-orange/80">/lp/auth/api/v2/register</code>) are
        proxied via <code className="text-orange/80">ATTRIBUTE_API_BASE</code>. You can also use
        full URLs.
      </p>
      <div className="grid gap-3">
        <div>
          <label className={lbl}>Registration endpoint</label>
          <input
            className={inp}
            value={c.registrationApiUrl ?? '/lp/auth/api/v2/register'}
            onChange={e => set({ registrationApiUrl: e.target.value })}
            placeholder="/lp/auth/api/v2/register"
          />
        </div>
        <div>
          <label className={lbl}>Login endpoint</label>
          <input
            className={inp}
            value={c.loginApiUrl ?? '/lp/auth/api/v2/login'}
            onChange={e => set({ loginApiUrl: e.target.value })}
            placeholder="/lp/auth/api/v2/login"
          />
        </div>
        <div>
          <label className={lbl}>Password recovery endpoint</label>
          <input
            className={inp}
            value={c.recoveryApiUrl ?? '/lp/auth/api/v2/recovery'}
            onChange={e => set({ recoveryApiUrl: e.target.value })}
            placeholder="/lp/auth/api/v2/recovery"
          />
        </div>
        <div>
          <label className={lbl}>Redirect after login / register</label>
          <input
            className={inp}
            value={c.successRedirectUrl ?? ''}
            onChange={e => set({ successRedirectUrl: e.target.value })}
            placeholder="https://iqbroker.com/traderoom"
          />
        </div>
      </div>

      {/* ─── Brand params ─────────────────────────────── */}
      <SectionTitle>Brand parameters</SectionTitle>
      <p className="mb-2 text-[11px] text-text-muted">
        Sent with every API request. Leave blank to omit.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={lbl}>brand_id</label>
          <input
            className={inp}
            value={c.brandId ?? ''}
            onChange={e => set({ brandId: e.target.value })}
            placeholder="67"
          />
        </div>
        <div>
          <label className={lbl}>company_id</label>
          <input
            className={inp}
            value={c.companyId ?? ''}
            onChange={e => set({ companyId: e.target.value })}
            placeholder="99"
          />
        </div>
      </div>

      {/* ─── Legal ────────────────────────────────────── */}
      <SectionTitle>Legal text</SectionTitle>
      <div className="grid gap-3">
        <div>
          <label className={lbl}>Legal text (shown under register button)</label>
          <input
            className={inp}
            value={c.legalText ?? ''}
            onChange={e => set({ legalText: e.target.value })}
            placeholder="By registering you agree to our"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>Terms URL</label>
            <input
              className={inp}
              value={c.termsUrl ?? ''}
              onChange={e => set({ termsUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={lbl}>Privacy Policy URL</label>
            <input
              className={inp}
              value={c.privacyUrl ?? ''}
              onChange={e => set({ privacyUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
