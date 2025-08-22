'use client'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InventoryTabs } from '@/constants/constants'
import { useTrailersStore } from '@/lib/stores/trailerStore'
import { useTrucksStore } from '@/lib/stores/truckStore'
import { Ban, Package } from 'lucide-react'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'
import { useState } from 'react'

export default function InventoryPage() {
	const [activeTab, setActiveTab] = useState<string>('trucks')
	const { trailerLength } = useTrailersStore()
	const { truckLength } = useTrucksStore()

	const haveEntities = (): boolean => {
		if (activeTab === 'trucks') {
			return truckLength === null || truckLength > 0
		} else {
			return trailerLength === null || trailerLength > 0
		}
	}

	return (
		<>
			{!haveEntities() && (
				<Alert className='border-red-200 bg-red-50'>
					<Ban className='!size-5 !text-red-800' />
					<AlertDescription className='text-red-800 font-medium text-base'>
						You don&apos;t have any {activeTab} yet. You can add one
						by clicking the button below.
					</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader className='text-center space-y-2'>
					<div className='mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
						<Package className='h-8 w-8 text-primary' />
					</div>
					<CardTitle className='text-3xl font-bold'>
						Fleet Inventory
					</CardTitle>
					<p className='text-gray-600'>
						Manage your trucks and trailers
					</p>
				</CardHeader>

				<CardContent>
					<Tabs defaultValue={activeTab} className='space-y-6'>
						<TabsList className='grid w-full grid-cols-2 h-12 max-w-xl mx-auto'>
							{InventoryTabs.map(tab => (
								<TabsTrigger
									key={tab.key}
									value={tab.key}
									className='flex items-center cursor-pointer'
									onClick={() => setActiveTab(tab.key)}
								>
									<DynamicIcon
										name={tab.icon as IconName}
										className='h-4 w-4'
									/>
									<span>{tab.label}</span>
								</TabsTrigger>
							))}
						</TabsList>

						{InventoryTabs.map(tab => (
							<TabsContent key={tab.key} value={tab.key}>
								<tab.content
									selectedTruckId={null}
									selectedTrailerId={null}
								/>
							</TabsContent>
						))}
					</Tabs>
				</CardContent>
			</Card>
		</>
	)
}
