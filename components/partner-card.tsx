import Image from "next/image"
import Link from "next/link"

interface Partner {
  id: string
  partner_name: string
  contact_name: string
  country_name: string
  flag_emoji: string
  city: string
  profile_image_url: string
  description: string
  years_experience: number
  languages_spoken: string
  specialties: string
  badge?: string
}

interface PartnerCardProps {
  partner: Partner
}

export function PartnerCard({ partner }: PartnerCardProps) {
  // Parse PostgreSQL arrays if they're stored as strings
  const parsePostgresArray = (arrayString: string) => {
    if (!arrayString) return []
    try {
      // Handle both string representation and already parsed arrays
      if (typeof arrayString === "string" && arrayString.startsWith("{") && arrayString.endsWith("}")) {
        // Remove the curly braces and split by comma
        return arrayString
          .slice(1, -1)
          .split(",")
          .map((item) =>
            // Remove quotes if present
            item
              .trim()
              .replace(/^"(.*)"$/, "$1"),
          )
      }
      // If it's already an array or JSON string
      return typeof arrayString === "string" ? JSON.parse(arrayString) : arrayString
    } catch (e) {
      console.error("Error parsing array:", e)
      return []
    }
  }

  // Parse languages and specialties
  const languages = parsePostgresArray(partner.languages_spoken)
  const specialties = parsePostgresArray(partner.specialties)

  return (
    <Link href={`/partners/${partner.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        {/* Badge (if any) */}
        {partner.badge && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs px-2 py-1 rounded-full">
              {partner.badge}
            </span>
          </div>
        )}

        {/* Image container with fixed aspect ratio */}
        <div className="relative w-full pt-[75%]">
          <Image
            src={partner.profile_image_url || "/placeholder.svg?height=300&width=400"}
            alt={partner.contact_name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=300&width=400"
            }}
          />
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-center mb-2">
            <span className="mr-2 text-xl">{partner.flag_emoji}</span>
            <h3 className="font-semibold text-lg">{partner.partner_name}</h3>
          </div>

          <p className="text-sm text-gray-600 mb-1">{partner.contact_name}</p>
          <p className="text-sm text-gray-600 mb-3">
            {partner.city}, {partner.country_name}
          </p>

          <p className="text-sm line-clamp-3 mb-4 flex-grow">{partner.description}</p>

          <div className="mt-auto">
            {/* Experience and languages */}
            <div className="flex flex-wrap gap-1 mb-3">
              {partner.years_experience && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {partner.years_experience} years exp.
                </span>
              )}
              {languages.slice(0, 2).map((lang, i) => (
                <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {lang}
                </span>
              ))}
              {languages.length > 2 && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  +{languages.length - 2} more
                </span>
              )}
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-1">
              {specialties.slice(0, 2).map((specialty, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                  {specialty}
                </span>
              ))}
              {specialties.length > 2 && (
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                  +{specialties.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

