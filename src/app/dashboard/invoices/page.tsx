'use client';

import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserRole } from '@/lib/models/auth.model';
import { Invoice } from '@/lib/models/invoice.model';
import { InvoiceService } from '@/lib/services/invoiceService';
import { useAuthStore } from '@/lib/stores/authStore';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, formatDate } from 'date-fns';
import {
  CalendarIcon,
  Download,
  Eye,
  Loader2,
  Mail,
  MoreHorizontal,
  Plus,
  Receipt,
  ReceiptIcon,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const filterFormSchema = z.object({
  search: z.string().optional(),
  dateRange: z.custom<DateRange>().optional(),
});

type FilterFormData = z.infer<typeof filterFormSchema>;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { role } = useAuthStore();
  const router = useRouter();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userRole = role();
  const isAdmin = userRole === UserRole.ADMIN;

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      search: '',
      dateRange: undefined,
    },
  });

  const loadInvoices = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const dateRange = form.getValues('dateRange');
        const response = await InvoiceService.getInvoices({
          page,
          limit: 10,
          search: form.getValues('search'),
          startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
          endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        });

        if (response.data && response.meta) {
          setInvoices(response.data);
          setCurrentPage(response.meta.currentPage);
          setTotalPages(response.meta.totalPages);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [form],
  );

  useEffect(() => {
    loadInvoices(1);
  }, [loadInvoices]);

  const handleDelete = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await InvoiceService.deleteInvoice(invoiceId);
      toast.success('Invoice deleted successfully');
      loadInvoices(currentPage);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to delete invoice');
      } else {
        toast.error('Failed to delete invoice');
      }
    }
  };

  const handleDownload = async (invoiceId: string) => {
    try {
      await InvoiceService.downloadInvoice(invoiceId);
      toast.success('Invoice downloaded successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to download invoice');
      } else {
        toast.error('Failed to download invoice');
      }
    }
  };

  const handleSendEmail = async (invoiceId: string) => {
    try {
      await InvoiceService.sendInvoiceEmail(invoiceId);
      toast.success('Invoice email sent successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to send invoice email');
      } else {
        toast.error('Failed to send invoice email');
      }
    }
  };

  const handleSearch = useCallback(
    (value: string) => {
      form.setValue('search', value);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        try {
          setIsLoading(true);
          await loadInvoices(1);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    },
    [form, loadInvoices],
  );

  const handleDateRangeChange = (range: DateRange | undefined) => {
    form.setValue('dateRange', range);
    loadInvoices(1);
  };

  const handleClearFilters = () => {
    form.reset();
    loadInvoices(1);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="View and manage invoices"
        icon={ReceiptIcon}
        iconBgColor="bg-primary-100"
        iconColor="text-primary"
      />

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{isAdmin ? 'All Invoices' : 'My Invoices'}</CardTitle>

          {isAdmin && (
            <Button onClick={() => router.push('/dashboard/invoices/create')}>
              <Plus className="w-4 h-4" />
              Create Invoice
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Search by invoice number, company name..."
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleSearch(e.target.value);
                              }}
                              className="pr-10"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                <CalendarIcon className="h-4 w-4" />
                                {field.value?.from ? (
                                  field.value.to ? (
                                    <>
                                      {format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}
                                    </>
                                  ) : (
                                    format(field.value.from, 'LLL dd, y')
                                  )
                                ) : (
                                  <span>Pick a date range</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={field.value?.from}
                              selected={field.value}
                              onSelect={(range) => {
                                field.onChange(range);
                                handleDateRangeChange(range);
                              }}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {(form.watch('search') || form.watch('dateRange')) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {form.watch('search') && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
                      Search: &quot;{form.watch('search')}&quot;
                    </div>
                  )}
                  {form.watch('dateRange')?.from && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
                      Period: {format(form.watch('dateRange')!.from!, 'MMM dd')}
                      {form.watch('dateRange')?.to && ` - ${format(form.watch('dateRange')!.to!, 'MMM dd')}`}
                    </div>
                  )}
                  <Button variant="secondary" size="sm" onClick={handleClearFilters} className="h-7 px-2">
                    <X className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </Form>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : invoices.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No invoices found"
              description={isAdmin ? 'Create your first invoice to get started' : 'You have no invoices yet'}
              action={
                isAdmin
                  ? {
                      label: 'Create Invoice',
                      onClick: () => router.push('/dashboard/invoices/create'),
                      icon: Plus,
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice._id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.companyInfo?.email || 'N/A'}</TableCell>
                      <TableCell>{invoice.companyInfo?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {formatDate(invoice.startDate, 'MMM dd, yyyy')} - {formatDate(invoice.endDate, 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(invoice.totalAmount)}</TableCell>
                      <TableCell>{formatDateTime(invoice.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/invoices/${invoice._id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(invoice._id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            {isAdmin && (
                              <>
                                <DropdownMenuItem onClick={() => handleSendEmail(invoice._id)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(invoice._id)}
                                  variant="destructive"
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadInvoices(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadInvoices(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
