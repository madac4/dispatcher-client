export type Settings = {
  companyInfo: CompanyInfo | null
  carrierNumbers: CarrierNumbers | null
}

export type CompanyInfo = {
  name: string
  dba?: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  fax?: string
  email: string
}

export type CarrierNumbers = {
  _id: string
  mcNumber: string
  dotNumber: string
  einNumber: string
  iftaNumber?: string
  orNumber?: string
  kyuNumber?: string
  txNumber?: string
  tnNumber?: string
  laNumber?: string
  notes?: string
  files?: FileDTO[]
}

export type FileDTO = {
  filename: string
  originalname: string
  contentType: string
  size: number
}

export type CarrierNumbersPayload = Omit<CarrierNumbers, '_id'>
