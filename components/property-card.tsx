"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Maximize, BedDouble, Bath } from "lucide-react"
import SafeImage from "@/components/safe-image"
import { debugLog, LogLevel } from "@/lib/debug-utils"
import { parseImageUrls } from "@/lib/image-utils"
import { InvestmentTierBadge } from "./investment-tier-guide"

interface PropertyCardProps {
  id: string
  slug: string
  title: string
  city: string
  province: string
  price: number
  currency?: string
  area_sqm: number
  bedrooms: number
  bathrooms: number
  hero_image_url: any
  images?: any // Additional images
  investment_tier?: string
  property_type: string
  is_featured?: boolean
}

export default function PropertyCard({
  id,
  slug,
  title,
  city,
  province,
  price,
  currency = "EUR",
  area_sqm,
  bedrooms,
  bathrooms,
  hero_image_url,
  images,
  investment_tier,
  property_type,
  is_featured,
}: PropertyCardProps) {
  // State for the selected image
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Log the component data for debugging
  debugLog(
    `PropertyCard rendering for ${title || "unknown property"}`,
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
      debugLog(`Error selecting random image for property ${title}`, error, LogLevel.ERROR)
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
  const propertyTitle = title || "Property"
  const propertySlug = slug || ""
  const propertyType = property_type || "Property"
  const location = `${city || ""}, ${province || ""}`.replace(/^, |, $/, "")

  // Determine investment tier based on price if not provided
  const determineTier = () => {
    if (investment_tier) return investment_tier

    if (price <= 200000) return "Starter"
    if (price <= 500000) return "Mid-range"
    if (price <= 1000000) return "Luxury"
    if (price <= 2999999) return "Luxury Plus"
    if (price <= 4999999) return "Luxury Premium"
    return "Ultra Prime"
  }

  const tier = determineTier()

  return (
    <Link href={`/investments/${propertySlug}`}>
      <Card className="rounded-[20px] overflow-hidden shadow-card bg-white transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] h-full">
        <div className="relative h-64 w-full overflow-hidden">
          <SafeImage
            src={selectedImage || hero_image_url}
            alt={propertyTitle}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            componentName={`PropertyCard-${propertyTitle}`}
            category="property"
            fallbackIndex={0}
            priority
          />
          <div className="absolute left-4 top-4 z-10">
            {is_featured && <Badge className="bg-primary text-primary-foreground mr-2">Featured</Badge>}
            <InvestmentTierBadge tier={tier} />
          </div>
          <div className="absolute right-4 top-4 z-10">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-secondary/50">
              {propertyType}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          {location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
          <h3 className="mt-2 line-clamp-1 text-xl font-semibold">{propertyTitle}</h3>
          <p className="mt-1 text-xl font-bold text-secondary">{formatPrice(price)}</p>
        </CardContent>
        <CardFooter className="border-t p-6 pt-4">
          <div className="flex w-full justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{area_sqm} m²</span>
            </div>
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              <span>{bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms} Baths</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

