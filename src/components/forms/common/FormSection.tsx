'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FormSectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export function FormSection({ title, icon: Icon, children, className, iconClassName }: FormSectionProps) {
  return (
    <Card className={cn('space-y-0', className)}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          {Icon && <Icon className={cn('w-5 h-5 mr-2 text-primary', iconClassName)} />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
