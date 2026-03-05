import { createLandingSchema, updateLandingSchema } from '../schemas/landing.schema.js'
import { createBlockSchema, reorderBlocksSchema } from '../schemas/block.schema.js'

describe('createLandingSchema', () => {
  it('accepts valid input', () => {
    const result = createLandingSchema.safeParse({ title: 'My Landing', slug: 'my-landing' })
    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = createLandingSchema.safeParse({ title: '', slug: 'my-landing' })
    expect(result.success).toBe(false)
  })

  it('rejects slug with uppercase letters', () => {
    const result = createLandingSchema.safeParse({ title: 'Test', slug: 'My-Landing' })
    expect(result.success).toBe(false)
  })

  it('rejects slug with spaces', () => {
    const result = createLandingSchema.safeParse({ title: 'Test', slug: 'my landing' })
    expect(result.success).toBe(false)
  })

  it('accepts slug with numbers and hyphens', () => {
    const result = createLandingSchema.safeParse({ title: 'Test', slug: 'my-landing-v2' })
    expect(result.success).toBe(true)
  })
})

describe('updateLandingSchema', () => {
  it('accepts partial updates', () => {
    const result = updateLandingSchema.safeParse({ title: 'New title' })
    expect(result.success).toBe(true)
  })

  it('accepts empty object (no changes)', () => {
    const result = updateLandingSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects invalid status', () => {
    const result = updateLandingSchema.safeParse({ status: 'INVALID' })
    expect(result.success).toBe(false)
  })
})

describe('createBlockSchema', () => {
  it('accepts valid block types', () => {
    for (const type of ['hero', 'features', 'media', 'changelog', 'cta_banner']) {
      const result = createBlockSchema.safeParse({ type })
      expect(result.success).toBe(true)
    }
  })

  it('rejects unknown block type', () => {
    const result = createBlockSchema.safeParse({ type: 'unknown' })
    expect(result.success).toBe(false)
  })

  it('defaults content to empty object', () => {
    const result = createBlockSchema.safeParse({ type: 'hero' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.content).toEqual({})
  })
})

describe('reorderBlocksSchema', () => {
  it('rejects empty ids array', () => {
    const result = reorderBlocksSchema.safeParse({ ids: [] })
    expect(result.success).toBe(false)
  })
})
