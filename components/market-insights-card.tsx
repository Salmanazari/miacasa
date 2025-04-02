"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MarketInsightsCardProps {
  locationName: string
  locationSlug: string
  averagePrice?: number
  rentalYield?: number
  capitalGrowth?: number
  demandLevel?: "Low" | "Medium" | "High" | "Very High"
  currency?: string
}

export default function MarketInsightsCard({
  locationName,
  locationSlug,
  averagePrice = 6500,
  rentalYield = 5.2,
  capitalGrowth = 28,
  demandLevel = "High",
  currency = "EUR",
}: MarketInsightsCardProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Calculate demand level percentage
  const getDemandPercentage = (level: string): number => {
    switch (level) {
      case "Low":
        return 25
      case "Medium":
        return 50
      case "High":
        return 75
      case "Very High":
        return 95
      default:
        return 75
    }
  }

  const demandPercentage = getDemandPercentage(demandLevel)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Market Insights: {locationName}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Price (per m²)</span>
              <span className="font-semibold">{formatCurrency(averagePrice)}</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-[75%] rounded-full bg-primary"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rental Yield</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{rentalYield}%</span>
                {rentalYield > 4.5 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${(rentalYield / 10) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Capital Growth (5yr)</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">+{capitalGrowth}%</span>
                {capitalGrowth > 20 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${(capitalGrowth / 50) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Demand Level</span>
              <span className="font-semibold">{demandLevel}</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${demandPercentage}%` }}></div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/blog?locationSlug=${locationSlug}`}>View Market Reports</Link>
          </Button>
          <Button className="w-full">Request Investment Analysis</Button>
        </div>
      </CardContent>
    </Card>
  )
}

