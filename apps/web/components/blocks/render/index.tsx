export { HeroBlock } from './HeroBlock'
export { FeaturesBlock } from './FeaturesBlock'
export { MediaBlock } from './MediaBlock'
export { ChangelogBlock } from './ChangelogBlock'
export { CTABannerBlock } from './CTABannerBlock'
export { NavBlock } from './NavBlock'
export { UrgencyBarBlock } from './UrgencyBarBlock'
export { TickerBlock } from './TickerBlock'
export { StatsRowBlock } from './StatsRowBlock'
export { HowItWorksBlock } from './HowItWorksBlock'
export { AwardsBlock } from './AwardsBlock'
export { TimelineBlock } from './TimelineBlock'
export { VideoDemoBlock } from './VideoDemoBlock'
export { BeforeAfterBlock } from './BeforeAfterBlock'
export { RoadmapBlock } from './RoadmapBlock'
export { ComparisonBlock } from './ComparisonBlock'
export { PricingBlock } from './PricingBlock'
export { TestimonialsBlock } from './TestimonialsBlock'
export { FaqBlock } from './FaqBlock'
export { RiskReversalBlock } from './RiskReversalBlock'
export { PaymentPartnersBlock } from './PaymentPartnersBlock'
export { EmailCaptureBlock } from './EmailCaptureBlock'
export { StickyBarBlock } from './StickyBarBlock'
export { AuthFormBlock } from './AuthFormBlock'

import type { Block } from '../../../lib/api'
import { HeroBlock } from './HeroBlock'
import { FeaturesBlock } from './FeaturesBlock'
import { MediaBlock } from './MediaBlock'
import { ChangelogBlock } from './ChangelogBlock'
import { CTABannerBlock } from './CTABannerBlock'
import { NavBlock } from './NavBlock'
import { UrgencyBarBlock } from './UrgencyBarBlock'
import { TickerBlock } from './TickerBlock'
import { StatsRowBlock } from './StatsRowBlock'
import { HowItWorksBlock } from './HowItWorksBlock'
import { AwardsBlock } from './AwardsBlock'
import { TimelineBlock } from './TimelineBlock'
import { VideoDemoBlock } from './VideoDemoBlock'
import { BeforeAfterBlock } from './BeforeAfterBlock'
import { RoadmapBlock } from './RoadmapBlock'
import { ComparisonBlock } from './ComparisonBlock'
import { PricingBlock } from './PricingBlock'
import { TestimonialsBlock } from './TestimonialsBlock'
import { FaqBlock } from './FaqBlock'
import { RiskReversalBlock } from './RiskReversalBlock'
import { PaymentPartnersBlock } from './PaymentPartnersBlock'
import { EmailCaptureBlock } from './EmailCaptureBlock'
import { StickyBarBlock } from './StickyBarBlock'
import { AuthFormBlock } from './AuthFormBlock'

export function renderBlock(block: Block) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock content={block.content} />
    case 'features':
      return <FeaturesBlock content={block.content} />
    case 'media':
      return <MediaBlock content={block.content} />
    case 'changelog':
      return <ChangelogBlock content={block.content} />
    case 'cta_banner':
      return <CTABannerBlock content={block.content} />
    case 'nav':
      return <NavBlock content={block.content} />
    case 'urgency_bar':
      return <UrgencyBarBlock content={block.content} />
    case 'ticker':
      return <TickerBlock content={block.content} />
    case 'stats_row':
      return <StatsRowBlock content={block.content} />
    case 'how_it_works':
      return <HowItWorksBlock content={block.content} />
    case 'awards':
      return <AwardsBlock content={block.content} />
    case 'timeline':
      return <TimelineBlock content={block.content} />
    case 'video_demo':
      return <VideoDemoBlock content={block.content} />
    case 'before_after':
      return <BeforeAfterBlock content={block.content} />
    case 'roadmap':
      return <RoadmapBlock content={block.content} />
    case 'comparison':
      return <ComparisonBlock content={block.content} />
    case 'pricing':
      return <PricingBlock content={block.content} />
    case 'testimonials':
      return <TestimonialsBlock content={block.content} />
    case 'faq':
      return <FaqBlock content={block.content} />
    case 'risk_reversal':
      return <RiskReversalBlock content={block.content} />
    case 'payment_partners':
      return <PaymentPartnersBlock content={block.content} />
    case 'email_capture':
      return <EmailCaptureBlock content={block.content} />
    case 'sticky_bar':
      return <StickyBarBlock content={block.content} />
    case 'auth_form':
      return <AuthFormBlock content={block.content} />
  }
}
