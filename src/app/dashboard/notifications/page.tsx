'use client';

import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Notification } from '@/components/elements/Notification';
import { Pagination } from '@/components/elements/pagination';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDTO, NotificationStatus, NotificationType } from '@/lib/models/notification.model';
import { RequestModel } from '@/lib/models/response.model';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { cn } from '@/lib/utils';
import { Bell, Calendar as CalendarIcon, CheckCheck, RefreshCw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

const getNotificationTypeLabel = (type: NotificationType): string => {
  const labels: Record<NotificationType, string> = {
    [NotificationType.ORDER_CREATED]: 'Order Created',
    [NotificationType.ORDER_UPDATED]: 'Order Updated',
    [NotificationType.ORDER_DELETED]: 'Order Deleted',
    [NotificationType.NEW_MESSAGE]: 'New Message',
    [NotificationType.USER_JOINED]: 'User Joined',
    [NotificationType.FILE_UPLOADED]: 'File Uploaded',
    [NotificationType.FILE_DELETED]: 'File Deleted',
    [NotificationType.SYSTEM_ANNOUNCEMENT]: 'System Announcement',
  };
  return labels[type] || type;
};

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, isLoading, hasUnread, markAsRead, markAllAsRead } = useNotifications();
  const { fetchNotifications, pagination } = useNotificationStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [payload, setPayload] = useState<RequestModel>(new RequestModel({ page: 1, limit: 20 }));
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPayload(new RequestModel({ page: 1, limit: itemsPerPage }));
  }, [statusFilter, typeFilter, dateRange, itemsPerPage]);

  const fetchNotificationsData = useCallback(async () => {
    const requestPayload = new RequestModel({ page: payload.page, limit: payload.limit });

    if (statusFilter !== 'all') {
      requestPayload.status = statusFilter;
    }

    if (typeFilter !== 'all') {
      requestPayload.type = typeFilter;
    }

    if (dateRange?.from) {
      requestPayload.startDate = dateRange.from.toISOString();
    }

    if (dateRange?.to) {
      requestPayload.endDate = dateRange.to.toISOString();
    }

    await fetchNotifications(requestPayload);
  }, [statusFilter, typeFilter, dateRange, payload.page, payload.limit, fetchNotifications]);

  useEffect(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      await markAsRead([id]);
    },
    [markAsRead],
  );

  const handleNotificationClick = useCallback(
    (notification: NotificationDTO) => {
      if (notification.status === NotificationStatus.UNREAD) {
        handleMarkAsRead(notification.id);
      }
      if (notification.actionUrl) {
        router.push(notification.actionUrl);
      }
    },
    [router, handleMarkAsRead],
  );

  const handlePaginationChange = useCallback((pageSize: number, page: number) => {
    setItemsPerPage(pageSize);
    setPayload(new RequestModel({ page, limit: pageSize }));
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const handleRefresh = useCallback(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
  }, []);

  const clearFilters = useCallback(() => {
    setStatusFilter('all');
    setTypeFilter('all');
    setDateRange(undefined);
    setPayload(new RequestModel({ page: 1, limit: 20 }));
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: NotificationStatus.UNREAD, label: 'Unread' },
    { value: NotificationStatus.READ, label: 'Read' },
    { value: NotificationStatus.ARCHIVED, label: 'Archived' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...Object.values(NotificationType).map((type) => ({
      value: type,
      label: getNotificationTypeLabel(type),
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with the latest activities and updates"
        icon={Bell}
        iconBgColor="bg-primary-100"
        iconColor="text-primary"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              Refresh
            </Button>
            {hasUnread && (
              <Button onClick={handleMarkAllAsRead}>
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </Button>
            )}
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter notifications by status, type, or date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                        </>
                      ) : (
                        dateRange.from.toLocaleDateString()
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                    {dateRange && (
                      <X
                        className="ml-auto h-4 w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateRange(undefined);
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button variant="secondary" className="w-full border border-transparent" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === NotificationStatus.UNREAD
              ? 'Unread Notifications'
              : statusFilter === NotificationStatus.READ
              ? 'Read Notifications'
              : statusFilter === NotificationStatus.ARCHIVED
              ? 'Archived Notifications'
              : 'All Notifications'}
          </CardTitle>
          <CardDescription>
            {isLoading
              ? 'Loading...'
              : `${pagination.totalItems} notification${pagination.totalItems !== 1 ? 's' : ''} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title={`No ${statusFilter !== 'all' ? statusFilter : ''} notifications found`}
              description={
                statusFilter === NotificationStatus.UNREAD
                  ? 'All caught up! Check back later for new notifications.'
                  : "You'll see notifications here when they arrive."
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="divide-y border rounded-lg overflow-hidden">
                {notifications.map((notification) => (
                  <Notification
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                  />
                ))}
              </div>

              <Pagination
                itemsPerPage={pagination.itemsPerPage}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsLength={notifications.length}
                onPaginationChange={handlePaginationChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
