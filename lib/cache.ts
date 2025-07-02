// Simple in-memory cache for API responses
class SimpleCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>()

  set(key: string, data: unknown, ttlSeconds = 300) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }
}

export const apiCache = new SimpleCache()
