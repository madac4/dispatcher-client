'use client';

import { UserRole } from '@/lib/models/auth.model';
import { useAuthStore } from '@/lib/stores/authStore';
import { PackagePlus, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';
import RegisterForm from '../forms/RegisterForm';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { HeaderNotifications } from './HeaderNotifications';

export function DashboardHeader() {
  const { logout, role } = useAuthStore();
  const userRole = role();

  return (
    <header className="flex min-h-14 items-center justify-between gap-2 sm:gap-4 border-b bg-background px-4 lg:min-h-16 lg:px-6">
      <span></span>
      <div className="flex items-center gap-2">
        <HeaderNotifications />
        {userRole === UserRole.USER && (
          <Button asChild variant="outline">
            <Link href="/dashboard/orders/create">
              <PackagePlus size={18} />
              New Order
            </Link>
          </Button>
        )}

        {userRole === UserRole.ADMIN && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserRoundPlus />
                Register Moderator
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Register Moderator</DialogTitle>
                <DialogDescription>Register a new moderator.</DialogDescription>
              </DialogHeader>
              <RegisterForm role={UserRole.MODERATOR} />
            </DialogContent>
          </Dialog>
        )}
        <Button onClick={logout}>Logout</Button>
      </div>
    </header>
  );
}
