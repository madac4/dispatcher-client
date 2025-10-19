import { TrailerDTO } from './trailer.model';
import { TruckDTO } from './truck.model';

export type OrderPayload = {
  contact: string;
  permitStartDate: string;
  truckId: string;
  trailerId: string;
  commodity: string;
  loadDims: string;
  lengthFt: string;
  lengthIn: string;
  widthFt: string;
  widthIn: string;
  heightFt: string;
  heightIn: string;
  rearOverhangFt: string;
  rearOverhangIn: string;
  makeModel?: string;
  serial?: string;
  singleMultiple?: string;
  legalWeight: 'yes' | 'no';
  originAddress: string;
  destinationAddress: string;
  messages?: string[];
  stops?: string[];
  files?: File[];
  axleConfigs?: {
    tires: number;
    tireWidth: number;
    weight: number;
    spacing?: string;
  }[];
};

export type OrderDTO = {
  id: string;
  orderNumber: string;
  userId: string;
  contact: string;
  permitStartDate: string;
  originAddress: string;
  destinationAddress: string;
  commodity: string;
  loadDims: string;
  lengthFt: number;
  lengthIn: number;
  widthFt: number;
  widthIn: number;
  heightFt: number;
  heightIn: number;
  rearOverhangFt: number;
  rearOverhangIn: number;
  makeModel: string;
  serial: string;
  singleMultiple: string;
  legalWeight: 'yes' | 'no';
  stops: string[];
  files: {
    filename: string;
    originalname: string;
    contentType: string;
    size: number;
    _id: string;
  }[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  truck: TruckDTO;
  trailer: TrailerDTO;
  moderator: {
    id: string;
    email: string;
  } | null;
  axleConfigs?: {
    _id: string;
    tires: number;
    tireWidth: number;
    weight: number;
    spacing?: string;
  }[];
  carrierNumbers?: {
    mcNumber?: string;
    dotNumber?: string;
    einNumber?: string;
    iftaNumber?: string;
    orNumber?: string;
    kyuNumber?: string;
    txNumber?: string;
    tnNumber?: string;
    laNumber?: string;
    notes?: string;
    files: {
      filename: string;
      originalname: string;
      contentType: string;
      size: number;
    }[];
  };
  companyInfo?: {
    name: string;
    dba?: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    fax?: string;
    email: string;
  };
};

export type PaginatedOrderDTO = {
  id: string;
  orderNumber: string;
  createdAt: string;
  originAddress: string;
  destinationAddress: string;
  truckId: string;
  status: OrderStatus;
  createdBy: string;
};

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  REQUIRES_INVOICE = 'requires_invoice',
  REQUIRES_CHARGE = 'requires_charge',
  CHARGED = 'charged',
  CANCELLED = 'cancelled',
  FINISHED = 'finished',
}

export type OrderStatusType = 'active' | 'completed' | 'paid' | 'archived' | 'all';

export type OrderStatusDTO = {
  value: OrderStatus;
  label: string;
  quantity: number;
};

export const formatStatus = (status: OrderStatus) => {
  return status
    .replace('_', ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-blue-500 text-white';
    case OrderStatus.PROCESSING:
      return 'bg-yellow-500 text-white';
    case OrderStatus.FINISHED:
      return 'bg-green-500 text-white';
    case OrderStatus.CANCELLED:
      return 'bg-red-500 text-white';
    case OrderStatus.REQUIRES_INVOICE:
      return 'bg-primary text-white';
    case OrderStatus.REQUIRES_CHARGE:
      return 'bg-primary text-white';
    case OrderStatus.CHARGED:
      return 'bg-green-500 text-white';
  }
};
