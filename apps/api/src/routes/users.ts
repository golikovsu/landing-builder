import { Router, type IRouter, type Request, type Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createUserSchema, updateUserSchema, paginationSchema } from '../schemas/user.schema.js'
import { hashPassword } from '../services/auth.service.js'

export const usersRouter: IRouter = Router()

// All user routes require ADMIN role
usersRouter.use(requireAuth, requireRole('ADMIN'))

type WithId = { id: string }

// Omit password from all responses
function sanitize(user: {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: Date
  updatedAt: Date
  password?: string
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _p, ...rest } = user
  return rest
}

// GET /api/users
usersRouter.get('/', validate(paginationSchema, 'query'), async (req: Request, res: Response) => {
  const { page, limit } = req.query as unknown as { page: number; limit: number }
  const skip = (page - 1) * limit

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.user.count(),
  ])

  res.json({
    data: users.map(sanitize),
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  })
})

// GET /api/users/:id
usersRouter.get('/:id', async (req: Request<WithId>, res: Response) => {
  const { id } = req.params
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    res.status(404).json({ error: 'Not Found', message: 'User not found', statusCode: 404 })
    return
  }
  res.json({ data: sanitize(user) })
})

// POST /api/users
usersRouter.post('/', validate(createUserSchema), async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body as {
    email: string
    password: string
    name?: string
    role: 'ADMIN' | 'EDITOR'
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409).json({ error: 'Conflict', message: 'Email already in use', statusCode: 409 })
    return
  }

  const hashed = await hashPassword(password)
  const user = await prisma.user.create({ data: { email, password: hashed, name, role } })
  res.status(201).json({ data: sanitize(user) })
})

// PATCH /api/users/:id
usersRouter.patch(
  '/:id',
  validate(updateUserSchema),
  async (req: Request<WithId>, res: Response) => {
    const { id } = req.params
    const { name, role, password } = req.body as {
      name?: string
      role?: 'ADMIN' | 'EDITOR'
      password?: string
    }

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ error: 'Not Found', message: 'User not found', statusCode: 404 })
      return
    }

    const data: { name?: string; role?: 'ADMIN' | 'EDITOR'; password?: string } = {}
    if (name !== undefined) data.name = name
    if (role !== undefined) data.role = role
    if (password !== undefined) data.password = await hashPassword(password)

    const user = await prisma.user.update({ where: { id }, data })
    res.json({ data: sanitize(user) })
  },
)

// DELETE /api/users/:id
usersRouter.delete('/:id', async (req: Request<WithId>, res: Response) => {
  const { id } = req.params

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    res.status(404).json({ error: 'Not Found', message: 'User not found', statusCode: 404 })
    return
  }

  if (req.user?.sub === id) {
    res
      .status(400)
      .json({ error: 'Bad Request', message: 'Cannot delete your own account', statusCode: 400 })
    return
  }

  await prisma.user.delete({ where: { id } })
  res.status(204).send()
})
