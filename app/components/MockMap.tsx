"use client"

import { useEffect, useState } from "react"
import { useGeolocation } from "../hooks/use-geolocation"
import { useStore } from "../lib/store"
import { MapPin, Navigation, X } from "lucide-react"

interface MockMapProps {
  showDrivers?: boolean
  showRestaurants?: boolean
  highlightId?: number
  type?: "restaurant" | "driver"
}

export default function MockMap({ showDrivers = false, showRestaurants = false, highlightId, type }: MockMapProps) {
  const { location, error } = useGeolocation({
    timeout: 5000, // 5 second timeout
    defaultLocation: { lat: -26.2041, lng: 28.0473 }, // Johannesburg
  })

  const [showError, setShowError] = useState(!!error)

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      setShowError(true)
      const timer = setTimeout(() => {
        setShowError(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error])

  const { setUserLocation, restaurants, drivers, currentOrder, selectedRestaurant, selectedDriver } = useStore()

  // Random positions for restaurants and drivers
  const [positions, setPositions] = useState({
    restaurants: {} as Record<number, { x: number; y: number }>,
    drivers: {} as Record<number, { x: number; y: number }>,
  })

  // Set user location when geolocation is available
  useEffect(() => {
    if (location) {
      setUserLocation(location)
    }
  }, [location, setUserLocation])

  // Generate random positions for restaurants and drivers immediately
  useEffect(() => {
    const restaurantPositions = {} as Record<number, { x: number; y: number }>
    const driverPositions = {} as Record<number, { x: number; y: number }>

    restaurants.forEach((restaurant) => {
      restaurantPositions[restaurant.id] = {
        x: Math.random() * 60 + 20,
        y: Math.random() * 60 + 20,
      }
    })

    drivers.forEach((driver) => {
      driverPositions[driver.id] = {
        x: Math.random() * 60 + 20,
        y: Math.random() * 60 + 20,
      }
    })

    setPositions({
      restaurants: restaurantPositions,
      drivers: driverPositions,
    })
  }, [restaurants, drivers])

  // Simulate driver movement if there's a current order
  useEffect(() => {
    if (!currentOrder || !currentOrder.driverId || currentOrder.status !== "delivering") return

    const driverId = currentOrder.driverId
    const interval = setInterval(() => {
      setPositions((prev) => {
        const driverPos = prev.drivers[driverId]
        if (!driverPos) return prev

        // Move driver closer to user (center)
        const newX = driverPos.x + (50 - driverPos.x) * 0.1
        const newY = driverPos.y + (50 - driverPos.y) * 0.1

        return {
          ...prev,
          drivers: {
            ...prev.drivers,
            [driverId]: { x: newX, y: newY },
          },
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentOrder])

  return (
    <div className="w-full h-96 bg-gray-200 relative overflow-hidden rounded-lg border border-gray-300">
      {/* Map grid lines */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="border border-gray-300 opacity-30" />
        ))}
      </div>

      {/* Map label */}
      <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-sm font-medium shadow-sm">
        KhayaMusha Delivery Map
      </div>

      {/* Error message if any */}
      {error && showError && (
        <div className="absolute top-2 right-2 bg-white px-3 py-2 rounded text-sm shadow-md max-w-[250px] flex items-start gap-2 animate-in fade-in slide-in-from-top-5 duration-300">
          <span className="text-gray-700">{error}</span>
          <button onClick={() => setShowError(false)} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Location indicator */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm">
        Using {location?.lat === -26.2041 ? "default" : "your"} location
      </div>

      {/* User location */}
      <div
        className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center transform -translate-x-3 -translate-y-3 shadow-lg z-10"
        style={{ left: "50%", top: "50%" }}
      >
        <Navigation className="h-4 w-4 text-white" />
      </div>

      {/* Restaurants */}
      {showRestaurants &&
        restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className={`absolute w-6 h-6 rounded-full flex items-center justify-center transform -translate-x-3 -translate-y-3 shadow-md ${
              highlightId === restaurant.id && type === "restaurant" ? "bg-green-500 scale-125 z-20" : "bg-red-500"
            }`}
            style={{
              left: `${positions.restaurants[restaurant.id]?.x || 0}%`,
              top: `${positions.restaurants[restaurant.id]?.y || 0}%`,
              transition: "all 0.3s ease-in-out",
            }}
            title={restaurant.name}
          >
            <MapPin className="h-4 w-4 text-white" />
          </div>
        ))}

      {/* Drivers */}
      {showDrivers &&
        drivers.map((driver) => (
          <div
            key={driver.id}
            className={`absolute w-6 h-6 rounded-full flex items-center justify-center transform -translate-x-3 -translate-y-3 shadow-md ${
              highlightId === driver.id && type === "driver" ? "bg-yellow-500 scale-125 z-20" : "bg-purple-500"
            }`}
            style={{
              left: `${positions.drivers[driver.id]?.x || 0}%`,
              top: `${positions.drivers[driver.id]?.y || 0}%`,
              transition: "all 0.3s ease-in-out",
            }}
            title={driver.name}
          >
            <span className="text-xs text-white font-bold">{driver.id}</span>
          </div>
        ))}

      {/* Selected restaurant */}
      {selectedRestaurant && positions.restaurants[selectedRestaurant] && (
        <div
          className="absolute border-2 border-green-500 opacity-50 rounded-full w-16 h-16 transform -translate-x-8 -translate-y-8 animate-pulse"
          style={{
            left: `${positions.restaurants[selectedRestaurant].x}%`,
            top: `${positions.restaurants[selectedRestaurant].y}%`,
          }}
        />
      )}

      {/* Selected driver */}
      {selectedDriver && positions.drivers[selectedDriver] && (
        <div
          className="absolute border-2 border-yellow-500 opacity-50 rounded-full w-16 h-16 transform -translate-x-8 -translate-y-8 animate-pulse"
          style={{
            left: `${positions.drivers[selectedDriver].x}%`,
            top: `${positions.drivers[selectedDriver].y}%`,
          }}
        />
      )}

      {/* Line from restaurant to user if order is being prepared */}
      {currentOrder && currentOrder.status === "preparing" && (
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <line
            x1={`${positions.restaurants[currentOrder.restaurantId]?.x || 0}%`}
            y1={`${positions.restaurants[currentOrder.restaurantId]?.y || 0}%`}
            x2="50%"
            y2="50%"
            stroke="#4CAF50"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      )}

      {/* Line from driver to user if order is being delivered */}
      {currentOrder && currentOrder.driverId && currentOrder.status === "delivering" && (
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <line
            x1={`${positions.drivers[currentOrder.driverId]?.x || 0}%`}
            y1={`${positions.drivers[currentOrder.driverId]?.y || 0}%`}
            x2="50%"
            y2="50%"
            stroke="#FFC107"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  )
}

