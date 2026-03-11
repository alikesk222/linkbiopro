import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const IYZICO_API_KEY = process.env.IYZICO_API_KEY || 'sandbox-api-key'
const IYZICO_SECRET = process.env.IYZICO_SECRET_KEY || 'sandbox-secret'
const IYZICO_BASE_URL = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'

export async function POST(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const plan = req.nextUrl.searchParams.get('plan') || 'monthly'

  if (!userId) return NextResponse.redirect(new URL('/pro?error=missing-user', req.url))

  const formData = await req.formData()
  const token = formData.get('token') as string
  if (!token) return NextResponse.redirect(new URL('/pro?error=no-token', req.url))

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Iyzipay = require('iyzipay')
  const iyzipay = new Iyzipay({ apiKey: IYZICO_API_KEY, secretKey: IYZICO_SECRET, uri: IYZICO_BASE_URL })

  return new Promise<NextResponse>((resolve) => {
    iyzipay.checkoutForm.retrieve({ locale: 'tr', token }, async (err: unknown, result: { status: string; paymentStatus: string }) => {
      if (err || result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
        resolve(NextResponse.redirect(new URL('/pro?error=payment-failed', req.url)))
        return
      }

      // Activate Pro
      const expiresAt = new Date()
      if (plan === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      }

      await db.user.update({
        where: { id: userId },
        data: {
          isPro: true,
          proExpiresAt: expiresAt,
          proNote: `iyzico - ${plan === 'yearly' ? 'Yıllık' : 'Aylık'} - ${new Date().toLocaleDateString('tr-TR')}`,
        },
      })

      resolve(NextResponse.redirect(new URL('/dashboard?pro=activated', req.url)))
    })
  })
}
