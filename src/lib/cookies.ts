import { Cookies } from 'react-cookie'
import { CookieKeys } from '../constants/app.enum'

const cookies = new Cookies()

const cookieOptions = {
  path: '/',
  secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
  sameSite: 'strict' as const,
}

export const setAccessToken = (token: string) => {
  cookies.set(CookieKeys.ACCESS_TOKEN, token, cookieOptions)
}

export const setRefreshToken = (token: string) => {
  cookies.set(CookieKeys.REFRESH_TOKEN, token, cookieOptions)
}

export const getAccessToken = () => cookies.get(CookieKeys.ACCESS_TOKEN)
export const getRefreshToken = () => cookies.get(CookieKeys.REFRESH_TOKEN)

export const removeTokens = () => {
  cookies.remove(CookieKeys.ACCESS_TOKEN, { path: '/' })
  cookies.remove(CookieKeys.REFRESH_TOKEN, { path: '/' })
}
