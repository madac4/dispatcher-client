import { create } from 'zustand'
import { OrderStatusDTO, OrderStatusType, PaginatedOrderDTO } from '../models/order.model'
import { PaginationMeta, RequestModel } from '../models/response.model'
import { getOrders, getOrderStatuses } from '../services/orderService'

interface OrdersState {
  orders: PaginatedOrderDTO[]
  isLoading: boolean
  statuses: OrderStatusDTO[]
  ordersLength: number | null
  pagination: PaginationMeta
  getOrders: (payload: RequestModel) => Promise<void>
  getStatuses: (type: OrderStatusType) => Promise<void>
}

export const useOrdersStore = create<OrdersState>(set => ({
  orders: [],
  isLoading: false,
  ordersLength: null,
  statuses: [],
  pagination: {
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  trailerFiles: null,
  getOrders: async (payload: RequestModel) => {
    set({ isLoading: true })
    try {
      const response = await getOrders(payload)
      set({ orders: response.data, ordersLength: response.meta.totalItems, pagination: response.meta })
    } finally {
      set({ isLoading: false })
    }
  },
  getStatuses: async (type: OrderStatusType) => {
    try {
      const { data } = await getOrderStatuses(type)
      set({ statuses: data || [] })
    } finally {
      set({ isLoading: false })
    }
  },
}))
