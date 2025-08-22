import { apiRequest, apiRequestPaginated } from '@/middleware/errorHandler'
import api from '../api'
import {
	ApiResponse,
	PaginationResponse,
	RequestModel,
} from '../models/response.model'
import { FileDTO } from '../models/settings.model'
import { TrailerDTO, TrailerPayload } from '../models/trailer.model'
import { NHTSA } from '../models/truck.model'

const baseURL = '/trailers'
const nhtsaBaseURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues'

export const getPaginatedTrailers = async (
	payload: RequestModel,
): Promise<PaginationResponse<TrailerDTO>> => {
	return apiRequestPaginated<TrailerDTO>(() =>
		api
			.get(
				`${baseURL}/paginated?page=${payload.page}&limit=${payload.limit}&search=${payload.search}`,
			)
			.then(res => res.data),
	)
}

export const getTrailerByVin = async (vin: string): Promise<NHTSA> => {
	return api.get(`${nhtsaBaseURL}/${vin}?format=json`).then(res => res.data)
}

export const getTrailerById = async (
	id: string,
): Promise<ApiResponse<TrailerDTO>> => {
	return apiRequest(() => api.get(`${baseURL}/${id}`).then(res => res.data))
}

export const createTrailer = async (
	trailer: TrailerPayload,
): Promise<ApiResponse<TrailerDTO>> => {
	return apiRequest<TrailerDTO>(() =>
		api.post(baseURL, trailer).then(res => res.data),
	)
}

export const updateTrailer = async (
	trailer: TrailerPayload,
	id: string,
): Promise<ApiResponse<TrailerDTO>> => {
	return apiRequest<TrailerDTO>(() =>
		api.put(`${baseURL}/${id}`, trailer).then(res => res.data),
	)
}

export const deleteTrailer = async (id: string): Promise<ApiResponse<null>> => {
	return apiRequest<null>(() =>
		api.delete(`${baseURL}/${id}`).then(res => res.data),
	)
}

export const uploadTrailerFile = async (
	file: File,
	id: string,
): Promise<ApiResponse<null>> => {
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

export const getTrailerFiles = async (
	id: string,
): Promise<ApiResponse<FileDTO[]>> => {
	return apiRequest<FileDTO[]>(() =>
		api.get(`${baseURL}/${id}/files`).then(res => res.data),
	)
}

export const deleteTrailerFile = async (
	id: string,
	filename: string,
): Promise<ApiResponse<null>> => {
	return apiRequest<null>(() =>
		api.delete(`${baseURL}/${id}/files/${filename}`).then(res => res.data),
	)
}

export const downloadTrailerFile = async (
	id: string,
	filename: string,
): Promise<ApiResponse<null>> => {
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
