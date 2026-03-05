import { Router, type IRouter } from 'express'

export const healthRouter: IRouter = Router()

healthRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env['NODE_ENV'] ?? 'development',
  })
})
