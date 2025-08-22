import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { EditInventoryEntity } from '@/components/modals/EditInventoryEntity'
import FilesActionModal from '@/components/modals/FilesActionModal'
import UploadEntityFile from '@/components/modals/UploadEntityFile'
import { ActionsMenu, TableAction } from '@/components/tables/TableActions'
import { Badge } from '@/components/ui/badge'
import {
	formatStatus,
	getStatusBadge,
	OrderStatus,
	PaginatedOrderDTO,
} from '@/lib/models/order.model'
import { RequestModel } from '@/lib/models/response.model'
import { TrailerDTO } from '@/lib/models/trailer.model'
import { TruckDTO } from '@/lib/models/truck.model'
import { useDialogStore } from '@/lib/store'
import { useTrailersStore } from '@/lib/stores/trailerStore'
import { useTrucksStore } from '@/lib/stores/truckStore'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export const truckColumns: ColumnDef<TruckDTO>[] = [
	{
		accessorKey: 'unitNumber',
		header: ({ column }) => {
			return (
				<button
					className='flex items-center gap-2 hover:text-primary transition-colors'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Unit Number
					<ArrowUpDown className='h-4 w-4' />
				</button>
			)
		},
		cell: ({ row }) => (
			<div className='font-medium'>{row.getValue('unitNumber')}</div>
		),
	},
	{
		accessorKey: 'licencePlate',
		header: ({ column }) => {
			return (
				<button
					className='flex items-center gap-2 hover:text-primary transition-colors'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Licence Plate
					<ArrowUpDown className='h-4 w-4' />
				</button>
			)
		},
		cell: ({ row }) => (
			<div className='font-mono'>{row.getValue('licencePlate')}</div>
		),
	},
	{
		accessorKey: 'state',
		header: 'State',
		cell: ({ row }) => (
			<div className='text-gray-600'>{row.getValue('state')}</div>
		),
	},
	{
		accessorKey: 'make',
		header: 'Make/Model',
		cell: ({ row }) => {
			return <div className='font-medium'>{row.original.make}</div>
		},
	},
	{
		accessorKey: 'vin',
		header: 'VIN',
		cell: ({ row }) => {
			const vin = row.getValue('vin') as string
			return <div className='font-mono'>{vin.slice(0, 8)}...</div>
		},
	},
	{
		accessorKey: 'nrOfAxles',
		header: 'Axles',
		cell: ({ row }) => (
			<div className='font-mono'>{row.getValue('nrOfAxles')}</div>
		),
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const { getTrucks, deleteTruck } = useTrucksStore.getState()
			const { setIsDialogOpen } = useDialogStore.getState()
			const truck = row.original

			const actions: TableAction<TruckDTO>[] = [
				{
					label: 'Copy VIN',
					icon: 'copy',
					action: item => {
						navigator.clipboard.writeText(item.vin)
						toast.success('VIN copied to clipboard')
					},
				},
				{
					label: 'Edit Truck',
					icon: 'edit',
					action: () => {
						toast.success('Truck updated successfully')
						setIsDialogOpen(false)
					},
					dialogContent: item => (
						<EditInventoryEntity entity={item} type='truck' />
					),
				},
				{
					label: 'Attach Files',
					icon: 'paperclip',
					dialogContent: item => (
						<UploadEntityFile type='truck' entityId={item._id} />
					),
					isDisabled: item => !item.unitNumber,
					action: () => {},
				},
				{
					label: 'Check Files',
					icon: 'file-search',
					dialogContent: item => (
						<FilesActionModal type='truck' id={item._id} />
					),
					action: () => {},
				},
				{
					label: 'Delete Truck',
					icon: 'trash',
					dialogContent: item => (
						<ConfirmModal
							title='Confirm Truck Deletion'
							description={`Are you sure you want to delete truck ${item.unitNumber}?`}
							onConfirm={async () => {
								const loading =
									toast.loading('Deleting truck...')
								await deleteTruck(item._id)
								await getTrucks(new RequestModel())
								toast.success('Truck deleted successfully')
								toast.dismiss(loading)
								setIsDialogOpen(false)
							}}
						/>
					),
					action: () => {},
				},
			]

			return <ActionsMenu item={truck} actions={actions} />
		},
	},
]

export const trailerColumns: ColumnDef<TrailerDTO>[] = [
	{
		accessorKey: 'unitNumber',
		header: ({ column }) => {
			return (
				<button
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='flex items-center gap-2 hover:text-primary transition-colors'
				>
					Unit Number
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</button>
			)
		},
		cell: ({ row }) => (
			<div className='font-medium'>{row.getValue('unitNumber')}</div>
		),
	},
	{
		accessorKey: 'licencePlate',
		header: ({ column }) => {
			return (
				<button
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='flex items-center gap-2 hover:text-primary transition-colors'
				>
					Licence Plate
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</button>
			)
		},
		cell: ({ row }) => (
			<div className='font-mono'>{row.getValue('licencePlate')}</div>
		),
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => (
			<div>
				<div className='font-medium'>{row.original.type}</div>
				<div className='text-sm text-gray-500'>
					{row.original.length}
				</div>
			</div>
		),
	},
	{
		accessorKey: 'make',
		header: 'Make',
		cell: ({ row }) => (
			<div className='text-gray-600'>
				{row.original.make} ({row.original.year})
			</div>
		),
	},
	{
		accessorKey: 'vin',
		header: 'VIN',
		cell: ({ row }) => (
			<div className='text-gray-600'>
				{row.original.vin.slice(0, 8)}...
			</div>
		),
	},
	{
		accessorKey: 'state',
		header: 'State',
		cell: ({ row }) => (
			<div className='text-gray-600'>{row.original.state}</div>
		),
	},
	{
		accessorKey: 'nrOfAxles',
		header: 'Axles',
		cell: ({ row }) => (
			<div className='text-gray-600'>{row.original.nrOfAxles}</div>
		),
	},

	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const { getTrailers, deleteTrailer } = useTrailersStore.getState()
			const { setIsDialogOpen } = useDialogStore.getState()
			const truck = row.original

			const actions: TableAction<TrailerDTO>[] = [
				{
					label: 'Copy VIN',
					icon: 'copy',
					action: item => {
						navigator.clipboard.writeText(item.vin)
						toast.success('VIN copied to clipboard')
					},
				},
				{
					label: 'Edit Trailer',
					icon: 'edit',
					action: () => {
						toast.success('Trailer updated successfully')
						setIsDialogOpen(false)
					},
					dialogContent: item => (
						<EditInventoryEntity entity={item} type='trailer' />
					),
				},
				{
					label: 'Attach Files',
					icon: 'paperclip',
					dialogContent: item => (
						<UploadEntityFile type='trailer' entityId={item._id} />
					),
					isDisabled: item => !item.unitNumber,
					action: item => {
						toast.info(
							`File attachment for truck ${item.unitNumber} not implemented`,
						)
					},
				},
				{
					label: 'Check Files',
					icon: 'file-search',
					dialogContent: item => (
						<FilesActionModal type='trailer' id={item._id} />
					),
					action: () => {},
				},
				{
					label: 'Delete Trailer',
					icon: 'trash',
					dialogContent: item => (
						<ConfirmModal
							title='Confirm Trailer Deletion'
							description={`Are you sure you want to delete trailer ${item.unitNumber}?`}
							onConfirm={async () => {
								const loading = toast.loading(
									'Deleting trailer...',
								)
								await deleteTrailer(item._id)
								await getTrailers(new RequestModel())
								toast.success('Trailer deleted successfully')
								toast.dismiss(loading)
								setIsDialogOpen(false)
							}}
						/>
					),
					action: () => {},
				},
			]

			return <ActionsMenu item={truck} actions={actions} />
		},
	},
]

export const orderColumns: ColumnDef<PaginatedOrderDTO>[] = [
	{
		accessorKey: 'orderNumber',
		header: ({ column }) => {
			return (
				<button
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='flex items-center gap-2 hover:text-primary transition-colors'
				>
					Order ID
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</button>
			)
		},
		cell: ({ row }) => (
			<div className='font-medium'>
				<Link
					href={`/dashboard/orders/${row.getValue('orderNumber')}`}
					className='hover:underline text-primary'
				>
					{row.getValue('orderNumber')}
				</Link>
			</div>
		),
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<button
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='flex items-center gap-2 hover:text-primary transition-colors'
				>
					Created At
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</button>
			)
		},
		cell: ({ row }) => (
			<div className='font-mono'>
				{format(row.getValue('createdAt'), 'dd MMM yyyy | HH:mm')}
			</div>
		),
	},
	{
		accessorKey: 'originAddress',
		header: 'Origin Address',
		cell: ({ row }) => (
			<div className='text-gray-600'>{row.original.originAddress}</div>
		),
	},
	{
		accessorKey: 'destinationAddress',
		header: 'Destination Address',
		cell: ({ row }) => (
			<div className='text-gray-600'>
				{row.original.destinationAddress}
			</div>
		),
	},
	{
		accessorKey: 'truckId',
		header: 'Truck',
		cell: ({ row }) => (
			<div className='text-gray-600'>{row.original.truckId}</div>
		),
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.original.status as OrderStatus

			return (
				<Badge className={getStatusBadge(status)}>
					{formatStatus(status)}
				</Badge>
			)
		},
	},

	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const order = row.original

			const actions: TableAction<PaginatedOrderDTO>[] = [
				{
					label: 'Duplicate Order',
					icon: 'copy',
					action: () => {
						toast.success('VIN copied to clipboard')
					},
				},
				{
					label: 'View Order',
					icon: 'eye',
					link: item => `/dashboard/orders/${item.orderNumber}`,
					action: () => {},
				},
			]

			return <ActionsMenu item={order} actions={actions} />
		},
	},
]
