"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "../../lib/store"
import { useToast } from "@/hooks/use-toast"

export default function LoginForm({ onToggleForm }: { onToggleForm: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const login = useStore((state) => state.login)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const success = login(email, password)

    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome back to KhayaMusha Delivery!",
      })
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Try user@example.com / password",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
      <p className="text-center text-sm">
        Don't have an account?{" "}
        <button type="button" onClick={onToggleForm} className="text-green-600 hover:underline">
          Sign up
        </button>
      </p>
    </form>
  )
}

