'use client'

import OrderChatLocal from '@/components/blocks/OrderChatLocal'
import RouteBuilder, { RouteFormData } from '@/components/elements/RouteBuilder'
import { SingleDatePicker } from '@/components/elements/SingleDatePicker'
import { EntitySelectModal } from '@/components/modals/EntitySelectModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { OrderPayload } from '@/lib/models/order.model'
import { TrailerDTO } from '@/lib/models/trailer.model'
import { TruckDTO } from '@/lib/models/truck.model'
import {
	orderFormDefaultValues,
	orderFormSchema,
} from '@/lib/schemas/order.schema'
import { createOrder } from '@/lib/services/orderService'
import { getTrailerById } from '@/lib/services/trailerService'
import { getTruckById } from '@/lib/services/truckService'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	CircleCheckBig,
	FileText,
	Loader2,
	Package,
	Truck as TruckIcon,
	Upload,
	User,
	X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type FormData = z.infer<typeof orderFormSchema>

export default function NewOrderForm() {
	const [truck, setTruck] = useState<TruckDTO | null>(null)
	const [trailer, setTrailer] = useState<TrailerDTO | null>(null)
	const [messages, setMessages] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<FormData>({
		resolver: zodResolver(orderFormSchema),
		defaultValues: orderFormDefaultValues,
	})

	const legalWeight = form.watch('legalWeight')
	const axleConfigs = form.watch('axleConfigs')
	const totalAxles = (truck?.nrOfAxles || 0) + (trailer?.nrOfAxles || 0)
	const grossWeight =
		axleConfigs?.reduce((sum, config) => sum + (config?.weight || 0), 0) ||
		0

	const updateAxleConfigs = useCallback(() => {
		if (legalWeight === 'no' && totalAxles > 0 && truck && trailer) {
			const currentConfigs = form.getValues('axleConfigs') || []

			const baseWeight = Math.floor(81000 / totalAxles)
			const remainder = 81000 % totalAxles
			const newConfigs = Array.from({ length: totalAxles }, (_, i) => ({
				tires: currentConfigs[i]?.tires || 4,
				tireWidth: currentConfigs[i]?.tireWidth || 0,
				weight: baseWeight + (i === 0 ? remainder : 0),
				spacing: i > 0 ? currentConfigs[i]?.spacing || '' : '',
			}))

			form.setValue('axleConfigs', newConfigs, { shouldValidate: false })
		} else {
			form.setValue('axleConfigs', [], { shouldValidate: false })
		}
	}, [legalWeight, totalAxles, truck, trailer, form])

	useEffect(() => {
		updateAxleConfigs()
	}, [legalWeight, totalAxles, truck, trailer, updateAxleConfigs])

	const handleSubmit = (data: FormData) => {
		if (!truck) {
			toast.warning('Please select a truck')
			return
		}

		if (!trailer) {
			toast.warning('Please select a trailer')
			return
		}

		setIsLoading(true)

		console.log(messages)

		const payload: OrderPayload = {
			...data,
			truckId: truck._id,
			trailerId: trailer._id,
			permitStartDate: data.permitStartDate.toISOString(),
			stops: data.stops,
			messages: messages,
		}

		newOrder(payload)
	}

	const newOrder = async (payload: OrderPayload) => {
		try {
			const { message } = await createOrder(payload)
			toast.success(message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleTruckSelect = async (id: string) => {
		const { data } = await getTruckById(id)
		setTruck(data)
	}

	const handleTrailerSelect = async (id: string) => {
		const { data } = await getTrailerById(id)
		setTrailer(data)
	}

	return (
		<div className='relative'>
			<div className='text-center mb-6 space-y-3'>
				<div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto'>
					<FileText className='w-8 h-8 text-primary' />
				</div>
				<h1 className='text-3xl font-bold  mb-2'>Create new Order</h1>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className='space-y-6'
				>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<User className='w-5 h-5 mr-2 text-primary' />
								Order Information
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormField
									control={form.control}
									name='contact'
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Contact{' '}
												<span className='text-red-500'>
													*
												</span>
											</FormLabel>
											<FormControl>
												<Input
													placeholder='Enter contact information'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='permitStartDate'
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Permit Start Date{' '}
												<span className='text-red-500'>
													*
												</span>
											</FormLabel>
											<FormControl>
												<SingleDatePicker
													onChange={field.onChange}
													minDate={new Date()}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<TruckIcon className='w-5 h-5 mr-2 text-primary' />
								Vehicle Selection
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='space-y-2'>
									{!truck && (
										<EntitySelectModal
											type='truck'
											onSelect={handleTruckSelect}
										>
											<div className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 hover:bg-primary-50/20 transition-all duration-200'>
												<div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'>
													<TruckIcon className='w-6 h-6 text-gray-400' />
												</div>
												<h3 className='text-lg font-semibold  mb-2'>
													No Truck Selected
												</h3>
												<p className='text-gray-500 mb-3'>
													Choose a truck from your
													fleet inventory
												</p>
												<Button type='button'>
													Select Truck
												</Button>
											</div>
										</EntitySelectModal>
									)}

									{truck && (
										<div className='relative bg-blue-50 rounded-xl p-4 border border-blue-500'>
											<div className='mb-3 flex items-center justify-between'>
												<div className='flex items-center space-x-3 mb-2'>
													<div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center'>
														<TruckIcon className='w-6 h-6 text-white' />
													</div>
													<div>
														<h3 className='text-lg font-bold '>
															Unit #
															{truck.unitNumber}
														</h3>
														<p className='text-blue-600 font-semibold text-sm'>
															{truck.year}{' '}
															{truck.make}
														</p>
													</div>
												</div>

												<EntitySelectModal
													type='truck'
													onSelect={handleTruckSelect}
												>
													<Button
														variant='outline'
														size='sm'
														type='button'
													>
														Change truck
													</Button>
												</EntitySelectModal>
											</div>
											<div className='grid grid-cols-2 gap-3'>
												<div className='bg-white/70 rounded-lg p-2 space-y-1'>
													<h6 className='text-xs font-medium text-gray-600 uppercase'>
														License Plate
													</h6>
													<p className='font-semibold '>
														{truck.licencePlate}
													</p>
												</div>
												<div className='bg-white/70 rounded-lg p-2 space-y-1'>
													<h6 className='text-xs font-medium text-gray-600 uppercase'>
														State
													</h6>
													<p className='font-semibold '>
														{truck.state}
													</p>
												</div>
												<div className='bg-white/70 rounded-lg p-2 space-y-1'>
													<h6 className='text-xs font-medium text-gray-600 uppercase'>
														Axles
													</h6>
													<p className='font-semibold '>
														{truck.nrOfAxles}
													</p>
												</div>
												<div className='bg-white/70 rounded-lg p-2 space-y-1'>
													<h6 className='text-xs font-medium text-gray-600 uppercase'>
														VIN Number
													</h6>
													<p className='font-semibold '>
														{truck.vin}
													</p>
												</div>
											</div>
										</div>
									)}
								</div>
								<div className='space-y-2'>
									{!trailer && (
										<EntitySelectModal
											type='trailer'
											onSelect={handleTrailerSelect}
										>
											<div className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 hover:bg-orange-50/20 transition-all duration-200'>
												<div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'>
													<Package className='w-6 h-6 text-gray-400' />
												</div>
												<h3 className='text-lg font-semibold  mb-2'>
													No Trailer Selected
												</h3>
												<p className='text-gray-500 mb-3'>
													Choose a trailer from your
													fleet inventory
												</p>
												<Button type='button'>
													Select Trailer
												</Button>
											</div>
										</EntitySelectModal>
									)}

									{trailer && (
										<div className='relative bg-purple-50 rounded-xl p-4 border border-purple-500'>
											<div className='mb-3 flex items-center justify-between'>
												<div className='flex items-center space-x-3 mb-2'>
													<div className='w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center'>
														<Package className='w-6 h-6 text-white' />
													</div>
													<div>
														<h3 className='text-lg font-bold '>
															{trailer.unitNumber
																? `Unit #${trailer.unitNumber}`
																: 'Trailer'}
														</h3>
														<p className='text-purple-600 font-semibold text-sm'>
															{trailer.year}{' '}
															{trailer.make}
														</p>
													</div>
												</div>

												<EntitySelectModal
													type='trailer'
													onSelect={
														handleTrailerSelect
													}
												>
													<Button
														variant='outline'
														size='sm'
														type='button'
													>
														Change trailer
													</Button>
												</EntitySelectModal>
											</div>
											<div className='grid grid-cols-2 gap-3'>
												<div className='bg-white/70 rounded-lg p-2 space-y-1'>
													<h6 className='text-xs font-medium text-gray-600 uppercase'>
														License Plate
													</h6>
													<p className='font-semibold '>
														{trailer.licencePlate ||
															'—'}
													</p>
												</div>
												<div className='bg-white/70 rounded-lg p-2 space-y-1'>
													<h6 className='text-xs font-medium text-gray-600 uppercase'>
														State
													</h6>
													<p className='font-semibold '>
														{trailer.state || '—'}
													</p>
												</div>
												<div className='bg-white/70 rounded-lg p-2 space-y-1'>
													<h6 className='text-xs font-medium text-gray-600 uppercase'>
														Length
													</h6>
													<p className='font-semibold '>
														{trailer.length
															? `${trailer.length}`
															: '—'}
													</p>
												</div>
												<div className='bg-white/70 rounded-lg p-2 space-y-1'>
													<h6 className='text-xs font-medium text-gray-600 uppercase'>
														Type
													</h6>
													<p className='font-semibold '>
														{trailer.type || '—'}
													</p>
												</div>
												<div className='bg-white/70 rounded-lg p-2 space-y-1'>
													<h6 className='text-xs font-medium text-gray-600 uppercase'>
														Axles
													</h6>
													<p className='font-semibold '>
														{trailer.nrOfAxles ||
															'—'}
													</p>
												</div>
												<div className='bg-white/70 rounded-lg p-2 space-y-1'>
													<h6 className='text-xs font-medium text-gray-600 uppercase'>
														VIN Number
													</h6>
													<p className='font-semibold '>
														{trailer.vin || '—'}
													</p>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<Package className='w-5 h-5 mr-2 text-primary' />
								Load Information
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<FormField
								control={form.control}
								name='commodity'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Commodity{' '}
											<span className='text-red-500'>
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter commodity description'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
								<div className='bg-gray-50 rounded-lg p-4 space-y-2'>
									<FormField
										control={form.control}
										name='loadDims'
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Load Dims{' '}
													<span className='text-red-500'>
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder='Enter load dimensions'
														{...field}
														className='bg-white font-medium'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className='bg-gray-50 rounded-lg p-4 space-y-2'>
									<FormLabel>
										Overall Length{' '}
										<span className='text-red-500'>*</span>
									</FormLabel>
									<div className='grid grid-cols-2 gap-2'>
										<FormField
											control={form.control}
											name='lengthFt'
											render={({ field }) => (
												<FormItem>
													<div className='flex items-center'>
														<FormControl>
															<Input
																type='number'
																placeholder='0'
																{...field}
																className='h-10 text-center rounded-r-none bg-white font-medium'
															/>
														</FormControl>
														<Button
															tabIndex={-1}
															variant='outline'
															className='text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent'
															type='button'
														>
															ft
														</Button>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='lengthIn'
											render={({ field }) => (
												<FormItem>
													<div className='flex items-center'>
														<FormControl>
															<Input
																type='number'
																placeholder='0'
																{...field}
																className='h-10 text-center rounded-r-none bg-white font-medium'
															/>
														</FormControl>
														<Button
															tabIndex={-1}
															variant='outline'
															className='text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent'
															type='button'
														>
															in
														</Button>
													</div>

													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<div className='bg-gray-50 rounded-lg p-4 space-y-2'>
									<FormLabel>
										Overall Width{' '}
										<span className='text-red-500'>*</span>
									</FormLabel>
									<div className='grid grid-cols-2 gap-2'>
										<FormField
											control={form.control}
											name='widthFt'
											render={({ field }) => (
												<FormItem>
													<div className='flex items-center'>
														<FormControl>
															<Input
																type='number'
																placeholder='0'
																{...field}
																className='h-10 text-center rounded-r-none bg-white font-medium'
															/>
														</FormControl>
														<Button
															tabIndex={-1}
															variant='outline'
															className='text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent'
															type='button'
														>
															ft
														</Button>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='widthIn'
											render={({ field }) => (
												<FormItem>
													<div className='flex items-center'>
														<FormControl>
															<Input
																type='number'
																placeholder='0'
																{...field}
																className='h-10 text-center rounded-r-none bg-white font-medium'
															/>
														</FormControl>
														<Button
															tabIndex={-1}
															variant='outline'
															className='text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent'
															type='button'
														>
															in
														</Button>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
								<div className='bg-gray-50 rounded-lg p-4 space-y-2'>
									<FormLabel>
										Overall Height{' '}
										<span className='text-red-500'>*</span>
									</FormLabel>

									<div className='grid grid-cols-2 gap-2'>
										<FormField
											control={form.control}
											name='heightFt'
											render={({ field }) => (
												<FormItem>
													<div className='flex items-center'>
														<FormControl>
															<Input
																type='number'
																placeholder='0'
																{...field}
																className='h-10 text-center rounded-r-none bg-white font-medium'
															/>
														</FormControl>
														<Button
															tabIndex={-1}
															variant='outline'
															className='text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent'
															type='button'
														>
															ft
														</Button>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='heightIn'
											render={({ field }) => (
												<FormItem>
													<div className='flex items-center'>
														<FormControl>
															<Input
																type='number'
																placeholder='0'
																{...field}
																className='h-10 text-center rounded-r-none bg-white font-medium'
															/>
														</FormControl>
														<Button
															tabIndex={-1}
															variant='outline'
															className='text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent'
															type='button'
														>
															in
														</Button>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<div className='bg-gray-50 rounded-lg p-4 space-y-2'>
									<FormLabel>
										Rear Overhang{' '}
										<span className='text-red-500'>*</span>
									</FormLabel>

									<div className='grid grid-cols-2 gap-2'>
										<FormField
											control={form.control}
											name='rearOverhangFt'
											render={({ field }) => (
												<FormItem>
													<div className='flex items-center'>
														<FormControl>
															<Input
																type='number'
																placeholder='0'
																{...field}
																className='h-10 text-center rounded-r-none bg-white font-medium'
															/>
														</FormControl>
														<Button
															tabIndex={-1}
															variant='outline'
															className='text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent'
															type='button'
														>
															ft
														</Button>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='rearOverhangIn'
											render={({ field }) => (
												<FormItem>
													<div className='flex items-center'>
														<FormControl>
															<Input
																type='number'
																placeholder='0'
																{...field}
																className='h-10 text-center rounded-r-none bg-white font-medium'
															/>
														</FormControl>
														<Button
															tabIndex={-1}
															variant='outline'
															className='text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent'
															type='button'
														>
															in
														</Button>
													</div>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
								<FormField
									control={form.control}
									name='makeModel'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Make/Model</FormLabel>
											<FormControl>
												<Input
													placeholder='Enter make and model'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='serial'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Serial#</FormLabel>
											<FormControl>
												<Input
													placeholder='Enter serial number'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='singleMultiple'
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Single/Multiple pcs
											</FormLabel>
											<FormControl>
												<Input
													placeholder='Enter quantity'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name='legalWeight'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Legal Weight?</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												value={field.value}
												className='flex space-x-4'
											>
												<div className='flex items-center space-x-1.5'>
													<RadioGroupItem
														value='yes'
														id='yes'
													/>
													<FormLabel htmlFor='yes'>
														Yes
													</FormLabel>
												</div>
												<div className='flex items-center space-x-1.5'>
													<RadioGroupItem
														value='no'
														id='no'
													/>
													<FormLabel htmlFor='no'>
														No
													</FormLabel>
												</div>
											</RadioGroup>
										</FormControl>
										{legalWeight === 'no' &&
											(!truck || !trailer) && (
												<p className='text-amber-600 font-medium text-sm'>
													Please select a truck and
													trailer before adding axle
													configuration
												</p>
											)}
										<FormMessage />
									</FormItem>
								)}
							/>

							{legalWeight === 'no' &&
								truck &&
								trailer &&
								axleConfigs &&
								axleConfigs.length > 0 && (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>
													Number of Axles
												</TableHead>
												{axleConfigs.map((_, i) => (
													<TableHead
														key={i}
														className='text-center'
													>
														{i + 1}
													</TableHead>
												))}
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableHead>
													No of Tires
												</TableHead>
												{axleConfigs.map(
													(config, i) => (
														<TableCell key={i}>
															<FormField
																control={
																	form.control
																}
																name={`axleConfigs.${i}.tires`}
																render={({
																	field,
																}) => (
																	<FormItem>
																		<FormControl>
																			<Input
																				type='number'
																				{...field}
																				value={
																					field.value ||
																					config.tires
																				}
																				onChange={e =>
																					field.onChange(
																						parseInt(
																							e
																								.target
																								.value,
																						) ||
																							0,
																					)
																				}
																				className='text-center'
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</TableCell>
													),
												)}
											</TableRow>
											<TableRow>
												<TableHead>
													Axle Spacing
												</TableHead>
												<TableCell></TableCell>
												{axleConfigs
													.slice(1)
													.map((config, i) => (
														<TableCell key={i}>
															<FormField
																control={
																	form.control
																}
																name={`axleConfigs.${
																	i + 1
																}.spacing`}
																render={({
																	field,
																}) => (
																	<FormItem>
																		<FormControl>
																			<Input
																				type='text'
																				{...field}
																				value={
																					field.value ||
																					config.spacing ||
																					0
																				}
																				className='text-center'
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</TableCell>
													))}
											</TableRow>
											<TableRow>
												<TableHead>
													Tire Width
												</TableHead>
												{axleConfigs.map(
													(config, i) => (
														<TableCell key={i}>
															<FormField
																control={
																	form.control
																}
																name={`axleConfigs.${i}.tireWidth`}
																render={({
																	field,
																}) => (
																	<FormItem>
																		<FormControl>
																			<Input
																				type='number'
																				{...field}
																				value={
																					field.value ||
																					config.tireWidth
																				}
																				onChange={e =>
																					field.onChange(
																						parseFloat(
																							e
																								.target
																								.value,
																						) ||
																							0,
																					)
																				}
																				className='text-center'
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</TableCell>
													),
												)}
											</TableRow>
											<TableRow>
												<TableHead>
													Axle Weights
												</TableHead>
												{axleConfigs.map(
													(config, i) => (
														<TableCell key={i}>
															<FormField
																control={
																	form.control
																}
																name={`axleConfigs.${i}.weight`}
																render={({
																	field,
																}) => (
																	<FormItem>
																		<FormControl>
																			<Input
																				type='number'
																				{...field}
																				value={
																					field.value ||
																					config.weight
																				}
																				onChange={e =>
																					field.onChange(
																						parseInt(
																							e
																								.target
																								.value,
																						) ||
																							0,
																					)
																				}
																				className='text-center'
																			/>
																		</FormControl>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</TableCell>
													),
												)}
											</TableRow>
										</TableBody>
										<TableFooter>
											<TableRow>
												<TableCell>
													Gross Weight:
												</TableCell>
												<TableCell
													colSpan={axleConfigs.length}
													className='text-right'
												>
													{grossWeight}lbs
												</TableCell>
											</TableRow>
										</TableFooter>
									</Table>
								)}
						</CardContent>
					</Card>

					<RouteBuilder
						form={form as unknown as UseFormReturn<RouteFormData>}
					/>

					<FormField
						control={form.control}
						name='stops'
						render={({ field }) => (
							<FormItem className='hidden'>
								<FormControl>
									<Input
										{...field}
										value={
											field.value
												? JSON.stringify(field.value)
												: ''
										}
										onChange={e => {
											try {
												const parsed = JSON.parse(
													e.target.value,
												)
												field.onChange(parsed)
											} catch {
												field.onChange([])
											}
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<OrderChatLocal
						setMessages={setMessages}
						messages={messages}
					/>

					<Card>
						<CardHeader className='block'>
							<CardTitle className='flex items-center text-lg'>
								<Upload className='w-5 h-5 mr-2 text-primary' />
								List of files for #
							</CardTitle>
						</CardHeader>

						<CardContent className='space-y-4'>
							<FormField
								control={form.control}
								name='files'
								render={({ field }) => (
									<FormItem>
										<div className='min-h-[80px] border-2 border-dashed rounded-lg p-4'>
											{field.value &&
											Array.isArray(field.value) &&
											field.value.length > 0 ? (
												<div className='space-y-2'>
													<p className='text-sm font-medium text-gray-700'>
														Selected files:
													</p>
													{(
														field.value as File[]
													)?.map(
														(
															file: File,
															index: number,
														) => (
															<div
																key={index}
																className='flex items-center justify-between bg-gray-50 rounded-lg p-2'
															>
																<div className='flex items-center space-x-2'>
																	<FileText className='w-4 h-4 text-gray-500' />
																	<span className='text-sm text-gray-700'>
																		{
																			file.name
																		}
																	</span>
																</div>
																<div className='flex items-center space-x-2'>
																	<span className='text-xs text-gray-500'>
																		{(
																			file.size /
																			(1024 *
																				1024)
																		).toFixed(
																			2,
																		)}{' '}
																		MB
																	</span>
																	<Button
																		type='button'
																		variant='ghost'
																		size='sm'
																		onClick={() => {
																			const newFiles =
																				(
																					field.value as File[]
																				)?.filter(
																					(
																						_: File,
																						i: number,
																					) =>
																						i !==
																						index,
																				)
																			field.onChange(
																				newFiles,
																			)
																		}}
																		className='h-6 w-6 p-0 text-destructive hover:text-destructive/80'
																	>
																		<X className='w-4 h-4' />
																	</Button>
																</div>
															</div>
														),
													)}
												</div>
											) : (
												<div className='flex flex-col items-center justify-center text-gray-500 space-y-1'>
													<div>
														No files associated with
														this order
													</div>
													<div className='text-xs text-gray-400'>
														Maximum file size: 10MB
														per file
													</div>
												</div>
											)}

											<div className='flex justify-center mt-2'>
												<Button
													className=' relative'
													type='button'
												>
													<FormField
														control={form.control}
														name='files'
														render={({ field }) => (
															<FormItem className='opacity-0 absolute w-full h-full'>
																<FormControl>
																	<Input
																		type='file'
																		multiple
																		onChange={e => {
																			const files =
																				Array.from(
																					e
																						.target
																						.files ||
																						[],
																				)

																			const maxSize =
																				10 *
																				1024 *
																				1024
																			const oversizedFiles =
																				files.filter(
																					file =>
																						file.size >
																						maxSize,
																				)

																			if (
																				oversizedFiles.length >
																				0
																			) {
																				const fileNames =
																					oversizedFiles
																						.map(
																							file =>
																								file.name,
																						)
																						.join(
																							', ',
																						)
																				toast.error(
																					`Files larger than 10MB: ${fileNames}`,
																				)
																				return
																			}

																			field.onChange(
																				files,
																			)
																		}}
																		onBlur={
																			field.onBlur
																		}
																		name={
																			field.name
																		}
																		ref={
																			field.ref
																		}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<Upload className='w-4 h-4' />
													Upload File
												</Button>
											</div>
										</div>
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* <Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<Calculator className='w-5 h-5 mr-2 text-primary' />
								Approximate Costs
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='font-semibold'>
											State
										</TableHead>
										<TableHead className='text-right font-semibold'>
											Oversize
										</TableHead>
										<TableHead className='text-right font-semibold'>
											Overweight
										</TableHead>
										<TableHead className='text-right font-semibold'>
											Superload
										</TableHead>
										<TableHead className='text-right font-semibold'>
											Service Fee
										</TableHead>
										<TableHead className='text-right font-semibold'>
											Escort
										</TableHead>
										<TableHead className='text-right font-semibold'>
											Distance
										</TableHead>
										<TableHead className='text-right font-semibold'>
											Total
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableFooter>
									<TableRow className='bg-orange-50 font-semibold text-right'>
										<TableCell className='text-left'>
											Totals
										</TableCell>
										<TableCell>$0</TableCell>
										<TableCell>$0</TableCell>
										<TableCell>??</TableCell>
										<TableCell>$0</TableCell>
										<TableCell>$0</TableCell>
										<TableCell>0 mi</TableCell>
										<TableCell>$0</TableCell>
									</TableRow>
								</TableFooter>
							</Table>
						</CardContent>
					</Card> */}

					<div className='sticky -mx-6 bottom-0 left-0 right-0 -mb-6 mt-6 bg-white p-4 border-t border-gray-200 flex gap-4 items-center justify-end'>
						<Button type='submit'>
							{isLoading ? (
								<>
									<Loader2 className='w-4 h-4 animate-spin' />
									Submitting...
								</>
							) : (
								<>
									<CircleCheckBig className='w-4 h-4' />
									Submit Order
								</>
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
