import { UserRole } from './auth.model';

export interface UserCompanyInfo {
  name: string | null;
  phone: string | null;
  email: string | null;
  dba?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  fax?: string | null;
}

export interface CarrierNumbers {
  mcNumber?: string | null;
  dotNumber?: string | null;
  einNumber?: string | null;
  iftaNumber?: string | null;
  orNumber?: string | null;
  kyuNumber?: string | null;
  txNumber?: string | null;
  tnNumber?: string | null;
  laNumber?: string | null;
  notes?: string | null;
  files?: Array<{
    filename: string;
    originalname: string;
    contentType: string;
    size: number;
  }>;
}

export interface UserWithSettings {
  id: string;
  email: string;
  role: UserRole;
  isEmailConfirmed: boolean;
  isBlocked?: boolean;
  createdAt: string;
  companyInfo: UserCompanyInfo | null;
}

export interface UserDetailWithSettings extends UserWithSettings {
  carrierNumbers: CarrierNumbers | null;
}

export interface UsersResponse {
  users: UserWithSettings[];
}
