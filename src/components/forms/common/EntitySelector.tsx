'use client';

import { EntitySelectModal } from '@/components/modals/EntitySelectModal';
import { Button } from '@/components/ui/button';
import { TrailerDTO } from '@/lib/models/trailer.model';
import { TruckDTO } from '@/lib/models/truck.model';
import { Package, Truck as TruckIcon } from 'lucide-react';

interface EntitySelectorProps {
  type: 'truck' | 'trailer';
  entity: TruckDTO | TrailerDTO | null;
  onSelect: (id: string) => void;
  className?: string;
}

export function EntitySelector({ type, entity, onSelect, className }: EntitySelectorProps) {
  const isTruck = type === 'truck';
  const Icon = isTruck ? TruckIcon : Package;
  const bgColor = isTruck ? 'bg-blue-50' : 'bg-purple-50';
  const borderColor = isTruck ? 'border-blue-500' : 'border-purple-500';
  const iconBgColor = isTruck ? 'bg-blue-600' : 'bg-purple-600';

  if (!entity) {
    return (
      <EntitySelectModal type={type} onSelect={onSelect}>
        <div
          className={`border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 hover:bg-primary-50/20 transition-all duration-200 ${className}`}
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No {type} Selected</h3>
          <p className="text-gray-500 mb-3">Choose a {type} from your fleet inventory</p>
          <Button type="button">Select {type}</Button>
        </div>
      </EntitySelectModal>
    );
  }

  return (
    <div className={`relative ${bgColor} rounded-xl p-4 border ${borderColor} ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {isTruck
                ? `Unit #${(entity as TruckDTO).unitNumber}`
                : `Unit #${(entity as TrailerDTO).unitNumber || 'Trailer'}`}
            </h3>
            <p className={`${isTruck ? 'text-blue-600' : 'text-purple-600'} font-semibold text-sm`}>
              {entity.year} {entity.make}
            </p>
          </div>
        </div>

        <EntitySelectModal type={type} onSelect={onSelect}>
          <Button variant="outline" size="sm" type="button">
            Change {type}
          </Button>
        </EntitySelectModal>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/70 rounded-lg p-2 space-y-1">
          <h6 className="text-xs font-medium text-gray-600 uppercase">License Plate</h6>
          <p className="font-semibold text-gray-900">{entity.licencePlate || '—'}</p>
        </div>
        <div className="bg-white/70 rounded-lg p-2 space-y-1">
          <h6 className="text-xs font-medium text-gray-600 uppercase">State</h6>
          <p className="font-semibold text-gray-900">{entity.state || '—'}</p>
        </div>
        <div className="bg-white/70 rounded-lg p-2 space-y-1">
          <h6 className="text-xs font-medium text-gray-600 uppercase">Axles</h6>
          <p className="font-semibold text-gray-900">{entity.nrOfAxles}</p>
        </div>
        <div className="bg-white/70 rounded-lg p-2 space-y-1">
          <h6 className="text-xs font-medium text-gray-600 uppercase">VIN Number</h6>
          <p className="font-semibold text-gray-900">{entity.vin}</p>
        </div>
        {!isTruck && (entity as TrailerDTO).length && (
          <div className="bg-white/70 rounded-lg p-2 space-y-1">
            <h6 className="text-xs font-medium text-gray-600 uppercase">Length</h6>
            <p className="font-semibold text-gray-900">{(entity as TrailerDTO).length}</p>
          </div>
        )}
        {!isTruck && (entity as TrailerDTO).type && (
          <div className="bg-white/70 rounded-lg p-2 space-y-1">
            <h6 className="text-xs font-medium text-gray-600 uppercase">Type</h6>
            <p className="font-semibold text-gray-900">{(entity as TrailerDTO).type}</p>
          </div>
        )}
      </div>
    </div>
  );
}
