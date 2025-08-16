'use client'

import { EntitySelector } from '@/components/forms/common/EntitySelector'
import { FormSection } from '@/components/forms/common/FormSection'
import { TrailerDTO } from '@/lib/models/trailer.model'
import { TruckDTO } from '@/lib/models/truck.model'
import { Truck as TruckIcon } from 'lucide-react'

interface VehicleSelectionSectionProps {
  truck: TruckDTO | null
  trailer: TrailerDTO | null
  onTruckSelect: (id: string) => void
  onTrailerSelect: (id: string) => void
}

export function VehicleSelectionSection({
  truck,
  trailer,
  onTruckSelect,
  onTrailerSelect,
}: VehicleSelectionSectionProps) {
  return (
    <FormSection title="Vehicle Selection" icon={TruckIcon}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EntitySelector type="truck" entity={truck} onSelect={onTruckSelect} />
        <EntitySelector type="trailer" entity={trailer} onSelect={onTrailerSelect} />
      </div>
    </FormSection>
  )
}
