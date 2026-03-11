# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Visual landing page constructor for IQ Option / IQ Broker. Full-stack pnpm monorepo with Next.js 14 frontend, Express 5 API, PostgreSQL via Prisma, and a shared types package.

## Monorepo Structure

- `apps/web` — Next.js 14 (App Router) frontend (`@landing/web`, port 3000)
- `apps/api` — Express REST API (`@landing/api`, port 4000)
- `packages/shared` — Shared TypeScript types (`@landing/shared`)

## Commands

### Root-level (run from repo root)
```
pnpm dev                    # Run both apps in parallel
pnpm build                  # Build shared first, then both apps
pnpm lint                   # Lint all workspaces
pnpm typecheck              # Type-check all workspaces
pnpm format                 # Auto-format with Prettier
pnpm format:check           # Check formatting without fixing
```

### Workspace-specific
```
pnpm --filter @landing/web dev       # Next.js dev server
pnpm --filter @landing/api dev       # API dev server (tsx watch)
pnpm --filter @landing/api test      # Run API tests (Jest)
pnpm --filter @landing/api test -- --testPathPattern=<pattern>  # Run a single test
```

### Database (Prisma)
```
pnpm --filter @landing/api db:migrate    # Run migrations
pnpm --filter @landing/api db:generate   # Generate Prisma client
pnpm --filter @landing/api db:seed       # Seed database
pnpm --filter @landing/api db:studio     # Open Prisma Studio
```

## Architecture

### Frontend (`apps/web`)
- **Pages**: App Router at `app/` — dashboard, editor, login, preview, public pages (`/p/[slug]`)
- **State**: Zustand store (`stores/editor.store.ts`) with undo/redo for the block editor
- **Components**: Organized as `components/blocks/` (23 block types with editors), `components/editor/`, `components/dashboard/`, `components/ui/` (base UI kit)
- **API client**: Axios with JWT interceptor (`lib/api.ts`)
- **Styling**: Tailwind CSS

### Backend (`apps/api`)
- **Routes**: `/api/auth`, `/api/users`, `/api/landings`, `/api/media`, `/api/health`
- **Layering**: Routes → Zod validation middleware → Services → Prisma
- **Auth**: JWT dual-token (access 15m + refresh 7d), Bearer header, `requireAuth`/`requireRole` middleware
- **Validation**: Zod schemas in `src/schemas/`
- **Error handling**: Custom `LandingError` class with HTTP status codes

### Shared (`packages/shared`)
- Exports only TypeScript types (`User`, `Landing`, `Block`, `BlockType`, etc.) used by both apps

### Database
- PostgreSQL with Prisma ORM (`apps/api/prisma/schema.prisma`)
- Models: User, Landing, Block, LandingVersion, RefreshToken
- Soft deletes via `deletedAt` field; cascade deletes from Landing to Blocks

## Code Conventions

- TypeScript strict mode; unused vars must be prefixed with `_`
- Use `consistent-type-imports` (enforced by ESLint)
- Prettier: single quotes, no semicolons, 2-space indent, 100-char line width
- Pre-commit hooks via Husky + lint-staged
- Node 22+ required (`.node-version`)

## API Response Format
```
Success: { data: T, meta?: { total, page, perPage } }
Error:   { error: string, message: string, statusCode: number }
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, and builds on push to main/develop and on PRs.
