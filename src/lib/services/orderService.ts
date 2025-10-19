import { apiRequest, apiRequestPaginated } from '@/middleware/errorHandler'
import api from '../api'
import {
	OrderDTO,
	OrderPayload,
	OrderStatus,
	OrderStatusDTO,
	OrderStatusType,
	PaginatedOrderDTO,
} from '../models/order.model'
import {
	ApiResponse,
	PaginationResponse,
	RequestModel,
} from '../models/response.model'

const baseURL = '/orders'

export const OrderService = {
	async updateOrderStatus(orderId: string, status: OrderStatus) {
		return apiRequest<null>(() =>
			api
				.put(`${baseURL}/${orderId}/status`, { status })
				.then(res => res.data),
		)
	},

	async downloadOrderFile(orderId: string, filename: string) {
		try {
			const response = await api.get(
				`${baseURL}/${orderId}/files/${filename}`,
				{
					responseType: 'blob',
				},
			)
			const url = window.URL.createObjectURL(new Blob([response.data]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', filename)
			document.body.appendChild(link)
			link.click()

			link.parentNode?.removeChild(link)
			window.URL.revokeObjectURL(url)

			return { data: null, message: 'File downloaded successfully' }
		} catch (error) {
			console.error('Download error:', error)
			throw error
		}
	},

	async moderateOrder(orderId: string) {
		return apiRequest<OrderDTO>(() =>
			api.post(`${baseURL}/${orderId}/moderate`).then(res => res.data),
		)
	},

	async uploadOrderFile(orderId: string, file: File) {
		const formData = new FormData()
		formData.append('file', file)

		console.log(file)

		return apiRequest<null>(() =>
			api
				.post(`${baseURL}/${orderId}/files`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
				.then(res => res.data),
		)
	},
}

export const createOrder = async (
	data: OrderPayload,
): Promise<ApiResponse<null>> => {
	if (data.files && data.files.length > 0) {
		const formData = new FormData()

		Object.entries(data).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				if (
					Array.isArray(value) ||
					(typeof value === 'object' && value !== null)
				) {
					formData.append(key, JSON.stringify(value))
				} else {
					formData.append(key, value as string | Blob)
				}
			}
		})

		data.files.forEach(file => {
			formData.append('files', file)
		})

		return apiRequest<null>(() =>
			api
				.post(`${baseURL}/create`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
				.then(res => res.data),
		)
	}

	return apiRequest<null>(() =>
		api.post(`${baseURL}/create`, data).then(res => res.data),
	)
}

export const getOrders = async (
	payload: RequestModel,
): Promise<PaginationResponse<PaginatedOrderDTO>> => {
	return apiRequestPaginated<PaginatedOrderDTO>(() =>
		api
			.get(`${baseURL}/paginated`, { params: { ...payload } })
			.then(res => res.data),
	)
}

export const getOrderStatuses = async (
	type: OrderStatusType,
): Promise<ApiResponse<OrderStatusDTO[]>> => {
	return apiRequest<OrderStatusDTO[]>(() =>
		api.get(`${baseURL}/statuses/${type}`).then(res => res.data),
	)
}

export const getOrderByNumber = async (
	orderNumber: string,
): Promise<ApiResponse<OrderDTO>> => {
	return apiRequest<OrderDTO>(() =>
		api.get(`${baseURL}/${orderNumber}`).then(res => res.data),
	)
}
