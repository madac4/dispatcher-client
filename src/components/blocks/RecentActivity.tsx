'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ActivityType } from '@/types/dashboard.models'
import { format } from 'date-fns'
import {
	AlertCircle,
	Bell,
	Clock,
	MessageCircle,
	Package,
	UserRoundPlus,
} from 'lucide-react'

interface ActivityItem {
	id: string
	type: ActivityType
	title: string
	description: string
	timestamp: Date
	user: string
	status?: 'success' | 'warning' | 'info'
}

const mockActivities: ActivityItem[] = [
	{
		id: '1',
		type: ActivityType.ORDER_CREATED,
		title: 'New Order Created',
		description: 'Order #ORD-2024-001 from Los Angeles to Phoenix',
		timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
		user: 'John Smith',
		status: 'success',
	},
	{
		id: '2',
		type: ActivityType.NEW_MESSAGE,
		title: 'New Message',
		description: 'New message on order #ORD-2024-001',
		timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
		user: 'Mike Johnson',
		status: 'info',
	},
	{
		id: '3',
		type: ActivityType.ORDER_UPDATED,
		title: 'Order Updated',
		description: 'Order #ORD-2023-156 status changed to In Transit',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		user: 'Sarah Wilson',
		status: 'success',
	},
	{
		id: '4',
		type: ActivityType.USER_JOINED,
		title: 'New User Joined',
		description: 'New user registered with email test@test.com',
		timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
		user: 'Admin',
		status: 'info',
	},
	{
		id: '5',
		type: ActivityType.FILE_UPLOADED,
		title: 'File Uploaded',
		description: 'New file uploaded for order #ORD-2024-002',
		timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
		user: 'Tom Davis',
		status: 'success',
	},
	{
		id: '6',
		type: ActivityType.ORDER_UPDATED,
		title: 'Order Updated',
		description: 'Order #ORD-2024-002 status changed to In Transit',
		timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
		user: 'Lisa Chen',
		status: 'success',
	},
	{
		id: '7',
		type: ActivityType.ORDER_CREATED,
		title: 'New Order Created',
		description: 'Order #ORD-2024-001 from Los Angeles to Phoenix',
		timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
		user: 'John Smith',
		status: 'success',
	},
	{
		id: '8',
		type: ActivityType.NEW_MESSAGE,
		title: 'New Message',
		description: 'New message on order #ORD-2024-001',
		timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
		user: 'Mike Johnson',
		status: 'info',
	},
]

const getActivityIcon = (type: ActivityItem['type']) => {
	switch (type) {
		case ActivityType.ORDER_CREATED:
			return <Package className='h-4 w-4' />
		case ActivityType.NEW_MESSAGE:
			return <MessageCircle className='h-4 w-4' />
		case ActivityType.USER_JOINED:
			return <UserRoundPlus className='h-4 w-4' />
		case ActivityType.ORDER_UPDATED:
			return <AlertCircle className='h-4 w-4' />
		default:
			return <Bell className='h-4 w-4' />
	}
}

const getStatusColor = (status?: ActivityItem['status']) => {
	switch (status) {
		case 'success':
			return 'text-green-600'
		case 'warning':
			return 'text-yellow-600'
		case 'info':
			return 'text-blue-600'
		default:
			return 'text-gray-600'
	}
}

export function RecentActivity() {
	return (
		<Card className='relative overflow-hidden'>
			<div className='absolute top-0 left-0 w-full h-full bg-black/50 z-10'>
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center'>
					<h2 className='text-2xl font-bold'>
						Recent Activity is coming soon
					</h2>
					<p className='text-sm'>
						Recent Activity is coming soon for Admin user
					</p>
				</div>
			</div>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Clock className='h-5 w-5' />
					Recent Activity
				</CardTitle>
				<CardDescription>
					Latest updates and activities in your dispatch system
				</CardDescription>
			</CardHeader>

			<CardContent>
				{mockActivities.map(activity => (
					<div
						key={activity.id}
						className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'
					>
						<div
							className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${getStatusColor(
								activity.status,
							)}`}
						>
							{getActivityIcon(activity.type)}
						</div>
						<div className='flex-1 min-w-0'>
							<div className='flex items-center justify-between'>
								<h4 className='text-sm font-medium text-gray-900 truncate'>
									{activity.title} by {activity.user}
								</h4>
								<time className='text-xs text-gray-500 flex-shrink-0 ml-2'>
									{format(activity.timestamp, 'HH:mm')}
								</time>
							</div>
							<p className='text-sm text-gray-600 mt-1'>
								{activity.description}
							</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
