import {
  NotificationPriority,
  Notification as NotificationType,
  NotificationType as NotificationTypeEnum,
} from '@/lib/models/notification.model';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, FileText, Info, MessageCircle, Package, Trash2, UserRoundPlus } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface NotificationProps {
  notification: NotificationType;
  onClick?: () => void;
  onMarkAsRead?: () => void;
  onDelete?: () => void;
}

export function Notification({ notification, onClick, onMarkAsRead, onDelete }: NotificationProps) {
  const getNotificationIcon = (type: NotificationTypeEnum) => {
    switch (type) {
      case NotificationTypeEnum.ORDER_CREATED:
      case NotificationTypeEnum.ORDER_UPDATED:
      case NotificationTypeEnum.ORDER_DELETED:
        return <Package className="h-4 w-4" />;
      case NotificationTypeEnum.NEW_MESSAGE:
        return <MessageCircle className="h-4 w-4" />;
      case NotificationTypeEnum.USER_JOINED:
        return <UserRoundPlus className="h-4 w-4" />;
      case NotificationTypeEnum.FILE_UPLOADED:
      case NotificationTypeEnum.FILE_DELETED:
        return <FileText className="h-4 w-4" />;
      case NotificationTypeEnum.SYSTEM_ANNOUNCEMENT:
        return <Bell className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.HIGH:
        return 'text-red-600 bg-red-50';
      case NotificationPriority.MEDIUM:
        return 'text-yellow-600 bg-yellow-50';
      case NotificationPriority.LOW:
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityBadgeVariant = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.HIGH:
        return 'destructive';
      case NotificationPriority.MEDIUM:
        return 'secondary';
      case NotificationPriority.LOW:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const isExpired = notification.expiresAt && new Date(notification.expiresAt) < new Date();
  const isActionable = notification.actionUrl && notification.actionText;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (isActionable && notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 transition-colors cursor-pointer group',
        notification.unread ? 'bg-blue-50/50' : 'hover:bg-gray-50',
        isExpired && 'opacity-60',
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          getPriorityColor(notification.priority),
        )}
      >
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
              <Badge variant={getPriorityBadgeVariant(notification.priority)} className="text-xs">
                {notification.priority.toLowerCase()}
              </Badge>

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

          <div className="flex flex-col items-end gap-1">
            <time className="text-xs text-gray-500 flex-shrink-0">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </time>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {notification.unread && (
                <Button variant="ghost" size="sm" onClick={handleMarkAsRead} className="h-6 w-6 p-0">
                  <Check className="h-3 w-3" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
