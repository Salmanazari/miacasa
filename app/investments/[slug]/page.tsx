import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPropertyBySlug, getSimilarProperties, getBlogPosts, parseJsonField } from "@/lib/api"
import PropertyPageClient from "./PropertyPageClient"

interface PropertyPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug)

  if (!property) {
    return {
      title: "Property Not Found | Miacasa Investment Properties",
      description: "The requested property could not be found.",
    }
  }

  return {
    title: `${property.seo_title || property.title} | Miacasa Investment Properties`,
    description: property.meta_description || property.description.substring(0, 160),
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await getPropertyBySlug(params.slug)

  if (!property) {
    notFound()
  }

  // Get similar properties
  const similarProperties = await getSimilarProperties(property, 3)

  // Get related blog posts
  const relatedPosts = await getBlogPosts({
    limit: 2,
    locationSlug: property.city.toLowerCase(),
  })

  // Parse JSON fields
  const images = parseJsonField(property.images, [])
  const features = parseJsonField(property.features, [])
  const categoryTags = parseJsonField(property.category_tags, [])
  const labelTags = parseJsonField(property.label_tags, [])

  // Prepare data for client component
  const propertyData = {
    ...property,
    images,
    features,
    categoryTags,
    labelTags,
  }

  return (
    <PropertyPageClient property={propertyData} similarProperties={similarProperties} relatedPosts={relatedPosts} />
  )
}

