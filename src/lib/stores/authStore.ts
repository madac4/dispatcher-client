import { create } from 'zustand'
import {
	getAccessToken,
	getEmail,
	getRefreshToken,
	getRole,
	removeTokens,
	setAccessToken,
	setEmail,
	setRefreshToken,
	setRole,
} from '../cookies'
import { UserRole } from '../models/auth.model'
import { logout } from '../services/authService'

interface AuthState {
	userId: string | null
	isAuthenticated: () => boolean
	email: () => string | null
	setUser: (accessToken: string, refreshToken: string) => void
	accessToken: () => string | null
	refreshToken: () => string | null
	getTokens: () => { accessToken: string | null; refreshToken: string | null }
	role: () => UserRole | null
	logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
	userId: null,
	email: () => getEmail() || null,
	role: () => getRole() || null,
	isAuthenticated: () => getAccessToken() && getRefreshToken(),
	accessToken: () => getAccessToken() || null,
	refreshToken: () => getRefreshToken() || null,
	setUser: (accessToken, refreshToken) => {
		setAccessToken(accessToken)
		setRefreshToken(refreshToken)

		const payload = JSON.parse(atob(accessToken.split('.')[1]))
		setRole(payload.role)
		setEmail(payload.email)
		set({
			userId: payload.userId,
			role: payload.role,
			email: payload.email,
		})
	},
	getTokens: () => ({
		accessToken: getAccessToken() || null,
		refreshToken: getRefreshToken() || null,
	}),
	logout: async () => {
		await logout()
		removeTokens()
		set({ role: undefined, userId: undefined })
		window.location.href = '/'
	},
}))
