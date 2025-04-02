"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PropertyCard from "@/components/property-card"
import GoogleMap from "@/components/google-map"
import { MapPin, Mail, Phone, Globe, Languages, Award, Building, Users } from "lucide-react"
import { parseJsonField } from "@/lib/api"

interface PartnerPageClientProps {
  partner: any
  properties: any[]
}

export default function PartnerPageClient({ partner, properties }: PartnerPageClientProps) {
  const specialties = parseJsonField(partner.specialties, [])
  const languages = parseJsonField(partner.languages_spoken, [])
  const notableProjects = parseJsonField(partner.notable_projects, [])
  const socialLinks = parseJsonField(partner.social_links, {})

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full">
        <Image
          src={partner.profile_image_url || "/placeholder.svg?height=600&width=1200"}
          alt={partner.partner_name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <div className="mb-6 flex items-center justify-center">
            <span className="mr-2 text-4xl">{partner.flag_emoji}</span>
            <h1 className="text-5xl font-bold md:text-6xl">{partner.partner_name}</h1>
          </div>
          <p className="text-xl">
            Luxury Real Estate Specialists in {partner.city}, {partner.country_name}
          </p>
        </div>
      </section>

      <div className="container py-12">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/partners" className="hover:text-primary">
            Partners
          </Link>
          <span>/</span>
          <span className="text-foreground">{partner.partner_name}</span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Partner Description */}
            <div className="mb-12">
              <h2 className="mb-4 text-3xl font-bold">About {partner.partner_name}</h2>
              <p className="text-lg text-muted-foreground">{partner.description}</p>
            </div>

            {/* Specialties */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">Specialties</h2>
              <div className="flex flex-wrap gap-3">
                {specialties.map((specialty: string) => (
                  <Badge key={specialty} className="bg-primary text-primary-foreground text-sm py-1 px-3">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Achievements */}
            {notableProjects.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-bold">Notable Projects</h2>
                <div className="space-y-4">
                  {notableProjects.map((project: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 rounded-full bg-primary/10 p-1.5">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <span>{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Properties */}
            {properties.length > 0 && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Featured Properties</h2>
                  <Button variant="outline" asChild>
                    <Link href={`/investments?location=${partner.country_name}`}>View All</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Contact Information */}
              <div className="rounded-xl border p-6">
                <h3 className="mb-6 text-xl font-semibold">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">
                        {partner.city}, {partner.country_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${partner.email}`} className="text-muted-foreground hover:text-primary">
                        {partner.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${partner.phone}`} className="text-muted-foreground hover:text-primary">
                        {partner.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        {partner.website_url.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    className="w-full"
                    onClick={() => {
                      document.getElementById("contact-modal-trigger")?.click()
                    }}
                  >
                    Contact Partner
                  </Button>
                </div>
              </div>

              {/* Company Details */}
              <div className="rounded-xl border p-6">
                <h3 className="mb-6 text-xl font-semibold">Company Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Type</p>
                      <p className="text-muted-foreground">{partner.partner_type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-muted-foreground">{partner.years_experience} Years</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Languages className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Languages</p>
                      <p className="text-muted-foreground">{languages.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-xl border p-6">
                <h3 className="mb-4 text-xl font-semibold">Location</h3>
                <div className="aspect-video overflow-hidden rounded-lg">
                  <GoogleMap
                    latitude={partner.location_lat}
                    longitude={partner.location_lng}
                    zoom={13}
                    className="h-[250px] w-full"
                  />
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`https://maps.google.com/?q=${partner.location_lat},${partner.location_lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Video Intro */}
              {partner.video_intro_url && (
                <div className="rounded-xl border p-6">
                  <h3 className="mb-4 text-xl font-semibold">Video Introduction</h3>
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <iframe
                      width="100%"
                      height="100%"
                      src={partner.video_intro_url.replace("youtu.be/", "youtube.com/embed/")}
                      title="Partner Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

