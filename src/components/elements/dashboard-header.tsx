'use client'

import { useAuthStore } from '@/lib/stores/authStore'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { FilePlus, PackagePlus, Plus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { InviteUserModal } from '../modals/InviteUserModal'
import { Button } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
} from '../ui/dropdown-menu'

export function DashboardHeader() {
	const { logout } = useAuthStore()
	return (
		<header className='flex min-h-14 items-center justify-between gap-2 sm:gap-4 border-b bg-background px-4 lg:min-h-16 lg:px-6'>
			<span></span>
			<div className='flex items-center gap-2'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline'>
							<Plus />
							Create actions
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem asChild>
							<Link href='/dashboard/quote'>
								<FilePlus />
								New Quote
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href='/dashboard/orders/create'>
								<PackagePlus />
								New Order
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<InviteUserModal>
					<Button variant='outline'>
						<UserPlus />
						Invite User
					</Button>
				</InviteUserModal>
				<Button onClick={logout}>Logout</Button>
			</div>
		</header>
	)
}
