import { uploadCarrierFile } from '@/lib/services/settingsService'
import { Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import FileUploader from '../forms/FileUploader'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

export default function UploadCarrierFile({ children }: { children: React.ReactNode }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      const { message } = await uploadCarrierFile(selectedFile)
      toast.success(message)
      setSelectedFile(null)
      setIsOpen(false)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Carrier File</DialogTitle>
          <DialogDescription>Upload a carrier file to your account.</DialogDescription>
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
