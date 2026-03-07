import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

async function getOwnedLink(userId: string, id: string) {
  return db.link.findFirst({ where: { id, userId } })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params
  const link = await getOwnedLink(session.userId, id)
  if (!link) return NextResponse.json({ error: 'Bulunamadi' }, { status: 404 })

  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (body.title !== undefined) data.title = body.title.trim()
  if (body.url !== undefined) data.url = body.url.trim()
  if (body.isActive !== undefined) data.isActive = body.isActive
  if (body.order !== undefined) data.order = body.order

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
