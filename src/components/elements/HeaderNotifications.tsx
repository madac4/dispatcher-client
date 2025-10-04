import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function HeaderNotifications() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="relative" asChild>
        <Button variant="outline" size="icon-lg">
          <Bell className="size-5" />
          <span className="sr-only">Notifications</span>
          <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-destructive rounded-full animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-destructive rounded-full" />
          {/* {hasUnreadNotifications && (
					)} */}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="max-w-lg w-full min-w-lg max-h-[500px] p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">
              Notifications
              {/* <Badge className='ml-2'>{unreadCount}</Badge> */}
            </h4>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="xs" disabled>
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </Button>
              <Button variant="secondary" size="xs" disabled>
                <Trash2 className="h-4 w-4" />
                Clear all
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4">
          <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
            <p>Notifications are coming soon</p>
            <p className="text-xs">You&apos;ll see updates here when they are implemented</p>
          </div>
          {/* {isLoading ? (
						<div className='text-center text-muted-foreground'>
							Loading notifications...
						</div>
					) : notifications.length === 0 ? (
						<div className='text-center text-muted-foreground flex flex-col items-center gap-2'>
							<Bell className='h-8 w-8 text-muted-foreground/50' />
							<p>No notifications yet</p>
							<p className='text-xs'>
								You'll see updates here when they arrive
							</p>
						</div>
					) : (
						<div className='divide-y'>
							{notifications.map(notification => (
								<div key={notification.id}>
									<Notification
										notification={notification}
										onClick={() =>
											handleNotificationClick(
												notification.id,
												notification.unread,
											)
										}
										onMarkAsRead={() =>
											markAsRead(notification.id)
										}
										onDelete={() =>
											deleteNotification(notification.id)
										}
									/>
								</div>
							))}
						</div>
					)} */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
