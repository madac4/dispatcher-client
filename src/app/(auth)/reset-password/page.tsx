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
import { resetPassword } from '@/lib/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
	password: passwordSchema,
	confirmPassword: passwordSchema,
})

export default function LoginPage() {
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false)
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const searchParams = useSearchParams()
	const router = useRouter()

	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	})

	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		const token = searchParams.get('token')

		if (!token) {
			router.push('/login')
			return
		}

		if (values.password !== values.confirmPassword) {
			toast.error('Passwords do not match')
			return
		}

		setIsLoading(true)
		try {
			const { message } = await resetPassword({
				...values,
				token: token as string,
			})
			toast.success(message)
			router.push('/login')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<div className='relative'>
								<FormControl>
									<Input
										autoComplete='current-password'
										type={
											showConfirmPassword
												? 'text'
												: 'password'
										}
										placeholder='Confirm your password'
										{...field}
									/>
								</FormControl>
								{showConfirmPassword ? (
									<EyeOffIcon
										onClick={() =>
											setShowConfirmPassword(
												!showConfirmPassword,
											)
										}
										className='absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground'
										size={18}
									/>
								) : (
									<EyeIcon
										onClick={() =>
											setShowConfirmPassword(
												!showConfirmPassword,
											)
										}
										className='absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground'
										size={18}
									/>
								)}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='w-full' disabled={isLoading}>
					{isLoading ? (
						<>
							<Loader2Icon className='animate-spin' size={16} />
							Resetting password...
						</>
					) : (
						'Reset Password'
					)}
				</Button>
			</form>
		</Form>
	)
}
