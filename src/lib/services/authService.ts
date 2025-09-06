import { apiRequest } from '@/middleware/errorHandler'
import api from '../api'
import { LoginResponse } from '../models/auth.model'
import { ApiResponse } from '../models/response.model'

const baseURL = '/authorization'

export const AuthService = {
	async register(email: string, password: string) {
		return apiRequest<void>(() =>
			api.post(`${baseURL}/register`, { email, password }).then(res => res.data),
		)
	},
}

export const login = async (data: {
	email: string
	password: string
}): Promise<ApiResponse<LoginResponse>> => {
	return apiRequest<LoginResponse>(() => api.post(`${baseURL}/login`, data).then(res => res.data))
}

export const logout = async (): Promise<ApiResponse<null>> => {
	return apiRequest<null>(() => api.post(`${baseURL}/logout`).then(res => res.data))
}

export const forgotPassword = async (data: { email: string }): Promise<ApiResponse<null>> => {
	return apiRequest<null>(() =>
		api.post(`${baseURL}/forgot-password`, data).then(res => res.data),
	)
}

export const updatePassword = async (data: {
	currentPassword: string
	password: string
	confirmPassword: string
}): Promise<ApiResponse<null>> => {
	return apiRequest<null>(() =>
		api.post(`${baseURL}/update-password`, data).then(res => res.data),
	)
}

export const resetPassword = async (data: {
	token: string
	password: string
	confirmPassword: string
}): Promise<ApiResponse<null>> => {
	return apiRequest<null>(() => api.post(`${baseURL}/reset-password`, data).then(res => res.data))
}

export const createInvitation = async (data: { email: string; role: 'admin' | 'user' }) => {
	return apiRequest<void>(() => api.post(`${baseURL}/invite`, data).then(res => res.data))
}
