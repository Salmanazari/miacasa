"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@supabase/supabase-js"
import { TrendingUp, AlertCircle, Calendar, Quote } from "lucide-react"
import { debugLog, LogLevel } from "@/lib/debug-utils"
import { motion } from "framer-motion"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface MarketInsightsProps {
  locationId?: string
  locationName: string
  className?: string
  variant?: "default" | "compact"
}

interface MarketInsightData {
  location_id: string
  average_price_per_sqm: number | null
  rental_yield: number | null
  capital_growth_5yr: number | null
  demand_level: string | null
  currency: string | null
  note: string | null
  updated_at: string | null
}

export default function MarketInsights({
  locationId,
  locationName,
  className = "",
  variant = "default",
}: MarketInsightsProps) {
  const [insights, setInsights] = useState<MarketInsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    async function fetchMarketInsights() {
      try {
        setLoading(true)
        setError(null)

        debugLog(`Fetching market insights for ${locationName}`, { locationId, locationName }, LogLevel.DEBUG)

        // If we have a locationId, use it directly
        if (locationId) {
          const { data, error: insightsError } = await supabase
            .from("market_insights")
            .select("*")
            .eq("location_id", locationId)
            .single()

          if (insightsError) {
            debugLog(`Error fetching market insights by ID: ${insightsError.message}`, { locationId }, LogLevel.ERROR)

            // If not found by ID, try by name
            const { data: locationData, error: locationError } = await supabase
              .from("locations")
              .select("id")
              .ilike("name", locationName)
              .single()

            if (locationError || !locationData) {
              throw new Error(`Location not found: ${locationName}`)
            }

            const { data: insightsByName, error: insightsByNameError } = await supabase
              .from("market_insights")
              .select("*")
              .eq("location_id", locationData.id)
              .single()

            if (insightsByNameError) {
              throw new Error(`No market insights for ${locationName}`)
            }

            setInsights(insightsByName)
            return
          }

          setInsights(data)
          return
        }

        // If no locationId, try to find by name
        const { data: locationData, error: locationError } = await supabase
          .from("locations")
          .select("id")
          .ilike("name", locationName)
          .single()

        if (locationError || !locationData) {
          throw new Error(`Location not found: ${locationName}`)
        }

        const { data, error: insightsError } = await supabase
          .from("market_insights")
          .select("*")
          .eq("location_id", locationData.id)
          .single()

        if (insightsError) {
          throw new Error(`No market insights for ${locationName}`)
        }

        setInsights(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        debugLog(
          `Error in MarketInsights component: ${errorMessage}`,
          { locationId, locationName, error: err },
          LogLevel.ERROR,
        )
        setError(errorMessage)

        // If we have a connection error, retry up to 3 times
        if (errorMessage.includes("connection") && retryCount < 3) {
          setRetryCount((prev) => prev + 1)
          setTimeout(() => fetchMarketInsights(), 1000 * retryCount)
        }
      } finally {
        setLoading(false)
      }
    }

    if (locationId || locationName) {
      fetchMarketInsights()
    } else {
      setError("No location specified")
      setLoading(false)
    }
  }, [locationId, locationName, retryCount])

  // Format currency with proper symbol
  const formatCurrency = (value: number | null, currency: string | null) => {
    if (value === null || value === undefined) return "N/A"

    const currencySymbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "USD" ? "$" : "€"

    try {
      return `${currencySymbol}${value.toLocaleString()}`
    } catch (e) {
      debugLog(`Error formatting currency: ${e}`, { value, currency }, LogLevel.ERROR)
      return `${currencySymbol}${value}`
    }
  }

  // Format percentage with trend indicator
  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return "N/A"

    try {
      const isPositive = value > 0
      const trendIcon = isPositive ? (
        <span className="text-green-500 ml-1">↑</span>
      ) : (
        <span className="text-red-500 ml-1">↓</span>
      )

      return (
        <span className="flex items-center">
          {Math.abs(value).toFixed(1)}%{trendIcon}
        </span>
      )
    } catch (e) {
      debugLog(`Error formatting percentage: ${e}`, { value }, LogLevel.ERROR)
      return `${value}%`
    }
  }

  // Determine demand level color
  const getDemandLevelColor = (level: string | null) => {
    if (!level) return "text-gray-500"

    try {
      switch (level.toLowerCase()) {
        case "very high":
          return "text-green-600"
        case "high":
          return "text-green-500"
        case "medium":
          return "text-yellow-500"
        case "low":
          return "text-orange-500"
        case "very low":
          return "text-red-500"
        default:
          return "text-gray-500"
      }
    } catch (e) {
      debugLog(`Error determining demand level color: ${e}`, { level }, LogLevel.ERROR)
      return "text-gray-500"
    }
  }

  // Format date to readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    } catch (e) {
      debugLog(`Error formatting date: ${e}`, { dateString }, LogLevel.ERROR)
      return "Recent"
    }
  }

  if (loading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
          <CardTitle className="text-xl flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Market Insights: {locationName}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !insights) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
          <CardTitle className="text-xl flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Market Insights: {locationName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>Market data currently unavailable</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <Card className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="text-xl flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-primary" />
          Market Insights: {locationName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <motion.div className="p-4 space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div className="grid grid-cols-2 gap-6" variants={itemVariants}>
            <div className="bg-background/50 p-3 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-muted-foreground flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                Average Price
              </p>
              <p className="text-xl font-semibold mt-1">
                {formatCurrency(insights.average_price_per_sqm, insights.currency)}/m²
              </p>
            </div>
            <div className="bg-background/50 p-3 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-muted-foreground flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                Rental Yield
              </p>
              <p className="text-xl font-semibold mt-1">{formatPercentage(insights.rental_yield)}</p>
            </div>
            <div className="bg-background/50 p-3 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-muted-foreground flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                5-Year Growth
              </p>
              <p className="text-xl font-semibold mt-1">{formatPercentage(insights.capital_growth_5yr)}</p>
            </div>
            <div className="bg-background/50 p-3 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-muted-foreground flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                Demand Level
              </p>
              <p className={`text-xl font-semibold mt-1 ${getDemandLevelColor(insights.demand_level)}`}>
                {insights.demand_level || "N/A"}
              </p>
            </div>
          </motion.div>

          {insights.note && variant === "default" && (
            <motion.div className="mt-4 pt-4 border-t border-border" variants={itemVariants}>
              <div className="bg-primary/5 p-4 rounded-lg relative">
                <Quote className="absolute text-primary/20 h-8 w-8 -top-2 -left-2" />
                <p className="text-sm text-foreground/90 leading-relaxed pl-4">{insights.note}</p>
              </div>
            </motion.div>
          )}

          <motion.div
            className="flex items-center justify-end text-xs text-muted-foreground mt-2"
            variants={itemVariants}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Updated: {formatDate(insights.updated_at)}
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

