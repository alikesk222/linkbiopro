import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const groups = await db.linkGroup.findMany({
    where: { userId: session.userId },
    orderBy: { order: 'asc' },
    include: { links: { orderBy: { order: 'asc' } } },
  })
  return NextResponse.json(groups)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { title } = await req.json()
  if (!title?.trim()) return NextResponse.json({ error: 'Başlık zorunludur' }, { status: 400 })

  const max = await db.linkGroup.aggregate({ where: { userId: session.userId }, _max: { order: true } })
  const group = await db.linkGroup.create({
    data: { userId: session.userId, title: title.trim(), order: (max._max.order ?? -1) + 1 },
  })
  return NextResponse.json(group, { status: 201 })
}
