'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	ArrowRight,
	Award,
	CheckCircle,
	Clock,
	FileText,
	Mail,
	MapPin,
	Phone,
	Shield,
	Star,
	Truck,
	Users,
	Zap,
} from 'lucide-react'
import Image from 'next/image'

export default function Homepage() {
	return (
		<>
			<section className='relative bg-gradient-to-br from-gray-50 via-white to-orange-50 py-20 overflow-hidden'>
				<div className='absolute inset-0'>
					<div
						className='absolute inset-0'
						style={{
							backgroundImage: `url("/grid.svg")`,
						}}
					></div>
				</div>

				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
					<div className='text-center max-w-5xl mx-auto'>
						<div className='flex items-center justify-center space-x-4 mb-6'>
							<Badge variant='secondary' className='bg-green-100 text-green-800 border-green-200'>
								<CheckCircle className='w-3 h-3 mr-1' />
								20+ Years Experience
							</Badge>
							<Badge variant='secondary' className='bg-blue-100 text-blue-800 border-blue-200'>
								<Star className='w-3 h-3 mr-1' />
								Trusted by 1000+ Companies
							</Badge>
							<Badge variant='secondary' className='bg-purple-100 text-purple-800 border-purple-200'>
								<Zap className='w-3 h-3 mr-1' />
								24/7 Support
							</Badge>
						</div>

						<h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight'>
							Welcome to{' '}
							<span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600'>
								OSOW EXPRESS
							</span>
						</h1>

						<div className='text-xl md:text-2xl text-gray-200 mb-6 font-medium'>
							Your one-stop solution for all your
						</div>

						<div className='text-2xl md:text-3xl font-bold text-white mb-8'>
							<span className='text-orange-500'>Oversize</span> •{' '}
							<span className='text-orange-500'>Overweight</span> •{' '}
							<span className='text-orange-500'>High Value</span>
							<br />
							Permitting & Insurance Needs
						</div>

						<p className='text-lg md:text-xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed'>
							Whether you need a single-state routine permit or complex multi-state transportation
							requiring additional insurance, escorts, and route surveys — we&apos;re here to make it
							seamless.
						</p>

						<div className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6'>
							<Button
								size='lg'
								className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200'
							>
								<Phone className='w-5 h-5 mr-2' />
								Call Now: 833 553 0343
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section className='bg-white py-16 border-b border-gray-100'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
						<div className='text-center'>
							<div className='text-3xl md:text-4xl font-bold text-orange-500 mb-2'>20+</div>
							<div className='text-gray-600 font-medium'>Years Experience</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl md:text-4xl font-bold text-orange-500 mb-2'>50K+</div>
							<div className='text-gray-600 font-medium'>Permits Processed</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl md:text-4xl font-bold text-orange-500 mb-2'>1000+</div>
							<div className='text-gray-600 font-medium'>Happy Clients</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl md:text-4xl font-bold text-orange-500 mb-2'>24/7</div>
							<div className='text-gray-600 font-medium'>Support Available</div>
						</div>
					</div>
				</div>
			</section>

			<section className='bg-gradient-to-br from-gray-50 to-white py-20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Precision in Every Detail</h2>
						<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
							Our expert team analyzes every aspect of your load to ensure safe, legal, and efficient
							transportation.
						</p>
					</div>

					<Image
						src='/overloaded-truck.jpg'
						alt='Technical truck and trailer diagram with precise measurements'
						className='w-full h-auto rounded-2xl'
						width={500}
						height={400}
					/>
				</div>
			</section>

			<section className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 relative overflow-hidden'>
				<div className='absolute inset-0'>
					<div
						className='absolute inset-0'
						style={{
							backgroundImage: `url("/grid.svg")`,
						}}
					></div>
				</div>

				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
					<div className='text-center mb-16'>
						<h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
							How it works:{' '}
							<span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500'>
								It&apos;s Easy
							</span>
						</h2>
						<p className='text-xl text-gray-300 max-w-3xl mx-auto'>
							Our streamlined process gets you from inquiry to permit in record time
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12'>
						{[
							{
								step: 1,
								icon: Users,
								title: 'Account Setup/Login',
								description:
									'Create your account or login to get started with our streamlined application process.',
								color: 'from-blue-500 to-blue-600',
							},
							{
								step: 2,
								icon: FileText,
								title: 'Choose a Product',
								description:
									'Select permitting, staff insurance or superload services based on your specific needs.',
								color: 'from-green-500 to-green-600',
							},
							{
								step: 3,
								icon: Mail,
								title: 'Send us a Request',
								description:
									'Fill out our simple form and upload any documents that are required for processing.',
								color: 'from-purple-500 to-purple-600',
							},
							{
								step: 4,
								icon: Phone,
								title: 'Get Your Quote',
								description:
									'Our experienced team reviews your request and provides you with a detailed quote.',
								color: 'from-orange-500 to-orange-600',
							},
							{
								step: 5,
								icon: CheckCircle,
								title: 'Sit Back and Relax',
								description:
									'We take care of everything while you focus on what you do best - moving freight safely.',
								color: 'from-emerald-500 to-emerald-600',
							},
						].map((item, index) => (
							<div key={index} className='text-center group'>
								<div className='relative mb-6'>
									<div
										className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300`}
									>
										<item.icon className='w-10 h-10 text-white' />
									</div>
									<div className='absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg'>
										<span className='text-sm font-bold text-gray-900'>{item.step}</span>
									</div>
								</div>
								<h3 className='text-white font-bold text-lg mb-3 group-hover:text-orange-400 transition-colors'>
									{item.title}
								</h3>
								<p className='text-gray-300 text-sm leading-relaxed'>{item.description}</p>
							</div>
						))}
					</div>

					<div className='text-center mt-16'>
						<Button
							size='lg'
							className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-10 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200'
						>
							<Phone className='w-5 h-5 mr-2' />
							Start Your Journey: 833 553 0343
						</Button>
					</div>
				</div>
			</section>

			<section className='bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<Badge className='bg-orange-100 text-orange-800 border-orange-200 mb-4'>
							OSOW EXPRESS SOLUTIONS
						</Badge>
						<h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
							Always Quick, Accurate, No Hassle
						</h2>
						<p className='text-xl text-gray-600 max-w-4xl mx-auto'>
							Comprehensive products for all your oversize, overweight and high-value shipment needs
						</p>
					</div>

					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						{[
							{
								icon: FileText,
								title: 'Permits',
								description:
									"Oversize load regulations require specialized truck routing prior to departure. Our experienced permit analysts handle all paperwork and ensure your load moves safely and legally. Whether routine or complex, we've got you covered.",
								features: [
									'Multi-state routing',
									'24/7 processing',
									'Expert analysis',
									'Legal compliance',
								],
								color: 'from-blue-500 to-blue-600',
								bgColor: 'from-blue-50 to-blue-100',
							},
							{
								icon: Shield,
								title: 'Insurance',
								description:
									"Protect shipments valued above your cargo policy limit. Don't risk losing thousands because of inadequate coverage. Our experienced team provides instant access to cargo coverage when you need it most.",
								features: ['High-value coverage', 'Instant quotes', 'Flexible terms', 'Claims support'],
								color: 'from-green-500 to-green-600',
								bgColor: 'from-green-50 to-green-100',
							},
							{
								icon: Truck,
								title: 'Superloads',
								description:
									'When shipments exceed routine oversize dimensions, specialized handling is required. Our highly experienced team manages police escorts, pilot cars, and highway studies to ensure on-time, budget-friendly delivery.',
								features: [
									'Route surveys',
									'Escort coordination',
									'Permit management',
									'Expert logistics',
								],
								color: 'from-purple-500 to-purple-600',
								bgColor: 'from-purple-50 to-purple-100',
							},
						].map((service, index) => (
							<Card
								key={index}
								className='group hover:shadow-2xl transition-all duration-300 p-0 border-0 overflow-hidden'
							>
								<CardContent className='p-0'>
									<div className={`bg-gradient-to-br ${service.bgColor} p-8 text-center`}>
										<div
											className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
										>
											<service.icon className='w-8 h-8 text-white' />
										</div>
										<h3 className='text-2xl font-bold text-gray-900'>{service.title}</h3>
									</div>

									<div className='p-6'>
										<p className='text-gray-600 leading-relaxed mb-6'>{service.description}</p>

										<div className='space-y-2 mb-6'>
											{service.features.map((feature, idx) => (
												<div key={idx} className='flex items-center space-x-2'>
													<CheckCircle className='w-4 h-4 text-green-500' />
													<span className='text-sm text-gray-600'>{feature}</span>
												</div>
											))}
										</div>

										<Button className='w-full'>
											Learn More
											<ArrowRight className='w-4 h-4' />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className='bg-white py-20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
						<div className='order-2 lg:order-1'>
							<div className='relative'>
								<div className='absolute inset-0 bg-gradient-to-br from-orange-100 to-blue-100 rounded-3xl transform rotate-3'></div>
								<div className='relative bg-white rounded-3xl p-8 shadow-2xl'>
									<Image
										src='/support.webp'
										alt='Professional customer service team helping clients'
										className='w-full h-auto rounded-2xl'
										width={500}
										height={400}
									/>
								</div>
							</div>
						</div>

						<div className='order-1 lg:order-2'>
							<Badge className='bg-orange-100 text-orange-800 border-orange-200 mb-4'>
								OSOW EXPRESS SUPPORT
							</Badge>
							<h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
								We&apos;re Here to Help You Succeed
							</h2>
							<p className='text-xl text-gray-600 mb-8 leading-relaxed'>
								OSOW EXPRESS strives to make your experience with OTR permitting, insurance, and
								superload services as seamless as possible. Our experienced professionals are always
								available to answer questions and provide expert consultation.
							</p>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
										<Clock className='w-5 h-5 text-green-600' />
									</div>
									<div>
										<div className='font-semibold text-gray-900'>Quick Turnaround</div>
										<div className='text-sm text-gray-600'>Fast processing times</div>
									</div>
								</div>

								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
										<Award className='w-5 h-5 text-blue-600' />
									</div>
									<div>
										<div className='font-semibold text-gray-900'>Expert Team</div>
										<div className='text-sm text-gray-600'>20+ years experience</div>
									</div>
								</div>

								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
										<MapPin className='w-5 h-5 text-purple-600' />
									</div>
									<div>
										<div className='font-semibold text-gray-900'>Nationwide Coverage</div>
										<div className='text-sm text-gray-600'>All 50 states</div>
									</div>
								</div>

								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
										<Zap className='w-5 h-5 text-orange-600' />
									</div>
									<div>
										<div className='font-semibold text-gray-900'>24/7 Support</div>
										<div className='text-sm text-gray-600'>Always available</div>
									</div>
								</div>
							</div>

							<Button
								size='lg'
								className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-4 shadow-xl'
							>
								<Phone className='w-5 h-5 mr-2' />
								Get Expert Help: 833 553 0343
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section className='bg-gradient-to-br from-gray-50 via-white to-orange-50 py-20'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-10'>
						<h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
							Frequently Asked Questions
						</h2>
						<p className='text-xl text-gray-600'>
							Get answers to the most common questions about our services
						</p>
					</div>

					<Accordion type='single' collapsible>
						{[
							{
								question: 'What is an oversize/overweight permit?',
								answer: 'An oversize/overweight permit is a permit that allows a truck to transport an oversize or overweight load.',
							},
							{
								question: 'When do I need an oversize/overweight permit (OD)?',
								answer: 'When you need to transport an oversize or overweight load.',
							},
							{
								question: 'How long does it take to get a permit?',
								answer: 'It depends on the state and the complexity of the permit.',
							},
							{
								question: 'How much does a truck permit cost?',
								answer: 'It depends on the state and the complexity of the permit.',
							},
							{
								question: 'Why should I work with OSOW EXPRESS?',
								answer: 'Because we are the best in the business.',
							},
							{
								question: 'What is a Superload Permit?',
								answer: 'A superload permit is a permit that allows a truck to transport a superload.',
							},
							{
								question: 'What is an Escort vehicle or a Pilot Car?',
								answer: 'An escort vehicle or a pilot car is a vehicle that escorts a truck to the destination.',
							},
						].map((question, index) => (
							<AccordionItem value={`item-${index + 1}`} key={index}>
								<AccordionTrigger>{question.question}</AccordionTrigger>
								<AccordionContent>{question.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>

					<div className='text-center mt-12'>
						<p className='text-gray-600 mb-4'>Still have questions?</p>
						<Button
							variant='outline'
							className='border-2 border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent'
						>
							Contact Our Experts
							<ArrowRight className='w-4 h-4 ml-2' />
						</Button>
					</div>
				</div>
			</section>
		</>
	)
}
