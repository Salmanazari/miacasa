"use client"

import { useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface GoogleMapProps {
  latitude: number
  longitude: number
  zoom?: number
  className?: string
  markers?: Array<{
    lat: number
    lng: number
    title?: string
  }>
}

export default function GoogleMap({
  latitude,
  longitude,
  zoom = 14,
  className = "w-full h-full",
  markers = [],
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
      })

      try {
        const google = await loader.load()
        const position = { lat: latitude, lng: longitude }

        if (!google) {
          console.error("Google Maps API could not be loaded.")
          return
        }

        googleMapRef.current = new google.maps.Map(mapRef.current, {
          center: position,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        // Add the main marker
        new google.maps.Marker({
          position,
          map: googleMapRef.current,
          animation: google.maps.Animation.DROP,
        })

        // Add additional markers if provided
        markers.forEach((marker) => {
          new google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lng },
            map: googleMapRef.current,
            title: marker.title,
          })
        })
      } catch (error) {
        console.error("Error loading Google Maps:", error)
      }
    }

    initMap()
  }, [latitude, longitude, zoom, markers])

  return <div ref={mapRef} className={className} />
}

