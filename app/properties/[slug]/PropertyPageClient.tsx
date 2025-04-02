"use client"

import type React from "react"
import type { Property } from "@/types"
import MarketInsights from "@/components/market-insights" // Import the MarketInsights component

interface PropertyPageClientProps {
  property: Property
}

const PropertyPageClient: React.FC<PropertyPageClientProps> = ({ property }) => {
  return (
    <div>
      {/* Property Details Section (Example) */}
      <h1>{property.title}</h1>
      <p>{property.description}</p>

      {/* Market Insights Section */}
      {property.location && <MarketInsights locationId={property.location.id} locationName={property.location.name} />}

      {/* Rest of the property page content */}
    </div>
  )
}

export default PropertyPageClient

