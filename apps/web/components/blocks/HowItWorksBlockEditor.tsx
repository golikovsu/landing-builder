'use client'

import type { Block } from '../../lib/api'

interface Step {
  icon: string
  title: string
  description: string
  ctaText?: string
}
interface HowItWorksContent {
  heading: string
  subheading?: string
  steps: Step[]
}
interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function HowItWorksBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as HowItWorksContent
  const steps = c.steps ?? []
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {isSelected ? (
          <input
            type="text"
            value={c.heading}
            onChange={e => onChange({ ...c, heading: e.target.value })}
            onClick={e => e.stopPropagation()}
            className="mb-10 block w-full bg-transparent text-center text-3xl font-black text-white outline-none focus:underline"
            placeholder="How It Works"
          />
        ) : (
          <h2 className="mb-12 text-center text-3xl font-black text-white">{c.heading}</h2>
        )}
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-orange/30 bg-orange/10 text-2xl">
                {isSelected ? (
                  <input
                    type="text"
                    value={step.icon}
                    onChange={e => {
                      const s = [...steps]
                      s[i] = { ...step, icon: e.target.value }
                      onChange({ ...c, steps: s })
                    }}
                    onClick={e => e.stopPropagation()}
                    className="w-10 bg-transparent text-center text-2xl outline-none"
                  />
                ) : (
                  step.icon
                )}
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-black text-white">
                  {i + 1}
                </span>
              </div>
              {isSelected ? (
                <>
                  <input
                    type="text"
                    value={step.title}
                    onChange={e => {
                      const s = [...steps]
                      s[i] = { ...step, title: e.target.value }
                      onChange({ ...c, steps: s })
                    }}
                    onClick={e => e.stopPropagation()}
                    className="bg-transparent text-lg font-bold text-white outline-none focus:underline"
                    placeholder="Step title"
                  />
                  <input
                    type="text"
                    value={step.description}
                    onChange={e => {
                      const s = [...steps]
                      s[i] = { ...step, description: e.target.value }
                      onChange({ ...c, steps: s })
                    }}
                    onClick={e => e.stopPropagation()}
                    className="bg-transparent text-sm text-text-secondary outline-none focus:underline"
                    placeholder="Description"
                  />
                </>
              ) : (
                <>
                  <h3 className="font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-text-secondary">{step.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
