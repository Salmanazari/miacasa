import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import BlogCard from "@/components/blog-card"
import { BookOpen } from "lucide-react"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  try {
    // Parse search parameters safely
    const category = typeof searchParams.category === "string" ? searchParams.category : undefined
    const tag = typeof searchParams.tag === "string" ? searchParams.tag : undefined
    const locationSlug = typeof searchParams.locationSlug === "string" ? searchParams.locationSlug : undefined

    // Build the query with proper error handling
    let query = supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false })

    // Apply filters if they exist
    if (category) {
      query = query.eq("category", category)
    }

    if (locationSlug) {
      query = query.eq("location_slug", locationSlug)
    }

    // Execute the query
    const { data: blogPosts = [], error: fetchError } = await query.limit(12)

    if (fetchError) {
      console.error("Error fetching blog posts:", fetchError)
      throw new Error("Failed to fetch blog posts")
    }

    // Filter by tag if needed (client-side filtering)
    let filteredPosts = blogPosts
    if (tag) {
      filteredPosts = blogPosts.filter((post) => {
        try {
          // Safely handle tags
          if (!post.tags) return false

          let tags = []
          if (typeof post.tags === "string") {
            try {
              // Try parsing as JSON
              tags = JSON.parse(post.tags)
            } catch {
              // If parsing fails, try comma-separated
              tags = post.tags.split(",").map((t) => t.trim())
            }
          } else if (Array.isArray(post.tags)) {
            tags = post.tags
          }

          // Check if any tag includes our search tag
          return tags.some(
            (t) => typeof t === "string" && typeof tag === "string" && t.toLowerCase().includes(tag.toLowerCase()),
          )
        } catch (e) {
          console.error("Error filtering by tag:", e)
          return false
        }
      })
    }

    // Get unique categories
    const categories = Array.from(
      new Set(blogPosts.map((post) => post.category).filter((cat) => typeof cat === "string" && cat.trim() !== "")),
    ).sort()

    // CURRENT LOGIC: Get a featured post randomly
    // This is where we select the featured post - currently it's random
    // We should check for an is_featured field instead

    // First check if any post has is_featured = true
    const explicitlyFeaturedPost = filteredPosts.find((post) => post.is_featured === true)

    // If no explicitly featured post, fall back to the most recent post
    const featuredPost = explicitlyFeaturedPost || (filteredPosts.length > 0 ? filteredPosts[0] : null)

    // Posts to display in the grid (excluding the featured post)
    const displayPosts = featuredPost
      ? filteredPosts.filter((post) => post.id !== featuredPost.id).slice(0, 6)
      : filteredPosts.slice(0, 6)

    // Format category for display
    const formatCategory = (cat) => {
      if (typeof cat !== "string" || !cat) return ""
      try {
        return cat.replace(/-/g, " ")
      } catch {
        return cat
      }
    }

    // Helper function to safely get image URL from post
    const getPostImageUrl = (post) => {
      if (!post) return "/placeholder.svg?height=300&width=500"

      try {
        // If image_urls is a string that looks like JSON, try to parse it
        if (
          typeof post.image_urls === "string" &&
          (post.image_urls.startsWith("[") || post.image_urls.startsWith("{"))
        ) {
          const parsed = JSON.parse(post.image_urls)

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
        if (typeof post.image_urls === "string" && post.image_urls.trim() !== "") {
          return post.image_urls
        }

        // If image_urls is an array
        if (Array.isArray(post.image_urls) && post.image_urls.length > 0) {
          return post.image_urls[0]
        }

        // If we have a featured_image field
        if (post.featured_image) {
          return post.featured_image
        }

        // If we have a thumbnail field
        if (post.thumbnail) {
          return post.thumbnail
        }

        // Fallback to placeholder
        return "/placeholder.svg?height=300&width=500"
      } catch (error) {
        console.error("Error parsing image URL:", error)
        return "/placeholder.svg?height=300&width=500"
      }
    }

    return (
      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Market Insights</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Expert analysis and guidance for informed investment decisions
          </p>
        </div>

        <div className="mb-12 flex flex-col gap-6 md:flex-row">
          <div className="w-full md:w-2/3">
            <Input placeholder="Search articles..." className="w-full" />
          </div>
          <div className="flex w-full flex-wrap gap-2 md:w-1/3">
            {categories.slice(0, 3).map((cat, index) => (
              <Button
                key={index}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                className="flex-grow"
                asChild
              >
                <Link href={category === cat ? "/blog" : `/blog?category=${cat}`}>{formatCategory(cat)}</Link>
              </Button>
            ))}
            {categories.length > 3 && (
              <Button variant="outline" size="sm" className="flex-grow">
                More
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {displayPosts.map((post, index) => (
                <BlogCard
                  key={index}
                  id={post.id || ""}
                  slug={post.slug || ""}
                  title={post.title || "Blog Post"}
                  excerpt={post.excerpt || ""}
                  image_urls={post.image_urls || null}
                  created_at={post.created_at || ""}
                  reading_time={post.reading_time || "5 min read"}
                  category={post.category || ""}
                  tags={post.tags || []}
                  location_slug={post.location_slug || ""}
                />
              ))}
            </div>

            {displayPosts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-semibold">No articles found</h3>
                <p className="mt-2 text-muted-foreground">Try adjusting your filters to see more results.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/blog">Clear Filters</Link>
                </Button>
              </div>
            )}

            {displayPosts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Button variant="outline" className="mx-2">
                  Previous
                </Button>
                <Button variant="outline" className="mx-2">
                  Next
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-xl font-semibold">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link href="/blog" className="text-muted-foreground hover:text-primary">
                    All
                  </Link>
                </div>
                {categories.map((cat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Link href={`/blog?category=${cat}`} className="text-muted-foreground hover:text-primary">
                      {formatCategory(cat)}
                    </Link>
                    <Badge variant="outline">{blogPosts.filter((post) => post.category === cat).length}</Badge>
                  </div>
                ))}
              </div>

              {/* Add Guides Link */}
              <div className="mt-4 pt-4 border-t">
                <Link href="/guides" className="flex items-center text-primary hover:underline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Investment Guides</span>
                </Link>
              </div>
            </div>

            {featuredPost && (
              <div>
                <h3 className="mb-4 text-xl font-semibold">Featured Article</h3>
                <div className="overflow-hidden rounded-xl border">
                  <Link href={`/blog/${featuredPost.slug || ""}`}>
                    <div className="relative h-48 w-full bg-muted">
                      {/* FIXED IMAGE DISPLAY */}
                      <img
                        src={getPostImageUrl(featuredPost) || "/placeholder.svg"}
                        alt={featuredPost.title || "Featured article"}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          console.error("Image failed to load, using fallback")
                          e.currentTarget.src = "/placeholder.svg?height=300&width=500"
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <Badge className="mb-2 bg-secondary text-secondary-foreground">Featured</Badge>
                      <h4 className="text-lg font-semibold">{featuredPost.title || "Featured Article"}</h4>
                      <p className="mt-2 text-sm text-muted-foreground">{featuredPost.excerpt || ""}</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            <div className="rounded-xl bg-muted p-6">
              <h3 className="mb-4 text-xl font-semibold">Subscribe to Updates</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Get the latest market insights and investment opportunities delivered to your inbox.
              </p>
              <div className="space-y-4">
                <Input placeholder="Your email address" />
                <Button className="w-full">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in BlogPage:", error)

    // Fallback UI in case of any error
    return (
      <div className="container py-12 text-center">
        <h1 className="text-4xl font-bold mb-6">Blog Posts Coming Soon</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We're currently preparing our blog content. Please check back soon for updates.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }
}

