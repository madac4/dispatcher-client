'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconBgColor = 'bg-primary-100',
  iconColor = 'text-primary',
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('text-center mb-6', className)}>
      {Icon && (
        <div className={cn('w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4', iconBgColor)}>
          <Icon className={cn('w-8 h-8', iconColor)} />
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      {description && <p className="text-gray-600">{description}</p>}
      {actions && <div className="mt-4">{actions}</div>}
    </div>
  );
}
