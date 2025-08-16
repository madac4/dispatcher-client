import { DialogActions } from '@/constants/app.enum'
import { TrailerPayload } from '@/lib/models/trailer.model'
import { TruckPayload } from '@/lib/models/truck.model'
import { useDialogStore } from '@/lib/store'
import TrailerForm from '../forms/TrailerForm'
import TruckForm from '../forms/TruckForm'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

export const EditInventoryEntity = ({
  entity,
  type,
}: {
  entity: TruckPayload | TrailerPayload
  type: 'truck' | 'trailer'
}) => {
  const { setIsDialogOpen } = useDialogStore()

  const handleCloseModal = () => {
    setIsDialogOpen(false)
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Edit {type}</DialogTitle>
        <DialogDescription>Edit the {type} information</DialogDescription>
      </DialogHeader>

      {type === 'truck' && <TruckForm action={DialogActions.Edit} nhtsaData={entity} closeModal={handleCloseModal} />}
      {type === 'trailer' && (
        <TrailerForm action={DialogActions.Edit} nhtsaData={entity as TrailerPayload} closeModal={handleCloseModal} />
      )}
    </DialogContent>
  )
}
