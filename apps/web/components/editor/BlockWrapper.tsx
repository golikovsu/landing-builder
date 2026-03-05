'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEditorStore } from '../../stores/editor.store'
import type { Block } from '../../lib/api'

// ── Original 5 editors ──────────────────────────────────────
import { HeroBlockEditor } from '../blocks/HeroBlockEditor'
import { FeaturesBlockEditor } from '../blocks/FeaturesBlockEditor'
import { MediaBlockEditor } from '../blocks/MediaBlockEditor'
import { ChangelogBlockEditor } from '../blocks/ChangelogBlockEditor'
import { CTABannerBlockEditor } from '../blocks/CTABannerBlockEditor'

// ── New editors ─────────────────────────────────────────────
import { NavBlockEditor } from '../blocks/NavBlockEditor'
import { UrgencyBarBlockEditor } from '../blocks/UrgencyBarBlockEditor'
import { TickerBlockEditor } from '../blocks/TickerBlockEditor'
import { StatsRowBlockEditor } from '../blocks/StatsRowBlockEditor'
import { HowItWorksBlockEditor } from '../blocks/HowItWorksBlockEditor'
import { AwardsBlockEditor } from '../blocks/AwardsBlockEditor'
import { TimelineBlockEditor } from '../blocks/TimelineBlockEditor'
import { VideoDemoBlockEditor } from '../blocks/VideoDemoBlockEditor'
import { BeforeAfterBlockEditor } from '../blocks/BeforeAfterBlockEditor'
import { RoadmapBlockEditor } from '../blocks/RoadmapBlockEditor'
import { ComparisonBlockEditor } from '../blocks/ComparisonBlockEditor'
import { PricingBlockEditor } from '../blocks/PricingBlockEditor'
import { TestimonialsBlockEditor } from '../blocks/TestimonialsBlockEditor'
import { FaqBlockEditor } from '../blocks/FaqBlockEditor'
import { RiskReversalBlockEditor } from '../blocks/RiskReversalBlockEditor'
import { PaymentPartnersBlockEditor } from '../blocks/PaymentPartnersBlockEditor'
import { EmailCaptureBlockEditor } from '../blocks/EmailCaptureBlockEditor'
import { StickyBarBlockEditor } from '../blocks/StickyBarBlockEditor'
import { AuthFormBlockEditor } from '../blocks/AuthFormBlockEditor'

interface Props {
  block: Block
}

const BLOCK_LABELS: Record<Block['type'], string> = {
  hero: 'Hero',
  features: 'Features',
  media: 'Media',
  changelog: 'Changelog',
  cta_banner: 'CTA Banner',
  nav: 'Navigation',
  urgency_bar: 'Urgency Bar',
  ticker: 'Ticker',
  stats_row: 'Stats Row',
  how_it_works: 'How It Works',
  awards: 'Awards',
  timeline: 'Timeline',
  video_demo: 'Video Demo',
  before_after: 'Before / After',
  roadmap: 'Roadmap',
  comparison: 'Comparison',
  pricing: 'Pricing',
  testimonials: 'Testimonials',
  faq: 'FAQ',
  risk_reversal: 'Risk Reversal',
  payment_partners: 'Payment Partners',
  email_capture: 'Email Capture',
  sticky_bar: 'Sticky Bar',
  auth_form: 'Auth Form',
}

export function BlockWrapper({ block }: Props) {
  const { selectedBlockId, selectBlock, removeBlock, updateBlock } = useEditorStore()
  const isSelected = selectedBlockId === block.id

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  const handleContentChange = (content: Record<string, unknown>) =>
    void updateBlock(block.id, content)

  const renderBlock = () => {
    const props = { block, isSelected, onChange: handleContentChange }
    switch (block.type) {
      case 'hero':
        return <HeroBlockEditor {...props} />
      case 'features':
        return <FeaturesBlockEditor {...props} />
      case 'media':
        return <MediaBlockEditor {...props} />
      case 'changelog':
        return <ChangelogBlockEditor {...props} />
      case 'cta_banner':
        return <CTABannerBlockEditor {...props} />
      case 'nav':
        return <NavBlockEditor {...props} />
      case 'urgency_bar':
        return <UrgencyBarBlockEditor {...props} />
      case 'ticker':
        return <TickerBlockEditor {...props} />
      case 'stats_row':
        return <StatsRowBlockEditor {...props} />
      case 'how_it_works':
        return <HowItWorksBlockEditor {...props} />
      case 'awards':
        return <AwardsBlockEditor {...props} />
      case 'timeline':
        return <TimelineBlockEditor {...props} />
      case 'video_demo':
        return <VideoDemoBlockEditor {...props} />
      case 'before_after':
        return <BeforeAfterBlockEditor {...props} />
      case 'roadmap':
        return <RoadmapBlockEditor {...props} />
      case 'comparison':
        return <ComparisonBlockEditor {...props} />
      case 'pricing':
        return <PricingBlockEditor {...props} />
      case 'testimonials':
        return <TestimonialsBlockEditor {...props} />
      case 'faq':
        return <FaqBlockEditor {...props} />
      case 'risk_reversal':
        return <RiskReversalBlockEditor {...props} />
      case 'payment_partners':
        return <PaymentPartnersBlockEditor {...props} />
      case 'email_capture':
        return <EmailCaptureBlockEditor {...props} />
      case 'sticky_bar':
        return <StickyBarBlockEditor {...props} />
      case 'auth_form':
        return <AuthFormBlockEditor {...props} />
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative"
      onClick={e => {
        e.stopPropagation()
        selectBlock(block.id)
      }}
    >
      {/* Selection ring */}
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-2 ring-orange ring-offset-2 ring-offset-bg-base" />
      )}
      {/* Hover ring */}
      {!isSelected && (
        <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-transparent transition-all group-hover:ring-white/20" />
      )}

      {/* Block label + drag handle */}
      <div
        className={`absolute -top-px left-4 z-20 flex items-center gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <button
          {...attributes}
          {...listeners}
          className="-translate-y-full cursor-grab rounded-t bg-orange px-2 py-0.5 text-xs text-white active:cursor-grabbing"
          onClick={e => e.stopPropagation()}
        >
          ⠿ {BLOCK_LABELS[block.type]}
        </button>
      </div>

      {/* Delete */}
      <button
        onClick={e => {
          e.stopPropagation()
          void removeBlock(block.id)
        }}
        className={`absolute right-3 -top-px z-20 -translate-y-full rounded-t bg-bg-card-alt px-2 py-0.5 text-xs text-text-muted transition-opacity hover:text-error ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        Delete
      </button>

      {renderBlock()}
    </div>
  )
}
