"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import BlogCard from "@/components/blog-card"
import PropertyCard from "@/components/property-card"
import { Calendar, Clock, MapPin, Facebook, Twitter, Linkedin, BookOpen, ArrowRight, Copy, Mail } from "lucide-react"
// Add the import for the MarketInsights component
import MarketInsights from "@/components/market-insights"

// Helper function to safely format category strings
function safeFormatCategory(category: any): string {
  if (typeof category !== "string" || category === null || category === undefined) {
    return "Article"
  }

  try {
    return category.replace(/-/g, " ")
  } catch (e) {
    return "Article"
  }
}

interface BlogPostPageClientProps {
  post: {
    id: string
    title: string
    slug: string
    category: string
    excerpt: string
    body: string
    image_urls: string | null
    location_slug?: string
    published: boolean
    created_at: string
    tags: any
    related_location_slug?: any
    reading_time?: string | null
    [key: string]: any
  }
  relatedPosts: any[]
  relatedProperties: any[]
  latestGuide?: any
}

export default function BlogPostPageClient({
  post,
  relatedPosts,
  relatedProperties,
  latestGuide = {
    title: "2024 Global Investment Guide",
    slug: "global-investment-guide-2024",
    excerpt: "Our comprehensive guide to international real estate investment opportunities.",
  },
}: BlogPostPageClientProps) {
  const [activeTab, setActiveTab] = useState("content")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [estimatedReadTime, setEstimatedReadTime] = useState("5 min read")

  // Process the image URL safely
  useEffect(() => {
    try {
      if (!post.image_urls) {
        setSelectedImage(null)
        return
      }

      if (typeof post.image_urls === "string") {
        // If it's a direct URL
        if (post.image_urls.startsWith("http") || post.image_urls.startsWith("/")) {
          setSelectedImage(post.image_urls)
          return
        }

        // Try to parse as JSON
        try {
          const parsed = JSON.parse(post.image_urls)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedImage(parsed[0])
            return
          }
        } catch {
          // If parsing fails, check if it's comma-separated
          if (post.image_urls.includes(",")) {
            const urls = post.image_urls
              .split(",")
              .map((url) => url.trim())
              .filter(Boolean)
            if (urls.length > 0) {
              setSelectedImage(urls[0])
              return
            }
          }

          // Just use as is
          setSelectedImage(post.image_urls)
        }
      } else if (Array.isArray(post.image_urls) && post.image_urls.length > 0) {
        setSelectedImage(post.image_urls[0])
      }
    } catch (error) {
      console.error("Error processing image URL:", error)
      setSelectedImage(null)
    }
  }, [post.image_urls])

  // Calculate estimated read time if not provided
  useEffect(() => {
    if (post.reading_time) {
      setEstimatedReadTime(post.reading_time)
      return
    }

    try {
      // Strip HTML tags and count words
      const text = post.body.replace(/<[^>]*>/g, "")
      const wordCount = text.split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200) // Assuming 200 words per minute
      setEstimatedReadTime(`${readingTime} min read`)
    } catch (error) {
      console.error("Error calculating read time:", error)
      setEstimatedReadTime("5 min read")
    }
  }, [post.body, post.reading_time])

  // Format the date
  const formattedDate = (() => {
    try {
      return new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Recent"
    }
  })()

  // Process tags safely
  const tags = (() => {
    try {
      if (!post.tags) return []

      if (typeof post.tags === "string") {
        try {
          return JSON.parse(post.tags)
        } catch {
          return post.tags.split(",").map((tag) => tag.trim())
        }
      }

      if (Array.isArray(post.tags)) {
        return post.tags
      }

      return []
    } catch (error) {
      console.error("Error processing tags:", error)
      return []
    }
  })()

  // Create table of contents from h2 and h3 tags in the body
  const tableOfContents = (() => {
    try {
      const regex = /<h([23])[^>]*>(.*?)<\/h\1>/g
      const matches = [...post.body.matchAll(regex)]

      return matches.map((match, index) => {
        const level = Number.parseInt(match[1])
        const title = match[2].replace(/<[^>]*>/g, "") // Remove any HTML tags inside the heading

        return {
          id: `section-${index}`,
          level,
          title,
        }
      })
    } catch (error) {
      console.error("Error creating table of contents:", error)
      return []
    }
  })()

  // Handle copy link
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error("Error copying link:", error)
    }
  }

  // Default fallback image
  const fallbackImage = "/placeholder.svg?height=600&width=1200&text=Market+Insights"

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 py-16 text-white">
        <div className="container">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">{safeFormatCategory(post.category)}</Badge>
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{post.title}</h1>
            <p className="mt-6 text-xl text-white/90">{post.excerpt}</p>
            <div className="mt-8 flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{estimatedReadTime}</span>
              </div>
              {post.location_slug && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <Link href={`/locations/${post.location_slug}`} className="hover:underline">
                    {post.location_slug}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <div className="container py-12">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
          <span>/</span>
          <span className="text-foreground">{post.title}</span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Featured Image */}
            <div className="mb-8 overflow-hidden rounded-xl">
              {!imageError && selectedImage && (
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-auto object-cover rounded-xl"
                  onError={() => {
                    console.log("Image failed to load, showing fallback")
                    setImageError(true)
                  }}
                />
              )}
              {(imageError || !selectedImage) && (
                <img
                  src={fallbackImage || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-auto object-cover rounded-xl"
                />
              )}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.body }} />

            {/* Share Button */}
            <div className="mb-12">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
                <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
              </Button>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Link key={index} href={`/blog?tag=${tag}`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mb-12">
              <h3 className="mb-4 text-lg font-semibold">Share This Article</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Share on Facebook</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Share on Twitter</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">Share on LinkedIn</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Share via Email</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy Link</span>
                </Button>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {relatedPosts.map((relatedPost, index) => (
                    <BlogCard key={index} {...relatedPost} />
                  ))}
                </div>
              </div>
            )}

            {/* Add Related Guides Section */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Investment Guides
              </h2>
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-muted overflow-hidden rounded-xl">
                <CardContent className="p-6">
                  <p className="text-lg mb-4">
                    Explore our comprehensive investment guides to deepen your knowledge and make informed decisions.
                  </p>
                  <Button asChild>
                    <Link href="/guides">Browse Investment Guides</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Related Properties */}
            {relatedProperties.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold">Properties in {post.location_slug}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {relatedProperties.map((property, index) => (
                    <PropertyCard key={index} {...property} />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" asChild>
                    <Link href={`/investments?location=${post.location_slug}`} className="flex items-center">
                      View All Properties in {post.location_slug}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold">Subscribe to Updates</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Get the latest market insights and investment opportunities delivered to your inbox.
                  </p>
                  <div className="space-y-4">
                    <Input placeholder="Your email address" />
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Add Market Insights component if location_slug exists */}
              {post.location_slug && <MarketInsights locationName={post.location_slug} variant="compact" />}

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold">Popular Categories</h3>
                  <div className="space-y-2">
                    {["investment-strategy", "market-analysis", "trends", "finance", "legal"].map((category) => (
                      <Link
                        key={category}
                        href={`/blog?category=${category}`}
                        className="flex items-center justify-between hover:text-primary"
                      >
                        <span>{safeFormatCategory(category)}</span>
                        <Badge variant="outline">{Math.floor(Math.random() * 10) + 1}</Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Investment Guide Card */}
              {latestGuide && (
                <Card className="overflow-hidden">
                  <div className="relative h-40 w-full bg-gradient-to-r from-primary to-primary/80">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white/50" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-2 bg-secondary text-secondary-foreground">Featured Guide</Badge>
                    <h4 className="text-lg font-semibold">{latestGuide.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{latestGuide.excerpt}</p>
                    <Button className="mt-4 w-full" asChild>
                      <Link href={`/guides/${latestGuide.slug}`}>
                        View Guide
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold">Need Expert Advice?</h3>
                  <p className="text-white/90 mb-6">
                    Speak with one of our investment advisors to discuss your specific requirements and goals.
                  </p>
                  <Button
                    className="w-full bg-white text-primary hover:bg-white/90"
                    onClick={() => {
                      const trigger = document.getElementById("contact-modal-trigger")
                      if (trigger) trigger.click()
                    }}
                  >
                    Contact an Advisor
                  </Button>
                </CardContent>
              </Card>

              {/* Location Link if available */}
              {post.location_slug && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-semibold">Explore {post.location_slug}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Discover more about this location and view available properties.
                    </p>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/locations/${post.location_slug}`}>Location Guide</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/investments?location=${post.location_slug}`}>View Properties</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

