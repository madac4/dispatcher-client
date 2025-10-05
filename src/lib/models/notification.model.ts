export enum NotificationType {
  ORDER_CREATED = 'order_created',
  ORDER_UPDATED = 'order_updated',
  ORDER_DELETED = 'order_deleted',
  NEW_MESSAGE = 'new_message',
  USER_JOINED = 'user_joined',
  FILE_UPLOADED = 'file_uploaded',
  FILE_DELETED = 'file_deleted',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

export interface NotificationDTO {
  id: string;
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  metadata?: {
    orderId?: string;
    orderNumber?: string;
    chatId?: string;
    fileId?: string;
    userId?: string;
    teamId?: string;
    fileName?: string;
    messageId?: string;
    [key: string]: unknown;
  };
  actionUrl?: string;
  actionText?: string;
  expiresAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  unread: boolean;
}

export interface NotificationCreateRequest {
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: {
    orderId?: string;
    orderNumber?: string;
    chatId?: string;
    fileId?: string;
    userId?: string;
    teamId?: string;
    [key: string]: unknown;
  };
  actionUrl?: string;
  actionText?: string;
  expiresAt?: string;
}

export interface NotificationUpdateRequest {
  status?: NotificationStatus;
  readAt?: string;
}

export interface NotificationQuery {
  recipientId?: string;
  type?: NotificationType;
  status?: NotificationStatus;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
  unreadOnly?: boolean;
}

export interface NotificationBulkResponse {
  success: boolean;
  message: string;
  created: number;
  failed: number;
  errors?: string[];
}
