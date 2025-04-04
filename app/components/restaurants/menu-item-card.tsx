"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { MenuItem } from "../../lib/store"
import Image from "next/image"
import { useState } from "react"
import { Minus, Plus } from "lucide-react"

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (id: number, quantity: number) => void
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="relative h-24 w-24 flex-shrink-0">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        </div>
        <CardContent className="flex-1 p-3">
          <h4 className="font-medium">{item.name}</h4>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-medium">R{item.price.toFixed(2)}</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={decreaseQuantity}>
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-5 text-center">{quantity}</span>
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={increaseQuantity}>
                <Plus className="h-3 w-3" />
              </Button>
              <Button size="sm" onClick={() => onAddToCart(item.id, quantity)}>
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

