import { supabase } from "./supabase"
import { debugLog, LogLevel } from "@/lib/debug-utils"

// Add this function at the top of the file, after the imports
function isValidString(value: any): boolean {
  return typeof value === "string" && value !== null && value !== undefined
}

// Properties
export async function getProperties(
  options: {
    limit?: number
    offset?: number
    location?: string
    propertyType?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    bathrooms?: number
    minArea?: number
    maxArea?: number
    minPlot?: number
    maxPlot?: number
    featured?: boolean
    investmentTier?: string
    features?: string[]
    transactionType?: string
    developmentType?: string
    availability?: string
    sortBy?: string
  } = {},
) {
  const {
    limit = 10,
    offset = 0,
    location,
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minArea,
    maxArea,
    minPlot,
    maxPlot,
    featured,
    investmentTier,
    features,
    transactionType,
    developmentType,
    availability,
    sortBy = "price-desc",
  } = options

  try {
    let query = supabase.from("properties").select("*").eq("listing_status", "Active")

    // Apply filters
    if (location) {
      query = query.or(`city.ilike.%${location}%,province.ilike.%${location}%`)
    }

    if (propertyType) {
      query = query.eq("property_type", propertyType)
    }

    if (minPrice) {
      query = query.gte("price", minPrice)
    }

    if (maxPrice) {
      query = query.lte("price", maxPrice)
    }

    if (bedrooms) {
      query = query.gte("bedrooms", bedrooms)
    }

    if (bathrooms) {
      query = query.gte("bathrooms", bathrooms)
    }

    if (minArea) {
      query = query.gte("area_sqm", minArea)
    }

    if (maxArea) {
      query = query.lte("area_sqm", maxArea)
    }

    if (minPlot) {
      query = query.gte("plot_sqm", minPlot)
    }

    if (maxPlot) {
      query = query.lte("plot_sqm", maxPlot)
    }

    if (featured) {
      query = query.eq("is_featured", featured)
    }

    if (investmentTier) {
      query = query.eq("investment_tier", investmentTier)
    }

    if (features && features.length > 0) {
      // For each feature, check if it's in the features JSON array
      features.forEach((feature) => {
        query = query.ilike("features", `%${feature}%`)
      })
    }

    if (transactionType) {
      query = query.eq("transaction_type", transactionType)
    }

    if (developmentType) {
      query = query.eq("development_type", developmentType)
    }

    if (availability) {
      query = query.eq("availability_status", availability)
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        query = query.order("price", { ascending: true })
        break
      case "price-desc":
        query = query.order("price", { ascending: false })
        break
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "size-desc":
        query = query.order("area_sqm", { ascending: false })
        break
      case "bedrooms-desc":
        query = query.order("bedrooms", { ascending: false })
        break
      default:
        query = query.order("price", { ascending: false })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      console.error("Error fetching properties:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error in getProperties:", error)
    return []
  }
}

export async function getPropertyBySlug(slug: string) {
  try {
    const { data, error } = await supabase.from("properties").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error fetching property:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error in getPropertyBySlug:", error)
    return null
  }
}

export async function getSimilarProperties(property: any, limit = 3) {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("listing_status", "Active")
      .eq("property_type", property.property_type)
      .eq("city", property.city)
      .neq("id", property.id)
      .limit(limit)

    if (error) {
      console.error("Error fetching similar properties:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error in getSimilarProperties:", error)
    return null
  }
}

// Locations
export async function getLocations(
  options: {
    limit?: number
    parentOnly?: boolean
    includeChildren?: boolean
  } = {},
) {
  try {
    const { limit = 100, parentOnly = false, includeChildren = true } = options

    let query = supabase.from("locations").select("*").order("display_priority", { ascending: false })

    if (parentOnly) {
      query = query.is("parent_id", null)
    }

    // Apply limit to the query
    query = query.limit(limit)

    const { data, error } = await query

    if (error) {
      console.error("Error fetching locations:", error)
      return []
    }

    // If we want to include children but only fetched parents, get their children too
    if (parentOnly && includeChildren && data && data.length > 0) {
      const parentIds = data.map((loc) => loc.id)
      const { data: childrenData, error: childrenError } = await supabase
        .from("locations")
        .select("*")
        .in("parent_id", parentIds)
        .order("display_priority", { ascending: false })

      if (!childrenError && childrenData) {
        // Return both parents and children
        return [...data, ...childrenData]
      }
    }

    // Log the data for debugging
    debugLog(
      "Raw locations data from API:",
      data.map((loc: any) => ({
        id: loc.id,
        name: loc.name,
        parent_id: loc.parent_id,
        image_urls_type: typeof loc.image_urls,
        image_urls_sample:
          typeof loc.image_urls === "string"
            ? loc.image_urls.substring(0, 50) + "..."
            : JSON.stringify(loc.image_urls).substring(0, 50) + "...",
      })),
      LogLevel.DEBUG,
    )

    return data || []
  } catch (error) {
    console.error("Unexpected error in getLocations:", error)
    return []
  }
}

export async function getLocationBySlug(slug: string) {
  try {
    debugLog(`Fetching location with slug: ${slug}`, LogLevel.DEBUG)

    // First try exact match
    const { data, error } = await supabase.from("locations").select("*").eq("slug", slug).single()

    if (error) {
      // If not found with exact match, try case-insensitive match
      debugLog(`No exact match for slug ${slug}, trying case-insensitive match`, LogLevel.DEBUG)
      const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
        .from("locations")
        .select("*")
        .ilike("slug", slug)
        .limit(1)

      if (caseInsensitiveError || !caseInsensitiveData || caseInsensitiveData.length === 0) {
        console.error("Error fetching location:", error)
        return null
      }

      return caseInsensitiveData[0]
    }

    // Log the raw data for debugging
    debugLog(
      `Raw location data for ${slug}:`,
      {
        id: data?.id,
        name: data?.name,
        image_urls_type: typeof data?.image_urls,
        image_urls_sample:
          typeof data?.image_urls === "string"
            ? data.image_urls.substring(0, 50) + "..."
            : JSON.stringify(data?.image_urls).substring(0, 50) + "...",
      },
      LogLevel.DEBUG,
    )

    return data
  } catch (error) {
    console.error("Unexpected error in getLocationBySlug:", error)
    return null
  }
}

export async function getChildLocations(parentId: string) {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("parent_id", parentId)
      .order("display_priority", { ascending: false })

    if (error) {
      console.error("Error fetching child locations:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error in getChildLocations:", error)
    return []
  }
}

export async function getPropertiesByLocation(locationSlug: string, limit = 3) {
  try {
    const location = await getLocationBySlug(locationSlug)

    if (!location) return []

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("listing_status", "Active")
      .or(`city.ilike.%${location.name}%,province.ilike.%${location.name}%`)
      .limit(limit)

    if (error) {
      console.error("Error fetching properties by location:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error in getPropertiesByLocation:", error)
    return []
  }
}

// Blog Posts
export async function getBlogPosts(
  options: {
    limit?: number
    offset?: number
    category?: string
    tag?: string
    locationSlug?: string
    publishedOnly?: boolean
  } = {},
) {
  try {
    const { limit = 10, offset = 0, category, tag, locationSlug, publishedOnly = true } = options

    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (publishedOnly) {
      query = query.eq("published", true)
    }

    if (category && isValidString(category)) {
      query = query.eq("category", category)
    }

    // Fix for the operator error - use textSearch instead of ilike for tags
    if (tag && isValidString(tag)) {
      // Instead of using ilike on the tags field, we'll fetch all and filter in JS
      // This avoids the SQL operator error
    }

    // Fix for the location slug query
    if (locationSlug && isValidString(locationSlug)) {
      query = query.or(`location_slug.eq.${locationSlug},location_slug.ilike.%${locationSlug}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }

    // If tag is specified, filter the results in JavaScript
    if (tag && data) {
      return data.filter((post) => {
        try {
          const tags = parseJsonField(post.tags, [])
          if (Array.isArray(tags)) {
            return tags.some((t) => {
              return isValidString(t) && isValidString(tag) && t.toLowerCase().includes(tag.toLowerCase())
            })
          }
          return false
        } catch (e) {
          console.error("Error filtering by tag:", e)
          return false
        }
      })
    }

    return data || []
  } catch (error) {
    console.error("Error in getBlogPosts:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error fetching blog post:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error in getBlogPostBySlug:", error)
    return null
  }
}

export async function getRelatedBlogPosts(post: any, limit = 2) {
  try {
    // First try to get posts with the same location
    const query = supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .eq("location_slug", post.location_slug)
      .neq("id", post.id)
      .limit(limit)

    let { data, error } = await query

    if (error || !data || data.length < limit) {
      // If not enough related posts by location, try by tags
      // Use parseJsonField to safely handle the tags
      const tags = parseJsonField(post.tags, [])

      if (tags.length > 0) {
        // Get all blog posts and filter in JS to avoid SQL operator issues
        const { data: allPosts, error: allPostsError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .neq("id", post.id)
          .limit(limit * 3) // Get more posts to filter from

        if (!allPostsError && allPosts) {
          // Filter posts that contain the first tag
          const tagRelatedPosts = allPosts
            .filter((p) => {
              const postTags = parseJsonField(p.tags, [])
              return postTags.some(
                (t) =>
                  typeof t === "string" &&
                  typeof tags[0] === "string" &&
                  t.toLowerCase().includes(tags[0].toLowerCase()),
              )
            })
            .slice(0, limit - (data?.length || 0))

          data = [...(data || []), ...tagRelatedPosts]
        }
      }
    }

    if (!data || data.length < limit) {
      // If still not enough, get the most recent posts
      const recentQuery = supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .neq("id", post.id)
        .order("created_at", { ascending: false })
        .limit(limit - (data?.length || 0))

      const { data: recentData, error: recentError } = await recentQuery

      if (!recentError && recentData) {
        data = [...(data || []), ...recentData]
      }
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error in getRelatedBlogPosts:", error)
    return []
  }
}

// Add this function to fetch guides specifically
export async function getGuides(
  options: {
    limit?: number
    offset?: number
    category?: string
    tag?: string
    locationSlug?: string
  } = {},
) {
  try {
    const { limit = 10, offset = 0, category, tag, locationSlug } = options

    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .eq("is_guide", true) // Filter for guides only
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq("category", category)
    }

    if (locationSlug) {
      query = query.or(`location_slug.eq.${locationSlug},location_slug.ilike.%${locationSlug}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching guides:", error)
      return []
    }

    // If tag is specified, filter the results in JavaScript
    if (tag && data) {
      return data.filter((post) => {
        const tags = parseJsonField(post.tags, [])
        return tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
      })
    }

    return data || []
  } catch (error) {
    console.error("Error in getGuides:", error)
    return []
  }
}

// Add this function to get guide categories
export async function getGuideCategories() {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("category")
      .eq("published", true)
      .eq("is_guide", true)
      .order("category", { ascending: true })

    if (error) {
      console.error("Error fetching guide categories:", error)
      return []
    }

    // Extract unique categories
    const categories = [...new Set(data.map((item) => item.category))].filter(Boolean)
    return categories
  } catch (error) {
    console.error("Error in getGuideCategories:", error)
    return []
  }
}

// Partners
export async function getPartners(
  options: {
    limit?: number
    country?: string
    featured?: boolean
  } = {},
) {
  try {
    const { limit = 100, country, featured } = options

    let query = supabase
      .from("international_partners")
      .select("*")
      .eq("status", "Active")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (country) {
      query = query.eq("country_name", country)
    }

    if (featured) {
      query = query.eq("featured", featured)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching partners:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error in getPartners:", error)
    return []
  }
}

export async function getPartnerBySlug(slug: string) {
  try {
    // Since there's no slug field in the partners table, we'll create one from the partner_name
    const { data, error } = await supabase.from("international_partners").select("*").eq("status", "Active")

    if (error) {
      console.error("Error fetching partner:", error)
      return null
    }

    // Find the partner with a matching slug
    const partner = data.find((p) => {
      const partnerSlug = p.partner_name.toLowerCase().replace(/\s+/g, "-")
      return partnerSlug === slug
    })

    return partner || null
  } catch (error) {
    console.error("Unexpected error in getPartnerBySlug:", error)
    return null
  }
}

// Inquiries
export async function createInquiry(inquiry: {
  property_id: string
  name: string
  email: string
  phone: string
  message: string
  source: string
  property_custom_id?: string
}) {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .insert([
        {
          ...inquiry,
          status: "new",
          reveal: false,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating inquiry:", error)
      return null
    }

    return data[0]
  } catch (error) {
    console.error("Unexpected error in createInquiry:", error)
    return null
  }
}

// Utility functions
export function parseJsonField(jsonString: string | null, defaultValue: any = []) {
  if (jsonString === null || jsonString === undefined) return defaultValue

  // If it's not a string, return the default value
  if (typeof jsonString !== "string") return defaultValue

  // First, check if the string is a direct URL
  if (typeof jsonString === "string" && (jsonString.startsWith("http://") || jsonString.startsWith("https://"))) {
    return [jsonString] // Return as a single-item array
  }

  try {
    // Try to parse as JSON
    const parsed = JSON.parse(jsonString)
    return parsed
  } catch (error) {
    // If parsing fails, check if it's a comma-separated list
    if (typeof jsonString === "string" && jsonString.includes(",")) {
      return jsonString.split(",").map((item) => item.trim())
    }

    // If not a comma-separated list, return the string as a single-item array
    return [jsonString]
  }
}

/**
 * Fetches market insights for a specific location
 */
export async function getMarketInsightsByLocationSlug(locationSlug: string) {
  try {
    const { data, error } = await supabase.rpc("get_market_insights_by_location_slug", { location_slug: locationSlug })

    if (error) {
      console.error("Error fetching market insights:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getMarketInsightsByLocationSlug:", error)
    return null
  }
}

/**
 * Safely checks if a value is a string and can use string methods
 */
//export function isValidString(value: any): boolean {
//  return typeof value === "string" && value.length > 0
//}

/**
 * Safely processes lifestyle tags from any input format
 * @param tagsInput Any input that might contain lifestyle tags
 * @returns An array of string tags
 */
export function processLifestyleTags(tagsInput: any): string[] {
  try {
    // If tagsInput is null, undefined, or empty, return empty array
    if (!tagsInput) {
      return []
    }

    // If it's already an array, filter for strings
    if (Array.isArray(tagsInput)) {
      return tagsInput.filter((tag) => typeof tag === "string")
    }

    // If it's a string, process it
    if (typeof tagsInput === "string") {
      // Empty string check
      if (tagsInput.trim() === "") {
        return []
      }

      // Try to parse as JSON if it starts with [ or {
      if (tagsInput.startsWith("[") || tagsInput.startsWith("{")) {
        try {
          const parsed = JSON.parse(tagsInput)

          // If parsed result is an array, use it (filtering for strings)
          if (Array.isArray(parsed)) {
            return parsed.filter((tag) => typeof tag === "string")
          }

          // If parsed result is an object, extract string values
          if (parsed && typeof parsed === "object") {
            return Object.values(parsed).filter((val) => typeof val === "string") as string[]
          }

          // If parsed result is a string, use it as a single item
          if (typeof parsed === "string") {
            return [parsed]
          }

          // Fallback to empty array if we couldn't extract anything useful
          return []
        } catch (error) {
          // JSON parsing failed, continue to other methods
        }
      }

      // Check if it's a comma-separated list
      if (tagsInput.includes(",")) {
        return tagsInput
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean)
      }

      // If we get here, just use the string as a single item
      return [tagsInput]
    }

    // If it's an object, try to extract string values
    if (tagsInput && typeof tagsInput === "object") {
      try {
        return Object.values(tagsInput).filter((val) => typeof val === "string") as string[]
      } catch (error) {
        return []
      }
    }

    // If we get here, we couldn't process the tags in any way
    return []
  } catch (error) {
    // Catch any unexpected errors
    return []
  }
}

