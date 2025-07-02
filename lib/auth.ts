import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

import type { Session } from "next-auth"

export async function getServerAuthSession(): Promise<Session | null> {
  return await getServerSession(authOptions)
}

export function requireAuth(allowedRoles?: string[]) {
  return async () => {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    return null // No error, proceed
  }
}
