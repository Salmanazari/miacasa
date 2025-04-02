"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import GuideCard from "@/components/guide-card"
import { BookOpen, Search } from "lucide-react"

export default async function GuidesPage({
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
    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .eq("is_guide", true)
      .order("created_at", { ascending: false })

    // Apply filters if they exist
    if (category) {
      query = query.eq("category", category)
    }

    if (locationSlug) {
      query = query.eq("location_slug", locationSlug)
    }

    // Execute the query
    const { data: guides = [], error: fetchError } = await query.limit(100)

    if (fetchError) {
      console.error("Error fetching guides:", fetchError)
      throw new Error("Failed to fetch guides")
    }

    // Get unique categories
    const categories = Array.from(
      new Set(guides.map((guide) => guide.category).filter((cat) => typeof cat === "string" && cat.trim() !== "")),
    ).sort()

    // Get featured guides (first 2)
    const featuredGuides = guides.slice(0, 2)

    // Get remaining guides
    const remainingGuides = guides.slice(2)

    // Format category for display
    const formatCategory = (cat) => {
      if (typeof cat !== "string" || !cat) return ""
      try {
        return cat.replace(/-/g, " ")
      } catch {
        return cat
      }
    }

    // Define popular topics
    const popularTopics = [
      {
        title: "Getting Started with Real Estate",
        category: "beginner",
        icon: <BookOpen className="mr-2 h-4 w-4" />,
      },
      {
        title: "Financing Your Investment",
        category: "financing",
        icon: <BookOpen className="mr-2 h-4 w-4" />,
      },
      {
        title: "Tax Considerations",
        category: "tax",
        icon: <BookOpen className="mr-2 h-4 w-4" />,
      },
      {
        title: "Market Analysis",
        category: "market-analysis",
        icon: <BookOpen className="mr-2 h-4 w-4" />,
      },
    ]

    return (
      <div>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-primary/80 py-20 text-white">
          <div className="container">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-secondary text-secondary-foreground">Investment Education</Badge>
              <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Investment Guides & Resources</h1>
              <p className="mt-6 text-xl text-white/90">
                Expert knowledge and insights to help you navigate the real estate investment landscape with confidence.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link href="#featured-guides">Explore Guides</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-transparent text-white hover:bg-white hover:text-primary"
                  onClick={() => {
                    document.getElementById("contact-modal-trigger")?.click()
                  }}
                >
                  Get Personalized Advice
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
        </section>

        <div className="container py-12">
          {/* Search and Filter */}
          <div className="mb-12 flex flex-col gap-6 md:flex-row">
            <div className="w-full md:w-2/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input placeholder="Search guides..." className="pl-10 pr-4 py-6 text-base rounded-xl" />
              </div>
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
                  <Link href={category === cat ? "/guides" : `/guides?category=${cat}`}>{formatCategory(cat)}</Link>
                </Button>
              ))}
              {categories.length > 3 && (
                <Button variant="outline" size="sm" className="flex-grow">
                  More
                </Button>
              )}
            </div>
          </div>

          {/* Featured Guides */}
          <section id="featured-guides" className="mb-16">
            <div className="mb-8 flex items-center">
              <BookOpen className="mr-2 h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Featured Guides</h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {featuredGuides.map((guide, index) => (
                <GuideCard
                  key={index}
                  id={guide.id || ""}
                  slug={guide.slug || ""}
                  title={guide.title || "Guide"}
                  excerpt={guide.excerpt || ""}
                  image_urls={guide.image_urls || null}
                  created_at={guide.created_at || ""}
                  reading_time={guide.reading_time || "5 min read"}
                  category={guide.category || ""}
                  featured={true}
                  size="large"
                />
              ))}
            </div>
          </section>

          {/* All Guides */}
          <section>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">All Investment Guides</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="beginner">Beginner Friendly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {remainingGuides.map((guide, index) => (
                <GuideCard
                  key={index}
                  id={guide.id || ""}
                  slug={guide.slug || ""}
                  title={guide.title || "Guide"}
                  excerpt={guide.excerpt || ""}
                  image_urls={guide.image_urls || null}
                  created_at={guide.created_at || ""}
                  reading_time={guide.reading_time || "5 min read"}
                  category={guide.category || ""}
                />
              ))}
            </div>

            {remainingGuides.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-semibold">No guides found</h3>
                <p className="mt-2 text-muted-foreground">Try adjusting your filters to see more results.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/guides">Clear Filters</Link>
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in GuidesPage:", error)

    return (
      <div className="container py-12 text-center">
        <h1 className="text-4xl font-bold mb-6">Guides Coming Soon</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We're currently preparing our investment guides. Please check back soon.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }
}

