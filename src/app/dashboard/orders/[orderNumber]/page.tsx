'use client'

import OrderChat from '@/components/blocks/OrderChat'
import RouteDisplay from '@/components/elements/RouteDisplay'
import FileUploader from '@/components/forms/FileUploader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { UserRole } from '@/lib/models/auth.model'
import {
	formatStatus,
	getStatusBadge,
	OrderDTO,
	OrderStatus,
} from '@/lib/models/order.model'
import { getOrderByNumber, OrderService } from '@/lib/services/orderService'
import { SettingsService } from '@/lib/services/settingsService'
import { useAuthStore } from '@/lib/stores/authStore'
import { formatDate, formatDimensions, truncate } from '@/utils/formatters'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import {
	ArrowLeft,
	Calendar,
	Copy,
	Download,
	Edit,
	FileText,
	Loader2,
	Package,
	RefreshCcwDot,
	Route,
	Ruler,
	Trash,
	Truck,
	Upload,
	UserCheck,
	X,
	Zap,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function OrderDetailsPage() {
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const { orderNumber } = useParams<{ orderNumber: string }>()
	const [order, setOrder] = useState<OrderDTO | null>(null)
	const [loading, setLoading] = useState(true)
	const { role } = useAuthStore()
	const router = useRouter()
	const fetchingRef = useRef(false)

	const statuses = Object.entries(OrderStatus).map(([, value]) => ({
		value: value,
		label: formatStatus(value),
	}))

	const updateOrderStatus = useCallback(
		async (status: OrderStatus | null, orderId: string) => {
			try {
				if (!status) {
					toast.warning('Please select a status')
					return
				}

				const { message } = await OrderService.updateOrderStatus(
					orderId,
					status,
				)
				toast.success(message)

				setOrder(prev => ({ ...prev!, status: status }))
			} catch (error) {
				console.error('Error updating order status:', error)
			}
		},
		[],
	)

	const fetchOrder = useCallback(
		async (number: string) => {
			if (fetchingRef.current) return

			try {
				fetchingRef.current = true
				setLoading(true)
				const { data } = await getOrderByNumber(number)
				setOrder(data)
			} finally {
				setLoading(false)
				fetchingRef.current = false
			}
		},
		[]
	)

	const moderateOrder = useCallback(async (orderId: string) => {
		try {
			const { data, message } = await OrderService.moderateOrder(orderId)
			toast.success(message)
			setOrder(data)
		} catch (error) {
			console.error('Error moderating order:', error)
		}
	}, [])

	useEffect(() => {
		if (orderNumber) fetchOrder(orderNumber)
	}, [orderNumber, fetchOrder])

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		toast.success(`${text} copied to clipboard`)
	}

	const downloadOrderFile = async (orderId: string, filename: string) => {
		try {
			const { message } = await OrderService.downloadOrderFile(
				orderId,
				filename,
			)
			toast.success(message)
		} catch (error) {
			console.error('Error downloading file:', error)
			toast.error('Failed to download file')
		}
	}

	const downloadCarrierFile = async (filename: string) => {
		try {
			const { message } = await SettingsService.downloadCarrierFile(
				filename,
				order!.userId,
			)
			toast.success(message)
		} catch (error) {
			console.error('Error downloading file:', error)
			toast.error('Failed to download file')
		}
	}

	const uploadFileToOrder = async () => {
		try {
			const { message } = await OrderService.uploadOrderFile(
				order!.id,
				selectedFile!,
			)
			toast.success(message)

			setOrder(prev => ({
				...prev!,
				files: [
					...prev!.files,
					{
						filename: selectedFile!.name,
						originalname: selectedFile!.name,
						contentType: selectedFile!.type,
						size: selectedFile!.size,
						_id: '1',
					},
				],
			}))
			setSelectedFile(null)
		} catch (error) {
			console.error('Error uploading file:', error)
			toast.error('Failed to upload file')
		}
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='flex items-center space-x-2'>
					<Loader2 className='w-6 h-6 animate-spin' />
					<span>Loading order details...</span>
				</div>
			</div>
		)
	}

	if (!order) {
		return (
			<div className='text-center py-12'>
				<h2 className='text-2xl font-bold text-gray-900 mb-2'>
					Order Not Found
				</h2>
				<p className='text-gray-600 mb-4'>
					The order you&apos;re looking for doesn&apos;t exist.
				</p>
				<Button onClick={() => router.push('/dashboard/orders')}>
					<ArrowLeft className='w-4 h-4 mr-2' />
					Back to Orders
				</Button>
			</div>
		)
	}

	return (
		<>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center'>
						<FileText size='16' className='text-primary' />
					</div>

					<div>
						<div className='flex items-center gap-3'>
							<h1 className='text-2xl font-bold'>
								{order.orderNumber}
							</h1>
							<Badge className={getStatusBadge(order.status)}>
								{formatStatus(order.status)}
							</Badge>
						</div>
						<p className='text-gray-600'>
							Created on {formatDate(order.createdAt)}
						</p>
					</div>
				</div>

				<div className='flex items-center gap-3'>
					{(role() === UserRole.ADMIN ||
						role() === UserRole.MODERATOR) &&
						!order.moderator && (
							<Button
								size='md'
								onClick={() => moderateOrder(order.id)}
							>
								<UserCheck size='16' />
								Moderate Order
							</Button>
						)}
					<Dialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline' size='md'>
									<Zap size='16' />
									Quick Actions
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DialogTrigger asChild>
									<DropdownMenuItem>
										<RefreshCcwDot size='16' />
										Update Status
									</DropdownMenuItem>
								</DialogTrigger>

								<DropdownMenuItem disabled={true}>
									<Edit size='16' />
									Edit Order
								</DropdownMenuItem>
								<DropdownMenuItem disabled={true}>
									<Copy size='16' />
									Duplicate Order
								</DropdownMenuItem>
								<DropdownMenuItem disabled={true}>
									<X size='16' />
									Cancel Order
								</DropdownMenuItem>
								<DropdownMenuItem disabled={true}>
									<Trash size='16' />
									Delete Order
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<DialogContent className='sm:max-w-md'>
							<DialogHeader>
								<DialogTitle>Update Status</DialogTitle>
								<DialogDescription>
									Update the status of the order.
								</DialogDescription>
							</DialogHeader>
							<div className='flex items-center gap-2'>
								<div className='grid flex-1 gap-2'>
									<Label htmlFor='status' className='sr-only'>
										Status
									</Label>
									<Select
										value={selectedStatus || ''}
										onValueChange={setSelectedStatus}
									>
										<SelectTrigger className='w-full'>
											<SelectValue placeholder='Select a status' />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{statuses.map(status => (
													<SelectItem
														key={status.value}
														value={status.value}
													>
														{status.label}{' '}
														<span className='text-primary'>
															{status.value ===
															order.status
																? '(Current)'
																: ''}
														</span>
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
							</div>
							<DialogFooter className='sm:justify-start'>
								<Button
									type='button'
									variant='secondary'
									onClick={() =>
										updateOrderStatus(
											selectedStatus as OrderStatus,
											order.id,
										)
									}
								>
									Update Status
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6'>
				<div className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<Package className='w-5 h-5 mr-2 text-primary' />
								Load Details
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='space-y-4'>
									<div>
										<label className='text-sm font-medium text-gray-600'>
											Commodity
										</label>
										<p className='font-semibold text-gray-900'>
											{order.commodity}
										</p>
									</div>
									<div>
										<label className='text-sm font-medium text-gray-600'>
											Load Dimensions
										</label>
										<p className='font-semibold text-gray-900'>
											{order.loadDims}
										</p>
									</div>
									<div>
										<label className='text-sm font-medium text-gray-600'>
											Make/Model
										</label>
										<p className='font-semibold text-gray-900'>
											{order.makeModel || 'N/A'}
										</p>
									</div>
								</div>
								<div className='space-y-4'>
									<div>
										<label className='text-sm font-medium text-gray-600'>
											Serial Number
										</label>
										<p className='font-semibold text-gray-900'>
											{order.serial || 'N/A'}
										</p>
									</div>
									{order.singleMultiple && (
										<div>
											<label className='text-sm font-medium text-gray-600'>
												Quantity
											</label>
											<p className='font-semibold text-gray-900'>
												{order.singleMultiple} piece(s)
											</p>
										</div>
									)}
									<div>
										<label className='text-sm font-medium text-gray-600'>
											Weight is{' '}
											<span className='font-semibold text-primary'>
												{order.legalWeight === 'yes'
													? 'Legal'
													: 'Not Legal'}
											</span>
										</label>
									</div>
								</div>
							</div>

							<Separator />

							<div>
								<h4 className='font-semibold text-gray-900 mb-4 flex items-center'>
									<Ruler className='w-4 h-4 mr-2' />
									Dimensions
								</h4>
								<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
									<div className='bg-gray-50 rounded-lg p-3 text-center'>
										<p className='text-xs font-medium text-gray-600 mb-1'>
											LENGTH
										</p>
										<p className='font-bold text-gray-900'>
											{formatDimensions(
												order.lengthFt,
												order.lengthIn,
											)}
										</p>
									</div>
									<div className='bg-gray-50 rounded-lg p-3 text-center'>
										<p className='text-xs font-medium text-gray-600 mb-1'>
											WIDTH
										</p>
										<p className='font-bold text-gray-900'>
											{formatDimensions(
												order.widthFt,
												order.widthIn,
											)}
										</p>
									</div>
									<div className='bg-gray-50 rounded-lg p-3 text-center'>
										<p className='text-xs font-medium text-gray-600 mb-1'>
											HEIGHT
										</p>
										<p className='font-bold text-gray-900'>
											{formatDimensions(
												order.heightFt,
												order.heightIn,
											)}
										</p>
									</div>
									<div className='bg-gray-50 rounded-lg p-3 text-center'>
										<p className='text-xs font-medium text-gray-600 mb-1'>
											REAR OVERHANG
										</p>
										<p className='font-bold text-gray-900'>
											{formatDimensions(
												order.rearOverhangFt,
												order.rearOverhangIn,
											)}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{order.axleConfigs &&
						order.axleConfigs.length > 0 &&
						order.legalWeight === 'no' && (
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center text-lg'>
										<Ruler className='w-5 h-5 mr-2 text-primary' />
										Axle Configuration
									</CardTitle>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>
													Number of Axles
												</TableHead>
												{order.axleConfigs.map(
													(_, i) => (
														<TableHead
															key={i}
															className='text-center'
														>
															{i + 1}
														</TableHead>
													),
												)}
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableHead>
													No of Tires
												</TableHead>
												{order.axleConfigs.map(
													(config, i) => (
														<TableCell
															key={i}
															className='text-center'
														>
															{config.tires}
														</TableCell>
													),
												)}
											</TableRow>
											<TableRow>
												<TableHead>
													Axle Spacing
												</TableHead>
												<TableCell></TableCell>
												{order.axleConfigs
													.slice(1)
													.map((config, i) => (
														<TableCell
															key={i}
															className='text-center'
														>
															{config.spacing ||
																'—'}
														</TableCell>
													))}
											</TableRow>
											<TableRow>
												<TableHead>
													Tire Width
												</TableHead>
												{order.axleConfigs.map(
													(config, i) => (
														<TableCell
															key={i}
															className='text-center'
														>
															{config.tireWidth}
														</TableCell>
													),
												)}
											</TableRow>
											<TableRow>
												<TableHead>
													Axle Weights
												</TableHead>
												{order.axleConfigs.map(
													(config, i) => (
														<TableCell
															key={i}
															className='text-center font-semibold'
														>
															{config.weight.toLocaleString()}
														</TableCell>
													),
												)}
											</TableRow>
										</TableBody>
										<TableFooter>
											<TableRow className='bg-primary-50 font-semibold'>
												<TableCell className='text-left'>
													Gross Weight:
												</TableCell>
												<TableCell
													colSpan={
														order.axleConfigs.length
													}
													className='text-right font-semibold text-primary-600'
												>
													{order.axleConfigs
														.reduce(
															(
																sum: number,
																config,
															) =>
																sum +
																config.weight,
															0,
														)
														.toLocaleString()}{' '}
													lbs
												</TableCell>
											</TableRow>
										</TableFooter>
									</Table>
								</CardContent>
							</Card>
						)}

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<Route className='w-5 h-5 mr-2 text-primary' />
								Route Information
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='bg-gray-50 rounded-lg p-4 flex items-center justify-between'>
								<div className='flex items-center space-x-2'>
									<Calendar className='w-4 h-4 text-gray-500' />
									<span className='text-sm font-medium text-gray-600'>
										Permit Start Date
									</span>
								</div>
								<span className='font-semibold text-gray-900'>
									{formatDate(order.permitStartDate)}
								</span>
							</div>

							<RouteDisplay
								originAddress={order.originAddress}
								destinationAddress={order.destinationAddress}
								stops={order.stops}
							/>
						</CardContent>
					</Card>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center text-lg'>
									<Truck className='w-5 h-5 mr-2 text-blue-500' />
									Truck Details
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
									<div className='flex items-center space-x-3 mb-3'>
										<div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center'>
											<Truck className='w-5 h-5 text-white' />
										</div>
										<div>
											<h3 className='font-bold text-gray-900'>
												Unit #{order.truck.unitNumber}
											</h3>
											<p className='text-blue-600 font-semibold'>
												{order.truck.year}{' '}
												{order.truck.make}
											</p>
										</div>
									</div>
									<div className='grid grid-cols-2 gap-3'>
										<div className='bg-white/70 rounded-lg p-2'>
											<p className='text-xs font-medium text-gray-600'>
												License Plate
											</p>
											<div className='flex items-center space-x-1'>
												<p className='font-semibold text-gray-900'>
													{order.truck.licencePlate}
												</p>
												<Button
													variant='ghost'
													size='sm'
													className='h-4 w-4 p-0'
													onClick={() =>
														copyToClipboard(
															order.truck
																.licencePlate,
														)
													}
												>
													<Copy className='w-3 h-3' />
												</Button>
											</div>
										</div>
										<div className='bg-white/70 rounded-lg p-2'>
											<p className='text-xs font-medium text-gray-600'>
												State
											</p>
											<p className='font-semibold text-gray-900'>
												{order.truck.state}
											</p>
										</div>
										<div className='bg-white/70 rounded-lg p-2'>
											<p className='text-xs font-medium text-gray-600'>
												Axles
											</p>
											<p className='font-semibold text-gray-900'>
												{order.truck.nrOfAxles}
											</p>
										</div>
										<div className='bg-white/70 rounded-lg p-2'>
											<p className='text-xs font-medium text-gray-600'>
												VIN
											</p>
											<div className='flex items-center space-x-1'>
												<p className='font-semibold text-gray-900 text-xs'>
													{order.truck.vin}
												</p>
												<Button
													variant='ghost'
													size='sm'
													className='h-4 w-4 p-0'
													onClick={() =>
														copyToClipboard(
															order.truck.vin,
														)
													}
												>
													<Copy className='w-3 h-3' />
												</Button>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Trailer */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center text-lg'>
									<Package className='w-5 h-5 mr-2 text-purple-500' />
									Trailer Details
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='bg-purple-50 rounded-lg p-4 border border-purple-200'>
									<div className='flex items-center space-x-3 mb-3'>
										<div className='w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center'>
											<Package className='w-5 h-5 text-white' />
										</div>
										<div>
											<h3 className='font-bold text-gray-900'>
												Unit #{order.trailer.unitNumber}
											</h3>
											<p className='text-purple-600 font-semibold'>
												{order.trailer.year}{' '}
												{order.trailer.make}
											</p>
										</div>
									</div>
									<div className='grid grid-cols-2 gap-3'>
										<div className='bg-white/70 rounded-lg p-2'>
											<p className='text-xs font-medium text-gray-600'>
												License Plate
											</p>
											<div className='flex items-center space-x-1'>
												<p className='font-semibold text-gray-900'>
													{order.trailer.licencePlate}
												</p>
												<Button
													variant='ghost'
													size='sm'
													className='h-4 w-4 p-0'
													onClick={() =>
														copyToClipboard(
															order.trailer
																.licencePlate,
														)
													}
												>
													<Copy className='w-3 h-3' />
												</Button>
											</div>
										</div>
										<div className='bg-white/70 rounded-lg p-2'>
											<p className='text-xs font-medium text-gray-600'>
												State
											</p>
											<p className='font-semibold text-gray-900'>
												{order.trailer.state}
											</p>
										</div>
										<div className='bg-white/70 rounded-lg p-2'>
											<p className='text-xs font-medium text-gray-600'>
												Length
											</p>
											<p className='font-semibold text-gray-900'>
												{order.trailer.length}
											</p>
										</div>
										<div className='bg-white/70 rounded-lg p-2'>
											<p className='text-xs font-medium text-gray-600'>
												Type
											</p>
											<p className='font-semibold text-gray-900'>
												{order.trailer.type}
											</p>
										</div>
										<div className='bg-white/70 rounded-lg p-2 col-span-2'>
											<p className='text-xs font-medium text-gray-600'>
												VIN
											</p>
											<div className='flex items-center space-x-1'>
												<p className='font-semibold text-gray-900 text-xs'>
													{order.trailer.vin}
												</p>
												<Button
													variant='ghost'
													size='sm'
													className='h-4 w-4 p-0'
													onClick={() =>
														copyToClipboard(
															order.trailer.vin,
														)
													}
												>
													<Copy className='w-3 h-3' />
												</Button>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{role() !== UserRole.USER &&
						(order.carrierNumbers || order.companyInfo) && (
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center text-lg'>
										<Truck className='w-5 h-5 mr-2 text-green-500' />
										Carrier Information
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-6'>
									{order.carrierNumbers && (
										<div>
											<h4 className='font-semibold text-gray-900 mb-4 flex items-center'>
												<FileText className='w-4 h-4 mr-2' />
												Carrier Numbers
											</h4>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
												{order.carrierNumbers
													.mcNumber && (
													<div className='bg-gray-50 rounded-lg p-3'>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															MC Number
														</p>
														<div className='flex items-center space-x-1'>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.carrierNumbers
																		.mcNumber
																}
															</p>
															<Button
																variant='ghost'
																size='sm'
																className='h-4 w-4 p-0'
																onClick={() =>
																	copyToClipboard(
																		order.carrierNumbers!
																			.mcNumber!,
																	)
																}
															>
																<Copy className='w-3 h-3' />
															</Button>
														</div>
													</div>
												)}
												{order.carrierNumbers
													.dotNumber && (
													<div className='bg-gray-50 rounded-lg p-3'>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															DOT Number
														</p>
														<div className='flex items-center space-x-1'>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.carrierNumbers
																		.dotNumber
																}
															</p>
															<Button
																variant='ghost'
																size='sm'
																className='h-4 w-4 p-0'
																onClick={() =>
																	copyToClipboard(
																		order.carrierNumbers!
																			.dotNumber!,
																	)
																}
															>
																<Copy className='w-3 h-3' />
															</Button>
														</div>
													</div>
												)}
												{order.carrierNumbers
													.einNumber && (
													<div className='bg-gray-50 rounded-lg p-3'>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															EIN Number
														</p>
														<div className='flex items-center space-x-1'>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.carrierNumbers
																		.einNumber
																}
															</p>
															<Button
																variant='ghost'
																size='sm'
																className='h-4 w-4 p-0'
																onClick={() =>
																	copyToClipboard(
																		order.carrierNumbers!
																			.einNumber!,
																	)
																}
															>
																<Copy className='w-3 h-3' />
															</Button>
														</div>
													</div>
												)}
												{order.carrierNumbers
													.iftaNumber && (
													<div className='bg-gray-50 rounded-lg p-3'>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															IFTA Number
														</p>
														<div className='flex items-center space-x-1'>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.carrierNumbers
																		.iftaNumber
																}
															</p>
															<Button
																variant='ghost'
																size='sm'
																className='h-4 w-4 p-0'
																onClick={() =>
																	copyToClipboard(
																		order.carrierNumbers!
																			.iftaNumber!,
																	)
																}
															>
																<Copy className='w-3 h-3' />
															</Button>
														</div>
													</div>
												)}
												{order.carrierNumbers
													.orNumber && (
													<div className='bg-gray-50 rounded-lg p-3'>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															OR Number
														</p>
														<div className='flex items-center space-x-1'>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.carrierNumbers
																		.orNumber
																}
															</p>
															<Button
																variant='ghost'
																size='sm'
																className='h-4 w-4 p-0'
																onClick={() =>
																	copyToClipboard(
																		order.carrierNumbers!
																			.orNumber!,
																	)
																}
															>
																<Copy className='w-3 h-3' />
															</Button>
														</div>
													</div>
												)}
												{order.carrierNumbers
													.kyuNumber && (
													<div className='bg-gray-50 rounded-lg p-3'>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															KYU Number
														</p>
														<div className='flex items-center space-x-1'>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.carrierNumbers
																		.kyuNumber
																}
															</p>
															<Button
																variant='ghost'
																size='sm'
																className='h-4 w-4 p-0'
																onClick={() =>
																	copyToClipboard(
																		order.carrierNumbers!
																			.kyuNumber!,
																	)
																}
															>
																<Copy className='w-3 h-3' />
															</Button>
														</div>
													</div>
												)}
												{order.carrierNumbers
													.txNumber && (
													<div className='bg-gray-50 rounded-lg p-3'>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															TX Number
														</p>
														<div className='flex items-center space-x-1'>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.carrierNumbers
																		.txNumber
																}
															</p>
															<Button
																variant='ghost'
																size='sm'
																className='h-4 w-4 p-0'
																onClick={() =>
																	copyToClipboard(
																		order.carrierNumbers!
																			.txNumber!,
																	)
																}
															>
																<Copy className='w-3 h-3' />
															</Button>
														</div>
													</div>
												)}
												{order.carrierNumbers
													.tnNumber && (
													<div className='bg-gray-50 rounded-lg p-3'>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															TN Number
														</p>
														<div className='flex items-center space-x-1'>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.carrierNumbers
																		.tnNumber
																}
															</p>
															<Button
																variant='ghost'
																size='sm'
																className='h-4 w-4 p-0'
																onClick={() =>
																	copyToClipboard(
																		order.carrierNumbers!
																			.tnNumber!,
																	)
																}
															>
																<Copy className='w-3 h-3' />
															</Button>
														</div>
													</div>
												)}
												{order.carrierNumbers
													.laNumber && (
													<div className='bg-gray-50 rounded-lg p-3'>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															LA Number
														</p>
														<div className='flex items-center space-x-1'>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.carrierNumbers
																		.laNumber
																}
															</p>
															<Button
																variant='ghost'
																size='sm'
																className='h-4 w-4 p-0'
																onClick={() =>
																	copyToClipboard(
																		order.carrierNumbers!
																			.laNumber!,
																	)
																}
															>
																<Copy className='w-3 h-3' />
															</Button>
														</div>
													</div>
												)}
											</div>
											{order.carrierNumbers.notes && (
												<div className='mt-4'>
													<p className='text-xs font-medium text-gray-600 mb-1'>
														Notes
													</p>
													<p className='text-sm text-gray-900 bg-gray-50 rounded-lg p-3'>
														{
															order.carrierNumbers
																.notes
														}
													</p>
												</div>
											)}
											{order.carrierNumbers.files &&
												order.carrierNumbers.files
													.length > 0 && (
													<div className='mt-4'>
														<p className='text-xs font-medium text-gray-600 mb-2'>
															Carrier Files
														</p>
														<div className='space-y-2'>
															{order.carrierNumbers.files.map(
																(
																	file,
																	index,
																) => (
																	<div
																		key={
																			index
																		}
																		className='flex items-center justify-between p-2 border rounded'
																	>
																		<div className='flex items-center space-x-2'>
																			<FileText className='w-4 h-4 text-gray-400' />
																			<span
																				className='text-sm'
																				title={
																					file.filename
																				}
																			>
																				{truncate(
																					file.filename,
																					20,
																				)}
																			</span>
																		</div>
																		<Button
																			variant='ghost'
																			size='sm'
																			onClick={() =>
																				downloadCarrierFile(
																					file.filename,
																				)
																			}
																		>
																			<Download className='w-4 h-4' />
																		</Button>
																	</div>
																),
															)}
														</div>
													</div>
												)}
										</div>
									)}

									{order.companyInfo && (
										<div>
											<h4 className='font-semibold text-gray-900 mb-4 flex items-center'>
												<FileText className='w-4 h-4 mr-2' />
												Company Information
											</h4>
											<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
												<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
													<div>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															Company Name
														</p>
														<p className='font-semibold text-gray-900'>
															{
																order
																	.companyInfo
																	.name
															}
														</p>
													</div>
													{order.companyInfo.dba && (
														<div>
															<p className='text-xs font-medium text-gray-600 mb-1'>
																DBA
															</p>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.companyInfo
																		.dba
																}
															</p>
														</div>
													)}
												</div>
												<div>
													<p className='text-xs font-medium text-gray-600 mb-1'>
														Address
													</p>
													<p className='font-semibold text-gray-900'>
														{
															order.companyInfo
																.address
														}
														,{' '}
														{order.companyInfo.city}
														,{' '}
														{
															order.companyInfo
																.state
														}{' '}
														{order.companyInfo.zip}
													</p>
												</div>
												<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
													<div>
														<p className='text-xs font-medium text-gray-600 mb-1'>
															Phone
														</p>
														<div className='flex items-center space-x-1'>
															<p className='font-semibold text-gray-900'>
																{
																	order
																		.companyInfo
																		.phone
																}
															</p>
															<Button
																variant='ghost'
																size='sm'
																className='h-4 w-4 p-0'
																onClick={() =>
																	copyToClipboard(
																		order.companyInfo!
																			.phone,
																	)
																}
															>
																<Copy className='w-3 h-3' />
															</Button>
														</div>
													</div>
													{order.companyInfo.fax && (
														<div>
															<p className='text-xs font-medium text-gray-600 mb-1'>
																Fax
															</p>
															<div className='flex items-center space-x-1'>
																<p className='font-semibold text-gray-900'>
																	{
																		order
																			.companyInfo
																			.fax
																	}
																</p>
																<Button
																	variant='ghost'
																	size='sm'
																	className='h-4 w-4 p-0'
																	onClick={() =>
																		copyToClipboard(
																			order.companyInfo!
																				.fax!,
																		)
																	}
																>
																	<Copy className='w-3 h-3' />
																</Button>
															</div>
														</div>
													)}
												</div>
												<div>
													<p className='text-xs font-medium text-gray-600 mb-1'>
														Email
													</p>
													<div className='flex items-center space-x-1'>
														<p className='font-semibold text-gray-900'>
															{
																order
																	.companyInfo
																	.email
															}
														</p>
														<Button
															variant='ghost'
															size='sm'
															className='h-4 w-4 p-0'
															onClick={() =>
																copyToClipboard(
																	order.companyInfo!
																		.email,
																)
															}
														>
															<Copy className='w-3 h-3' />
														</Button>
													</div>
												</div>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						)}
				</div>

				<div className='space-y-6 sticky top-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<FileText className='w-5 h-5 mr-2 text-primary' />
								Order Summary
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div className='flex justify-between'>
								<span className='text-sm text-gray-600'>
									Order ID
								</span>
								<div className='flex items-center space-x-1'>
									<span className='font-medium text-gray-900'>
										{order.orderNumber}
									</span>
									<Button
										variant='ghost'
										size='sm'
										className='h-4 w-4 p-0'
										onClick={() =>
											copyToClipboard(order.orderNumber)
										}
									>
										<Copy className='w-3 h-3' />
									</Button>
								</div>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm text-gray-600'>
									Status
								</span>
								<Badge className={getStatusBadge(order.status)}>
									{formatStatus(order.status)}
								</Badge>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm text-gray-600'>
									Contact
								</span>
								<span className='font-medium text-gray-900'>
									{order.contact}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm text-gray-600'>
									Created
								</span>
								<span className='font-medium text-gray-900'>
									{new Date(
										order.createdAt,
									).toLocaleDateString()}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm text-gray-600'>
									Last Updated
								</span>
								<span className='font-medium text-gray-900'>
									{new Date(
										order.updatedAt,
									).toLocaleDateString()}
								</span>
							</div>
						</CardContent>
					</Card>

					<OrderChat orderId={order.id} />

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<FileText className='w-5 h-5 mr-2 text-primary' />
								Files ({order.files.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								{order.files.map((file, index) => (
									<div
										key={index}
										className='flex items-center justify-between p-2 border rounded'
									>
										<div className='flex items-center space-x-2'>
											<FileText className='w-4 h-4 text-gray-400' />
											<span
												className='text-sm'
												title={file.filename}
											>
												{truncate(file.filename, 20)}
											</span>
										</div>
										<Button
											variant='ghost'
											size='sm'
											onClick={() =>
												downloadOrderFile(
													order.id,
													file.filename,
												)
											}
										>
											<Download className='w-4 h-4' />
										</Button>
									</div>
								))}

								<FileUploader
									maxFileSize={10}
									acceptedTypes={[
										'pdf',
										'jpg',
										'jpeg',
										'png',
									]}
									uploadText='No files uploaded, upload a file'
									selectedFile={selectedFile}
									setSelectedFile={setSelectedFile}
								/>

								{selectedFile && (
									<Button
										variant='outline'
										size='sm'
										className='w-full'
										onClick={uploadFileToOrder}
									>
										<Upload className='w-4 h-4' />
										Upload to Order
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	)
}
