'use client'
import { Footer } from '@/components/elements/footer'
import { Header } from '@/components/elements/header'
import { Logo } from '@/components/elements/logo'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const [title, setTitle] = useState('Welcome Back')
	const [description, setDescription] = useState(
		'Sign in to your account to continue',
	)

	useEffect(() => {
		switch (pathname) {
			case '/register':
				setTitle('Create Account')
				setDescription('Create an account to continue')
				break
			case '/login':
				setTitle('Welcome!')
				setDescription('Sign in to your account to continue')
				break
			case '/forgot-password':
				setTitle('Forgot Password')
				setDescription('Enter your email to reset your password')
				break
			case '/reset-password':
				setTitle('Reset Password')
				setDescription('Enter your new password')
				break
		}
	}, [pathname])
	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<div className='flex  flex-1 items-center justify-center w-full'>
				<Card className='w-full max-w-md'>
					<CardHeader className='text-center justify-center flex flex-col items-center'>
						<Logo />
						<CardTitle className='text-2xl'>{title}</CardTitle>
						<CardDescription>{description}</CardDescription>
					</CardHeader>
					<CardContent>{children}</CardContent>
				</Card>
			</div>
			<Footer />
		</div>
	)
}
