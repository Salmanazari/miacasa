import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const body = await request.json()
    const {
      name,
      email,
      phone,
      message,
      inquiryType,
      propertyType,
      budget,
      location,
      timeframe,
      bedrooms,
      bathrooms,
      preferredContactMethod,
    } = body

    // Validate required fields
    if (!name || !email || !message || !inquiryType) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Insert into database
    const { data, error } = await supabase.from("inquiries").insert([
      {
        name,
        email,
        phone,
        message,
        inquiry_type: inquiryType,
        property_type: propertyType,
        budget,
        location,
        timeframe,
        bedrooms,
        bathrooms,
        preferred_contact_method: preferredContactMethod,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error inserting inquiry:", error)
      return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
    }

    return NextResponse.json({ message: "Inquiry submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error processing inquiry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

