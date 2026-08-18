import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isValidHttpUrl } from '@/lib/validate'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const link = await db.link.findUnique({ where: { id } })
  // Yalnızca http(s) adreslerine yönlendir (eski kayıtlarda kalmış olabilecek
  // geçersiz şemalara karşı koruma)
  if (!link || !link.isActive || !isValidHttpUrl(link.url)) {
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
