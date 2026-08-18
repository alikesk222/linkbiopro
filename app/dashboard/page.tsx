'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getPlatformIcon } from '@/lib/social-icons'
import { Logo } from '@/components/Logo'

interface ThemeConfig {
  btnStyle?: 'rounded' | 'pill' | 'square'
  btnColor?: string
  btnTextColor?: string
  fontFamily?: 'inter' | 'poppins' | 'raleway' | 'playfair'
  bgGradient?: boolean
  bgFrom?: string
  bgTo?: string
  titleColor?: string
  cardOpacity?: number
  avatarShape?: 'circle' | 'rounded' | 'square'
  showBio?: boolean
  socialIconStyle?: 'none' | 'left' | 'center'
}

interface User {
  id: string
  email: string
  username: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  theme: string
  themeConfig: ThemeConfig | null
  isPro: boolean
}

interface LinkItem {
  id: string
  title: string
  url: string
  clicks: number
  isActive: boolean
  order: number
}

type Tab = 'linkler' | 'profil' | 'analitik' | 'pro'

const PRESET_THEMES = [
  { id: 'koyu', label: 'Koyu', pro: false },
  { id: 'acik', label: 'Açık', pro: false },
  { id: 'mor', label: 'Mor', pro: true },
  { id: 'pembe', label: 'Pembe', pro: true },
  { id: 'yesil', label: 'Yeşil', pro: true },
]

const BTN_STYLES = [
  { id: 'rounded', label: 'Yuvarlak', cls: 'rounded-xl' },
  { id: 'pill', label: 'Hap', cls: 'rounded-full' },
  { id: 'square', label: 'Köşeli', cls: 'rounded-md' },
]

const FONTS = [
  { id: 'inter', label: 'Inter', style: {} },
  { id: 'poppins', label: 'Poppins', style: { fontFamily: "'Poppins', sans-serif" } },
  { id: 'raleway', label: 'Raleway', style: { fontFamily: "'Raleway', sans-serif" } },
  { id: 'playfair', label: 'Playfair', style: { fontFamily: "'Playfair Display', serif" } },
]

interface AnalyticsData {
  daily: { date: string; clicks: number }[]
  links: { id: string; title: string; clicks: number }[]
  totalClicks: number
}

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  btnStyle: 'rounded',
  btnColor: '#4f46e5',
  btnTextColor: '#ffffff',
  fontFamily: 'inter',
  bgGradient: false,
  bgFrom: '#0a0f1e',
  bgTo: '#6366f1',
  titleColor: '#ffffff',
  cardOpacity: 100,
  avatarShape: 'circle',
  showBio: true,
  socialIconStyle: 'left',
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<LinkItem[]>([])
  const [tab, setTab] = useState<Tab>('linkler')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [addError, setAddError] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    bio: '',
    theme: '',
    themeConfig: DEFAULT_THEME_CONFIG,
  })
  const [profileMsg, setProfileMsg] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsDays, setAnalyticsDays] = useState(30)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [livePreview, setLivePreview] = useState(true)
  const router = useRouter()

  const fetchAll = useCallback(async () => {
    const [uRes, lRes] = await Promise.all([fetch('/api/me'), fetch('/api/links')])
    if (!uRes.ok) { router.push('/giris'); return }
    const u = await uRes.json()
    const l = await lRes.json()
    setUser(u)
    setLinks(l)
    setProfileForm({
      displayName: u.displayName,
      bio: u.bio || '',
      theme: u.theme,
      themeConfig: { ...DEFAULT_THEME_CONFIG, ...(u.themeConfig || {}) },
    })
  }, [router])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function addLink(e: React.FormEvent) {
    e.preventDefault()
    setAddError('')
    setAddLoading(true)
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, url: newUrl }),
    })
    const data = await res.json()
    if (!res.ok) { setAddError(data.error || 'Hata'); setAddLoading(false); return }
    setLinks(l => [...l, data])
    setNewTitle(''); setNewUrl('')
    setAddLoading(false)
    setPreviewKey(k => k + 1)
  }

  async function deleteLink(id: string) {
    if (!confirm('Bu linki silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/links/${id}`, { method: 'DELETE' })
    setLinks(l => l.filter(x => x.id !== id))
    setPreviewKey(k => k + 1)
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/links/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, url: editUrl }),
    })
    if (res.ok) {
      const updated = await res.json()
      setLinks(l => l.map(x => x.id === id ? updated : x))
      setEditId(null)
      setPreviewKey(k => k + 1)
    }
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/links/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    })
    if (res.ok) {
      setLinks(l => l.map(x => x.id === id ? { ...x, isActive: !current } : x))
    }
  }

  async function moveLink(id: string, dir: 'up' | 'down') {
    const sorted = [...links].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex(x => x.id === id)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const a = sorted[idx], b = sorted[swapIdx]
    await Promise.all([
      fetch(`/api/links/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: b.order }) }),
      fetch(`/api/links/${b.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: a.order }) }),
    ])
    setLinks(l => l.map(x => {
      if (x.id === a.id) return { ...x, order: b.order }
      if (x.id === b.id) return { ...x, order: a.order }
      return x
    }))
    setPreviewKey(k => k + 1)
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileMsg('')
    setProfileLoading(true)
    const body: Record<string, unknown> = {
      displayName: profileForm.displayName,
      bio: profileForm.bio,
      theme: profileForm.theme,
    }
    if (user?.isPro) body.themeConfig = profileForm.themeConfig
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) { setProfileMsg(data.error || 'Hata'); setProfileLoading(false); return }
    setUser(data)
    setProfileMsg('Profil kaydedildi!')
    setProfileLoading(false)
    setPreviewKey(k => k + 1)
  }

  async function logout() {
    await fetch('/api/auth/cikis', { method: 'POST' })
    router.push('/')
  }

  function updateThemeConfig(patch: Partial<ThemeConfig>) {
    setProfileForm(f => ({ ...f, themeConfig: { ...f.themeConfig, ...patch } }))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const sortedLinks = [...links].sort((a, b) => a.order - b.order)
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0)

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Navbar */}
      <header className="border-b border-line bg-paper/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <div className="flex items-center gap-4">
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 hover:text-brand-700 transition-colors hidden sm:block font-medium"
            >
              /{user.username} &rarr;
            </a>
            <button
              onClick={logout}
              className="text-sm text-ink-soft hover:text-ink transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8 items-start">

          {/* ─── Main content column ─── */}
          <div className="flex-1 min-w-0">

            {/* Profile URL banner */}
            <div className="bg-brand-50 border border-brand-200 rounded-xl px-5 py-3.5 mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-brand-600 font-medium mb-0.5">Profil adresiniz</p>
                <p className="text-ink font-mono text-sm">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/{user.username}
                </p>
              </div>
              <a
                href={`/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Görüntüle
              </a>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-line mb-6 gap-1 flex-wrap">
              {(['linkler', 'profil', 'analitik'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t)
                    if (t === 'analitik' && !analytics) {
                      fetch(`/api/analytics?days=${analyticsDays}`).then(r => r.json()).then(setAnalytics)
                    }
                  }}
                  className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    tab === t
                      ? 'border-brand-500 text-ink'
                      : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  {t === 'linkler' ? 'Linkler' : t === 'profil' ? 'Profil' : 'Analitik'}
                </button>
              ))}
              {!user.isPro && (
                <button
                  onClick={() => setTab('pro')}
                  className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                    tab === 'pro'
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-brand-500 hover:text-brand-600'
                  }`}
                >
                  ⚡ Pro&apos;ya Geç
                </button>
              )}
            </div>

            {/* ── LINKLER TAB ── */}
            {tab === 'linkler' && (
              <div className="space-y-4">
                <form onSubmit={addLink} className="bg-white border border-line rounded-2xl p-5 shadow-sm">
                  <p className="text-sm font-semibold text-ink mb-4">Yeni Link Ekle</p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="Başlık (örn: Instagram)"
                      required
                      className="bg-white border border-line rounded-xl px-4 py-2.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                    <input
                      value={newUrl}
                      onChange={e => setNewUrl(e.target.value)}
                      placeholder="URL (örn: https://instagram.com/...)"
                      required
                      type="url"
                      className="bg-white border border-line rounded-xl px-4 py-2.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>
                  {addError && <p className="text-red-500 text-xs mb-3">{addError}</p>}
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                  >
                    {addLoading ? 'Ekleniyor...' : '+ Ekle'}
                  </button>
                  {!user.isPro && (
                    <span className="text-xs text-ink-faint ml-3">{links.length}/5 link kullanıldı</span>
                  )}
                </form>

                {sortedLinks.length === 0 ? (
                  <div className="text-center py-12 text-ink-faint">
                    <p className="text-4xl mb-3">🔗</p>
                    <p>Henüz link eklemediniz.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {sortedLinks.map((link, idx) => (
                      <div
                        key={link.id}
                        className={`bg-white border rounded-xl p-4 shadow-sm transition-colors ${
                          link.isActive ? 'border-line' : 'border-line opacity-60'
                        }`}
                      >
                        {editId === link.id ? (
                          <div className="space-y-2">
                            <input
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              className="w-full bg-white border border-line rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                            />
                            <input
                              value={editUrl}
                              onChange={e => setEditUrl(e.target.value)}
                              type="url"
                              className="w-full bg-white border border-line rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => saveEdit(link.id)} className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
                                Kaydet
                              </button>
                              <button onClick={() => setEditId(null)} className="text-ink-soft hover:text-ink text-xs px-3 py-1.5 rounded-lg transition-colors">
                                İptal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => moveLink(link.id, 'up')}
                                disabled={idx === 0}
                                className="text-ink-faint hover:text-ink-soft disabled:opacity-20 text-xs leading-none"
                              >▲</button>
                              <button
                                onClick={() => moveLink(link.id, 'down')}
                                disabled={idx === sortedLinks.length - 1}
                                className="text-ink-faint hover:text-ink-soft disabled:opacity-20 text-xs leading-none"
                              >▼</button>
                            </div>

                            <span className="text-lg shrink-0">{getPlatformIcon(link.url)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-ink truncate">{link.title}</p>
                              <p className="text-ink-faint text-xs truncate">{link.url}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-ink-faint font-mono">{link.clicks} tık</span>
                              <button
                                onClick={() => toggleActive(link.id, link.isActive)}
                                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                                  link.isActive
                                    ? 'bg-teal-soft text-teal border border-teal/30'
                                    : 'bg-paper-alt text-ink-faint border border-line'
                                }`}
                              >
                                {link.isActive ? 'Aktif' : 'Pasif'}
                              </button>
                              <button
                                onClick={() => { setEditId(link.id); setEditTitle(link.title); setEditUrl(link.url) }}
                                className="text-ink-faint hover:text-ink text-xs px-2 py-1 rounded-md hover:bg-paper-alt transition-colors"
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={() => deleteLink(link.id)}
                                className="text-ink-faint hover:text-red-500 text-xs px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                              >
                                Sil
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PROFİL TAB ── */}
            {tab === 'profil' && (
              <form onSubmit={saveProfile} className="space-y-5">
                <div className="bg-white border border-line rounded-2xl p-6 space-y-4 shadow-sm">
                  <h2 className="font-display font-semibold text-ink">Profil Bilgileri</h2>

                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Profil Fotoğrafı</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-xl font-display font-bold text-white overflow-hidden shrink-0">
                        {user.avatarUrl
                          ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                          : user.displayName[0].toUpperCase()
                        }
                      </div>
                      <div>
                        <label className="cursor-pointer bg-white hover:bg-paper-alt border border-line text-sm text-ink-soft px-4 py-2 rounded-lg transition-colors inline-block">
                          {avatarLoading ? 'Yükleniyor...' : 'Fotoğraf Seç'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setAvatarLoading(true)
                              const fd = new FormData()
                              fd.append('avatar', file)
                              const res = await fetch('/api/profile/avatar', { method: 'POST', body: fd })
                              if (res.ok) {
                                const { avatarUrl } = await res.json()
                                setUser(u => u ? { ...u, avatarUrl } : u)
                                setPreviewKey(k => k + 1)
                              }
                              setAvatarLoading(false)
                            }}
                          />
                        </label>
                        <p className="text-xs text-ink-faint mt-1">JPG, PNG, WebP — maks. 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">QR Kod</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowQR(!showQR)}
                        className="text-sm bg-white hover:bg-paper-alt border border-line text-ink-soft px-4 py-2 rounded-lg transition-colors"
                      >
                        {showQR ? 'Gizle' : 'QR Kodu Göster'}
                      </button>
                      {showQR && (
                        <a
                          href={`/api/qr/${user.username}`}
                          download={`${user.username}-qr.svg`}
                          className="text-sm text-brand-600 hover:text-brand-700 transition-colors"
                        >
                          İndir (SVG)
                        </a>
                      )}
                    </div>
                    {showQR && (
                      <div className="mt-3 bg-white border border-line rounded-xl p-4 inline-block shadow-sm">
                        <img src={`/api/qr/${user.username}`} alt="QR" className="w-40 h-40" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-1.5">Görünen Ad</label>
                    <input
                      value={profileForm.displayName}
                      onChange={e => setProfileForm(f => ({ ...f, displayName: e.target.value }))}
                      required
                      className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-1.5">
                      Bio <span className="text-ink-faint font-normal">(opsiyonel)</span>
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                      rows={3}
                      placeholder="Kendinizi kısaca tanıtın..."
                      className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-1.5">Kullanıcı Adı</label>
                    <input
                      value={user.username}
                      disabled
                      className="w-full bg-paper-alt border border-line rounded-xl px-4 py-3 text-sm text-ink-faint cursor-not-allowed"
                    />
                    <p className="text-xs text-ink-faint mt-1">Kullanıcı adı değiştirilemez.</p>
                  </div>
                </div>

                {/* Preset themes */}
                <div className="bg-white border border-line rounded-2xl p-6 shadow-sm">
                  <h2 className="font-display font-semibold text-ink mb-4">Hazır Tema</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {PRESET_THEMES.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        disabled={t.pro && !user.isPro}
                        onClick={() => !t.pro || user.isPro ? setProfileForm(f => ({ ...f, theme: t.id })) : null}
                        className={`relative p-3 rounded-xl border text-sm font-medium transition-colors ${
                          profileForm.theme === t.id
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-line text-ink-soft hover:border-ink-faint'
                        } ${t.pro && !user.isPro ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {t.label}
                        {t.pro && (
                          <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">PRO</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme editor - Pro */}
                <div className={`bg-white border border-line rounded-2xl p-6 shadow-sm ${!user.isPro ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display font-semibold text-ink">Tema Editörü</h2>
                    {!user.isPro && (
                      <span className="text-xs bg-brand-500 text-white px-2.5 py-1 rounded-full font-semibold">PRO</span>
                    )}
                  </div>

                  {/* Button style */}
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-ink-faint mb-2">Buton Şekli</label>
                    <div className="flex gap-2">
                      {BTN_STYLES.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          disabled={!user.isPro}
                          onClick={() => updateThemeConfig({ btnStyle: s.id as ThemeConfig['btnStyle'] })}
                          className={`flex-1 py-2.5 border text-xs font-medium transition-colors ${s.cls} ${
                            profileForm.themeConfig.btnStyle === s.id
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-line text-ink-soft hover:border-ink-faint'
                          } disabled:cursor-not-allowed`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font family */}
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-ink-faint mb-2">Yazı Tipi</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FONTS.map(f => (
                        <button
                          key={f.id}
                          type="button"
                          disabled={!user.isPro}
                          onClick={() => updateThemeConfig({ fontFamily: f.id as ThemeConfig['fontFamily'] })}
                          style={f.style}
                          className={`py-2.5 px-3 border text-sm transition-colors rounded-xl ${
                            profileForm.themeConfig.fontFamily === f.id
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-line text-ink-soft hover:border-ink-faint'
                          } disabled:cursor-not-allowed`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom background gradient */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <label className="text-xs font-medium text-ink-faint">Özel Arka Plan Rengi</label>
                      <button
                        type="button"
                        disabled={!user.isPro}
                        onClick={() => updateThemeConfig({ bgGradient: !profileForm.themeConfig.bgGradient })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:cursor-not-allowed ${
                          profileForm.themeConfig.bgGradient ? 'bg-brand-500' : 'bg-line'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          profileForm.themeConfig.bgGradient ? 'translate-x-[18px]' : 'translate-x-[2px]'
                        }`} />
                      </button>
                    </div>

                    {profileForm.themeConfig.bgGradient && (
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-xs text-ink-faint mb-1.5">Renk 1</p>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={profileForm.themeConfig.bgFrom || '#0a0f1e'}
                              disabled={!user.isPro}
                              onChange={e => updateThemeConfig({ bgFrom: e.target.value })}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-line bg-transparent p-0.5 disabled:cursor-not-allowed"
                            />
                            <input
                              value={profileForm.themeConfig.bgFrom || '#0a0f1e'}
                              disabled={!user.isPro}
                              onChange={e => updateThemeConfig({ bgFrom: e.target.value })}
                              placeholder="#0a0f1e"
                              maxLength={7}
                              className="flex-1 bg-white border border-line rounded-lg px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-brand-500 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-ink-faint mb-1.5">Renk 2</p>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={profileForm.themeConfig.bgTo || '#6366f1'}
                              disabled={!user.isPro}
                              onChange={e => updateThemeConfig({ bgTo: e.target.value })}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-line bg-transparent p-0.5 disabled:cursor-not-allowed"
                            />
                            <input
                              value={profileForm.themeConfig.bgTo || '#6366f1'}
                              disabled={!user.isPro}
                              onChange={e => updateThemeConfig({ bgTo: e.target.value })}
                              placeholder="#6366f1"
                              maxLength={7}
                              className="flex-1 bg-white border border-line rounded-lg px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-brand-500 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gradient preview */}
                    {profileForm.themeConfig.bgGradient && (
                      <div
                        className="mt-3 h-10 rounded-xl border border-line"
                        style={{
                          background: `linear-gradient(135deg, ${profileForm.themeConfig.bgFrom || '#0a0f1e'}, ${profileForm.themeConfig.bgTo || '#6366f1'})`
                        }}
                      />
                    )}
                  </div>

                  {/* Button color */}
                  <div className="mt-5">
                    <label className="block text-xs font-medium text-ink-faint mb-3">Buton Rengi</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-ink-faint mb-1.5">Arka Plan</p>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={profileForm.themeConfig.btnColor || '#4f46e5'}
                            disabled={!user.isPro}
                            onChange={e => updateThemeConfig({ btnColor: e.target.value })}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-line bg-transparent p-0.5 disabled:cursor-not-allowed"
                          />
                          <input
                            value={profileForm.themeConfig.btnColor || '#4f46e5'}
                            disabled={!user.isPro}
                            onChange={e => updateThemeConfig({ btnColor: e.target.value })}
                            maxLength={7}
                            className="flex-1 bg-white border border-line rounded-lg px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-brand-500 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-ink-faint mb-1.5">Yazı Rengi</p>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={profileForm.themeConfig.btnTextColor || '#ffffff'}
                            disabled={!user.isPro}
                            onChange={e => updateThemeConfig({ btnTextColor: e.target.value })}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-line bg-transparent p-0.5 disabled:cursor-not-allowed"
                          />
                          <input
                            value={profileForm.themeConfig.btnTextColor || '#ffffff'}
                            disabled={!user.isPro}
                            onChange={e => updateThemeConfig({ btnTextColor: e.target.value })}
                            maxLength={7}
                            className="flex-1 bg-white border border-line rounded-lg px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-brand-500 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Button preview */}
                    <div className="mt-3 flex justify-center">
                      <div
                        className={`px-8 py-2 text-sm font-medium ${
                          profileForm.themeConfig.btnStyle === 'pill' ? 'rounded-full' :
                          profileForm.themeConfig.btnStyle === 'square' ? 'rounded-md' : 'rounded-xl'
                        }`}
                        style={{ background: profileForm.themeConfig.btnColor || '#4f46e5', color: profileForm.themeConfig.btnTextColor || '#ffffff' }}
                      >
                        Örnek Buton
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced customization - Pro */}
                <div className={`bg-white border border-line rounded-2xl p-6 shadow-sm ${!user.isPro ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display font-semibold text-ink">Gelişmiş Özelleştirme</h2>
                    {!user.isPro && (
                      <span className="text-xs bg-brand-500 text-white px-2.5 py-1 rounded-full font-semibold">PRO</span>
                    )}
                  </div>

                  {/* Title color */}
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-ink-faint mb-2">Başlık / İsim Rengi</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={profileForm.themeConfig.titleColor || '#ffffff'}
                        disabled={!user.isPro}
                        onChange={e => updateThemeConfig({ titleColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-line bg-transparent p-0.5 disabled:cursor-not-allowed"
                      />
                      <input
                        value={profileForm.themeConfig.titleColor || '#ffffff'}
                        disabled={!user.isPro}
                        onChange={e => updateThemeConfig({ titleColor: e.target.value })}
                        maxLength={7}
                        className="flex-1 bg-white border border-line rounded-lg px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-brand-500 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Avatar shape */}
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-ink-faint mb-2">Avatar Şekli</label>
                    <div className="flex gap-2">
                      {([{ id: 'circle', label: 'Yuvarlak', cls: 'rounded-full' }, { id: 'rounded', label: 'Köşeli Yuv.', cls: 'rounded-xl' }, { id: 'square', label: 'Kare', cls: 'rounded-none' }] as const).map(s => (
                        <button
                          key={s.id}
                          type="button"
                          disabled={!user.isPro}
                          onClick={() => updateThemeConfig({ avatarShape: s.id })}
                          className={`flex-1 py-2 border text-xs font-medium transition-colors ${s.cls} ${
                            profileForm.themeConfig.avatarShape === s.id
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-line text-ink-soft hover:border-ink-faint'
                          } disabled:cursor-not-allowed`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Social icon style */}
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-ink-faint mb-2">Sosyal Ikon Konumu</label>
                    <div className="flex gap-2">
                      {([{ id: 'none', label: 'Yok' }, { id: 'left', label: 'Solda' }, { id: 'center', label: 'Ortada' }] as const).map(s => (
                        <button
                          key={s.id}
                          type="button"
                          disabled={!user.isPro}
                          onClick={() => updateThemeConfig({ socialIconStyle: s.id })}
                          className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-colors ${
                            profileForm.themeConfig.socialIconStyle === s.id
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-line text-ink-soft hover:border-ink-faint'
                          } disabled:cursor-not-allowed`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card opacity */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-ink-faint">Kart Saydamlığı</label>
                      <span className="text-xs font-mono text-ink-soft bg-paper-alt px-2 py-0.5 rounded">{profileForm.themeConfig.cardOpacity ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={profileForm.themeConfig.cardOpacity ?? 100}
                      disabled={!user.isPro}
                      onChange={e => updateThemeConfig({ cardOpacity: Number(e.target.value) })}
                      className="w-full accent-brand-500 disabled:cursor-not-allowed"
                    />
                    <div className="flex justify-between text-[10px] text-ink-faint mt-1">
                      <span>Saydam</span><span>Opak</span>
                    </div>
                  </div>

                  {/* Show bio toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-ink-faint">Bio Göster</label>
                      <button
                        type="button"
                        disabled={!user.isPro}
                        onClick={() => updateThemeConfig({ showBio: !(profileForm.themeConfig.showBio ?? true) })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:cursor-not-allowed ${
                          (profileForm.themeConfig.showBio ?? true) ? 'bg-brand-500' : 'bg-line'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          (profileForm.themeConfig.showBio ?? true) ? 'translate-x-[18px]' : 'translate-x-[2px]'
                        }`} />
                      </button>
                    </div>
                    <p className="text-[11px] text-ink-faint mt-1">Profil sayfasında bio metnini göster veya gizle</p>
                  </div>
                </div>

                {profileMsg && (
                  <div className={`rounded-lg px-4 py-3 text-sm ${
                    profileMsg.includes('!') ? 'bg-teal-soft border border-teal/30 text-teal' : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                    {profileMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  {profileLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </form>
            )}

            {/* ── ANALİTİK TAB ── */}
            {tab === 'analitik' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {[7, 14, 30].map(d => (
                    <button
                      key={d}
                      onClick={() => {
                        setAnalyticsDays(d)
                        fetch(`/api/analytics?days=${d}`).then(r => r.json()).then(setAnalytics)
                      }}
                      className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
                        analyticsDays === d ? 'bg-brand-500 text-white' : 'bg-white border border-line text-ink-soft hover:text-ink'
                      }`}
                    >
                      {d} gün
                    </button>
                  ))}
                  <button
                    onClick={() => fetch(`/api/analytics?days=${analyticsDays}`).then(r => r.json()).then(setAnalytics)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white border border-line text-ink-faint hover:text-ink transition-colors ml-auto"
                  >
                    ↻ Yenile
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-line rounded-2xl p-5 text-center shadow-sm">
                    <div className="font-mono text-2xl font-black text-ink mb-1">{analytics?.totalClicks ?? totalClicks}</div>
                    <div className="text-xs text-ink-faint">Dönem Tıklama</div>
                  </div>
                  <div className="bg-white border border-line rounded-2xl p-5 text-center shadow-sm">
                    <div className="font-mono text-2xl font-black text-ink mb-1">{links.reduce((s, l) => s + l.clicks, 0)}</div>
                    <div className="text-xs text-ink-faint">Toplam Tıklama</div>
                  </div>
                  <div className="bg-white border border-line rounded-2xl p-5 text-center shadow-sm">
                    <div className="font-mono text-2xl font-black text-ink mb-1">{links.length}</div>
                    <div className="text-xs text-ink-faint">Toplam Link</div>
                  </div>
                </div>

                {analytics && analytics.daily.length > 0 && (
                  <div className="bg-white border border-line rounded-2xl p-5 shadow-sm">
                    <p className="text-sm font-semibold text-ink mb-4">Günlük Tıklama Grafiği</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={analytics.daily}>
                        <defs>
                          <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F0641E" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#F0641E" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          tick={{ fill: '#8A8A92', fontSize: 11 }}
                          tickFormatter={v => v.slice(5)}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis tick={{ fill: '#8A8A92', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ background: '#ffffff', border: '1px solid #E5E1D8', borderRadius: '12px', color: '#17171C' }}
                          labelFormatter={v => `Tarih: ${v}`}
                          formatter={(v: number) => [`${v} tık`, 'Tıklama']}
                        />
                        <Area type="monotone" dataKey="clicks" stroke="#F0641E" strokeWidth={2} fill="url(#clickGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {sortedLinks.length === 0 ? (
                  <div className="text-center py-8 text-ink-faint"><p>Henüz link eklemediniz.</p></div>
                ) : (
                  <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-5 py-3.5 border-b border-line">
                      <p className="text-sm font-semibold text-ink">Link Performansı</p>
                    </div>
                    <div className="divide-y divide-line">
                      {[...sortedLinks].sort((a, b) => b.clicks - a.clicks).map(link => (
                        <div key={link.id} className="px-5 py-3.5">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{getPlatformIcon(link.url)}</span>
                              <p className="text-sm font-medium text-ink truncate">{link.title}</p>
                            </div>
                            <span className="text-sm font-bold text-brand-600 font-mono ml-3 shrink-0">{link.clicks} tık</span>
                          </div>
                          <div className="h-1.5 bg-paper-alt rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-500 rounded-full transition-all"
                              style={{ width: totalClicks > 0 ? `${(link.clicks / totalClicks) * 100}%` : '0%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── PRO TAB ── */}
            {tab === 'pro' && (
              <div className="space-y-5">
                <div className="relative bg-ink rounded-2xl p-8 text-center overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/20 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="text-5xl mb-3">⚡</div>
                    <h2 className="font-display text-2xl font-bold mb-2 text-white">Pro&apos;ya Yükselt</h2>
                    <p className="text-white/60 mb-6">Ayda sadece <strong className="text-white">₺59</strong> ile tüm özellikleri açın.</p>
                    <Link
                      href="/pro"
                      className="inline-block bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
                    >
                      Pro Planı İncele &rarr;
                    </Link>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: '🔗', title: 'Sınırsız Link', desc: 'Ücretsiz plandaki 5 link sınırını kaldırın.' },
                    { icon: '🎨', title: 'Tema Editörü', desc: 'Gradient arka plan, özel renkler, buton şekli, font seçimi.' },
                    { icon: '📊', title: 'Detaylı Analitik', desc: 'Günlük, haftalık tıklama takibi.' },
                  ].map(f => (
                    <div key={f.title} className="bg-white border border-line rounded-2xl p-5 text-center shadow-sm">
                      <div className="text-3xl mb-3">{f.icon}</div>
                      <h3 className="font-display font-semibold text-sm mb-1 text-ink">{f.title}</h3>
                      <p className="text-ink-soft text-xs">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ─── Preview panel (desktop only) ─── */}
          <div className="hidden lg:block w-[268px] shrink-0 sticky top-24 self-start">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider">Önizleme</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLivePreview(v => !v)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-colors border ${
                    livePreview
                      ? 'bg-teal-soft border-teal/30 text-teal'
                      : 'bg-paper-alt border-line text-ink-faint'
                  }`}
                  title={livePreview ? 'Canlı akış açık' : 'Canlı akış kapalı'}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${livePreview ? 'bg-teal animate-pulse' : 'bg-ink-faint'}`} />
                  {livePreview ? 'Canlı' : 'Statik'}
                </button>
                <button
                  onClick={() => setPreviewKey(k => k + 1)}
                  className="text-xs text-ink-faint hover:text-ink transition-colors p-1"
                  title="Yenile"
                >
                  ↻
                </button>
              </div>
            </div>

            {/* iPhone frame */}
            <div className="relative mx-auto" style={{ width: '260px' }}>
              <div className="bg-ink rounded-[44px] p-[10px] border-[3px] border-ink/80 shadow-2xl shadow-ink/25">
                {/* Dynamic island */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10 border border-ink" />
                {/* Screen */}
                <div className="rounded-[36px] overflow-hidden bg-black" style={{ height: '520px' }}>
                  <iframe
                    key={previewKey}
                    src={`/${user.username}${livePreview ? `?_t=${previewKey}` : ''}`}
                    className="w-full h-full border-none"
                    style={{ pointerEvents: 'none', transform: 'scale(0.85)', transformOrigin: 'top center', width: '118%', marginLeft: '-9%' }}
                    title="Profil Önizleme"
                  />
                </div>
                {/* Home indicator */}
                <div className="mt-2.5 mx-auto w-16 h-1 bg-ink/60 rounded-full" />
              </div>
            </div>

            <p className="text-center text-xs text-ink-faint mt-3">
              {livePreview
                ? <>Değişiklikler kaydedince<br />otomatik güncellenir.</>
                : <>Kaydet&apos;e bastıktan sonra<br />↻ Yenile&apos;ye basın.</>
              }
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}
