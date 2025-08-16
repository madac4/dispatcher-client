'use client'

import Loading from '@/app/loading'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { UsStates } from '@/constants/constants'
import { getCompanyInfo, updateCompanyInfo } from '@/lib/services/settingsService'
import { useSettingsStore } from '@/lib/stores/settingsStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ban, Building, Loader2, MapPin, Phone, Save } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const companyFormSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  dba: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'State must be 2 characters'),
  zip: z.string().min(5, 'ZIP code must be at least 5 digits'),
  phone: z.string().min(10, 'Phone number is required'),
  fax: z.string().optional(),
  email: z.string().email('Invalid email address'),
})

export default function CompanyInformationPage() {
  const { setCompanyInfo, companyInfo } = useSettingsStore()
  const [isFetching, setIsFetching] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const isCompanyInfoIncomplete = () => {
    if (!companyInfo) return true

    return (
      !companyInfo.name ||
      !companyInfo.address ||
      !companyInfo.city ||
      !companyInfo.state ||
      !companyInfo.zip ||
      !companyInfo.phone ||
      !companyInfo.email
    )
  }

  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      dba: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      fax: '',
      email: '',
    },
  })

  const fetchCompanyInfo = useCallback(async () => {
    setIsFetching(true)
    try {
      const { data } = await getCompanyInfo()

      setCompanyInfo(data)
      form.reset({
        name: data?.name || '',
        dba: data?.dba || '',
        address: data?.address || '',
        city: data?.city || '',
        state: data?.state || '',
        zip: data?.zip || '',
        phone: data?.phone || '',
        fax: data?.fax || '',
        email: data?.email || '',
      })
    } finally {
      setIsFetching(false)
    }
  }, [form, setCompanyInfo])

  useEffect(() => {
    fetchCompanyInfo()
  }, [fetchCompanyInfo])

  async function onSubmit(values: z.infer<typeof companyFormSchema>) {
    setIsLoading(true)
    try {
      const { message, data } = await updateCompanyInfo(values)
      toast.success(message)
      setCompanyInfo(data)
      form.reset({
        name: data?.name || '',
        dba: data?.dba || '',
        address: data?.address || '',
        city: data?.city || '',
        state: data?.state || '',
        zip: data?.zip || '',
        phone: data?.phone || '',
        fax: data?.fax || '',
        email: data?.email || '',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <Loading />
  }

  return (
    <>
      {isCompanyInfoIncomplete() && (
        <Alert className="border-red-200 bg-red-50">
          <Ban className="!size-5 !text-red-800" />
          <AlertDescription className="text-red-800 font-medium text-base">
            Please add company information to continue.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Building className="h-8 w-8 text-primary" />
          </div>

          <div>
            <CardTitle className="text-3xl font-bold">Company Information</CardTitle>
            <CardDescription className="text-lg">Manage your business details and contact information</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Company Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dba"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DBA (Doing Business As)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Address Information</h3>
                </div>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Street Address <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            City <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            State <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {UsStates.map(state => (
                                <SelectItem key={state.value} value={state.value}>
                                  {state.label}
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
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            ZIP Code <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone Number <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fax Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter fax number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Company Email <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isLoading || !form.formState.isDirty || !form.formState.isValid}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
