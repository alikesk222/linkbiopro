'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  username: string
  displayName: string
  bio: string | null
  theme: string
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

type Tab = 'linkler' | 'profil' | 'analitik'

const THEMES = [
  { id: 'koyu', label: 'Koyu', pro: false },
  { id: 'acik', label: 'Açık', pro: false },
  { id: 'mor', label: 'Mor', pro: true },
  { id: 'pembe', label: 'Pembe', pro: true },
  { id: 'yesil', label: 'Yeşil', pro: true },
]

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
  const [profileForm, setProfileForm] = useState({ displayName: '', bio: '', theme: '' })
  const [profileMsg, setProfileMsg] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const router = useRouter()

  const fetchAll = useCallback(async () => {
    const [uRes, lRes] = await Promise.all([fetch('/api/me'), fetch('/api/links')])
    if (!uRes.ok) { router.push('/giris'); return }
    const u = await uRes.json()
    const l = await lRes.json()
    setUser(u)
    setLinks(l)
    setProfileForm({ displayName: u.displayName, bio: u.bio || '', theme: u.theme })
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
  }

  async function deleteLink(id: string) {
    if (!confirm('Bu linki silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/links/${id}`, { method: 'DELETE' })
    setLinks(l => l.filter(x => x.id !== id))
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
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileMsg('')
    setProfileLoading(true)
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileForm),
    })
    const data = await res.json()
    if (!res.ok) { setProfileMsg(data.error || 'Hata'); setProfileLoading(false); return }
    setUser(data)
    setProfileMsg('Profil kaydedildi!')
    setProfileLoading(false)
  }

  async function logout() {
    await fetch('/api/auth/cikis', { method: 'POST' })
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const sortedLinks = [...links].sort((a, b) => a.order - b.order)
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800/60 bg-[#0a0f1e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">L</div>
            <span className="font-bold text-white text-lg tracking-tight">LinkBio Pro</span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-white transition-colors hidden sm:block"
            >
              /{user.username} &rarr;
            </a>
            <button
              onClick={logout}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">

        {/* Profile URL banner */}
        <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-xl px-5 py-3.5 mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-indigo-400 font-medium mb-0.5">Profil adresiniz</p>
            <p className="text-white font-mono text-sm">
              {typeof window !== 'undefined' ? window.location.origin : ''}/{user.username}
            </p>
          </div>
          <a
            href={`/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Görüntüle
          </a>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 mb-6 gap-1">
          {(['linkler', 'profil', 'analitik'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {t === 'linkler' ? 'Linkler' : t === 'profil' ? 'Profil' : 'Analitik'}
            </button>
          ))}
        </div>

        {/* LINKLER TAB */}
        {tab === 'linkler' && (
          <div className="space-y-4">
            {/* Add link form */}
            <form onSubmit={addLink} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <p className="text-sm font-semibold text-slate-200 mb-4">Yeni Link Ekle</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Başlık (örn: Instagram)"
                  required
                  className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <input
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="URL (örn: https://instagram.com/...)"
                  required
                  type="url"
                  className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              {addError && <p className="text-red-400 text-xs mb-3">{addError}</p>}
              <button
                type="submit"
                disabled={addLoading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                {addLoading ? 'Ekleniyor...' : '+ Ekle'}
              </button>
              {!user.isPro && (
                <span className="text-xs text-slate-500 ml-3">{links.length}/5 link kullanıldı</span>
              )}
            </form>

            {/* Link list */}
            {sortedLinks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-4xl mb-3">🔗</p>
                <p>Henüz link eklemediniz.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {sortedLinks.map((link, idx) => (
                  <div
                    key={link.id}
                    className={`bg-slate-900/50 border rounded-xl p-4 transition-colors ${
                      link.isActive ? 'border-slate-800' : 'border-slate-800/50 opacity-60'
                    }`}
                  >
                    {editId === link.id ? (
                      <div className="space-y-2">
                        <input
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          value={editUrl}
                          onChange={e => setEditUrl(e.target.value)}
                          type="url"
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(link.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
                            Kaydet
                          </button>
                          <button onClick={() => setEditId(null)} className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {/* Order buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveLink(link.id, 'up')}
                            disabled={idx === 0}
                            className="text-slate-600 hover:text-slate-400 disabled:opacity-20 text-xs leading-none"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveLink(link.id, 'down')}
                            disabled={idx === sortedLinks.length - 1}
                            className="text-slate-600 hover:text-slate-400 disabled:opacity-20 text-xs leading-none"
                          >
                            ▼
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-white truncate">{link.title}</p>
                          <p className="text-slate-500 text-xs truncate">{link.url}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-500">{link.clicks} tık</span>

                          <button
                            onClick={() => toggleActive(link.id, link.isActive)}
                            className={`text-xs px-2 py-1 rounded-md transition-colors ${
                              link.isActive
                                ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {link.isActive ? 'Aktif' : 'Pasif'}
                          </button>

                          <button
                            onClick={() => { setEditId(link.id); setEditTitle(link.title); setEditUrl(link.url) }}
                            className="text-slate-500 hover:text-white text-xs px-2 py-1 rounded-md hover:bg-slate-800 transition-colors"
                          >
                            Düzenle
                          </button>

                          <button
                            onClick={() => deleteLink(link.id)}
                            className="text-slate-500 hover:text-red-400 text-xs px-2 py-1 rounded-md hover:bg-red-950/30 transition-colors"
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

        {/* PROFIL TAB */}
        {tab === 'profil' && (
          <form onSubmit={saveProfile} className="space-y-5">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-slate-200">Profil Bilgileri</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Görünen Ad</label>
                <input
                  value={profileForm.displayName}
                  onChange={e => setProfileForm(f => ({ ...f, displayName: e.target.value }))}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Bio <span className="text-slate-500 font-normal">(opsiyonel)</span>
                </label>
                <textarea
                  value={profileForm.bio}
                  onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  placeholder="Kendinizi kısaca tanıtın..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Kullanıcı Adı</label>
                <input
                  value={user.username}
                  disabled
                  className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-600 mt-1">Kullanıcı adı değiştirilemez.</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="font-semibold text-slate-200 mb-4">Tema</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    disabled={t.pro && !user.isPro}
                    onClick={() => !t.pro || user.isPro ? setProfileForm(f => ({ ...f, theme: t.id })) : null}
                    className={`relative p-3 rounded-xl border text-sm font-medium transition-colors ${
                      profileForm.theme === t.id
                        ? 'border-indigo-500 bg-indigo-950/40 text-white'
                        : 'border-slate-700 text-slate-400 hover:border-slate-500'
                    } ${t.pro && !user.isPro ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {t.label}
                    {t.pro && (
                      <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">PRO</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {profileMsg && (
              <div className={`rounded-lg px-4 py-3 text-sm ${
                profileMsg.includes('!') ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-400' : 'bg-red-950/40 border border-red-800/60 text-red-400'
              }`}>
                {profileMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {profileLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        )}

        {/* ANALITIK TAB */}
        {tab === 'analitik' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-white mb-1">{totalClicks}</div>
                <div className="text-xs text-slate-500">Toplam Tıklama</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-white mb-1">{links.length}</div>
                <div className="text-xs text-slate-500">Toplam Link</div>
              </div>
            </div>

            {sortedLinks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>Henüz link eklemediniz.</p>
              </div>
            ) : (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-800">
                  <p className="text-sm font-semibold text-slate-200">Link Performansı</p>
                </div>
                <div className="divide-y divide-slate-800/60">
                  {[...sortedLinks].sort((a, b) => b.clicks - a.clicks).map(link => (
                    <div key={link.id} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white truncate">{link.title}</p>
                        <span className="text-sm font-bold text-indigo-400 ml-3 shrink-0">{link.clicks} tık</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
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

      </main>
    </div>
  )
}
