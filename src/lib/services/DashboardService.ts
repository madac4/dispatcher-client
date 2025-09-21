import { apiRequest } from '@/middleware/errorHandler'
import { DashboardCard } from '@/types/dashboard.models'
import api from '../api'
import { ApiResponse } from '../models/response.model'

const baseURL = '/dashboard'

export const DashboardService = {
	async getDashboardCards(): Promise<ApiResponse<DashboardCard[]>> {
		return apiRequest<DashboardCard[]>(() =>
			api.post(`${baseURL}/cards`).then(res => res.data),
		)
	},
}
