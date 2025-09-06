import { InvitationService } from '@/lib/services/invitationService'
import { Loader2, Mail, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

type InviteUserModalProps = {
	children: React.ReactNode
}

export function InviteUserModal({ children }: InviteUserModalProps) {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!email.trim()) {
			toast.error('Email is required')
			return
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			toast.error('Please enter a valid email address')
			return
		}

		setIsLoading(true)

		try {
			const { message } = await InvitationService.invite(email.trim())

			toast.success(message)
			setEmail('')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<UserPlus className='h-5 w-5' />
						Invite User
					</DialogTitle>
					<DialogDescription>
						Send an invitation to join your team. The user will
						receive an email with a registration link.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>
							Email Address{' '}
							<span className='text-destructive'>*</span>
						</Label>
						<div className='relative'>
							<Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								id='email'
								type='email'
								placeholder='Enter email address'
								value={email}
								onChange={e => setEmail(e.target.value)}
								className='pl-10'
								disabled={isLoading}
								required
							/>
						</div>
					</div>

					<DialogFooter className='justify-end'>
						<DialogClose asChild>
							<Button
								type='button'
								variant='outline'
								disabled={isLoading}
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type='submit'
							disabled={!email.trim() || isLoading}
							className='min-w-[100px]'
						>
							{isLoading ? (
								<>
									<Loader2 className='w-4 h-4 animate-spin mr-2' />
									Sending...
								</>
							) : (
								'Send Invite'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
