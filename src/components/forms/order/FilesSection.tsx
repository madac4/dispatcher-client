'use client'

import { FileUpload } from '@/components/forms/common/FileUpload'
import { FormSection } from '@/components/forms/common/FormSection'
import { Upload } from 'lucide-react'
import { Control, FieldValues } from 'react-hook-form'

interface FilesFormData extends FieldValues {
  files: File[]
}

interface FilesSectionProps {
  control: Control<FilesFormData>
}

export function FilesSection({ control }: FilesSectionProps) {
  return (
    <FormSection title="List of files for #" icon={Upload}>
      <FileUpload control={control} name="files" maxSize={10} className="space-y-4" />
    </FormSection>
  )
}
