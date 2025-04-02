import { supabase } from "./supabase"
import { debugLog, LogLevel } from "@/lib/debug-utils"
import { isValidString } from "@/lib/string-utils-safe"

// Blog Posts with extra safety
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

    // Log for debugging
    debugLog("getBlogPosts called with options:", options, LogLevel.DEBUG)

    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (publishedOnly) {
      query = query.eq("published", true)
    }

    // Only apply category filter if it's a valid string
    if (category && isValidString(category)) {
      query = query.eq("category", category)
    }

    // Only apply location filter if it's a valid string
    if (locationSlug && isValidString(locationSlug)) {
      // Use a simpler approach to avoid potential issues
      query = query.eq("location_slug", locationSlug)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }

    // If tag is specified and is a valid string, filter the results in JavaScript
    if (tag && isValidString(tag) && data) {
      return data.filter((post) => {
        try {
          // Safely handle tags
          const postTags = post.tags || "[]"
          let tags = []

          if (typeof postTags === "string") {
            try {
              tags = JSON.parse(postTags)
            } catch {
              // If parsing fails, try to split by comma
              tags = postTags.split(",").map((t) => t.trim())
            }
          } else if (Array.isArray(postTags)) {
            tags = postTags
          }

          // Check if any tag includes our search tag
          return tags.some((t) => isValidString(t) && t.toLowerCase().includes(tag.toLowerCase()))
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

