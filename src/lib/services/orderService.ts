import { apiRequest, apiRequestPaginated } from '@/middleware/errorHandler'
import api from '../api'
import { OrderDTO, OrderPayload, OrderStatusDTO, OrderStatusType, PaginatedOrderDTO } from '../models/order.model'
import { ApiResponse, PaginationResponse, RequestModel } from '../models/response.model'

const baseURL = '/orders'

export const createOrder = async (data: OrderPayload): Promise<ApiResponse<null>> => {
  if (data.files && data.files.length > 0) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob)
      }
    })

    // Append files
    data.files.forEach(file => {
      formData.append('files', file)
    })

    return apiRequest<null>(() =>
      api
        .post(`${baseURL}/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => res.data),
    )
  }

  return apiRequest<null>(() => api.post(`${baseURL}/create`, data).then(res => res.data))
}

export const getOrders = async (payload: RequestModel): Promise<PaginationResponse<PaginatedOrderDTO>> => {
  return apiRequestPaginated<PaginatedOrderDTO>(() =>
    api.get(`${baseURL}/paginated`, { params: { ...payload } }).then(res => res.data),
  )
}

export const getOrderStatuses = async (type: OrderStatusType): Promise<ApiResponse<OrderStatusDTO[]>> => {
  return apiRequest<OrderStatusDTO[]>(() => api.get(`${baseURL}/statuses/${type}`).then(res => res.data))
}

export const getOrderByNumber = async (orderNumber: string): Promise<ApiResponse<OrderDTO>> => {
  return apiRequest<OrderDTO>(() => api.get(`${baseURL}/${orderNumber}`).then(res => res.data))
}
