import { create } from 'zustand'
import { PaginationMeta, RequestModel } from '../models/response.model'
import { FileDTO } from '../models/settings.model'
import { Trailer } from '../models/trailer.model'
import { deleteTrailer, getPaginatedTrailers } from '../services/trailerService'

interface TrailersState {
  trailers: Trailer[]
  isLoading: boolean
  isDeleting: boolean
  trailerLength: number | null
  pagination: PaginationMeta
  trailerFiles: FileDTO[] | null
  getTrailers: (payload: RequestModel) => Promise<void>
  deleteTrailer: (id: string) => Promise<void>
  setUpdatedTrailer: (trailer: Trailer | null) => void
  setTrailerFiles: (files: FileDTO[]) => void
}

export const useTrailersStore = create<TrailersState>(set => ({
  trailers: [],
  isLoading: false,
  isDeleting: false,
  trailerLength: null,
  pagination: {
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  trailerFiles: null,
  getTrailers: async (payload: RequestModel) => {
    set({ isLoading: true })
    try {
      const response = await getPaginatedTrailers(payload)
      set({ trailers: response.data, trailerLength: response.meta.totalItems, pagination: response.meta })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteTrailer: async (id: string) => {
    set({ isDeleting: true })
    try {
      await deleteTrailer(id)
    } finally {
      set({ isDeleting: false })
    }
  },

  setTrailerFiles: (files: FileDTO[]) => set({ trailerFiles: files }),

  setUpdatedTrailer: (trailer: Trailer | null) =>
    set(state => ({ trailers: state.trailers.map(t => (t._id === trailer?._id ? trailer : t)) })),
}))
