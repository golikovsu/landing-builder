import { jest } from '@jest/globals'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate.js'

function mockReqRes(body: unknown = {}) {
  const req = { body, query: {}, params: {} } as unknown as Request
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response
  const next = jest.fn() as unknown as NextFunction
  return { req, res, next }
}

const schema = z.object({
  email: z.string().email(),
  age: z.coerce.number().min(0),
})

describe('validate middleware', () => {
  it('calls next() and replaces body with parsed data on success', () => {
    const { req, res, next } = mockReqRes({ email: 'test@example.com', age: '25' })
    validate(schema)(req, res, next)
    expect(next).toHaveBeenCalled()
    expect((req.body as { age: number }).age).toBe(25) // coerced to number
  })

  it('returns 400 with errors array on validation failure', () => {
    const { req, res, next } = mockReqRes({ email: 'not-an-email', age: -1 })
    validate(schema)(req, res, next)
    expect((res.status as jest.Mock).mock.calls[0]).toEqual([400])
    const jsonCall = (res.json as jest.Mock).mock.calls[0] as [{ errors: { field: string }[] }]
    expect(jsonCall[0].errors).toBeInstanceOf(Array)
    expect(next).not.toHaveBeenCalled()
  })
})
