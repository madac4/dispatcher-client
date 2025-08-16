import { TrailersDataTable } from '@/app/dashboard/settings/inventory/components/trailers-data-table'
import { TrucksDataTable } from '@/app/dashboard/settings/inventory/components/trucks-data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'

type EntitySelectModalProps = {
  children: React.ReactNode
  type: 'truck' | 'trailer'
  onSelect: (id: string) => void
}

export function EntitySelectModal({ children, type, onSelect }: EntitySelectModalProps) {
  const [selectedTrailerId, setSelectedTrailerId] = useState<string | null>(null)
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleSelect = (id: string) => {
    if (type === 'truck') {
      setSelectedTruckId(id)
    } else {
      setSelectedTrailerId(id)
    }
    onSelect(id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Choose {type}</DialogTitle>
          <DialogDescription>Select an existing {type} from your inventory.</DialogDescription>
        </DialogHeader>

        {type === 'truck' ? (
          <TrucksDataTable onSelect={handleSelect} selectedTruckId={selectedTruckId} />
        ) : (
          <TrailersDataTable onSelect={handleSelect} selectedTrailerId={selectedTrailerId} />
        )}
      </DialogContent>
    </Dialog>
  )
}
