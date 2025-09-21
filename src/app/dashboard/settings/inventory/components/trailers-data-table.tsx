'use client'

import {
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { Plus, Search } from 'lucide-react'
import * as React from 'react'

import { Pagination } from '@/components/elements/pagination'
import { CreateInventoryEntity } from '@/components/modals/CreateInventoryEntity'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { trailerColumns } from '@/constants/columns'
import { RequestModel } from '@/lib/models/response.model'
import { useTrailersStore } from '@/lib/stores/trailerStore'

type TrailersDataTableProps = {
	onSelect?: (trailerId: string) => void
	selectedTrailerId: string | null
}

export function TrailersDataTable({
	onSelect,
	selectedTrailerId,
}: TrailersDataTableProps) {
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([])
	const [sorting, setSorting] = React.useState<SortingState>([])
	const { getTrailers, trailers, pagination, isLoading } = useTrailersStore()
	const [search, setSearch] = React.useState('')
	const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

	const payload = React.useMemo(() => new RequestModel(), [])

	const fetchData = React.useCallback(() => {
		getTrailers(payload)
	}, [getTrailers, payload])

	const handleSearch = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value
			setSearch(value)

			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current)
			}

			searchTimeoutRef.current = setTimeout(() => {
				payload.search = value
				fetchData()
			}, 300)
		},
		[fetchData, payload],
	)

	const handlePaginationChange = React.useCallback(
		(pageSize: number, page: number) => {
			payload.limit = pageSize
			payload.page = page
			fetchData()
		},
		[fetchData, payload],
	)

	const table = useReactTable({
		data: trailers,
		columns: trailerColumns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	})

	React.useEffect(() => {
		fetchData()

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current)
			}
		}
	}, [fetchData])

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<div className='relative'>
					<Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
					<Input
						placeholder='Search trailers...'
						value={search}
						onChange={handleSearch}
						className='pl-8 max-w-sm w-full'
					/>
				</div>

				<CreateInventoryEntity type='trailer' fetchData={fetchData}>
					<Button>
						<Plus className='h-5 w-5' />
						<span>Add Trailer</span>
					</Button>
				</CreateInventoryEntity>
			</div>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map(headerGroup => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map(header => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext(),
											  )}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>

				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map(row => (
							<TableRow
								key={row.id}
								data-state={
									row.original._id === selectedTrailerId &&
									'selected'
								}
								className={
									onSelect
										? 'cursor-pointer hover:bg-gray-50'
										: ''
								}
								onClick={() => {
									if (onSelect) {
										onSelect(row.original._id)
									}
								}}
							>
								{row.getVisibleCells().map(cell => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext(),
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={trailerColumns.length}
								className='h-24 text-center'
							>
								{isLoading ? 'Loading...' : 'No orders found.'}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<Pagination
				itemsPerPage={pagination.itemsPerPage}
				currentPage={pagination.currentPage}
				totalPages={pagination.totalPages}
				totalItems={pagination.totalItems}
				itemsLength={trailers.length}
				onPaginationChange={handlePaginationChange}
			/>
		</div>
	)
}
