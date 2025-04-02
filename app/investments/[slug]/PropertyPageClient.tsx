"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropertyCard from "@/components/property-card"
import BlogCard from "@/components/blog-card"
import GoogleMap from "@/components/google-map"
import MarketInsightsCard from "@/components/market-insights-card"
import { MapPin, Home, Maximize, BedDouble, Bath, Landmark, Banknote, Calendar } from "lucide-react"
import SafeImage from "@/components/safe-image"
import { debugLog, LogLevel } from "@/lib/debug-utils"

interface PropertyPageClientProps {
  property: {
    id: string
    slug: string
    title: string
    city: string
    province: string
    price: number
    currency?: string
    area_sqm: number
    bedrooms: number
    bathrooms: number
    hero_image_url: string | null | undefined
    gallery_image_urls?: string | null | undefined
    amenities?: string | null | undefined
    investment_tier?: string
    property_type: string
    description: string
    latitude?: string | number
    longitude?: string | number
    location_description?: string
    additional_details?: string
    year_built?: string | number
    estimated_rental?: number
    location_slug?: string
    [key: string]: any
  }
  similarProperties: any[]
  relatedPosts: any[]
  marketInsights?: any
}

export default function PropertyPageClient({
  property,
  similarProperties,
  relatedPosts,
  marketInsights,
}: PropertyPageClientProps) {
  // Log the component data for debugging
  debugLog(
    `PropertyPageClient rendering for ${property.title}`,
    { propertyId: property.id, hero_image_url: property.hero_image_url },
    LogLevel.DEBUG,
  )

  // Parse image gallery
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    if (property.gallery_image_urls) {
      try {
        if (typeof property.gallery_image_urls === "string") {
          if (property.gallery_image_urls.startsWith("[")) {
            const parsedImages = JSON.parse(property.gallery_image_urls)
            if (Array.isArray(parsedImages)) {
              setGalleryImages(parsedImages)
              return
            }
          } else if (property.gallery_image_urls.includes(",")) {
            setGalleryImages(property.gallery_image_urls.split(",").map((url: string) => url.trim()))
            return
          }
        }
        // If we get here, just use the URL as a single item
        setGalleryImages([property.gallery_image_urls])
      } catch (error) {
        debugLog(`Error parsing gallery images for property:`, error, LogLevel.ERROR)
        setGalleryImages([])
      }
    }
  }, [property.gallery_image_urls])

  // Parse amenities
  const [amenities, setAmenities] = useState<string[]>([])

  useEffect(() => {
    if (property.amenities) {
      try {
        if (typeof property.amenities === "string") {
          if (property.amenities.startsWith("[")) {
            const parsedAmenities = JSON.parse(property.amenities)
            if (Array.isArray(parsedAmenities)) {
              setAmenities(parsedAmenities)
              return
            }
          } else if (property.amenities.includes(",")) {
            setAmenities(property.amenities.split(",").map((amenity: string) => amenity.trim()))
            return
          }
        }
        // If we get here, just use the amenity as a single item
        setAmenities([property.amenities])
      } catch (error) {
        debugLog(`Error parsing amenities for property:`, error, LogLevel.ERROR)
        setAmenities([])
      }
    }
  }, [property.amenities])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: property.currency || "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const location = `${property.city}, ${property.province}`

  return (
    <div className="container py-12">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/investments" className="hover:text-primary">
          Investments
        </Link>
        <span>/</span>
        <span className="text-foreground">{property.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Property Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-secondary text-secondary-foreground">{property.property_type}</Badge>
              {property.investment_tier && (
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                  {property.investment_tier}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-bold md:text-4xl lg:text-5xl">{property.title}</h1>
            <p className="mt-4 text-3xl font-bold text-primary">{formatPrice(property.price)}</p>
          </div>

          {/* Property Gallery */}
          <div className="mb-8">
            <div className="overflow-hidden rounded-xl">
              <SafeImage
                src={galleryImages[activeImageIndex] || property.hero_image_url}
                alt={property.title}
                width={1200}
                height={800}
                className="w-full object-cover"
                componentName={`PropertyPageClient-${property.title}-Main`}
                fallbackIndex={0}
                priority
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-4">
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer overflow-hidden rounded-lg border-2 ${
                      index === activeImageIndex ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <SafeImage
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      width={200}
                      height={150}
                      className="h-20 w-full object-cover"
                      componentName={`PropertyPageClient-${property.title}-Thumb-${index}`}
                      fallbackIndex={0}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold">Property Details</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Maximize className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold">Area</h3>
                  <p className="text-muted-foreground">{property.area_sqm} m²</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <BedDouble className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold">Bedrooms</h3>
                  <p className="text-muted-foreground">{property.bedrooms}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Bath className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold">Bathrooms</h3>
                  <p className="text-muted-foreground">{property.bathrooms}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Calendar className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold">Year Built</h3>
                  <p className="text-muted-foreground">{property.year_built || "N/A"}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-lg text-muted-foreground">{property.description}</p>
                {property.additional_details && (
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">Additional Details</h3>
                    <p className="text-lg text-muted-foreground">{property.additional_details}</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="features" className="mt-6">
              <h3 className="mb-4 text-xl font-semibold">Amenities & Features</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="location" className="mt-6">
              <h3 className="mb-4 text-xl font-semibold">Location</h3>
              <div className="aspect-video overflow-hidden rounded-xl">
                {property.latitude && property.longitude ? (
                  <GoogleMap
                    latitude={Number.parseFloat(property.latitude)}
                    longitude={Number.parseFloat(property.longitude)}
                    zoom={15}
                    className="h-[400px] w-full"
                  />
                ) : (
                  <div className="flex h-[400px] w-full items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Map data not available</p>
                  </div>
                )}
              </div>
              {property.location_description && (
                <div className="mt-4">
                  <p className="text-lg text-muted-foreground">{property.location_description}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">Similar Properties</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {similarProperties.map((similarProperty) => (
                  <PropertyCard key={similarProperty.id} {...similarProperty} />
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {relatedPosts.map((post) => (
                  <BlogCard key={post.id} {...post} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-semibold">Investment Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-semibold">{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price per m²</span>
                    <span className="font-semibold">{formatPrice(Math.round(property.price / property.area_sqm))}</span>
                  </div>
                  {property.estimated_rental && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Est. Monthly Rental</span>
                      <span className="font-semibold">{formatPrice(property.estimated_rental)}</span>
                    </div>
                  )}
                  {property.estimated_rental && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Gross Rental Yield</span>
                      <span className="font-semibold">
                        {((property.estimated_rental * 12 * 100) / property.price).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-6 space-y-2">
                  <Button className="w-full">Request Information</Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      document.getElementById("contact-modal-trigger")?.click()
                    }}
                  >
                    Schedule Viewing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Market Insights Card */}
            {marketInsights ? (
              <MarketInsightsCard
                locationName={property.city}
                locationSlug={property.location_slug || property.city.toLowerCase().replace(/\s+/g, "-")}
                averagePrice={marketInsights.average_price_per_sqm}
                rentalYield={marketInsights.rental_yield}
                capitalGrowth={marketInsights.capital_growth_5yr}
                demandLevel={marketInsights.demand_level}
                currency={marketInsights.currency}
              />
            ) : (
              <MarketInsightsCard
                locationName={property.city}
                locationSlug={property.location_slug || property.city.toLowerCase().replace(/\s+/g, "-")}
              />
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-semibold">Financing Options</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Down Payment (30%)</span>
                      <span className="font-semibold">{formatPrice(property.price * 0.3)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Mortgage Amount</span>
                      <span className="font-semibold">{formatPrice(property.price * 0.7)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Est. Monthly Payment</span>
                      <span className="font-semibold">{formatPrice(property.price * 0.7 * 0.004)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Based on 30-year fixed rate mortgage at 3.5% interest
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    Mortgage Calculator
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-semibold">Property Manager</h3>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full">
                    <SafeImage
                      src="/placeholder.svg?height=100&width=100"
                      alt="Agent"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      componentName="PropertyManager"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Miacasa Property Management</p>
                    <p className="text-sm text-muted-foreground">Premium Property Services</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-primary" />
                    <span className="text-sm">Rental Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    <span className="text-sm">Property Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    <span className="text-sm">Legal & Administrative Support</span>
                  </div>
                </div>
                <Button
                  className="mt-6 w-full"
                  variant="outline"
                  onClick={() => {
                    document.getElementById("contact-modal-trigger")?.click()
                  }}
                >
                  Contact Property Manager
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

