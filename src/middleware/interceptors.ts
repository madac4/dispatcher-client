import { getAccessToken, getRefreshToken } from '@/lib/cookies'
import { ResponseModel } from '@/lib/models/response.model'
import { useAuthStore } from '@/lib/stores/authStore'
import { AxiosInstance } from 'axios'

// TODO: review this file
export const setupInterceptors = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.request.use(config => {
    const accessToken = getAccessToken()

    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`

    return config
  })

  apiInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = getRefreshToken()

          if (!refreshToken) throw new Error('No refresh token found')

          const { data } = await apiInstance.post<ResponseModel<{ accessToken: string }>>(
            '/authorization/refresh-token',
            {
              refreshToken,
            },
          )

          useAuthStore.getState().setUser(data.data?.accessToken || '', refreshToken)
          originalRequest.headers.Authorization = `Bearer ${data.data?.accessToken || ''}`

          return apiInstance(originalRequest)
        } catch (refreshError) {
          console.error('Refresh token error:', refreshError)
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    },
  )
}
