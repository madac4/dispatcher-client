'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { SingleDatePicker } from '@/components/elements/SingleDatePicker';
import { OrdersTable } from '@/components/tables/orders-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UsStates } from '@/constants/constants';
import { CreateInvoiceRequest, InvoiceCharge, UserForInvoice } from '@/lib/models/invoice.model';
import { PaginatedOrderDTO } from '@/lib/models/order.model';
import { RequestModel } from '@/lib/models/response.model';
import { InvoiceService } from '@/lib/services/invoiceService';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, FileText, Loader2, Plus, ReceiptIcon, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const invoiceFormSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  charges: z
    .array(
      z.object({
        state: z.string().min(1, 'State is required'),
        oversize: z.number().min(0, 'Must be 0 or greater'),
        overweight: z.number().min(0, 'Must be 0 or greater'),
        superload: z.number().min(0, 'Must be 0 or greater'),
        serviceFee: z.number().min(0, 'Must be 0 or greater'),
        escort: z.number().min(0, 'Must be 0 or greater'),
        total: z.number(),
      }),
    )
    .min(1, 'At least one charge is required'),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export default function CreateInvoicePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserForInvoice[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserForInvoice | null>(null);
  const [previewOrders, setPreviewOrders] = useState<PaginatedOrderDTO[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      userId: '',
      startDate: new Date(),
      endDate: new Date(),
      charges: [
        {
          state: '',
          oversize: 0,
          overweight: 0,
          superload: 0,
          serviceFee: 0,
          escort: 0,
          total: 0,
        },
      ],
    },
  });

  const charges = form.watch('charges');
  const selectedUserId = form.watch('userId');
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await InvoiceService.getUsersForInvoice();
        if (response.data) setUsers(response.data);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      const user = users.find((u) => u._id === selectedUserId);
      setSelectedUser(user || null);
    } else {
      setSelectedUser(null);
    }
  }, [selectedUserId, users]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!selectedUserId || !startDate || !endDate) {
        setPreviewOrders([]);
        return;
      }

      const payload: RequestModel = new RequestModel();
      payload.userId = selectedUserId;
      payload.startDate = startDate.toISOString();
      payload.endDate = endDate.toISOString();
      payload.page = 1;
      payload.limit = 100;
      payload.search = '';
      setLoadingOrders(true);

      try {
        const response = await InvoiceService.getOrdersForInvoicePreview(payload);
        if (response.data) {
          setPreviewOrders(response.data);
          if (response.data.length === 0) {
            toast.info('No orders with status "Requires Invoice" found for the selected period');
          }
        }
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [selectedUserId, startDate, endDate]);

  const calculateChargeTotal = useCallback((charge: InvoiceCharge) => {
    if (!charge) return 0;

    const total =
      (charge.oversize || 0) +
      (charge.overweight || 0) +
      (charge.superload || 0) +
      (charge.serviceFee || 0) +
      (charge.escort || 0);

    return total;
  }, []);

  const grandTotal = charges.reduce((sum, charge) => sum + (charge.total || 0), 0);

  const addCharge = () => {
    const newCharges = [
      ...charges,
      {
        state: '',
        oversize: 0,
        overweight: 0,
        superload: 0,
        serviceFee: 0,
        escort: 0,
        total: 0,
      },
    ];
    form.setValue('charges', newCharges);
  };

  const removeCharge = (index: number) => {
    if (charges.length <= 1) {
      toast.error('At least one charge is required');
      return;
    }
    const newCharges = charges.filter((_, i) => i !== index);
    form.setValue('charges', newCharges);
  };

  const handleChargeChange = (index: number, field: keyof InvoiceCharge, value: string | number) => {
    const updatedCharges = [...charges];
    updatedCharges[index] = {
      ...updatedCharges[index],
      [field]: typeof value === 'string' && field !== 'state' ? parseFloat(value) || 0 : value,
    };

    const total = calculateChargeTotal(updatedCharges[index]);
    updatedCharges[index] = { ...updatedCharges[index], total };

    form.setValue('charges', updatedCharges);
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setIsLoading(true);

      if (data.startDate > data.endDate) {
        toast.error('Start date must be before end date');
        return;
      }

      const payload: CreateInvoiceRequest = {
        userId: data.userId,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        charges: data.charges.map((charge) => ({
          ...charge,
          state: UsStates.find((state) => state.value === charge.state)?.label || '',
          total: calculateChargeTotal(charge),
        })),
      };

      const response = await InvoiceService.createInvoice(payload);

      if (response.data) {
        toast.success('Invoice created successfully');
        form.reset();
        setSelectedUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Invoice"
        description="Generate a new invoice for a user"
        icon={ReceiptIcon}
        iconBgColor="bg-primary-100"
        iconColor="text-primary"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center">
                  <FileText className="w-5 h-5 text-primary" />
                  Invoice Information
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1  md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        User <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={loadingUsers}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={loadingUsers ? 'Loading users...' : 'Select a user'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user._id} value={user._id}>
                              {user.email}
                              {user.companyInfo ? ` - ${user.companyInfo.name}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Start Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <SingleDatePicker
                          onChange={(date) => {
                            field.onChange(date);
                            form.setValue('startDate', date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        End Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <SingleDatePicker
                          onChange={(date) => {
                            field.onChange(date);
                            form.setValue('endDate', date);
                          }}
                          minDate={form.watch('startDate')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedUser?.companyInfo && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Company Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{' '}
                      <span className="font-medium">{selectedUser.companyInfo.name}</span>
                    </div>
                    {selectedUser.companyInfo.dba && (
                      <div>
                        <span className="text-muted-foreground">DBA:</span>{' '}
                        <span className="font-medium">{selectedUser.companyInfo.dba}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Address:</span>{' '}
                      <span className="font-medium">{selectedUser.companyInfo.address}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">City, State ZIP:</span>{' '}
                      <span className="font-medium">
                        {selectedUser.companyInfo.city}, {selectedUser.companyInfo.state} {selectedUser.companyInfo.zip}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      <span className="font-medium">{selectedUser.companyInfo.phone}</span>
                    </div>
                    {selectedUser.companyInfo.fax && (
                      <div>
                        <span className="text-muted-foreground">Fax:</span>{' '}
                        <span className="font-medium">{selectedUser.companyInfo.fax}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="font-medium">{selectedUser.companyInfo.email}</span>
                    </div>
                  </div>
                </div>
              )}

              {!loadingOrders && previewOrders.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Orders Preview</h3>
                  </div>
                  <OrdersTable data={previewOrders} payload={new RequestModel()} />
                </>
              )}
            </CardContent>

            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center">
                  <FileText className="w-5 h-5 text-primary" />
                  Charges
                </span>
                <Button type="button" variant="outline" size="sm" onClick={addCharge}>
                  <Plus className="w-4 h-4" />
                  Add Charge
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Oversize</TableHead>
                    <TableHead>Overweight</TableHead>
                    <TableHead>Superload</TableHead>
                    <TableHead>Service Fee</TableHead>
                    <TableHead>Escort</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {charges.map((charge, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={charge.state}
                          onValueChange={(value) => handleChargeChange(index, 'state', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {UsStates.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={charge.oversize || 0}
                          onChange={(e) => handleChargeChange(index, 'oversize', e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={charge.overweight || 0}
                          onChange={(e) => handleChargeChange(index, 'overweight', e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={charge.superload || 0}
                          onChange={(e) => handleChargeChange(index, 'superload', e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={charge.serviceFee || 0}
                          onChange={(e) => handleChargeChange(index, 'serviceFee', e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={charge.escort || 0}
                          onChange={(e) => handleChargeChange(index, 'escort', e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${(charge.total || 0).toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCharge(index)}
                          disabled={charges.length <= 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6} className="text-right font-bold">
                      Grand Total:
                    </TableCell>
                    <TableCell className="font-bold">${grandTotal.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setSelectedUser(null);
              }}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Create Invoice
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
