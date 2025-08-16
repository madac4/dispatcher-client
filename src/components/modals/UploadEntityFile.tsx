import { uploadTrailerFile } from '@/lib/services/trailerService'
import { uploadTruckFile } from '@/lib/services/truckService'
import { Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import FileUploader from '../forms/FileUploader'
import { Button } from '../ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'

export default function UploadEntityFile({ type, entityId }: { type: 'truck' | 'trailer'; entityId: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    setIsUploading(true)

    if (type === 'truck') {
      await addTruckFile(selectedFile, entityId)
    } else {
      await addTrailerFile(selectedFile, entityId)
    }
  }

  const addTruckFile = async (file: File, id: string) => {
    try {
      await uploadTruckFile(file, id)
      toast.success('File uploaded successfully')
    } finally {
      setIsUploading(false)
      setSelectedFile(null)
    }
  }

  const addTrailerFile = async (file: File, id: string) => {
    try {
      await uploadTrailerFile(file, id)
      toast.success('File uploaded successfully')
    } finally {
      setIsUploading(false)
      setSelectedFile(null)
    }
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Upload File for {type}</DialogTitle>
        <DialogDescription>Upload a file for {type}</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4">
        <FileUploader
          label="Upload File"
          maxFileSize={10}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          acceptedTypes={['pdf', 'jpg', 'jpeg', 'png']}
          uploadText="Upload File"
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={isUploading}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" onClick={handleUpload} disabled={!selectedFile || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload File
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
