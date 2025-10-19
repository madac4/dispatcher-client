'use client'

import RouteBuilder, { RouteFormData } from '@/components/elements/RouteBuilder'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { quoteFormDefaultValues, quoteFormSchema } from '@/lib/schemas/quote.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calculator, Loader2, Package, Save, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type FormData = z.infer<typeof quoteFormSchema>

export default function QuotePage() {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isCalculated, setIsCalculated] = useState<boolean>(false)

	const form = useForm<FormData>({
		resolver: zodResolver(quoteFormSchema),
		defaultValues: quoteFormDefaultValues,
	})

	// Reset isCalculated when form values change
	useEffect(() => {
		const subscription = form.watch(() => {
			if (isCalculated) {
				setIsCalculated(false)
			}
		})
		return () => subscription.unsubscribe()
	}, [form, isCalculated])

	const handleSubmit = (data: FormData) => {
		setIsLoading(true)
		console.log('Calculating quote...', data)

		setTimeout(() => {
			setIsLoading(false)
			setIsCalculated(true)
			toast.success('Quote calculated successfully!')
		}, 2000)
	}

	const handleSaveQuote = () => {
		console.log('Saving quote...', form.getValues())
		toast.success('Quote saved successfully!')
	}

	const handlePlaceOrder = () => {
		console.log('Placing order...', form.getValues())
		toast.success('Order placed successfully!')
	}

	return (
		<div className='relative'>
			<div className='text-center mb-6'>
				<div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
					<Calculator className='w-8 h-8 text-primary' />
				</div>
				<h1 className='text-3xl font-bold text-gray-900 mb-2'>Quote Calculator</h1>
				<p className='text-gray-600'>Calculate shipping costs for your oversized loads</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<Package className='w-5 h-5 mr-2 text-primary' />
								Load Dimensions
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
								<div className='bg-gray-50 rounded-lg p-4 space-y-2'>
									<FormLabel>
										Overall Length <span className='text-red-500'>*</span>
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
										Overall Width <span className='text-red-500'>*</span>
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
										Overall Height <span className='text-red-500'>*</span>
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

								<div className='bg-primary-50 rounded-lg p-4 space-y-2'>
									<FormLabel>
										Overall Weight <span className='text-red-500'>*</span>
									</FormLabel>
									<FormField
										control={form.control}
										name='weight'
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
														variant='outline'
														className='text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent'
														type='button'
													>
														Pounds (lbs)
													</Button>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<RouteBuilder form={form as unknown as UseFormReturn<RouteFormData>} />

					<FormField
						control={form.control}
						name='stops'
						render={({ field }) => (
							<FormItem className='hidden'>
								<FormControl>
									<Input
										{...field}
										value={field.value ? JSON.stringify(field.value) : ''}
										onChange={e => {
											try {
												const parsed = JSON.parse(e.target.value)
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

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center text-lg'>
								<Calculator className='w-5 h-5 mr-2 text-primary' />
								Route Pricing Breakdown
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='rounded-md border'>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className='font-semibold'>State</TableHead>
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
									<TableBody>
										<TableRow>
											<TableCell className='font-medium'>
												<div>
													New York
													<div className='flex items-center mt-1'>
														<div className='w-2 h-2 bg-blue-500 rounded-full mr-1'></div>
														<div className='w-2 h-2 bg-gray-400 rounded-full'></div>
													</div>
												</div>
											</TableCell>
											<TableCell className='text-right'>61.00</TableCell>
											<TableCell className='text-right'>0.00</TableCell>
											<TableCell className='text-right text-gray-500'>??</TableCell>
											<TableCell className='text-right'>120.00</TableCell>
											<TableCell className='text-right'>9.00</TableCell>
											<TableCell className='text-right'>1.80</TableCell>
											<TableCell className='text-right font-semibold'>$190.00</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-medium'>
												<div>
													New Jersey
													<div className='flex items-center mt-1'>
														<div className='w-2 h-2 bg-gray-400 rounded-full'></div>
													</div>
												</div>
											</TableCell>
											<TableCell className='text-right'>23.10</TableCell>
											<TableCell className='text-right'>0.00</TableCell>
											<TableCell className='text-right text-gray-500'>??</TableCell>
											<TableCell className='text-right'>120.00</TableCell>
											<TableCell className='text-right'>344.72</TableCell>
											<TableCell className='text-right'>68.94</TableCell>
											<TableCell className='text-right font-semibold'>$487.82</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-medium'>
												<div>
													Pennsylvania
													<div className='flex items-center mt-1'>
														<div className='w-2 h-2 bg-blue-500 rounded-full mr-1'></div>
														<div className='w-2 h-2 bg-primary rounded-full mr-1'></div>
														<div className='w-2 h-2 bg-gray-400 rounded-full'></div>
													</div>
												</div>
											</TableCell>
											<TableCell className='text-right'>81.00</TableCell>
											<TableCell className='text-right'>0.00</TableCell>
											<TableCell className='text-right text-gray-500'>??</TableCell>
											<TableCell className='text-right'>70.00</TableCell>
											<TableCell className='text-right'>497.65</TableCell>
											<TableCell className='text-right'>199.06</TableCell>
											<TableCell className='text-right font-semibold'>$648.65</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-medium'>
												<div>
													Maryland
													<div className='flex items-center mt-1'>
														<div className='w-2 h-2 bg-primary rounded-full mr-1'></div>
														<div className='w-2 h-2 bg-gray-400 rounded-full'></div>
													</div>
												</div>
											</TableCell>
											<TableCell className='text-right'>38.00</TableCell>
											<TableCell className='text-right'>0.00</TableCell>
											<TableCell className='text-right text-gray-500'>??</TableCell>
											<TableCell className='text-right'>120.00</TableCell>
											<TableCell className='text-right'>368.34</TableCell>
											<TableCell className='text-right'>73.67</TableCell>
											<TableCell className='text-right font-semibold'>$526.34</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-medium'>District of Columbia</TableCell>
											<TableCell className='text-right'>0.00</TableCell>
											<TableCell className='text-right'>0.00</TableCell>
											<TableCell className='text-right text-gray-500'>??</TableCell>
											<TableCell className='text-right'>0.00</TableCell>
											<TableCell className='text-right'>0.00</TableCell>
											<TableCell className='text-right'>5.90</TableCell>
											<TableCell className='text-right font-semibold'>$0.00</TableCell>
										</TableRow>
									</TableBody>
									<TableFooter>
										<TableRow className='bg-primary-50 hover:bg-primary-50'>
											<TableCell className='font-bold text-gray-900 text-lg'>Totals</TableCell>
											<TableCell className='text-right font-bold text-primary-600'>
												$203.10
											</TableCell>
											<TableCell className='text-right font-bold text-primary-600'>$0</TableCell>
											<TableCell className='text-right font-bold text-gray-500'>??</TableCell>
											<TableCell className='text-right font-bold text-primary-600'>
												$430.00
											</TableCell>
											<TableCell className='text-right font-bold text-primary-600'>
												$1219.71
											</TableCell>
											<TableCell className='text-right font-bold text-primary-600'>
												349.4 mi
											</TableCell>
											<TableCell className='text-right font-bold text-primary-600 text-xl'>
												$1852.81
											</TableCell>
										</TableRow>
									</TableFooter>
								</Table>
							</div>
						</CardContent>
					</Card>

					<div className='sticky -mx-6 bottom-0 left-0 right-0 -mb-6 mt-6 bg-white p-4 border-t border-gray-200 flex gap-4 items-center justify-end'>
						{!isCalculated ? (
							<Button type='submit'>
								{isLoading ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Calculating...
									</>
								) : (
									<>
										<Calculator className='w-4 h-4' />
										Calculate Quote
									</>
								)}
							</Button>
						) : (
							<>
								<Button type='button' variant='outline' onClick={handleSaveQuote}>
									<Save className='w-4 h-4' />
									Save Quote
								</Button>
								<Button type='button' onClick={handlePlaceOrder}>
									<Send className='w-4 h-4' />
									Place Order
								</Button>
							</>
						)}
					</div>
				</form>
			</Form>
		</div>
	)
}
