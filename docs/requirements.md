# Landing Constructor — Requirements

> **Project:** Universal Landing Page Constructor for IQ Option / IQ Broker
> **Purpose:** Creating special project pages and product feature/changelog reviews
> **Audience:** Mixed team — marketers, content managers, frontend developers

---

## 1. User Stories

### Epic 1: Landing Creation

| ID    | Role               | Goal                                                          | Value                                    |
| ----- | ------------------ | ------------------------------------------------------------- | ---------------------------------------- |
| US-01 | Marketer           | Add a Hero section with headline, subheadline, and CTA button | Launch a campaign without developer help |
| US-02 | Content Manager    | Add feature cards to show product changes                     | Communicate updates clearly to users     |
| US-03 | Content Manager    | Embed video or screenshot gallery                             | Make the page visually rich              |
| US-04 | Frontend Developer | Edit block configuration via JSON/code panel                  | Implement complex non-standard layouts   |
| US-05 | Designer           | Choose from predefined IQ Option brand blocks                 | Maintain brand consistency               |
| US-06 | Marketer           | Reorder blocks via drag-and-drop                              | Quickly iterate on page structure        |
| US-07 | Content Manager    | Duplicate and clone existing landings                         | Reuse successful templates               |

### Epic 2: Preview & Publishing

| ID    | Role     | Goal                                  | Value                                       |
| ----- | -------- | ------------------------------------- | ------------------------------------------- |
| US-08 | Any User | Preview the landing before publishing | Verify the result before going live         |
| US-09 | Any User | Get a shareable preview URL           | Share with stakeholders for approval        |
| US-10 | Any User | Publish a landing with one click      | Make the page available to end users        |
| US-11 | Any User | Unpublish or roll back a landing      | Quickly fix issues in production            |
| US-12 | Any User | See version history of a landing      | Audit changes and restore previous versions |

### Epic 3: Block Library

| ID    | Role     | Goal                                               | Value                                 |
| ----- | -------- | -------------------------------------------------- | ------------------------------------- |
| US-13 | Any User | Pick from a block library panel                    | Discover and reuse pre-built sections |
| US-14 | Designer | Add blocks consistent with IQ Broker design system | Ship on-brand pages                   |
| US-15 | Marketer | Set UTM tracking on CTA buttons                    | Measure campaign performance          |

---

## 2. Functional Requirements

### 2.1 Block Types (MVP)

| Block             | Fields                                                                        |
| ----------------- | ----------------------------------------------------------------------------- |
| **Hero**          | Headline, subheadline, CTA text + URL, background image/gradient, badge label |
| **Feature Cards** | Section title, N cards (icon, title, description, badge: New/Improved/Fixed)  |
| **Media**         | Type (video/image/gallery), URL/upload, caption, thumbnail                    |
| **Changelog**     | Date, version, list of changes (type + description)                           |
| **CTA Banner**    | Headline, subtext, button text + URL, background variant                      |

### 2.2 Constructor Editor

- Drag-and-drop block reordering
- Inline editing (click to edit text in place)
- Settings panel per block (sidebar)
- Undo / redo (Ctrl+Z / Ctrl+Y)
- Live preview pane (split or tab view)
- Mobile preview mode toggle

### 2.3 Publishing

- Draft / Published status per landing
- Generate unique preview URL (`/preview/{token}`)
- One-click publish to production URL (`/p/{slug}`)
- Publish history / version list

---

## 3. Non-Functional Requirements

### 3.1 Performance

| Metric                            | Target                                 |
| --------------------------------- | -------------------------------------- |
| Page load (published landing)     | < 1s LCP (Largest Contentful Paint)    |
| API response time (p95)           | < 200ms                                |
| Editor interaction latency        | < 100ms                                |
| Lighthouse score (published page) | ≥ 90 (Performance, Accessibility, SEO) |

### 3.2 Reliability

| Metric                      | Target                     |
| --------------------------- | -------------------------- |
| Uptime                      | 99.9% (< 9h downtime/year) |
| Error rate (API)            | < 0.1%                     |
| MTTR (Mean Time To Recover) | < 30 min                   |

### 3.3 Security

- Authentication: JWT (short-lived access + refresh tokens)
- Role-based access control: Admin / Editor / Viewer
- All API endpoints protected; public landing pages are read-only
- Input sanitization: XSS prevention on all user-generated content
- Media uploads: type validation + virus scan + size limit (50MB)

### 3.4 Scalability

- Horizontal scaling of API servers (stateless)
- CDN for published static pages (Cloudflare / CloudFront)
- Database connection pooling

---

## 4. Tech Stack

### Frontend

| Layer            | Technology                                  |
| ---------------- | ------------------------------------------- |
| Framework        | Next.js 14 (App Router)                     |
| Language         | TypeScript 5                                |
| Styling          | Tailwind CSS 3 + CSS Modules for components |
| State Management | Zustand (editor state)                      |
| Drag & Drop      | @dnd-kit/core                               |
| Rich Text        | Tiptap (minimal, headless)                  |
| HTTP Client      | Axios + React Query (TanStack Query v5)     |
| Forms            | React Hook Form + Zod                       |

### Backend

| Layer         | Technology                  |
| ------------- | --------------------------- |
| Runtime       | Node.js 20 LTS              |
| Framework     | Express 5                   |
| Language      | TypeScript 5                |
| ORM           | Prisma 5                    |
| Database      | PostgreSQL 16               |
| File Storage  | AWS S3 (or Cloudflare R2)   |
| Auth          | JWT (jsonwebtoken) + bcrypt |
| Validation    | Zod                         |
| Rate Limiting | express-rate-limit          |

### Infrastructure

| Component        | Technology                         |
| ---------------- | ---------------------------------- |
| Frontend Hosting | Vercel                             |
| Backend Hosting  | Railway / Render                   |
| Database         | Supabase (managed PostgreSQL)      |
| CDN              | Cloudflare                         |
| CI/CD            | GitHub Actions                     |
| Monitoring       | Sentry (errors) + Vercel Analytics |

---

## 5. Data Model

```typescript
interface Landing {
  id: string // UUID
  title: string
  slug: string // URL-safe, unique
  status: 'draft' | 'published'
  blocks: Block[]
  createdBy: string // User ID
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  previewToken: string // random UUID for preview URL
}

interface Block {
  id: string
  type: 'hero' | 'features' | 'media' | 'changelog' | 'cta_banner'
  order: number
  content: HeroContent | FeaturesContent | MediaContent | ChangelogContent | CTAContent
}

interface HeroContent {
  headline: string
  subheadline?: string
  badge?: string
  cta: { text: string; url: string }
  backgroundType: 'gradient' | 'image' | 'color'
  backgroundValue: string // gradient string or image URL or hex
}

interface FeaturesContent {
  sectionTitle: string
  layout: 'grid-2' | 'grid-3' | 'list'
  cards: FeatureCard[]
}

interface FeatureCard {
  id: string
  icon?: string // SVG string or icon name
  title: string
  description: string
  badge?: 'new' | 'improved' | 'fixed' | 'coming-soon'
}

interface MediaContent {
  type: 'video' | 'image' | 'gallery'
  items: MediaItem[]
  caption?: string
}

interface MediaItem {
  url: string
  thumbnail?: string
  alt?: string
}

interface ChangelogContent {
  version: string
  date: string
  changes: ChangeItem[]
}

interface ChangeItem {
  type: 'feature' | 'improvement' | 'fix' | 'deprecation'
  description: string
}

interface CTAContent {
  headline: string
  subtext?: string
  button: { text: string; url: string }
  variant: 'orange' | 'dark' | 'transparent'
}
```

---

## 6. Testing Requirements

### 6.1 Unit Tests (Jest)

- All utility functions (slug generation, date formatting, content sanitization)
- Zustand store reducers (block add / remove / reorder)
- API route handlers (mocked DB)
- Target coverage: **≥ 80%** on business logic

### 6.2 Component Tests (React Testing Library)

- All block components render correctly with valid props
- Editor interactions: add block, delete block, reorder
- Form validation messages
- Target coverage: **≥ 70%** on components

### 6.3 API Integration Tests (Supertest)

- Landing CRUD endpoints
- Authentication flow (login, refresh, logout)
- Publishing / unpublishing
- File upload validation

### 6.4 E2E Tests (Playwright)

**Happy Path Scenarios:**

1. Create landing → Add Hero block → Add Features block → Preview → Publish
2. Edit published landing → Unpublish → Edit → Re-publish
3. Upload media → Add to Media block → Preview
4. Share preview URL → View as anonymous user

**Devices:**

- Desktop (1440px)
- Tablet (768px)
- Mobile (375px)

### 6.5 Visual Regression (Chromatic)

- All block components in all variants
- Full landing preview snapshots
- Run on every PR

---

## 7. Design System Reference (IQ Option)

**Source:** iqoption.com screenshot (Feb 2026) + brandfetch.com/iqoption.com
**Theme:** Dark (near-black base, NOT navy) + orange accent

```css
/* =============================================
   BACKGROUNDS
   Nearly black base. Three elevation levels.
   ============================================= */
--color-bg-base: #0c0e14; /* Deepest — hero, most sections */
--color-bg-raised: #131620; /* Alternating sections */
--color-bg-card: #1a1e2d; /* Cards, floating UI */
--color-bg-card-alt: #1f2335; /* Hover, secondary cards */

/* =============================================
   ORANGE — Primary accent, CTA
   ============================================= */
--color-orange: #ff6a00; /* Primary: CTA buttons, badges */
--color-orange-alt: #fe7a20; /* Warmer variant */
--color-orange-light: #ffab5e; /* Hover, highlights */
--color-orange-dark: #cc4e00; /* Active / pressed */
--color-orange-glow: rgba(255, 106, 0, 0.18);

/* =============================================
   GRADIENTS
   ============================================= */
--gradient-orange: linear-gradient(135deg, #ff6a00 0%, #fe7a20 100%);
--gradient-hero: radial-gradient(
  ellipse 80% 60% at 70% 40%,
  rgba(255, 106, 0, 0.12) 0%,
  transparent 65%
);

/* =============================================
   TEXT
   ============================================= */
--color-text-primary: #ffffff;
--color-text-secondary: #9aa0b8;
--color-text-muted: #5e6480;

/* =============================================
   BORDERS
   ============================================= */
--color-border: rgba(255, 255, 255, 0.07);
--color-border-card: rgba(255, 255, 255, 0.09);
--color-border-orange: rgba(255, 106, 0, 0.35);

/* =============================================
   SEMANTIC
   ============================================= */
--color-success: #2ecc71;
--color-error: #e74c3c;
--color-info: #3498db;
--color-warning: #f39c12;

/* =============================================
   TYPOGRAPHY
   ============================================= */
--font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
/* Weights used: 400, 500, 600, 700, 800, 900 */
/* Heading weights: 800–900 | Body: 400–500 | Labels/badges: 600–700 */

/* =============================================
   BORDER RADIUS
   ============================================= */
--radius-sm: 6px; /* badges, small chips */
--radius-md: 10px; /* buttons */
--radius-lg: 16px; /* cards */
--radius-xl: 24px; /* large cards, modals */
--radius-2xl: 32px; /* video player, hero visual */
--radius-full: 9999px; /* pills, avatars */

/* =============================================
   SPACING (4px base)
   ============================================= */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;

/* =============================================
   SHADOWS
   ============================================= */
--shadow-card: 0 2px 24px rgba(0, 0, 0, 0.45);
--shadow-orange: 0 4px 24px rgba(255, 106, 0, 0.35);
--shadow-float: 0 16px 48px rgba(0, 0, 0, 0.6);
```

### Section Structure (from iqoption.com screenshot)

| #   | Block                      | Notes                                                        |
| --- | -------------------------- | ------------------------------------------------------------ |
| 1   | Header (sticky)            | Logo · Nav · Login · CTA                                     |
| 2   | Hero                       | Badge · H1 · Subtitle · CTA · Platform screenshot (floating) |
| 3   | Stats Row                  | 5 stats: traders, rating, trades, countries, years           |
| 4   | Feature Cards (3-col grid) | Icon · Badge · Title · Description                           |
| 5   | Promo Highlight            | Large amount ($10,000) with check items                      |
| 6   | Milestone Timeline         | Horizontal line + year dots                                  |
| 7   | Media / Video Demo         | 16:9 player with play button                                 |
| 8   | Changelog                  | Version · Date · Badged list                                 |
| 9   | Testimonials               | Text cards + video cards + trust bar                         |
| 10  | Payment Partners           | Greyscale logos row                                          |
| 11  | CTA Banner                 | Orange gradient bg · H2 · Two buttons                        |
