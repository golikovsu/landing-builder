import { Router, type IRouter, type Request, type Response } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  createLandingSchema,
  updateLandingSchema,
  paginationSchema,
} from '../schemas/landing.schema.js'
import {
  createBlockSchema,
  updateBlockSchema,
  reorderBlocksSchema,
} from '../schemas/block.schema.js'
import {
  listLandings,
  getLanding,
  createLanding,
  updateLanding,
  deleteLanding,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  publishLanding,
  unpublishLanding,
  getLandingVersions,
  LandingError,
} from '../services/landing.service.js'

export const landingsRouter: IRouter = Router()
landingsRouter.use(requireAuth)

type WithId = { id: string }
type WithIds = { id: string; blockId: string }

function handleError(err: unknown, res: Response): void {
  if (err instanceof LandingError) {
    res.status(err.statusCode).json({ error: err.message, statusCode: err.statusCode })
    return
  }
  throw err
}

function userId(req: Request): string {
  return req.user!.sub
}

// ── Landings CRUD ─────────────────────────────────────────

// GET /api/landings
landingsRouter.get(
  '/',
  validate(paginationSchema, 'query'),
  async (req: Request, res: Response) => {
    try {
      const result = await listLandings(userId(req), req.query as never)
      res.json({ data: result })
    } catch (err) {
      handleError(err, res)
    }
  },
)

// POST /api/landings
landingsRouter.post('/', validate(createLandingSchema), async (req: Request, res: Response) => {
  try {
    const landing = await createLanding(userId(req), req.body)
    res.status(201).json({ data: landing })
  } catch (err) {
    handleError(err, res)
  }
})

// GET /api/landings/:id
landingsRouter.get('/:id', async (req: Request<WithId>, res: Response) => {
  try {
    const landing = await getLanding(req.params.id, userId(req))
    res.json({ data: landing })
  } catch (err) {
    handleError(err, res)
  }
})

// PATCH /api/landings/:id
landingsRouter.patch(
  '/:id',
  validate(updateLandingSchema),
  async (req: Request<WithId>, res: Response) => {
    try {
      const landing = await updateLanding(req.params.id, userId(req), req.body)
      res.json({ data: landing })
    } catch (err) {
      handleError(err, res)
    }
  },
)

// DELETE /api/landings/:id (soft delete)
landingsRouter.delete('/:id', async (req: Request<WithId>, res: Response) => {
  try {
    await deleteLanding(req.params.id, userId(req))
    res.status(204).send()
  } catch (err) {
    handleError(err, res)
  }
})

// ── Blocks ────────────────────────────────────────────────

// POST /api/landings/:id/blocks
landingsRouter.post(
  '/:id/blocks',
  validate(createBlockSchema),
  async (req: Request<WithId>, res: Response) => {
    try {
      const block = await addBlock(req.params.id, userId(req), req.body)
      res.status(201).json({ data: block })
    } catch (err) {
      handleError(err, res)
    }
  },
)

// PATCH /api/landings/:id/blocks/reorder  (must come before /:blockId)
landingsRouter.patch(
  '/:id/blocks/reorder',
  validate(reorderBlocksSchema),
  async (req: Request<WithId>, res: Response) => {
    try {
      const blocks = await reorderBlocks(req.params.id, userId(req), req.body)
      res.json({ data: blocks })
    } catch (err) {
      handleError(err, res)
    }
  },
)

// PATCH /api/landings/:id/blocks/:blockId
landingsRouter.patch(
  '/:id/blocks/:blockId',
  validate(updateBlockSchema),
  async (req: Request<WithIds>, res: Response) => {
    try {
      const block = await updateBlock(req.params.id, req.params.blockId, userId(req), req.body)
      res.json({ data: block })
    } catch (err) {
      handleError(err, res)
    }
  },
)

// DELETE /api/landings/:id/blocks/:blockId
landingsRouter.delete('/:id/blocks/:blockId', async (req: Request<WithIds>, res: Response) => {
  try {
    await deleteBlock(req.params.id, req.params.blockId, userId(req))
    res.status(204).send()
  } catch (err) {
    handleError(err, res)
  }
})

// ── Publishing ────────────────────────────────────────────

// POST /api/landings/:id/publish
landingsRouter.post('/:id/publish', async (req: Request<WithId>, res: Response) => {
  try {
    const landing = await publishLanding(req.params.id, userId(req))
    res.json({ data: landing })
  } catch (err) {
    handleError(err, res)
  }
})

// POST /api/landings/:id/unpublish
landingsRouter.post('/:id/unpublish', async (req: Request<WithId>, res: Response) => {
  try {
    const landing = await unpublishLanding(req.params.id, userId(req))
    res.json({ data: landing })
  } catch (err) {
    handleError(err, res)
  }
})

// GET /api/landings/:id/versions
landingsRouter.get('/:id/versions', async (req: Request<WithId>, res: Response) => {
  try {
    const versions = await getLandingVersions(req.params.id, userId(req))
    res.json({ data: versions })
  } catch (err) {
    handleError(err, res)
  }
})
