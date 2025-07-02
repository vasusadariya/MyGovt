import type { NextRequest } from "next/server"

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

class RateLimiter {
  private requests = new Map<string, number[]>()

  isAllowed(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Get existing requests for this identifier
    const userRequests = this.requests.get(identifier) || []

    // Filter out requests outside the current window
    const validRequests = userRequests.filter((timestamp) => timestamp > windowStart)

    // Check if under the limit
    if (validRequests.length >= config.maxRequests) {
      return false
    }

    // Add current request
    validRequests.push(now)
    this.requests.set(identifier, validRequests)

    return true
  }

  cleanup() {
    const now = Date.now()
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter((timestamp) => now - timestamp < 3600000) // Keep 1 hour
      if (validRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, validRequests)
      }
    }
  }
}

export const rateLimiter = new RateLimiter()

// Cleanup every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000)

export function getRateLimitIdentifier(request: NextRequest): string {
  // Use IP address or user ID for rate limiting
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : "unknown"
  return ip
}
