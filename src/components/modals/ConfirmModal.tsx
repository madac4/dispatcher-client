import { useDialogStore } from '@/lib/store'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

type ConfirmModalProps = {
  onConfirm: () => void
  title?: string
  description?: string
  children?: React.ReactNode
}

export function ConfirmModal({ onConfirm, title, description, children }: ConfirmModalProps) {
  const { setIsDialogOpen } = useDialogStore()

  const handleConfirm = () => {
    onConfirm()
    setIsDialogOpen(false)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
  }

  return !children ? (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title || 'Are you absolutely sure?'}</DialogTitle>
        <DialogDescription>
          {description ||
            'This action cannot be undone. This will permanently delete this entity and remove it from our servers.'}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="destructive">
          Continue
        </Button>
      </DialogFooter>
    </DialogContent>
  ) : (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || 'Are you absolutely sure?'}</DialogTitle>
          <DialogDescription>
            {description ||
              'This action cannot be undone. This will permanently delete this entity and remove it from our servers.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="destructive">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
