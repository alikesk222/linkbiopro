import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { sanitizeThemeConfig } from '@/lib/validate'

const ALLOWED_THEMES = ['koyu', 'acik', 'mor', 'pembe', 'yesil']
const PRO_THEMES = ['mor', 'pembe', 'yesil']
const DISPLAY_NAME_MAX = 50
const BIO_MAX = 300

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const user = await db.user.findUnique({ where: { id: session.userId } })
  if (!user) return NextResponse.json({ error: 'Bulunamadi' }, { status: 404 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }
  const data: Record<string, unknown> = {}

  if (body.displayName !== undefined) {
    if (typeof body.displayName !== 'string' || !body.displayName.trim()) {
      return NextResponse.json({ error: 'Gorunen ad zorunludur' }, { status: 400 })
    }
    if (body.displayName.trim().length > DISPLAY_NAME_MAX) {
      return NextResponse.json(
        { error: `Gorunen ad en fazla ${DISPLAY_NAME_MAX} karakter olabilir` },
        { status: 400 }
      )
    }
    data.displayName = body.displayName.trim()
  }

  if (body.bio !== undefined) {
    if (body.bio !== null && typeof body.bio !== 'string') {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }
    const bio = (body.bio ?? '').trim()
    if (bio.length > BIO_MAX) {
      return NextResponse.json({ error: `Bio en fazla ${BIO_MAX} karakter olabilir` }, { status: 400 })
    }
    data.bio = bio || null
  }

  if (body.theme !== undefined) {
    if (typeof body.theme !== 'string' || !ALLOWED_THEMES.includes(body.theme)) {
      return NextResponse.json({ error: 'Gecersiz tema' }, { status: 400 })
    }
    if (PRO_THEMES.includes(body.theme) && !user.isPro) {
      return NextResponse.json({ error: 'Bu tema Pro plana ozeldir' }, { status: 403 })
    }
    data.theme = body.theme
  }

  if (body.themeConfig !== undefined) {
    if (!user.isPro) {
      return NextResponse.json({ error: 'Tema editoru Pro plana ozeldir' }, { status: 403 })
    }
    const sanitized = sanitizeThemeConfig(body.themeConfig)
    if (!sanitized) {
      return NextResponse.json({ error: 'Gecersiz tema ayarlari' }, { status: 400 })
    }
    data.themeConfig = sanitized
  }

  const updated = await db.user.update({
    where: { id: session.userId },
    data,
    select: {
      id: true, email: true, username: true, displayName: true,
      bio: true, avatarUrl: true, theme: true, themeConfig: true, isPro: true,
    },
  })
  return NextResponse.json(updated)
}
