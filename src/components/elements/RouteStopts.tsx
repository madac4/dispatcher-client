'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
	origin: string
	destination: string
	stops: string[]
}

export default function RoutePlanner() {
	const form = useForm<FormValues>({
		defaultValues: {
			origin: '',
			destination: '',
			stops: [],
		},
	})

	const [directionsRenderer, setDirectionsRenderer] =
		useState<google.maps.DirectionsRenderer>()
	const [directionsService, setDirectionsService] =
		useState<google.maps.DirectionsService>()
	const [stops, setStops] = useState<string[]>([])

	const mapRef = useRef<HTMLDivElement>(null)

	// initialize map
	useEffect(() => {
		if (!mapRef.current) return

		const m = new google.maps.Map(mapRef.current, {
			center: { lat: 39.5, lng: -98.35 },
			zoom: 4,
		})
		const ds = new google.maps.DirectionsService()
		const dr = new google.maps.DirectionsRenderer({
			draggable: true,
			map: m,
		})

		setDirectionsService(ds)
		setDirectionsRenderer(dr)

		// listen for route changes
		google.maps.event.addListener(dr, 'directions_changed', async () => {
			const result = dr.getDirections()
			if (!result) return

			const route = result.routes[0]
			const allStops: string[] = []

			// origin
			if (route.legs.length > 0) {
				allStops.push(route.legs[0].start_address)
			}

			// destination
			if (route.legs.length > 0) {
				allStops.push(route.legs[route.legs.length - 1].end_address)
			}

			// 🚩 dragged stops
			const viaWaypoints = route.overview_path ?? []
			if (viaWaypoints.length > 0) {
				const geocoder = new google.maps.Geocoder()

				for (const latlng of viaWaypoints) {
					const geocoded = await new Promise<string | null>(
						resolve => {
							geocoder.geocode(
								{ location: latlng },
								(results, status) => {
									if (
										status === 'OK' &&
										results &&
										results[0]
									) {
										resolve(results[0].formatted_address)
									} else {
										resolve(null)
									}
								},
							)
						},
					)
					if (geocoded)
						allStops.splice(allStops.length - 1, 0, geocoded)
				}
			}

			const uniqueStops = [...new Set(allStops)]

			form.setValue('stops', uniqueStops)
			setStops(uniqueStops)
		})
	}, [form])

	const calculateRoute = () => {
		if (!directionsService || !directionsRenderer) return
		const origin = form.getValues('origin')
		const destination = form.getValues('destination')

		directionsService.route(
			{
				origin,
				destination,
				travelMode: google.maps.TravelMode.DRIVING,
			},
			(result, status) => {
				if (status === 'OK' && result) {
					directionsRenderer.setDirections(result)
				}
			},
		)
	}

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex gap-2'>
				<input
					placeholder='Origin Address'
					{...form.register('origin')}
					className='border p-2 w-1/2'
				/>
				<input
					placeholder='Destination Address'
					{...form.register('destination')}
					className='border p-2 w-1/2'
				/>
				<button
					onClick={calculateRoute}
					className='bg-blue-500 text-white px-4 rounded'
				>
					Calculate
				</button>
			</div>

			<div ref={mapRef} className='w-full h-[500px]' />

			<div className='p-4 border rounded'>
				<h2 className='font-bold mb-2'>Route Stops</h2>
				<ul className='list-disc pl-5'>
					{stops.map((stop, idx) => (
						<li key={idx}>
							<span className='font-semibold'>
								{String.fromCharCode(65 + idx)}:
							</span>{' '}
							{stop}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
