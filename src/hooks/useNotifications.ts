import { NotificationDTO } from '@/lib/models/notification.model';
import { socketService } from '@/lib/services/socketService';
import { useAuthStore } from '@/lib/stores/authStore';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { notifications, isLoading, hasUnread, markAsRead, markAllAsRead, addNotification } = useNotificationStore();

  const { accessToken, role, email } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    const token = accessToken();
    const userRole = role();
    const userEmail = email();
    const user = userRole && userEmail ? { role: userRole, email: userEmail } : null;

    if (token && user && !hasInitialized.current) {
      hasInitialized.current = true;
      socketService.connect(token);
    }

    return () => {
      if (!token) {
        socketService.disconnect();
        hasInitialized.current = false;
      }
    };
  }, [accessToken, role, email]);

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.warn('Could not play notification sound:', error);
      });
    } catch (error) {
      console.warn('Notification sound not available:', error);
    }
  }, []);

  // Handle real-time notifications
  useEffect(() => {
    const handleNotification = (notification: NotificationDTO) => {
      // Add notification to store
      addNotification(notification);

      // Show toast notification
      toast.info(notification.title, {
        description: notification.message,
        action: notification.actionUrl
          ? {
              label: notification.actionText || 'View',
              onClick: () => {
                if (notification.actionUrl) {
                  window.location.href = notification.actionUrl;
                }
              },
            }
          : undefined,
        duration: 5000,
      });

      playNotificationSound();
    };

    const handleSocketConnected = () => {
      console.log('Socket connected for notifications');
    };

    const handleSocketDisconnected = () => {
      console.log('Socket disconnected from notifications');
    };

    const handleSocketError = (error: unknown) => {
      console.error('Socket error:', error);
      toast.error('Connection error', {
        description: 'Failed to connect to real-time notifications',
      });
    };

    // Register socket event listeners
    socketService.on('notification', handleNotification as (...args: unknown[]) => void);
    socketService.on('connected', handleSocketConnected);
    socketService.on('disconnected', handleSocketDisconnected);
    socketService.on('error', handleSocketError);

    return () => {
      socketService.off('notification', handleNotification as (...args: unknown[]) => void);
      socketService.off('connected', handleSocketConnected);
      socketService.off('disconnected', handleSocketDisconnected);
      socketService.off('error', handleSocketError);
    };
  }, [addNotification, playNotificationSound]);

  // Mark notification as read
  const handleMarkAsRead = useCallback(
    async (notificationIds: string[]) => {
      try {
        await markAsRead(notificationIds);
      } catch (error) {
        console.log(error);
        toast.error('Failed to mark notifications as read');
      }
    },
    [markAsRead],
  );

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.log(error);
      toast.error('Failed to mark all notifications as read');
    }
  }, [markAllAsRead]);

  return {
    // State
    notifications,
    isLoading,
    hasUnread,
    isConnected: socketService.isConnected(),

    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    playNotificationSound,
  };
};
