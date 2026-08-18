import { NextRequest } from 'next/server'

// Basit bellek-içi rate limiter (tek PM2 instance için yeterli).
const buckets = new Map<string, { count: number; reset: number }>()

function cleanup(now: number) {
  if (buckets.size < 10_000) return
  for (const [key, b] of buckets) {
    if (now > b.reset) buckets.delete(key)
  }
}

/** windowMs içinde limit'ten fazla çağrı yapılırsa false döner. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  cleanup(now)
  const b = buckets.get(key)
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (b.count >= limit) return false
  b.count++
  return true
}

export function getClientIp(req: NextRequest): string {
  // nginx X-Real-IP / X-Forwarded-For set ediyor
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  )
}
