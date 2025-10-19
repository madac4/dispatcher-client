export default function NotificationsPage() {
  return (
    // <div className="container mx-auto p-6 space-y-6">
    //   <div className="flex items-center justify-between">
    //     <div>
    //       <h1 className="text-3xl font-bold">Notifications</h1>
    //       <p className="text-gray-600">Stay updated with the latest activities and updates</p>
    //     </div>

    //     <div className="flex items-center gap-2">
    //       <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
    //         <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
    //         Refresh
    //       </Button>

    //       {hasUnread && (
    //         <Button onClick={handleMarkAllAsRead}>
    //           <CheckCheck className="h-4 w-4 mr-2" />
    //           Mark All Read
    //         </Button>
    //       )}
    //     </div>
    //   </div>
    //   {/* Filter Tabs */}
    //   <div className="flex gap-2">
    //     <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
    //       All Notifications
    //     </Button>
    //     <Button variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')}>
    //       Unread Only
    //       {hasUnread && (
    //         <Badge variant="secondary" className="ml-2">
    //           {hasUnread
    //             ? notifications.filter((notification) => notification.status === NotificationStatus.UNREAD).length
    //             : 0}
    //         </Badge>
    //       )}
    //     </Button>
    //   </div>

    //   {/* Notifications List */}
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>{filter === 'unread' ? 'Unread Notifications' : 'All Notifications'}</CardTitle>
    //       <CardDescription>{isLoading ? 'Loading...' : `${notifications.length} notifications found`}</CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       {isLoading ? (
    //         <div className="flex items-center justify-center py-8">
    //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    //         </div>
    //       ) : notifications.length === 0 ? (
    //         <div className="text-center py-8 text-gray-500">
    //           <p>No {filter === 'unread' ? 'unread ' : ''}notifications found</p>
    //           <p className="text-sm mt-1">
    //             {filter === 'unread'
    //               ? 'All caught up! Check back later for new notifications.'
    //               : "You'll see notifications here when they arrive."}
    //           </p>
    //         </div>
    //       ) : (
    //         <div className="space-y-1">
    //           {notifications.map((notification) => (
    //             <NotificationComponent
    //               key={notification.id}
    //               notification={notification}
    //               onClick={() => {
    //                 if (notification.unread) {
    //                   markAsRead([notification.id]);
    //                 }
    //                 if (notification.actionUrl) {
    //                   window.location.href = notification.actionUrl;
    //                 }
    //               }}
    //             />
    //           ))}
    //         </div>
    //       )}
    //     </CardContent>
    //   </Card>
    // </div>
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold mb-2">Notifications Page</h1>
      <p className="text-gray-500">This page is under development. Check back soon!</p>
    </div>
  );
}
