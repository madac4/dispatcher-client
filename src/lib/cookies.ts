import { Cookies } from 'react-cookie'
import { CookieKeys } from '../constants/app.enum'
import { UserRole } from './models/auth.model'

const cookies = new Cookies()

const cookieOptions = {
	path: '/',
	secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
	sameSite: 'strict' as const,
}

export const setEmail = (email: string) => {
	cookies.set(CookieKeys.EMAIL, email, cookieOptions)
}

export const setAccessToken = (token: string) => {
	cookies.set(CookieKeys.ACCESS_TOKEN, token, cookieOptions)
}

export const setRefreshToken = (token: string) => {
	cookies.set(CookieKeys.REFRESH_TOKEN, token, cookieOptions)
}

export const setRole = (role: UserRole) => {
	cookies.set(CookieKeys.ROLE, role, cookieOptions)
}

export const getRefreshToken = () => cookies.get(CookieKeys.REFRESH_TOKEN)
export const getAccessToken = () => cookies.get(CookieKeys.ACCESS_TOKEN)
export const getRole = () => cookies.get(CookieKeys.ROLE) as UserRole
export const getEmail = () => cookies.get(CookieKeys.EMAIL) as string

export const removeTokens = () => {
	cookies.remove(CookieKeys.ACCESS_TOKEN, { path: '/' })
	cookies.remove(CookieKeys.REFRESH_TOKEN, { path: '/' })
}
