"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Restaurant } from "../../lib/store"

interface RestaurantCardProps {
  restaurant: Restaurant
  onSelect: (id: number) => void
}

export default function RestaurantCard({ restaurant, onSelect }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full">
        <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{restaurant.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{restaurant.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({restaurant.reviews})</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">{restaurant.cuisine}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm">{restaurant.deliveryTime}</span>
          <Button variant="outline" size="sm" onClick={() => onSelect(restaurant.id)}>
            View Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

