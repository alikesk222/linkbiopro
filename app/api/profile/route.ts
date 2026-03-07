import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

const ALLOWED_THEMES = ['koyu', 'acik', 'mor', 'pembe', 'yesil']
const PRO_THEMES = ['mor', 'pembe', 'yesil']

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const user = await db.user.findUnique({ where: { id: session.userId } })
  if (!user) return NextResponse.json({ error: 'Bulunamadi' }, { status: 404 })

  const body = await req.json()
  const data: Record<string, unknown> = {}

  if (body.displayName !== undefined) {
    if (!body.displayName.trim()) {
      return NextResponse.json({ error: 'Gorununen ad zorunludur' }, { status: 400 })
    }
    data.displayName = body.displayName.trim()
  }

  if (body.bio !== undefined) data.bio = body.bio.trim() || null

  if (body.theme !== undefined) {
    if (!ALLOWED_THEMES.includes(body.theme)) {
      return NextResponse.json({ error: 'Gecersiz tema' }, { status: 400 })
    }
    if (PRO_THEMES.includes(body.theme) && !user.isPro) {
      return NextResponse.json({ error: 'Bu tema Pro plana ozeldir' }, { status: 403 })
    }
    data.theme = body.theme
  }

  const updated = await db.user.update({
    where: { id: session.userId },
    data,
    select: {
      id: true, email: true, username: true, displayName: true,
      bio: true, avatarUrl: true, theme: true, isPro: true,
    },
  })
  return NextResponse.json(updated)
}
