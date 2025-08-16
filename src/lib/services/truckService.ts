import { apiRequest, apiRequestPaginated } from '@/middleware/errorHandler'
import api from '../api'
import { ApiResponse, PaginationResponse, RequestModel } from '../models/response.model'
import { FileDTO } from '../models/settings.model'
import { NHTSA, Truck, TruckPayload } from '../models/truck.model'

const baseURL = '/trucks'

const nhtsaBaseURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues'

export const getPaginatedTrucks = async (payload: RequestModel): Promise<PaginationResponse<Truck>> => {
  return apiRequestPaginated<Truck>(() =>
    api
      .get(`${baseURL}/paginated?page=${payload.page}&limit=${payload.limit}&search=${payload.search}`)
      .then(res => res.data),
  )
}

export const getTruckByVin = async (vin: string): Promise<NHTSA> => {
  return api.get(`${nhtsaBaseURL}/${vin}?format=json`).then(res => res.data)
}

export const createTruck = async (truck: TruckPayload): Promise<ApiResponse<Truck>> => {
  return apiRequest(() => api.post(baseURL, truck).then(res => res.data))
}

export const updateTruck = async (truck: TruckPayload, id: string): Promise<ApiResponse<Truck>> => {
  return apiRequest(() => api.put(`${baseURL}/${id}`, truck).then(res => res.data))
}

export const getTruckById = async (id: string): Promise<ApiResponse<Truck>> => {
  return apiRequest(() => api.get(`${baseURL}/${id}`).then(res => res.data))
}

export const deleteTruck = async (id: string): Promise<ApiResponse<null>> => {
  return apiRequest<null>(() => api.delete(`${baseURL}/${id}`).then(res => res.data))
}

export const uploadTruckFile = async (file: File, id: string): Promise<ApiResponse<null>> => {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<null>(() =>
    api
      .post(`${baseURL}/${id}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => res.data),
  )
}

export const getTruckFiles = async (id: string): Promise<ApiResponse<FileDTO[]>> => {
  return apiRequest<FileDTO[]>(() => api.get(`${baseURL}/${id}/files`).then(res => res.data))
}

export const deleteTruckFile = async (id: string, filename: string): Promise<ApiResponse<null>> => {
  return apiRequest<null>(() => api.delete(`${baseURL}/${id}/files/${filename}`).then(res => res.data))
}

export const downloadTruckFile = async (id: string, filename: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.get(`${baseURL}/${id}/files/${filename}`, {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()

    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)

    return { data: null, message: 'File downloaded successfully' }
  } catch (error) {
    console.error('Download error:', error)
    throw error
  }
}
