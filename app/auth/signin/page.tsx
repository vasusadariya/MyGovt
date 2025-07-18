"use client"

import React, { useState, useEffect } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Chrome, AlertCircle } from "lucide-react"
import { Button } from "../../../components/ui/button"

interface SessionUser {
  role?: string | null
}

interface SessionType {
  user?: SessionUser
}

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  useEffect(() => {
    // Check if user is already signed in
    const checkSession = async () => {
      const session = await getSession() as SessionType | null
      if (session) {
        // Redirect based on role
        const role = session.user?.role
        switch (role) {
          case "admin":
            router.push("/dashboard/admin")
            break
          case "candidate":
            router.push("/dashboard/candidate")
            break
          default:
            router.push("/dashboard/users")
            break
        }
      }
    }
    checkSession()
  }, [router])

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        // Get the session to determine redirect
        const session = await getSession() as SessionType | null
        const role = session?.user?.role

        switch (role) {
          case "admin":
            router.push("/dashboard/admin")
            break
          case "candidate":
            router.push("/dashboard/candidate")
            break
          default:
            router.push("/dashboard/users")
            break
        }
      }
    } catch (error) {
      console.error("Error signing in:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")

    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Error signing in:", error)
      setError("Google sign-in failed")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-blue-200">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-blue-900 mb-2">Welcome Back</CardTitle>
          <p className="text-blue-700">Sign in to your government account</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sign In Failed:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
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
                  placeholder="Enter your email"
                  className="pl-10"
                  variant="government"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  variant="government"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="government" 
              className="w-full" 
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full bg-white hover:bg-gray-50"
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5 mr-2" />
            {isLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800">
                Forgot your password?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}