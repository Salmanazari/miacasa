"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/property-card"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { supabase } from "@/lib/supabase"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState<any[]>([])
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "")
  const [selectedPropertyType, setSelectedPropertyType] = useState(searchParams.get("propertyType") || "")
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number.parseInt(searchParams.get("minPrice") || "0"),
    Number.parseInt(searchParams.get("maxPrice") || "20000000"),
  ])
  const [selectedBedrooms, setSelectedBedrooms] = useState(searchParams.get("bedrooms") || "")

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)

      let query = supabase.from("properties").select("*").eq("listing_status", "Active")

      // Apply filters
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      if (selectedLocation) {
        query = query.or(`city.ilike.%${selectedLocation}%,province.ilike.%${selectedLocation}%`)
      }

      if (selectedPropertyType) {
        query = query.eq("property_type", selectedPropertyType)
      }

      if (priceRange[0] > 0) {
        query = query.gte("price", priceRange[0])
      }

      if (priceRange[1] < 20000000) {
        query = query.lte("price", priceRange[1])
      }

      if (selectedBedrooms) {
        query = query.gte("bedrooms", Number.parseInt(selectedBedrooms))
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching properties:", error)
        setProperties([])
      } else {
        setProperties(data || [])

        // Extract unique property types and locations
        const types = [...new Set(data?.map((p) => p.property_type))].sort()
        setPropertyTypes(types)

        const locs = [...new Set(data?.map((p) => p.city))].sort()
        setLocations(locs)
      }

      setIsLoading(false)
    }

    fetchProperties()
  }, [searchQuery, selectedLocation, selectedPropertyType, priceRange, selectedBedrooms])

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("q", searchQuery)
    if (selectedLocation) params.set("location", selectedLocation)
    if (selectedPropertyType) params.set("propertyType", selectedPropertyType)
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 20000000) params.set("maxPrice", priceRange[1].toString())
    if (selectedBedrooms) params.set("bedrooms", selectedBedrooms)

    router.push(`/search?${params.toString()}`)
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedLocation("")
    setSelectedPropertyType("")
    setPriceRange([0, 20000000])
    setSelectedBedrooms("")

    router.push("/search")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Search Properties</h1>
        <p className="mt-4 text-xl text-muted-foreground">Find your perfect investment property</p>
      </div>

      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <select
                  id="propertyType"
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <select
                  id="bedrooms"
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                  <option value="6">6+</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <Label>
                Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </Label>
              <Slider
                value={priceRange}
                min={0}
                max={20000000}
                step={100000}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="mt-2"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">{isLoading ? "Loading..." : `Found ${properties.length} properties`}</p>
        <div className="flex items-center gap-2">
          <Label htmlFor="sort" className="text-sm">
            Sort by:
          </Label>
          <select
            id="sort"
            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            defaultValue="price-desc"
          >
            <option value="price-desc">Price (High to Low)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="newest">Newest</option>
            <option value="size-desc">Size (Largest)</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          {properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-semibold">No properties found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your filters to see more results.</p>
              <Button variant="outline" className="mt-4" onClick={handleReset}>
                Clear Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

