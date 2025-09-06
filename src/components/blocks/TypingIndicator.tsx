'use client'

export default function TypingIndicator({ users }: { users: { email: string; isTyping: boolean }[] }) {
	const typingUsers = users.filter(user => user.isTyping)

	if (typingUsers.length === 0) return null

	const getTypingText = () => {
		if (typingUsers.length === 1) {
			return `${typingUsers[0].email} is typing`
		} else if (typingUsers.length === 2) {
			return `${typingUsers[0].email} and ${typingUsers[1].email} are typing`
		} else {
			return 'Several people are typing'
		}
	}

	return (
		<div className='flex items-end space-x-1 text-sm text-gray-500 italic'>
			<span>{getTypingText()}</span>
			<div className='flex space-x-0.5 pb-1'>
				<div className='w-1 h-1 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
				<div className='w-1 h-1 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
				<div className='w-1 h-1 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
			</div>
		</div>
	)
}
