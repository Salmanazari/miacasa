"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// Find the import for InvestmentTierGuide and make sure it's correct
import InvestmentTierGuide from "./investment-tier-guide"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Investments", href: "/investments" },
    { name: "Locations", href: "/locations" },
    { name: "Guides", href: "/guides" },
    { name: "Blog", href: "/blog" },
    { name: "Partners", href: "/partners" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Miacasa</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
            <InvestmentTierGuide />
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="hidden md:flex"
            onClick={() => {
              // Open contact modal
              document.getElementById("contact-modal-trigger")?.click()
            }}
          >
            Contact
          </Button>
          <Button
            className="hidden md:flex"
            onClick={() => {
              // Open contact modal
              document.getElementById("contact-modal-trigger")?.click()
            }}
          >
            Get Started
          </Button>
          <Button variant="outline" size="icon" className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu - Adding solid background */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container flex h-20 items-center justify-between bg-background">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Miacasa</span>
            </Link>
            <Button variant="outline" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="container grid gap-6 py-6 bg-background">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            <div className="py-2">
              <InvestmentTierGuide />
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => {
                toggleMenu()
                // Open contact modal
                document.getElementById("contact-modal-trigger")?.click()
              }}
            >
              Contact Us
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

