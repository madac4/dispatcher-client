import { apiRequest, apiRequestPaginated } from '@/middleware/errorHandler';
import api from '../api';
import { NotificationCreateRequest, NotificationDTO, NotificationUpdateRequest } from '../models/notification.model';
import { PaginationResponse, RequestModel } from '../models/response.model';

const baseURL = '/notifications';

export const NotificationService = {
  async getNotifications(payload: RequestModel): Promise<PaginationResponse<NotificationDTO>> {
    return await apiRequestPaginated<NotificationDTO>(() =>
      api.get(`${baseURL}`, { params: { ...payload } }).then((res) => res.data),
    );
  },

  async markNotificationsAsRead(notificationIds: string[]): Promise<void> {
    await apiRequest<void>(() => api.patch(`${baseURL}/mark-read`, { notificationIds }).then((res) => res.data));
  },

  async markAllNotificationsAsRead(): Promise<void> {
    await apiRequest<void>(() => api.patch(`${baseURL}/mark-all-read`).then((res) => res.data));
  },

  /**
   * Update a notification
   */
  async updateNotification(notificationId: string, updateData: NotificationUpdateRequest): Promise<Notification> {
    const response = await apiRequest<{ data: Notification }>(() =>
      api.patch(`${baseURL}/${notificationId}`, updateData).then((res) => res.data),
    );

    return response.data?.data || ({} as Notification);
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiRequest<void>(() => api.delete(`${baseURL}/${notificationId}`).then((res) => res.data));
  },

  /**
   * Create a new notification (admin/moderator only)
   */
  async createNotification(notificationData: NotificationCreateRequest): Promise<Notification> {
    const response = await apiRequest<{ data: Notification }>(() =>
      api.post(baseURL, notificationData).then((res) => res.data),
    );

    return response.data?.data || ({} as Notification);
  },
};
