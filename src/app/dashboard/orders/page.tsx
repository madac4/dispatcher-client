'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { PageTabs } from '@/components/common/PageTabs';
import { SearchAndFilter } from '@/components/common/SearchAndFilter';
import { OrdersTable } from '@/components/tables/orders-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrdersPage } from '@/hooks/useOrdersPage';
import { OrderStatusType } from '@/lib/models/order.model';
import { CheckCircle, Clock, DollarSign, Package, Truck } from 'lucide-react';

export default function OrdersPage() {
  const {
    searchTerm,
    statusFilter,
    activeTab,
    orders,
    statuses,
    setActiveTab,
    clearFilters,
    handleStatusChange,
    handleSearchChange,
    payload,
    getActiveOrders,
    getCompletedOrders,
    getPaidOrders,
    getArchivedOrders,
  } = useOrdersPage();

  const tabs = [
    {
      value: 'active',
      label: 'Active Orders',
      icon: Clock,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersTable data={orders} payload={payload} />
          </CardContent>
        </Card>
      ),
    },
    {
      value: 'completed',
      label: 'Completed Orders',
      icon: CheckCircle,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersTable data={orders} payload={payload} />
          </CardContent>
        </Card>
      ),
    },
    {
      value: 'paid',
      label: 'Paid Orders',
      icon: DollarSign,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Paid Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersTable data={orders} payload={payload} />
          </CardContent>
        </Card>
      ),
    },
    {
      value: 'archived',
      label: 'Archived Orders',
      icon: Package,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Archived Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersTable data={orders} payload={payload} />
          </CardContent>
        </Card>
      ),
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value as OrderStatusType);

    if (value === 'completed') {
      getCompletedOrders();
    } else if (value === 'paid') {
      getPaidOrders();
    } else if (value === 'archived') {
      getArchivedOrders();
    } else {
      getActiveOrders();
    }
  };

  return (
    <>
      <PageHeader
        title="Orders Management"
        description="Track and manage all your shipping orders"
        icon={Truck}
        iconBgColor="bg-primary-100"
        iconColor="text-primary"
      />

      <Card className="max-w-3xl w-full mx-auto p-4">
        <p className="text-gray-600 leading-relaxed">
          As we are providing automated third party services, we are unable to provide a return policy as we only offer
          a better and shorter way for the OS/OW application process. The client and the driver are ultimately
          responsible for the accuracy of the permit(s), so please take your time and be extra careful with the
          application process.
        </p>

        <p className="text-gray-600 leading-relaxed">
          The client is responsible for all the specifications set in the permit application process. As is stated in
          the provisions, the driver is ultimately responsible for the accuracy of the permit. The driver should verify
          carefully the permits <strong>BEFORE</strong> starting the trip.
        </p>
      </Card>

      <SearchAndFilter
        searchPlaceholder="Search by order ID, origin, destination, or truck number..."
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        filterOptions={statuses}
        filterValue={statusFilter}
        onFilterChange={handleStatusChange}
        onClearFilters={clearFilters}
        onRefresh={() => handleTabChange(activeTab)}
        className="mt-6"
      />

      <PageTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
}
