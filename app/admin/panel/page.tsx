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
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800/60 bg-[#0a0f1e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">L</div>
              <span className="font-bold text-white text-lg tracking-tight">LinkBio Pro</span>
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-indigo-400 font-semibold">Admin Panel</span>
          </div>
          <button onClick={logout} className="text-sm text-slate-400 hover:text-white transition-colors">
            Çıkış
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Toplam Üye', value: stats.totalUsers, color: 'text-white' },
              { label: 'Pro Üye', value: stats.proUsers, color: 'text-indigo-400' },
              { label: 'Ücretsiz Üye', value: stats.freeUsers, color: 'text-slate-400' },
              { label: 'Toplam Link', value: stats.totalLinks, color: 'text-emerald-400' },
              { label: 'Toplam Tıklama', value: stats.totalClicks, color: 'text-yellow-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-center">
                <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* User list */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="font-semibold text-slate-200">Kullanıcılar</h2>
            <div className="flex gap-2 flex-wrap">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ara..."
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 w-48"
              />
              {(['hepsi', 'pro', 'ucretsiz'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f === 'hepsi' ? 'Hepsi' : f === 'pro' ? 'Pro' : 'Ücretsiz'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-5 py-3 text-xs text-slate-500 font-medium">Kullanıcı</th>
                  <th className="px-4 py-3 text-xs text-slate-500 font-medium">Plan</th>
                  <th className="px-4 py-3 text-xs text-slate-500 font-medium">Link / Tık</th>
                  <th className="px-4 py-3 text-xs text-slate-500 font-medium">Kayıt Tarihi</th>
                  <th className="px-4 py-3 text-xs text-slate-500 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map(user => (
                  <>
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {user.displayName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.displayName}</p>
                            <p className="text-slate-500 text-xs">@{user.username} · {user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {user.isPro ? (
                          <div>
                            <span className="bg-indigo-950/50 border border-indigo-700/50 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-semibold">PRO</span>
                            {user.proExpiresAt && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                {new Date(user.proExpiresAt) < new Date() ? '⚠ Süresi doldu' : `Bitiş: ${new Date(user.proExpiresAt).toLocaleDateString('tr-TR')}`}
                              </p>
                            )}
                            {user.proNote && <p className="text-xs text-slate-500 mt-0.5">{user.proNote}</p>}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">Ücretsiz</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">
                        {user.totalLinks} link · {user.totalClicks} tık
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (editingId === user.id) { setEditingId(null); return }
                              setEditingId(user.id)
                              setProNote(user.proNote || '')
                              setProExpiry(user.proExpiresAt ? user.proExpiresAt.split('T')[0] : '')
                            }}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                              user.isPro
                                ? 'bg-orange-950/40 border border-orange-800/50 text-orange-400 hover:bg-orange-900/40'
                                : 'bg-indigo-950/40 border border-indigo-800/50 text-indigo-400 hover:bg-indigo-900/40'
                            }`}
                          >
                            {user.isPro ? 'Pro Kaldır' : 'Pro Yap'}
                          </button>
                          <a
                            href={`/${user.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          >
                            Profil
                          </a>
                          <button
                            onClick={() => deleteUser(user.id, user.username)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-900/40 text-red-400 hover:bg-red-900/40 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Pro upgrade inline form */}
                    {editingId === user.id && !user.isPro && (
                      <tr key={`${user.id}-edit`} className="bg-indigo-950/20">
                        <td colSpan={5} className="px-5 py-4">
                          <div className="flex flex-wrap gap-3 items-end">
                            <div>
                              <label className="block text-xs text-slate-400 mb-1">Bitiş Tarihi (opsiyonel)</label>
                              <input
                                type="date"
                                value={proExpiry}
                                onChange={e => setProExpiry(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-400 mb-1">Not (ödeme yöntemi, vs.)</label>
                              <input
                                value={proNote}
                                onChange={e => setProNote(e.target.value)}
                                placeholder="Örn: Havale — ₺59 — 01.03.2025"
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-64"
                              />
                            </div>
                            <button
                              onClick={() => togglePro(user)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                            >
                              Pro Aktif Et
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-slate-400 hover:text-white text-sm px-3 py-2 transition-colors"
                            >
                              İptal
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Pro remove confirmation */}
                    {editingId === user.id && user.isPro && (
                      <tr key={`${user.id}-remove`} className="bg-orange-950/20">
                        <td colSpan={5} className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <p className="text-sm text-orange-300">
                              <strong>{user.displayName}</strong> kullanıcısının Pro üyeliği kaldırılacak. Emin misiniz?
                            </p>
                            <button
                              onClick={() => togglePro(user)}
                              className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                            >
                              Evet, Kaldır
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-slate-400 hover:text-white text-sm px-3 py-1.5 transition-colors"
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
              <div className="text-center py-12 text-slate-500">
                <p>Kullanıcı bulunamadı.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
