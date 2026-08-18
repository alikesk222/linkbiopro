import { NextResponse } from 'next/server'

// Eski iyzico webhook'u kaldırıldı: userId ve plan parametrelerini istekten
// okuyup doğrulamadan Pro aktifleştiriyordu (token replay + hesap sahteleme
// açığı). PayTR entegrasyonunda hash doğrulamalı yeni bildirim ucu yazılacak.
export async function POST() {
  return NextResponse.json({ error: 'Bu uç artık kullanılmıyor' }, { status: 410 })
}
