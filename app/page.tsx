"use client"

import { useState, useEffect } from "react"
import { useStore } from "./lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Home, LogOut, ShoppingBag, UserIcon } from "lucide-react"
import MockMap from "./components/MockMap"
import LoginForm from "./components/auth/login-form"
import SignupForm from "./components/auth/signup-form"
import RestaurantCard from "./components/restaurants/restaurant-card"
import MenuItemCard from "./components/restaurants/menu-item-card"
import Cart from "./components/cart/cart"
import OrderTracking from "./components/orders/order-tracking"
import OrderHistory from "./components/orders/order-history"

export default function HomePage() {
  const { user, logout, restaurants, menuItems, selectedRestaurant, selectRestaurant, addToCart, currentOrder } =
    useStore()

  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authFormType, setAuthFormType] = useState<"login" | "signup">("login")
  const [activeTab, setActiveTab] = useState("home")

  // Filter menu items for the selected restaurant
  const restaurantMenuItems = menuItems.filter((item) => item.restaurantId === selectedRestaurant)

  // Set active tab based on order status
  useEffect(() => {
    if (currentOrder) {
      setActiveTab("orders")
    }
  }, [currentOrder])

  const toggleAuthForm = () => {
    setAuthFormType(authFormType === "login" ? "signup" : "login")
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full mr-3 flex items-center justify-center text-white font-bold text-lg">
              KM
            </div>
            <h1 className="text-xl font-bold">KhayaMusha Delivery</h1>
          </div>

          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium hidden md:inline-block">{user.name}</span>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowAuthForm(true)}>Login / Sign Up</Button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{authFormType === "login" ? "Login" : "Create Account"}</h2>

            {authFormType === "login" ? (
              <LoginForm onToggleForm={toggleAuthForm} />
            ) : (
              <SignupForm onToggleForm={toggleAuthForm} />
            )}

            <Button variant="ghost" className="mt-4 w-full" onClick={() => setShowAuthForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                {selectedRestaurant ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">
                        {restaurants.find((r) => r.id === selectedRestaurant)?.name}
                      </h2>
                      <Button variant="outline" onClick={() => selectRestaurant(null)}>
                        Back to Restaurants
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {restaurantMenuItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Restaurants Near You</h2>
                    <MockMap showRestaurants={true} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {restaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} onSelect={selectRestaurant} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Cart />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                {currentOrder ? (
                  <OrderTracking />
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No active orders</h3>
                    <p className="text-gray-500 mb-4">Your order history is shown below</p>
                    <Button onClick={() => setActiveTab("home")}>Browse Restaurants</Button>
                  </div>
                )}
              </div>

              <div>
                <OrderHistory />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                {user ? (
                  <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="text-lg">{user.name}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="text-lg">{user.email}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="text-lg">{user.phone}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Default Address</h3>
                        <p className="text-lg">{user.address}</p>
                      </div>
                    </div>

                    <Button variant="destructive" className="mt-6" onClick={logout}>
                      Log Out
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <UserIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-1">Not logged in</h3>
                    <p className="text-gray-500 mb-4">Please log in to view your profile</p>
                    <Button onClick={() => setShowAuthForm(true)}>Login / Sign Up</Button>
                  </div>
                )}
              </div>

              <div>
                <OrderHistory />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

