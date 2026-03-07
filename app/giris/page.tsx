'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GirisPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Giriş başarısız')
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800/60 bg-[#0a0f1e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">L</div>
            <span className="font-bold text-white text-lg tracking-tight">LinkBio Pro</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Giriş Yap</h1>
            <p className="text-slate-400">Hesabınıza giriş yapın.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="siz@ornek.com"
                required
                disabled={loading}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Şifreniz"
                required
                disabled={loading}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-950/40 border border-red-800/60 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş yapılıyor...
                </span>
              ) : 'Giriş Yap'}
            </button>

            <p className="text-center text-sm text-slate-500">
              Hesabınız yok mu?{' '}
              <Link href="/kayit" className="text-indigo-400 hover:text-white transition-colors">
                Ücretsiz Kayıt Ol
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
