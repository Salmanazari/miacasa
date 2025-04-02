"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  Briefcase,
  MessageSquare,
  Award,
  Building,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  BookOpen,
  ArrowRight,
  FileText,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import PropertyCard from "@/components/property-card"
import { debugLog, LogLevel } from "@/lib/debug-utils"

interface PartnerDetailProps {
  partner: any // Using any for now, but ideally would have a proper type
}

export function PartnerDetail({ partner }: PartnerDetailProps) {
  const [activeTab, setActiveTab] = useState("about")
  const [properties, setProperties] = useState([])
  const [articles, setArticles] = useState([])
  const [essentialGuide, setEssentialGuide] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Parse JSON strings if needed
  const specialties = parseJsonField(partner.specialties)
  const languages = parseJsonField(partner.languages_spoken)
  const notableProjects = parseJsonField(partner.notable_projects)
  const socialLinks = parseJsonField(partner.social_links)

  // Format phone number for display
  const formattedPhone = partner.phone?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4")

  // Fetch properties, articles, and essential guide
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const supabase = createClient()

        // Fetch latest properties from the investments page - LIMIT TO 2
        const { data: latestProperties, error: propertiesError } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(2)

        if (propertiesError) {
          debugLog("Error fetching properties:", propertiesError, LogLevel.ERROR)
        }

        // Fetch essential guide
        const { data: guide, error: guideError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", "essential-guide-buying-property-spain-2025")
          .single()

        if (guideError) {
          debugLog("Error fetching essential guide:", guideError, LogLevel.ERROR)
        }

        // Fetch latest blog articles - with proper error handling for dates
        const { data: latestArticles, error: articlesError } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, image_urls, created_at, reading_time, category")
          .neq("slug", "essential-guide-buying-property-spain-2025") // Exclude the essential guide
          .order("created_at", { ascending: false })
          .limit(3)

        if (articlesError) {
          debugLog("Error fetching articles:", articlesError, LogLevel.ERROR)
        }

        setProperties(latestProperties || [])
        setEssentialGuide(guide || null)

        // Process articles to ensure valid dates
        const processedArticles = (latestArticles || []).map((article) => {
          // Ensure created_at is a valid date string
          let validCreatedAt = article.created_at
          try {
            // Test if it's a valid date
            new Date(article.created_at).toISOString()
          } catch (e) {
            // If not valid, use current date
            validCreatedAt = new Date().toISOString()
            debugLog(`Invalid date for article ${article.id}, using current date instead`, LogLevel.WARN)
          }

          return {
            ...article,
            created_at: validCreatedAt,
          }
        })

        setArticles(processedArticles)
      } catch (error) {
        debugLog("Unexpected error fetching data:", error, LogLevel.ERROR)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      {/* ESSENTIAL GUIDE BANNER - Always visible at the top */}
      <Card className="mb-8 overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Essential Guide to Buying Property in Spain 2025</h3>
                <p className="text-sm text-gray-600">
                  Everything you need to know before investing in Spanish real estate
                </p>
              </div>
            </div>
            <Link
              href="/guides/essential-guide-buying-property-spain-2025"
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              Read the guide
              <ArrowRight size={16} />
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <Image
                src={partner.profile_image_url || "/placeholder.svg?height=600&width=600"}
                alt={partner.contact_name || partner.partner_name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
              {partner.badge && (
                <Badge className="absolute top-4 right-4 z-10 bg-primary text-white px-3 py-1">{partner.badge}</Badge>
              )}
            </div>

            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{partner.partner_name}</h1>
                <span className="text-3xl">{partner.flag_emoji}</span>
              </div>

              <h2 className="text-lg font-medium text-gray-700 mb-4">{partner.contact_name}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-3 text-primary flex-shrink-0" />
                  <span>
                    {partner.city}, {partner.country_name}
                  </span>
                </div>

                {partner.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail size={18} className="mr-3 text-primary flex-shrink-0" />
                    <a href={`mailto:${partner.email}`} className="hover:text-primary transition-colors">
                      {partner.email}
                    </a>
                  </div>
                )}

                {partner.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone size={18} className="mr-3 text-primary flex-shrink-0" />
                    <a href={`tel:${partner.phone}`} className="hover:text-primary transition-colors">
                      {partner.phone}
                    </a>
                  </div>
                )}

                {partner.website_url && (
                  <div className="flex items-center text-gray-600">
                    <Globe size={18} className="mr-3 text-primary flex-shrink-0" />
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {new URL(partner.website_url).hostname.replace("www.", "")}
                    </a>
                  </div>
                )}

                {partner.years_experience && (
                  <div className="flex items-center text-gray-600">
                    <Briefcase size={18} className="mr-3 text-primary flex-shrink-0" />
                    <span>{partner.years_experience} years experience</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {socialLinks && Object.keys(socialLinks).length > 0 && (
                <div className="flex flex-wrap gap-3 mt-6">
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube size={20} />
                    </a>
                  )}
                </div>
              )}

              <div className="mt-8">
                <Button className="w-full">Contact {partner.contact_name.split(" ")[0]}</Button>
              </div>
            </CardContent>
          </Card>

          {/* Essential Guide Card - Also in sidebar for extra visibility */}
          <Card className="mt-6 overflow-hidden border-primary/20">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary">
                <BookOpen size={20} />
                <h3 className="font-semibold">Essential Guide</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <h4 className="font-bold text-lg mb-2">
                {essentialGuide?.title || "Essential Guide to Buying Property in Spain 2025"}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {essentialGuide?.excerpt || "Everything you need to know about buying property in Spain in 2025."}
              </p>
              <Link
                href="/guides/essential-guide-buying-property-spain-2025"
                className="flex items-center text-primary hover:underline text-sm font-medium"
              >
                Read the guide
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="specialties">Expertise</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About {partner.partner_name}</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-6">{partner.description}</p>

                    {languages && languages.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                          <MessageSquare size={18} className="mr-2 text-primary" />
                          Languages Spoken
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {languages.map((language: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {partner.video_intro_url && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-3">Meet {partner.contact_name}</h3>
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <iframe
                            src={getEmbedUrl(partner.video_intro_url)}
                            title={`Video introduction by ${partner.contact_name}`}
                            className="absolute top-0 left-0 w-full h-full"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specialties" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Areas of Expertise</h2>

                  {specialties && specialties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {specialties.map((specialty: string, index: number) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-5">
                            <div className="flex items-start">
                              <Award className="text-primary mr-3 mt-1 flex-shrink-0" />
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{specialty}</h3>
                                <p className="text-gray-600 text-sm">
                                  Expert guidance in {specialty.toLowerCase()} investments across Spain.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No specialties listed for this partner.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Notable Projects</h2>

                  {notableProjects && notableProjects.length > 0 ? (
                    <div className="space-y-6">
                      {notableProjects.map((project: string, index: number) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-5">
                            <div className="flex items-start">
                              <Building className="text-primary mr-3 mt-1 flex-shrink-0" />
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{project}</h3>
                                <p className="text-gray-600 text-sm">
                                  Successfully managed and completed this prestigious project.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No notable projects listed for this partner.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Our Portfolio Section - UPDATED FOR 2 CARDS */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Our Portfolio</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-64 bg-gray-200 animate-pulse"></div>
                    <CardContent className="p-4">
                      <div className="h-6 bg-gray-200 animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 animate-pulse w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {properties.map((property) => (
                  <div key={property.id} className="h-full">
                    <PropertyCard
                      id={property.id}
                      slug={property.slug}
                      title={property.title}
                      city={property.city}
                      province={property.province}
                      price={property.price}
                      currency={property.currency}
                      area_sqm={property.area_sqm}
                      bedrooms={property.bedrooms}
                      bathrooms={property.bathrooms}
                      hero_image_url={property.image_urls || property.hero_image_url}
                      images={property.additional_images}
                      investment_tier={property.investment_tier}
                      property_type={property.property_type}
                      is_featured={property.is_featured}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No properties available at the moment.</p>
                </CardContent>
              </Card>
            )}
            <div className="mt-6 text-center">
              <Link href="/investments" className="text-primary hover:underline">
                View all properties
              </Link>
            </div>
          </div>

          {/* Latest Blog Articles Section - WITH FIXED DATE HANDLING */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <CardContent className="p-4">
                      <div className="h-6 bg-gray-200 animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 animate-pulse w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No articles available at the moment.</p>
                </CardContent>
              </Card>
            )}
            <div className="mt-4 text-center">
              <Link href="/blog" className="text-primary hover:underline">
                View all articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Article Card Component with robust date handling
function ArticleCard({ article }: { article: any }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    // Parse image URLs
    try {
      if (article.image_urls) {
        if (typeof article.image_urls === "string") {
          try {
            // Try to parse as JSON
            const parsed = JSON.parse(article.image_urls)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setImageUrl(parsed[0])
            } else if (typeof parsed === "string") {
              setImageUrl(parsed)
            }
          } catch {
            // If not JSON, use as is
            setImageUrl(article.image_urls)
          }
        } else if (Array.isArray(article.image_urls) && article.image_urls.length > 0) {
          setImageUrl(article.image_urls[0])
        }
      }
    } catch (error) {
      console.error("Error parsing article image:", error)
    }
  }, [article])

  // Format date with robust error handling
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Recent"
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Recent"
    }
  }

  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={imageUrl || "/placeholder.svg?height=300&width=500"}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              console.error("Image failed to load, using fallback")
              e.currentTarget.src = "/placeholder.svg?height=300&width=500"
            }}
          />
          {article.category && (
            <div className="absolute top-0 left-0 bg-secondary text-secondary-foreground px-3 py-1 m-3 rounded-md text-xs">
              {article.category}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{article.title}</h3>
          {article.excerpt && <p className="text-gray-600 text-sm mb-2 line-clamp-2">{article.excerpt}</p>}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>{formatDate(article.created_at)}</span>
            <span>{article.reading_time || "5 min read"}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Helper function to parse JSON fields
function parseJsonField(field: any) {
  if (!field) return null

  if (typeof field === "string") {
    try {
      // Handle PostgreSQL array format like "{item1,item2}"
      if (field.startsWith("{") && field.endsWith("}")) {
        return field
          .slice(1, -1)
          .split(",")
          .map((item) => item.replace(/^"|"$/g, "").trim())
      }

      return JSON.parse(field)
    } catch (e) {
      return field
    }
  }

  return field
}

// Helper function to convert video URLs to embed URLs
function getEmbedUrl(url: string) {
  if (!url) return ""

  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop()
    return `https://www.youtube.com/embed/${videoId}`
  }

  // Vimeo
  if (url.includes("vimeo.com")) {
    const videoId = url.split("/").pop()
    return `https://player.vimeo.com/video/${videoId}`
  }

  return url
}

