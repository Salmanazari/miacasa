import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactModal from "@/components/contact-modal"
import ScrollToTop from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Miacasa Investment Properties",
  description: "Discover premium real estate investment opportunities worldwide",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <Header />
            <ScrollToTop />
            <main className="flex-1">{children}</main>
            <Footer />
            <ContactModal />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"



import './globals.css'