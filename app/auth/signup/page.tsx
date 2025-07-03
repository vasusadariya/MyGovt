"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Badge } from "../../../components/ui/badge"
import { Loader2, Mail, Lock, User, Chrome, UserCheck, Vote, Shield, AlertCircle } from "lucide-react"

interface FormData {
  name: string
  email: string
  password: string
  role: "user" | "candidate" | ""
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Account created but sign-in failed. Please try signing in manually.")
      } else {
        switch (formData.role) {
          case "candidate":
            router.push("/dashboard/candidate")
            break
          default:
            router.push("/dashboard/users")
            break
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
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
      console.error("Error signing in:", error)
      setError("Google sign-in failed")
      setLoading(false)
    }
  }

  const handleRoleSelect = (role: "user" | "candidate") => {
    setFormData({ ...formData, role })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg border-0 shadow-2xl bg-white">
          <CardHeader className="bg-gradient-to-r from-green-800 to-green-900 text-white rounded-t-lg p-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-green-200" />
            </div>
            <CardTitle className="text-3xl font-bold text-center">Join Government Portal</CardTitle>
            <CardDescription className="text-green-100 text-center text-lg">
              Register for Digital Civic Services
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full legal name"
                    className="pl-12 h-14 border-2 border-slate-300 focus:border-green-600 rounded-lg text-lg"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="pl-12 h-14 border-2 border-slate-300 focus:border-green-600 rounded-lg text-lg"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a secure password"
                    className="pl-12 h-14 border-2 border-slate-300 focus:border-green-600 rounded-lg text-lg"
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-slate-500">Minimum 6 characters required</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Account Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formData.role === "user" ? "default" : "outline"}
                    onClick={() => handleRoleSelect("user")}
                    className={`h-20 flex flex-col items-center justify-center gap-2 ${
                      formData.role === "user"
                        ? "bg-blue-700 hover:bg-blue-800 text-white border-blue-700"
                        : "border-2 border-slate-300 hover:bg-slate-50 text-slate-700"
                    }`}
                    disabled={loading}
                  >
                    <Vote className="w-6 h-6" />
                    <span className="text-sm font-semibold">Citizen Voter</span>
                  </Button>
                  <Button
                    type="button"
                    variant={formData.role === "candidate" ? "default" : "outline"}
                    onClick={() => handleRoleSelect("candidate")}
                    className={`h-20 flex flex-col items-center justify-center gap-2 ${
                      formData.role === "candidate"
                        ? "bg-purple-700 hover:bg-purple-800 text-white border-purple-700"
                        : "border-2 border-slate-300 hover:bg-slate-50 text-slate-700"
                    }`}
                    disabled={loading}
                  >
                    <UserCheck className="w-6 h-6" />
                    <span className="text-sm font-semibold">Candidate</span>
                  </Button>
                </div>
                {formData.role && (
                  <div className="flex justify-center">
                    <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                      Selected: {formData.role === "user" ? "Citizen Voter" : "Political Candidate"}
                    </Badge>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-green-800 hover:bg-green-900 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-200"
                disabled={loading || !formData.name || !formData.email || !formData.password || !formData.role}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Government Account"
                )}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">Or register with</span>
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
                Already registered?{" "}
                <Link href="/auth/signin" className="text-green-800 hover:text-green-900 font-semibold">
                  Sign In Here
                </Link>
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                By registering, you agree to comply with all government digital service terms and conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}