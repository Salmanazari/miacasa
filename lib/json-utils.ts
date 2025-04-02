/**
 * Utility functions for safely handling JSON data
 */

// Function to safely parse JSON
export function parseJsonField(jsonString: string | null, defaultValue: any = []) {
  if (!jsonString) return defaultValue

  // If it's not a string, return the default value
  if (typeof jsonString !== "string") return defaultValue

  // First, check if the string is a direct URL
  if (jsonString.startsWith("http://") || jsonString.startsWith("https://")) {
    return [jsonString] // Return as a single-item array
  }

  try {
    // Try to parse as JSON
    const parsed = JSON.parse(jsonString)
    return parsed
  } catch (error) {
    // If parsing fails, check if it's a comma-separated list
    if (jsonString.includes(",")) {
      return jsonString.split(",").map((item) => item.trim())
    }

    // If not a comma-separated list, return the string as a single-item array
    return [jsonString]
  }
}

