"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { parseImageUrls } from "@/lib/image-utils"
import { debugLog, LogLevel } from "@/lib/debug-utils"

interface LocationCardProps {
  id?: string
  slug?: string
  name?: string
  image_urls?: any
  description?: string
  propertyCount?: number
}

export default function LocationCard({
  id = "",
  slug = "",
  name = "Location",
  image_urls = null,
  description = "",
  propertyCount,
}: LocationCardProps) {
  // State for the selected image
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Parse and select a random image on component mount
  useEffect(() => {
    try {
      const images = parseImageUrls(image_urls)

      if (images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length)
        setSelectedImage(images[randomIndex])
      } else {
        setSelectedImage(null)
      }
    } catch (error) {
      debugLog(`Error selecting random image for location ${name}`, error, LogLevel.ERROR)
      setSelectedImage(null)
    }
  }, [image_urls, name])

  // Default fallback image
  const fallbackImage = "/placeholder.svg?height=500&width=800&text=Beautiful+Location"

  // Make sure slug is valid
  const safeSlug = slug ? slug.toLowerCase().trim() : name.toLowerCase().replace(/\s+/g, "-").trim()

  return (
    <Link href={`/locations/${safeSlug}`}>
      <Card className="rounded-[20px] overflow-hidden shadow-card bg-white transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] h-full">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={selectedImage || fallbackImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            onError={() => {
              // Fallback if image fails to load
              setSelectedImage(fallbackImage)
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-semibold">{name}</h3>
            {typeof propertyCount === "number" && <p className="text-sm opacity-90">{propertyCount} Properties</p>}
          </div>
        </div>
        <CardContent className="p-6">
          <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
          {/* We've removed the lifestyle_tags rendering completely */}
        </CardContent>
      </Card>
    </Link>
  )
}

