// =============================================
// CORE ENTITIES
// =============================================

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: Date
  updatedAt: Date
}

export interface Landing {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  blocks: Block[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  previewToken: string
}

// =============================================
// BLOCKS
// =============================================

export type BlockType = 'hero' | 'features' | 'media' | 'changelog' | 'cta_banner'

export interface Block {
  id: string
  type: BlockType
  order: number
  content: BlockContent
}

export type BlockContent =
  | HeroContent
  | FeaturesContent
  | MediaContent
  | ChangelogContent
  | CTAContent

// =============================================
// BLOCK CONTENT TYPES
// =============================================

export interface HeroContent {
  headline: string
  subheadline?: string
  badge?: string
  cta: { text: string; url: string }
  backgroundType: 'gradient' | 'image' | 'color'
  backgroundValue: string
}

export interface FeaturesContent {
  sectionTitle: string
  layout: 'grid-2' | 'grid-3' | 'list'
  cards: FeatureCard[]
}

export interface FeatureCard {
  id: string
  icon?: string
  title: string
  description: string
  badge?: 'new' | 'improved' | 'fixed' | 'coming-soon'
}

export interface MediaContent {
  type: 'video' | 'image' | 'gallery'
  items: MediaItem[]
  caption?: string
}

export interface MediaItem {
  url: string
  thumbnail?: string
  alt?: string
}

export interface ChangelogContent {
  version: string
  date: string
  changes: ChangeItem[]
}

export interface ChangeItem {
  type: 'feature' | 'improvement' | 'fix' | 'deprecation'
  description: string
}

export interface CTAContent {
  headline: string
  subtext?: string
  button: { text: string; url: string }
  variant: 'orange' | 'dark' | 'transparent'
}

// =============================================
// API SHAPES
// =============================================

export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    perPage?: number
  }
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

export interface PaginationQuery {
  page?: number
  perPage?: number
}
