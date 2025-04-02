/**
 * Utility functions for safely handling string operations
 */

/**
 * Safely checks if a value is a string
 */
export function isValidString(value: any): value is string {
  return value !== null && value !== undefined && typeof value === "string"
}

/**
 * Safely calls String.startsWith without throwing errors
 */
export function safeStartsWith(value: any, searchString: string): boolean {
  if (!isValidString(value)) return false
  try {
    return value.startsWith(searchString)
  } catch (e) {
    return false
  }
}

/**
 * Safely calls String.endsWith without throwing errors
 */
export function safeEndsWith(value: any, searchString: string): boolean {
  if (!isValidString(value)) return false
  try {
    return value.endsWith(searchString)
  } catch (e) {
    return false
  }
}

/**
 * Safely calls String.includes without throwing errors
 */
export function safeIncludes(value: any, searchString: string): boolean {
  if (!isValidString(value)) return false
  try {
    return value.includes(searchString)
  } catch (e) {
    return false
  }
}

/**
 * Safely converts any value to a string array
 */
export function toStringArray(value: any): string[] {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return []
  }

  // Already an array - filter for strings only
  if (Array.isArray(value)) {
    return value.filter(isValidString)
  }

  // Handle string values
  if (typeof value === "string") {
    // Empty string
    if (value.trim() === "") {
      return []
    }

    // Try parsing JSON
    if (safeStartsWith(value, "[") || safeStartsWith(value, "{")) {
      try {
        const parsed = JSON.parse(value)

        // Parsed to array
        if (Array.isArray(parsed)) {
          return parsed.filter(isValidString)
        }

        // Parsed to object
        if (parsed && typeof parsed === "object") {
          return Object.values(parsed).filter(isValidString)
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
    if (safeIncludes(value, ",")) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }

    // Single string value
    return [value]
  }

  // Handle object values
  if (value && typeof value === "object") {
    try {
      const stringValues = Object.values(value).filter(isValidString)
      return stringValues
    } catch {
      return []
    }
  }

  return []
}

/**
 * Logs the type and value of a variable for debugging purposes.
 */
export function logTypeAndValue(variable: any, variableName: string): void {
  console.log(`[DEBUG] ${variableName}:`)
  console.log(`  Type: ${typeof variable}`)
  if (typeof variable === "string") {
    console.log(`  Value (truncated): ${variable.substring(0, 50)}`) // Truncate long strings
  } else {
    console.log(`  Value:`, variable)
  }
}

