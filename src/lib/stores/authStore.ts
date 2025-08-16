import { create } from 'zustand'
import { getAccessToken, getRefreshToken, removeTokens, setAccessToken, setRefreshToken } from '../cookies'
import { logout } from '../services/authService'

interface AuthState {
  role: 'admin' | 'user' | null
  userId: string | null
  isAuthenticated: () => boolean
  setUser: (accessToken: string, refreshToken: string) => void
  accessToken: () => string | null
  refreshToken: () => string | null
  getTokens: () => { accessToken: string | null; refreshToken: string | null }
  logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  role: null,
  userId: null,
  isAuthenticated: () => getAccessToken() && getRefreshToken(),
  accessToken: () => getAccessToken() || null,
  refreshToken: () => getRefreshToken() || null,
  setUser: (accessToken, refreshToken) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    set({ userId: payload.userId, role: payload.role })
  },
  getTokens: () => ({
    accessToken: getAccessToken() || null,
    refreshToken: getRefreshToken() || null,
  }),
  logout: async () => {
    await logout()
    removeTokens()
    set({ role: null, userId: null })
    window.location.href = '/'
  },
}))
