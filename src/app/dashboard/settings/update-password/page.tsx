import ResetPasswordForm from '@/components/forms/ResetPasswordForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default function UpdatePasswordPage() {
	return (
		<div className='w-full mx-auto space-y-6'>
			<Alert className='border-amber-200 bg-amber-50'>
				<Shield className='!size-5 text-primary' />
				<AlertDescription className='text-amber-800 font-medium text-base'>
					Remember or save your password after changing it.
				</AlertDescription>
			</Alert>

			<Card>
				<CardHeader className='text-center'>
					<div className='mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
						<Shield className='h-8 w-8 text-primary' />
					</div>
					<CardTitle className='text-3xl font-bold'>
						Update Password
					</CardTitle>
					<CardDescription className='text-lg'>
						Create a strong password to protect your account
					</CardDescription>
				</CardHeader>

				<CardContent className='space-y-8'>
					<ResetPasswordForm />
				</CardContent>
			</Card>
		</div>
	)
}
