import {
	PaginatedModel,
	PaginationResponse,
	ResponseModel,
} from '@/lib/models/response.model'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export class ApiError extends Error {
	status: number
	data: unknown

	constructor(message: string, status: number, data?: unknown) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.data = data
	}
}

export function handleApiError(error: unknown): never {
	if (error instanceof AxiosError) {
		const status = error.response?.status || 500

		const errorMessage =
			error.response?.data?.error ||
			error.response?.data?.message ||
			error.message ||
			'Unknown error occurred'

		if (status !== 401) toast.error(errorMessage)

		throw new ApiError(errorMessage, status, error.response?.data)
	}

	if (error instanceof ApiError) {
		throw error
	}

	throw new ApiError(
		error instanceof Error ? error.message : 'Unknown error occurred',
		500,
	)
}

export async function apiRequest<T>(
	requestFn: () => Promise<ResponseModel<T>>,
): Promise<{ data: T | null; message: string | undefined }> {
	try {
		const response = await requestFn()

		if (!response.success) {
			throw new ApiError(
				response.message || 'Request failed',
				response.status,
			)
		}

		if (response.data === null) {
			return {
				data: null,
				message: response.message,
			}
		}

		return {
			data: response.data as T,
			message: response.message,
		}
	} catch (error) {
		handleApiError(error)
	}
}

export async function apiRequestPaginated<T>(
	requestFn: () => Promise<PaginatedModel<T[]>>,
): Promise<PaginationResponse<T>> {
	try {
		const response = await requestFn()

		if (!response.success) {
			throw new ApiError(
				response.message || 'Request failed',
				response.status,
			)
		}

		return {
			data: response.data as T[],
			meta: response.meta,
		}
	} catch (error) {
		handleApiError(error)
	}
}
