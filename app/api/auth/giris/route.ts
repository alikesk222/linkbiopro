import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken, COOKIE, SESSION_COOKIE_OPTIONS } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!rateLimit(`giris:${ip}`, 10, 15 * 60_000)) {
    return NextResponse.json(
      { error: 'Çok fazla deneme. Lütfen 15 dakika sonra tekrar deneyin.' },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.toLowerCase().trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json({ error: 'E-posta ve sifre gereklidir' }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'E-posta veya sifre yanlis' }, { status: 401 })
  }

  const token = await signToken(user.id)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, SESSION_COOKIE_OPTIONS)
  return res
}
