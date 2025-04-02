import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import { PartnerDetail } from "./partner-detail"

interface PartnerPageProps {
  params: {
    id: string // Using id to match your database
  }
}

export async function generateMetadata({ params }: PartnerPageProps): Promise<Metadata> {
  const supabase = createServerClient()

  const { data: partner } = await supabase
    .from("international_partners")
    .select("*")
    .eq("id", params.id) // Using id to match your database
    .single()

  if (!partner) {
    return {
      title: "Partner Not Found | MiaCasa",
      description: "The requested partner could not be found.",
    }
  }

  return {
    title: `${partner.partner_name} | MiaCasa International Partners`,
    description:
      partner.description || "Connect with our trusted international partner for expert real estate guidance in Spain.",
  }
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const supabase = createServerClient()

  const { data: partner, error } = await supabase
    .from("international_partners")
    .select("*")
    .eq("id", params.id) // Using id to match your database
    .single()

  if (error || !partner) {
    notFound()
  }

  return <PartnerDetail partner={partner} />
}

