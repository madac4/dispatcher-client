import { ChatMessage } from '@/lib/models/chat.model'
import { chatService } from '@/lib/services/chatService'
import { useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

export interface TypingUser {
	email: string
	isTyping: boolean
}

export interface ChatState {
	messages: ChatMessage[]
	typingUsers: TypingUser[]
	isConnected: boolean
	unreadCount: number
	isLoading: boolean
	error: string | null
}

export const useChat = (token: string, orderId: string) => {
	const [state, setState] = useState<ChatState>({
		messages: [],
		typingUsers: [],
		isConnected: false,
		unreadCount: 0,
		isLoading: true,
		error: null,
	})

	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const socketRef = useRef<Socket | null>(null)

	const loadMessages = useCallback(async () => {
		if (!orderId) return

		try {
			setState(prev => ({ ...prev, isLoading: true, error: null }))

			const { data } = await chatService.getOrderMessages(orderId)

			setState(prev => ({
				...prev,
				messages: data.map((msg: ChatMessage) => ({
					...msg,
				})),
				isLoading: false,
			}))
		} catch (error) {
			setState(prev => ({
				...prev,
				error: error instanceof Error ? error.message : 'Failed to load messages',
				isLoading: false,
			}))
		}
	}, [orderId])

	const stopTyping = useCallback(() => {
		if (!socketRef.current || !orderId) return

		socketRef.current.emit('typing-stop', orderId)

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current)
			typingTimeoutRef.current = null
		}
	}, [orderId])

	const sendMessage = useCallback(
		async (message: string) => {
			if (!message.trim() || !socketRef.current || !orderId) return

			await chatService.sendMessage(message.trim(), orderId)
			socketRef.current.emit('mark-read', orderId)
		},
		[orderId],
	)

	const startTyping = useCallback(() => {
		if (!socketRef.current || !orderId) return

		socketRef.current.emit('typing-start', orderId)

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current)
		}

		typingTimeoutRef.current = setTimeout(() => {
			stopTyping()
		}, 3000)
	}, [orderId, stopTyping])

	const getUnreadCount = useCallback(async () => {
		if (!orderId) return

		const { data } = await chatService.getUnreadCount(orderId)
		setState(prev => ({ ...prev, unreadCount: data?.count || 0 }))
	}, [orderId])

	useEffect(() => {
		if (!token || !orderId) {
			toast.warning('Chat is not initialized')
			return
		}

		const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
			auth: { token },
			transports: ['websocket', 'polling'],
		})

		socketRef.current = socket

		socket.on('connect', () => {
			setState(prev => ({ ...prev, isConnected: true, error: null }))
			socket.emit('join-order-room', orderId)
		})

		socket.on('disconnect', () => {
			console.log('useChat: Socket disconnected')
			setState(prev => ({ ...prev, isConnected: false }))
		})

		socket.on('connect_error', error => {
			console.error('useChat: Socket connection error', error)
			setState(prev => ({
				...prev,
				isConnected: false,
				error: 'Connection failed. Please check your connection.',
			}))
		})

		socket.on('new-message', (data: { orderId: string; message: ChatMessage }) => {
			if (data.orderId === orderId) {
				setState(prev => ({
					...prev,
					messages: [...prev.messages, data.message],
					unreadCount: prev.unreadCount + 1,
				}))
			}
		})

		socket.on('user-typing', (data: { email: string; orderId: string; isTyping: boolean }) => {
			if (data.orderId === orderId) {
				setState(prev => {
					const existingUser = prev.typingUsers.find(user => user.email === data.email)

					if (existingUser) {
						if (data.isTyping) {
							return {
								...prev,
								typingUsers: prev.typingUsers.map(user =>
									user.email === data.email ? { ...user, isTyping: true } : user,
								),
							}
						} else {
							return {
								...prev,
								typingUsers: prev.typingUsers.filter(user => user.email !== data.email),
							}
						}
					} else if (data.isTyping) {
						return {
							...prev,
							typingUsers: [
								...prev.typingUsers,
								{
									userId: data.email,
									email: data.email,
									isTyping: true,
								},
							],
						}
					}

					return prev
				})
			}
		})

		socket.on('message-read', (data: { userId: string; orderId: string; timestamp: Date }) => {
			if (data.orderId === orderId) {
				setState(prev => ({
					...prev,
					messages: prev.messages.map(msg => ({
						...msg,
						isRead: true,
					})),
					unreadCount: 0,
				}))
			}
		})

		// socket.on('order-updated', (data: { orderId: string; update: any; timestamp: Date }) => {
		// 	if (data.orderId === orderId) {
		// 		const systemMessage: ChatMessage = {
		// 			id: `system-${Date.now()}`,
		// 			orderId,
		// 			user: {
		// 				id: 'system',
		// 				email: 'system',
		// 			},
		// 			message: `Order updated: ${data.update.status || 'Status changed'}`,
		// 			messageType: 'system',
		// 			senderType: 'system',
		// 			createdAt: new Date(data.timestamp).toISOString(),
		// 			updatedAt: new Date(data.timestamp).toISOString(),
		// 			isRead: false,
		// 		}

		// 		setState(prev => ({
		// 			...prev,
		// 			messages: [...prev.messages, systemMessage],
		// 		}))
		// 	}
		// })

		loadMessages()

		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current)
			}
			socket.disconnect()
		}
	}, [token, orderId, loadMessages])

	useEffect(() => {
		if (token && orderId) getUnreadCount()
	}, [token, orderId, getUnreadCount])

	// Mark messages as read
	// const markAsRead = useCallback(async () => {
	// 	if (!socketRef.current || !orderId) return

	// 	try {
	// 		await chatService.markAsRead(orderId, token)
	// 		socketRef.current.emit('mark-read', orderId)

	// 		setState(prev => ({
	// 			...prev,
	// 			unreadCount: 0,
	// 			messages: prev.messages.map(msg => ({ ...msg, isRead: true })),
	// 		}))
	// 	} catch (error) {
	// 		console.error('Failed to mark messages as read:', error)
	// 	}
	// }, [token, orderId])

	return {
		...state,
		sendMessage,
		startTyping,
		stopTyping,
		// markAsRead,
		getUnreadCount,
		loadMessages,
	}
}
