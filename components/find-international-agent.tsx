"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, MapPin, Users, ArrowRight } from "lucide-react"

// Sample countries for the visual display
const sampleCountries = [
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
]

export default function FindInternationalAgent() {
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold md:text-4xl relative inline-block mb-6">
          Find an Agent in Your Country
          <div className="absolute -bottom-2 left-0 right-0 mx-auto w-16 h-1 bg-gold-gradient rounded-full"></div>
        </h2>
        <p className="mt-6 text-xl text-muted-foreground">
          Our global network of trusted partners ensures local expertise for your investment journey
        </p>
      </div>

      <Card className="bg-muted/50 border border-secondary/20">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient">
                <Globe className="h-6 w-6 text-dark" />
              </div>
              <h3 className="text-xl font-semibold">Global Network</h3>
              <p className="text-muted-foreground">
                Our international partners provide local expertise in over 40 countries worldwide.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient">
                <MapPin className="h-6 w-6 text-dark" />
              </div>
              <h3 className="text-xl font-semibold">Local Knowledge</h3>
              <p className="text-muted-foreground">
                Navigate foreign markets with confidence through our trusted local representatives.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient">
                <Users className="h-6 w-6 text-dark" />
              </div>
              <h3 className="text-xl font-semibold">Personalized Service</h3>
              <p className="text-muted-foreground">
                Receive tailored guidance from experienced professionals who understand your needs.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {sampleCountries.map((country) => (
              <Link
                key={country.code}
                href={`/partners?country=${country.name}`}
                className="flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground border border-secondary/20"
              >
                <span className="text-xl">{country.flag}</span>
                <span>{country.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
              <Link href="/partners" className="group">
                View All Partners
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

