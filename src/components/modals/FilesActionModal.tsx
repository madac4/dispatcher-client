'use client'

import { deleteTrailerFile, downloadTrailerFile, getTrailerFiles } from '@/lib/services/trailerService'
import { deleteTruckFile, downloadTruckFile, getTruckFiles } from '@/lib/services/truckService'
import { useTrailersStore } from '@/lib/stores/trailerStore'
import { useTrucksStore } from '@/lib/stores/truckStore'
import { bytesToSize } from '@/lib/utils'
import { Download, FileText, Trash } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Skeleton } from '../ui/skeleton'
import { ConfirmModal } from './ConfirmModal'

export default function FilesActionModal({ type, id }: { type: 'truck' | 'trailer'; id?: string }) {
  const { setTruckFiles, truckFiles } = useTrucksStore()
  const { setTrailerFiles, trailerFiles } = useTrailersStore()
  const [isFetching, setIsFetching] = useState(true)

  const fetchTruckFiles = useCallback(async () => {
    if (!id) return
    try {
      const { data } = await getTruckFiles(id)
      setTruckFiles(data || [])
    } finally {
      setIsFetching(false)
    }
  }, [setTruckFiles, id])

  const fetchTrailerFiles = useCallback(async () => {
    if (!id) return
    try {
      const { data } = await getTrailerFiles(id)
      setTrailerFiles(data || [])
    } finally {
      setIsFetching(false)
    }
  }, [setTrailerFiles, id])

  const fetchFiles = useCallback(async () => {
    setIsFetching(true)

    if (type === 'truck') {
      await fetchTruckFiles()
    } else if (type === 'trailer') {
      await fetchTrailerFiles()
    }
  }, [type, fetchTruckFiles, fetchTrailerFiles])

  const removeFile = async (filename: string) => {
    if (!id) return

    if (type === 'truck') {
      const { message } = await deleteTruckFile(id, filename)
      toast.success(message)
      fetchFiles()
    } else if (type === 'trailer') {
      const { message } = await deleteTrailerFile(id, filename)
      toast.success(message)
      fetchFiles()
    }
  }

  const downloadFile = async (filename: string) => {
    if (!id) return

    if (type === 'truck') {
      const { message } = await downloadTruckFile(id, filename)
      toast.success(message)
    } else if (type === 'trailer') {
      const { message } = await downloadTrailerFile(id, filename)
      toast.success(message)
    }
  }

  return (
    <DialogContent onOpenAutoFocus={fetchFiles} className="sm:max-w-2xl w-full">
      <DialogHeader>
        <DialogTitle>{type.charAt(0).toUpperCase() + type.slice(1)} Files</DialogTitle>
        <DialogDescription>This is a list of files that are associated with your {type}.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {isFetching && (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        )}

        {!isFetching &&
          type === 'truck' &&
          (truckFiles?.length || 0) > 0 &&
          truckFiles?.map(file => (
            <div key={file.filename} className="flex items-center gap-2 p-4 border rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold truncate w-auto">{file.originalname}</h3>
              <span>({bytesToSize(file.size)})</span>

              <ConfirmModal onConfirm={() => removeFile(file.filename)} title="Delete File">
                <Button variant="destructive" type="button" size="icon-sm" className="ml-auto">
                  <Trash className="h-4 w-4" />
                </Button>
              </ConfirmModal>
              <Button variant="outline" type="button" size="icon-sm" onClick={() => downloadFile(file.filename)}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}

        {!isFetching &&
          type === 'trailer' &&
          (trailerFiles?.length || 0) > 0 &&
          trailerFiles?.map(file => (
            <div key={file.filename} className="flex items-center gap-2 p-4 border rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold truncate w-auto">{file.originalname}</h3>
              <span>({bytesToSize(file.size)})</span>

              <ConfirmModal onConfirm={() => removeFile(file.filename)} title="Delete File">
                <Button variant="destructive" type="button" size="icon-sm" className="ml-auto">
                  <Trash className="h-4 w-4" />
                </Button>
              </ConfirmModal>
              <Button variant="outline" type="button" size="icon-sm" onClick={() => downloadFile(file.filename)}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}

        {!isFetching && !truckFiles?.length && !trailerFiles?.length && (
          <div className="flex items-center justify-center h-full p-4 border rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">No files found</p>
          </div>
        )}
      </div>
    </DialogContent>
  )
}
