'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface RouteDisplayProps {
	originAddress: string
	destinationAddress: string
	stops?: string[]
	height?: string
}

export default function RouteDisplay({
	originAddress,
	destinationAddress,
	stops = [],
	height = '480px',
}: RouteDisplayProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const [map, setMap] = useState<google.maps.Map>()
	const [directionsService, setDirectionsService] =
		useState<google.maps.DirectionsService>()
	const [directionsRenderer, setDirectionsRenderer] =
		useState<google.maps.DirectionsRenderer>()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

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
			script.onerror = () => setError('Failed to load Google Maps API')
			document.head.appendChild(script)
		}
		loadGoogleMapsAPI()
	}, [])

	const initializeMap = () => {
		if (!mapRef.current || !window.google) return

		const directionsService = new google.maps.DirectionsService()
		const directionsRenderer = new google.maps.DirectionsRenderer({
			draggable: false,
			suppressMarkers: false,
		})

		const map = new google.maps.Map(mapRef.current, {
			center: { lat: 39.8283, lng: -98.5795 }, // Center of US
			zoom: 4,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false,
			streetViewControl: false,
			fullscreenControl: false,
		})

		directionsRenderer.setMap(map)

		setMap(map)
		setDirectionsService(directionsService)
		setDirectionsRenderer(directionsRenderer)
	}

	const calculateRoute = useCallback(async () => {
		if (!directionsService || !directionsRenderer) return

		setIsLoading(true)
		setError(null)

		try {
			const waypoints = stops.map(stop => ({
				location: stop,
				stopover: true,
			}))

			const request: google.maps.DirectionsRequest = {
				origin: originAddress,
				destination: destinationAddress,
				waypoints: waypoints.length > 0 ? waypoints : undefined,
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.IMPERIAL,
				optimizeWaypoints: false,
			}

			const result = await new Promise<google.maps.DirectionsResult>(
				(resolve, reject) => {
					directionsService.route(request, (result, status) => {
						if (status === 'OK' && result) {
							resolve(result)
						} else {
							reject(
								new Error(
									`Route calculation failed: ${status}`,
								),
							)
						}
					})
				},
			)

			directionsRenderer.setDirections(result)

			const bounds = new google.maps.LatLngBounds()
			result.routes[0].legs.forEach(leg => {
				bounds.extend(leg.start_location)
				bounds.extend(leg.end_location)
			})
			map?.fitBounds(bounds)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Route calculation failed',
			)
		} finally {
			setIsLoading(false)
		}
	}, [
		directionsService,
		directionsRenderer,
		stops,
		originAddress,
		destinationAddress,
		map,
	])

	useEffect(() => {
		if (
			directionsService &&
			directionsRenderer &&
			originAddress &&
			destinationAddress
		) {
			calculateRoute()
		}
	}, [
		directionsService,
		directionsRenderer,
		originAddress,
		destinationAddress,
		calculateRoute,
		stops,
	])

	return (
		<>
			{error && (
				<div className='bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800'>
					{error}
				</div>
			)}

			{isLoading && (
				<div className='bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800'>
					Loading route...
				</div>
			)}

			<div
				className='bg-gray-100 rounded-lg overflow-hidden'
				style={{ height }}
			>
				<div ref={mapRef} className='w-full h-full' />
			</div>
		</>
	)
}
