import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import BlogPostPageClient from "./BlogPostPageClient"
import { debugLog, LogLevel } from "@/lib/debug-utils"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const supabase = createServerClient()

  try {
    // Check if this is a guide that should be redirected
    if (params.slug === "essential-guide-buying-property-spain-2025") {
      return {
        title: "Essential Guide to Buying Property in Spain 2025",
        description: "Everything you need to know about buying property in Spain in 2025.",
      }
    }

    // Use single() to ensure we get exactly one row or an error
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("title, excerpt, meta_description")
      .eq("slug", params.slug)
      .single()

    if (error || !post) {
      return {
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      }
    }

    return {
      title: post.title,
      description: post.meta_description || post.excerpt || "Read our latest blog post",
    }
  } catch (error) {
    debugLog("Error generating metadata for blog post:", error, LogLevel.ERROR)
    return {
      title: "Blog Post",
      description: "Read our latest blog post",
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createServerClient()

  // Check if this is a guide that should be redirected
  if (params.slug === "essential-guide-buying-property-spain-2025") {
    redirect("/guides/essential-guide-buying-property-spain-2025")
  }

  try {
    // Use single() to ensure we get exactly one row or an error
    const { data: post, error } = await supabase.from("blog_posts").select("*").eq("slug", params.slug).single()

    if (error) {
      debugLog(`Error fetching blog post: ${error.message}`, error, LogLevel.ERROR)
      notFound()
    }

    if (!post) {
      debugLog(`Blog post not found: ${params.slug}`, null, LogLevel.ERROR)
      notFound()
    }

    // Fetch related posts
    const { data: relatedPosts = [] } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, image_urls, created_at, reading_time, category")
      .neq("id", post.id)
      .eq("category", post.category)
      .order("created_at", { ascending: false })
      .limit(3)

    // Fetch related properties if there's a location
    let relatedProperties = []
    if (post.location_slug) {
      const { data: properties = [] } = await supabase
        .from("properties")
        .select("id, title, slug, price, city, province, bedrooms, bathrooms, area_sqm, hero_image_url, property_type")
        .eq("listing_status", "Active")
        .ilike("city", `%${post.location_slug}%`)
        .limit(2)

      relatedProperties = properties
    }

    // Fetch latest guide for sidebar
    const { data: latestGuide } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt")
      .eq("published", true)
      .eq("is_guide", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return (
      <BlogPostPageClient
        post={post}
        relatedPosts={relatedPosts}
        relatedProperties={relatedProperties}
        latestGuide={latestGuide || undefined}
      />
    )
  } catch (error) {
    debugLog(`Error in BlogPostPage: ${error}`, error, LogLevel.ERROR)
    notFound()
  }
}

