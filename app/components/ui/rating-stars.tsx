"use client"

import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
}

export default function RatingStars({ rating, onRatingChange, size = "md", readOnly = false }: RatingStarsProps) {
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const handleClick = (index: number) => {
    if (readOnly || !onRatingChange) return
    onRatingChange(index + 1)
  }

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`${sizeClass[size]} ${
            index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          } ${!readOnly ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  )
}

