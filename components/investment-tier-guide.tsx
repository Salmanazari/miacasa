"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InfoIcon } from "lucide-react"

export const investmentTiers = [
  {
    name: "Starter",
    range: "≤ €200,000",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    badgeClassName: "bg-blue-100 text-blue-800 border-blue-200",
    description:
      "Accessible entry point into the Spanish real estate market. Ideal for first-time investors, typically including studio or one-bedroom apartments in developing areas with growth potential.",
  },
  {
    name: "Mid-range",
    range: "€200,001–€500,000",
    color: "bg-green-100 text-green-800 border-green-200",
    badgeClassName: "bg-green-100 text-green-800 border-green-200",
    description:
      "Excellent value with balanced investment potential. Properties often feature two or three bedrooms in established neighborhoods with good amenities.",
  },
  {
    name: "Luxury",
    range: "€500,001–€1,000,000",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    badgeClassName: "bg-purple-100 text-purple-800 border-purple-200",
    description:
      "Premium features and locations with high-quality finishes, desirable views, and prime positioning within their neighborhoods.",
  },
  {
    name: "Luxury Plus",
    range: "€1,000,001-€2,999,999",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    badgeClassName: "bg-amber-100 text-amber-800 border-amber-200",
    description:
      "Entry into the exclusive luxury market with distinctive architecture, premium materials, and sophisticated design elements in prestigious addresses.",
  },
  {
    name: "Luxury Premium",
    range: "€3,000,000-€4,999,999",
    color: "bg-rose-100 text-rose-800 border-rose-200",
    badgeClassName: "bg-rose-100 text-rose-800 border-rose-200",
    description:
      "Exceptional properties representing the pinnacle of refined living with architectural significance, premium craftsmanship, and expansive spaces.",
  },
  {
    name: "Ultra Prime",
    range: "≥ €5,000,000",
    color: "bg-gold-gradient text-dark border-secondary",
    badgeClassName: "bg-gold-gradient text-dark border-secondary",
    description:
      "Truly extraordinary properties that transcend conventional real estate, featuring unparalleled design, location, and amenities that establish them as landmark properties.",
  },
]

export function InvestmentTierGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <InfoIcon className="h-4 w-4" />
          <span>Investment Tiers</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Investment Tier Classification</DialogTitle>
          <DialogDescription>
            Understanding our property categories to help you navigate the real estate market with clarity and
            precision.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {investmentTiers.map((tier) => (
            <div key={tier.name} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <InvestmentTierBadge tier={tier.name} />
              </div>
              <p className="text-muted-foreground">{tier.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function InvestmentTierBadge({ tier }: { tier: string }) {
  const tierInfo = investmentTiers.find((t) => t.name === tier) || investmentTiers[0]

  return <Badge className={`${tierInfo.badgeClassName} hover:${tierInfo.color}`}>{tier}</Badge>
}

// Add default export
export default InvestmentTierGuide

