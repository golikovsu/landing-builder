import { prisma } from '../lib/prisma.js'
import type {
  CreateLandingInput,
  UpdateLandingInput,
  LandingPaginationInput,
} from '../schemas/landing.schema.js'
import type {
  CreateBlockInput,
  UpdateBlockInput,
  ReorderBlocksInput,
} from '../schemas/block.schema.js'

// ── Errors ────────────────────────────────────────────────

export class LandingError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message)
    this.name = 'LandingError'
  }
}

// ── Helpers ───────────────────────────────────────────────

async function assertOwner(landingId: string, userId: string) {
  const landing = await prisma.landing.findFirst({
    where: { id: landingId, deletedAt: null },
  })
  if (!landing) throw new LandingError('Landing not found', 404)
  if (landing.createdById !== userId) throw new LandingError('Forbidden', 403)
  return landing
}

// ── Landing CRUD ──────────────────────────────────────────

export async function listLandings(userId: string, query: LandingPaginationInput) {
  const { page, limit, status } = query
  const skip = (page - 1) * limit

  const where = {
    createdById: userId,
    deletedAt: null,
    ...(status ? { status } : {}),
  }

  const [landings, total] = await prisma.$transaction([
    prisma.landing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { blocks: true } } },
    }),
    prisma.landing.count({ where }),
  ])

  return { landings, total, page, limit, pages: Math.ceil(total / limit) }
}

export async function getLanding(landingId: string, userId: string) {
  const landing = await prisma.landing.findFirst({
    where: { id: landingId, deletedAt: null },
    include: { blocks: { orderBy: { order: 'asc' } } },
  })
  if (!landing) throw new LandingError('Landing not found', 404)
  if (landing.createdById !== userId) throw new LandingError('Forbidden', 403)
  return landing
}

export async function createLanding(userId: string, input: CreateLandingInput) {
  const existing = await prisma.landing.findFirst({
    where: { slug: input.slug, deletedAt: null },
  })
  if (existing) throw new LandingError('Slug is already taken', 409)

  return prisma.landing.create({
    data: { ...input, createdById: userId },
    include: { blocks: true },
  })
}

export async function updateLanding(landingId: string, userId: string, input: UpdateLandingInput) {
  await assertOwner(landingId, userId)

  if (input.slug) {
    const conflict = await prisma.landing.findFirst({
      where: { slug: input.slug, deletedAt: null, NOT: { id: landingId } },
    })
    if (conflict) throw new LandingError('Slug is already taken', 409)
  }

  return prisma.landing.update({
    where: { id: landingId },
    data: input,
    include: { blocks: { orderBy: { order: 'asc' } } },
  })
}

export async function deleteLanding(landingId: string, userId: string) {
  await assertOwner(landingId, userId)
  await prisma.landing.update({
    where: { id: landingId },
    data: { deletedAt: new Date() },
  })
}

// ── Blocks ────────────────────────────────────────────────

export async function addBlock(landingId: string, userId: string, input: CreateBlockInput) {
  await assertOwner(landingId, userId)

  // Determine order: append to end if not specified
  let order = input.order
  if (order === undefined) {
    const last = await prisma.block.findFirst({
      where: { landingId },
      orderBy: { order: 'desc' },
    })
    order = last ? last.order + 1 : 0
  }

  const block = await prisma.block.create({
    data: {
      landingId,
      type: input.type,
      order,
      content: input.content as object,
    },
  })

  await prisma.landing.update({ where: { id: landingId }, data: {} }) // bump updatedAt
  return block
}

export async function updateBlock(
  landingId: string,
  blockId: string,
  userId: string,
  input: UpdateBlockInput,
) {
  await assertOwner(landingId, userId)

  const block = await prisma.block.findFirst({ where: { id: blockId, landingId } })
  if (!block) throw new LandingError('Block not found', 404)

  return prisma.block.update({ where: { id: blockId }, data: { content: input.content as object } })
}

export async function deleteBlock(landingId: string, blockId: string, userId: string) {
  await assertOwner(landingId, userId)

  const block = await prisma.block.findFirst({ where: { id: blockId, landingId } })
  if (!block) throw new LandingError('Block not found', 404)

  await prisma.block.delete({ where: { id: blockId } })
}

export async function reorderBlocks(landingId: string, userId: string, input: ReorderBlocksInput) {
  await assertOwner(landingId, userId)

  const existingBlocks = await prisma.block.findMany({ where: { landingId } })
  const existingIds = new Set(existingBlocks.map(b => b.id))

  for (const id of input.ids) {
    if (!existingIds.has(id)) throw new LandingError(`Block ${id} not found in this landing`, 400)
  }

  // Update each block's order in a transaction
  await prisma.$transaction(
    input.ids.map((id, index) => prisma.block.update({ where: { id }, data: { order: index } })),
  )

  return prisma.block.findMany({
    where: { landingId },
    orderBy: { order: 'asc' },
  })
}

// ── Publishing ────────────────────────────────────────────

export async function publishLanding(landingId: string, userId: string) {
  const landing = await getLanding(landingId, userId)

  // Snapshot current state for version history
  await prisma.landingVersion.create({
    data: {
      landingId,
      snapshot: { landing, blocks: landing.blocks } as object,
    },
  })

  return prisma.landing.update({
    where: { id: landingId },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
    include: { blocks: { orderBy: { order: 'asc' } } },
  })
}

export async function unpublishLanding(landingId: string, userId: string) {
  await assertOwner(landingId, userId)
  return prisma.landing.update({
    where: { id: landingId },
    data: { status: 'DRAFT' },
    include: { blocks: { orderBy: { order: 'asc' } } },
  })
}

export async function getLandingVersions(landingId: string, userId: string) {
  await assertOwner(landingId, userId)
  return prisma.landingVersion.findMany({
    where: { landingId },
    orderBy: { createdAt: 'desc' },
  })
}

// ── Public (no auth) ──────────────────────────────────────

export async function getPublishedBySlug(slug: string) {
  const landing = await prisma.landing.findFirst({
    where: { slug, status: 'PUBLISHED', deletedAt: null },
    include: { blocks: { orderBy: { order: 'asc' } } },
  })
  if (!landing) throw new LandingError('Landing not found', 404)
  return landing
}

export async function getDraftByToken(token: string) {
  const landing = await prisma.landing.findFirst({
    where: { previewToken: token, deletedAt: null },
    include: { blocks: { orderBy: { order: 'asc' } } },
  })
  if (!landing) throw new LandingError('Preview not found', 404)
  return landing
}
