'use client'

import {
	deleteCarrierFile,
	getCarrierFiles,
	SettingsService,
} from '@/lib/services/settingsService'
import { getTrailerFiles } from '@/lib/services/trailerService'
import { getTruckFiles } from '@/lib/services/truckService'
import { useSettingsStore } from '@/lib/stores/settingsStore'
import { bytesToSize } from '@/lib/utils'
import { Download, FileText, Trash } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Skeleton } from '../ui/skeleton'
import { ConfirmModal } from './ConfirmModal'

export default function FilesModal({
	children,
	type,
	id,
}: {
	children: React.ReactNode
	type: 'carrier' | 'truck' | 'trailer'
	id?: string
}) {
	const { setCarrierFiles, carrierFiles } = useSettingsStore()
	const [isFetching, setIsFetching] = useState(true)

	const fetchCarrierFiles = useCallback(async () => {
		try {
			const { data } = await getCarrierFiles()
			setCarrierFiles(data || [])
		} finally {
			setIsFetching(false)
		}
	}, [setCarrierFiles])

	const fetchTruckFiles = useCallback(async () => {
		if (!id) return
		try {
			const { data } = await getTruckFiles(id)
			setCarrierFiles(data || [])
		} finally {
			setIsFetching(false)
		}
	}, [setCarrierFiles, id])

	const fetchTrailerFiles = useCallback(async () => {
		if (!id) return
		try {
			const { data } = await getTrailerFiles(id)
			setCarrierFiles(data || [])
		} finally {
			setIsFetching(false)
		}
	}, [setCarrierFiles, id])

	const fetchFiles = useCallback(async () => {
		setIsFetching(true)

		if (type === 'carrier') {
			await fetchCarrierFiles()
		} else if (type === 'truck') {
			await fetchTruckFiles()
		} else if (type === 'trailer') {
			await fetchTrailerFiles()
		}
	}, [type, fetchCarrierFiles, fetchTruckFiles, fetchTrailerFiles])

	const handleDeleteFile = useCallback(
		async (filename: string) => {
			const { message } = await deleteCarrierFile(filename)
			toast.success(message)
			fetchFiles()
		},
		[fetchFiles],
	)

	const handleDownloadFile = useCallback(async (filename: string) => {
		const { message } = await SettingsService.downloadCarrierFile(filename)
		toast.success(message)
	}, [])

	useEffect(() => {
		fetchFiles()
	}, [fetchFiles])

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-2xl w-full'>
				<DialogHeader>
					<DialogTitle>
						{type.charAt(0).toUpperCase() + type.slice(1)} Files
					</DialogTitle>
					<DialogDescription>
						This is a list of files that are associated with your{' '}
						{type}.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4'>
					{isFetching && (
						<>
							<Skeleton className='h-16 w-full' />
							<Skeleton className='h-16 w-full' />
							<Skeleton className='h-16 w-full' />
							<Skeleton className='h-16 w-full' />
						</>
					)}

					{!isFetching &&
						(carrierFiles?.length || 0) > 0 &&
						carrierFiles?.map(file => (
							<div
								key={file.filename}
								className='flex items-center gap-2 p-4 border rounded-lg'
							>
								<FileText className='h-5 w-5 text-primary' />
								<h3 className='text-lg font-semibold truncate w-auto'>
									{file.originalname}
								</h3>
								<span>({bytesToSize(file.size)})</span>

								<ConfirmModal
									onConfirm={() =>
										handleDeleteFile(file.filename)
									}
									title='Delete File'
								>
									<Button
										variant='destructive'
										type='button'
										size='icon-sm'
										className='ml-auto'
									>
										<Trash className='h-4 w-4' />
									</Button>
								</ConfirmModal>
								<Button
									variant='outline'
									type='button'
									size='icon-sm'
									onClick={() =>
										handleDownloadFile(file.filename)
									}
								>
									<Download className='h-4 w-4' />
								</Button>
							</div>
						))}

					{!isFetching && !carrierFiles?.length && (
						<div className='flex items-center justify-center h-full p-4 border rounded-lg mb-6'>
							<p className='text-sm text-muted-foreground'>
								No files found
							</p>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
