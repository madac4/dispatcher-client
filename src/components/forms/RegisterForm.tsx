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
import { UserRole } from '@/lib/models/auth.model'
import { AuthService } from '@/lib/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

const registerFormSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: passwordSchema,
	role: z.nativeEnum(UserRole),
})

interface RegisterFormProps {
	role?: UserRole
}

export default function RegisterForm({ role }: RegisterFormProps) {
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const router = useRouter()

	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			email: '',
			password: '',
			role: role || UserRole.USER,
		},
	})

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		console.log(values)

		setIsLoading(true)

		try {
			const { message } = await AuthService.register(
				values.email,
				values.password,
				values.role,
			)
			toast.success(message)

			form.reset()

			if (!role) router.push('/login')
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

				{/* <FormField
					control={form.control}
					name='inviteCode'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Invite Code</FormLabel>
							<FormControl>
								<Input
									type='text'
									placeholder='Enter your invite code'
									disabled={!!inviteCode}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				<Button type='submit' className='w-full' disabled={isLoading}>
					{isLoading ? (
						<>
							<Loader2Icon className='animate-spin' size={16} />
							Registering...
						</>
					) : (
						'Register'
					)}
				</Button>
			</form>

			{!role && (
				<div className='mt-6 text-center'>
					<p className='text-sm text-gray-600'>
						Already have an account?{' '}
						<Link
							href='/login'
							className='text-primary hover:text-primary/80 font-medium'
						>
							Sign in
						</Link>
					</p>
				</div>
			)}
		</Form>
	)
}
