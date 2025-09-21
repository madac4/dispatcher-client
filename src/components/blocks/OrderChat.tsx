'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useChat } from '@/hooks/useChat'
import { useAuthStore } from '@/lib/stores/authStore'
import {
	AlertCircle,
	Loader2,
	MessageCircle,
	Send,
	Wifi,
	WifiOff,
} from 'lucide-react'
import { useState } from 'react'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'

interface OrderChatProps {
	orderId: string
}

export default function OrderChat({ orderId }: OrderChatProps) {
	const { accessToken } = useAuthStore()
	const [newMessage, setNewMessage] = useState('')
	const [isSending, setIsSending] = useState(false)

	const {
		messages,
		typingUsers,
		isConnected,
		isLoading,
		error,
		sendMessage,
		startTyping,
		stopTyping,
	} = useChat(accessToken() || '', orderId)

	const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewMessage(e.target.value)
		startTyping()
	}

	const handleTypingStop = () => stopTyping()

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return

		setIsSending(true)
		try {
			await sendMessage(newMessage.trim())

			setNewMessage('')
			stopTyping()
		} finally {
			setIsSending(false)
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.ctrlKey) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	const getConnectionStatus = () => {
		if (isLoading) {
			return (
				<div className='flex items-center space-x-2 text-yellow-600'>
					<Loader2 className='w-4 h-4 animate-spin' />
					<span className='text-sm'>Connecting...</span>
				</div>
			)
		}

		if (!isConnected) {
			return (
				<div className='flex items-center space-x-2 text-red-600'>
					<WifiOff className='w-4 h-4' />
					<span className='text-sm'>Disconnected</span>
				</div>
			)
		}

		return (
			<div className='flex items-center space-x-2 text-green-600'>
				<Wifi className='w-4 h-4' />
				<span className='text-sm'>Connected</span>
			</div>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<MessageCircle className='w-5 h-5 text-orange-500' />
						Order Chat
					</div>
					{getConnectionStatus()}
				</CardTitle>
			</CardHeader>

			<CardContent className='relative'>
				{error && (
					<Alert className='mb-4'>
						<AlertCircle className='h-4 w-4' />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className='bg-gray-50 border rounded-lg p-3 max-h-[400px] overflow-y-auto space-y-4'>
					{isLoading ? (
						<div className='flex items-center justify-center py-8'>
							<Loader2 className='w-6 h-6 animate-spin text-gray-400' />
							<span className='ml-2 text-gray-500'>
								Loading messages...
							</span>
						</div>
					) : messages.length === 0 ? (
						<div className='text-center py-8 text-gray-500'>
							<MessageCircle className='w-12 h-12 mx-auto mb-2 text-gray-300' />
							<p>No messages yet</p>
							<p className='text-sm'>Start the conversation!</p>
						</div>
					) : (
						<>
							{messages.map(message => (
								<ChatMessage
									key={message.id}
									message={message}
								/>
							))}
						</>
					)}

					<TypingIndicator users={typingUsers} />
				</div>
			</CardContent>

			<CardFooter className='gap-3 flex-col'>
				<Textarea
					placeholder='Type your message here...'
					value={newMessage}
					onChange={handleTyping}
					onBlur={handleTypingStop}
					onKeyUp={handleKeyPress}
					className='min-h-[80px] resize-none flex-1'
					disabled={isLoading || !isConnected || isSending}
				/>
				<Button
					onClick={handleSendMessage}
					disabled={
						!newMessage.trim() ||
						isLoading ||
						!isConnected ||
						isSending
					}
					className='w-full'
				>
					{isSending ? (
						<Loader2 className='w-4 h-4 animate-spin' />
					) : (
						<Send className='w-4 h-4' />
					)}
					{isSending ? 'Sending...' : 'Send'}
				</Button>

				{!isConnected && (
					<div className='text-xs text-destructive text-center'>
						You&apos;re currently offline. Messages will be sent
						when you reconnect.
					</div>
				)}
			</CardFooter>
		</Card>
	)
}
