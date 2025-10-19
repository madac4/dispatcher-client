import { useNotifications } from '@/hooks/useNotifications';
import { NotificationStatus } from '@/lib/models/notification.model';
import { RequestModel } from '@/lib/models/response.model';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { Bell, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Notification } from './Notification';

export function HeaderNotifications() {
  const { notifications, hasUnread, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const { fetchNotifications } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const payload = new RequestModel();
    payload.unreadOnly = true;
    fetchNotifications(payload);
  }, [fetchNotifications]);

  const handleNotificationClick = (notificationId: string, actionUrl?: string) => {
    if (notificationId) markAsRead([notificationId]);
    if (actionUrl) router.push(actionUrl);
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter((n) => n.status === NotificationStatus.UNREAD).map((n) => n.id);
    if (unreadIds.length > 0) {
      markAllAsRead();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="relative" asChild>
        <Button variant="outline" size="icon-lg">
          <Bell className="size-5" />
          <span className="sr-only">Notifications</span>
          {hasUnread && (
            <>
              <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-destructive rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-destructive rounded-full" />
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="max-w-lg w-full min-w-lg max-h-[500px] p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Notifications</h4>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="xs" onClick={handleMarkAllAsRead} disabled={!hasUnread}>
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-muted-foreground flex flex-col items-center gap-2 py-8">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
              <p>No notifications yet</p>
              <p className="text-xs">You&apos;ll see updates here when they arrive</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div key={notification.id}>
                  <Notification
                    notification={notification}
                    onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
