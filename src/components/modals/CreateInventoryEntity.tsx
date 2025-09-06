import { DialogActions } from '@/constants/app.enum'
import { TrailerPayload } from '@/lib/models/trailer.model'
import { TruckPayload } from '@/lib/models/truck.model'
import { getTrailerByVin } from '@/lib/services/trailerService'
import { getTruckByVin } from '@/lib/services/truckService'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import TrailerForm from '../forms/TrailerForm'
import TruckForm from '../forms/TruckForm'
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
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function CreateInventoryEntity({
	children,
	type,
	fetchData,
}: {
	children: React.ReactNode
	type: 'truck' | 'trailer'
	fetchData: () => void
}) {
	const [nhtsaData, setNhtsaData] = useState<
		TruckPayload | TrailerPayload | null
	>(null)
	const [vinError, setVinError] = useState<string | null>(null)
	const [isValidating, setIsValidating] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [vin, setVin] = useState<string>('')
	const [open, setOpen] = useState(false)

	const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/

	const validateVin = (vinValue: string): boolean => {
		if (!vinRegex.test(vinValue)) {
			setVinError('VIN must be 17 characters (no I, O, or Q allowed)')
			return false
		}

		setVinError(null)
		return true
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsValidating(true)

		const isValid = validateVin(vin)
		if (!isValid) {
			setIsValidating(false)
			return
		}

		setIsLoading(true)

		if (type === 'truck') {
			handleTruckSubmit()
		} else {
			handleTrailerSubmit()
		}

		setIsValidating(false)
	}

	const closeModal = (isAdded: boolean) => {
		setOpen(false)
		setVin('')
		setNhtsaData(null)
		setVinError(null)
		setIsValidating(false)
		setIsLoading(false)
		if (isAdded) {
			fetchData()
		}
	}

	const handleTruckSubmit = async () => {
		const truck = await getTruckByVin(vin)
		const truckData: TruckPayload = {
			year: truck.Results[0].ModelYear,
			make: truck.Results[0].Make,
			vin: truck.Results[0].VIN,
			nrOfAxles: Number(truck.Results[0].Axles),
			licencePlate: '',
			state: '',
			unitNumber: '',
		}
		setNhtsaData(truckData)
		setIsLoading(false)
	}

	const handleTrailerSubmit = async () => {
		const trailer = await getTrailerByVin(vin)
		const trailerData: TrailerPayload = {
			year: trailer.Results[0].ModelYear,
			make: trailer.Results[0].Make,
			vin: trailer.Results[0].VIN,
			nrOfAxles: Number(trailer.Results[0].Axles),
			length: trailer.Results[0].TrailerLength,
			type: trailer.Results[0].TrailerType,
			licencePlate: '',
			state: '',
			unitNumber: '',
		}
		setNhtsaData(trailerData)
		setIsLoading(false)
	}

	const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVin = e.target.value.toUpperCase()
		setVin(newVin)

		if (vinError) setVinError(null)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild onClick={() => setOpen(true)}>
				{children}
			</DialogTrigger>
			<DialogContent className='sm:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Add {type}</DialogTitle>
					<DialogDescription>
						Add a new {type} to your inventory.
					</DialogDescription>
				</DialogHeader>

				{type === 'truck' && nhtsaData && (
					<TruckForm
						action={DialogActions.Create}
						nhtsaData={nhtsaData as TruckPayload}
						closeModal={() => closeModal(true)}
					/>
				)}

				{type === 'trailer' && nhtsaData && (
					<TrailerForm
						action={DialogActions.Create}
						nhtsaData={nhtsaData as TrailerPayload}
						closeModal={() => closeModal(true)}
					/>
				)}

				{!nhtsaData && (
					<form className='space-y-4' onSubmit={handleSubmit}>
						<div className='space-y-2'>
							<Label htmlFor='vin'>
								VIN <span className='text-destructive'>*</span>
							</Label>
							<div className='relative'>
								<Input
									id='vin'
									placeholder='Enter VIN (17 characters)'
									value={vin}
									onChange={handleVinChange}
									className={
										vinError
											? 'border-destructive pr-10'
											: 'pr-10'
									}
									maxLength={17}
								/>
								{vin.length > 0 &&
									!vinError &&
									vin.length === 17 && (
										<CheckCircle className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500' />
									)}
								{vinError && (
									<XCircle className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive' />
								)}
							</div>
							{vinError && (
								<p className='text-destructive text-sm'>
									{vinError}
								</p>
							)}
							<p className='text-xs text-muted-foreground'>
								Vehicle Identification Number (VIN) is a
								17-character code used to uniquely identify
								motor vehicles.
							</p>
						</div>

						<DialogFooter className='justify-end'>
							<DialogClose asChild>
								<Button
									type='button'
									variant='secondary'
									disabled={isLoading}
								>
									Cancel
								</Button>
							</DialogClose>
							<Button
								type='submit'
								disabled={
									!vin ||
									vin.length !== 17 ||
									!!vinError ||
									isValidating ||
									isLoading
								}
							>
								{isLoading ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Searching...
									</>
								) : (
									`Find ${type}`
								)}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	)
}
