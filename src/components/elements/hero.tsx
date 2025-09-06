'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/authStore'
import Link from 'next/link'

export function Hero() {
	const { isAuthenticated, logout } = useAuthStore()

	console.log(isAuthenticated())
	return (
		<section className='bg-white py-16'>
			<div className='container mx-auto px-4 text-center'>
				<h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto'>
					This Website is under construction.
				</h1>

				<p className='text-lg text-gray-600 mb-8 max-w-3xl mx-auto'>
					At the moment, you can test only the features that are
					enabled for the demo. With each update, we will add more
					features and improve the website.
				</p>

				<div className='flex items-center justify-center gap-4'>
					{isAuthenticated() ? (
						<>
							<Button variant='outline' asChild>
								<Link href='/dashboard'>Dashboard</Link>
							</Button>
							<Button onClick={logout} variant='ghost'>
								Logout
							</Button>
						</>
					) : (
						<>
							<Button variant='secondary' asChild>
								<Link href='/login'>Login</Link>
							</Button>
							<Button asChild>
								<Link href='/register'>Create Account</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</section>
	)
}
