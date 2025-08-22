import { useAuthStore } from '@/lib/stores/authStore'
import { NextRequest, NextResponse } from 'next/server'

const protectedPaths = ['/dashboard']
const authPaths = ['/login', '/register', '/forgot-password', '/reset-password']

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname
	const { isAuthenticated } = useAuthStore.getState()

	if (protectedPaths.some(pp => path.startsWith(pp)) && !isAuthenticated()) {
		const url = new URL('/login', request.url)
		url.searchParams.set('callbackUrl', encodeURI(request.url))
		return NextResponse.redirect(url)
	}

	if (authPaths.some(ap => path === ap) && isAuthenticated()) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [...protectedPaths, ...authPaths],
}
