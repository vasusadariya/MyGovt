"use client"

import type React from "react"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const withAuth = (WrappedComponent: React.ComponentType, requiredRole: string) => {
  return (props: any) => {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === "loading") return // Still loading

      if (!session) {
        router.push("/auth/signin")
        return
      }

      if (session.user.role !== requiredRole) {
        router.push("/unauthorized")
        return
      }
    }, [session, status, router])

    if (status === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (session && session.user.role === requiredRole) {
      return <WrappedComponent {...props} />
    }

    return null
  }
}

export default withAuth
