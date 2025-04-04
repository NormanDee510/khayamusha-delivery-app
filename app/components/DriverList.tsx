"use client"

import { Button } from "@/components/ui/button"

const mockDrivers = [
  { id: 1, name: "Thabo Nkosi", rating: 4.8 },
  { id: 2, name: "Zanele Dube", rating: 4.9 },
  { id: 3, name: "Sipho Mthembu", rating: 4.7 },
]

export default function DriverList({ onSelectDriver }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available KhayaMusha Drivers</h2>
      <ul className="space-y-4">
        {mockDrivers.map((driver) => (
          <li key={driver.id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{driver.name}</p>
              <p className="text-sm text-gray-500">Rating: {driver.rating}</p>
            </div>
            <Button onClick={() => onSelectDriver(driver)}>Select</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

