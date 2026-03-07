import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      theme: true,
      isPro: true,
      createdAt: true,
    },
  })
  if (!user) return NextResponse.json({ error: 'Kullanici bulunamadi' }, { status: 404 })
  return NextResponse.json(user)
}
