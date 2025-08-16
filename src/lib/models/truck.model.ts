export type TruckDTO = {
  _id: string
  userId: string
  year: string
  make: string
  vin: string
  licencePlate: string
  state: string
  nrOfAxles: number
  unitNumber: string
}

export type TruckPayload = Omit<TruckDTO, 'userId' | '_id'>

export type NHTSA = {
  Results: [
    {
      Make: string
      VIN: string
      ModelYear: string
      Axles: string
      TrailerLength: string
      TrailerType: string
    },
  ]
}
