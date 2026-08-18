import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'avatars')
const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const AVATAR_PX = 400

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('avatar') as File | null

  if (!file) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    return NextResponse.json({ error: 'Sadece JPG, PNG, WebP veya GIF yükleyebilirsiniz' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Dosya 2MB\'dan büyük olamaz' }, { status: 400 })
  }

  // sharp ile yeniden kodlama: gerçek içerik doğrulaması + sabit boyut + optimizasyon.
  // Görsel olmayan/bozuk dosyalar burada reddedilir.
  let processed: Buffer
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    processed = await sharp(buffer, { limitInputPixels: 25_000_000 })
      .rotate()
      .resize(AVATAR_PX, AVATAR_PX, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer()
  } catch {
    return NextResponse.json({ error: 'Dosya geçerli bir görsel değil' }, { status: 400 })
  }

  const filename = `${session.userId}.webp`
  await mkdir(UPLOAD_DIR, { recursive: true })
  await writeFile(join(UPLOAD_DIR, filename), processed)

  // Cache'i kırmak için sürüm parametresi
  const avatarUrl = `/uploads/avatars/${filename}?v=${Date.now()}`
  await db.user.update({
    where: { id: session.userId },
    data: { avatarUrl },
  })

  return NextResponse.json({ avatarUrl })
}

export async function DELETE() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  await db.user.update({
    where: { id: session.userId },
    data: { avatarUrl: null },
  })
  return NextResponse.json({ ok: true })
}
