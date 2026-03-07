import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

const FREE_LIMIT = 5

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const links = await db.link.findMany({
    where: { userId: session.userId },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(links)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const user = await db.user.findUnique({ where: { id: session.userId } })
  if (!user) return NextResponse.json({ error: 'Kullanici bulunamadi' }, { status: 404 })

  const count = await db.link.count({ where: { userId: session.userId } })
  if (!user.isPro && count >= FREE_LIMIT) {
    return NextResponse.json(
      { error: `Ucretsiz planda en fazla ${FREE_LIMIT} link ekleyebilirsiniz` },
      { status: 403 }
    )
  }

  const { title, url } = await req.json()
  if (!title?.trim() || !url?.trim()) {
    return NextResponse.json({ error: 'Baslik ve URL zorunludur' }, { status: 400 })
  }

  const maxOrder = await db.link.aggregate({
    where: { userId: session.userId },
    _max: { order: true },
  })
  const order = (maxOrder._max.order ?? -1) + 1

  const link = await db.link.create({
    data: { userId: session.userId, title: title.trim(), url: url.trim(), order },
  })
  return NextResponse.json(link, { status: 201 })
}
