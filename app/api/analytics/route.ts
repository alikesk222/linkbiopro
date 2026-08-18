import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const parsed = parseInt(req.nextUrl.searchParams.get('days') || '30', 10)
  const days = Math.min(90, Math.max(1, Number.isNaN(parsed) ? 30 : parsed))

  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  // Get user's link IDs
  const links = await db.link.findMany({
    where: { userId: session.userId },
    select: { id: true, title: true, clicks: true },
  })
  const linkIds = links.map(l => l.id)

  // Get click logs grouped by day
  const logs = await db.clickLog.findMany({
    where: {
      linkId: { in: linkIds },
      clickedAt: { gte: since },
    },
    select: { clickedAt: true, linkId: true },
    orderBy: { clickedAt: 'asc' },
  })

  // Build daily chart data
  const dailyMap: Record<string, number> = {}
  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setDate(d.getDate() + i)
    dailyMap[d.toISOString().split('T')[0]] = 0
  }
  for (const log of logs) {
    const day = log.clickedAt.toISOString().split('T')[0]
    if (dailyMap[day] !== undefined) dailyMap[day]++
  }

  const daily = Object.entries(dailyMap).map(([date, clicks]) => ({ date, clicks }))

  return NextResponse.json({
    daily,
    links: links.sort((a, b) => b.clicks - a.clicks),
    totalClicks: logs.length,
    period: days,
  })
}
