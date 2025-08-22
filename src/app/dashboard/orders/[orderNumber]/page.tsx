'use client'

import RouteDisplay from '@/components/elements/RouteDisplay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { OrderDTO } from '@/lib/models/order.model'
import { getOrderByNumber } from '@/lib/services/orderService'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import {
	ArrowLeft,
	Calendar,
	Copy,
	Edit,
	ExternalLink,
	FileText,
	Loader2,
	Package,
	Route,
	Ruler,
	Send,
	Trash,
	Truck,
	X,
	Zap,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function OrderDetailsPage() {
	const { orderNumber } = useParams()
	const router = useRouter()
	const [order, setOrder] = useState<OrderDTO | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (orderNumber) {
			fetchOrder(orderNumber as string)
		}
	}, [orderNumber])

	const fetchOrder = async (number: string) => {
		try {
			setLoading(true)
			const { data } = await getOrderByNumber(number)
			setOrder(data)
		} catch (error) {
			console.error('Error fetching order:', error)
			toast.error('Failed to load order details')
		} finally {
			setLoading(false)
		}
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const formatDimensions = (ft: number, inches: number) => {
		if (ft === 0 && inches === 0) return 'Not specified'
		return `${ft}' ${inches}"`
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		toast.success(`${text} copied to clipboard`)
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
					<div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center'>
						<FileText size='16' className='text-orange-500' />
					</div>

					<div>
						<div className='flex items-center gap-3'>
							<h1 className='text-2xl font-bold'>
								{order.orderNumber}
							</h1>
							<Badge className={`border font-medium`}>
								{order.status}
							</Badge>
						</div>
						<p className='text-gray-600'>
							Created on {formatDate(order.createdAt)}
						</p>
					</div>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' size='md'>
							<Zap size='16' />
							Quick Actions
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							<Edit size='16' />
							Edit Order
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Copy size='16' />
							Duplicate Order
						</DropdownMenuItem>
						<DropdownMenuItem>
							<X size='16' />
							Cancel Order
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Trash size='16' />
							Delete Order
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6'>
				<div className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<Package className='w-5 h-5 mr-2 text-orange-500' />
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
											{order.makeModel}
										</p>
									</div>
								</div>
								<div className='space-y-4'>
									<div>
										<label className='text-sm font-medium text-gray-600'>
											Serial Number
										</label>
										<p className='font-semibold text-gray-900'>
											{order.serial}
										</p>
									</div>
									<div>
										<label className='text-sm font-medium text-gray-600'>
											Quantity
										</label>
										<p className='font-semibold text-gray-900'>
											{order.singleMultiple} piece(s)
										</p>
									</div>
									<div>
										<label className='text-sm font-medium text-gray-600'>
											Legal Weight
										</label>
										<Badge
											variant={
												order.legalWeight === 'yes'
													? 'default'
													: 'destructive'
											}
										>
											{order.legalWeight === 'yes'
												? 'Yes'
												: 'No'}
										</Badge>
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

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<Route className='w-5 h-5 mr-2 text-orange-500' />
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
						{/* Truck */}
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
				</div>

				<div className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<FileText className='w-5 h-5 mr-2 text-orange-500' />
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
								<Badge className={`border font-medium`}>
									{order.status}
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

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<Send className='w-5 h-5 mr-2 text-orange-500' />
								Add a message to the order
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<Textarea
								placeholder='Type your message'
								className='min-h-[80px] resize-none'
							/>
							<Button className='w-full'>
								<Send className='w-4 h-4' />
								Send
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<FileText className='w-5 h-5 mr-2 text-orange-500' />
								Files ({order.files.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							{order.files.length === 0 ? (
								<div className='text-center py-8'>
									<FileText className='w-12 h-12 text-gray-300 mx-auto mb-3' />
									<p className='text-gray-500 text-sm'>
										No files uploaded
									</p>
									<Button
										variant='outline'
										size='sm'
										className='mt-3 bg-transparent'
									>
										Upload Files
									</Button>
								</div>
							) : (
								<div className='space-y-2'>
									{order.files.map((file, index) => (
										<div
											key={index}
											className='flex items-center justify-between p-2 border rounded'
										>
											<div className='flex items-center space-x-2'>
												<FileText className='w-4 h-4 text-gray-400' />
												<span className='text-sm'>
													{file.filename}
												</span>
											</div>
											<Button variant='ghost' size='sm'>
												<ExternalLink className='w-4 h-4' />
											</Button>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	)
}
