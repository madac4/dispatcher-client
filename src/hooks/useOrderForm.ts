'use client'

import { OrderPayload } from '@/lib/models/order.model'
import { TrailerDTO } from '@/lib/models/trailer.model'
import { TruckDTO } from '@/lib/models/truck.model'
import { orderFormDefaultValues, orderFormSchema } from '@/lib/schemas/order.schema'
import { createOrder } from '@/lib/services/orderService'
import { getTrailerById } from '@/lib/services/trailerService'
import { getTruckById } from '@/lib/services/truckService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormData = typeof orderFormSchema._type

export function useOrderForm() {
  const [truck, setTruck] = useState<TruckDTO | null>(null)
  const [trailer, setTrailer] = useState<TrailerDTO | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: orderFormDefaultValues,
  })

  const handleSubmit = (data: FormData) => {
    if (!truck) {
      toast.warning('Please select a truck')
      return
    }

    if (!trailer) {
      toast.warning('Please select a trailer')
      return
    }

    setIsLoading(true)

    const payload: OrderPayload = {
      ...data,
      truckId: truck._id,
      trailerId: trailer._id,
      permitStartDate: data.permitStartDate.toISOString(),
    }

    submitOrder(payload)
  }

  const submitOrder = async (payload: OrderPayload) => {
    try {
      const { message } = await createOrder(payload)
      toast.success(message)
      router.push('/dashboard/orders')
    } catch {
      toast.error('Failed to create order')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTruckSelect = async (id: string) => {
    try {
      const { data } = await getTruckById(id)
      setTruck(data)
    } catch {
      toast.error('Failed to fetch truck details')
    }
  }

  const handleTrailerSelect = async (id: string) => {
    try {
      const { data } = await getTrailerById(id)
      setTrailer(data)
    } catch {
      toast.error('Failed to fetch trailer details')
    }
  }

  return {
    form,
    truck,
    trailer,
    isLoading,
    handleSubmit,
    handleTruckSelect,
    handleTrailerSelect,
  }
}
