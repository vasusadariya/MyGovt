"use client"

import React, { useEffect, type ComponentType } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Define the user type with role
interface UserWithRole {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: "user" | "candidate" | "admin"
}

// Define session type with our custom user
interface SessionWithRole {
  user: UserWithRole
  expires: string
}

// Props type for components that will be wrapped
interface WithAuthProps {
  session?: SessionWithRole
  user?: UserWithRole
}

// Configuration for the HOC
interface WithAuthConfig {
  requiredRole?: "user" | "candidate" | "admin"
  redirectTo?: string
  loadingComponent?: ComponentType
}

// Default loading component
const DefaultLoadingComponent: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
)

// Higher-order component for authentication
function withAuth<P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>, 
  config: WithAuthConfig = {}
) {
  const {
    requiredRole,
    redirectTo = "/auth/signin",
    loadingComponent: LoadingComponent = DefaultLoadingComponent,
  } = config

  const ComponentWithAuth: React.FC<Omit<P, keyof WithAuthProps>> = (props) => {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      // Still loading authentication state
      if (status === "loading") return

      // No session found, redirect to sign in
      if (!session) {
        router.push(redirectTo)
        return
      }

      // Check if user has required role (if specified)
      if (requiredRole && session.user?.role !== requiredRole) {
        router.push("/unauthorized")
        return
      }
    }, [session, status, router])

    // Show loading state while checking authentication
    if (status === "loading") {
      return <LoadingComponent />
    }

    // No session, don't render anything (redirect is happening)
    if (!session) {
      return null
    }

    // Check role requirement
    if (requiredRole && session.user?.role !== requiredRole) {
      return null
    }

    // All checks passed, render the wrapped component
    return (
      <WrappedComponent 
        {...(props as P)} 
        session={session as SessionWithRole} 
        user={session.user as UserWithRole} 
      />
    )
  }

  // Set display name for debugging
  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`

  return ComponentWithAuth
}

// Convenience functions for common use cases
export const withAdminAuth = <P extends WithAuthProps>(Component: ComponentType<P>) =>
  withAuth(Component, { requiredRole: "admin" })

export const withCandidateAuth = <P extends WithAuthProps>(Component: ComponentType<P>) =>
  withAuth(Component, { requiredRole: "candidate" })

export const withUserAuth = <P extends WithAuthProps>(Component: ComponentType<P>) =>
  withAuth(Component, { requiredRole: "user" })

// Export types for use in other components
export type { UserWithRole, SessionWithRole, WithAuthProps, WithAuthConfig }

export default withAuth