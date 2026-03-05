import {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../lib/jwt.js'

describe('JWT utilities', () => {
  const accessPayload = { sub: 'user-1', email: 'test@example.com', role: 'EDITOR' }
  const refreshPayload = { sub: 'user-1', jti: 'token-record-id' }

  it('signs and verifies access token', () => {
    const token = signAccessToken(accessPayload)
    const decoded = verifyAccessToken(token)
    expect(decoded.sub).toBe(accessPayload.sub)
    expect(decoded.email).toBe(accessPayload.email)
    expect(decoded.role).toBe(accessPayload.role)
  })

  it('signs and verifies refresh token', () => {
    const token = signRefreshToken(refreshPayload)
    const decoded = verifyRefreshToken(token)
    expect(decoded.sub).toBe(refreshPayload.sub)
    expect(decoded.jti).toBe(refreshPayload.jti)
  })

  it('throws on invalid access token', () => {
    expect(() => verifyAccessToken('invalid.token.here')).toThrow()
  })

  it('throws on invalid refresh token', () => {
    expect(() => verifyRefreshToken('invalid.token.here')).toThrow()
  })
})
