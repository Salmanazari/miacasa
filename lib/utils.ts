export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Recent"
  }
}

export function cn(...inputs: (string | undefined | null)[]): string {
  return inputs.filter(Boolean).join(" ")
}

