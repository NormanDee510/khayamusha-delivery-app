"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function OrderForm({ onPlaceOrder }) {
  const [address, setAddress] = useState("")
  const [items, setItems] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onPlaceOrder({ address, items })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Place Your KhayaMusha Order</h2>
      <div>
        <Label htmlFor="address">Delivery Address</Label>
        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="items">Order Items</Label>
        <Input id="items" value={items} onChange={(e) => setItems(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        Place KhayaMusha Order
      </Button>
    </form>
  )
}

