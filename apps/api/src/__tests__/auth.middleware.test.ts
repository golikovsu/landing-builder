import { jest } from '@jest/globals'
import type { Request, Response, NextFunction } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { signAccessToken } from '../lib/jwt.js'

function mockReqRes(headers: Record<string, string> = {}) {
  const req = { headers, user: undefined } as unknown as Request
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response
  const next = jest.fn() as unknown as NextFunction
  return { req, res, next }
}

describe('requireAuth middleware', () => {
  it('returns 401 when Authorization header is missing', () => {
    const { req, res, next } = mockReqRes()
    requireAuth(req, res, next)
    expect((res.status as jest.Mock).mock.calls[0]).toEqual([401])
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when token is invalid', () => {
    const { req, res, next } = mockReqRes({ authorization: 'Bearer bad.token.here' })
    requireAuth(req, res, next)
    expect((res.status as jest.Mock).mock.calls[0]).toEqual([401])
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next() and attaches user for a valid token', () => {
    const payload = { sub: 'user-1', email: 'test@example.com', role: 'EDITOR' }
    const token = signAccessToken(payload)
    const { req, res, next } = mockReqRes({ authorization: `Bearer ${token}` })
    requireAuth(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.user).toMatchObject(payload)
  })
})

describe('requireRole middleware', () => {
  it('returns 403 when user role is not allowed', () => {
    const payload = { sub: 'user-1', email: 'test@example.com', role: 'EDITOR' }
    const token = signAccessToken(payload)
    const { req, res, next } = mockReqRes({ authorization: `Bearer ${token}` })
    requireAuth(req, res, next)

    const res2 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response
    const next2 = jest.fn() as unknown as NextFunction
    requireRole('ADMIN')(req, res2, next2)
    expect((res2.status as jest.Mock).mock.calls[0]).toEqual([403])
    expect(next2).not.toHaveBeenCalled()
  })

  it('calls next() when user has required role', () => {
    const payload = { sub: 'user-1', email: 'admin@example.com', role: 'ADMIN' }
    const token = signAccessToken(payload)
    const { req, res, next } = mockReqRes({ authorization: `Bearer ${token}` })
    requireAuth(req, res, next)

    const next2 = jest.fn() as unknown as NextFunction
    requireRole('ADMIN')(req, res, next2)
    expect(next2).toHaveBeenCalled()
  })
})
