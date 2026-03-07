import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const [totalUsers, proUsers, totalLinks, totalClicks] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { isPro: true } }),
    db.link.count(),
    db.link.aggregate({ _sum: { clicks: true } }),
  ])

  return NextResponse.json({
    totalUsers,
    proUsers,
    freeUsers: totalUsers - proUsers,
    totalLinks,
    totalClicks: totalClicks._sum.clicks ?? 0,
  })
}
