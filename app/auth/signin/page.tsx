"use client"

import { useState, type FormEvent } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Chrome, Shield } from "lucide-react"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        const session = await getSession()
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
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      await signIn("google", {
        callbackUrl: "/dashboard/users",
      })
    } catch (error) {
      setError("Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-t-lg p-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-200" />
            </div>
            <CardTitle className="text-3xl font-bold text-center">Government Portal</CardTitle>
            <CardDescription className="text-blue-100 text-center text-lg">
              Secure Access to Digital Services
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your government email"
                    className="pl-12 h-14 border-2 border-slate-300 focus:border-blue-600 rounded-lg text-lg"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your secure password"
                    className="pl-12 h-14 border-2 border-slate-300 focus:border-blue-600 rounded-lg text-lg"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-blue-800 hover:bg-blue-900 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Secure Sign In"
                )}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full h-14 mt-6 border-2 border-slate-300 hover:bg-slate-50 bg-white text-slate-700 font-semibold text-lg rounded-lg"
                disabled={loading}
              >
                <Chrome className="w-5 h-5 mr-3" />
                Google Government Account
              </Button>
            </div>

            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-slate-600">
                Need an account?{" "}
                <Link href="/auth/signup" className="text-blue-800 hover:text-blue-900 font-semibold">
                  Register Here
                </Link>
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                This is a secure government portal. All access is monitored and logged for security purposes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
