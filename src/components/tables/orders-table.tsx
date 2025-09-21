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
import * as React from 'react'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { orderColumns, trailerColumns } from '@/constants/columns'
import { PaginatedOrderDTO } from '@/lib/models/order.model'
import { RequestModel } from '@/lib/models/response.model'
import { useOrdersStore } from '@/lib/stores/ordersStore'
import { Pagination } from '../elements/pagination'

type OrdersTableProps = {
	data: PaginatedOrderDTO[]
	payload?: RequestModel
}

export function OrdersTable({ data, payload }: OrdersTableProps) {
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([])
	const [sorting, setSorting] = React.useState<SortingState>([])
	const { pagination, isLoading, getOrders } = useOrdersStore()

	const handlePaginationChange = React.useCallback(
		(pageSize: number, page: number) => {
			if (payload) {
				payload.limit = pageSize
				payload.page = page

				getOrders(payload)
			} else {
				getOrders(new RequestModel())
			}
		},
		[getOrders, payload],
	)

	const table = useReactTable({
		data: data,
		columns: orderColumns,
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

	return (
		<div className='space-y-4'>
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
							<TableRow key={row.id}>
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
				itemsLength={data.length}
				onPaginationChange={handlePaginationChange}
			/>
		</div>
	)
}
