'use client'
import { cn } from '@/lib/utils'
import { ArrowUpFromLine, File, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface FileUploaderProps {
  label: string
  maxFileSize: number
  acceptedTypes: string[]
  uploadText: string
  removeLabel?: string
  uploadLabel?: string
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
}

export default function FileUploader({
  label,
  maxFileSize,
  acceptedTypes,
  uploadText,
  removeLabel,
  uploadLabel,
  selectedFile,
  setSelectedFile,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return setSelectedFile(null)

    if (file.size > maxFileSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxFileSize}MB`)
      return
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const mimeTypesMap = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
    }

    const isAccepted = acceptedTypes.some(type => {
      if (type.includes('/')) {
        return file.type === type
      } else {
        const mappedMimeType = mimeTypesMap[type as keyof typeof mimeTypesMap]
        return fileExtension === type.toLowerCase() || file.type === mappedMimeType
      }
    })

    if (!isAccepted) {
      toast.error(`File type must be one of ${acceptedTypes.join(', ')}`)
      return
    }

    setSelectedFile(file)
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div
        className={cn(
          'relative flex-1 rounded-lg border bg-background transition-all duration-300 hover:border-primary',
          isDragOver && 'border-primary bg-gray-50 ring-2 ring-primary/10',
        )}
        onDragOver={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
      >
        <div className="flex flex-col items-center justify-center p-4">
          <span className="rounded-full flex items-center justify-center transition-transform text-gray-800 ring-1 ring-gray-100 ring-offset-background ring-offset-2 bg-gradient-to-t from-gray-100 to-gray-50 hover:scale-[102%] active:scale-100 h-10 w-10">
            {selectedFile ? <File size={22} /> : <ArrowUpFromLine size={22} />}
          </span>
          <div className="mt-3 space-y-1 text-center text-gray-700">
            <h6 className="text-sm font-semibold">{selectedFile ? selectedFile?.name : uploadText}</h6>
            <span className="text-sm font-medium">Max file size {maxFileSize}MB</span>
          </div>
        </div>

        <Input
          type="file"
          onChange={handleFileChange}
          accept={acceptedTypes.map(type => (type.includes('/') ? type : `.${type}`)).join(',')}
          className="absolute inset-0 h-full w-full !cursor-pointer !opacity-0"
        />
      </div>

      {(uploadLabel || removeLabel) && (
        <div className="flex items-center gap-3">
          {removeLabel && (
            <Button variant="outline" onClick={() => setSelectedFile(null)} disabled={!selectedFile}>
              <Trash2 size={18} />
              {removeLabel}
            </Button>
          )}

          {uploadLabel && (
            <Button variant="outline" onClick={() => setSelectedFile(null)} disabled={!selectedFile}>
              <Upload size={18} />
              {uploadLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
