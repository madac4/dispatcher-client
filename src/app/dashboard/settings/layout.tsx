'use client';

import { Card } from '@/components/ui/card';
import { UserRole } from '@/lib/models/auth.model';
import { useAuthStore } from '@/lib/stores/authStore';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';

const tabs = [
  {
    name: 'My Inventory',
    href: '/dashboard/settings/inventory',
    icon: '📦',
    role: [UserRole.USER],
  },
  {
    name: 'Company Information',
    href: '/dashboard/settings/company-information',
    icon: '🏢',
    role: [UserRole.USER],
  },
  {
    name: 'Carrier Numbers',
    href: '/dashboard/settings/carrier-numbers',
    icon: '🚛',
    role: [UserRole.USER],
  },
  {
    name: 'Update Password',
    href: '/dashboard/settings/update-password',
    icon: '🔒',
    role: [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const allowedTab = tabs.find((tab) => tab.role.includes(role()!));
    if (allowedTab) {
      router.push(allowedTab.href);
    }
  }, [role, router]);

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <div className="flex items-center">
          {tabs.map(
            (tab, index) =>
              tab.role.includes(role()!) && (
                <div key={tab.name} className="flex items-center">
                  <Link
                    href={tab.href}
                    className={cn(
                      'flex items-center space-x-2 py-4 px-6 rounded-md font-medium transition-all duration-200',
                      index === 0 && 'rounded-r-none',
                      index !== 0 && index !== tabs.length - 1 && 'rounded-none',
                      index === tabs.length - 1 && 'rounded-l-none',
                      pathname === tab.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                    )}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </Link>
                </div>
              ),
          )}
        </div>
      </Card>

      {children}
    </>
  );
}
