import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshTokenExpiresAt,
} from '../lib/jwt.js'
import type { LoginInput } from '../schemas/auth.schema.js'

const SALT_ROUNDS = 12

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401,
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export async function login(input: LoginInput): Promise<TokenPair> {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw new AuthError('Invalid email or password')

  const valid = await bcrypt.compare(input.password, user.password)
  if (!valid) throw new AuthError('Invalid email or password')

  // Create a refresh token record in DB
  const record = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: 'placeholder', // will be updated below
      expiresAt: refreshTokenExpiresAt(),
    },
  })

  const refreshToken = signRefreshToken({ sub: user.id, jti: record.id })
  // Store the actual signed token (for lookup on refresh)
  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { token: refreshToken },
  })

  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role })

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  }
}

export async function refresh(token: string): Promise<{ accessToken: string; user: AuthUser }> {
  let payload
  try {
    payload = verifyRefreshToken(token)
  } catch {
    throw new AuthError('Invalid or expired refresh token')
  }

  const record = await prisma.refreshToken.findUnique({ where: { token } })
  if (!record || record.expiresAt < new Date()) {
    throw new AuthError('Refresh token revoked or expired')
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user) throw new AuthError('User not found')

  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role })
  return { accessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
}

export async function logout(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { token } })
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}
