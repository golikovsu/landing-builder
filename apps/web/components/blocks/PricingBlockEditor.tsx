'use client'

import type { Block } from '../../lib/api'

interface PricingPlan {
  name: string
  price: string
  period?: string
  description?: string
  ctaText: string
  ctaUrl: string
  highlighted?: boolean
  badge?: string
  features: string[]
}
interface PricingContent {
  heading: string
  subheading?: string
  plans: PricingPlan[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function PricingBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as PricingContent
  const plans = c.plans ?? []
  const inp =
    'w-full bg-transparent text-white outline-none focus:underline placeholder:text-text-muted'
  const lbl = 'block mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted'

  const updatePlan = (i: number, patch: Partial<PricingPlan>) => {
    const next = [...plans]
    next[i] = { ...plans[i], ...patch }
    onChange({ ...c, plans: next })
  }
  const removePlan = (i: number) => {
    onChange({ ...c, plans: plans.filter((_, idx) => idx !== i) })
  }
  const addPlan = () => {
    onChange({
      ...c,
      plans: [
        ...plans,
        {
          name: 'New Plan',
          price: '$0',
          ctaText: 'Get Started',
          ctaUrl: '#',
          features: ['Feature 1'],
        },
      ],
    })
  }
  const updateFeature = (pi: number, fi: number, val: string) => {
    const plan = { ...plans[pi], features: [...(plans[pi].features ?? [])] }
    plan.features[fi] = val
    updatePlan(pi, plan)
  }
  const addFeature = (pi: number) => {
    updatePlan(pi, { features: [...(plans[pi].features ?? []), 'New feature'] })
  }
  const removeFeature = (pi: number, fi: number) => {
    updatePlan(pi, { features: plans[pi].features.filter((_, idx) => idx !== fi) })
  }

  if (!isSelected) {
    return (
      <div className="py-12">
        <h2 className="mb-2 text-center text-2xl font-black text-white">{c.heading}</h2>
        {c.subheading && (
          <p className="mb-8 text-center text-sm text-text-secondary">{c.subheading}</p>
        )}
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl border p-5 ${plan.highlighted ? 'border-orange bg-orange/10' : 'border-white/8 bg-bg-raised'}`}
            >
              {plan.badge && (
                <span className="mb-2 inline-block rounded-full bg-orange px-2 py-0.5 text-[10px] font-black text-white">
                  {plan.badge}
                </span>
              )}
              <p className="font-bold text-white">{plan.name}</p>
              <p className="mt-1 text-2xl font-black text-white">
                {plan.price}
                <span className="text-sm font-normal text-text-muted"> /{plan.period || 'mo'}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="space-y-4 rounded-xl border border-orange/20 bg-bg-card p-5"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-orange">Pricing</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={lbl}>Heading</label>
          <input
            className={`${inp} font-black`}
            value={c.heading ?? ''}
            onChange={e => onChange({ ...c, heading: e.target.value })}
            placeholder="Choose Your Plan"
          />
        </div>
        <div>
          <label className={lbl}>Subheading</label>
          <input
            className={inp}
            value={c.subheading ?? ''}
            onChange={e => onChange({ ...c, subheading: e.target.value })}
            placeholder="No hidden fees. Cancel anytime."
          />
        </div>
      </div>
      <div className="space-y-4">
        {plans.map((plan, pi) => (
          <div
            key={pi}
            className={`rounded-lg border p-4 ${plan.highlighted ? 'border-orange/40 bg-orange/5' : 'border-white/8 bg-bg-raised'}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-text-muted">Plan {pi + 1}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!plan.highlighted}
                    onChange={e => updatePlan(pi, { highlighted: e.target.checked })}
                  />
                  Highlighted
                </label>
                <button
                  onClick={() => removePlan(pi)}
                  className="text-[10px] text-text-muted hover:text-red-400"
                >
                  ✕ Remove
                </button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <label className={lbl}>Plan Name</label>
                <input
                  className={`${inp} font-bold`}
                  value={plan.name}
                  onChange={e => updatePlan(pi, { name: e.target.value })}
                  placeholder="Standard"
                />
              </div>
              <div>
                <label className={lbl}>Price</label>
                <input
                  className={inp}
                  value={plan.price}
                  onChange={e => updatePlan(pi, { price: e.target.value })}
                  placeholder="$10"
                />
              </div>
              <div>
                <label className={lbl}>Period</label>
                <input
                  className={inp}
                  value={plan.period ?? ''}
                  onChange={e => updatePlan(pi, { period: e.target.value })}
                  placeholder="mo"
                />
              </div>
              <div>
                <label className={lbl}>Badge (optional)</label>
                <input
                  className={inp}
                  value={plan.badge ?? ''}
                  onChange={e => updatePlan(pi, { badge: e.target.value })}
                  placeholder="Most Popular"
                />
              </div>
              <div>
                <label className={lbl}>CTA Text</label>
                <input
                  className={inp}
                  value={plan.ctaText}
                  onChange={e => updatePlan(pi, { ctaText: e.target.value })}
                  placeholder="Get Started"
                />
              </div>
              <div>
                <label className={lbl}>CTA URL</label>
                <input
                  className={inp}
                  value={plan.ctaUrl}
                  onChange={e => updatePlan(pi, { ctaUrl: e.target.value })}
                  placeholder="#"
                />
              </div>
              <div className="sm:col-span-3">
                <label className={lbl}>Description</label>
                <input
                  className={inp}
                  value={plan.description ?? ''}
                  onChange={e => updatePlan(pi, { description: e.target.value })}
                  placeholder="Perfect for beginners."
                />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <label className={lbl}>Features</label>
              {(plan.features ?? []).map((feat, fi) => (
                <div key={fi} className="flex items-center gap-2">
                  <input
                    className={`${inp} flex-1 text-sm`}
                    value={feat}
                    onChange={e => updateFeature(pi, fi, e.target.value)}
                    placeholder="Feature..."
                  />
                  <button
                    onClick={() => removeFeature(pi, fi)}
                    className="shrink-0 text-text-muted hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => addFeature(pi)}
                className="text-xs text-text-muted hover:text-orange"
              >
                + Add feature
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addPlan}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-text-secondary hover:border-orange/40 hover:text-white"
      >
        + Add Plan
      </button>
    </div>
  )
}
