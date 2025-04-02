/**
 * Global data handling utilities to prevent type errors
 */

// Type guard to check if a value is a string
export function isString(value: unknown): value is string {
  return typeof value === "string"
}

// Type guard to check if a value is an array
export function isArray(value: unknown): value is Array<unknown> {
  return Array.isArray(value)
}

// Type guard to check if a value is an object
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

/**
 * Safely converts any value to a string array without ever throwing an error
 */
export function toStringArray(value: unknown): string[] {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return []
  }

  // Handle string values
  if (isString(value)) {
    // Empty string
    if (value.trim() === "") {
      return []
    }

    // Try parsing JSON
    if ((value.startsWith("[") || value.startsWith("{")) && (value.endsWith("]") || value.endsWith("}"))) {
      try {
        const parsed = JSON.parse(value)

        // Parsed to array
        if (isArray(parsed)) {
          return parsed.filter(isString)
        }

        // Parsed to object
        if (isObject(parsed)) {
          return Object.values(parsed).filter(isString)
        }

        // Parsed to string
        if (isString(parsed)) {
          return [parsed]
        }

        return []
      } catch {
        // JSON parsing failed, continue to other methods
      }
    }

    // Check for comma-separated list
    if (value.includes(",")) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }

    // Single string value
    return [value]
  }

  // Handle array values
  if (isArray(value)) {
    return value.filter(isString)
  }

  // Handle object values
  if (isObject(value)) {
    return Object.values(value).filter(isString)
  }

  // Try to convert to string as a last resort
  try {
    const str = String(value)
    if (str && str !== "null" && str !== "undefined" && str !== "[object Object]") {
      return [str]
    }
  } catch {}

  // Default fallback
  return []
}

/**
 * Safely gets a property from an object
 */
export function safeGet<T>(obj: unknown, path: string, defaultValue: T): T {
  if (!isObject(obj)) return defaultValue

  const parts = path.split(".")
  let current: any = obj

  for (const part of parts) {
    if (current === null || current === undefined || !isObject(current)) {
      return defaultValue
    }
    current = current[part]
  }

  return current === undefined ? defaultValue : (current as T)
}

/**
 * Pre-processes data before passing it to components
 * This should be called in the server component
 */
export function sanitizeData<T extends Record<string, unknown>>(data: T): T {
  if (!data) return {} as T

  const result = { ...data }

  // Pre-process common problematic fields
  if ("lifestyle_tags" in result) {
    result.lifestyle_tags = toStringArray(result.lifestyle_tags)
  }

  if ("tags" in result) {
    result.tags = toStringArray(result.tags)
  }

  if ("related_location_slug" in result) {
    result.related_location_slug = toStringArray(result.related_location_slug)
  }

  if ("image_urls" in result && !isString(result.image_urls)) {
    // If image_urls is not a string, try to extract the first URL
    const urls = toStringArray(result.image_urls)
    result.image_urls = urls.length > 0 ? urls[0] : null
  }

  return result
}

