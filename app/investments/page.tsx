import Link from "next/link"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/property-card"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { getProperties, getLocations } from "@/lib/api"
import { Search, MapPin, Home, Euro, BedDouble, Maximize, Filter, X, Tag, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { investmentTiers } from "@/components/investment-tier-guide"

export const revalidate = 3600 // Revalidate at most every hour

export default async function InvestmentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search parameters
  const location = typeof searchParams.location === "string" ? searchParams.location : undefined
  const propertyType = typeof searchParams.propertyType === "string" ? searchParams.propertyType : undefined
  const minPrice = typeof searchParams.minPrice === "string" ? Number.parseInt(searchParams.minPrice) : undefined
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number.parseInt(searchParams.maxPrice) : undefined
  const bedrooms = typeof searchParams.bedrooms === "string" ? Number.parseInt(searchParams.bedrooms) : undefined
  const bathrooms = typeof searchParams.bathrooms === "string" ? Number.parseInt(searchParams.bathrooms) : undefined
  const minArea = typeof searchParams.minArea === "string" ? Number.parseInt(searchParams.minArea) : undefined
  const maxArea = typeof searchParams.maxArea === "string" ? Number.parseInt(searchParams.maxArea) : undefined
  const minPlot = typeof searchParams.minPlot === "string" ? Number.parseInt(searchParams.minPlot) : undefined
  const maxPlot = typeof searchParams.maxPlot === "string" ? Number.parseInt(searchParams.maxPlot) : undefined
  const investmentTier = typeof searchParams.investmentTier === "string" ? searchParams.investmentTier : undefined
  const features =
    typeof searchParams.features === "string"
      ? searchParams.features.split(",")
      : Array.isArray(searchParams.features)
        ? searchParams.features
        : []
  const transactionType = typeof searchParams.transactionType === "string" ? searchParams.transactionType : undefined
  const developmentType = typeof searchParams.developmentType === "string" ? searchParams.developmentType : undefined
  const availability = typeof searchParams.availability === "string" ? searchParams.availability : undefined
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : "price-desc"

  // Fetch properties based on search parameters
  const properties = await getProperties({
    limit: 12,
    location,
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minArea,
    maxArea,
    minPlot,
    maxPlot,
    investmentTier,
    features: features.length > 0 ? features : undefined,
    transactionType,
    developmentType,
    availability,
    sortBy,
  })

  // Fetch locations for the location filter
  const locations = await getLocations({ includeChildren: true })

  // Process locations to handle parent/child relationships
  const processLocations = () => {
    // Group by parent/child
    const parentLocations = locations.filter((loc) => !loc.parent_id)
    const childLocations = locations.filter((loc) => loc.parent_id)

    // Group children by parent
    const locationTree = parentLocations.map((parent) => {
      const children = childLocations.filter((child) => child.parent_id === parent.id)
      return {
        ...parent,
        children,
      }
    })

    return locationTree
  }

  const locationTree = processLocations()

  // Get unique property types for filter
  // Property types based on provided list
  const propertyTypes = [
    "Villa/Luxury Home",
    "Apartment/Condo",
    "Penthouse",
    "Studio",
    "Townhouse/Semi-Detached",
    "Duplex/Triplex",
    "Rural/Country Property",
    "Finca",
    "Plot/Land",
    "Commercial Property",
    "Hotel/Hospitality",
    "Development Project",
    "Ground Floor Apartment",
    "Beachfront Property",
  ]

  // Essential features that most users care about
  const essentialFeatures = [
    "Air Conditioning",
    "Central Heating",
    "Private Pool",
    "Sea Views",
    "Mountain Views",
    "Garden",
    "Terrace",
    "Balcony",
    "Private Garage",
    "Beachfront",
    "Fully Furnished",
    "Smart Home System",
    "24-hour Security",
    "Gated Community",
  ]

  // Luxury features for premium properties
  const luxuryFeatures = [
    "Infinity Pool",
    "Home Theater",
    "Wine Cellar",
    "Spa Facilities",
    "Elevator/Lift",
    "Underfloor Heating",
    "Rooftop Terrace",
    "Tennis Court",
    "Golf Front",
    "Yacht Berth",
    "Designer Kitchen",
    "Home Office",
  ]

  // Transaction types
  const transactionTypes = ["For Sale", "For Rent", "For Sale & Rent"]

  // Development types
  const developmentTypes = ["New Build", "Renovated", "Resale", "Off-Plan"]

  // Availability statuses
  const availabilityStatuses = ["Available Now", "Coming Soon", "Reserved", "Sold"]

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Investment Properties</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Discover exceptional real estate opportunities with strong appreciation potential
        </p>
      </div>

      {/* Investment Tiers Information */}
      <div className="mb-12 bg-gradient-to-r from-background to-muted/30 rounded-xl p-6 border border-muted">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Investment Tier Classification</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {investmentTiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-background rounded-lg p-4 shadow-sm border border-muted hover:border-secondary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge className={tier.badgeClassName}>{tier.name}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden mb-6">
        <div className="relative">
          <Input placeholder="Search by location, property type..." className="pl-10 pr-12 py-6 text-base rounded-xl" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Properties</SheetTitle>
                <SheetDescription>Refine your search to find your perfect investment</SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  {/* Location Filter */}
                  <AccordionItem value="location">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Location</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <Select defaultValue={location}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            <SelectItem value="all">All Locations</SelectItem>
                            {locationTree.map((parent) => (
                              <div key={parent.id || parent.name}>
                                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                  {parent.name}
                                </div>
                                <SelectItem value={parent.name}>{parent.name} (All)</SelectItem>
                                {parent.children &&
                                  parent.children.map((child) => (
                                    <SelectItem key={child.id || child.name} value={child.name} className="pl-4">
                                      {child.name}
                                    </SelectItem>
                                  ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Price Range Filter */}
                  <AccordionItem value="price">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4" />
                        <span>Price Range</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                          <Input type="number" placeholder="Min €" className="w-[45%]" defaultValue={minPrice} />
                          <span className="text-muted-foreground">to</span>
                          <Input type="number" placeholder="Max €" className="w-[45%]" defaultValue={maxPrice} />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Property Type Filter */}
                  <AccordionItem value="propertyType">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>Property Type</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {/* Residential Properties */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="mobile-type-residential" />
                            <label
                              htmlFor="mobile-type-residential"
                              className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Residential
                            </label>
                          </div>
                          <div className="ml-6 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="mobile-type-villa" defaultChecked={propertyType === "Villa/Luxury Home"} />
                              <label
                                htmlFor="mobile-type-villa"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Villa/Luxury Home
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mobile-type-apartment"
                                defaultChecked={propertyType === "Apartment/Condo"}
                              />
                              <label
                                htmlFor="mobile-type-apartment"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Apartment/Condo
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="mobile-type-penthouse" defaultChecked={propertyType === "Penthouse"} />
                              <label
                                htmlFor="mobile-type-penthouse"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Penthouse
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="mobile-type-studio" defaultChecked={propertyType === "Studio"} />
                              <label
                                htmlFor="mobile-type-studio"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Studio
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Rural Properties */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="mobile-type-rural" />
                            <label
                              htmlFor="mobile-type-rural"
                              className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Rural
                            </label>
                          </div>
                          <div className="ml-6 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mobile-type-country"
                                defaultChecked={propertyType === "Rural/Country Property"}
                              />
                              <label
                                htmlFor="mobile-type-country"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Country Property
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="mobile-type-finca" defaultChecked={propertyType === "Finca"} />
                              <label
                                htmlFor="mobile-type-finca"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Finca
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Commercial & Investment */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="mobile-type-commercial" />
                            <label
                              htmlFor="mobile-type-commercial"
                              className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Commercial & Investment
                            </label>
                          </div>
                          <div className="ml-6 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mobile-type-commercial-property"
                                defaultChecked={propertyType === "Commercial Property"}
                              />
                              <label
                                htmlFor="mobile-type-commercial-property"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Commercial Property
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mobile-type-development"
                                defaultChecked={propertyType === "Development Project"}
                              />
                              <label
                                htmlFor="mobile-type-development"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Development Project
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Bedrooms & Bathrooms Filter */}
                  <AccordionItem value="rooms">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <BedDouble className="h-4 w-4" />
                        <span>Bedrooms & Bathrooms</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label className="mb-2 block">Bedrooms</Label>
                          <div className="flex flex-wrap gap-2">
                            {[0, 1, 2, 3, 4, 5, "6+"].map((num) => (
                              <Button
                                key={num}
                                variant={bedrooms === num ? "default" : "outline"}
                                className="h-9 w-12"
                                size="sm"
                              >
                                {num}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block">Bathrooms</Label>
                          <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, "6+"].map((num) => (
                              <Button
                                key={num}
                                variant={bathrooms === num ? "default" : "outline"}
                                className="h-9 w-12"
                                size="sm"
                              >
                                {num}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Area & Plot Size Filter */}
                  <AccordionItem value="size">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Maximize className="h-4 w-4" />
                        <span>Area & Plot Size</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label className="mb-2 block">Living Area (m²)</Label>
                          <div className="flex justify-between items-center">
                            <Input type="number" placeholder="Min" className="w-[45%]" defaultValue={minArea} />
                            <span className="text-muted-foreground">to</span>
                            <Input type="number" placeholder="Max" className="w-[45%]" defaultValue={maxArea} />
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block">Plot Size (m²)</Label>
                          <div className="flex justify-between items-center">
                            <Input type="number" placeholder="Min" className="w-[45%]" defaultValue={minPlot} />
                            <span className="text-muted-foreground">to</span>
                            <Input type="number" placeholder="Max" className="w-[45%]" defaultValue={maxPlot} />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Investment Tier Filter */}
                  <AccordionItem value="investmentTier">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>Investment Tier</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {investmentTiers.map((tier) => (
                          <div key={tier.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-tier-${tier.name.toLowerCase().replace(" ", "-")}`}
                              defaultChecked={investmentTier === tier.name}
                            />
                            <label
                              htmlFor={`mobile-tier-${tier.name.toLowerCase().replace(" ", "-")}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {tier.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Features Filter */}
                  <AccordionItem value="features">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <span>Features & Amenities</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label className="mb-2 block">Essential Features</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {essentialFeatures.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`mobile-feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                                  defaultChecked={features.includes(feature)}
                                />
                                <label
                                  htmlFor={`mobile-feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {feature}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block">Luxury Features</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {luxuryFeatures.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`mobile-feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                                  defaultChecked={features.includes(feature)}
                                />
                                <label
                                  htmlFor={`mobile-feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {feature}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Transaction Type Filter */}
                  <AccordionItem value="transactionType">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <span>Transaction Type</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {transactionTypes.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-transaction-${type.toLowerCase().replace(/\s+/g, "-")}`}
                              defaultChecked={transactionType === type}
                            />
                            <label
                              htmlFor={`mobile-transaction-${type.toLowerCase().replace(/\s+/g, "-")}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* More Filters */}
                  <AccordionItem value="moreFilters">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <span>More Filters</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label className="mb-2 block">Development Type</Label>
                          <Select defaultValue={developmentType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              {developmentTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="mb-2 block">Availability</Label>
                          <Select defaultValue={availability}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              {availabilityStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <SheetFooter className="flex-col gap-3 sm:flex-col">
                <Button className="w-full">Apply Filters</Button>
                <Button variant="outline" className="w-full">
                  Reset
                </Button>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full">
                    Cancel
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Filter Properties</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  Reset All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Quick Search */}
                <div className="space-y-2">
                  <Label htmlFor="quickSearch">Quick Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input id="quickSearch" placeholder="Search by keyword..." className="pl-9" />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select defaultValue={location}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="all">All Locations</SelectItem>
                      {locationTree.map((parent) => (
                        <div key={parent.id || parent.name}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">{parent.name}</div>
                          <SelectItem value={parent.name}>{parent.name} (All)</SelectItem>
                          {parent.children &&
                            parent.children.map((child) => (
                              <SelectItem key={child.id || child.name} value={child.name} className="pl-4">
                                {child.name}
                              </SelectItem>
                            ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="flex justify-between items-center gap-2">
                    <Input type="number" placeholder="Min €" className="w-[45%]" defaultValue={minPrice} />
                    <span className="text-muted-foreground">to</span>
                    <Input type="number" placeholder="Max €" className="w-[45%]" defaultValue={maxPrice} />
                  </div>
                </div>

                {/* Property Type Filter */}
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {/* Residential Properties */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-residential" />
                        <label
                          htmlFor="type-residential"
                          className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Residential
                        </label>
                      </div>
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-villa" defaultChecked={propertyType === "Villa/Luxury Home"} />
                          <label
                            htmlFor="type-villa"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Villa/Luxury Home
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-apartment" defaultChecked={propertyType === "Apartment/Condo"} />
                          <label
                            htmlFor="type-apartment"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Apartment/Condo
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-penthouse" defaultChecked={propertyType === "Penthouse"} />
                          <label
                            htmlFor="type-penthouse"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Penthouse
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-studio" defaultChecked={propertyType === "Studio"} />
                          <label
                            htmlFor="type-studio"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Studio
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-townhouse" defaultChecked={propertyType === "Townhouse/Semi-Detached"} />
                          <label
                            htmlFor="type-townhouse"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Townhouse/Semi-Detached
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-duplex" defaultChecked={propertyType === "Duplex/Triplex"} />
                          <label
                            htmlFor="type-duplex"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Duplex/Triplex
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-ground-floor" defaultChecked={propertyType === "Ground Floor Apartment"} />
                          <label
                            htmlFor="type-ground-floor"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Ground Floor Apartment
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Rural Properties */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-rural" />
                        <label
                          htmlFor="type-rural"
                          className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Rural
                        </label>
                      </div>
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-country" defaultChecked={propertyType === "Rural/Country Property"} />
                          <label
                            htmlFor="type-country"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Country Property
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-finca" defaultChecked={propertyType === "Finca"} />
                          <label
                            htmlFor="type-finca"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Finca
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Commercial & Investment */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-commercial" />
                        <label
                          htmlFor="type-commercial"
                          className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Commercial & Investment
                        </label>
                      </div>
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="type-commercial-property"
                            defaultChecked={propertyType === "Commercial Property"}
                          />
                          <label
                            htmlFor="type-commercial-property"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Commercial Property
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-hotel" defaultChecked={propertyType === "Hotel/Hospitality"} />
                          <label
                            htmlFor="type-hotel"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Hotel/Hospitality
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-development" defaultChecked={propertyType === "Development Project"} />
                          <label
                            htmlFor="type-development"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Development Project
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-plot" defaultChecked={propertyType === "Plot/Land"} />
                          <label
                            htmlFor="type-plot"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Plot/Land
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Special Features */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-special" />
                        <label
                          htmlFor="type-special"
                          className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Special Features
                        </label>
                      </div>
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type-beachfront" defaultChecked={propertyType === "Beachfront Property"} />
                          <label
                            htmlFor="type-beachfront"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Beachfront Property
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bedrooms Filter */}
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5, "6+"].map((num) => (
                      <Button
                        key={num}
                        variant={bedrooms === num ? "default" : "outline"}
                        className="h-9 w-12"
                        size="sm"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms Filter */}
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, "6+"].map((num) => (
                      <Button
                        key={num}
                        variant={bathrooms === num ? "default" : "outline"}
                        className="h-9 w-12"
                        size="sm"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Area & Plot Size */}
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Living Area (m²)</Label>
                    <div className="flex justify-between items-center gap-2">
                      <Input type="number" placeholder="Min" className="w-[45%]" defaultValue={minArea} />
                      <span className="text-muted-foreground">-</span>
                      <Input type="number" placeholder="Max" className="w-[45%]" defaultValue={maxArea} />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Plot Size (m²)</Label>
                    <div className="flex justify-between items-center gap-2">
                      <Input type="number" placeholder="Min" className="w-[45%]" defaultValue={minPlot} />
                      <span className="text-muted-foreground">-</span>
                      <Input type="number" placeholder="Max" className="w-[45%]" defaultValue={maxPlot} />
                    </div>
                  </div>
                </div>

                {/* Investment Tier Filter */}
                <div className="space-y-2">
                  <Label>Investment Tier</Label>
                  <div className="space-y-2">
                    {investmentTiers.map((tier) => (
                      <div key={tier.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tier-${tier.name.toLowerCase().replace(" ", "-")}`}
                          defaultChecked={investmentTier === tier.name}
                        />
                        <label
                          htmlFor={`tier-${tier.name.toLowerCase().replace(" ", "-")}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tier.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Filter - Collapsible */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="features" className="border-none">
                    <AccordionTrigger className="py-0 text-base font-medium">Features & Amenities</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label className="mb-2 block">Essential Features</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {essentialFeatures.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                                  defaultChecked={features.includes(feature)}
                                />
                                <label
                                  htmlFor={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {feature}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block">Luxury Features</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {luxuryFeatures.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                                  defaultChecked={features.includes(feature)}
                                />
                                <label
                                  htmlFor={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {feature}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Transaction Type Filter */}
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <div className="space-y-2">
                    {transactionTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`transaction-${type.toLowerCase().replace(/\s+/g, "-")}`}
                          defaultChecked={transactionType === type}
                        />
                        <label
                          htmlFor={`transaction-${type.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* More Filters - Collapsible */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="moreFilters" className="border-none">
                    <AccordionTrigger className="py-0 text-base font-medium">More Filters</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label className="mb-2 block">Development Type</Label>
                          <Select defaultValue={developmentType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              {developmentTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="mb-2 block">Availability</Label>
                          <Select defaultValue={availability}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              {availabilityStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button className="w-full">Apply Filters</Button>
                <Button variant="outline" className="w-full">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Showing {properties.length} properties</p>

              {/* Active Filters */}
              {(location ||
                propertyType ||
                minPrice ||
                maxPrice ||
                bedrooms ||
                bathrooms ||
                investmentTier ||
                features.length > 0) && (
                <div className="flex flex-wrap gap-2 ml-2">
                  {location && (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                      {location}
                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                    </Badge>
                  )}
                  {propertyType && (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                      {propertyType}
                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                    </Badge>
                  )}
                  {(minPrice || maxPrice) && (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                      {minPrice ? `€${minPrice}` : "€0"} - {maxPrice ? `€${maxPrice}` : "€20M+"}
                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                    </Badge>
                  )}
                  {bedrooms && (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                      {bedrooms}+ Beds
                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                    </Badge>
                  )}
                  {investmentTier && (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                      {investmentTier}
                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                    </Badge>
                  )}
                  {features.length > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                      {features.length} Features
                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm whitespace-nowrap">
                Sort by:
              </Label>
              <Select defaultValue={sortBy || "price-desc"}>
                <SelectTrigger id="sort" className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="size-desc">Size (Largest)</SelectItem>
                  <SelectItem value="bedrooms-desc">Bedrooms (Most)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          {properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-semibold">No properties found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your filters to see more results.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/investments">Clear Filters</Link>
              </Button>
            </div>
          )}

          {properties.length > 0 && (
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
      </div>
    </div>
  )
}

