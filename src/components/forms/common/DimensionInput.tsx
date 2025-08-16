'use client'

import { Button } from '@/components/ui/button'
import { FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface DimensionInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TNameFt extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TNameIn extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  nameFt: TNameFt
  nameIn: TNameIn
  label: string
  required?: boolean
  className?: string
}

export function DimensionInput<
  TFieldValues extends FieldValues = FieldValues,
  TNameFt extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TNameIn extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  nameFt,
  nameIn,
  label,
  required = false,
  className,
}: DimensionInputProps<TFieldValues, TNameFt, TNameIn>) {
  const { field: fieldFt } = useController({ control, name: nameFt })
  const { field: fieldIn } = useController({ control, name: nameIn })

  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <FormControl>
            <Input
              type="number"
              placeholder="0"
              {...fieldFt}
              className="h-10 text-center rounded-r-none bg-white font-medium"
            />
          </FormControl>
          <Button
            variant="outline"
            className="text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent"
            type="button"
          >
            ft
          </Button>
        </div>
        <div className="flex items-center">
          <FormControl>
            <Input
              type="number"
              placeholder="0"
              {...fieldIn}
              className="h-10 text-center rounded-r-none bg-white font-medium"
            />
          </FormControl>
          <Button
            variant="outline"
            className="text-sm border-l-0 rounded-l-none text-gray-600 font-medium bg-transparent"
            type="button"
          >
            in
          </Button>
        </div>
      </div>
    </div>
  )
}
