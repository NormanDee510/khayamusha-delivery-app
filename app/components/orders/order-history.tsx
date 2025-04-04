"use client"

import { useStore } from "../../lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import RatingStars from "../ui/rating-stars"

export default function OrderHistory() {
  const { orders, restaurants, selectRestaurant } = useStore()

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (sortedOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">You haven't placed any orders yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedOrders.map((order) => {
          const restaurant = restaurants.find((r) => r.id === order.restaurantId)

          return (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{restaurant?.name}</h4>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-medium">R{order.total.toFixed(2)}</span>
                  <p className="text-xs text-gray-500 capitalize">{order.status}</p>
                </div>
              </div>

              {order.userRating && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Your rating:</p>
                  <RatingStars rating={order.userRating} readOnly size="sm" />
                </div>
              )}

              <Button variant="outline" size="sm" className="mt-3" onClick={() => selectRestaurant(order.restaurantId)}>
                Order Again
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

