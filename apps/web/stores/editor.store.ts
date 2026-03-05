'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Landing, Block, BlockType, LandingUpdateData } from '../lib/api'
import { blocksApi, landingsApi } from '../lib/api'

// ── Types ─────────────────────────────────────────────────

interface HistoryEntry {
  blocks: Block[]
  title: string
  slug: string
  seoTitle: string
  seoDescription: string
  seoImage: string
  canonicalUrl: string
}

type MetaFields = Partial<{
  title: string
  slug: string
  seoTitle: string
  seoDescription: string
  seoImage: string
  canonicalUrl: string
}>

interface EditorState {
  landing: Landing | null
  blocks: Block[]
  selectedBlockId: string | null
  isDirty: boolean
  isSaving: boolean
  isPublishing: boolean

  // Undo/redo
  past: HistoryEntry[]
  future: HistoryEntry[]

  // Actions
  init: (landing: Landing) => void
  selectBlock: (id: string | null) => void

  addBlock: (type: BlockType) => Promise<void>
  removeBlock: (blockId: string) => Promise<void>
  reorderBlocks: (orderedIds: string[]) => Promise<void>
  updateBlock: (blockId: string, content: Record<string, unknown>) => Promise<void>
  updateLandingMeta: (data: MetaFields) => void

  save: () => Promise<void>
  publish: () => Promise<void>
  unpublish: () => Promise<void>

  undo: () => void
  redo: () => void
}

// ── Debounce helper ───────────────────────────────────────

let saveTimer: ReturnType<typeof setTimeout> | null = null

function scheduleSave(store: EditorState) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => store.save(), 500)
}

function landingSnapshot(landing: Landing, blocks: Block[]): HistoryEntry {
  return {
    blocks,
    title: landing.title,
    slug: landing.slug,
    seoTitle: landing.seoTitle ?? '',
    seoDescription: landing.seoDescription ?? '',
    seoImage: landing.seoImage ?? '',
    canonicalUrl: landing.canonicalUrl ?? '',
  }
}

// ── Store ─────────────────────────────────────────────────

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
    landing: null,
    blocks: [],
    selectedBlockId: null,
    isDirty: false,
    isSaving: false,
    isPublishing: false,
    past: [],
    future: [],

    init(landing) {
      set({
        landing,
        blocks: [...landing.blocks].sort((a, b) => a.order - b.order),
        selectedBlockId: null,
        isDirty: false,
        past: [],
        future: [],
      })
    },

    selectBlock(id) {
      set({ selectedBlockId: id })
    },

    // ── History helpers ──────────────────────────────────

    async addBlock(type) {
      const { landing, blocks } = get()
      if (!landing) return

      const snapshot = landingSnapshot(landing, blocks)

      try {
        const res = await blocksApi.add(landing.id, { type, content: defaultContent(type) })
        const newBlock = res.data.data
        set(s => ({
          blocks: [...s.blocks, newBlock].sort((a, b) => a.order - b.order),
          isDirty: false,
          past: [...s.past.slice(-49), snapshot],
          future: [],
        }))
      } catch (e) {
        console.error('addBlock failed', e)
      }
    },

    async removeBlock(blockId) {
      const { landing, blocks } = get()
      if (!landing) return

      const snapshot = landingSnapshot(landing, blocks)

      set(s => ({
        blocks: s.blocks.filter(b => b.id !== blockId),
        selectedBlockId: s.selectedBlockId === blockId ? null : s.selectedBlockId,
        past: [...s.past.slice(-49), snapshot],
        future: [],
      }))

      try {
        await blocksApi.delete(landing.id, blockId)
      } catch (e) {
        console.error('removeBlock failed', e)
        // revert
        set({ blocks, selectedBlockId: get().selectedBlockId })
      }
    },

    async reorderBlocks(orderedIds) {
      const { landing, blocks } = get()
      if (!landing) return

      const snapshot = landingSnapshot(landing, blocks)

      // Optimistic update
      const reordered = orderedIds
        .map((id, i) => {
          const b = blocks.find(x => x.id === id)
          return b ? { ...b, order: i } : null
        })
        .filter(Boolean) as Block[]

      set({ blocks: reordered, past: [...get().past.slice(-49), snapshot], future: [] })

      try {
        await blocksApi.reorder(landing.id, orderedIds)
      } catch (e) {
        console.error('reorderBlocks failed', e)
        set({ blocks })
      }
    },

    async updateBlock(blockId, content) {
      const { landing, blocks } = get()
      if (!landing) return

      // Optimistic update
      set(s => ({
        blocks: s.blocks.map(b => (b.id === blockId ? { ...b, content } : b)),
        isDirty: true,
      }))

      try {
        await blocksApi.update(landing.id, blockId, content)
        set({ isDirty: false })
      } catch (e) {
        console.error('updateBlock failed', e)
        set({ blocks })
      }
    },

    updateLandingMeta(data) {
      set(s => ({
        landing: s.landing ? { ...s.landing, ...data } : null,
        isDirty: true,
      }))
      scheduleSave(get())
    },

    // ── Persistence ──────────────────────────────────────

    async save() {
      const { landing } = get()
      if (!landing || !get().isDirty) return
      set({ isSaving: true })
      try {
        const payload: LandingUpdateData = {
          title: landing.title,
          slug: landing.slug,
          seoTitle: landing.seoTitle ?? undefined,
          seoDescription: landing.seoDescription ?? undefined,
          seoImage: landing.seoImage ?? undefined,
          canonicalUrl: landing.canonicalUrl ?? undefined,
        }
        await landingsApi.update(landing.id, payload)
        set({ isDirty: false })
      } catch (e) {
        console.error('save failed', e)
      } finally {
        set({ isSaving: false })
      }
    },

    async publish() {
      const { landing } = get()
      if (!landing) return
      set({ isPublishing: true })
      try {
        const res = await landingsApi.publish(landing.id)
        set({ landing: res.data.data })
      } catch (e) {
        console.error('publish failed', e)
      } finally {
        set({ isPublishing: false })
      }
    },

    async unpublish() {
      const { landing } = get()
      if (!landing) return
      set({ isPublishing: true })
      try {
        const res = await landingsApi.unpublish(landing.id)
        set({ landing: res.data.data })
      } catch (e) {
        console.error('unpublish failed', e)
      } finally {
        set({ isPublishing: false })
      }
    },

    // ── Undo / Redo ──────────────────────────────────────

    undo() {
      const { past, blocks, landing } = get()
      if (!past.length || !landing) return
      const prev = past[past.length - 1]!
      const currentSnapshot = landingSnapshot(landing, blocks)
      set(s => ({
        blocks: prev.blocks,
        landing: {
          ...landing,
          title: prev.title,
          slug: prev.slug,
          seoTitle: prev.seoTitle,
          seoDescription: prev.seoDescription,
          seoImage: prev.seoImage,
          canonicalUrl: prev.canonicalUrl,
        },
        past: s.past.slice(0, -1),
        future: [currentSnapshot, ...s.future.slice(0, 49)],
      }))
    },

    redo() {
      const { future, blocks, landing } = get()
      if (!future.length || !landing) return
      const next = future[0]!
      const currentSnapshot = landingSnapshot(landing, blocks)
      set(s => ({
        blocks: next.blocks,
        landing: {
          ...landing,
          title: next.title,
          slug: next.slug,
          seoTitle: next.seoTitle,
          seoDescription: next.seoDescription,
          seoImage: next.seoImage,
          canonicalUrl: next.canonicalUrl,
        },
        future: s.future.slice(1),
        past: [...s.past.slice(-49), currentSnapshot],
      }))
    },
  })),
)

// ── Default content per block type ────────────────────────

function defaultContent(type: BlockType): Record<string, unknown> {
  switch (type) {
    // ── Existing ──────────────────────────────────────────
    case 'hero':
      return {
        eyebrow: 'Platform v3.0 — Now live',
        heading: 'Trade Smarter, Earn More',
        subheading: 'Join 50M+ traders worldwide on the most powerful platform.',
        ctaText: 'Start Trading',
        ctaUrl: '#',
        ctaBadge: '🎁 Limited',
        ctaSecondaryText: 'Watch Demo',
        trustLine: '$10,000 demo · No credit card · Withdraw anytime',
        imageUrl: '',
        bubbles: [
          { value: '+18.4%', label: 'Portfolio today' },
          { value: 'LIVE', label: 'Market open' },
          { value: '50M+', label: 'Traders worldwide' },
        ],
      }
    case 'features':
      return {
        heading: 'Key Features',
        cards: [
          {
            badge: 'new',
            icon: '⚡',
            title: 'Fast Execution',
            description: 'Lightning-fast order execution with sub-millisecond latency.',
          },
          {
            badge: 'improved',
            icon: '🔒',
            title: 'Secure Platform',
            description: 'Enterprise-grade security with two-factor authentication.',
          },
          {
            badge: 'coming',
            icon: '📈',
            title: 'AI Analytics',
            description: 'Intelligent market analysis powered by machine learning.',
          },
        ],
      }
    case 'media':
      return { heading: 'Media Gallery', items: [], layout: 'grid' }
    case 'changelog':
      return {
        heading: "What's New",
        entries: [
          {
            version: '3.0.0',
            date: new Date().toISOString().split('T')[0],
            changes: [
              { type: 'new', text: 'AI-powered analytics dashboard' },
              { type: 'improved', text: 'Trade execution speed +40%' },
              { type: 'fixed', text: 'Mobile chart rendering on iOS 17' },
            ],
          },
        ],
      }
    case 'cta_banner':
      return {
        heading: 'Ready to get started?',
        subheading: 'Join 50M+ traders — open your account in 2 minutes.',
        ctaText: 'Open Free Account',
        ctaUrl: '#',
        variant: 'orange',
      }

    // ── Layout ────────────────────────────────────────────
    case 'nav':
      return {
        logo: 'IQ Option',
        links: [
          { label: 'Features', href: '#features' },
          { label: 'Changelog', href: '#changelog' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Reviews', href: '#reviews' },
          { label: 'FAQ', href: '#faq' },
        ],
        ctaText: 'Open Account',
        ctaUrl: '#',
        ctaSecondaryText: 'Log In',
        ctaSecondaryUrl: '#',
      }
    case 'urgency_bar':
      return {
        text: '🎁 Limited offer: get',
        boldText: '$10,000 demo + 3 months VIP',
        ctaText: 'Claim now',
        ctaUrl: '#',
      }
    case 'ticker':
      return {
        items: [
          { avatar: '🇧🇷', name: 'Carlos F.', action: 'just opened an account', time: '2 min ago' },
          { avatar: '🇩🇪', name: 'Anna K.', action: 'made a $340 profit', time: '5 min ago' },
          { avatar: '🇮🇳', name: 'Raj P.', action: 'withdrew $1,200', time: '7 min ago' },
          { avatar: '🇫🇷', name: 'Marie L.', action: 'joined VIP status', time: '11 min ago' },
          { avatar: '🇺🇸', name: 'James W.', action: 'completed 50 trades', time: '14 min ago' },
          { avatar: '🇦🇺', name: 'Sophie R.', action: 'deposited $500', time: '18 min ago' },
        ],
      }
    case 'sticky_bar':
      return {
        text: 'Join 50M+ traders worldwide.',
        boldText: 'Start with $10K demo account.',
        ctaText: 'Open Account',
        ctaUrl: '#',
        badge: 'Free',
      }

    // ── Content ───────────────────────────────────────────
    case 'stats_row':
      return {
        stats: [
          { value: '313K+', label: 'Active traders', icon: '👥' },
          { value: '4.4★', label: 'App Store rating', icon: '⭐' },
          { value: '148M', label: 'Trades executed', icon: '⚡' },
          { value: '213', label: 'Countries served', icon: '🌍' },
          { value: '11 yrs', label: 'In business', icon: '🏛️' },
        ],
      }
    case 'how_it_works':
      return {
        heading: 'Start Trading in 3 Steps',
        subheading: 'Open your account today and start with a free demo.',
        steps: [
          {
            icon: '👤',
            title: 'Create Account',
            description: 'Sign up in 2 minutes — no documents required to start trading.',
            ctaText: 'Register free',
            ctaUrl: '#',
          },
          {
            icon: '🎮',
            title: 'Practice on Demo',
            description: 'Get $10,000 virtual money to practice without any risk.',
            ctaText: 'Try demo',
            ctaUrl: '#',
          },
          {
            icon: '💸',
            title: 'Trade & Withdraw',
            description: 'Go live with as little as $10. Withdraw profits anytime.',
            ctaText: 'Start trading',
            ctaUrl: '#',
          },
        ],
      }
    case 'before_after':
      return {
        heading: 'Platform v3.0 — A New Era',
        subheading: 'See what changed in our biggest update ever.',
        beforeLabel: 'v2.5 — Previous',
        afterLabel: 'v3.0 — Now Live',
        beforeImage: '',
        afterImage: '',
        bullets: ['AI signal overlay', '40% faster execution', 'New mobile app', 'Dark mode 2.0'],
      }
    case 'video_demo':
      return {
        heading: 'See the Platform in Action',
        subheading: 'Watch our 2-minute product overview.',
        videoUrl: '',
        thumbnailUrl: '',
        badge: '2 min watch',
      }

    // ── Social Proof ──────────────────────────────────────
    case 'testimonials':
      return {
        heading: 'What Traders Are Saying',
        statsLine: '313K+ active traders · 4.4★ average rating · 148M trades executed',
        testimonials: [
          {
            name: 'Carlos F.',
            location: 'Brazil',
            rating: 5,
            avatar: '🇧🇷',
            text: 'Best platform I have used. Fast execution and great support.',
          },
          {
            name: 'Anna K.',
            location: 'Germany',
            rating: 5,
            avatar: '🇩🇪',
            text: 'The demo account helped me learn without any risk. Now I trade daily.',
          },
          {
            name: 'Raj P.',
            location: 'India',
            rating: 4,
            avatar: '🇮🇳',
            text: 'Withdrawal is super fast. Got my money in 1 day.',
          },
          {
            name: 'Marie L.',
            location: 'France',
            rating: 5,
            avatar: '🇫🇷',
            text: 'AI analytics feature is a game changer for my strategy.',
          },
          {
            name: 'James W.',
            location: 'USA',
            rating: 5,
            avatar: '🇺🇸',
            text: 'Professional grade tools at a beginner-friendly price.',
            isVideo: true,
          },
          {
            name: 'Sophie R.',
            location: 'Australia',
            rating: 4,
            avatar: '🇦🇺',
            text: 'Clean interface, no clutter. Just trading.',
            isVideo: true,
          },
        ],
      }
    case 'awards':
      return {
        heading: 'Awards & Recognition',
        awards: [
          { icon: '🏆', title: 'Best Trading Platform', org: 'Finance Awards', year: '2025' },
          { icon: '🥇', title: 'Most Innovative Broker', org: 'Global FX Awards', year: '2024' },
          { icon: '⭐', title: '4.4 App Store Rating', org: 'iOS & Android', year: '2025' },
          { icon: '🌍', title: 'Top Broker LATAM', org: 'Broker Review', year: '2025' },
        ],
        mediaHeading: 'As seen in',
        mediaLogos: ['Forbes', 'Bloomberg', 'Business Insider', 'Reuters', 'Financial Times'],
      }
    case 'risk_reversal':
      return {
        heading: 'Start with Zero Risk',
        cards: [
          {
            icon: '🎮',
            title: 'Free Demo Forever',
            description: 'Practice with $10,000 virtual money as long as you need.',
          },
          {
            icon: '🚫',
            title: 'No Credit Card Required',
            description: 'Open your account and start the demo with just your email.',
          },
          {
            icon: '💸',
            title: 'Withdraw Anytime',
            description: 'Your money is yours. Withdraw in 1-3 business days.',
          },
        ],
      }
    case 'payment_partners':
      return {
        heading: 'Trusted payment methods',
        partners: [
          'VISA',
          'Mastercard',
          'Skrill',
          'Neteller',
          'PIX',
          'Wire Transfer',
          'Bitcoin',
          'USDT',
        ],
      }

    // ── Conversion ────────────────────────────────────────
    case 'pricing':
      return {
        heading: 'Choose Your Account',
        subheading: 'Start free, upgrade anytime.',
        plans: [
          {
            name: 'Demo',
            price: 'Free',
            description: 'Practice without risk',
            ctaText: 'Start Demo',
            ctaUrl: '#',
            highlighted: false,
            features: [
              '$10,000 virtual balance',
              'All platform features',
              'No time limit',
              'Instant access',
            ],
          },
          {
            name: 'Standard',
            price: '$10',
            period: 'min deposit',
            description: 'Real trading account',
            ctaText: 'Open Account',
            ctaUrl: '#',
            highlighted: true,
            badge: 'Most Popular',
            features: ['Real market access', '50+ assets', 'Instant withdrawals', '24/7 support'],
          },
          {
            name: 'VIP',
            price: '$1K',
            period: 'min deposit',
            description: 'Premium experience',
            ctaText: 'Go VIP',
            ctaUrl: '#',
            highlighted: false,
            features: [
              'Personal manager',
              'Exclusive tournaments',
              'Priority withdrawals',
              'VIP webinars',
            ],
          },
        ],
      }
    case 'auth_form':
      return {
        defaultTab: 'register',
        showTabSwitcher: true,
        registerHeading: 'Create an account',
        registerSubheading: 'with email',
        registerCtaText: 'Start Trading Free',
        socialProofText: '50M+ traders already joined',
        loginHeading: 'Welcome back',
        loginCtaText: 'Log in',
        showSocialLogin: true,
        socialLoginGoogleUrl: '',
        socialLoginFacebookUrl: '',
        recoveryHeading: 'Password recovery',
        recoveryCtaText: 'Send recovery link',
        registrationApiUrl: '/lp/auth/api/v2/register',
        loginApiUrl: '/lp/auth/api/v2/login',
        recoveryApiUrl: '/lp/auth/api/v2/recovery',
        successRedirectUrl: '',
        brandId: '',
        companyId: '',
        legalText: 'By registering you agree to our',
        termsUrl: '',
        privacyUrl: '',
        trustSignals: '🔒 Secure · Free $10K demo · Instant access',
      }
    case 'email_capture':
      return {
        heading: 'Join 80,000+ Traders',
        subheading: 'Get weekly market insights and strategy tips.',
        placeholder: 'Enter your email',
        ctaText: 'Subscribe Free',
        trustNote: 'No spam. Unsubscribe anytime.',
        statsLine: '80K+ subscribers · Weekly insights',
      }
    case 'faq':
      return {
        heading: 'Frequently Asked Questions',
        items: [
          {
            question: 'Is IQ Option regulated and safe?',
            answer:
              'Yes. IQ Option is regulated by CySEC (Cyprus Securities and Exchange Commission) and complies with EU financial regulations. Your funds are held in segregated accounts.',
          },
          {
            question: 'What is the minimum deposit?',
            answer:
              'The minimum deposit is just $10 for a Standard account. The Demo account is completely free with no deposit required.',
          },
          {
            question: 'How fast are withdrawals?',
            answer:
              'Withdrawals are processed within 1-3 business days depending on your payment method. E-wallets are usually faster than bank transfers.',
          },
          {
            question: 'What assets can I trade?',
            answer:
              'You can trade forex, stocks, commodities, indices, ETFs, cryptocurrencies, and options — over 250 assets in total.',
          },
          {
            question: 'Do I need experience to start?',
            answer:
              'No experience needed. Start with the free $10K demo account to practice risk-free, then move to real trading when you are ready.',
          },
          {
            question: 'Is there a mobile app?',
            answer:
              'Yes! The IQ Option app is available for iOS and Android with full trading functionality, rated 4.4 stars on the App Store.',
          },
        ],
      }

    // ── Detail ────────────────────────────────────────────
    case 'timeline':
      return {
        heading: 'Our Journey',
        entries: [
          {
            year: '2013',
            title: 'Founded',
            description: 'IQ Option launched with a mission to democratize trading.',
          },
          {
            year: '2016',
            title: '10M Users',
            description: 'Reached 10 million registered users worldwide.',
          },
          {
            year: '2019',
            title: 'CySEC License',
            description: 'Received EU regulatory license for European markets.',
          },
          {
            year: '2022',
            title: 'v2.0 Launch',
            description: 'Major platform redesign with faster execution engine.',
          },
          {
            year: '2025',
            title: 'AI Analytics',
            description: 'Launched AI-powered signal and analytics suite.',
          },
          {
            year: '2026',
            title: 'v3.0 Now Live',
            description: 'Complete platform overhaul with 40% faster execution.',
            badge: 'NEW',
          },
        ],
      }
    case 'roadmap':
      return {
        heading: "What's Coming Next",
        subheading: 'Our product roadmap for the next quarters.',
        cards: [
          {
            period: 'Q4 2025',
            title: 'Foundation Update',
            status: 'shipped',
            items: ['AI signal overlay', 'Redesigned mobile app', 'New charting engine'],
          },
          {
            period: 'Q1 2026',
            title: 'Social Trading',
            status: 'in_progress',
            items: ['Copy trading feature', 'Trader leaderboard', 'Strategy marketplace'],
          },
          {
            period: 'Q2 2026',
            title: 'Smart Portfolio',
            status: 'planned',
            items: ['Portfolio auto-rebalancing', 'Risk scoring AI', 'Tax reporting tools'],
          },
        ],
      }
    case 'comparison':
      return {
        heading: 'How We Compare',
        ourName: 'IQ Option',
        competitorA: 'Competitor A',
        competitorB: 'Competitor B',
        rows: [
          { feature: 'Min. deposit', us: '$10', competitorA: '$200', competitorB: '$100' },
          { feature: 'Demo account', us: true, competitorA: false, competitorB: true },
          {
            feature: 'Withdrawal time',
            us: '1 day',
            competitorA: '3-5 days',
            competitorB: '2-3 days',
          },
          { feature: 'Mobile app', us: true, competitorA: true, competitorB: false },
          { feature: 'Assets available', us: '250+', competitorA: '50+', competitorB: '100+' },
          { feature: 'Regulated', us: true, competitorA: true, competitorB: false },
          { feature: '24/7 support', us: true, competitorA: false, competitorB: false },
          { feature: 'AI analytics', us: true, competitorA: false, competitorB: false },
        ],
      }
  }
}
