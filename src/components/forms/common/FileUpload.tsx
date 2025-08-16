'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FileText, Upload, X } from 'lucide-react'
import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { toast } from 'sonner'

interface FileUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  maxSize?: number // in MB
  className?: string
}

export function FileUpload<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, maxSize = 10, className }: FileUploadProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="min-h-[80px] border-2 border-dashed rounded-lg p-4">
            {field.value && Array.isArray(field.value) && field.value.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Selected files:</p>
                {(field.value as File[])?.map((file: File, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFiles = (field.value as File[])?.filter((_: File, i: number) => i !== index)
                          field.onChange(newFiles)
                        }}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 space-y-1">
                <div>No files associated with this order</div>
                <div className="text-xs text-gray-400">Maximum file size: {maxSize}MB per file</div>
              </div>
            )}

            <div className="flex justify-center mt-2">
              <Button className="relative" type="button">
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    onChange={e => {
                      const files = Array.from(e.target.files || [])
                      const maxSizeBytes = maxSize * 1024 * 1024
                      const oversizedFiles = files.filter(file => file.size > maxSizeBytes)

                      if (oversizedFiles.length > 0) {
                        const fileNames = oversizedFiles.map(file => file.name).join(', ')
                        toast.error(`Files larger than ${maxSize}MB: ${fileNames}`)
                        return
                      }

                      field.onChange(files)
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="absolute inset-0 h-full w-full !cursor-pointer !opacity-0"
                  />
                </FormControl>
                <Upload className="w-4 h-4" />
                Upload File
              </Button>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
