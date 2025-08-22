'use client'

import { DashboardAside } from '@/components/elements/dashboard-aside'
import { DashboardHeader } from '@/components/elements/dashboard-header'
import { useAsideStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { isAsideOpen } = useAsideStore()
	return (
		<div
			className={cn(
				'grid h-screen transition-all duration-300 w-full bg-gray-50/50',
				isAsideOpen
					? 'md:grid-cols-[220px_1fr] xl:grid-cols-[280px_1fr]'
					: 'md:!grid-cols-[70px_1fr]',
			)}
		>
			<DashboardAside />

			<div className='flex flex-col h-full overflow-x-hidden max-h-screen overflow-y-auto'>
				<DashboardHeader />

				<main className='flex relative flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
					{children}
				</main>
			</div>
		</div>
	)
}
