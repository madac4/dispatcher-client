'use client'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { DashboardService } from '@/lib/services/DashboardService'
import { DashboardCard } from '@/types/dashboard.models'
import { useCallback, useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'

export function SectionCards() {
	const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const getDashboardCards = useCallback(async () => {
		try {
			const { data } = await DashboardService.getDashboardCards()
			if (data) setDashboardCards(data)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		getDashboardCards()
	}, [getDashboardCards])

	return (
		<div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 xl:grid-cols-4'>
			{isLoading ? (
				<>
					<Skeleton className='h-36 w-full' />
					<Skeleton className='h-36 w-full' />
					<Skeleton className='h-36 w-full' />
					<Skeleton className='h-36 w-full' />
				</>
			) : (
				dashboardCards.map(card => (
					<Card key={card.title}>
						<CardHeader>
							<CardDescription className='text-base font-medium'>
								{card.title}
							</CardDescription>
							<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
								{card.value}
							</CardTitle>
							<div className='text-muted-foreground'>
								{card.description}
							</div>
						</CardHeader>
					</Card>
				))
			)}
		</div>
	)
}
