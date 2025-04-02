"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createInquiry } from "@/lib/api"

interface InquiryFormProps {
  propertyId: string
  propertyTitle?: string
  propertyReference?: string
  propertyCustomId?: string
  agentId?: string
}

export default function InquiryForm({
  propertyId,
  propertyTitle,
  propertyReference,
  propertyCustomId,
  agentId,
}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const inquiry = await createInquiry({
        property_id: propertyId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: "property_page",
        property_custom_id: propertyCustomId,
      })

      if (inquiry) {
        setIsSuccess(true)

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSuccess(false)
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
          })
        }, 3000)
      } else {
        setError("Failed to submit inquiry. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err)
      setError("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inquire About This Property</CardTitle>
        <CardDescription>
          {propertyTitle
            ? `Regarding: ${propertyTitle}`
            : "Fill out the form below and our team will get back to you shortly."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-success/20 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-success"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Inquiry Sent Successfully</h3>
            <p className="text-muted-foreground">Thank you for your interest. Our team will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="focus:border-secondary focus:ring-secondary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="focus:border-secondary focus:ring-secondary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="focus:border-secondary focus:ring-secondary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="I'm interested in this property and would like more information..."
                required
                className="min-h-[120px] focus:border-secondary focus:ring-secondary"
              />
            </div>
            {propertyReference && (
              <div className="text-sm text-muted-foreground">
                <p>Property Reference: {propertyReference}</p>
              </div>
            )}
            {error && (
              <div className="text-sm text-destructive">
                <p>{error}</p>
              </div>
            )}
          </form>
        )}
      </CardContent>
      {!isSuccess && (
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

