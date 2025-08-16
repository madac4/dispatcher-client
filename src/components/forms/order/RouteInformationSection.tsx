'use client'

import { FormField } from '@/components/forms/common/FormField'
import { FormSection } from '@/components/forms/common/FormSection'
import { Input } from '@/components/ui/input'
import { MapPin } from 'lucide-react'
import { Control, FieldValues } from 'react-hook-form'

interface RouteFormData extends FieldValues {
  originAddress: string
  destinationAddress: string
}

interface RouteInformationSectionProps {
  control: Control<RouteFormData>
}

export function RouteInformationSection({ control }: RouteInformationSectionProps) {
  return (
    <FormSection title="Route Information" icon={MapPin}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={control} name="originAddress" label="Origin Address" required>
          <Input placeholder="Enter a location" />
        </FormField>
        <FormField control={control} name="destinationAddress" label="Destination Address" required>
          <Input placeholder="Enter a location" />
        </FormField>
      </div>
      <div className="h-[480px] bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1635959542742!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </FormSection>
  )
}
