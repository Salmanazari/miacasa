"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { debugLog, LogLevel } from "@/lib/debug-utils"
import { isValidString, safeStartsWith, safeIncludes } from "@/lib/string-utils"

// Define fallback images by category
const FALLBACK_IMAGES = {
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

interface SafeImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: any
  alt: string
  fallbackIndex?: number
  componentName?: string
  category?: "property" | "location" | "blog" | "general"
}

export default function SafeImage({
  src,
  alt,
  fallbackIndex = 0,
  componentName = "SafeImage",
  category = "general",
  ...props
}: SafeImageProps) {
  // Get appropriate fallback images based on category
  const getFallbackImage = (index: number): string => {
    const fallbacks = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.general
    return fallbacks[index % fallbacks.length]
  }

  // Process the source URL safely
  const processImageUrl = (url: any): string => {
    // If url is null or undefined, use fallback
    if (url === null || url === undefined) {
      debugLog(`[${componentName}] Image URL is ${url === null ? "null" : "undefined"}, using fallback`, LogLevel.WARN)
      return getFallbackImage(fallbackIndex)
    }

    // If url is an array, try to get the first item
    if (Array.isArray(url)) {
      debugLog(`[${componentName}] Image URL is an array with ${url.length} items`, LogLevel.DEBUG)
      if (url.length > 0) {
        const firstItem = url[0]
        if (isValidString(firstItem)) {
          return firstItem
        } else {
          debugLog(`[${componentName}] First array item is not a string: ${typeof firstItem}`, LogLevel.WARN)
          return getFallbackImage(fallbackIndex)
        }
      } else {
        debugLog(`[${componentName}] Image URL array is empty`, LogLevel.WARN)
        return getFallbackImage(fallbackIndex)
      }
    }

    // If url is not a string, try to convert it to string
    if (!isValidString(url)) {
      debugLog(`[${componentName}] Image URL is not a string: ${typeof url}`, LogLevel.WARN)
      try {
        // Try to convert to string
        const stringUrl = String(url)
        if (stringUrl && stringUrl !== "[object Object]" && stringUrl !== "undefined" && stringUrl !== "null") {
          return stringUrl
        }
        return getFallbackImage(fallbackIndex)
      } catch (error) {
        debugLog(`[${componentName}] Failed to convert URL to string: ${error}`, LogLevel.ERROR)
        return getFallbackImage(fallbackIndex)
      }
    }

    // Now we know url is a string

    // Handle empty string
    if (url.trim() === "") {
      debugLog(`[${componentName}] Image URL is an empty string`, LogLevel.WARN)
      return getFallbackImage(fallbackIndex)
    }

    // Handle JSON string that might contain an array of URLs
    if (safeStartsWith(url, "[") || safeStartsWith(url, "{")) {
      try {
        const parsed = JSON.parse(url)
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (isValidString(parsed[0])) {
            debugLog(`[${componentName}] Successfully parsed JSON array with ${parsed.length} items`, LogLevel.DEBUG)
            return parsed[0]
          } else {
            debugLog(`[${componentName}] First item in JSON array is not a string: ${typeof parsed[0]}`, LogLevel.WARN)
            return getFallbackImage(fallbackIndex)
          }
        } else if (typeof parsed === "object" && parsed !== null) {
          const values = Object.values(parsed).filter(isValidString)
          if (values.length > 0) {
            debugLog(`[${componentName}] Extracted URL from JSON object`, LogLevel.DEBUG)
            return values[0] as string
          }
        }
        debugLog(`[${componentName}] Parsed JSON but couldn't extract a valid URL`, LogLevel.WARN)
        return getFallbackImage(fallbackIndex)
      } catch (error) {
        // Continue processing as it might be a URL that starts with [ or {
      }
    }

    // Handle comma-separated URLs
    if (safeIncludes(url, ",")) {
      const urls = url
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean)
      if (urls.length > 0) {
        debugLog(`[${componentName}] Found comma-separated URLs, using first one`, LogLevel.DEBUG)
        return urls[0]
      }
    }

    // Return the URL as is if it's a valid URL
    if (safeStartsWith(url, "http://") || safeStartsWith(url, "https://") || safeStartsWith(url, "/")) {
      debugLog(`[${componentName}] Using direct URL: ${url.substring(0, 50)}...`, LogLevel.DEBUG)
      return url
    }

    // If we get here, the URL is not in a recognized format
    debugLog(`[${componentName}] Unrecognized URL format: ${url.substring(0, 50)}...`, LogLevel.WARN)
    return getFallbackImage(fallbackIndex)
  }

  // State for the image source
  const [imageUrl, setImageUrl] = useState<string>(() => {
    try {
      return processImageUrl(src)
    } catch (error) {
      debugLog(`[${componentName}] Error processing image URL: ${error}`, LogLevel.ERROR)
      return getFallbackImage(fallbackIndex)
    }
  })
  const [error, setError] = useState<boolean>(false)
  const [fallbackCount, setFallbackCount] = useState<number>(0)

  // Update image URL when src changes
  useEffect(() => {
    try {
      setImageUrl(processImageUrl(src))
      setError(false)
      setFallbackCount(0)
    } catch (error) {
      debugLog(`[${componentName}] Error updating image URL: ${error}`, LogLevel.ERROR)
      setImageUrl(getFallbackImage(fallbackIndex))
    }
  }, [src, fallbackIndex, componentName, category])

  // Handle image loading error
  const handleError = () => {
    const fallbacks = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.general
    if (fallbackCount >= fallbacks.length) {
      debugLog(`[${componentName}] All fallbacks failed for ${alt}`, LogLevel.ERROR)
      return
    }

    const nextFallbackIndex = (fallbackIndex + fallbackCount + 1) % fallbacks.length
    const fallbackUrl = getFallbackImage(nextFallbackIndex)

    debugLog(
      `[${componentName}] Image failed to load, trying fallback #${fallbackCount + 1}: ${fallbackUrl}`,
      LogLevel.WARN,
    )

    setImageUrl(fallbackUrl)
    setFallbackCount((prev) => prev + 1)
    setError(true)
  }

  return <Image src={imageUrl || "/placeholder.svg"} alt={alt} onError={handleError} {...props} />
}

