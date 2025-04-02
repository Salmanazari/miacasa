import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase"
import { PartnerCard } from "@/components/partner-card"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "International Partners | MiaCasa",
  description: "Connect with our trusted international partners for expert real estate guidance in Spain.",
}

export default async function PartnersPage() {
  const supabase = createServerClient()

  // Fetch all active partners
  const { data: partners, error } = await supabase
    .from("international_partners")
    .select("*")
    .eq("status", "Active")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching partners:", error)
  }

  // Group partners by region
  const partnersByRegion = partners?.reduce(
    (acc, partner) => {
      const region = partner.region || "Other"
      if (!acc[region]) {
        acc[region] = []
      }
      acc[region].push(partner)
      return acc
    },
    {} as Record<string, typeof partners>,
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="International Partners"
        description="Our global network of trusted real estate professionals can help you navigate the Spanish property market from anywhere in the world."
      />

      {partnersByRegion && Object.entries(partnersByRegion).length > 0 ? (
        Object.entries(partnersByRegion).map(([region, regionPartners]) => (
          <div key={region} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">{region}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regionPartners?.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-600">No partners found</h3>
          <p className="mt-2 text-gray-500">Please check back later for updates.</p>
        </div>
      )}
    </div>
  )
}

