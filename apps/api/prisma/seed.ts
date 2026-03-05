import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { hashPassword } from '../src/services/auth.service.js'

const pool = new Pool({ connectionString: process.env['DATABASE_URL'] })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env['SEED_ADMIN_EMAIL'] ?? 'admin@example.com'
  const password = process.env['SEED_ADMIN_PASSWORD'] ?? 'admin123'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin user already exists: ${email}`)
    return
  }

  const hashed = await hashPassword(password)
  const user = await prisma.user.create({
    data: { email, password: hashed, name: 'Admin', role: 'ADMIN' },
  })
  console.log(`✅ Created admin user: ${user.email}`)
  console.log(`   Password: ${password}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => void prisma.$disconnect())
