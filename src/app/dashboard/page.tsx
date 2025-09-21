import { RecentActivity } from '@/components/blocks/RecentActivity'
import { SectionCards } from '@/components/blocks/SectionCards'
import { UsersList } from '@/components/blocks/UsersList'

export default function DashboardPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Dashboard</h1>
				<p className='text-muted-foreground'>
					Welcome to your click permit dashboard
				</p>
			</div>

			<SectionCards />

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<RecentActivity />
				<UsersList />
			</div>
		</div>
	)
}
