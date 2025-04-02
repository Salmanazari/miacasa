import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
  id: string
  slug: string
  title: string
  excerpt?: string
  image_urls: string | string[] | null
  created_at: string
  reading_time?: string
  category?: string
  tags?: string[] | string
  location_slug?: string
}

export default function BlogCard({
  id,
  slug,
  title,
  excerpt,
  image_urls,
  created_at,
  reading_time = "5 min read",
  category,
  tags,
  location_slug,
}: BlogCardProps) {
  // Helper function to safely get image URL
  const getImageUrl = () => {
    try {
      // If image_urls is a string that looks like JSON, try to parse it
      if (typeof image_urls === "string" && (image_urls.startsWith("[") || image_urls.startsWith("{"))) {
        const parsed = JSON.parse(image_urls)

        // If it's an array, return the first item
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0]
        }

        // If it's an object with a url property
        if (parsed && typeof parsed === "object" && parsed.url) {
          return parsed.url
        }

        // If it's just a string in JSON format
        if (typeof parsed === "string") {
          return parsed
        }
      }

      // If image_urls is a plain string URL
      if (typeof image_urls === "string" && image_urls.trim() !== "") {
        return image_urls
      }

      // If image_urls is an array
      if (Array.isArray(image_urls) && image_urls.length > 0) {
        return image_urls[0]
      }

      // Fallback to placeholder
      return "/placeholder.svg?height=300&width=500"
    } catch (error) {
      console.error("Error parsing image URL:", error)
      return "/placeholder.svg?height=300&width=500"
    }
  }

  // Format category for display
  const formatCategory = (cat) => {
    if (typeof cat !== "string" || !cat) return ""
    try {
      return cat.replace(/-/g, " ")
    } catch {
      return cat
    }
  }

  return (
    <div className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md">
      <Link href={`/blog/${slug}`}>
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={getImageUrl() || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.error("Image failed to load, using fallback")
              e.currentTarget.src = "/placeholder.svg?height=300&width=500"
            }}
          />
        </div>
        <div className="p-4">
          {category && (
            <Badge variant="outline" className="mb-2">
              {formatCategory(category)}
            </Badge>
          )}
          <h3 className="line-clamp-2 text-xl font-semibold">{title}</h3>
          {excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(created_at)}</span>
            <span>{reading_time}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

