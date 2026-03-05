import type { Request, Response, NextFunction } from 'express'
import type { ZodError } from 'zod'
import { type ZodSchema } from 'zod'

type Target = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }))
      res.status(400).json({ error: 'Validation Error', statusCode: 400, errors })
      return
    }
    // Replace the raw input with the parsed (and coerced) value.
    // req.query is a read-only getter in Express 5 — use defineProperty to shadow it.
    if (target === 'query') {
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        configurable: true,
      })
    } else {
      req[target] = result.data
    }
    next()
  }
}

export function formatZodError(err: ZodError) {
  return err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
}
