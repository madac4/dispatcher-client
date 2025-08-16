import { create } from 'zustand'
import { PaginationMeta, RequestModel } from '../models/response.model'
import { FileDTO } from '../models/settings.model'
import { Truck } from '../models/truck.model'
import { deleteTruck, getPaginatedTrucks } from '../services/truckService'

interface TrucksState {
  trucks: Truck[]
  isLoading: boolean
  isDeleting: boolean
  truckLength: number | null
  pagination: PaginationMeta
  truckFiles: FileDTO[] | null
  getTrucks: (payload: RequestModel) => Promise<void>
  deleteTruck: (id: string) => Promise<void>
  setUpdatedTruck: (truck: Truck | null) => void
  setTruckFiles: (files: FileDTO[]) => void
}

export const useTrucksStore = create<TrucksState>(set => ({
  trucks: [],
  isLoading: false,
  isDeleting: false,
  truckLength: null,
  pagination: {
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  truckFiles: null,
  getTrucks: async (payload: RequestModel) => {
    set({ isLoading: true })
    try {
      const response = await getPaginatedTrucks(payload)
      set({ trucks: response.data, truckLength: response.meta.totalItems, pagination: response.meta })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteTruck: async (id: string) => {
    set({ isDeleting: true })
    try {
      await deleteTruck(id)
    } finally {
      set({ isDeleting: false })
    }
  },
  setTruckFiles: (files: FileDTO[]) => set({ truckFiles: files }),
  setUpdatedTruck: (truck: Truck | null) =>
    set(state => ({ trucks: state.trucks.map(t => (t._id === truck?._id ? truck : t)) })),
}))
