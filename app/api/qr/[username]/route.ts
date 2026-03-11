import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { db } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  const user = await db.user.findUnique({ where: { username } })
  if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`
  const profileUrl = `${baseUrl}/${username}`

  const svg = await QRCode.toString(profileUrl, {
    type: 'svg',
    margin: 2,
    color: { dark: '#6366f1', light: '#0a0f1e' },
  })

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
