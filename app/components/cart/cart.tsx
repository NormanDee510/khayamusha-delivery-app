"use client"

import { useState } from "react"
import { useStore } from "../../lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Cart() {
  const { cart, menuItems, removeFromCart, clearCart, placeOrder, user, restaurants, selectedRestaurant } = useStore()

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "")
  const { toast } = useToast()

  const cartItems = cart.map((item) => {
    const menuItem = menuItems.find((mi) => mi.id === item.menuItemId)
    return {
      ...menuItem,
      quantity: item.quantity,
    }
  })

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item?.price || 0) * (item?.quantity || 0)
  }, 0)

  const deliveryFee = subtotal > 0 ? 25 : 0
  const total = subtotal + deliveryFee

  const restaurant = selectedRestaurant ? restaurants.find((r) => r.id === selectedRestaurant) : null

  const handlePlaceOrder = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to place an order",
        variant: "destructive",
      })
      return
    }

    if (!deliveryAddress.trim()) {
      toast({
        title: "Delivery address required",
        description: "Please enter a delivery address",
        variant: "destructive",
      })
      return
    }

    const order = placeOrder(deliveryAddress)

    if (order) {
      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed and is being processed.",
      })
    }
  }

  if (cart.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
        <p className="text-gray-500 mb-4">Add items from a restaurant to get started</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Your Cart</h3>
        <Button variant="ghost" size="sm" onClick={clearCart} className="h-8 text-gray-500 hover:text-red-500">
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {restaurant && <div className="text-sm font-medium mb-3 pb-2 border-b">{restaurant.name}</div>}

      <div className="space-y-3 mb-4">
        {cartItems.map((item) => (
          <div key={item?.id} className="flex justify-between items-center">
            <div>
              <span className="font-medium">{item?.quantity}x</span> {item?.name}
            </div>
            <div className="flex items-center">
              <span className="mr-2">R{((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-red-500"
                onClick={() => item && removeFromCart(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm border-t pt-3 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>R{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>R{deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total</span>
          <span>R{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="address">Delivery Address</Label>
          <Input
            id="address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your delivery address"
          />
        </div>

        <Button className="w-full" onClick={handlePlaceOrder} disabled={!user}>
          Place Order
        </Button>
      </div>
    </div>
  )
}

