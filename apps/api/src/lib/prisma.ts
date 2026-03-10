import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Singleton pattern — reuse the same client across hot reloads in dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient(): PrismaClient {
  const connectionString = process.env['DATABASE_URL']
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient()

if (process.env['NODE_ENV'] !== 'production') globalForPrisma.prisma = prisma
