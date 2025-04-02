import type { Metadata } from "next"
import { getLocationBySlug, getChildLocations, getPropertiesByLocation, getBlogPosts } from "@/lib/api"
import LocationPageClient from "./LocationPageClient"
import { debugLog, LogLevel } from "@/lib/debug-utils"
import { sanitizeData, safeGet } from "@/lib/data-handler"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface LocationPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const location = await getLocationBySlug(params.slug)

  if (!location) {
    return {
      title: "Location Coming Soon | Miacasa Investment Properties",
      description: "This location information is currently being prepared. Check back soon for updates.",
    }
  }

  return {
    title: `${safeGet(location, "name", "Location")} | Miacasa Investment Properties`,
    description: safeGet(
      location,
      "description",
      "Discover this beautiful location with Miacasa Investment Properties.",
    ),
  }
}

export default async function LocationPage({ params }: LocationPageProps) {
  try {
    const location = await getLocationBySlug(params.slug)

    if (!location) {
      // Instead of notFound(), show a "coming soon" page
      return (
        <div className="container py-20 text-center">
          <h1 className="text-4xl font-bold mb-6">Location Coming Soon</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're currently preparing information about this location. Please check back soon for updates or explore our
            other available locations.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/locations">View All Locations</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/investments">Browse Properties</Link>
            </Button>
          </div>
        </div>
      )
    }

    // Log location data for debugging
    debugLog(
      `Location data for ${params.slug}:`,
      {
        id: safeGet(location, "id", ""),
        name: safeGet(location, "name", ""),
        lifestyle_tags_type: typeof location.lifestyle_tags,
      },
      LogLevel.DEBUG,
    )

    // IMPORTANT: Pre-process the data on the server side
    const sanitizedLocation = sanitizeData(location)

    // Get child locations and sanitize them
    const rawChildLocations = await getChildLocations(location.id)
    const childLocations = rawChildLocations.map(sanitizeData)

    // Get properties in this location and sanitize them
    const rawProperties = await getPropertiesByLocation(params.slug, 3)
    const properties = rawProperties.map(sanitizeData)

    // Get related blog posts and sanitize them
    const rawRelatedPosts = await getBlogPosts({
      limit: 2,
      locationSlug: params.slug,
    })
    const relatedPosts = rawRelatedPosts.map(sanitizeData)

    return (
      <LocationPageClient
        location={sanitizedLocation}
        childLocations={childLocations}
        properties={properties}
        relatedPosts={relatedPosts}
      />
    )
  } catch (error) {
    console.error(`Error in LocationPage for slug ${params.slug}:`, error)

    // Show a "coming soon" page instead of notFound()
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Location Coming Soon</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          We're currently preparing information about this location. Please check back soon for updates or explore our
          other available locations.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/locations">View All Locations</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/investments">Browse Properties</Link>
          </Button>
        </div>
      </div>
    )
  }
}

