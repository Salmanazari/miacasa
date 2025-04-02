import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GuideNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Guide Not Found</h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        The investment guide you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/guides">Browse All Guides</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}

