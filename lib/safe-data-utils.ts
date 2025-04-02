/**
 * Utility functions for safely handling data of unknown types
 */

/**
 * Safely checks if a value is a string
 */
export function isString(value: any): boolean {
  return typeof value === "string"
}

/**
 * Safely converts any value to a string array
 * This function will NEVER throw an error regardless of input
 */
export function safeToStringArray(value: any): string[] {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return []
  }

  // Already an array - filter for strings only
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string")
  }

  // Handle string values
  if (typeof value === "string") {
    // Empty string
    if (value.trim() === "") {
      return []
    }

    // Try parsing JSON
    if (
      (value.charAt(0) === "[" || value.charAt(0) === "{") &&
      (value.charAt(value.length - 1) === "]" || value.charAt(value.length - 1) === "}")
    ) {
      try {
        const parsed = JSON.parse(value)

        // Parsed to array
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => typeof item === "string")
        }

        // Parsed to object
        if (parsed && typeof parsed === "object") {
          return Object.values(parsed)
            .filter((val) => typeof val === "string")
            .map((val) => val as string)
        }

        // Parsed to string
        if (typeof parsed === "string") {
          return [parsed]
        }

        return []
      } catch {
        // JSON parsing failed, continue to other methods
      }
    }

    // Check for comma-separated list
    if (value.indexOf(",") >= 0) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    }

    // Single string value
    return [value]
  }

  // Handle object values
  if (value && typeof value === "object") {
    try {
      const stringValues = Object.values(value)
        .filter((val) => typeof val === "string")
        .map((val) => val as string)

      return stringValues
    } catch {
      return []
    }
  }

  // Handle number, boolean, etc.
  try {
    const stringValue = String(value)
    if (stringValue && stringValue !== "null" && stringValue !== "undefined" && stringValue !== "[object Object]") {
      return [stringValue]
    }
  } catch {
    // Conversion failed
  }

  // Default fallback
  return []
}

/**
 * Safely gets a property from an object without throwing errors
 */
export function safeGet(obj: any, path: string, defaultValue: any = null): any {
  if (!obj || typeof obj !== "object") return defaultValue

  const parts = path.split(".")
  let current = obj

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return defaultValue
    }
    current = current[part]
  }

  return current === undefined ? defaultValue : current
}

