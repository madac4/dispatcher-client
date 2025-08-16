'use client'

import { useEffect, useRef, useState } from 'react'

interface RouteDisplayProps {
  originAddress: string
  destinationAddress: string
  stops?: string[]
  height?: string
  showInfo?: boolean
}

export default function RouteDisplay({
  originAddress,
  destinationAddress,
  stops = [],
  height = '480px',
  showInfo = true,
}: RouteDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map>()
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>()
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>()
  const [routeInfo, setRouteInfo] = useState<{
    totalDistance: number
    totalDuration: number
    legs: number
    waypoints: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

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
      draggable: false, // Readonly - no dragging
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

  // Calculate route when addresses change
  useEffect(() => {
    if (directionsService && directionsRenderer && originAddress && destinationAddress) {
      calculateRoute()
    }
  }, [directionsService, directionsRenderer, originAddress, destinationAddress, stops])

  const calculateRoute = async () => {
    if (!directionsService || !directionsRenderer) return

    setIsLoading(true)
    setError(null)

    try {
      // Build waypoints array from stops
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

      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route(request, (result, status) => {
          if (status === 'OK' && result) {
            resolve(result)
          } else {
            reject(new Error(`Route calculation failed: ${status}`))
          }
        })
      })

      directionsRenderer.setDirections(result)

      // Fit map to route bounds
      const bounds = new google.maps.LatLngBounds()
      result.routes[0].legs.forEach(leg => {
        bounds.extend(leg.start_location)
        bounds.extend(leg.end_location)
      })
      map?.fitBounds(bounds)

      // Calculate route information
      const route = result.routes[0]
      const legs = route.legs || []

      let totalDistance = 0
      let totalDuration = 0
      legs.forEach(leg => {
        if (leg.distance) totalDistance += leg.distance.value
        if (leg.duration) totalDuration += leg.duration.value
      })

      setRouteInfo({
        totalDistance,
        totalDuration,
        legs: legs.length,
        waypoints: stops.length,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Route calculation failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Build the complete route stops array for display
  const allStops = [originAddress, ...stops, destinationAddress]

  return (
    <>
      {error && <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">{error}</div>}

      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">Loading route...</div>
      )}

      <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height }}>
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {showInfo && routeInfo && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h3 className="text-lg font-semibold mb-3">Route Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((routeInfo.totalDistance / 1000) * 10) / 10}
              </div>
              <div className="text-sm text-gray-600">Total Distance (km)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatDuration(routeInfo.totalDuration)}</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{routeInfo.legs}</div>
              <div className="text-sm text-gray-600">Route Segments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{routeInfo.waypoints}</div>
              <div className="text-sm text-gray-600">Waypoints</div>
            </div>
          </div>

          {allStops.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Route Stops:</h4>
              <div className="space-y-2">
                {allStops.map((stop, index) => {
                  let label = ''
                  let color = ''

                  if (index === 0) {
                    label = 'Origin'
                    color = 'bg-green-500'
                  } else if (index === allStops.length - 1) {
                    label = 'Destination'
                    color = 'bg-red-500'
                  } else {
                    label = `Stop ${index}`
                    color = 'bg-orange-500'
                  }

                  return (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div
                        className={`w-6 h-6 ${color} text-white rounded-full flex items-center justify-center text-xs font-bold mr-3`}
                      >
                        {index === 0 ? 'A' : index === allStops.length - 1 ? 'B' : index}
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">{label}</div>
                        <div className="text-gray-500">{stop}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
