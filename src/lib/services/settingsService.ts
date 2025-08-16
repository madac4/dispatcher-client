import { apiRequest } from '@/middleware/errorHandler'
import api from '../api'
import { ApiResponse } from '../models/response.model'
import { CarrierNumbers, CarrierNumbersPayload, CompanyInfo, FileDTO } from '../models/settings.model'

const baseURL = '/settings'

export const getCompanyInfo = async (): Promise<ApiResponse<CompanyInfo>> => {
  return apiRequest<CompanyInfo>(() => api.get(`${baseURL}/company-info`).then(res => res.data))
}

export const updateCompanyInfo = async (companyInfo: CompanyInfo): Promise<ApiResponse<CompanyInfo>> => {
  return apiRequest<CompanyInfo>(() => api.put(`${baseURL}/company-info`, companyInfo).then(res => res.data))
}

export const getCarrierNumbers = async (): Promise<ApiResponse<CarrierNumbers>> => {
  return apiRequest<CarrierNumbers>(() => api.get(`${baseURL}/carrier-numbers`).then(res => res.data))
}

export const updateCarrierNumbers = async (
  carrierNumbers: CarrierNumbersPayload,
): Promise<ApiResponse<CarrierNumbers>> => {
  return apiRequest<CarrierNumbers>(() => api.put(`${baseURL}/carrier-numbers`, carrierNumbers).then(res => res.data))
}

export const uploadCarrierFile = async (file: File): Promise<ApiResponse<null>> => {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<null>(() =>
    api
      .post(`${baseURL}/carrier-numbers/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => res.data),
  )
}

export const getCarrierFiles = async (): Promise<ApiResponse<FileDTO[]>> => {
  return apiRequest<FileDTO[]>(() => api.get(`${baseURL}/carrier-numbers/files`).then(res => res.data))
}

export const deleteCarrierFile = async (filename: string): Promise<ApiResponse<null>> => {
  return apiRequest<null>(() => api.delete(`${baseURL}/carrier-numbers/files/${filename}`).then(res => res.data))
}

export const downloadCarrierFile = async (filename: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.get(`${baseURL}/carrier-numbers/files/${filename}`, {
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
