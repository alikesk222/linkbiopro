import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const data: Record<string, unknown> = {}

  if (body.isPro !== undefined) data.isPro = body.isPro
  if (body.proExpiresAt !== undefined) {
    data.proExpiresAt = body.proExpiresAt ? new Date(body.proExpiresAt) : null
  }
  if (body.proNote !== undefined) data.proNote = body.proNote || null

  const user = await db.user.update({
    where: { id },
    data,
    select: {
      id: true, email: true, username: true, displayName: true,
      isPro: true, proExpiresAt: true, proNote: true,
    },
  })
  return NextResponse.json(user)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { id } = await params
  await db.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
