import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const link = await db.link.findUnique({ where: { id } })
  if (!link || !link.isActive) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Track click async (don't block redirect)
  db.link.update({ where: { id }, data: { clicks: { increment: 1 } } }).catch(() => {})
  db.clickLog.create({
    data: {
      linkId: id,
      referrer: req.headers.get('referer') || null,
    },
  }).catch(() => {})

  return NextResponse.redirect(link.url, { status: 302 })
}
