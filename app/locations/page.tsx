"use client"
import { Button } from "@/components/ui/button"
import LocationCard from "@/components/location-card"
import { getLocations, getProperties } from "@/lib/api"
import { debugLog, LogLevel } from "@/lib/debug-utils"

export const revalidate = 3600 // Revalidate at most every hour

export default async function LocationsPage() {
  // Fetch parent locations only
  const locations = await getLocations({
    parentOnly: true,
    includeChildren: false, // Don't include children
  })

  // Log locations data for debugging
  debugLog(
    "Locations data:",
    locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
      image_urls_type: typeof loc.image_urls,
    })),
    LogLevel.DEBUG,
  )

  // Create a simplified version of locations data
  const processedLocations = locations.map((location) => ({
    id: location.id || "",
    name: location.name || "Location",
    slug: location.slug || "",
    description: location.description || "",
    image_urls: location.image_urls || null,
  }))

  // Get property counts for each location
  const locationWithCounts = await Promise.all(
    processedLocations.map(async (location) => {
      const properties = await getProperties({
        location: location.name,
        limit: 1,
      })

      return {
        ...location,
        propertyCount: properties.length,
      }
    }),
  )

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Investment Locations</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Discover premium real estate opportunities in the world's most desirable destinations
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {locationWithCounts.map((location) => (
          <LocationCard key={location.id} {...location} />
        ))}
      </div>

      <div className="mt-16 rounded-3xl bg-muted p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">Looking for a Specific Location?</h2>
        <p className="mt-4 text-muted-foreground">
          Our global network spans over 40 countries. Contact us to find investment opportunities in your desired
          location.
        </p>
        <Button
          size="lg"
          className="mt-6"
          onClick={() => {
            document.getElementById("contact-modal-trigger")?.click()
          }}
        >
          Contact Our Team
        </Button>
      </div>
    </div>
  )
}

