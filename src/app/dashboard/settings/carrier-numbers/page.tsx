'use client'

import Loading from '@/app/loading'
import FilesModal from '@/components/modals/FilesModal'
import UploadCarrierFile from '@/components/modals/UploadCarrierFile'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { getCarrierNumbers, updateCarrierNumbers } from '@/lib/services/settingsService'
import { useSettingsStore } from '@/lib/stores/settingsStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ban, FileText, Loader2, Save, Truck, Upload } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const carrierFormSchema = z.object({
  mcNumber: z.string().min(1, 'MC number is required'),
  dotNumber: z.string().min(1, 'DOT number is required'),
  einNumber: z.string().min(1, 'EIN number is required'),
  iftaNumber: z.string().optional(),
  orNumber: z.string().optional(),
  kyuNumber: z.string().optional(),
  txNumber: z.string().optional(),
  tnNumber: z.string().optional(),
  laNumber: z.string().optional(),
  notes: z.string().optional(),
})

export default function CarrierNumbersPage() {
  const { carrierNumbers, setCarrierNumbers } = useSettingsStore()
  const [isFetching, setIsFetching] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof carrierFormSchema>>({
    resolver: zodResolver(carrierFormSchema),
    defaultValues: {
      mcNumber: '',
      dotNumber: '',
      einNumber: '',
      iftaNumber: '',
      orNumber: '',
      kyuNumber: '',
      txNumber: '',
      tnNumber: '',
      laNumber: '',
      notes: '',
    },
  })

  const carrierNumbersFields = [
    { name: 'mcNumber', label: 'MC#', description: 'Motor Carrier Number', required: true },
    { name: 'dotNumber', label: 'DOT#', description: 'Department of Transportation', required: true },
    { name: 'einNumber', label: 'EIN#', description: 'Employer Identification Number', required: true },
  ]

  const statePermitsFields = [
    { name: 'iftaNumber', label: 'IFTA', description: 'International Fuel Tax Agreement' },
    { name: 'orNumber', label: 'OR', description: 'Oregon Permit' },
    { name: 'kyuNumber', label: 'KYU', description: 'Kentucky Permit' },
    { name: 'txNumber', label: 'TX', description: 'Texas Permit' },
    { name: 'tnNumber', label: 'TN', description: 'Tennessee Permit' },
    { name: 'laNumber', label: 'LA', description: 'Louisiana Permit' },
  ]

  const fetchCarrierNumbers = useCallback(async () => {
    setIsFetching(true)
    try {
      const { data } = await getCarrierNumbers()

      setCarrierNumbers(data)

      form.reset({
        mcNumber: data?.mcNumber || '',
        dotNumber: data?.dotNumber || '',
        einNumber: data?.einNumber || '',
        iftaNumber: data?.iftaNumber || '',
        orNumber: data?.orNumber || '',
        kyuNumber: data?.kyuNumber || '',
        txNumber: data?.txNumber || '',
        tnNumber: data?.tnNumber || '',
        laNumber: data?.laNumber || '',
        notes: data?.notes || '',
      })
    } finally {
      setIsFetching(false)
    }
  }, [form, setCarrierNumbers])

  useEffect(() => {
    fetchCarrierNumbers()
  }, [fetchCarrierNumbers])

  const isCarrierNumbersIncomplete = () => {
    if (!carrierNumbers) return true

    return !carrierNumbers.mcNumber || !carrierNumbers.dotNumber || !carrierNumbers.einNumber
  }

  async function onSubmit(values: z.infer<typeof carrierFormSchema>) {
    setIsLoading(true)
    try {
      const { message, data } = await updateCarrierNumbers(values)
      toast.success(message)
      setCarrierNumbers(data)

      console.log(data)

      form.reset({
        mcNumber: data?.mcNumber || '',
        dotNumber: data?.dotNumber || '',
        einNumber: data?.einNumber || '',
        iftaNumber: data?.iftaNumber || '',
        orNumber: data?.orNumber || '',
        kyuNumber: data?.kyuNumber || '',
        txNumber: data?.txNumber || '',
        tnNumber: data?.tnNumber || '',
        laNumber: data?.laNumber || '',
        notes: data?.notes || '',
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
      {isCarrierNumbersIncomplete() && (
        <Alert className="border-red-200 bg-red-50">
          <Ban className="!size-5 !text-red-800" />
          <AlertDescription className="text-red-800 font-medium text-base">
            Please add carrier numbers to continue.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Truck className="h-8 w-8 text-primary" />
          </div>

          <div>
            <CardTitle className="text-3xl font-bold">Carrier Numbers</CardTitle>
            <CardDescription className="text-lg">
              Manage your transportation authority and permit numbers
            </CardDescription>
          </div>

          <div className="flex justify-center space-x-2">
            <FilesModal type="carrier">
              <Button variant="outline">
                <FileText className="h-4 w-4" />
                Carrier Files
              </Button>
            </FilesModal>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Federal Authority Numbers</h3>
                  <Badge variant="secondary">Required</Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {carrierNumbersFields.map(item => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name as keyof z.infer<typeof carrierFormSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {item.label} {item.required && <span className="text-destructive">*</span>}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">{item.description}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">State Permits & Registrations</h3>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {statePermitsFields.map(permit => (
                    <FormField
                      key={permit.name}
                      control={form.control}
                      name={permit.name as keyof z.infer<typeof carrierFormSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{permit.label}</FormLabel>
                          <FormControl>
                            <Input placeholder={`Enter ${permit.label} number`} {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">{permit.description}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Additional Notes</h3>
                </div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional information about permits, restrictions, or special requirements..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <UploadCarrierFile>
                  <Button type="button" variant="outline" className="relative">
                    <Upload className="h-4 w-4" />
                    Upload File
                  </Button>
                </UploadCarrierFile>
                <Button type="submit" disabled={isLoading || isFetching || !form.formState.isDirty}>
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
