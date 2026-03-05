import { z } from 'zod'

export const createLandingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
})

export const updateLandingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  // SEO
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
  seoImage: z.string().max(500).optional(),
  canonicalUrl: z.string().max(500).optional(),
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

export type CreateLandingInput = z.infer<typeof createLandingSchema>
export type UpdateLandingInput = z.infer<typeof updateLandingSchema>
export type LandingPaginationInput = z.infer<typeof paginationSchema>
