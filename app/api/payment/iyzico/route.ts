import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

// Online ödeme PayTR entegrasyonu tamamlanana kadar devre dışı.
// Eski iyzico akışı güvenlik nedeniyle kaldırıldı (webhook'ta userId/plan
// doğrulaması yoktu — git geçmişinde mevcut).
export async function POST() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  return NextResponse.json(
    { error: 'Online ödeme çok yakında aktif olacak. Şimdilik destek e-postasından bize ulaşın.' },
    { status: 503 }
  )
}
