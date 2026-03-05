import { Router, type IRouter, type Request, type Response } from 'express'
import { login, logout, refresh, AuthError } from '../services/auth.service.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, refreshSchema } from '../schemas/auth.schema.js'

export const authRouter: IRouter = Router()

// POST /api/auth/login
authRouter.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const result = await login(req.body)
    res.json({ data: result })
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({ error: err.message, statusCode: err.statusCode })
      return
    }
    throw err
  }
})

// POST /api/auth/refresh
authRouter.post('/refresh', validate(refreshSchema), async (req: Request, res: Response) => {
  try {
    const result = await refresh(req.body.refreshToken)
    res.json({ data: result })
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({ error: err.message, statusCode: err.statusCode })
      return
    }
    throw err
  }
})

// POST /api/auth/logout  (refreshToken optional — best-effort revocation)
authRouter.post('/logout', async (req: Request, res: Response) => {
  if (req.body?.refreshToken) {
    await logout(req.body.refreshToken).catch(() => {
      /* ignore */
    })
  }
  res.status(204).send()
})
