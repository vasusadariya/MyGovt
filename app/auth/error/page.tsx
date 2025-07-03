"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Alert, AlertDescription } from "../../../components/ui/alert"

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
  CredentialsSignin: "Invalid email or password. Please check your credentials and try again.",
  EmailCreateAccount: "Could not create account with this email address.",
  EmailSignin: "Could not send email. Please try again.",
  SessionRequired: "Please sign in to access this page.",
  Callback: "An error occurred in the authentication callback.",
  OAuthAccountNotLinked: "This account is already linked to another user.",
  OAuthCallback: "An error occurred during OAuth authentication.",
  OAuthCreateAccount: "Could not create account with OAuth provider.",
  OAuthSignin: "Could not sign in with OAuth provider.",
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Default"
  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-red-200">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-900 mb-2">Authentication Error</CardTitle>
          <p className="text-red-700">We encountered an issue while signing you in</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {errorMessage}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Link href="/auth/signin">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>

            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Link href="/">
              <Button variant="ghost" className="w-full">
                Return to Home
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <Link href="/support" className="text-blue-600 hover:text-blue-800 font-semibold">
                Contact Support
              </Link>
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">
                <strong>Error Code:</strong> {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}