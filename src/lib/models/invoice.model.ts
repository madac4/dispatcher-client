import { CompanyInfo } from './settings.model';

export type InvoiceCharge = {
  state: string;
  oversize: number;
  overweight: number;
  superload: number;
  serviceFee: number;
  escort: number;
  total: number;
};

export type InvoiceOrder = {
  orderNumber: string;
  contact: string;
  permitStartDate: string;
  truckNumber: string;
  trailerNumber: string;
  commodity: string;
  lengthFt: number;
  lengthIn: number;
  widthFt: number;
  widthIn: number;
  heightFt: number;
  heightIn: number;
  rearOverhangFt: number;
  rearOverhangIn: number;
  makeModel?: string;
  serial?: string;
  singleMultiple?: string;
  legalWeight: string;
  originAddress: string;
  destinationAddress: string;
};

export type Invoice = {
  _id: string;
  invoiceNumber: string;
  userId: string;
  companyInfo: CompanyInfo;
  startDate: string;
  endDate: string;
  orders: InvoiceOrder[];
  charges: InvoiceCharge[];
  totalAmount: number;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
};

export type CreateInvoiceRequest = {
  userId: string;
  startDate: string;
  endDate: string;
  charges: InvoiceCharge[];
};

export type UpdateInvoiceRequest = {
  startDate?: string;
  endDate?: string;
  charges?: InvoiceCharge[];
};

export type InvoiceQuery = {
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  search?: string;
};

export type UserForInvoice = {
  _id: string;
  email: string;
  createdAt: string;
  companyInfo: CompanyInfo | null;
};
