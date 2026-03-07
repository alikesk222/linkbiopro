import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      isPro: true,
      proExpiresAt: true,
      proNote: true,
      createdAt: true,
      _count: { select: { links: true } },
      links: { select: { clicks: true } },
    },
  })

  return NextResponse.json(
    users.map(u => ({
      ...u,
      totalLinks: u._count.links,
      totalClicks: u.links.reduce((s, l) => s + l.clicks, 0),
      links: undefined,
      _count: undefined,
    }))
  )
}
