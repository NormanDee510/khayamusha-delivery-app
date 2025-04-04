"use client"

import { useState, useEffect } from "react"

interface GeolocationState {
  location: { lat: number; lng: number } | null
  error: string | null
  loading: boolean
}

// Default location (Johannesburg, South Africa)
const DEFAULT_LOCATION = { lat: -26.2041, lng: 28.0473 }

export function useGeolocation(options?: {
  timeout?: number
  enableHighAccuracy?: boolean
  maximumAge?: number
  defaultLocation?: { lat: number; lng: number }
}): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    // Set a timeout to provide default location if geolocation takes too long
    timeoutId = setTimeout(() => {
      if (state.loading) {
        setState({
          location: options?.defaultLocation || DEFAULT_LOCATION,
          error: "Geolocation timed out, using default location",
          loading: false,
        })
      }
    }, options?.timeout || 5000) // 5 second timeout by default

    if (!navigator.geolocation) {
      setState({
        location: options?.defaultLocation || DEFAULT_LOCATION,
        error: "Geolocation is not supported by your browser, using default location",
        loading: false,
      })
      if (timeoutId) clearTimeout(timeoutId)
      return
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        error: null,
        loading: false,
      })
      if (timeoutId) clearTimeout(timeoutId)
    }

    const errorHandler = (error: GeolocationPositionError) => {
      console.warn("Geolocation error:", error.message)

      // More user-friendly error message
      let errorMessage = "Unable to access your location. Using default location instead."

      if (error.code === 1) {
        errorMessage = "Location access was denied. Using default location instead."
      } else if (error.code === 2) {
        errorMessage = "Your location is currently unavailable. Using default location instead."
      } else if (error.code === 3) {
        errorMessage = "Location request timed out. Using default location instead."
      }

      setState({
        location: options?.defaultLocation || DEFAULT_LOCATION,
        error: errorMessage,
        loading: false,
      })
      if (timeoutId) clearTimeout(timeoutId)
    }

    const geolocationOptions = {
      enableHighAccuracy: options?.enableHighAccuracy || false,
      timeout: options?.timeout || 10000,
      maximumAge: options?.maximumAge || 0,
    }

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, geolocationOptions)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [options])

  return state
}

