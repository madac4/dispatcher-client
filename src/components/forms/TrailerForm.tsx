'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DialogActions } from '@/constants/app.enum'
import { UsStates } from '@/constants/constants'
import { TrailerPayload } from '@/lib/models/trailer.model'
import { createTrailer, updateTrailer } from '@/lib/services/trailerService'
import { useTrailersStore } from '@/lib/stores/trailerStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type TrailerFormProps = {
  nhtsaData: TrailerPayload & { _id?: string }
  closeModal: () => void
  action: DialogActions
}

const trailerSchema = z.object({
  year: z.string(),
  make: z.string(),
  vin: z.string(),
  licencePlate: z.string(),
  state: z.string(),
  nrOfAxles: z.string(),
  length: z.string(),
  unitNumber: z.string(),
  type: z.string(),
})

export default function TrailerForm({ nhtsaData, closeModal, action }: TrailerFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { setUpdatedTrailer } = useTrailersStore()
  const form = useForm<z.infer<typeof trailerSchema>>({
    resolver: zodResolver(trailerSchema),
    defaultValues: {
      year: nhtsaData.year.toString() || '',
      make: nhtsaData.make || '',
      vin: nhtsaData.vin || '',
      licencePlate: nhtsaData.licencePlate || '',
      state: nhtsaData.state || '',
      nrOfAxles: nhtsaData.nrOfAxles.toString() || '',
      length: nhtsaData.length.toString() || '',
      type: nhtsaData.type || '',
      unitNumber: nhtsaData.unitNumber || '',
    },
  })

  function onSubmit(values: z.infer<typeof trailerSchema>) {
    setIsLoading(true)
    if (action === DialogActions.Create) addTrailer(values)
    if (action === DialogActions.Edit) editTrailer(values)
  }

  const addTrailer = async (values: z.infer<typeof trailerSchema>) => {
    try {
      const response = await createTrailer({
        ...values,
        year: values.year,
        nrOfAxles: Number(values.nrOfAxles),
        length: values.length,
      })
      toast.success(response.message)
      form.reset()
      closeModal()
    } finally {
      setIsLoading(false)
    }
  }

  const editTrailer = async (values: z.infer<typeof trailerSchema>) => {
    try {
      const response = await updateTrailer({ ...values, nrOfAxles: Number(values.nrOfAxles) }, nhtsaData._id || '')
      toast.success(response.message)
      setUpdatedTrailer(response.data)
      closeModal()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter the year of the truck" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter the make of the truck" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VIN</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter the VIN of the truck" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licencePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Licence Plate</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter the licence plate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="col-span-full w-full">
              <FormLabel>State</FormLabel>
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
          name="nrOfAxles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Axles</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={10} placeholder="Enter the number of axles" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter the length" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter the type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Number</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter the unit number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full col-span-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {action === DialogActions.Create ? 'Adding Truck...' : 'Updating Truck...'}
            </>
          ) : action === DialogActions.Create ? (
            'Add Truck'
          ) : (
            'Update Truck'
          )}
        </Button>
      </form>
    </Form>
  )
}
