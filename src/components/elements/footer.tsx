import { Facebook, Linkedin, Mail, Phone, Twitter } from 'lucide-react'
import { Button } from '../ui/button'

export function Footer() {
	return (
		<footer className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
					<div className='md:col-span-2'>
						<div className='flex items-center space-x-3 mb-6'>
							<div className='w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg'>
								<span className='text-white font-bold text-lg'>
									CP
								</span>
							</div>
							<div>
								<span className='text-2xl font-bold'>
									CLICK
								</span>
								<span className='text-2xl font-bold text-primary ml-1'>
									PERMIT
								</span>
							</div>
						</div>
						<p className='text-gray-300 mb-6 max-w-md leading-relaxed'>
							Get connected to make your specialized
							transportation needs as easy as possible. Providing
							the fastest permit processing in the industry with
							over 20 years of experience.
						</p>
						<div className='flex items-center space-x-4 mb-6'>
							<div className='flex items-center space-x-2'>
								<Phone className='w-4 h-4 text-primary' />
								<span className='text-gray-300'>
									+373 78 410 220
								</span>
							</div>
							<a
								href='mailto:clickpermit@gmail.com'
								className='flex items-center space-x-2'
							>
								<Mail className='w-4 h-4 text-primary' />
								<span className='text-gray-300'>
									clickpermit@gmail.com
								</span>
							</a>
						</div>
						<Button
							variant='outline'
							className='text-white border-white hover:bg-white hover:text-gray-900 bg-transparent'
						>
							Learn More About Us
						</Button>
					</div>

					<div>
						<h3 className='font-bold text-lg mb-6'>Quick Links</h3>
						<ul className='space-y-3 text-gray-300'>
							{[
								'Home',
								'About Us',
								'Services',
								'Permits',
								'Insurance',
								'Contact Us',
								'Privacy Policy',
							].map(link => (
								<li key={link}>
									<a
										href='#'
										className='hover:text-primary-400 transition-colors'
									>
										{link}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='font-bold text-lg mb-6'>
							Connect With Us
						</h3>
						<div className='flex space-x-4 mb-6'>
							<a
								href='#'
								className='w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors'
							>
								<Facebook className='w-5 h-5' />
							</a>
							<a
								href='#'
								className='w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors'
							>
								<Twitter className='w-5 h-5' />
							</a>
							<a
								href='#'
								className='w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors'
							>
								<Linkedin className='w-5 h-5' />
							</a>
						</div>
						<p className='text-gray-400 text-sm'>
							Follow us for industry updates and transportation
							insights
						</p>
					</div>
				</div>

				<div className='border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between'>
					<p className='text-gray-400 text-sm'>
						&copy; 2024 Click Permit. All rights reserved.
					</p>
					<div className='flex items-center space-x-6 mt-4 md:mt-0 text-sm text-gray-400'>
						<a
							href='#'
							className='hover:text-white transition-colors'
						>
							Terms of Service
						</a>
						<a
							href='#'
							className='hover:text-white transition-colors'
						>
							Privacy Policy
						</a>
						<a
							href='#'
							className='hover:text-white transition-colors'
						>
							Cookie Policy
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
