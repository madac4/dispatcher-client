'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Mail,
	MapPin,
	MoreHorizontal,
	Phone,
	Search,
	UserCheck,
	Users,
	UserX,
} from 'lucide-react'
import { useState } from 'react'

interface User {
	id: string
	name: string
	email: string
	role: 'client' | 'moderator'
	status: 'active' | 'inactive' | 'pending'
	phone?: string
	location?: string
	avatar?: string
}

const mockUsers: User[] = [
	{
		id: '1',
		name: 'John Smith',
		email: 'john.smith@dispatch.com',
		role: 'client',
		status: 'active',
		phone: '+1 (555) 123-4567',
		location: 'Los Angeles, CA',
		avatar: 'JS',
	},
	{
		id: '2',
		name: 'Sarah Wilson',
		email: 'sarah.wilson@dispatch.com',
		role: 'moderator',
		status: 'active',
		phone: '+1 (555) 234-5678',
		location: 'Phoenix, AZ',
		avatar: 'SW',
	},
	{
		id: '3',
		name: 'Mike Johnson',
		email: 'mike.johnson@dispatch.com',
		role: 'client',
		status: 'active',
		phone: '+1 (555) 345-6789',
		location: 'Dallas, TX',
		avatar: 'MJ',
	},
	{
		id: '4',
		name: 'Lisa Chen',
		email: 'lisa.chen@dispatch.com',
		role: 'client',
		status: 'active',
		phone: '+1 (555) 456-7890',
		location: 'Seattle, WA',
		avatar: 'LC',
	},
	{
		id: '5',
		name: 'Tom Davis',
		email: 'tom.davis@dispatch.com',
		role: 'client',
		status: 'inactive',
		phone: '+1 (555) 567-8901',
		location: 'Denver, CO',
		avatar: 'TD',
	},
	{
		id: '6',
		name: 'Alex Brown',
		email: 'alex.brown@dispatch.com',
		role: 'client',
		status: 'pending',
		phone: '+1 (555) 678-9012',
		location: 'Miami, FL',
		avatar: 'AB',
	},
]

const getRoleColor = (role: User['role']) => {
	switch (role) {
		case 'moderator':
			return 'bg-blue-100 text-blue-800'
		case 'client':
			return 'bg-purple-100 text-purple-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

const getStatusColor = (status: User['status']) => {
	switch (status) {
		case 'active':
			return 'bg-green-100 text-green-800'
		case 'inactive':
			return 'bg-gray-100 text-gray-800'
		case 'pending':
			return 'bg-yellow-100 text-yellow-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

const getStatusIcon = (status: User['status']) => {
	switch (status) {
		case 'active':
			return <UserCheck className='h-3 w-3' />
		case 'inactive':
			return <UserX className='h-3 w-3' />
		case 'pending':
			return <Users className='h-3 w-3' />
		default:
			return <Users className='h-3 w-3' />
	}
}

export function UsersList() {
	const [searchTerm, setSearchTerm] = useState('')

	const filteredUsers = mockUsers.filter(
		user =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.role.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<Card className='relative overflow-hidden'>
			<div className='absolute top-0 left-0 w-full h-full bg-black/50 z-10'>
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center'>
					<h2 className='text-2xl font-bold'>
						Team Members is coming soon
					</h2>
					<p className='text-sm'>
						Team Members is coming soon for Admin user
					</p>
				</div>
			</div>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Users className='h-5 w-5' />
					Team Members
				</CardTitle>
				<CardDescription>
					Manage your dispatch team and user permissions
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
					<Input
						placeholder='Search users...'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className='pl-10'
					/>
				</div>

				<div>
					{filteredUsers.map(user => (
						<div
							key={user.id}
							className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'
						>
							<div className='flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm'>
								{user.avatar}
							</div>
							<div className='flex-1 min-w-0'>
								<div className='flex items-center justify-between'>
									<h4 className='text-sm font-medium text-gray-900 truncate'>
										{user.name}
									</h4>
									<div className='flex items-center gap-2'>
										<Badge
											className={`text-xs ${getRoleColor(
												user.role,
											)}`}
										>
											{user.role}
										</Badge>
										<Badge
											className={`text-xs ${getStatusColor(
												user.status,
											)} flex items-center gap-1`}
										>
											{getStatusIcon(user.status)}
											{user.status}
										</Badge>
									</div>
								</div>
								<div className='flex items-center gap-4 mt-1'>
									<div className='flex items-center gap-1 text-xs text-gray-500'>
										<Mail className='h-3 w-3' />
										{user.email}
									</div>
									{user.phone && (
										<div className='flex items-center gap-1 text-xs text-gray-500'>
											<Phone className='h-3 w-3' />
											{user.phone}
										</div>
									)}
								</div>
								{user.location && (
									<div className='flex items-center gap-1 text-xs text-gray-500 mt-1'>
										<MapPin className='h-3 w-3' />
										{user.location}
									</div>
								)}
							</div>
							<Button variant='ghost' size='sm'>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</div>
					))}
				</div>

				{filteredUsers.length === 0 && (
					<div className='text-center py-8 text-gray-500'>
						<Users className='h-12 w-12 mx-auto mb-4 text-gray-300' />
						<p>No users found matching your search.</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
