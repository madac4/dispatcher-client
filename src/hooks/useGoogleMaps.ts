'use client'

import { useCallback, useEffect, useState } from 'react'

interface UseGoogleMapsReturn {
	isLoaded: boolean
	loadError: string | null
	google: typeof window.google | null
}

// Global state to track if Google Maps is already loaded or loading
let isGoogleMapsLoading = false
let googleMapsLoadPromise: Promise<void> | null = null

export function useGoogleMaps(): UseGoogleMapsReturn {
	const [isLoaded, setIsLoaded] = useState(false)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [google, setGoogle] = useState<typeof window.google | null>(null)

	const loadGoogleMaps = useCallback(() => {
		if (window.google && window.google.maps) {
			setIsLoaded(true)
			setGoogle(window.google)
			return Promise.resolve()
		}

		if (isGoogleMapsLoading && googleMapsLoadPromise) {
			return googleMapsLoadPromise
		}

		// Check if script already exists in DOM
		const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
		if (existingScript) {
			// Script exists but might not be loaded yet, wait for it
			isGoogleMapsLoading = true
			googleMapsLoadPromise = new Promise(resolve => {
				const checkLoaded = () => {
					if (window.google && window.google.maps) {
						setIsLoaded(true)
						setGoogle(window.google)
						isGoogleMapsLoading = false
						resolve()
					} else {
						setTimeout(checkLoaded, 100)
					}
				}
				checkLoaded()
			})
			return googleMapsLoadPromise
		}

		// Start loading Google Maps
		isGoogleMapsLoading = true
		googleMapsLoadPromise = new Promise((resolve, reject) => {
			const script = document.createElement('script')
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
			script.async = true
			script.defer = true

			script.onload = () => {
				if (window.google && window.google.maps) {
					setIsLoaded(true)
					setGoogle(window.google)
					isGoogleMapsLoading = false
					resolve()
				} else {
					const error = 'Google Maps API loaded but google.maps is not available'
					setLoadError(error)
					isGoogleMapsLoading = false
					reject(new Error(error))
				}
			}

			script.onerror = () => {
				const error = 'Failed to load Google Maps API'
				setLoadError(error)
				isGoogleMapsLoading = false
				reject(new Error(error))
			}

			document.head.appendChild(script)
		})

		return googleMapsLoadPromise
	}, [])

	useEffect(() => {
		loadGoogleMaps().catch(error => {
			console.error('Error loading Google Maps:', error)
		})
	}, [loadGoogleMaps])

	return {
		isLoaded,
		loadError,
		google,
	}
}
