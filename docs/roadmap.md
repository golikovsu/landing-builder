# Roadmap — IQ Option Landing Constructor

> Stack: Next.js 14 + TypeScript (frontend) · Node.js + Express + Prisma (backend)
> Total: 8 weeks → MVP production-ready

---

## Phase 0: Project Setup (Day 1–3)

**Goal:** Working skeleton with CI/CD in place before writing product code.

- [ ] Init monorepo structure (`/apps/web`, `/apps/api`, `/packages/shared`)
- [ ] Configure TypeScript (`strict: true`) for all packages
- [ ] Setup ESLint + Prettier with shared config
- [ ] Create `packages/shared` — shared types (`Landing`, `Block`, `User`)
- [ ] Setup GitHub Actions CI pipeline (lint + typecheck on every PR)
- [ ] Configure Husky + lint-staged (pre-commit checks)
- [ ] Setup Sentry for error monitoring (both frontend and backend)
- [ ] Create `.env.example` files for all apps

**Done when:** `pnpm dev` starts both apps, PR checks pass automatically.

---

## Phase 1: Design System & Base Components (Week 1)

**Goal:** All UI primitives ready, storybook running.

### Frontend — Component Library

- [ ] Import IQ Option design tokens as CSS custom properties (`/styles/tokens.css`)
- [ ] Setup Tailwind CSS with custom theme (colors, fonts, spacing from design tokens)
- [ ] Install and configure Montserrat font (Google Fonts / self-hosted)
- [ ] `Button` component (variants: primary/secondary/ghost, sizes: sm/md/lg)
- [ ] `Badge` component (variants: new/improved/fixed/coming-soon)
- [ ] `Card` component (base card with dark bg, border, shadow)
- [ ] `Typography` components (Heading, Text, Label)
- [ ] `Input`, `Textarea` components
- [ ] `Icon` component (wrapper for SVG icons)
- [ ] `Skeleton` loading state component
- [ ] `Toast` notification component
- [ ] Setup Storybook (optional but recommended)

**Done when:** All components render correctly in isolation, dark theme applied.

---

## Phase 2: Backend Foundation (Week 1–2)

**Goal:** Database schema + auth + base API running.

### Backend

- [ ] Setup Express 5 + TypeScript
- [ ] Setup Prisma with PostgreSQL (Supabase)
- [ ] Define Prisma schema: `User`, `Landing`, `Block`
- [ ] Run initial migration
- [ ] Auth endpoints:
  - `POST /api/auth/login` (JWT access + refresh tokens)
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`
- [ ] Auth middleware (`requireAuth`, `requireRole`)
- [ ] User CRUD (admin only): `GET/POST/PATCH/DELETE /api/users`
- [ ] Health check endpoint: `GET /api/health`
- [ ] Rate limiting middleware
- [ ] Request validation with Zod
- [ ] Error handling middleware (consistent error shape)
- [ ] Setup Jest for backend unit + integration tests

**Done when:** Auth flow works end-to-end, Postman collection created.

---

## Phase 3: Landing & Block API (Week 2–3)

**Goal:** Full CRUD for landings and blocks.

### Landing Endpoints

- [ ] `GET    /api/landings` — list user's landings (paginated)
- [ ] `POST   /api/landings` — create new landing
- [ ] `GET    /api/landings/:id` — get landing with blocks
- [ ] `PATCH  /api/landings/:id` — update title/slug/status
- [ ] `DELETE /api/landings/:id` — soft delete

### Block Endpoints

- [ ] `POST   /api/landings/:id/blocks` — add block
- [ ] `PATCH  /api/landings/:id/blocks/:blockId` — update block content
- [ ] `DELETE /api/landings/:id/blocks/:blockId` — remove block
- [ ] `PATCH  /api/landings/:id/blocks/reorder` — reorder blocks (array of IDs)

### Publishing

- [ ] `POST /api/landings/:id/publish` — publish landing
- [ ] `POST /api/landings/:id/unpublish` — unpublish
- [ ] `GET  /api/landings/:id/versions` — version history

### Media Upload

- [ ] `POST /api/media/upload` — upload file to S3/R2
- [ ] File type + size validation (50MB limit, images/video only)
- [ ] Return CDN URL

### Public Routes (no auth)

- [ ] `GET /p/:slug` — serve published landing data
- [ ] `GET /preview/:token` — serve draft landing data

### Tests

- [ ] Integration tests for all endpoints (Supertest)
- [ ] Unit tests for service layer

**Done when:** All API endpoints pass integration tests.

---

## Phase 4: Constructor Editor UI (Week 3–4)

**Goal:** Working drag-and-drop editor.

### Editor Layout

- [ ] Editor page layout (3-column: Library | Canvas | Settings)
- [ ] Responsive editor layout (collapse library on smaller screens)
- [ ] Block Library panel with all block types
- [ ] Canvas area rendering ordered blocks
- [ ] Settings panel (right sidebar, context-sensitive)

### Zustand Editor Store

- [ ] Store structure: `{ landing, blocks, selectedBlockId, isDirty }`
- [ ] Actions: `addBlock`, `removeBlock`, `reorderBlocks`, `updateBlock`, `selectBlock`
- [ ] Auto-save debounce (500ms after change → PATCH API call)
- [ ] Undo/redo stack (up to 50 operations)

### Drag and Drop

- [ ] Install `@dnd-kit/core` + `@dnd-kit/sortable`
- [ ] Drag blocks in canvas to reorder
- [ ] Drop from library panel to canvas (insert at position)
- [ ] Visual drop indicator

### Block Components (Editor mode)

- [ ] `HeroBlockEditor` — inline editing + settings panel
- [ ] `FeaturesBlockEditor` — card management (add/edit/delete/reorder cards)
- [ ] `MediaBlockEditor` — file upload or URL input, gallery support
- [ ] `ChangelogBlockEditor` — date, version, list of changes
- [ ] `CTABannerBlockEditor` — inline editing + variant selector

### Inline Editing

- [ ] Click-to-edit text fields (contenteditable or Tiptap)
- [ ] Edit mode / view mode toggle per block
- [ ] Keyboard shortcuts: Enter to confirm, Escape to cancel

**Done when:** Full landing can be created via the editor without touching API directly.

---

## Phase 5: Preview & Publishing Flow (Week 5)

**Goal:** Preview URL works, one-click publish works.

- [ ] Preview Modal (device switcher: Desktop/Tablet/Mobile)
- [ ] Embedded iframe for preview
- [ ] Copy preview URL button
- [ ] Publish button with confirmation dialog
- [ ] Published badge on landing card in list view
- [ ] Published landing renderer (`/p/[slug]` page in Next.js)
- [ ] Preview token renderer (`/preview/[token]` page in Next.js)
- [ ] Block rendering components (read-only, optimized for web vitals)
- [ ] Version history drawer
- [ ] Restore version action

**Done when:** Shareable preview URL works, published landing is publicly accessible.

---

## Phase 6: Landing List & Dashboard (Week 5)

**Goal:** Full management UI.

- [ ] Dashboard page: list of landings (grid cards)
- [ ] Landing card: title, status badge, last updated, actions (edit/preview/publish/delete)
- [ ] Create new landing (modal with title + slug input)
- [ ] Duplicate landing
- [ ] Search/filter landings by status
- [ ] Empty state illustration
- [ ] Pagination

**Done when:** Full lifecycle from creation to publishing visible in dashboard.

---

## Phase 7: IQ Option Design System Integration (Week 6)

> Depends on Figma file delivery. Can start with inferred tokens from iqbroker.com.

- [ ] Apply final brand colors and typography (after Figma file review)
- [ ] Fine-tune component designs to match Figma specs
- [ ] Add IQ Option logo and brand assets
- [ ] Create branded block variants (e.g., hero with trading platform screenshot)
- [ ] Add predefined template presets:
  - "Feature Release" template
  - "Special Project" template
  - "Changelog" template
- [ ] Smooth scroll animations (Intersection Observer fade-in)
- [ ] Responsive polish (all breakpoints: 375, 768, 1024, 1440px)

**Done when:** Landing output is indistinguishable from hand-crafted IQ Option pages.

---

## Phase 8: Testing & QA (Week 7)

**Goal:** All test suites green, no P0/P1 bugs.

- [ ] Unit test coverage ≥ 80% on business logic
- [ ] Component test coverage ≥ 70%
- [ ] All API integration tests pass
- [ ] E2E Playwright test suite:
  - Create → Edit → Preview → Publish flow
  - Mobile viewport tests
  - Media upload test
- [ ] Visual regression baseline (Chromatic)
- [ ] Lighthouse audit ≥ 90 on published landing
- [ ] Accessibility audit (axe-core, WCAG 2.1 AA)
- [ ] Security audit: XSS, CSRF, auth bypass check
- [ ] Load testing: 500 concurrent users on preview URL (k6)

**Done when:** All tests green, Lighthouse ≥ 90, no P0 bugs.

---

## Phase 9: Production Launch (Week 8)

- [ ] Staging environment deployed and validated
- [ ] Production environment on Vercel (frontend) + Railway (backend)
- [ ] Cloudflare CDN configured for published landing assets
- [ ] Environment variables documented and stored in secrets manager
- [ ] Database backups configured (daily)
- [ ] Uptime monitoring (Better Uptime / UptimeRobot)
- [ ] Sentry alerts configured (P0 = immediate notification)
- [ ] Runbook written (deploy, rollback, hotfix process)
- [ ] Internal user onboarding (team walkthrough + quick-start guide)
- [ ] Soft launch: 2–3 landings created internally for validation
- [ ] Full launch: open to all IQ Option marketing/content teams

**Done when:** First real landing published by marketing team.

---

## Milestones Summary

| Milestone              | Target Date | Deliverable                        |
| ---------------------- | ----------- | ---------------------------------- |
| M0 — Setup             | Day 3       | Repo + CI/CD running               |
| M1 — Design System     | Week 1      | All UI components in dark IQ theme |
| M2 — API               | Week 2–3    | Full CRUD + auth API               |
| M3 — Editor            | Week 4      | Drag-and-drop constructor working  |
| M4 — Preview & Publish | Week 5      | Full publish flow end-to-end       |
| M5 — Dashboard         | Week 5      | Landing management UI              |
| M6 — Design Polish     | Week 6      | On-brand with IQ Option DS         |
| M7 — QA                | Week 7      | All tests green                    |
| M8 — Launch            | Week 8      | First real landing live            |

---

## Dependencies & Risks

| Risk                       | Likelihood | Mitigation                           |
| -------------------------- | ---------- | ------------------------------------ |
| Figma file delayed         | Medium     | Start with inferred tokens from site |
| S3 setup complexity        | Low        | Use Cloudflare R2 (simpler billing)  |
| DB schema changes mid-dev  | Medium     | Additive-only migrations policy      |
| Drag-and-drop edge cases   | Medium     | Use battle-tested `@dnd-kit`         |
| Scope creep on block types | High       | MVP = 5 block types only             |

---

## Out of Scope (MVP)

- Multi-language / i18n support
- Analytics / heatmaps per landing
- A/B testing variants
- Real-time collaborative editing
- Custom domain per landing
- Comments / approval workflow
- PDF/image export of landing
