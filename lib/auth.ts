import { getServerSession } from "next-auth/next"
import { authOptions } from "../app/api/auth/[...nextauth]/route"
import type { Session } from "next-auth"
import { NextResponse } from "next/server"

export async function getServerAuthSession(): Promise<Session | null> {
  return await getServerSession(authOptions)
}

export function requireAuth(allowedRoles?: string[]) {
  return async () => {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (allowedRoles && session.user.role && !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return null // No error, proceed
  }
}

export async function getCurrentUser() {
  const session = await getServerAuthSession()
  return session?.user || null
}

export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user
}

export function hasRole(session: Session | null, role: string): boolean {
  return session?.user?.role === role
}

export function hasAnyRole(session: Session | null, roles: string[]): boolean {
  return !!session?.user?.role && roles.includes(session.user.role)
}