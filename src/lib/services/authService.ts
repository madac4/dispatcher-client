import { apiRequest } from '@/middleware/errorHandler';
import api from '../api';
import { LoginResponse, UserRole } from '../models/auth.model';
import { ApiResponse } from '../models/response.model';

const baseURL = '/authorization';

export const AuthService = {
  async register(email: string, password: string, role: UserRole) {
    return apiRequest<void>(() => api.post(`${baseURL}/register`, { email, password, role }).then((res) => res.data));
  },

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return apiRequest<LoginResponse>(() => api.post(`${baseURL}/login`, { email, password }).then(({ data }) => data));
  },

  async logout(): Promise<ApiResponse<null>> {
    return apiRequest<null>(() => api.post(`${baseURL}/logout`).then((res) => res.data));
  },
};

export const forgotPassword = async (data: { email: string }): Promise<ApiResponse<null>> => {
  return apiRequest<null>(() => api.post(`${baseURL}/forgot-password`, data).then((res) => res.data));
};

export const updatePassword = async (data: {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}): Promise<ApiResponse<null>> => {
  return apiRequest<null>(() => api.post(`${baseURL}/update-password`, data).then((res) => res.data));
};

export const resetPassword = async (data: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<ApiResponse<null>> => {
  return apiRequest<null>(() => api.post(`${baseURL}/reset-password`, data).then((res) => res.data));
};

export const confirmEmail = async (data: { token: string }): Promise<ApiResponse<null>> => {
  return apiRequest<null>(() => api.post(`${baseURL}/confirm-email`, data).then((res) => res.data));
};

export const resendConfirmationEmail = async (data: { email: string }): Promise<ApiResponse<null>> => {
  return apiRequest<null>(() => api.post(`${baseURL}/resend-confirmation`, data).then((res) => res.data));
};
