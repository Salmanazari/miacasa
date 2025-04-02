"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface GuideCardProps {
  id: string
  slug: string
  title: string
  excerpt: string
  image_urls: any
  created_at: string
  reading_time: string
  category: string
  tags?: any
  location_slug?: string
  featured?: boolean
  size?: "regular" | "large"
}

export default function GuideCard({
  id,
  slug,
  title,
  excerpt,
  image_urls,
  created_at,
  reading_time,
  category,
  tags,
  location_slug,
  featured = false,
  size = "regular",
}: GuideCardProps) {
  // State for the selected image
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  // Parse and select an image on component mount
  useEffect(() => {
    try {
      // Handle different image_urls formats safely
      if (!image_urls) {
        setSelectedImage(null)
        return
      }

      if (typeof image_urls === "string") {
        // If it's a direct URL
        if (image_urls.startsWith("http") || image_urls.startsWith("/")) {
          setSelectedImage(image_urls)
          return
        }

        // Try to parse as JSON
        try {
          const parsed = JSON.parse(image_urls)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedImage(parsed[0])
            return
          }
        } catch {
          // If parsing fails, check if it's comma-separated
          if (image_urls.includes(",")) {
            const urls = image_urls
              .split(",")
              .map((url) => url.trim())
              .filter(Boolean)
            if (urls.length > 0) {
              setSelectedImage(urls[0])
              return
            }
          }

          // Just use as is
          setSelectedImage(image_urls)
        }
      } else if (Array.isArray(image_urls) && image_urls.length > 0) {
        setSelectedImage(image_urls[0])
      }
    } catch (error) {
      console.error(`Error selecting image for guide ${title}:`, error)
      setSelectedImage(null)
    }
  }, [image_urls, title])

  // Default fallback image
  const fallbackImage = "/placeholder.svg?height=600&width=1200&text=Investment+Guide"

  // Format the date safely
  let formattedDate = "Recent"
  try {
    if (created_at) {
      formattedDate = new Date(created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  } catch (error) {
    console.error("Error formatting date:", error)
  }

  // Process category safely
  const displayCategory = (() => {
    if (typeof category !== "string" || !category) return "Guide"
    try {
      return category.replace(/-/g, " ")
    } catch {
      return category
    }
  })()

  // Determine height based on size
  const imageHeight = size === "large" ? "h-72" : "h-56"
  const titleSize = size === "large" ? "text-2xl" : "text-xl"

  return (
    <Link href={`/${featured ? "guides" : "blog"}/${slug || ""}`}>
      <Card className="rounded-[20px] overflow-hidden shadow-card bg-white transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] h-full border-2 border-muted">
        <div className={`relative ${imageHeight} w-full overflow-hidden bg-muted`}>
          {!imageError && selectedImage && (
            <img
              src={selectedImage || "/placeholder.svg"}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
              onError={() => {
                console.log("Image failed to load, showing fallback")
                setImageError(true)
              }}
            />
          )}
          {(imageError || !selectedImage) && (
            <img src={fallbackImage || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute left-4 top-4 z-10 flex gap-2">
            <Badge className="bg-primary text-primary-foreground">{displayCategory}</Badge>
            {featured && <Badge className="bg-secondary text-secondary-foreground">Featured</Badge>}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className={`font-bold ${titleSize} line-clamp-2`}>{title || "Guide"}</h3>
            {size === "large" && <p className="mt-2 line-clamp-2 text-white/90">{excerpt || ""}</p>}
          </div>
        </div>

        <CardContent className="p-6">
          {size !== "large" && <p className="line-clamp-2 text-muted-foreground">{excerpt || ""}</p>}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                <span>{reading_time || "5 min read"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="text-primary flex items-center gap-1 text-sm font-medium">
              Read Guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

