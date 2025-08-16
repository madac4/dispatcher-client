'use client'

import { DimensionInput } from '@/components/forms/common/DimensionInput'
import { FormField } from '@/components/forms/common/FormField'
import { FormSection } from '@/components/forms/common/FormSection'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Package } from 'lucide-react'
import { Control, FieldValues } from 'react-hook-form'

interface LoadFormData extends FieldValues {
  commodity: string
  loadDims: string
  lengthFt: string
  lengthIn: string
  widthFt: string
  widthIn: string
  heightFt: string
  heightIn: string
  rearOverhangFt: string
  rearOverhangIn: string
  makeModel: string
  serial: string
  singleMultiple: string
  legalWeight: 'yes' | 'no'
}

interface LoadInformationSectionProps {
  control: Control<LoadFormData>
}

export function LoadInformationSection({ control }: LoadInformationSectionProps) {
  return (
    <FormSection title="Load Information" icon={Package}>
      <FormField control={control} name="commodity" label="Commodity" required>
        <Input placeholder="Enter commodity description" />
      </FormField>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <FormField control={control} name="loadDims" label="Load Dims" required>
            <Input placeholder="Enter load dimensions" className="bg-white font-medium" />
          </FormField>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <DimensionInput control={control} nameFt="lengthFt" nameIn="lengthIn" label="Overall Length" required />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <DimensionInput control={control} nameFt="widthFt" nameIn="widthIn" label="Overall Width" required />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <DimensionInput control={control} nameFt="heightFt" nameIn="heightIn" label="Overall Height" required />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <DimensionInput
            control={control}
            nameFt="rearOverhangFt"
            nameIn="rearOverhangIn"
            label="Rear Overhang"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField control={control} name="makeModel" label="Make/Model">
          <Input placeholder="Enter make and model" />
        </FormField>

        <FormField control={control} name="serial" label="Serial#">
          <Input placeholder="Enter serial number" />
        </FormField>

        <FormField control={control} name="singleMultiple" label="Single/Multiple pcs">
          <Input placeholder="Enter quantity" />
        </FormField>
      </div>

      <FormField control={control} name="legalWeight" label="Legal Weight">
        <RadioGroup onValueChange={() => {}} value="" className="flex space-x-4">
          <div className="flex items-center space-x-1.5">
            <RadioGroupItem value="yes" id="yes" />
            <label htmlFor="yes">Yes</label>
          </div>
          <div className="flex items-center space-x-1.5">
            <RadioGroupItem value="no" id="no" />
            <label htmlFor="no">No</label>
          </div>
        </RadioGroup>
      </FormField>
    </FormSection>
  )
}
