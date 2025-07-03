"use client"

import Link from "next/link"
import { Shield, ArrowLeft, Home } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-orange-200">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-orange-900 mb-2">Access Denied</CardTitle>
          <p className="text-orange-700">You don&apos;t have permission to access this page</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              This page requires specific permissions that your account doesn&apos;t have. 
              Please contact an administrator if you believe this is an error.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => window.history.back()}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>

            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Need access?{" "}
              <Link href="/support" className="text-orange-600 hover:text-orange-800 font-semibold">
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}