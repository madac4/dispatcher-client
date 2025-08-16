'use client'

import { OrderStatus, OrderStatusType } from '@/lib/models/order.model'
import { RequestModel } from '@/lib/models/response.model'
import { useOrdersStore } from '@/lib/stores/ordersStore'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<OrderStatusType>('active')
  const { getOrders, orders, getStatuses, statuses } = useOrdersStore()
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const activeStatuses = useMemo(() => [OrderStatus.ACTIVE, OrderStatus.PENDING, OrderStatus.PROCESSING], [])

  const completedStatuses = useMemo(
    () => [OrderStatus.COMPLETED, OrderStatus.CANCELLED, OrderStatus.REQUIRES_CHARGE, OrderStatus.REQUIRES_INVOICE],
    [],
  )

  const paidStatuses = useMemo(() => [OrderStatus.CHARGED], [])

  const archivedStatuses = useMemo(() => [OrderStatus.COMPLETED, OrderStatus.CANCELLED], [])

  const payload = useMemo(() => new RequestModel(), [])

  const getActiveOrders = useCallback(() => {
    payload.status = activeStatuses
    getOrders(payload)
    getStatuses('active')
  }, [getOrders, payload, getStatuses, activeStatuses])

  const getCompletedOrders = useCallback(() => {
    payload.status = completedStatuses
    getOrders(payload)
    getStatuses('completed')
  }, [getOrders, payload, getStatuses, completedStatuses])

  const getPaidOrders = useCallback(() => {
    payload.status = paidStatuses
    getOrders(payload)
    getStatuses('paid')
  }, [getOrders, payload, getStatuses, paidStatuses])

  const getArchivedOrders = useCallback(() => {
    payload.status = archivedStatuses
    getOrders(payload)
    getStatuses('archived')
  }, [getOrders, payload, getStatuses, archivedStatuses])

  useEffect(() => {
    getActiveOrders()
  }, [])

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    payload.status = activeStatuses
    getOrders(payload)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    payload.status = value === 'all' ? activeStatuses : [value]
    getOrders(payload)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      payload.search = value
      getOrders(payload)
    }, 300)
  }

  return {
    searchTerm,
    statusFilter,
    activeTab,
    orders,
    statuses,
    setActiveTab,
    clearFilters,
    handleStatusChange,
    handleSearchChange,
    getActiveOrders,
    getCompletedOrders,
    getPaidOrders,
    getArchivedOrders,
    payload,
  }
}
