'use client'

import { orderFormSchema } from '@/lib/schemas/order.schema'
import { MapPin } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay)
		return () => clearTimeout(handler)
	}, [value, delay])

	return debouncedValue
}

type FormData = z.infer<typeof orderFormSchema>

export default function RouteBuilder({
	form,
}: {
	form: UseFormReturn<FormData>
}) {
	const mapRef = useRef<HTMLDivElement>(null)
	const [map, setMap] = useState<google.maps.Map>()
	const [directionsService, setDirectionsService] =
		useState<google.maps.DirectionsService>()
	const [directionsRenderer, setDirectionsRenderer] =
		useState<google.maps.DirectionsRenderer>()
	const [autocompleteOrigin, setAutocompleteOrigin] =
		useState<google.maps.places.Autocomplete>()
	const [autocompleteDestination, setAutocompleteDestination] =
		useState<google.maps.places.Autocomplete>()
	const [routeError, setRouteError] = useState<string | null>(null)
	const [waypoints, setWaypoints] = useState<string[]>([])
	const [isCalculating, setIsCalculating] = useState(false)

	const debouncedOrigin = useDebounce(form.watch('originAddress') || '', 500)
	const debouncedDestination = useDebounce(
		form.watch('destinationAddress') || '',
		500,
	)

	const calculateRoute = useCallback(() => {
		const origin = form.getValues('originAddress')
		const destination = form.getValues('destinationAddress')

		if (
			!origin ||
			!destination ||
			!directionsService ||
			!directionsRenderer
		)
			return

		setIsCalculating(true)
		setRouteError(null)

		const request: google.maps.DirectionsRequest = {
			origin,
			destination,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.IMPERIAL,
			optimizeWaypoints: false,
		}

		directionsService.route(request, (result, status) => {
			setIsCalculating(false)
			if (status === 'OK' && result) {
				directionsRenderer.setDirections(result)
				const bounds = new google.maps.LatLngBounds()
				result.routes[0].legs.forEach(leg => {
					bounds.extend(leg.start_location)
					bounds.extend(leg.end_location)
				})
				map?.fitBounds(bounds)
			} else {
				setRouteError('Route calculation failed. Please try again.')
			}
		})
	}, [form, directionsService, directionsRenderer, map])

	useEffect(() => {
		if (
			debouncedOrigin &&
			debouncedDestination &&
			debouncedOrigin.trim().length >= 5 &&
			debouncedDestination.trim().length >= 5
		) {
			calculateRoute()
		}
	}, [debouncedOrigin, debouncedDestination, calculateRoute])

	const initializeMap = useCallback(() => {
		if (!mapRef.current || !window.google) return

		const directionsService = new google.maps.DirectionsService()
		const directionsRenderer = new google.maps.DirectionsRenderer({
			draggable: true,
			suppressMarkers: false,
		})

		const map = new google.maps.Map(mapRef.current, {
			center: { lat: 39.8283, lng: -98.5795 },
			zoom: 4,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false,
			streetViewControl: false,
			fullscreenControl: false,
		})

		directionsRenderer.setMap(map)

		const geocodeLatLng = (
			latlng: google.maps.LatLng,
		): Promise<string | null> => {
			const geocoder = new google.maps.Geocoder()
			return new Promise(resolve => {
				geocoder.geocode({ location: latlng }, (results, status) => {
					if (status === 'OK' && results?.[0])
						resolve(results[0].formatted_address)
					else resolve(null)
				})
			})
		}

		directionsRenderer.addListener('directions_changed', async () => {
			const result = directionsRenderer.getDirections()
			if (!result) {
				setWaypoints([])
				return
			}

			const route = result.routes[0]
			const legs = route.legs || []
			const stops: string[] = []

			if (legs.length > 0) {
				if (legs[0].start_address) stops.push(legs[0].start_address)

				for (const leg of legs) {
					if (leg.via_waypoints && leg.via_waypoints.length > 0) {
						for (const vw of leg.via_waypoints) {
							const addr = await geocodeLatLng(vw)
							stops.push(
								addr ??
									`${vw.lat().toFixed(6)}, ${vw
										.lng()
										.toFixed(6)}`,
							)
						}
					}

					if (leg.end_address) stops.push(leg.end_address)
				}
			}

			const deduped = stops.filter(
				(s, i, arr) => i === 0 || s !== arr[i - 1],
			)

			const waypointsOnly = deduped.slice(1, -1)

			setWaypoints(deduped)
			try {
				form.setValue('stops', waypointsOnly)
				form.trigger('stops')
			} catch (error) {
				console.error('Error updating form stops field:', error)
			}
		})

		setMap(map)
		setDirectionsService(directionsService)
		setDirectionsRenderer(directionsRenderer)
	}, [form])

	useEffect(() => {
		const loadGoogleMapsAPI = () => {
			if (window.google && window.google.maps) {
				initializeMap()
				return
			}
			const script = document.createElement('script')
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
			script.async = true
			script.defer = true
			script.onload = () => initializeMap()
			document.head.appendChild(script)
		}
		loadGoogleMapsAPI()
	}, [initializeMap])

	const initializeAutocomplete = (
		inputRef: HTMLInputElement,
		isOrigin: boolean,
	) => {
		if (!window.google?.maps?.places) return

		const autocomplete = new google.maps.places.Autocomplete(inputRef, {
			types: ['geocode'],
			componentRestrictions: { country: 'us' },
			fields: ['formatted_address', 'geometry', 'place_id'],
		})

		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace()
			if (place.geometry && place.formatted_address) {
				if (isOrigin)
					form.setValue('originAddress', place.formatted_address)
				else
					form.setValue('destinationAddress', place.formatted_address)

				const origin = form.getValues('originAddress')
				const destination = form.getValues('destinationAddress')
				if (origin && destination) calculateRoute()
			}
		})

		if (isOrigin) setAutocompleteOrigin(autocomplete)
		else setAutocompleteDestination(autocomplete)
	}

	const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		form.setValue('originAddress', e.target.value)
	}

	const handleDestinationChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		form.setValue('destinationAddress', e.target.value)
	}

	const getRouteData = useCallback(() => {
		if (waypoints.length === 0) return null

		const waypointsOnly = waypoints.slice(1, -1)

		return {
			origin: waypoints[0],
			destination: waypoints[waypoints.length - 1],
			waypoints: waypointsOnly,
			stops: waypointsOnly,
		}
	}, [waypoints])

	useEffect(() => {
		const routeData = getRouteData()
		if (routeData) {
			Object.entries(routeData).forEach(([key, value]) => {
				if (key in form.getValues()) {
					form.setValue(
						key as keyof FormData,
						value as FormData[keyof FormData],
					)
				}
			})
		}
	}, [getRouteData, form])

	useEffect(() => {
		if (waypoints.length > 0) {
			console.log(
				'Waypoints changed, updating form stops field:',
				waypoints,
			)
			const waypointsOnly = waypoints.slice(1, -1)
			form.setValue('stops', waypointsOnly)
			console.log(
				'Form stops field after waypoints change (waypoints only):',
				waypointsOnly,
			)
		}
	}, [waypoints, form])

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center text-lg'>
					<MapPin className='w-5 h-5 mr-2 text-orange-500' />
					Route Information
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<FormField
						control={form.control}
						name='originAddress'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Origin Address *</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter a location'
										{...field}
										onChange={handleOriginChange}
										ref={el => {
											if (
												el &&
												!autocompleteOrigin &&
												window.google?.maps?.places
											) {
												initializeAutocomplete(el, true)
											}
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='destinationAddress'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Destination Address *</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter a location'
										{...field}
										onChange={handleDestinationChange}
										ref={el => {
											if (
												el &&
												!autocompleteDestination &&
												window.google?.maps?.places
											) {
												initializeAutocomplete(
													el,
													false,
												)
											}
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{routeError && (
					<div className='bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800'>
						{routeError}
					</div>
				)}

				{isCalculating && (
					<div className='bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800'>
						Calculating route...
					</div>
				)}

				<div className='h-[480px] bg-gray-100 rounded-lg overflow-hidden'>
					<div
						ref={mapRef}
						className='w-full h-full'
						style={{ minHeight: '480px' }}
					/>
				</div>
			</CardContent>
		</Card>
	)
}
