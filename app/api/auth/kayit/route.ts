import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken, COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password, username, displayName } = await req.json()

  if (!email || !password || !username || !displayName) {
    return NextResponse.json({ error: 'Tum alanlar zorunludur' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Sifre en az 6 karakter olmalidir' }, { status: 400 })
  }
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json(
      { error: 'Kullanici adi 3-20 karakter, sadece harf/rakam/alt cizgi' },
      { status: 400 }
    )
  }

  const existing = await db.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })
  if (existing) {
    return NextResponse.json(
      { error: existing.email === email ? 'Bu e-posta zaten kayitli' : 'Bu kullanici adi alinmis' },
      { status: 409 }
    )
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await db.user.create({
    data: { email, password: hash, username, displayName },
  })

  const token = await signToken(user.id)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}
