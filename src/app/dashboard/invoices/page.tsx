'use client';

import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserRole } from '@/lib/models/auth.model';
import { Invoice } from '@/lib/models/invoice.model';
import { InvoiceService } from '@/lib/services/invoiceService';
import { useAuthStore } from '@/lib/stores/authStore';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { Download, Eye, Loader2, Mail, MoreHorizontal, Plus, Receipt, ReceiptIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function InvoicesPage() {
  const router = useRouter();
  const { role } = useAuthStore();
  const userRole = role();
  const isAdmin = userRole === UserRole.ADMIN;
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadInvoices = async (page: number = 1) => {
    try {
      setIsLoading(true);
      // Backend will automatically filter by userId for non-admin users
      const response = await InvoiceService.getInvoices({
        page,
        limit: 10,
      });

      if (response.data && response.meta) {
        setInvoices(response.data);
        setCurrentPage(response.meta.currentPage);
        setTotalPages(response.meta.totalPages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices(1);
  }, []);

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
                        {formatDateTime(invoice.startDate)} - {formatDateTime(invoice.endDate)}
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

              {/* Pagination */}
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
