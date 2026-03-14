'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const PLATFORM_SUGGESTIONS = [
  { title: 'Instagram', placeholder: 'https://instagram.com/kullaniciadiniz' },
  { title: 'YouTube', placeholder: 'https://youtube.com/@kullaniciadiniz' },
  { title: 'TikTok', placeholder: 'https://tiktok.com/@kullaniciadiniz' },
  { title: 'Web Sitesi', placeholder: 'https://siteadresiniz.com' },
  { title: 'Twitter / X', placeholder: 'https://x.com/kullaniciadiniz' },
  { title: 'LinkedIn', placeholder: 'https://linkedin.com/in/kullaniciadiniz' },
]

interface StepProps { onNext: () => void }

function Step1Bio({ onNext }: StepProps & { username: string }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">👋</div>
      <h2 className="text-2xl font-bold mb-2">Hoş geldiniz!</h2>
      <p className="text-gray-500 mb-8">Profilinizi oluşturmak sadece birkaç adım sürer.</p>
      <button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
        Başlayalım &rarr;
      </button>
    </div>
  )
}

function Step2Links({ onNext }: StepProps) {
  const [links, setLinks] = useState<{ title: string; url: string }[]>(
    PLATFORM_SUGGESTIONS.slice(0, 3).map(p => ({ title: p.title, url: '' }))
  )
  const [saving, setSaving] = useState(false)

  function setLink(i: number, field: 'title' | 'url', val: string) {
    setLinks(l => l.map((x, idx) => idx === i ? { ...x, [field]: val } : x))
  }

  async function save() {
    setSaving(true)
    const filled = links.filter(l => l.url.trim())
    for (const link of filled) {
      await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link),
      })
    }
    setSaving(false)
    onNext()
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🔗</div>
        <h2 className="text-2xl font-bold mb-2">Linklerinizi ekleyin</h2>
        <p className="text-gray-500">Hangi platformlarda aktifsiniz? URL&apos;leri girin.</p>
      </div>

      <div className="space-y-3 mb-6">
        {links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <select
              value={link.title}
              onChange={e => setLink(i, 'title', e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 w-36 shrink-0"
            >
              {PLATFORM_SUGGESTIONS.map(p => (
                <option key={p.title} value={p.title}>{p.title}</option>
              ))}
            </select>
            <input
              value={link.url}
              onChange={e => setLink(i, 'url', e.target.value)}
              placeholder={PLATFORM_SUGGESTIONS.find(p => p.title === link.title)?.placeholder || 'https://...'}
              type="url"
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        ))}
      </div>

      {links.length < 5 && (
        <button
          type="button"
          onClick={() => setLinks(l => [...l, { title: 'Web Sitesi', url: '' }])}
          className="text-sm text-indigo-600 hover:text-indigo-700 mb-6 block"
        >
          + Link ekle
        </button>
      )}

      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {saving ? 'Kaydediliyor...' : 'Devam Et →'}
        </button>
        <button onClick={onNext} className="text-gray-400 hover:text-gray-700 text-sm px-4 py-3 rounded-xl transition-colors">
          Atla
        </button>
      </div>
    </div>
  )
}

function Step3Theme({ onNext, username }: StepProps & { username: string }) {
  const [theme, setTheme] = useState('koyu')
  const [saving, setSaving] = useState(false)

  const THEMES = [
    { id: 'koyu', label: 'Koyu', preview: 'bg-slate-900' },
    { id: 'acik', label: 'Açık', preview: 'bg-slate-100' },
    { id: 'mor', label: 'Mor', preview: 'bg-gradient-to-br from-violet-900 to-indigo-900' },
    { id: 'pembe', label: 'Pembe', preview: 'bg-gradient-to-br from-pink-900 to-rose-900' },
    { id: 'yesil', label: 'Yeşil', preview: 'bg-gradient-to-br from-emerald-900 to-teal-900' },
  ]

  async function save() {
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme }),
    })
    // Mark onboarding done
    await fetch('/api/onboarding', { method: 'POST' })
    setSaving(false)
    onNext()
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🎨</div>
        <h2 className="text-2xl font-bold mb-2">Tema seçin</h2>
        <p className="text-gray-500">Profilinizin görünümünü kişiselleştirin.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`rounded-2xl p-4 border-2 transition-all ${
              theme === t.id ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-100' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`h-16 rounded-xl mb-2 ${t.preview}`} />
            <p className="text-sm font-medium">{t.label}</p>
          </button>
        ))}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {saving ? 'Kaydediliyor...' : `Profili Tamamla →`}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        Temanızı daha sonra dashboard&apos;dan değiştirebilirsiniz.
      </p>
    </div>
  )
}

function Step4Done({ username }: { username: string }) {
  const router = useRouter()

  return (
    <div className="text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold mb-2">Profiliniz hazır!</h2>
      <p className="text-slate-400 mb-2">Profilinizin adresi:</p>
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 font-mono text-indigo-600 text-sm mb-8 inline-block">
        {typeof window !== 'undefined' ? window.location.origin : ''}/{username}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={`/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Profilimi Gör
        </a>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Dashboard&apos;a Git
        </button>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/me').then(r => {
      if (!r.ok) { router.push('/giris'); return }
      return r.json()
    }).then(u => {
      if (!u) return
      if (u.onboardingDone) { router.push('/dashboard'); return }
      setUsername(u.username)
    })
  }, [router])

  const steps = [
    <Step1Bio key={0} onNext={() => setStep(1)} username={username} />,
    <Step2Links key={1} onNext={() => setStep(2)} />,
    <Step3Theme key={2} onNext={() => setStep(3)} username={username} />,
    <Step4Done key={3} username={username} />,
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Progress */}
        {step < 3 && (
          <div className="flex gap-2 mb-8 justify-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i <= step ? 'bg-indigo-500 w-12' : 'bg-gray-200 w-6'
                }`}
              />
            ))}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          {steps[step]}
        </div>
      </div>
    </div>
  )
}
