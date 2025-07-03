"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Alert, AlertDescription } from "../../../components/ui/alert"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
    } catch (error) {
        console.error(error)
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2 border-green-200">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-900 mb-2">Check Your Email</CardTitle>
            <p className="text-green-700">Password reset instructions sent</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                We&apos;ve sent password reset instructions to <strong>{email}</strong>. 
                Please check your email and follow the link to reset your password.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/auth/signin">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>

              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
                variant="outline"
                className="w-full"
              >
                Send Another Email
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button 
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail("")
                  }}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  try again
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-blue-200">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-blue-900 mb-2">Reset Password</CardTitle>
          <p className="text-blue-700">Enter your email to receive reset instructions</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="pl-10"
                  variant="government"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="government" 
              className="w-full" 
              disabled={isLoading || !email}
            >
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}