import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
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

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/ipfs/:path*", "/api/protected/:path*"],
}
