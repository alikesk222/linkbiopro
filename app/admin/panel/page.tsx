'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stats {
  totalUsers: number
  proUsers: number
  freeUsers: number
  totalLinks: number
  totalClicks: number
}

interface AdminUser {
  id: string
  email: string
  username: string
  displayName: string
  isPro: boolean
  proExpiresAt: string | null
  proNote: string | null
  createdAt: string
  totalLinks: number
  totalClicks: number
}

export default function AdminPanelPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'hepsi' | 'pro' | 'ucretsiz'>('hepsi')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [proNote, setProNote] = useState('')
  const [proExpiry, setProExpiry] = useState('')
  const router = useRouter()

  const fetchAll = useCallback(async () => {
    const [sRes, uRes] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch('/api/admin/users'),
    ])
    if (!sRes.ok || !uRes.ok) { router.push('/admin/giris'); return }
    setStats(await sRes.json())
    setUsers(await uRes.json())
  }, [router])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function togglePro(user: AdminUser) {
    const newPro = !user.isPro
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isPro: newPro,
        proExpiresAt: newPro ? proExpiry || null : null,
        proNote: newPro ? proNote || null : null,
      }),
    })
    if (res.ok) {
      const updated = await res.json()
      setUsers(u => u.map(x => x.id === user.id ? { ...x, ...updated } : x))
      setStats(s => s ? { ...s, proUsers: s.proUsers + (newPro ? 1 : -1), freeUsers: s.freeUsers + (newPro ? -1 : 1) } : s)
      setEditingId(null)
      setProNote('')
      setProExpiry('')
    }
  }

  async function deleteUser(id: string, username: string) {
    if (!confirm(`"${username}" kullanıcısını ve tüm verilerini silmek istediğinizden emin misiniz?`)) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setUsers(u => u.filter(x => x.id !== id))
      setStats(s => s ? { ...s, totalUsers: s.totalUsers - 1 } : s)
    }
  }

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/giris')
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.username.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'hepsi' ||
      (filter === 'pro' && u.isPro) ||
      (filter === 'ucretsiz' && !u.isPro)
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">L</div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">LinkBio<span className="text-indigo-600">.Pro</span></span>
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAll}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7A5 5 0 1 1 7 2M12 2v3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Yenile
            </button>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Toplam Üye', value: stats.totalUsers, icon: '👥', color: 'text-gray-900', bg: 'bg-white', border: 'border-gray-200' },
              { label: 'Pro Üye', value: stats.proUsers, icon: '⚡', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
              { label: 'Ücretsiz Üye', value: stats.freeUsers, icon: '🆓', color: 'text-gray-600', bg: 'bg-white', border: 'border-gray-200' },
              { label: 'Toplam Link', value: stats.totalLinks, icon: '🔗', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              { label: 'Toplam Tıklama', value: stats.totalClicks, icon: '👆', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 text-center shadow-sm`}>
                <div className="text-xl mb-1">{s.icon}</div>
                <div className={`text-2xl font-black mb-1 ${s.color}`}>{s.value.toLocaleString()}</div>
                <div className="text-xs text-gray-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* User list */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Kullanıcılar</h2>
              <p className="text-xs text-gray-400 mt-0.5">{filtered.length} kullanıcı gösteriliyor</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Kullanıcı ara..."
                  className="bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 w-48 transition-all"
                />
              </div>
              {(['hepsi', 'pro', 'ucretsiz'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'hepsi' ? 'Hepsi' : f === 'pro' ? '⚡ Pro' : 'Ücretsiz'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-left">
                  <th className="px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Kullanıcı</th>
                  <th className="px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Plan</th>
                  <th className="px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Link / Tık</th>
                  <th className="px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Kayıt Tarihi</th>
                  <th className="px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(user => (
                  <>
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
                            {user.displayName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.displayName}</p>
                            <p className="text-gray-400 text-xs">@{user.username} · {user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {user.isPro ? (
                          <div>
                            <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold">⚡ PRO</span>
                            {user.proExpiresAt && (
                              <p className={`text-xs mt-0.5 ${new Date(user.proExpiresAt) < new Date() ? 'text-red-500' : 'text-gray-400'}`}>
                                {new Date(user.proExpiresAt) < new Date() ? '⚠ Süresi doldu' : `Bitiş: ${new Date(user.proExpiresAt).toLocaleDateString('tr-TR')}`}
                              </p>
                            )}
                            {user.proNote && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[140px]">{user.proNote}</p>}
                          </div>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full font-medium">Ücretsiz</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-gray-700 font-medium">{user.totalLinks} link</div>
                        <div className="text-gray-400 text-xs">{user.totalClicks} tıklama</div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              if (editingId === user.id) { setEditingId(null); return }
                              setEditingId(user.id)
                              setProNote(user.proNote || '')
                              setProExpiry(user.proExpiresAt ? user.proExpiresAt.split('T')[0] : '')
                            }}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                              user.isPro
                                ? 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
                                : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                            }`}
                          >
                            {user.isPro ? 'Pro Kaldır' : '⚡ Pro Yap'}
                          </button>
                          <a
                            href={`/${user.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200"
                          >
                            ↗ Profil
                          </a>
                          <button
                            onClick={() => deleteUser(user.id, user.username)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Pro upgrade inline form */}
                    {editingId === user.id && !user.isPro && (
                      <tr key={`${user.id}-edit`} className="bg-indigo-50/60">
                        <td colSpan={5} className="px-5 py-4 border-b border-indigo-100">
                          <div className="flex flex-wrap gap-3 items-end">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-indigo-700">⚡ Pro Aktifleştir:</span>
                            </div>
                            <div className="w-full" />
                            <div>
                              <label className="block text-xs text-gray-500 mb-1 font-medium">Bitiş Tarihi (opsiyonel)</label>
                              <input
                                type="date"
                                value={proExpiry}
                                onChange={e => setProExpiry(e.target.value)}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1 font-medium">Not (ödeme yöntemi, vs.)</label>
                              <input
                                value={proNote}
                                onChange={e => setProNote(e.target.value)}
                                placeholder="Örn: Havale — ₺59 — 01.03.2025"
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 w-64"
                              />
                            </div>
                            <button
                              onClick={() => togglePro(user)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
                            >
                              Pro Aktif Et
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-500 hover:text-gray-900 text-sm px-3 py-2 transition-colors"
                            >
                              İptal
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Pro remove confirmation */}
                    {editingId === user.id && user.isPro && (
                      <tr key={`${user.id}-remove`} className="bg-orange-50/60">
                        <td colSpan={5} className="px-5 py-4 border-b border-orange-100">
                          <div className="flex items-center gap-3">
                            <p className="text-sm text-orange-700">
                              <strong>{user.displayName}</strong> kullanıcısının Pro üyeliği kaldırılacak. Emin misiniz?
                            </p>
                            <button
                              onClick={() => togglePro(user)}
                              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                            >
                              Evet, Kaldır
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-500 hover:text-gray-900 text-sm px-3 py-1.5 transition-colors"
                            >
                              İptal
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium">Kullanıcı bulunamadı.</p>
                <p className="text-sm mt-1">Farklı bir arama terimi deneyin.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
