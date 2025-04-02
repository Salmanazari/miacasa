"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const investmentAnswers = [
  {
    answer: "A property with strong rental yield in a prime location",
    description: "Consistent income combined with long-term appreciation potential",
  },
  {
    answer: "An asset that appreciates over time while generating passive income",
    description: "Building wealth through strategic real estate acquisitions",
  },
  {
    answer: "A diversified portfolio across multiple international markets",
    description: "Reducing risk while maximizing global opportunities",
  },
  {
    answer: "Properties in emerging neighborhoods with growth potential",
    description: "Identifying tomorrow's hotspots before the market does",
  },
  {
    answer: "Ultra-prime real estate in established luxury destinations",
    description: "Stable value preservation with exclusive lifestyle benefits",
  },
]

export default function RotatingInvestmentAnswers() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [imageError, setImageError] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRotation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % investmentAnswers.length)
        setIsAnimating(false)
      }, 500) // Half the transition time for smooth overlap
    }, 3000) // Change every 3 seconds
  }

  useEffect(() => {
    startRotation()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <section className="container py-16 overflow-hidden">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
        <div className="space-y-6">
          <div className="relative">
            <h2 className="text-3xl font-bold md:text-4xl mb-2">What is a good investment?</h2>
            <div className="absolute -bottom-2 left-0 h-1 w-16 bg-gold-gradient rounded-full"></div>
          </div>

          <div className="min-h-[160px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="relative pl-4 border-l-2 border-secondary">
                  <h3 className="text-2xl font-semibold text-primary">{investmentAnswers[currentIndex].answer}</h3>
                  <p className="mt-2 text-muted-foreground">{investmentAnswers[currentIndex].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-2 mt-4">
            {investmentAnswers.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-secondary" : "w-2 bg-muted hover:bg-muted-foreground"
                }`}
                onClick={() => {
                  setCurrentIndex(index)
                  startRotation()
                }}
                aria-label={`View investment answer ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <Button asChild className="relative overflow-hidden group bg-primary hover:bg-primary/90">
              <Link href="/investments">
                <span className="relative z-10">Explore Properties</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="relative overflow-hidden group border-secondary text-secondary hover:text-secondary-foreground hover:bg-secondary"
              onClick={() => {
                document.getElementById("contact-modal-trigger")?.click()
              }}
            >
              <span className="relative z-10">Speak to an Advisor</span>
            </Button>
          </div>
        </div>

        <div className="relative aspect-square w-full rounded-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10"></div>
          <div className="absolute -inset-1 bg-gradient-to-tr from-secondary/30 via-primary/20 to-transparent rounded-2xl blur-lg group-hover:blur-xl transition-all duration-700 opacity-70 group-hover:opacity-100"></div>

          {/* Fallback content that shows only if image fails */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="text-center p-8">
                <h3 className="text-xl font-semibold">Strategic Investment</h3>
                <p className="mt-2 text-muted-foreground">
                  Discover premium opportunities with strong growth potential
                </p>
              </div>
            </div>
          )}

          {/* Updated image with correct URL */}
          <Image
            src="https://mabeaute-property-images.s3.amazonaws.com/webassets/homepage/miacasa-advisor-expert.png"
            alt="Investment advisor expert"
            fill
            className="object-cover rounded-2xl transform transition-transform duration-700 group-hover:scale-105"
            priority
            onError={() => {
              console.log("Image failed to load, showing fallback")
              setImageError(true)
            }}
          />
        </div>
      </div>
    </section>
  )
}

