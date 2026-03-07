'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
    navigator.clipboard.writeText('destek@linkbiopro.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (user?.isPro) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">Zaten Pro üyesiniz!</h1>
          <p className="text-slate-400 mb-6">Tüm Pro özelliklerine erişiminiz var.</p>
          <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Dashboard&apos;a Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800/60 bg-[#0a0f1e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">L</div>
            <span className="font-bold text-white text-lg tracking-tight">LinkBio Pro</span>
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
              &larr; Dashboard
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-800/50 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Pro Plan
          </div>
          <h1 className="text-4xl font-bold mb-3">Pro&apos;ya Geç</h1>
          <p className="text-slate-400 text-lg">Ayda sadece ₺59 ile tüm özelliklere erişin.</p>
        </div>

        {/* Features comparison */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-400 text-sm mb-4 uppercase tracking-wider">Ücretsiz</h3>
            <ul className="space-y-3 text-sm">
              {[
                { text: '5 link', ok: true },
                { text: 'Koyu ve açık tema', ok: true },
                { text: 'Tıklama sayısı', ok: true },
                { text: 'Özel temalar', ok: false },
                { text: 'Sınırsız link', ok: false },
              ].map(f => (
                <li key={f.text} className="flex items-center gap-2">
                  <span className={f.ok ? 'text-emerald-400' : 'text-slate-700'}>
                    {f.ok ? '✓' : '✕'}
                  </span>
                  <span className={f.ok ? 'text-slate-300' : 'text-slate-600'}>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-700/60 rounded-2xl p-6">
            <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">PRO</div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-black">₺59</span>
              <span className="text-slate-500 text-sm">/ay</span>
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
                  <span className="text-indigo-400">✓</span>
                  <span className="text-slate-300">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment steps */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-7 mb-6">
          <h2 className="font-semibold text-white mb-5">Nasıl Pro Olunur?</h2>
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">1</div>
              <div>
                <p className="font-medium text-sm text-white mb-1">Ödemeyi yapın</p>
                <p className="text-slate-400 text-sm">Aşağıdaki banka hesabına ₺59 havale/EFT yapın.</p>
                <div className="mt-3 bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-sm font-mono space-y-1">
                  <p className="text-slate-400"><span className="text-slate-500">Banka:</span> Ziraat Bankası</p>
                  <p className="text-slate-400"><span className="text-slate-500">IBAN:</span> <span className="text-white">TR00 0001 0000 0000 0000 0000 00</span></p>
                  <p className="text-slate-400"><span className="text-slate-500">Ad:</span> LinkBio Pro</p>
                  <p className="text-yellow-400 text-xs mt-2">⚠ Açıklama kısmına kullanıcı adınızı yazın: <strong>{user?.username || 'kullanici_adiniz'}</strong></p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">2</div>
              <div>
                <p className="font-medium text-sm text-white mb-1">Bize bildirin</p>
                <p className="text-slate-400 text-sm">
                  Ödeme yaptıktan sonra e-posta veya aşağıdaki iletişim kanallarından bize ulaşın.
                  Genellikle <strong className="text-white">1-2 saat</strong> içinde Pro hesabınız aktif edilir.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">3</div>
              <div>
                <p className="font-medium text-sm text-white mb-1">Pro aktif oldu!</p>
                <p className="text-slate-400 text-sm">Dashboard&apos;ınızda tüm Pro özellikler açılır.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={copyEmail}
            className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 hover:border-indigo-600 rounded-2xl p-5 transition-colors text-left"
          >
            <div className="text-2xl">📧</div>
            <div>
              <p className="font-medium text-sm text-white">E-posta</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {copied ? <span className="text-emerald-400">Kopyalandı!</span> : 'destek@linkbiopro.com'}
              </p>
            </div>
          </button>

          <a
            href="https://t.me/linkbiopro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 hover:border-indigo-600 rounded-2xl p-5 transition-colors"
          >
            <div className="text-2xl">💬</div>
            <div>
              <p className="font-medium text-sm text-white">Telegram</p>
              <p className="text-slate-400 text-xs mt-0.5">@linkbiopro</p>
            </div>
          </a>
        </div>

      </main>
    </div>
  )
}
