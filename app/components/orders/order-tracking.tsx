"use client"

import { useEffect, useState } from "react"
import { useStore } from "../../lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, MapPin, ShoppingBag, Truck, User } from "lucide-react"
import MockMap from "../MockMap"
import { useToast } from "@/hooks/use-toast"
import RatingStars from "../ui/rating-stars"

export default function OrderTracking() {
  const { currentOrder, restaurants, drivers, menuItems, rateOrder } = useStore()
  const [userRating, setUserRating] = useState(0)
  const [driverRating, setDriverRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const { toast } = useToast()

  const restaurant = restaurants.find((r) => r.id === currentOrder?.restaurantId)
  const driver = currentOrder?.driverId ? drivers.find((d) => d.id === currentOrder.driverId) : null

  const orderItems = currentOrder?.items.map((item) => {
    const menuItem = menuItems.find((mi) => mi.id === item.menuItemId)
    return {
      ...menuItem,
      quantity: item.quantity,
    }
  })

  const statusSteps = [
    { key: "pending", label: "Order Placed", icon: ShoppingBag },
    { key: "accepted", label: "Order Accepted", icon: CheckCircle2 },
    { key: "preparing", label: "Preparing", icon: Clock },
    { key: "delivering", label: "On the Way", icon: Truck },
    { key: "delivered", label: "Delivered", icon: MapPin },
  ]

  const currentStepIndex = statusSteps.findIndex((step) => step.key === currentOrder?.status)

  const submitRating = () => {
    if (!currentOrder) return

    rateOrder(currentOrder.id, userRating, driverRating)
    setHasRated(true)

    toast({
      title: "Thank you for your feedback!",
      description: "Your ratings help us improve our service.",
    })
  }

  // Reset ratings when order changes
  useEffect(() => {
    setUserRating(0)
    setDriverRating(0)
    setHasRated(false)
  }, [currentOrder?.id])

  if (!currentOrder || !restaurant) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <MockMap
            showDrivers={!!driver}
            showRestaurants={true}
            highlightId={driver?.id || restaurant.id}
            type={driver ? "driver" : "restaurant"}
          />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />

              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex
                const isCurrent = index === currentStepIndex

                return (
                  <div key={step.key} className="relative pl-10 pb-8 last:pb-0">
                    <div
                      className={`absolute left-0 rounded-full w-6 h-6 flex items-center justify-center ${
                        isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                      } ${isCurrent ? "ring-2 ring-green-200 ring-offset-2" : ""}`}
                    >
                      <step.icon className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${isCompleted ? "text-black" : "text-gray-500"}`}>{step.label}</h4>
                      {isCurrent && (
                        <p className="text-sm text-gray-500 mt-1">
                          {step.key === "pending" && "Waiting for restaurant to accept your order..."}
                          {step.key === "accepted" && "Restaurant is preparing to cook your food"}
                          {step.key === "preparing" && "Your food is being prepared"}
                          {step.key === "delivering" && `${driver?.name} is on the way with your order`}
                          {step.key === "delivered" && "Enjoy your meal!"}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-3 border-b">
              <ShoppingBag className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h4 className="font-medium">{restaurant.name}</h4>
                <p className="text-sm text-gray-500">{restaurant.address}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Items</h4>
              {orderItems?.map((item) => (
                <div key={item?.id} className="flex justify-between text-sm">
                  <span>
                    {item?.quantity}x {item?.name}
                  </span>
                  <span>R{((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium pt-2 border-t mt-2">
                <span>Total</span>
                <span>R{currentOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Delivery Address</h4>
                <p className="text-sm text-gray-500">{currentOrder.deliveryAddress}</p>
              </div>
            </div>

            {driver && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Driver</h4>
                  <p className="text-sm text-gray-500">
                    {driver.name} • {driver.vehicle}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {currentOrder.status === "delivered" && !hasRated && (
        <Card>
          <CardHeader>
            <CardTitle>Rate Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">How was your food from {restaurant.name}?</h4>
                <RatingStars rating={userRating} onRatingChange={setUserRating} />
              </div>

              {driver && (
                <div>
                  <h4 className="font-medium mb-2">How was your delivery by {driver.name}?</h4>
                  <RatingStars rating={driverRating} onRatingChange={setDriverRating} />
                </div>
              )}

              <Button onClick={submitRating} disabled={userRating === 0} className="w-full mt-2">
                Submit Ratings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

