import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env['JWT_SECRET'] ?? 'dev-access-secret-change-in-prod'
const REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] ?? 'dev-refresh-secret-change-in-prod'

const ACCESS_TTL = '15m'
const REFRESH_TTL = '7d'
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000

export interface AccessTokenPayload {
  sub: string // userId
  email: string
  role: string
}

export interface RefreshTokenPayload {
  sub: string // userId
  jti: string // refresh token DB id
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL })
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL })
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload
}

export function refreshTokenExpiresAt(): Date {
  return new Date(Date.now() + REFRESH_TTL_MS)
}
