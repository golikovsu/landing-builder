# Landing Builder

Visual landing page constructor for IQ Option / IQ Broker brand.
Built with Next.js 14 + Express 5 + Prisma + PostgreSQL.

---

## Quick Start

### 1. Clone

```bash
git clone git@gitlab.mobbtech.com:sgolikov/landing-builder.git
cd landing-builder
```

### 2. Run setup

```bash
bash setup.sh
```

The script will install dependencies and create `.env` files from examples.

### 3. Set DATABASE_URL

Open `apps/api/.env` and fill in your PostgreSQL connection string:

```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/landing_dev"

# Supabase
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Railway
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/railway"
```

> This is the **only step** that requires manual action.

### 4. Apply migrations and seed

```bash
bash setup.sh --migrate
```

Creates tables and default admin user: `admin@example.com` / `admin123`

### 5. Start

```bash
pnpm --filter @landing/web dev   # Frontend → http://localhost:3000
pnpm --filter @landing/api dev   # Backend  → http://localhost:4000
```

---

## Stack

| Layer    | Tech                             |
| -------- | -------------------------------- |
| Frontend | Next.js 14, TypeScript, Tailwind |
| Backend  | Express 5, Prisma, PostgreSQL    |
| Auth     | JWT (access + refresh tokens)    |
| Storage  | S3 / Cloudflare R2 (optional)    |

## Environment Variables

| File                  | Required | Description         |
| --------------------- | -------- | ------------------- |
| `apps/api/.env`       | Yes      | API config, DB, JWT |
| `apps/web/.env.local` | No       | Frontend API URL    |

See `.env.example` files in each app for full variable list.
