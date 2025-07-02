"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "../components/ui/button"
import { GovernmentCard } from "../components/ui/government-card"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <GovernmentCard variant="official" className="max-w-lg text-center">
        <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-slate-800 mb-4">System Error</h1>
        <p className="text-slate-600 mb-2">
          We apologize for the inconvenience. A system error has occurred while processing your request.
        </p>
        <p className="text-sm text-slate-500 mb-8">Error ID: {error.digest || "Unknown"}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need Help?</strong> Contact our support team at{" "}
            <a href="mailto:support@mygovt.gov" className="underline">
              support@mygovt.gov
            </a>
          </p>
        </div>
      </GovernmentCard>
    </div>
  )
}
