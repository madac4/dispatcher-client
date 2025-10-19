'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { formatChatTime } from '@/lib/utils'
import { MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'

interface OrderChatProps {
	setMessages: (messages: string[]) => void
	messages: string[]
}

export default function OrderChatLocal({
	setMessages,
	messages,
}: OrderChatProps) {
	const [newMessage, setNewMessage] = useState('')

	const handleSendMessage = async () => {
		setMessages([...messages, newMessage])
		setNewMessage('')
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.ctrlKey) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<MessageCircle className='w-5 h-5 text-primary' />
					Order Chat
				</CardTitle>
			</CardHeader>

			<CardContent className='relative'>
				<div className='bg-gray-50 border rounded-lg p-3 max-h-[400px] overflow-y-auto space-y-4'>
					{messages.length === 0 ? (
						<div className='text-center py-8 text-gray-500'>
							<MessageCircle className='w-12 h-12 mx-auto mb-2 text-gray-300' />
							<p>No messages yet</p>
							<p className='text-sm'>Start the conversation!</p>
						</div>
					) : (
						<>
							{messages.map((message, index) => (
								<div key={index} className='flex justify-end'>
									<div className='max-w-[90%] rounded-lg p-2 bg-primary-700 text-white'>
										<div className='flex items-center space-x-2 justify-between mb-2 text-sm '>
											<span className='font-medium'>
												You
											</span>
											<span className='opacity-75'>
												{formatChatTime(
													new Date().toISOString(),
												)}
											</span>
										</div>

										<p className='text-sm leading-normal break-words'>
											{message}
										</p>

										<div className='flex items-center justify-end space-x-1 mt-1'>
											<span className='text-xs opacity-75'>
												Delivered
											</span>
										</div>
									</div>
								</div>
							))}
						</>
					)}
				</div>
			</CardContent>

			<CardFooter className='gap-3 flex-col'>
				<Textarea
					placeholder='Type your message here...'
					value={newMessage}
					onChange={e => setNewMessage(e.target.value)}
					onKeyUp={handleKeyPress}
					className='min-h-[80px] resize-none flex-1'
				/>
				<Button
					onClick={handleSendMessage}
					disabled={!newMessage.trim()}
					className='w-full'
				>
					<Send className='w-4 h-4' />
					Send
				</Button>
			</CardFooter>
		</Card>
	)
}
