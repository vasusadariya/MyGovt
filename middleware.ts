import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { rateLimiter, getRateLimitIdentifier } from "./lib/rate-limiter"

export default withAuth(
  function middleware(req) {
    // Rate limiting for API routes
    if (req.nextUrl.pathname.startsWith("/api/")) {
      const identifier = getRateLimitIdentifier(req)
      const isAllowed = rateLimiter.isAllowed(identifier, {
        windowMs: 60000, // 1 minute
        maxRequests: 100, // 100 requests per minute
      })

      if (!isAllowed) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 })
      }
    }

    // Security headers
    const response = NextResponse.next()

    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

    // CSP for government security
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.langflow.astra.datastax.com https://*.mypinata.cloud;",
    )

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith("/dashboard/admin")) {
          return token?.role === "admin"
        }

        // Protect candidate routes
        if (req.nextUrl.pathname.startsWith("/dashboard/candidate")) {
          return token?.role === "candidate"
        }

        // Protect user routes
        if (req.nextUrl.pathname.startsWith("/dashboard/users")) {
          return token?.role === "user"
        }

        // Protect any dashboard route
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }

        // Protect API routes (except auth routes)
        if (req.nextUrl.pathname.startsWith("/api/") && !req.nextUrl.pathname.startsWith("/api/auth/")) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ipfs/:path*",
    "/api/candidates/:path*",
    "/api/votes/:path*",
    "/api/complaints/:path*",
    "/api/documents/:path*",
    "/api/admin/:path*",
  ],
}