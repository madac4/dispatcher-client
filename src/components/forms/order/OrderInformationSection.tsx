'use client'

import { SingleDatePicker } from '@/components/elements/SingleDatePicker'
import { FormField } from '@/components/forms/common/FormField'
import { FormSection } from '@/components/forms/common/FormSection'
import { Input } from '@/components/ui/input'
import { User } from 'lucide-react'
import { Control, FieldValues } from 'react-hook-form'

interface OrderFormData extends FieldValues {
  contact: string
  permitStartDate: Date
}

interface OrderInformationSectionProps {
  control: Control<OrderFormData>
}

export function OrderInformationSection({ control }: OrderInformationSectionProps) {
  return (
    <FormSection title="Order Information" icon={User}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={control} name="contact" label="Contact" required>
          <Input autoComplete="email" type="email" placeholder="Enter contact information" />
        </FormField>

        <FormField control={control} name="permitStartDate" label="Permit Start Date" required>
          <SingleDatePicker onChange={() => {}} minDate={new Date()} />
        </FormField>
      </div>
    </FormSection>
  )
}
