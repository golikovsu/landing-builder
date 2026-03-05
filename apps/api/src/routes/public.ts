import { Router, type IRouter, type Request, type Response } from 'express'
import { getPublishedBySlug, getDraftByToken, LandingError } from '../services/landing.service.js'

export const publicRouter: IRouter = Router()

function handleError(err: unknown, res: Response): void {
  if (err instanceof LandingError) {
    res.status(err.statusCode).json({ error: err.message, statusCode: err.statusCode })
    return
  }
  throw err
}

// GET /p/:slug — serve published landing data (no auth)
publicRouter.get('/p/:slug', async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const landing = await getPublishedBySlug(req.params.slug)
    res.json({ data: landing })
  } catch (err) {
    handleError(err, res)
  }
})

// GET /preview/:token — serve draft landing data (no auth, token-gated)
publicRouter.get('/preview/:token', async (req: Request<{ token: string }>, res: Response) => {
  try {
    const landing = await getDraftByToken(req.params.token)
    res.json({ data: landing })
  } catch (err) {
    handleError(err, res)
  }
})
