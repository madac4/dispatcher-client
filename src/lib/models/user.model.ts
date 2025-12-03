import { UserRole } from './auth.model';

export interface UserCompanyInfo {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface UserWithSettings {
  id: string;
  email: string;
  role: UserRole;
  isEmailConfirmed: boolean;
  createdAt: string;
  companyInfo: UserCompanyInfo | null;
}

export interface UsersResponse {
  users: UserWithSettings[];
  moderators: UserWithSettings[];
}

