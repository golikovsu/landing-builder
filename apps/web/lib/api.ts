'use client'

import axios from 'axios'

const api = axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000',
  withCredentials: true,
})

// ── Token helpers ──────────────────────────────────────────

export const tokenStorage = {
  getAccess: () => (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null),
  getRefresh: () => (typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null),
  set: (access: string, refresh?: string) => {
    localStorage.setItem('access_token', access)
    if (refresh) localStorage.setItem('refresh_token', refresh)
  },
  clear: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
}

// ── Request: attach Authorization header ──────────────────

api.interceptors.request.use(config => {
  const token = tokenStorage.getAccess()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Types ─────────────────────────────────────────────────

export type BlockType =
  | 'hero'
  | 'features'
  | 'media'
  | 'changelog'
  | 'cta_banner'
  | 'nav'
  | 'urgency_bar'
  | 'ticker'
  | 'stats_row'
  | 'how_it_works'
  | 'awards'
  | 'timeline'
  | 'video_demo'
  | 'before_after'
  | 'roadmap'
  | 'comparison'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'risk_reversal'
  | 'payment_partners'
  | 'email_capture'
  | 'sticky_bar'
  | 'auth_form'
export type LandingStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: string
}

export interface Block {
  id: string
  landingId: string
  type: BlockType
  order: number
  content: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Landing {
  id: string
  title: string
  slug: string
  status: LandingStatus
  previewToken: string
  publishedAt: string | null
  deletedAt: string | null
  createdById: string
  createdAt: string
  updatedAt: string
  blocks: Block[]
  // SEO
  seoTitle?: string | null
  seoDescription?: string | null
  seoImage?: string | null
  canonicalUrl?: string | null
}

export interface PaginatedLandings {
  landings: Landing[]
  total: number
  page: number
  limit: number
  pages: number
}

// ── 401 → refresh + retry ─────────────────────────────────

let isRefreshing = false
let refreshQueue: Array<() => void> = []

api.interceptors.response.use(
  r => r,
  async error => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = tokenStorage.getRefresh()
      if (!refreshToken) return Promise.reject(error)

      if (isRefreshing) {
        return new Promise(resolve => {
          refreshQueue.push(() => resolve(api(original)))
        })
      }
      isRefreshing = true
      try {
        const res = await api.post<{ data: { accessToken: string; user: AuthUser } }>(
          '/api/auth/refresh',
          { refreshToken },
        )
        tokenStorage.set(res.data.data.accessToken)
        refreshQueue.forEach(cb => cb())
        refreshQueue = []
        return api(original)
      } catch {
        tokenStorage.clear()
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

// ── Auth ──────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ data: { accessToken: string; refreshToken: string; user: AuthUser } }>(
      '/api/auth/login',
      { email, password },
    ),
  logout: (refreshToken?: string) =>
    api.post('/api/auth/logout', refreshToken ? { refreshToken } : {}),
  refresh: (refreshToken: string) =>
    api.post<{ data: { accessToken: string; user: AuthUser } }>('/api/auth/refresh', {
      refreshToken,
    }),
}

// ── Landings ──────────────────────────────────────────────

export type LandingUpdateData = Partial<{
  title: string
  slug: string
  status: LandingStatus
  seoTitle: string
  seoDescription: string
  seoImage: string
  canonicalUrl: string
}>

export const landingsApi = {
  list: (params?: { page?: number; limit?: number; status?: LandingStatus }) =>
    api.get<{ data: PaginatedLandings }>('/api/landings', { params }),

  get: (id: string) => api.get<{ data: Landing }>(`/api/landings/${id}`),

  create: (data: { title: string; slug: string }) =>
    api.post<{ data: Landing }>('/api/landings', data),

  update: (id: string, data: LandingUpdateData) =>
    api.patch<{ data: Landing }>(`/api/landings/${id}`, data),

  delete: (id: string) => api.delete(`/api/landings/${id}`),

  publish: (id: string) => api.post<{ data: Landing }>(`/api/landings/${id}/publish`),

  unpublish: (id: string) => api.post<{ data: Landing }>(`/api/landings/${id}/unpublish`),

  versions: (id: string) => api.get<{ data: unknown[] }>(`/api/landings/${id}/versions`),
}

// ── Blocks ────────────────────────────────────────────────

export const blocksApi = {
  add: (
    landingId: string,
    data: { type: BlockType; order?: number; content?: Record<string, unknown> },
  ) => api.post<{ data: Block }>(`/api/landings/${landingId}/blocks`, data),

  update: (landingId: string, blockId: string, content: Record<string, unknown>) =>
    api.patch<{ data: Block }>(`/api/landings/${landingId}/blocks/${blockId}`, { content }),

  delete: (landingId: string, blockId: string) =>
    api.delete(`/api/landings/${landingId}/blocks/${blockId}`),

  reorder: (landingId: string, ids: string[]) =>
    api.patch<{ data: Block[] }>(`/api/landings/${landingId}/blocks/reorder`, { ids }),
}

// ── Media ─────────────────────────────────────────────────

export const mediaApi = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<{ data: { url: string; filename: string; size: number; mimetype: string } }>(
      '/api/media/upload',
      form,
    )
  },
}

export default api
