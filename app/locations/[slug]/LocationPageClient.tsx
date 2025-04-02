"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PropertyCard from "@/components/property-card"
import LocationCard from "@/components/location-card"
import BlogCard from "@/components/blog-card"
import GoogleMap from "@/components/google-map"
import { MapPin, Thermometer, Building, Landmark } from "lucide-react"
import SafeImage from "@/components/safe-image"
import { debugLog, LogLevel } from "@/lib/debug-utils"
import { isArray } from "@/lib/data-handler"
import MarketInsights from "@/components/market-insights"

interface LocationPageClientProps {
  location: {
    id: string
    name: string
    slug: string
    description: string
    image_urls: string | null
    region: string
    lifestyle_tags: string[] // Now guaranteed to be a string array
    latitude?: string | number
    longitude?: string | number
    population?: string
    climate?: string
    famous_for?: string
    bio?: string
    [key: string]: any
  }
  childLocations: any[]
  properties: any[]
  relatedPosts: any[]
}

export default function LocationPageClient({
  location,
  childLocations,
  properties,
  relatedPosts,
}: LocationPageClientProps) {
  // Log the component data for debugging
  debugLog(
    `LocationPageClient rendering for ${location.name}`,
    {
      locationId: location.id,
      lifestyle_tags_type: typeof location.lifestyle_tags,
      lifestyle_tags_is_array: isArray(location.lifestyle_tags),
    },
    LogLevel.DEBUG,
  )

  // Safely parse coordinates
  const latitude = Number.parseFloat(String(location.latitude || 0))
  const longitude = Number.parseFloat(String(location.longitude || 0))
  const hasValidCoordinates = !isNaN(latitude) && !isNaN(longitude) && latitude !== 0 && longitude !== 0

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full">
        <SafeImage
          src={location.image_urls}
          alt={location.name}
          fill
          className="object-cover"
          componentName={`LocationPageClient-${location.name}`}
          category="location"
          fallbackIndex={0}
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl font-bold md:text-6xl">{location.name}</h1>
          {location.region && (
            <div className="mt-6 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-xl">{location.region}</span>
            </div>
          )}
        </div>
      </section>

      <div className="container py-12">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/locations" className="hover:text-primary">
            Locations
          </Link>
          <span>/</span>
          <span className="text-foreground">{location.name}</span>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* Location Description */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl font-bold">About {location.name}</h2>
              <p className="text-lg text-muted-foreground">{location.description}</p>
              {location.bio && <p className="mt-4 text-lg text-muted-foreground">{location.bio}</p>}
            </div>

            {/* Quick Facts */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">Quick Facts</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {location.climate && (
                  <Card>
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <Thermometer className="h-8 w-8 text-primary" />
                      <h3 className="mt-4 font-semibold">Climate</h3>
                      <p className="text-muted-foreground">{location.climate}</p>
                    </CardContent>
                  </Card>
                )}
                {location.population && (
                  <Card>
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <Building className="h-8 w-8 text-primary" />
                      <h3 className="mt-4 font-semibold">Population</h3>
                      <p className="text-muted-foreground">{location.population}</p>
                    </CardContent>
                  </Card>
                )}
                {location.famous_for && (
                  <Card>
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <Landmark className="h-8 w-8 text-primary" />
                      <h3 className="mt-4 font-semibold">Famous For</h3>
                      <p className="text-muted-foreground">{location.famous_for}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">Location</h2>
              <div className="aspect-video overflow-hidden rounded-xl">
                {hasValidCoordinates ? (
                  <GoogleMap latitude={latitude} longitude={longitude} zoom={13} className="h-[400px] w-full" />
                ) : (
                  <div className="flex h-[400px] w-full items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Map data not available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Areas Within */}
            {childLocations.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-bold">Areas Within {location.name}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {childLocations.map((childLocation) => (
                    <LocationCard key={childLocation.id || `child-${Math.random()}`} {...childLocation} />
                  ))}
                </div>
              </div>
            )}

            {/* Properties in Location */}
            {properties.length > 0 && (
              <div className="mb-12">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Properties in {location.name}</h2>
                  <Button variant="outline" asChild>
                    <Link href={`/investments?location=${location.name}`}>View All</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {properties.map((property) => (
                    <PropertyCard key={property.id || `property-${Math.random()}`} {...property} />
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold">Articles About {location.name}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {relatedPosts.map((post) => (
                    <BlogCard key={post.id || `post-${Math.random()}`} {...post} />
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
                  <h3 className="mb-4 text-xl font-semibold">Investment Highlights</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 rounded-full bg-primary/10 p-1">
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
                      <span>Prime location in {location.region}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 rounded-full bg-primary/10 p-1">
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
                      <span>Strong rental demand year-round</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 rounded-full bg-primary/10 p-1">
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
                      <span>Stable property market with consistent growth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 rounded-full bg-primary/10 p-1">
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
                      <span>Excellent investment potential</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button
                      className="w-full"
                      onClick={() => {
                        const trigger = document.getElementById("contact-modal-trigger")
                        if (trigger) trigger.click()
                      }}
                    >
                      Speak to a Local Expert
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <MarketInsights locationId={location.id} locationName={location.name} />

              {/* Lifestyle Tags */}
              {location.lifestyle_tags && location.lifestyle_tags.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-semibold">Lifestyle</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.lifestyle_tags.map((tag, index) => (
                        <div key={index} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                          {tag}
                        </div>
                      ))}
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

