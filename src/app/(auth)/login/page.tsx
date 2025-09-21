'use client'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { login } from '@/lib/services/authService'
import { useAuthStore } from '@/lib/stores/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const passwordSchema = z.string().superRefine((password, ctx) => {
	if (password.length < 8) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Password must be at least 8 characters long',
			path: [],
		})
	}
	if (!/[A-Z]/.test(password)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Password must contain at least one uppercase letter',
			path: [],
		})
	}
	if (!/[a-z]/.test(password)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Password must contain at least one lowercase letter',
			path: [],
		})
	}
	if (!/\d/.test(password)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Password must contain at least one number',
			path: [],
		})
	}
	if (!/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message:
				'Password must contain at least one special character (@$!%*?&)',
			path: [],
		})
	}
})

const loginFormSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: passwordSchema,
})

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { setUser } = useAuthStore()
	const router = useRouter()

	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		setIsLoading(true)
		try {
			const { data } = await login(values)
			setUser(data!.accessToken, data!.refreshToken)

			router.push('/dashboard')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									autoComplete='email'
									type='email'
									placeholder='Enter your email'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<div className='relative'>
								<FormControl>
									<Input
										autoComplete='current-password'
										type={
											showPassword ? 'text' : 'password'
										}
										placeholder='Enter your password'
										{...field}
									/>
								</FormControl>
								{showPassword ? (
									<EyeOffIcon
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className='absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground'
										size={18}
									/>
								) : (
									<EyeIcon
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className='absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground'
										size={18}
									/>
								)}
							</div>
							<FormMessage />
							<Link
								href='/forgot-password'
								className='text-sm text-right text-primary hover:underline block'
							>
								Forgot password?
							</Link>
						</FormItem>
					)}
				/>

				<Button type='submit' className='w-full' disabled={isLoading}>
					{isLoading ? (
						<>
							<Loader2Icon className='animate-spin' size={16} />
							Signing in...
						</>
					) : (
						'Sign In'
					)}
				</Button>
			</form>

			<div className='mt-6 text-center'>
				<p className='text-sm text-gray-600'>
					Don&apos;t have an account?{' '}
					<Link
						href='/register'
						className='text-orange-500 hover:text-orange-600 font-medium'
					>
						Sign up
					</Link>
				</p>
			</div>
		</Form>
	)
}
