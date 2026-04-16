'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserRole } from '@/lib/models/auth.model';
import { Invoice } from '@/lib/models/invoice.model';
import { InvoiceService } from '@/lib/services/invoiceService';
import { useAuthStore } from '@/lib/stores/authStore';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ArrowLeft, Building2, FileText, Loader2, Printer, ReceiptIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = useAuthStore().role() === UserRole.ADMIN;

  useEffect(() => {
    const loadInvoice = async () => {
      if (!invoiceId) return;

      try {
        setIsLoading(true);
        const response = await InvoiceService.getInvoiceById(invoiceId);

        if (response.data) {
          setInvoice(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceId, router]);

  const handleDownloadPDF = async () => {
    try {
      await InvoiceService.downloadInvoice(invoiceId);
      toast.success('Invoice PDF downloaded successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to download invoice PDF');
      } else {
        toast.error('Failed to download invoice PDF');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Invoice ${invoice.invoiceNumber}`}
        description="Invoice details"
        icon={ReceiptIcon}
        iconBgColor="bg-primary-100"
        iconColor="text-primary"
        actions={
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => router.push('/dashboard/invoices')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Printer className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">Invoice #{invoice.invoiceNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">Created: {formatDate(invoice.createdAt)}</p>
            </div>

            {!isAdmin && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Issued By:</p>
                <p className="font-semibold">CLICK PERMIT LLC</p>
                <p className="text-sm">340 W BUTTERFIELD RD 2B</p>
                <p className="text-sm">Elmhurst, IL 60126</p>
                <p className="text-sm">
                  Phone:{' '}
                  <a href="tel:+14015525425" className="underline">
                    +1 (401) 552-5425
                  </a>
                </p>
                <p className="text-sm">
                  Email:{' '}
                  <a href="mailto:billing@click-permit.com" className="underline">
                    billing@click-permit.com
                  </a>
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Client Information</h3>
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-semibold">{invoice.companyInfo.name}</p>
                {invoice.companyInfo.dba && <p className="text-muted-foreground">DBA: {invoice.companyInfo.dba}</p>}
                <p>{invoice.companyInfo.address}</p>
                <p>
                  {invoice.companyInfo.city}, {invoice.companyInfo.state} {invoice.companyInfo.zip}
                </p>
                <p>Phone: {invoice.companyInfo.phone}</p>
                {invoice.companyInfo.fax && <p>Fax: {invoice.companyInfo.fax}</p>}
                <p>Email: {invoice.companyInfo.email}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Invoice Period</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Start Date:</span> {formatDate(invoice.startDate)}
                </p>
                <p>
                  <span className="text-muted-foreground">End Date:</span> {formatDate(invoice.endDate)}
                </p>
              </div>
            </div>
          </div>

          {invoice.orders && invoice.orders.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Loads</h3>
              <div className="space-y-4">
                {invoice.orders.map((order, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Truck #:</span> {order.truckNumber || 'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">Trailer #:</span> {order.trailerNumber || 'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">Contact:</span> {order.contact}
                          </p>
                          <p>
                            <span className="font-medium">Commodity:</span> {order.commodity}
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">From:</span> {order.originAddress}
                          </p>
                          <p>
                            <span className="font-medium">To:</span> {order.destinationAddress}
                          </p>
                          <p>
                            <span className="font-medium">Start Date:</span> {formatDate(order.permitStartDate)}
                          </p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <p className="font-semibold mb-3">Load Dimensions:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Length:</span> {order.lengthFt}ft {order.lengthIn}in
                          </div>
                          <div>
                            <span className="font-medium">Width:</span> {order.widthFt}ft {order.widthIn}in
                          </div>
                          <div>
                            <span className="font-medium">Height:</span> {order.heightFt}ft {order.heightIn}in
                          </div>
                          <div>
                            <span className="font-medium">ROH:</span> {order.rearOverhangFt}ft {order.rearOverhangIn}in
                          </div>
                        </div>
                        {(order.makeModel || order.serial || order.singleMultiple) && (
                          <div className="mt-3 space-y-1 text-sm">
                            {order.makeModel && (
                              <p>
                                <span className="font-medium">Make/Model:</span> {order.makeModel}
                              </p>
                            )}
                            {order.serial && (
                              <p>
                                <span className="font-medium">Serial Number:</span> {order.serial}
                              </p>
                            )}
                            {order.singleMultiple && (
                              <p>
                                <span className="font-medium">Single/Multiple pcs:</span> {order.singleMultiple}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">Weight is:</span>{' '}
                              {order.legalWeight === 'yes' ? 'legal' : 'overweight'}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-4">Charges</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Oversize</TableHead>
                  <TableHead className="text-right">Overweight</TableHead>
                  <TableHead className="text-right">Superload</TableHead>
                  <TableHead className="text-right">Service Fee</TableHead>
                  <TableHead className="text-right">Escort</TableHead>
                  <TableHead className="text-right font-semibold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.charges.map((charge, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{charge.state}</TableCell>
                    <TableCell className="text-right">{formatCurrency(charge.oversize || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(charge.overweight || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(charge.superload || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(charge.serviceFee || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(charge.escort || 0)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(charge.total || 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6} className="text-right font-bold">
                    Grand Total:
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">{formatCurrency(invoice.totalAmount)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
