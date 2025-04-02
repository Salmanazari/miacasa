"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/property-card"
import FlagshipPropertyCard from "@/components/flagship-property-card"
import LocationCard from "@/components/location-card"
import BlogCard from "@/components/blog-card"
import { ChevronRight, MapPin, Building, Landmark, Shield } from "lucide-react"
import { getProperties, getLocations, getBlogPosts } from "@/lib/api"
import { debugLog, LogLevel } from "@/lib/debug-utils"
import RotatingInvestmentAnswers from "@/components/rotating-investment-answers"
import FindInternationalAgent from "@/components/find-international-agent"

export const revalidate = 3600 // Revalidate at most every hour

export default async function Home() {
  // Fetch featured properties
  const rawFeaturedProperties = await getProperties({
    limit: 3,
    featured: true,
  })
  const featuredProperties = rawFeaturedProperties

  // Fetch ultra prime properties
  const rawUltraPrimeProperties = await getProperties({
    limit: 2,
    investmentTier: "Ultra Prime",
  })
  const ultraPrimeProperties = rawUltraPrimeProperties

  // Fetch parent locations - LIMIT TO 6
  const rawLocations = await getLocations({
    limit: 6,
    parentOnly: true,
    includeChildren: false, // Make sure we don't include children
  })

  // Create a simplified version of locations data
  const locations = rawLocations.map((location) => ({
    id: location.id || "",
    name: location.name || "Location",
    slug: location.slug || "",
    description: location.description || "",
    image_urls: location.image_urls || null,
  }))

  // Fetch blog posts
  const rawBlogPosts = await getBlogPosts({
    limit: 3,
  })

  // Create a simplified version of blog posts data
  const blogPosts = rawBlogPosts.map((post) => ({
    id: post.id || "",
    slug: post.slug || "",
    title: post.title || "Blog Post",
    excerpt: post.excerpt || "",
    image_urls: post.image_urls || null,
    created_at: post.created_at || "",
    reading_time: post.reading_time || "5 min read",
    category: post.category || "",
    location_slug: post.location_slug || "",
  }))

  // Log data for debugging
  debugLog(
    "Home page data loaded",
    {
      featuredPropertiesCount: featuredProperties.length,
      ultraPrimePropertiesCount: ultraPrimeProperties.length,
      locationsCount: locations.length,
      blogPostsCount: blogPosts.length,
    },
    LogLevel.INFO,
  )

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <Image
          src="https://mabeaute-property-images.s3.amazonaws.com/webassets/homepage/u6866325327_modern_interior_design_--ar_65_--v_6.1_582647e8-cfdc-4cf6-bf79-181497f27c89_3.png"
          alt="Luxury real estate"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Exceptional Investment Properties Worldwide
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl">
            Discover premium real estate opportunities curated for discerning investors
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => {
                document.getElementById("contact-modal-trigger")?.click()
              }}
            >
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white hover:text-black"
              asChild
            >
              <Link href="/investments">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What is a good investment? Section */}
      <RotatingInvestmentAnswers />

      {/* Featured Properties */}
      <section className="container py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Featured Properties</h2>
            <p className="mt-2 text-muted-foreground">Handpicked investment opportunities with exceptional potential</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/investments" className="group">
              View All
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </section>

      {/* Discover Iconic Locations - ONLY SHOWING 6 PARENT LOCATIONS */}
      <section className="container py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Discover Iconic Locations</h2>
            <p className="mt-2 text-muted-foreground">
              Explore our curated selection of premium investment destinations
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/locations" className="group">
              View All
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              id={location.id}
              name={location.name}
              slug={location.slug}
              description={location.description}
              image_urls={location.image_urls}
            />
          ))}
        </div>
      </section>

      {/* Ultra Prime Properties */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Ultra Prime Collection</h2>
              <p className="mt-2 text-muted-foreground">
                Exceptional properties in the world's most prestigious locations
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/investments?investmentTier=Ultra%20Prime" className="group">
                View Collection
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {ultraPrimeProperties.map((property) => (
              <FlagshipPropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      {/* Find an Agent in Your Country */}
      <FindInternationalAgent />

      {/* Why Choose Us */}
      <section className="container py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Why Choose Miacasa</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We provide a comprehensive approach to real estate investment, offering expertise and support at every step
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Premium Properties</h3>
            <p className="mt-2 text-muted-foreground">
              Carefully selected properties with strong appreciation potential in prime locations
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Global Network</h3>
            <p className="mt-2 text-muted-foreground">
              Local expertise in over 40 countries through our trusted international partners
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Landmark className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Investment Advisory</h3>
            <p className="mt-2 text-muted-foreground">
              Personalized guidance from experienced advisors to maximize your investment returns
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Full Support</h3>
            <p className="mt-2 text-muted-foreground">
              Comprehensive services from acquisition to property management and eventual resale
            </p>
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section className="bg-muted py-20">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Market Insights</h2>
              <p className="mt-2 text-muted-foreground">
                Expert analysis and guidance for informed investment decisions
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog" className="group">
                View All
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="rounded-3xl bg-primary p-8 text-center text-white md:p-12 lg:p-16 border border-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=10&width=10')] opacity-5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient"></div>
          <h2 className="text-3xl font-bold md:text-4xl">Ready to Start Your Investment Journey?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Our team of experts is ready to help you find the perfect investment property tailored to your goals and
            preferences.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => {
                document.getElementById("contact-modal-trigger")?.click()
              }}
            >
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary bg-transparent text-white hover:bg-secondary hover:text-secondary-foreground"
              asChild
            >
              <Link href="/investments">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

