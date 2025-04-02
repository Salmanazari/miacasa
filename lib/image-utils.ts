/**
 * Utility functions for handling images
 */

// Function to safely parse image URLs from various formats
export function parseImageUrls(imageUrlsData: any): string[] {
  if (!imageUrlsData) return []

  // If it's already a URL, return it as a single-item array
  if (typeof imageUrlsData === "string") {
    // Direct URL
    if (imageUrlsData.startsWith("http://") || imageUrlsData.startsWith("https://")) {
      return [imageUrlsData]
    }

    try {
      // Try to parse as JSON
      if (imageUrlsData.startsWith("[") || imageUrlsData.startsWith("{")) {
        const parsed = JSON.parse(imageUrlsData)

        // If it's an array, return it
        if (Array.isArray(parsed)) {
          return parsed.filter((url) => url && typeof url === "string")
        }

        // If it's a string, return it as a single-item array
        if (typeof parsed === "string") {
          return [parsed]
        }

        // If it's an object, try to extract values
        if (parsed && typeof parsed === "object") {
          return Object.values(parsed)
            .filter((val) => val && typeof val === "string")
            .map((val) => val as string)
        }
      }

      // If parsing fails, check if it's a comma-separated list
      if (imageUrlsData.includes(",")) {
        return imageUrlsData
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url)
      }

      // If it's just a string, return it as a single-item array
      return [imageUrlsData]
    } catch (error) {
      console.error("Error parsing image URLs:", error)
      return [imageUrlsData] // Return the original string as a fallback
    }
  }

  // If it's an array, filter out non-string values
  if (Array.isArray(imageUrlsData)) {
    return imageUrlsData.filter((url) => typeof url === "string")
  }

  // If it's an object, try to extract string values
  if (imageUrlsData && typeof imageUrlsData === "object") {
    return Object.values(imageUrlsData)
      .filter((val) => val && typeof val === "string")
      .map((val) => val as string)
  }

  return []
}

// Function to get a fallback image URL if the primary one fails
export function getFallbackImageUrl(category = "general", index = 0): string {
  const fallbacks = {
    property: [
      "/placeholder.svg?height=600&width=800",
      "https://mabeaute-property-images.s3.amazonaws.com/webassets/homepage/WhatsApp%20Image%202025-03-31%20at%2012.08.35.jpeg",
    ],
    location: [
      "/placeholder.svg?height=500&width=800&text=Beautiful+Location",
      "https://mabeaute-property-images.s3.amazonaws.com/webassets/homepage/locations-placeholder.jpeg",
    ],
    blog: [
      "/placeholder.svg?height=400&width=800&text=Market+Insights",
      "https://mabeaute-property-images.s3.amazonaws.com/webassets/homepage/blog-placeholder.jpeg",
    ],
    general: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=400&width=600"],
  }

  const categoryFallbacks = fallbacks[category as keyof typeof fallbacks] || fallbacks.general
  return categoryFallbacks[index % categoryFallbacks.length]
}

