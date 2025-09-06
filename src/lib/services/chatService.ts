import { apiRequest, apiRequestPaginated } from '@/middleware/errorHandler'
import api from '../api'
import { ChatMessage } from '../models/chat.model'
import { ApiResponse, PaginationResponse } from '../models/response.model'

class ChatService {
	private baseUrl = '/chat'

	async sendMessage(message: string, orderId: string): Promise<ApiResponse<ChatMessage>> {
		return apiRequest<ChatMessage>(() =>
			api
				.post(`${this.baseUrl}/messages`, {
					message,
					orderId,
				})
				.then(res => res.data),
		)
	}

	async getUnreadCount(orderId: string): Promise<ApiResponse<{ count: number }>> {
		return apiRequest<{ count: number }>(() =>
			api.get(`${this.baseUrl}/orders/${orderId}/unread-count`, {}).then(res => res.data),
		)
	}

	async getOrderMessages(orderId: string): Promise<PaginationResponse<ChatMessage>> {
		return apiRequestPaginated<ChatMessage>(() =>
			api
				.get(`${this.baseUrl}/orders/${orderId}/messages`, {
					params: {
						orderId,
					},
				})
				.then(res => res.data),
		)
	}

	// Mark messages as read
	// async markAsRead(orderId: string, token: string): Promise<void> {
	// 	return this.request<void>(`/chat/orders/${orderId}/read`, {
	// 		method: 'PATCH',
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	})
	// }

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

export const chatService = new ChatService()
