#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Landing Builder — Setup ===${NC}\n"

# ── 1. Check tools ──────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org${NC}"; exit 1
fi
if ! command -v pnpm &>/dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm
fi

echo -e "${GREEN}✓ node $(node -v)  |  pnpm $(pnpm -v)${NC}"

# ── 2. Install dependencies ─────────────────────────────────
echo -e "\nInstalling dependencies..."
pnpm install

# ── 3. Copy .env files ──────────────────────────────────────
if [ ! -f apps/api/.env ]; then
  cp apps/api/.env.example apps/api/.env
  echo -e "${GREEN}✓ Created apps/api/.env from .env.example${NC}"
else
  echo "  apps/api/.env already exists — skipping"
fi

if [ ! -f apps/web/.env.local ]; then
  cp apps/web/.env.example apps/web/.env.local
  echo -e "${GREEN}✓ Created apps/web/.env.local from .env.example${NC}"
else
  echo "  apps/web/.env.local already exists — skipping"
fi

# ── 4. Check DATABASE_URL ───────────────────────────────────
source apps/api/.env 2>/dev/null || true
if [[ "$DATABASE_URL" == *"user:password"* ]] || [ -z "$DATABASE_URL" ]; then
  echo -e "\n${YELLOW}⚠  ACTION REQUIRED:${NC}"
  echo -e "   Edit ${YELLOW}apps/api/.env${NC} and set your DATABASE_URL:"
  echo -e "   Local:    postgresql://postgres:postgres@localhost:5432/landing_dev"
  echo -e "   Supabase: postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
  echo -e "   Railway:  postgresql://postgres:[password]@[host]:5432/railway\n"
  echo -e "   Then run:  ${GREEN}bash setup.sh --migrate${NC}\n"
  exit 0
fi

# ── 5. Run migrations + seed (if --migrate flag passed) ─────
if [[ "$1" == "--migrate" ]]; then
  echo -e "\nRunning DB migrations..."
  pnpm --filter @landing/api prisma migrate deploy
  echo -e "${GREEN}✓ Migrations applied${NC}"

  echo "Seeding admin user..."
  pnpm --filter @landing/api prisma db seed
fi

echo -e "\n${GREEN}✓ Setup complete!${NC}"
echo -e "\nStart the project:"
echo -e "  ${GREEN}pnpm --filter @landing/web dev${NC}   → http://localhost:3000"
echo -e "  ${GREEN}pnpm --filter @landing/api dev${NC}   → http://localhost:4000"
echo -e "\nDefault login: admin@example.com / admin123"
