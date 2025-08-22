export type TrailerDTO = {
	_id: string
	userId: string
	year: string
	make: string
	vin: string
	licencePlate: string
	state: string
	nrOfAxles: number
	length: string
	type: string
	unitNumber: string
}

export type TrailerPayload = Omit<TrailerDTO, 'userId' | '_id'>
