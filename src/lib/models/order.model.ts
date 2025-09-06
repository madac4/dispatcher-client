import { TrailerDTO } from './trailer.model'
import { TruckDTO } from './truck.model'

export type OrderPayload = {
	contact: string
	permitStartDate: string
	truckId: string
	trailerId: string
	commodity: string
	loadDims: string
	lengthFt: string
	lengthIn: string
	widthFt: string
	widthIn: string
	heightFt: string
	heightIn: string
	rearOverhangFt: string
	rearOverhangIn: string
	makeModel?: string
	serial?: string
	singleMultiple?: string
	legalWeight: 'yes' | 'no'
	originAddress: string
	destinationAddress: string
	stops?: string[]
	files?: File[]
	axleConfigs?: {
		tires: number
		tireWidth: number
		weight: number
		spacing?: string
	}[]
}

export type OrderDTO = {
	id: string
	orderNumber: string
	userId: string
	contact: string
	permitStartDate: string
	originAddress: string
	destinationAddress: string
	commodity: string
	loadDims: string
	lengthFt: number
	lengthIn: number
	widthFt: number
	widthIn: number
	heightFt: number
	heightIn: number
	rearOverhangFt: number
	rearOverhangIn: number
	makeModel: string
	serial: string
	singleMultiple: string
	legalWeight: 'yes' | 'no'
	stops: string[]
	files: {
		filename: string
		originalname: string
		contentType: string
		size: number
		_id: string
	}[]
	status: OrderStatus
	createdAt: string
	updatedAt: string
	truck: TruckDTO
	trailer: TrailerDTO
	axleConfigs?: {
		_id: string
		tires: number
		tireWidth: number
		weight: number
		spacing?: string
	}[]
}

export type PaginatedOrderDTO = {
	id: string
	orderNumber: string
	createdAt: string
	originAddress: string
	destinationAddress: string
	truckId: string
	status: OrderStatus
}

export enum OrderStatus {
	ALL = 'all',
	PENDING = 'pending',
	PROCESSING = 'processing',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
	REQUIRES_INVOICE = 'requires_invoice',
	REQUIRES_CHARGE = 'requires_charge',
	CHARGED = 'charged',
	ACTIVE = 'active',
}

export type OrderStatusType =
	| 'active'
	| 'completed'
	| 'paid'
	| 'archived'
	| 'all'

export type OrderStatusDTO = {
	value: OrderStatus
	label: string
	quantity: number
}

export const formatStatus = (status: OrderStatus) => {
	switch (status) {
		case OrderStatus.PENDING:
			return 'Pending'
		case OrderStatus.PROCESSING:
			return 'Processing'
		case OrderStatus.COMPLETED:
			return 'Completed'
		case OrderStatus.CANCELLED:
			return 'Cancelled'
		case OrderStatus.REQUIRES_INVOICE:
			return 'Requires Invoice'
		case OrderStatus.REQUIRES_CHARGE:
			return 'Requires Charge'
		case OrderStatus.CHARGED:
			return 'Charged'
		case OrderStatus.ACTIVE:
			return 'Active'
	}
}

export const getStatusBadge = (status: OrderStatus) => {
	switch (status) {
		case OrderStatus.PENDING:
			return 'bg-blue-500 text-white'
		case OrderStatus.PROCESSING:
			return 'bg-yellow-500 text-white'
		case OrderStatus.COMPLETED:
			return 'bg-green-500 text-white'
		case OrderStatus.CANCELLED:
			return 'bg-red-500 text-white'
		case OrderStatus.REQUIRES_INVOICE:
			return 'bg-orange-500 text-white'
		case OrderStatus.REQUIRES_CHARGE:
			return 'bg-orange-500 text-white'
		case OrderStatus.CHARGED:
			return 'bg-green-500 text-white'
		case OrderStatus.ACTIVE:
			return 'bg-green-500 text-white'
	}
}
