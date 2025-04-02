import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import GuidePageClient from "./GuidePageClient"
import { debugLog, LogLevel } from "@/lib/debug-utils"

interface GuidePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const supabase = createServerClient()

  try {
    // Use single() to ensure we get exactly one row or an error
    const { data: guide, error } = await supabase
      .from("blog_posts")
      .select("title, excerpt, meta_description")
      .eq("slug", params.slug)
      .eq("is_guide", true)
      .single()

    if (error || !guide) {
      return {
        title: "Guide Not Found",
        description: "The requested investment guide could not be found.",
      }
    }

    return {
      title: guide.title,
      description: guide.meta_description || guide.excerpt || "Expert investment guide",
    }
  } catch (error) {
    debugLog("Error generating metadata for guide:", error, LogLevel.ERROR)
    return {
      title: "Investment Guide",
      description: "Expert guidance for real estate investment decisions.",
    }
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const supabase = createServerClient()

  try {
    // Special case for the essential guide
    if (params.slug === "essential-guide-buying-property-spain-2025") {
      // If the guide doesn't exist in the database, create a fallback
      const { data: guide, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", params.slug)
        .eq("is_guide", true)
        .single()

      if (error || !guide) {
        // Create a fallback guide
        const fallbackGuide = {
          id: "essential-guide",
          title: "Essential Guide to Buying Property in Spain 2025",
          slug: "essential-guide-buying-property-spain-2025",
          excerpt: "Everything you need to know about buying property in Spain in 2025.",
          body: "<h2>Essential Guide to Buying Property in Spain</h2><p>This comprehensive guide covers everything you need to know about investing in Spanish real estate.</p>",
          category: "investment-guide",
          created_at: new Date().toISOString(),
          is_guide: true,
        }

        return <GuidePageClient guide={fallbackGuide} relatedGuides={[]} relatedPosts={[]} relatedProperties={[]} />
      }

      // If the guide exists, use it
      return <GuidePageClient guide={guide} relatedGuides={[]} relatedPosts={[]} relatedProperties={[]} />
    }

    // Normal guide fetching
    const { data: guide, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_guide", true)
      .single()

    if (error) {
      debugLog(`Error fetching guide: ${error.message}`, error, LogLevel.ERROR)
      notFound()
    }

    if (!guide) {
      debugLog(`Guide not found: ${params.slug}`, null, LogLevel.ERROR)
      notFound()
    }

    // Fetch related guides
    const { data: relatedGuides = [] } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, image_urls, created_at, reading_time, category")
      .neq("id", guide.id)
      .eq("is_guide", true)
      .eq("category", guide.category)
      .order("created_at", { ascending: false })
      .limit(2)

    // Fetch related blog posts
    const { data: relatedPosts = [] } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, image_urls, created_at, reading_time, category")
      .eq("is_guide", false)
      .eq("category", guide.category)
      .order("created_at", { ascending: false })
      .limit(3)

    // Fetch related properties if there's a location
    let relatedProperties = []
    if (guide.location_slug) {
      const { data: properties = [] } = await supabase
        .from("properties")
        .select("id, title, slug, price, city, province, bedrooms, bathrooms, area_sqm, hero_image_url, property_type")
        .eq("listing_status", "Active")
        .ilike("city", `%${guide.location_slug}%`)
        .limit(2)

      relatedProperties = properties
    }

    return (
      <GuidePageClient
        guide={guide}
        relatedGuides={relatedGuides}
        relatedPosts={relatedPosts}
        relatedProperties={relatedProperties}
      />
    )
  } catch (error) {
    debugLog(`Error in GuidePage: ${error}`, error, LogLevel.ERROR)
    notFound()
  }
}

