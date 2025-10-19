import { apiRequest } from '@/middleware/errorHandler';
import api from '../api';
import { ApiResponse } from '../models/response.model';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  company?: string;
  message: string;
}

const baseURL = '/contact';

export const ContactService = {
  async submit(data: ContactFormData): Promise<ApiResponse<null>> {
    return apiRequest<null>(() => api.post(`${baseURL}/send`, data).then((res) => res.data));
  },
};
