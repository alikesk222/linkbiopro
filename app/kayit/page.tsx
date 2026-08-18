'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function KayitPage() {
  const [form, setForm] = useState({ email: '', password: '', username: '', displayName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function set(field: string, val: string) {
    setForm(f => ({ ...f, [field]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/kayit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Kayıt başarısız')
      router.push('/onboarding')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <header className="border-b border-line bg-paper/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/"><Logo /></Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-ink mb-2">Hesap Oluştur</h1>
            <p className="text-ink-soft">Ücretsiz, kredi kartı gerekmez.</p>
          </div>

          <div className="bg-white border border-line rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1.5">Görünen Ad</label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={e => set('displayName', e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  required
                  disabled={loading}
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1.5">
                  Kullanıcı Adı
                  <span className="text-ink-faint font-normal ml-2 text-xs">
                    linkbiopro.com.tr/<span className="text-brand-600 font-medium">{form.username || 'siz'}</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="ahmet"
                  required
                  disabled={loading}
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                />
                <p className="text-xs text-ink-faint mt-1">Sadece harf, rakam ve alt çizgi (3-20 karakter)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1.5">E-posta</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="siz@ornek.com"
                  required
                  disabled={loading}
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1.5">Şifre</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="En az 6 karakter"
                  required
                  disabled={loading}
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Hesap oluşturuluyor...
                  </span>
                ) : 'Hesap Oluştur'}
              </button>

              <p className="text-center text-xs text-ink-faint">
                Hesap oluşturarak <Link href="/kullanim-sartlari" className="underline hover:text-ink-soft">kullanım koşullarını</Link> kabul etmiş olursunuz.
              </p>
            </form>
          </div>

          <p className="text-center text-sm text-ink-soft mt-6">
            Zaten hesabınız var mı?{' '}
            <Link href="/giris" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
              Giriş Yap
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
