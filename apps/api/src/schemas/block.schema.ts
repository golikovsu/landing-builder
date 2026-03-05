import { z } from 'zod'

const BLOCK_TYPES = [
  'hero',
  'features',
  'media',
  'changelog',
  'cta_banner',
  'nav',
  'urgency_bar',
  'ticker',
  'stats_row',
  'how_it_works',
  'awards',
  'timeline',
  'video_demo',
  'before_after',
  'roadmap',
  'comparison',
  'pricing',
  'testimonials',
  'faq',
  'risk_reversal',
  'payment_partners',
  'email_capture',
  'sticky_bar',
  'auth_form',
] as const

export const createBlockSchema = z.object({
  type: z.enum(BLOCK_TYPES, {
    errorMap: () => ({ message: `Type must be one of: ${BLOCK_TYPES.join(', ')}` }),
  }),
  order: z.number().int().min(0).optional(), // if omitted, appends to end
  content: z.record(z.unknown()).default({}),
})

export const updateBlockSchema = z.object({
  content: z.record(z.unknown()),
})

export const reorderBlocksSchema = z.object({
  ids: z.array(z.string().cuid()).min(1, 'At least one block ID required'),
})

export type CreateBlockInput = z.infer<typeof createBlockSchema>
export type UpdateBlockInput = z.infer<typeof updateBlockSchema>
export type ReorderBlocksInput = z.infer<typeof reorderBlocksSchema>
