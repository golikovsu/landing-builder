import { jest } from '@jest/globals'
import type { CreateLandingInput } from '../schemas/landing.schema.js'

// Prevent prisma.ts from throwing on missing DATABASE_URL
process.env['DATABASE_URL'] = 'postgresql://test:test@localhost:5432/test'

// ── Mock Prisma ───────────────────────────────────────────
const mockPrismaLanding = {
  findFirst: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}

const mockPrismaBlock = {
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

const mockPrismaVersion = {
  create: jest.fn(),
  findMany: jest.fn(),
}

const mockPrisma = {
  landing: mockPrismaLanding,
  block: mockPrismaBlock,
  landingVersion: mockPrismaVersion,
  $transaction: jest.fn(),
}

await jest.unstable_mockModule('../lib/prisma.js', () => ({ prisma: mockPrisma }))

// Import after mock is set up
const { createLanding, LandingError } = await import('../services/landing.service.js')

const USER_ID = 'user-abc'
const LANDING_ID = 'landing-abc'

describe('createLanding', () => {
  beforeEach(() => jest.clearAllMocks())

  it('throws 409 when slug already exists', async () => {
    mockPrismaLanding.findFirst.mockResolvedValue({ id: 'existing' } as never)

    await expect(
      createLanding(USER_ID, { title: 'Test', slug: 'test-slug' } satisfies CreateLandingInput),
    ).rejects.toMatchObject({ statusCode: 409 })
  })

  it('creates a landing when slug is available', async () => {
    mockPrismaLanding.findFirst.mockResolvedValue(null as never)
    const created = { id: LANDING_ID, title: 'Test', slug: 'test-slug', blocks: [] }
    mockPrismaLanding.create.mockResolvedValue(created as never)

    const result = await createLanding(USER_ID, { title: 'Test', slug: 'test-slug' })
    expect(result).toEqual(created)
    expect(mockPrismaLanding.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ createdById: USER_ID, slug: 'test-slug' }),
      }),
    )
  })
})

describe('LandingError', () => {
  it('creates error with correct statusCode', () => {
    const err = new LandingError('Not found', 404)
    expect(err.message).toBe('Not found')
    expect(err.statusCode).toBe(404)
    expect(err).toBeInstanceOf(Error)
  })
})
