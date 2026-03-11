import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

// iyzico sandbox config
const IYZICO_API_KEY = process.env.IYZICO_API_KEY || 'sandbox-api-key'
const IYZICO_SECRET = process.env.IYZICO_SECRET_KEY || 'sandbox-secret'
const IYZICO_BASE_URL = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const user = await db.user.findUnique({ where: { id: session.userId } })
  if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  if (user.isPro) return NextResponse.json({ error: 'Zaten Pro üyesiniz' }, { status: 400 })

  const { plan = 'monthly' } = await req.json()
  const price = plan === 'yearly' ? '708.00' : '59.00'
  const paidPrice = price

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`

  // iyzipay npm package integration
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Iyzipay = require('iyzipay')
  const iyzipay = new Iyzipay({
    apiKey: IYZICO_API_KEY,
    secretKey: IYZICO_SECRET,
    uri: IYZICO_BASE_URL,
  })

  const conversationId = `${user.id}-${Date.now()}`

  const request = {
    locale: 'tr',
    conversationId,
    price,
    paidPrice,
    currency: 'TRY',
    basketId: `pro-${plan}-${user.id}`,
    paymentGroup: 'SUBSCRIPTION',
    callbackUrl: `${baseUrl}/api/payment/webhook?userId=${user.id}&plan=${plan}`,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: user.id,
      name: user.displayName.split(' ')[0] || 'Kullanici',
      surname: user.displayName.split(' ').slice(1).join(' ') || 'Soyad',
      gsmNumber: '+905000000000',
      email: user.email,
      identityNumber: '74300864791',
      registrationAddress: 'Turkiye',
      ip: req.headers.get('x-forwarded-for') || '85.34.78.112',
      city: 'Istanbul',
      country: 'Turkey',
    },
    shippingAddress: { contactName: user.displayName, city: 'Istanbul', country: 'Turkey', address: 'Turkiye' },
    billingAddress: { contactName: user.displayName, city: 'Istanbul', country: 'Turkey', address: 'Turkiye' },
    basketItems: [
      {
        id: `pro-${plan}`,
        name: `LinkBio Pro - ${plan === 'yearly' ? 'Yıllık' : 'Aylık'} Plan`,
        category1: 'SaaS',
        category2: 'Abonelik',
        itemType: 'VIRTUAL',
        price,
      },
    ],
  }

  return new Promise<NextResponse>((resolve) => {
    iyzipay.checkoutFormInitialize.create(request, (err: unknown, result: { status: string; paymentPageUrl: string; token: string }) => {
      if (err || result.status !== 'success') {
        resolve(NextResponse.json({ error: 'Ödeme başlatılamadı' }, { status: 500 }))
        return
      }
      resolve(NextResponse.json({ paymentPageUrl: result.paymentPageUrl, token: result.token }))
    })
  })
}
