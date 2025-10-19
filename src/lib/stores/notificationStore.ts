import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { NotificationDTO, NotificationStatus } from '../models/notification.model';
import { RequestModel } from '../models/response.model';
import { NotificationService } from '../services/notificationService';

interface NotificationState {
  notifications: NotificationDTO[];
  isLoading: boolean;
  hasUnread: boolean;

  fetchNotifications: (payload: RequestModel) => Promise<void>;
  markAsRead: (notificationIds: string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: NotificationDTO) => void;
  updateNotification: (notificationId: string, updates: Partial<Notification>) => void;
  reset: () => void;
}

const initialState = {
  notifications: [],
  stats: null,
  isLoading: false,
  unreadCount: 0,
};

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set) => ({
      ...initialState,

      fetchNotifications: async (payload: RequestModel) => {
        set({ isLoading: true });

        try {
          const { data } = await NotificationService.getNotifications(payload);
          console.log(data);

          set({
            notifications: data,
            hasUnread: data.some((notification) => notification.status === NotificationStatus.UNREAD),
          });
        } finally {
          set({ isLoading: false });
        }
      },

      markAsRead: async (notificationIds: string[]) => {
        try {
          await NotificationService.markNotificationsAsRead(notificationIds);

          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notificationIds.includes(notification.id)
                ? { ...notification, status: NotificationStatus.READ, unread: false }
                : notification,
            ),
            hasUnread: state.notifications.some((notification) => notification.status === NotificationStatus.UNREAD),
          }));
        } finally {
          set({
            isLoading: false,
          });
        }
      },

      markAllAsRead: async () => {
        try {
          await NotificationService.markAllNotificationsAsRead();

          set((state) => ({
            notifications: state.notifications.map((notification) => ({
              ...notification,
              status: NotificationStatus.READ,
              unread: false,
            })),
            unreadCount: 0,
          }));
        } finally {
          set({
            isLoading: false,
          });
        }
      },

      addNotification: (notification: NotificationDTO) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          hasUnread: state.notifications.some((notification) => notification.status === NotificationStatus.UNREAD),
        }));
      },

      updateNotification: (notificationId: string, updates: Partial<Notification>) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, ...updates } : notification,
          ),
        }));
      },

      clearError: () => set({ isLoading: false }),

      reset: () => set(initialState),
    }),
    {
      name: 'notification-store',
    },
  ),
);
