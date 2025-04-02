"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import BlogCard from "@/components/blog-card"
import GuideCard from "@/components/guide-card"
import PropertyCard from "@/components/property-card"
import {
  Calendar,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Copy,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  BookMarked,
  Bookmark,
} from "lucide-react"

// Helper function to safely format category strings
function safeFormatCategory(category: any): string {
  if (typeof category !== "string" || category === null || category === undefined) {
    return "Guide"
  }

  try {
    return category.replace(/-/g, " ")
  } catch (e) {
    return "Guide"
  }
}

interface GuidePageClientProps {
  guide: {
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
    reading_time?: string | null
    [key: string]: any
  }
  relatedGuides: any[]
  relatedPosts: any[]
  relatedProperties: any[]
}

export default function GuidePageClient({
  guide,
  relatedGuides,
  relatedPosts,
  relatedProperties,
}: GuidePageClientProps) {
  const [activeTab, setActiveTab] = useState("content")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [estimatedReadTime, setEstimatedReadTime] = useState("5 min read")
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Process the image URL safely
  useEffect(() => {
    try {
      if (!guide.image_urls) {
        setSelectedImage(null)
        return
      }

      if (typeof guide.image_urls === "string") {
        // If it's a direct URL
        if (guide.image_urls.startsWith("http") || guide.image_urls.startsWith("/")) {
          setSelectedImage(guide.image_urls)
          return
        }

        // Try to parse as JSON
        try {
          const parsed = JSON.parse(guide.image_urls)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedImage(parsed[0])
            return
          }
        } catch {
          // If parsing fails, check if it's comma-separated
          if (guide.image_urls.includes(",")) {
            const urls = guide.image_urls
              .split(",")
              .map((url) => url.trim())
              .filter(Boolean)
            if (urls.length > 0) {
              setSelectedImage(urls[0])
              return
            }
          }

          // Just use as is
          setSelectedImage(guide.image_urls)
        }
      } else if (Array.isArray(guide.image_urls) && guide.image_urls.length > 0) {
        setSelectedImage(guide.image_urls[0])
      }
    } catch (error) {
      console.error("Error processing image URL:", error)
      setSelectedImage(null)
    }
  }, [guide.image_urls])

  // Calculate estimated read time if not provided
  useEffect(() => {
    if (guide.reading_time) {
      setEstimatedReadTime(guide.reading_time)
      return
    }

    try {
      // Strip HTML tags and count words
      const text = guide.body.replace(/<[^>]*>/g, "")
      const wordCount = text.split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200) // Assuming 200 words per minute
      setEstimatedReadTime(`${readingTime} min read`)
    } catch (error) {
      console.error("Error calculating read time:", error)
      setEstimatedReadTime("5 min read")
    }
  }, [guide.body, guide.reading_time])

  // Format the date
  const formattedDate = (() => {
    try {
      return new Date(guide.created_at).toLocaleDateString("en-US", {
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
      if (!guide.tags) return []

      if (typeof guide.tags === "string") {
        try {
          return JSON.parse(guide.tags)
        } catch {
          return guide.tags.split(",").map((tag) => tag.trim())
        }
      }

      if (Array.isArray(guide.tags)) {
        return guide.tags
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
      const matches = [...guide.body.matchAll(regex)]

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

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveTab("content")
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        setActiveSection(sectionId)
      }
    }, 100)
  }

  // Track active section on scroll
  useEffect(() => {
    if (!contentRef.current || tableOfContents.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -80% 0px" },
    )

    // Add IDs to headings in the content
    const contentElement = contentRef.current
    const headings = contentElement.querySelectorAll("h2, h3")

    headings.forEach((heading, index) => {
      const id = `section-${index}`
      heading.id = id
      observer.observe(heading)
    })

    return () => {
      headings.forEach((heading) => {
        observer.unobserve(heading)
      })
    }
  }, [tableOfContents, activeTab])

  // Default fallback image
  const fallbackImage = "/placeholder.svg?height=600&width=1200&text=Investment+Guide"

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 py-16 text-white">
        <div className="container">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">{safeFormatCategory(guide.category)}</Badge>
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{guide.title}</h1>
            <p className="mt-6 text-xl text-white/90">{guide.excerpt}</p>
            <div className="mt-8 flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{estimatedReadTime}</span>
              </div>
              {guide.location_slug && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <Link href={`/locations/${guide.location_slug}`} className="hover:underline">
                    {guide.location_slug}
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
          <Link href="/guides" className="hover:text-primary">
            Guides
          </Link>
          <span>/</span>
          <span className="text-foreground">{guide.title}</span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Sidebar - Table of Contents */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <Card className="border-2 border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookMarked className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">In This Guide</h3>
                  </div>

                  {tableOfContents.length > 0 ? (
                    <ul className="space-y-3">
                      {tableOfContents.map((item) => (
                        <li
                          key={item.id}
                          className={`${item.level === 3 ? "ml-4" : ""} ${
                            activeSection === item.id ? "text-primary font-medium" : ""
                          }`}
                        >
                          <button
                            onClick={() => scrollToSection(item.id)}
                            className="text-left flex items-start hover:text-primary transition-colors group w-full"
                          >
                            <ChevronRight
                              className={`h-4 w-4 mt-1 mr-1.5 flex-shrink-0 transition-transform ${
                                activeSection === item.id ? "text-primary" : "text-muted-foreground"
                              } group-hover:translate-x-0.5`}
                            />
                            <span className="line-clamp-2">{item.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No sections found in this guide.</p>
                  )}

                  <div className="mt-6 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4" />
                      <span>{copySuccess ? "Copied!" : "Share Guide"}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Why Trust This Guide</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                      <span className="text-sm">Written by real estate investment experts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                      <span className="text-sm">Based on current market data and trends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                      <span className="text-sm">Regularly updated with the latest information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                      <span className="text-sm">Practical advice from industry professionals</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {guide.location_slug && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">Related Location</h3>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Learn more about {guide.location_slug} and explore available properties.
                    </p>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/locations/${guide.location_slug}`}>View Location Guide</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/investments?location=${guide.location_slug}`}>Browse Properties</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            {/* Featured Image */}
            <div className="mb-8 overflow-hidden rounded-xl">
              {!imageError && selectedImage && (
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt={guide.title}
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
                  alt={guide.title}
                  className="w-full h-auto object-cover rounded-xl"
                />
              )}
            </div>

            {/* Guide Content */}
            <div
              ref={contentRef}
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: guide.body }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Link key={index} href={`/guides?tag=${tag}`}>
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
              <h3 className="mb-4 text-lg font-semibold">Share This Guide</h3>
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

            {/* Expert Advice CTA */}
            <div className="mb-12">
              <Card className="bg-gradient-to-r from-primary to-primary/80 text-white overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className="absolute top-0 right-0 opacity-10">
                    <Bookmark className="h-40 w-40 -rotate-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Need Personalized Investment Advice?</h3>
                  <p className="text-white/90 mb-6 max-w-xl">
                    Our team of investment advisors can provide tailored guidance based on your specific goals, budget,
                    and preferences. Schedule a consultation today.
                  </p>
                  <Button
                    className="bg-white text-primary hover:bg-white/90"
                    size="lg"
                    onClick={() => {
                      const trigger = document.getElementById("contact-modal-trigger")
                      if (trigger) trigger.click()
                    }}
                  >
                    Schedule a Consultation
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Related Guides */}
            {relatedGuides.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-bold">Related Guides</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {relatedGuides.map((relatedGuide, index) => (
                    <GuideCard key={index} {...relatedGuide} />
                  ))}
                </div>
              </div>
            )}

            {/* Related Blog Posts */}
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

            {/* Related Properties */}
            {relatedProperties.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-bold">Properties in {guide.location_slug}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {relatedProperties.map((property, index) => (
                    <PropertyCard key={index} {...property} />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" asChild>
                    <Link href={`/investments?location=${guide.location_slug}`} className="flex items-center">
                      View All Properties in {guide.location_slug}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-12 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/guides" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Guides</span>
                </Link>
              </Button>
              <Button
                onClick={() => {
                  const trigger = document.getElementById("contact-modal-trigger")
                  if (trigger) trigger.click()
                }}
              >
                Get Expert Advice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

