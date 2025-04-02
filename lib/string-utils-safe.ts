/**
 * Ultra-safe string utility functions that will never throw errors
 */

// Log errors for debugging
function logError(functionName: string, error: any, value: any): void {
  console.error(`Error in ${functionName}:`, error, "Value type:", typeof value, "Value:", value)
}

/**
 * Safely checks if a value is a valid string that can be used with string methods
 */
export function isValidString(value: any): boolean {
  return value !== null && value !== undefined && typeof value === "string"
}

/**
 * Safely formats a category string with robust error handling
 */
export function safeFormatCategory(value: any): string {
  // If not a string, return default
  if (!isValidString(value)) {
    return "Article"
  }

  try {
    return value.replace(/-/g, " ")
  } catch (error) {
    logError("safeFormatCategory", error, value)
    return "Article"
  }
}

/**
 * Safely calls String.startsWith without throwing errors
 */
export function safeStartsWith(value: any, searchString: string): boolean {
  if (!isValidString(value)) return false

  try {
    return value.startsWith(searchString)
  } catch (error) {
    logError("safeStartsWith", error, value)
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
  } catch (error) {
    logError("safeIncludes", error, value)
    return false
  }
}

/**
 * Safely gets a string from any value
 */
export function safeString(value: any): string {
  if (value === null || value === undefined) {
    return ""
  }

  if (typeof value === "string") {
    return value
  }

  try {
    return String(value)
  } catch (error) {
    logError("safeString", error, value)
    return ""
  }
}

