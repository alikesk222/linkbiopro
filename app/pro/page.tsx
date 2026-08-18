'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { COMPANY } from '@/lib/company'

interface User {
  username: string
  displayName: string
  isPro: boolean
}

export default function ProPage() {
  const [user, setUser] = useState<User | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(u => setUser(u))
  }, [])

  function copyEmail() {
    navigator.clipboard.writeText(COMPANY.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (user?.isPro) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-ink text-white">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="font-display text-3xl font-bold mb-2">Zaten Pro üyesiniz!</h1>
          <p className="text-white/50 mb-6">Tüm Pro özelliklerine erişiminiz var.</p>
          <Link href="/dashboard" className="bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Dashboard&apos;a Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink text-white">
      <header className="border-b border-white/10 bg-ink/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-display font-bold text-sm">L</div>
            <span className="font-display font-bold text-white text-lg tracking-tight">LinkBio Pro</span>
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">
              &larr; Dashboard
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-1.5 text-sm text-brand-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            Pro Plan
          </div>
          <h1 className="font-display text-4xl font-bold mb-3">Pro&apos;ya Geç</h1>
          <p className="text-white/50 text-lg">Ayda sadece ₺59 ile tüm özelliklere erişin.</p>
        </div>

        {/* Features comparison */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold text-white/50 text-sm mb-4 uppercase tracking-wider">Ücretsiz</h3>
            <ul className="space-y-3 text-sm">
              {[
                { text: '5 link', ok: true },
                { text: 'Koyu ve açık tema', ok: true },
                { text: 'Tıklama sayısı', ok: true },
                { text: 'Özel temalar', ok: false },
                { text: 'Sınırsız link', ok: false },
              ].map(f => (
                <li key={f.text} className="flex items-center gap-2">
                  <span className={f.ok ? 'text-teal' : 'text-white/20'}>
                    {f.ok ? '✓' : '✕'}
                  </span>
                  <span className={f.ok ? 'text-white/80' : 'text-white/30'}>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative bg-brand-500/10 border border-brand-500/40 rounded-2xl p-6">
            <div className="absolute -top-3 left-6 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">PRO</div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-display text-3xl font-black">₺59</span>
              <span className="text-white/40 text-sm">/ay</span>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                'Sınırsız link',
                'Tüm temalar (mor, pembe, yeşil)',
                'Detaylı analitik',
                'Öncelikli destek',
                'Yakında: özel domain',
              ].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-brand-400">✓</span>
                  <span className="text-white/80">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment status */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-7 mb-6">
          <h2 className="font-display font-semibold text-white mb-5">Nasıl Pro Olunur?</h2>
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold shrink-0">1</div>
              <div>
                <p className="font-medium text-sm text-white mb-1">Bize ulaşın</p>
                <p className="text-white/50 text-sm">
                  Kredi/banka kartıyla online ödeme çok yakında bu sayfadan
                  aktif olacak. Şimdilik Pro&apos;ya geçmek için aşağıdaki
                  e-postadan kullanıcı adınızla bize yazın, ödeme talimatını
                  size iletelim.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold shrink-0">2</div>
              <div>
                <p className="font-medium text-sm text-white mb-1">Ödemeyi tamamlayın</p>
                <p className="text-white/50 text-sm">
                  Size ilettiğimiz talimata göre ödemeyi yapın. Ödeme
                  onaylandıktan sonra genellikle <strong className="text-white">1-2 saat</strong> içinde
                  Pro hesabınız aktif edilir.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-sm font-bold shrink-0">3</div>
              <div>
                <p className="font-medium text-sm text-white mb-1">Pro aktif oldu!</p>
                <p className="text-white/50 text-sm">Dashboard&apos;ınızda tüm Pro özellikler açılır.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <button
          onClick={copyEmail}
          className="w-full flex items-center gap-3 bg-white/5 border border-white/10 hover:border-brand-500/60 rounded-2xl p-5 transition-colors text-left"
        >
          <div className="text-2xl">📧</div>
          <div>
            <p className="font-medium text-sm text-white">E-posta ile ulaşın</p>
            <p className="text-white/50 text-xs mt-0.5">
              {copied ? <span className="text-teal">Kopyalandı!</span> : COMPANY.email}
            </p>
            {user?.username && (
              <p className="text-white/30 text-xs mt-1">Kullanıcı adınız: {user.username}</p>
            )}
          </div>
        </button>

      </main>
    </div>
  )
}
