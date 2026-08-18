import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { isValidHttpUrl } from '@/lib/validate'

const TITLE_MAX = 80

async function getOwnedLink(userId: string, id: string) {
  return db.link.findFirst({ where: { id, userId } })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params
  const link = await getOwnedLink(session.userId, id)
  if (!link) return NextResponse.json({ error: 'Bulunamadi' }, { status: 404 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > TITLE_MAX) {
      return NextResponse.json({ error: `Baslik 1-${TITLE_MAX} karakter olmalidir` }, { status: 400 })
    }
    data.title = body.title.trim()
  }
  if (body.url !== undefined) {
    if (typeof body.url !== 'string' || !isValidHttpUrl(body.url.trim())) {
      return NextResponse.json(
        { error: 'Gecerli bir http:// veya https:// adresi girin' },
        { status: 400 }
      )
    }
    data.url = body.url.trim()
  }
  if (body.isActive !== undefined) {
    if (typeof body.isActive !== 'boolean') {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }
    data.isActive = body.isActive
  }
  if (body.order !== undefined) {
    if (typeof body.order !== 'number' || !Number.isInteger(body.order) || body.order < 0) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }
    data.order = body.order
  }

  const updated = await db.link.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params
  const link = await getOwnedLink(session.userId, id)
  if (!link) return NextResponse.json({ error: 'Bulunamadi' }, { status: 404 })

  await db.link.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
