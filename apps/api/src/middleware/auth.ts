import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, type AccessTokenPayload } from '../lib/jwt.js'

// Extend Express Request to carry the authenticated user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessTokenPayload
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers['authorization']
  if (!header?.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ error: 'Unauthorized', message: 'Missing bearer token', statusCode: 401 })
    return
  }

  const token = header.slice(7)
  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    res
      .status(401)
      .json({ error: 'Unauthorized', message: 'Invalid or expired token', statusCode: 401 })
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated', statusCode: 401 })
      return
    }
    if (!roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ error: 'Forbidden', message: 'Insufficient permissions', statusCode: 403 })
      return
    }
    next()
  }
}
