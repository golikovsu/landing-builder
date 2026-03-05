'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, tokenStorage, type AuthUser } from '../lib/api'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session from stored refresh token on mount
  useEffect(() => {
    const storedRefresh = tokenStorage.getRefresh()
    if (!storedRefresh) {
      setLoading(false)
      return
    }
    authApi
      .refresh(storedRefresh)
      .then(res => {
        tokenStorage.set(res.data.data.accessToken)
        setUser(res.data.data.user)
      })
      .catch(() => {
        tokenStorage.clear()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    const { accessToken, refreshToken, user: authUser } = res.data.data
    tokenStorage.set(accessToken, refreshToken)
    setUser(authUser)
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefresh() ?? undefined
    await authApi.logout(refreshToken).catch(() => {
      /* ignore */
    })
    tokenStorage.clear()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
