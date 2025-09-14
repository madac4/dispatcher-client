import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function bytesToSize(bytes: number) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	if (bytes === 0) return '0 Byte'
	const i = Math.floor(Math.log(bytes) / Math.log(1024))
	return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}

export const formatChatTime = (date: string) => {
	const messageDate = new Date(date)
	const now = new Date()
	const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60))

	if (diffInMinutes < 1) return 'Just now'
	if (diffInMinutes < 60) return `${diffInMinutes}m ago`
	if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`

	return messageDate.toLocaleTimeString([], {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}
