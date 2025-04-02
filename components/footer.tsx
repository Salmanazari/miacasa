import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Miacasa</span>
            </Link>
            <p className="text-sm text-muted-foreground">Premium real estate investment opportunities worldwide.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/investments" className="text-muted-foreground hover:text-primary">
                  Investments
                </Link>
              </li>
              <li>
                <Link href="/locations" className="text-muted-foreground hover:text-primary">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-muted-foreground hover:text-primary">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-muted-foreground hover:text-primary">
                  Partners
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-muted-foreground hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted-foreground hover:text-primary">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">123 Investment Avenue, Suite 456</li>
              <li className="text-muted-foreground">New York, NY 10001</li>
              <li>
                <Link href="mailto:info@miacasa.com" className="text-muted-foreground hover:text-primary">
                  info@miacasa.com
                </Link>
              </li>
              <li>
                <Link href="tel:+12125551234" className="text-muted-foreground hover:text-primary">
                  +1 (212) 555-1234
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Miacasa Investment Properties. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

