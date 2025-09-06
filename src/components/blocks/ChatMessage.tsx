'use client'

import { ChatMessage as ChatMessageType } from '@/lib/models/chat.model'
import { useAuthStore } from '@/lib/stores/authStore'
import { cn, formatChatTime } from '@/lib/utils'
import { Check, CheckCheck } from 'lucide-react'

export default function ChatMessage({ message }: { message: ChatMessageType }) {
	const { email } = useAuthStore()
	const isCurrentUser = message.user.email === email()

	const getStatusIcon = () => {
		if (!isCurrentUser) return null

		if (message.isRead) {
			return <CheckCheck className='w-4 h-4 text-blue-500' />
		} else {
			return <Check className='w-4 h-4 text-gray-400' />
		}
	}

	const getStatusText = () => {
		if (!isCurrentUser) return ''

		if (message.isRead) {
			return 'Read'
		} else {
			return 'Delivered'
		}
	}

	if (message.messageType === 'system') {
		return (
			<div className='flex justify-center my-2'>
				<div className='bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs text-center'>
					{message.message}
				</div>
			</div>
		)
	}

	return (
		<div
			className={cn(
				'flex',
				isCurrentUser ? 'justify-end' : 'justify-start',
			)}
		>
			<div
				className={cn(
					'max-w-[90%] rounded-lg p-2',
					isCurrentUser
						? 'bg-primary text-white'
						: 'bg-white border border-gray-200 text-gray-900',
				)}
			>
				<div className='flex items-center space-x-2 justify-between mb-2 text-sm '>
					<span className='font-medium'>
						{isCurrentUser ? 'You' : message.user.email}
					</span>
					<span className='opacity-75'>
						{formatChatTime(message.createdAt)}
					</span>
				</div>

				<p className='text-sm leading-normal break-words'>
					{message.message}
				</p>

				{isCurrentUser && (
					<div className='flex items-center justify-end space-x-1 mt-1'>
						{getStatusIcon()}
						<span className='text-xs opacity-75'>
							{getStatusText()}
						</span>
					</div>
				)}
			</div>
		</div>
	)
}
