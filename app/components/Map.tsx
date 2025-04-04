"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Use an environment variable for the access token
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export default function Map({ order, driver }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!mapboxToken) {
      setError("Mapbox access token is not set. Please set the NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN environment variable.")
      return
    }

    mapboxgl.accessToken = mapboxToken

    if (map.current) return
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-74.5, 40],
        zoom: 9,
      })
    } catch (err) {
      setError("Failed to initialize the map. Please check your Mapbox access token.")
    }
  }, [])

  useEffect(() => {
    if (!map.current || !order) return
    new mapboxgl.Marker().setLngLat([-74.5, 40]).addTo(map.current)
  }, [order])

  useEffect(() => {
    if (!map.current || !driver) return
    new mapboxgl.Marker({ color: "#F7B731" }).setLngLat([-74.45, 40.05]).addTo(map.current)
  }, [driver])

  if (error) {
    return <div className="w-full h-96 flex items-center justify-center bg-red-100 text-red-700 p-4">{error}</div>
  }

  return <div ref={mapContainer} className="w-full h-96" />
}

