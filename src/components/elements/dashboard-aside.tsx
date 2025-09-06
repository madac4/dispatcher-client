'use client'

import { AsideNavigation } from '@/constants/constants'
import { useViewport } from '@/hooks/useViewports'
import { useAsideStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { PanelLeftClose, PanelRightClose } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Logo } from './logo'

export function DashboardAside() {
	const { isAsideOpen, toggleAside } = useAsideStore()
	const navigation = AsideNavigation
	const currentPath = usePathname()
	const { width } = useViewport()

	return (
		<aside className='flex h-full max-h-screen border-r flex-col bg-background'>
			<div className='mb-2 flex min-h-14 items-center justify-between border-b px-4 lg:min-h-16'>
				{isAsideOpen && <Logo url='/dashboard' />}

				<Button
					variant='ghost'
					size='icon-sm'
					className='text-gray-600'
					onClick={toggleAside}
				>
					{isAsideOpen ? (
						<PanelLeftClose className='size-5' />
					) : (
						<PanelRightClose className='size-5' />
					)}
				</Button>
			</div>

			<div className='hide-scrollbar flex-1 overflow-y-auto'>
				{width >= 768 && navigation && (
					<nav
						className={cn(
							'space-y-1 px-2 text-sm font-medium text-gray-700 lg:px-4',
							!isAsideOpen && '!px-4',
						)}
					>
						{navigation.map(item => (
							<Tooltip key={item.label}>
								<TooltipTrigger className='w-full' asChild>
									<Link
										href={item.url}
										className={cn(
											'flex cursor-pointer w-full items-center gap-3 text-gray-700 rounded-lg px-3 py-2 transition-colors hover:text-primary',
											currentPath === item.url &&
												'bg-gray-100 text-primary',
											!isAsideOpen &&
												'justify-center p-0 h-9 w-9',
											item.disabled &&
												'opacity-50 cursor-not-allowed pointer-events-none',
										)}
									>
										<DynamicIcon
											name={item.icon || 'octagon'}
											size={20}
										/>
										{isAsideOpen && item.label}
									</Link>
								</TooltipTrigger>
								<TooltipContent
									side='right'
									className={cn(isAsideOpen && 'hidden')}
								>
									{item.label}
								</TooltipContent>
							</Tooltip>
						))}
					</nav>
				)}
			</div>
		</aside>
	)
}
