import { apiRequest, apiRequestPaginated } from '@/middleware/errorHandler'
import api from '../api'
import { ChatMessage } from '../models/chat.model'
import { ApiResponse, PaginationResponse } from '../models/response.model'

const baseUrl = '/chat'

export const ChatService = {
	async sendMessage(
		message: string,
		orderId: string,
	): Promise<ApiResponse<ChatMessage>> {
		return apiRequest<ChatMessage>(() =>
			api
				.post(`${baseUrl}/messages`, {
					message,
					orderId,
				})
				.then(res => res.data),
		)
	},

	async getOrderMessages(
		orderId: string,
	): Promise<PaginationResponse<ChatMessage>> {
		return apiRequestPaginated<ChatMessage>(() =>
			api
				.get(`${baseUrl}/orders/${orderId}/messages`, {
					params: {
						orderId,
					},
				})
				.then(res => res.data),
		)
	},

	// async deleteMessage(messageId: string, token: string): Promise<void> {
	// 	return this.request<void>(`/chat/messages/${messageId}`, {
	// 		method: 'DELETE',
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	})
	// }

	// async searchMessages(orderId: string, query: string, token: string): Promise<{ messages: ChatMessage[] }> {
	// 	return this.request<{ messages: ChatMessage[] }>(
	// 		`/chat/orders/${orderId}/search?q=${encodeURIComponent(query)}`,
	// 		{
	// 			headers: {
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 		},
	// 	)
	// }
}
