import 'dotenv/config'
import express, { type Application, type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { healthRouter } from './routes/health.js'
import { authRouter } from './routes/auth.js'
import { usersRouter } from './routes/users.js'
import { landingsRouter } from './routes/landings.js'
import { mediaRouter } from './routes/media.js'
import { publicRouter } from './routes/public.js'

const app: Application = express()
const PORT = process.env['PORT'] ?? 4000

// ── Middleware ──────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: process.env['CORS_ORIGIN']?.split(',') ?? 'http://localhost:3000',
    credentials: true,
  }),
)

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

// ── Routes ──────────────────────────────────────────
app.use('/api', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/landings', landingsRouter)
app.use('/api/media', mediaRouter)
app.use('/', publicRouter)

// ── 404 ────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', message: 'Route not found', statusCode: 404 })
})

// ── Error handler ───────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error', message: err.message, statusCode: 500 })
})

// ── Start ───────────────────────────────────────────
app.listen(PORT, () => {
  console.info(`🚀 API running on http://localhost:${PORT}`)
})

export default app
