'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/authStore'
import { cn } from '@/lib/utils'
import { Clock, Mail, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from './logo'

export function Header() {
	const { isAuthenticated, logout } = useAuthStore()
	const [isAuth, setIsAuth] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		setIsAuth(isAuthenticated())
	}, [isAuthenticated])

	const isActive = (path: string) => pathname === path

	return (
		<header className='border-b'>
			<div className='bg-gray-900 text-white py-2 px-4'>
				<div className='fluid-container flex justify-between items-center text-sm'>
					<div className='flex items-center gap-6'>
						<div className='flex items-center gap-2'>
							<Clock className='h-4 w-4 text-primary' />
							Mon-Sat 7am-7pm
						</div>
						<Link
							href='tel:+37378410220'
							className='flex items-center gap-2'
						>
							<Phone className='h-4 w-4 text-primary' />
							Call us +373 78 410 220
						</Link>
						<Link
							href='mailto:clickpermit@gmail.com'
							className='flex items-center gap-2'
						>
							<Mail className='h-4 w-4 text-primary' />
							clickpermit@gmail.com
						</Link>
					</div>
				</div>
			</div>

			<div>
				<div className='fluid-container py-4 flex justify-between items-center'>
					<Logo />

					<nav className='hidden md:flex items-center space-x-4'>
						<Link
							href='/'
							className={cn(
								'text-gray-900 hover:text-primary px-4 py-2 text-sm font-semibold transition-colors relative group',
								isActive('/') && 'text-primary',
							)}
						>
							Home
							<span
								className={cn(
									'absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform',
									isActive('/') && 'scale-x-100',
								)}
							></span>
						</Link>
						<Link
							href='/about'
							className={cn(
								'text-gray-600 hover:text-primary px-4 py-2 text-sm font-semibold transition-colors relative group',
								isActive('/about') && 'text-primary',
							)}
						>
							General Information
							<span
								className={cn(
									'absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform',
									isActive('/about') && 'scale-x-100',
								)}
							></span>
						</Link>
						{/* <Link
							href='/services'
							className='text-gray-600 hover:text-primary px-4 py-2 text-sm font-semibold transition-colors relative group'
						>
							Services
							<span className='absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform'></span>
						</Link>
						<Link
							href='/permits'
							className='text-gray-600 hover:text-primary px-4 py-2 text-sm font-semibold transition-colors relative group'
						>
							Permits
							<span className='absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform'></span>
						</Link> */}
						<Link
							href='/contact'
							className={cn(
								'text-gray-600 hover:text-primary px-4 py-2 text-sm font-semibold transition-colors relative group',
								isActive('/contact') && 'text-primary',
							)}
						>
							Contact Us
							<span
								className={cn(
									'absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform',
									isActive('/contact') && 'scale-x-100',
								)}
							></span>
						</Link>
					</nav>

					<div className='flex items-center gap-3'>
						{isAuth ? (
							<>
								<Button variant='outline' asChild>
									<Link href='/dashboard'>Dashboard</Link>
								</Button>
								<Button onClick={logout} variant='ghost'>
									Logout
								</Button>
							</>
						) : (
							<Button asChild>
								<Link href='/login'>
									Client Portal
									<User className='h-4 w-4' />
								</Link>
							</Button>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}
