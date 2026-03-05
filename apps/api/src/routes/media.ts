import { Router, type IRouter, type Request, type Response } from 'express'
import multer from 'multer'
import path from 'node:path'
import { requireAuth } from '../middleware/auth.js'

export const mediaRouter: IRouter = Router()
mediaRouter.use(requireAuth)

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
])

const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`))
    }
  },
})

// POST /api/media/upload
mediaRouter.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  const file = req.file
  if (!file) {
    res.status(400).json({ error: 'No file uploaded', statusCode: 400 })
    return
  }

  // ── S3 / Cloudflare R2 upload ─────────────────────────
  // In production, replace this section with the actual S3 SDK call:
  //
  //   const s3 = new S3Client({ ... })
  //   const key = `uploads/${Date.now()}-${sanitize(file.originalname)}`
  //   await s3.send(new PutObjectCommand({
  //     Bucket: process.env['S3_BUCKET'],
  //     Key: key,
  //     Body: file.buffer,
  //     ContentType: file.mimetype,
  //   }))
  //   const cdnUrl = `${process.env['CDN_URL']}/${key}`
  //
  // For now, return a placeholder CDN URL so the API is testable without cloud storage.
  const ext = path.extname(file.originalname)
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const cdnUrl = `${process.env['CDN_URL'] ?? 'https://cdn.example.com'}/uploads/${filename}`

  res.status(201).json({
    data: {
      url: cdnUrl,
      filename,
      size: file.size,
      mimeType: file.mimetype,
    },
  })
})
