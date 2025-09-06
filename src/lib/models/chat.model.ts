export type ChatMessage = {
	id: string
	orderId: string
	user: {
		id: string
		email: string
	}
	message: string
	messageType: 'text' | 'system'
	senderType: 'user' | 'admin' | 'system'
	isRead: boolean
	createdAt: string
	updatedAt: string
}
