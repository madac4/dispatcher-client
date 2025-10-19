import { NotificationDTO, NotificationType } from '@/lib/models/notification.model';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Bell, FileText, Info, MessageCircle, Package, UserRoundPlus } from 'lucide-react';
import { Badge } from '../ui/badge';

interface NotificationProps {
  notification: NotificationDTO;
  onClick?: () => void;
}

export function Notification({ notification, onClick }: NotificationProps) {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER_CREATED:
      case NotificationType.ORDER_UPDATED:
      case NotificationType.ORDER_DELETED:
        return <Package className="h-4 w-4" />;
      case NotificationType.NEW_MESSAGE:
        return <MessageCircle className="h-4 w-4" />;
      case NotificationType.USER_JOINED:
        return <UserRoundPlus className="h-4 w-4" />;
      case NotificationType.FILE_UPLOADED:
      case NotificationType.FILE_DELETED:
        return <FileText className="h-4 w-4" />;
      case NotificationType.SYSTEM_ANNOUNCEMENT:
        return <Bell className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const isExpired = notification.expiresAt && new Date(notification.expiresAt) < new Date();
  const isActionable = notification.actionUrl && notification.actionText;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 transition-colors cursor-pointer group',
        notification.unread ? 'bg-blue-50/50' : 'hover:bg-gray-50',
        isExpired && 'opacity-60',
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-primary-600 bg-primary-50">
        {getNotificationIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4
                className={cn('text-sm font-medium truncate', notification.unread ? 'text-gray-900' : 'text-gray-700')}
              >
                {notification.title}
              </h4>
              {notification.unread && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>

            <div className="flex items-center gap-2 mt-2">
              {isActionable && (
                <Badge variant="outline" className="text-xs">
                  {notification.actionText}
                </Badge>
              )}

              {isExpired && (
                <Badge variant="secondary" className="text-xs">
                  Expired
                </Badge>
              )}
            </div>
          </div>

          <time className="text-xs text-gray-500 flex-shrink-0">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </time>
        </div>
      </div>
    </div>
  );
}
