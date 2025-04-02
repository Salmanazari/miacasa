"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import SafeImage from "@/components/safe-image"
import { debugLog, LogLevel } from "@/lib/debug-utils"
import { parseImageUrls } from "@/lib/image-utils"

interface FlagshipPropertyCardProps {
  id: string
  slug: string
  title: string
  city: string
  province: string
  price: number
  currency?: string
  hero_image_url: any
  images?: any // Additional images
  description: string
  property_type: string
}

export default function FlagshipPropertyCard({
  id,
  slug,
  title,
  city,
  province,
  price,
  currency = "EUR",
  hero_image_url,
  images,
  description,
  property_type,
}: FlagshipPropertyCardProps) {
  // State for the selected image
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Log the component data for debugging
  debugLog(
    `FlagshipPropertyCard rendering for ${title || "unknown property"}`,
    { id, slug, hero_image_url_type: typeof hero_image_url },
    LogLevel.DEBUG,
  )

  // Parse all available images
  useEffect(() => {
    try {
      // Get all available images
      const allImages: string[] = []

      // Add hero image if available
      if (hero_image_url) {
        const heroImages = parseImageUrls(hero_image_url)
        allImages.push(...heroImages)
      }

      // Add other images if available
      if (images) {
        const additionalImages = parseImageUrls(images)
        allImages.push(...additionalImages)
      }

      // Filter out empty or invalid URLs
      const validImages = allImages.filter(
        (img) => img && typeof img === "string" && (img.startsWith("http") || img.startsWith("/")),
      )

      // Select a random image if we have multiple
      if (validImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * validImages.length)
        setSelectedImage(validImages[randomIndex])
      } else {
        setSelectedImage(null)
      }
    } catch (error) {
      debugLog(`Error selecting random image for flagship property ${title}`, error, LogLevel.ERROR)
      setSelectedImage(null)
    }
  }, [hero_image_url, images, title])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Ensure we have valid values for rendering
  const propertyTitle = title || "Luxury Property"
  const propertySlug = slug || ""
  const propertyType = property_type || "Property"
  const propertyDescription = description || ""
  const location = `${city || ""}, ${province || ""}`.replace(/^, |, $/, "")

  return (
    <Link href={`/investments/${propertySlug}`}>
      <Card className="rounded-[20px] overflow-hidden shadow-card bg-white transition-all duration-300 hover:shadow-gold hover:scale-[1.02] h-full">
        <div className="relative aspect-square w-full overflow-hidden">
          <SafeImage
            src={selectedImage || hero_image_url}
            alt={propertyTitle}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            componentName={`FlagshipPropertyCard-${propertyTitle}`}
            fallbackIndex={0}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute right-4 top-4 z-10">
            <Badge className="bg-gold-gradient text-dark font-semibold">Ultra Prime</Badge>
          </div>
          <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            )}
            <h3 className="mt-2 text-2xl font-semibold">{propertyTitle}</h3>
            <p className="mt-1 text-xl font-bold text-secondary">{formatPrice(price)}</p>
            <p className="mt-2 line-clamp-2 text-sm opacity-90">{propertyDescription}</p>
            <Badge variant="outline" className="mt-3 bg-white/20 backdrop-blur-sm border-secondary/50">
              {propertyType}
            </Badge>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}

