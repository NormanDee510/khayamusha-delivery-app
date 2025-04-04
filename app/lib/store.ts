import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Restaurant {
  id: number
  name: string
  image: string
  cuisine: string
  deliveryTime: string
  rating: number
  reviews: number
  address: string
}

export interface MenuItem {
  id: number
  restaurantId: number
  name: string
  description: string
  price: number
  image: string
}

export interface Driver {
  id: number
  name: string
  rating: number
  photo: string
  vehicle: string
  completedDeliveries: number
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

export interface Order {
  id: number
  userId: number
  restaurantId: number
  driverId: number | null
  items: { menuItemId: number; quantity: number }[]
  status: "pending" | "accepted" | "preparing" | "delivering" | "delivered"
  total: number
  createdAt: string
  deliveryAddress: string
  userRating?: number
  driverRating?: number
}

export interface StoreState {
  user: User | null
  orders: Order[]
  restaurants: Restaurant[]
  menuItems: MenuItem[]
  drivers: Driver[]
  cart: { menuItemId: number; quantity: number }[]
  selectedRestaurant: number | null
  selectedDriver: number | null
  currentOrder: Order | null
  userLocation: { lat: number; lng: number } | null

  // Auth actions
  login: (email: string, password: string) => boolean
  signup: (user: Omit<User, "id">) => void
  logout: () => void

  // Order actions
  addToCart: (menuItemId: number, quantity: number) => void
  removeFromCart: (menuItemId: number) => void
  clearCart: () => void
  placeOrder: (deliveryAddress: string) => Order | null
  rateOrder: (orderId: number, userRating: number, driverRating?: number) => void

  // Selection actions
  selectRestaurant: (restaurantId: number | null) => void
  selectDriver: (driverId: number | null) => void

  // Location actions
  setUserLocation: (location: { lat: number; lng: number }) => void
}

// Mock data
const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "Mama Africa Kitchen",
    image: "/placeholder.svg?height=100&width=100",
    cuisine: "African",
    deliveryTime: "25-35 min",
    rating: 4.7,
    reviews: 243,
    address: "123 Mandela St, Johannesburg",
  },
  {
    id: 2,
    name: "Spice Route",
    image: "/placeholder.svg?height=100&width=100",
    cuisine: "Indian",
    deliveryTime: "30-40 min",
    rating: 4.5,
    reviews: 187,
    address: "45 Gandhi Rd, Durban",
  },
  {
    id: 3,
    name: "Cape Vineyard Bistro",
    image: "/placeholder.svg?height=100&width=100",
    cuisine: "Mediterranean",
    deliveryTime: "20-30 min",
    rating: 4.8,
    reviews: 312,
    address: "78 Wine Ave, Cape Town",
  },
]

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    restaurantId: 1,
    name: "Pap and Wors",
    description: "Traditional South African maize porridge with grilled sausage",
    price: 85,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    restaurantId: 1,
    name: "Bunny Chow",
    description: "Hollowed bread loaf filled with curry",
    price: 95,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    restaurantId: 1,
    name: "Bobotie",
    description: "Spiced minced meat baked with an egg-based topping",
    price: 110,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    restaurantId: 2,
    name: "Butter Chicken",
    description: "Tender chicken in a rich tomato and butter sauce",
    price: 120,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    restaurantId: 2,
    name: "Lamb Biryani",
    description: "Fragrant rice dish with tender lamb and spices",
    price: 140,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    restaurantId: 3,
    name: "Seafood Paella",
    description: "Spanish rice dish with fresh seafood and saffron",
    price: 160,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 7,
    restaurantId: 3,
    name: "Grilled Lamb Chops",
    description: "Tender lamb chops with herbs and olive oil",
    price: 180,
    image: "/placeholder.svg?height=80&width=80",
  },
]

const mockDrivers: Driver[] = [
  {
    id: 1,
    name: "Thabo Nkosi",
    rating: 4.8,
    photo: "/placeholder.svg?height=50&width=50",
    vehicle: "Motorcycle",
    completedDeliveries: 342,
  },
  {
    id: 2,
    name: "Zanele Dube",
    rating: 4.9,
    photo: "/placeholder.svg?height=50&width=50",
    vehicle: "Car",
    completedDeliveries: 521,
  },
  {
    id: 3,
    name: "Sipho Mthembu",
    rating: 4.7,
    photo: "/placeholder.svg?height=50&width=50",
    vehicle: "Bicycle",
    completedDeliveries: 187,
  },
]

// Create the store
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      restaurants: mockRestaurants,
      menuItems: mockMenuItems,
      drivers: mockDrivers,
      cart: [],
      selectedRestaurant: null,
      selectedDriver: null,
      currentOrder: null,
      userLocation: null,

      // Auth actions
      login: (email, password) => {
        // Mock login - in a real app, this would validate against a backend
        if (email === "user@example.com" && password === "password") {
          set({
            user: {
              id: 1,
              name: "Test User",
              email: "user@example.com",
              phone: "+27 123 456 7890",
              address: "123 Main St, Johannesburg",
            },
          })
          return true
        }
        return false
      },

      signup: (userData) => {
        set({
          user: {
            id: Date.now(),
            ...userData,
          },
        })
      },

      logout: () => {
        set({
          user: null,
          cart: [],
          selectedRestaurant: null,
          selectedDriver: null,
          currentOrder: null,
        })
      },

      // Order actions
      addToCart: (menuItemId, quantity) => {
        const { cart, menuItems } = get()
        const menuItem = menuItems.find((item) => item.id === menuItemId)

        if (!menuItem) return

        const existingItem = cart.find((item) => item.menuItemId === menuItemId)

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          })
        } else {
          set({
            cart: [...cart, { menuItemId, quantity }],
          })
        }
      },

      removeFromCart: (menuItemId) => {
        const { cart } = get()
        set({
          cart: cart.filter((item) => item.menuItemId !== menuItemId),
        })
      },

      clearCart: () => {
        set({ cart: [] })
      },

      placeOrder: (deliveryAddress) => {
        const { user, cart, selectedRestaurant, menuItems } = get()

        if (!user || !selectedRestaurant || cart.length === 0) return null

        const total = cart.reduce((sum, item) => {
          const menuItem = menuItems.find((mi) => mi.id === item.menuItemId)
          return sum + (menuItem?.price || 0) * item.quantity
        }, 0)

        const newOrder: Order = {
          id: Date.now(),
          userId: user.id,
          restaurantId: selectedRestaurant,
          driverId: null,
          items: [...cart],
          status: "pending",
          total,
          createdAt: new Date().toISOString(),
          deliveryAddress,
        }

        set((state) => ({
          orders: [...state.orders, newOrder],
          currentOrder: newOrder,
          cart: [],
        }))

        // Simulate order being accepted and assigned to a driver
        setTimeout(() => {
          const randomDriverId = Math.floor(Math.random() * 3) + 1

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === newOrder.id ? { ...order, status: "accepted", driverId: randomDriverId } : order,
            ),
            currentOrder: {
              ...state.currentOrder!,
              status: "accepted",
              driverId: randomDriverId,
            },
            selectedDriver: randomDriverId,
          }))

          // Simulate order preparation
          setTimeout(() => {
            set((state) => ({
              orders: state.orders.map((order) =>
                order.id === newOrder.id ? { ...order, status: "preparing" } : order,
              ),
              currentOrder: {
                ...state.currentOrder!,
                status: "preparing",
              },
            }))

            // Simulate delivery
            setTimeout(() => {
              set((state) => ({
                orders: state.orders.map((order) =>
                  order.id === newOrder.id ? { ...order, status: "delivering" } : order,
                ),
                currentOrder: {
                  ...state.currentOrder!,
                  status: "delivering",
                },
              }))

              // Simulate delivered
              setTimeout(() => {
                set((state) => ({
                  orders: state.orders.map((order) =>
                    order.id === newOrder.id ? { ...order, status: "delivered" } : order,
                  ),
                  currentOrder: {
                    ...state.currentOrder!,
                    status: "delivered",
                  },
                }))
              }, 10000) // 10 seconds
            }, 15000) // 15 seconds
          }, 10000) // 10 seconds
        }, 5000) // 5 seconds

        return newOrder
      },

      rateOrder: (orderId, userRating, driverRating) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  userRating,
                  ...(driverRating ? { driverRating } : {}),
                }
              : order,
          ),
        }))
      },

      // Selection actions
      selectRestaurant: (restaurantId) => {
        set({
          selectedRestaurant: restaurantId,
          cart: restaurantId ? [] : get().cart, // Clear cart when changing restaurants
        })
      },

      selectDriver: (driverId) => {
        set({ selectedDriver: driverId })
      },

      // Location actions
      setUserLocation: (location) => {
        set({ userLocation: location })
      },
    }),
    {
      name: "khayamusha-storage",
    },
  ),
)

