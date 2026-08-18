import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'
import { signAdminToken, ADMIN_COOKIE, ADMIN_COOKIE_OPTIONS } from '@/lib/admin-auth'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!rateLimit(`admin-auth:${ip}`, 5, 15 * 60_000)) {
    return NextResponse.json(
      { error: 'Çok fazla deneme. 15 dakika sonra tekrar deneyin.' },
      { status: 429 }
    )
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Yönetim girişi yapılandırılmamış' }, { status: 503 })
  }

  const { password } = await req.json().catch(() => ({}))

  const given = createHash('sha256').update(String(password ?? '')).digest()
  const expected = createHash('sha256').update(ADMIN_PASSWORD).digest()
  if (!timingSafeEqual(given, expected)) {
    return NextResponse.json({ error: 'Sifre yanlis' }, { status: 401 })
  }

  const token = await signAdminToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, ADMIN_COOKIE_OPTIONS)
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '', { maxAge: 0, path: '/' })
  return res
}
