import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken, COOKIE, SESSION_COOKIE_OPTIONS } from '@/lib/auth'
import { isValidEmail, RESERVED_USERNAMES } from '@/lib/validate'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!rateLimit(`kayit:${ip}`, 10, 60 * 60_000)) {
    return NextResponse.json(
      { error: 'Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.' },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }
  const { email, password, username, displayName } = body as Record<string, unknown>

  if (
    typeof email !== 'string' || typeof password !== 'string' ||
    typeof username !== 'string' || typeof displayName !== 'string' ||
    !email || !password || !username || !displayName.trim()
  ) {
    return NextResponse.json({ error: 'Tum alanlar zorunludur' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Gecerli bir e-posta adresi girin' }, { status: 400 })
  }
  if (password.length < 6 || password.length > 72) {
    return NextResponse.json({ error: 'Sifre 6-72 karakter olmalidir' }, { status: 400 })
  }
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json(
      { error: 'Kullanici adi 3-20 karakter, sadece harf/rakam/alt cizgi' },
      { status: 400 }
    )
  }
  if (RESERVED_USERNAMES.has(username)) {
    return NextResponse.json({ error: 'Bu kullanici adi kullanilamaz' }, { status: 400 })
  }
  if (displayName.trim().length > 50) {
    return NextResponse.json({ error: 'Gorunen ad en fazla 50 karakter olabilir' }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()

  const existing = await db.user.findFirst({
    where: { OR: [{ email: normalizedEmail }, { username }] },
  })
  if (existing) {
    return NextResponse.json(
      { error: existing.email === normalizedEmail ? 'Bu e-posta zaten kayitli' : 'Bu kullanici adi alinmis' },
      { status: 409 }
    )
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await db.user.create({
    data: { email: normalizedEmail, password: hash, username, displayName: displayName.trim() },
  })

  const token = await signToken(user.id)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, SESSION_COOKIE_OPTIONS)
  return res
}
