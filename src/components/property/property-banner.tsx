"use client"

import Image from "next/image"
import { useEffect } from "react"

interface PropertyBannerProps {
  image: string
  name: string
  category: string
  location: string
  rating: number
  reviews: number
}

export default function PropertyBanner({ image, name, category, location, rating, reviews }: PropertyBannerProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])
  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden bg-black">
      <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" priority />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="max-w-[1350px] mx-auto h-full px-5 md:px-8 absolute inset-0 flex flex-col justify-end p-6 md:p-12">
        <div className="text-white">
          <p className="text-sm md:text-base font-light mb-2 opacity-90">{category}</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">{name}</h1>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold">{rating}</span>
              <span className="text-sm opacity-75">({reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <span className="text-sm">{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
