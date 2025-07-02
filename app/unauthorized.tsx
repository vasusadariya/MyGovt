"use client"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

// The User type is extended in a separate declaration file (see types/next-auth.d.ts)
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { ShieldX, ArrowLeft, LogOut } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    // Redirect based on user role
    if (session?.user?.role === "admin") {
      router.push("/dashboard/admin")
    } else if (session?.user?.role === "candidate") {
      router.push("/dashboard/candidate")
    } else {
      router.push("/dashboard/users")
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-xl border-2 border-red-200">
        <div className="mb-6">
          <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>

        <Alert variant="destructive" className="mb-6">
          <ShieldX className="h-4 w-4" />
          <div>
            <h4 className="font-semibold">Unauthorized Access</h4>
            <p className="text-sm">
              Your current role ({session?.user?.role || "unknown"}) doesn&apos;t have access to this resource.
            </p>
          </div>
        </Alert>

        <div className="space-y-3">
          <Button onClick={handleGoHome} variant="government" className="w-full">
            Go to Dashboard
          </Button>

          <Button onClick={handleGoBack} variant="outline" className="w-full bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <Button onClick={handleSignOut} variant="destructive" className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">If you believe this is an error, please contact your administrator.</p>
        </div>
      </Card>
    </div>
  )
}
