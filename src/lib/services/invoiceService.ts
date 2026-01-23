import { apiRequest, apiRequestPaginated } from '@/middleware/errorHandler';
import api from '../api';
import {
  CreateInvoiceRequest,
  Invoice,
  InvoiceQuery,
  UpdateInvoiceRequest,
  UserForInvoice,
} from '../models/invoice.model';
import { PaginatedOrderDTO } from '../models/order.model';
import { ApiResponse, PaginationResponse, RequestModel } from '../models/response.model';

const baseURL = '/invoices';

export const InvoiceService = {
  /**
   * Get users for invoice generation (admin only)
   */
  async getUsersForInvoice(): Promise<ApiResponse<UserForInvoice[]>> {
    return apiRequest<UserForInvoice[]>(() => api.get(`${baseURL}/users`).then((res) => res.data));
  },

  /**
   * Get orders for invoice preview (admin only)
   */
  async getOrdersForInvoicePreview(payload: RequestModel): Promise<PaginationResponse<PaginatedOrderDTO>> {
    return apiRequestPaginated<PaginatedOrderDTO>(() =>
      api.get(`${baseURL}/preview-orders`, { params: payload }).then((res) => res.data),
    );
  },

  /**
   * Create a new invoice (admin only)
   */
  async createInvoice(data: CreateInvoiceRequest): Promise<ApiResponse<Invoice>> {
    return apiRequest<Invoice>(() => api.post(`${baseURL}`, data).then((res) => res.data));
  },

  /**
   * Get invoice by ID
   */
  async getInvoiceById(invoiceId: string): Promise<ApiResponse<Invoice>> {
    return apiRequest<Invoice>(() => api.get(`${baseURL}/${invoiceId}`).then((res) => res.data));
  },

  /**
   * Get all invoices with filters and pagination
   */
  async getInvoices(query?: InvoiceQuery): Promise<PaginationResponse<Invoice>> {
    const params: RequestModel = new RequestModel();
    if (query) {
      Object.assign(params, query);
    }
    return apiRequestPaginated<Invoice>(() => api.get(`${baseURL}`, { params }).then((res) => res.data));
  },

  /**
   * Update an invoice (admin only)
   */
  async updateInvoice(invoiceId: string, data: UpdateInvoiceRequest): Promise<ApiResponse<Invoice>> {
    return apiRequest<Invoice>(() => api.put(`${baseURL}/${invoiceId}`, data).then((res) => res.data));
  },

  /**
   * Delete an invoice (admin only)
   */
  async deleteInvoice(invoiceId: string): Promise<ApiResponse<null>> {
    return apiRequest<null>(() => api.delete(`${baseURL}/${invoiceId}`).then((res) => res.data));
  },

  /**
   * Send invoice email (admin only)
   */
  async sendInvoiceEmail(invoiceId: string): Promise<ApiResponse<null>> {
    return apiRequest<null>(() => api.post(`${baseURL}/${invoiceId}/send-email`).then((res) => res.data));
  },

  /**
   * Download invoice as PDF/HTML
   */
  async downloadInvoice(invoiceId: string): Promise<void> {
    try {
      const response = await api.get(`${baseURL}/${invoiceId}/download`, {
        responseType: 'blob',
      });

      // Get invoice to get invoice number for filename
      const invoiceResponse = await this.getInvoiceById(invoiceId);
      const invoiceNumber = invoiceResponse.data?.invoiceNumber || invoiceId;

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },
};
