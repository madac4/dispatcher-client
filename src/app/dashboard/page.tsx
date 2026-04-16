'use client';

import { SectionCards } from '@/components/blocks/SectionCards';
import { UsersList } from '@/components/blocks/UsersList';
import { UserRole } from '@/lib/models/auth.model';
import { useAuthStore } from '@/lib/stores/authStore';
import CarrierNumbersPage from './settings/carrier-numbers/page';
import CompanyInformationPage from './settings/company-information/page';

export default function DashboardPage() {
  const { role } = useAuthStore();
  const isAdmin = role() === UserRole.ADMIN;
  const isUser = role() === UserRole.USER;

  return (
    <div className="space-y-6">
      {isAdmin && (
        <>
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your click permit dashboard</p>
          </div>
          <SectionCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UsersList role={UserRole.USER} title="Users" />
            <UsersList role={UserRole.MODERATOR} title="Moderators" />
          </div>
        </>
      )}

      {isUser && (
        <div className="space-y-6">
          <CompanyInformationPage />
          <CarrierNumbersPage />
        </div>
      )}
    </div>
  );
}
