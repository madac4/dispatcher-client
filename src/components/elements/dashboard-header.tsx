'use client'

import { UserRole } from '@/lib/models/auth.model'
import { useAuthStore } from '@/lib/stores/authStore'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { FilePlus, PackagePlus, Plus, UserRoundPlus } from 'lucide-react'
import Link from 'next/link'
import RegisterForm from '../forms/RegisterForm'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
} from '../ui/dropdown-menu'
import { HeaderNotifications } from './HeaderNotifications'

export function DashboardHeader() {
	const { logout, role } = useAuthStore()
	const userRole = role()

	const displayedActions = () => {
		if (!userRole) return null

		switch (userRole) {
			case UserRole.ADMIN:
				return (
					<>
						<DialogTrigger asChild>
							<DropdownMenuItem asChild>
								<button>
									<UserRoundPlus />
									Register Moderator
								</button>
							</DropdownMenuItem>
						</DialogTrigger>
					</>
				)

			case UserRole.USER:
				return (
					<>
						<DropdownMenuItem asChild>
							<Link href='/dashboard/orders/create'>
								<PackagePlus />
								New Order
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href='/dashboard/quote'>
								<FilePlus />
								New Quote
							</Link>
						</DropdownMenuItem>
					</>
				)
		}
	}

	return (
		<header className='flex min-h-14 items-center justify-between gap-2 sm:gap-4 border-b bg-background px-4 lg:min-h-16 lg:px-6'>
			<span></span>
			<div className='flex items-center gap-2'>
				<HeaderNotifications />
				{userRole !== UserRole.MODERATOR && (
					<Dialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline'>
									<Plus />
									Create actions
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{displayedActions()}
								{/* <DropdownMenuItem asChild>
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
						</DropdownMenuItem> */}
							</DropdownMenuContent>
						</DropdownMenu>

						{userRole === UserRole.ADMIN && (
							<DialogContent className='sm:max-w-md'>
								<DialogHeader>
									<DialogTitle>
										Register Moderator
									</DialogTitle>
									<DialogDescription>
										Register a new moderator.
									</DialogDescription>
								</DialogHeader>
								<RegisterForm role={UserRole.MODERATOR} />
							</DialogContent>
						)}
					</Dialog>
				)}
				<Button onClick={logout}>Logout</Button>
			</div>
		</header>
	)
}
