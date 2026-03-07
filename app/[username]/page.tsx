import { notFound } from 'next/navigation'
import { db } from '@/lib/db'

const THEMES: Record<string, { bg: string; card: string; btn: string; text: string; subtext: string }> = {
  koyu: {
    bg: 'min-h-screen bg-[#0a0f1e]',
    card: 'bg-[#0a0f1e]',
    btn: 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 text-white',
    text: 'text-white',
    subtext: 'text-slate-400',
  },
  acik: {
    bg: 'min-h-screen bg-slate-100',
    card: 'bg-slate-100',
    btn: 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-slate-900 shadow-sm',
    text: 'text-slate-900',
    subtext: 'text-slate-500',
  },
  mor: {
    bg: 'min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900',
    card: 'bg-transparent',
    btn: 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/50 text-white backdrop-blur-sm',
    text: 'text-white',
    subtext: 'text-violet-200',
  },
  pembe: {
    bg: 'min-h-screen bg-gradient-to-br from-pink-900 via-rose-900 to-red-900',
    card: 'bg-transparent',
    btn: 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/50 text-white backdrop-blur-sm',
    text: 'text-white',
    subtext: 'text-pink-200',
  },
  yesil: {
    bg: 'min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900',
    card: 'bg-transparent',
    btn: 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/50 text-white backdrop-blur-sm',
    text: 'text-white',
    subtext: 'text-emerald-200',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const user = await db.user.findUnique({ where: { username } })
  if (!user) return { title: 'Kullanıcı Bulunamadı' }
  return {
    title: `${user.displayName} — LinkBio Pro`,
    description: user.bio || `${user.displayName} profili`,
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  const user = await db.user.findUnique({
    where: { username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!user) notFound()

  const theme = THEMES[user.theme] ?? THEMES.koyu
  const initials = user.displayName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className={theme.bg}>
      <div className={`${theme.card} max-w-md mx-auto px-5 py-16`}>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt={user.displayName} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
              {initials}
            </div>
          )}
        </div>

        {/* Name & bio */}
        <div className="text-center mb-8">
          <h1 className={`text-xl font-bold ${theme.text}`}>{user.displayName}</h1>
          {user.bio && (
            <p className={`mt-1.5 text-sm leading-relaxed ${theme.subtext}`}>{user.bio}</p>
          )}
        </div>

        {/* Links */}
        {user.links.length === 0 ? (
          <p className={`text-center text-sm ${theme.subtext}`}>Henüz link eklenmemiş.</p>
        ) : (
          <div className="space-y-3">
            {user.links.map(link => (
              <a
                key={link.id}
                href={`/api/click/${link.id}`}
                className={`block w-full py-3.5 px-5 rounded-2xl text-center font-semibold text-sm transition-all duration-200 ${theme.btn}`}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <a href="/" className={`text-xs ${theme.subtext} hover:opacity-80 transition-opacity`}>
            LinkBio Pro ile oluşturuldu
          </a>
        </div>

      </div>
    </div>
  )
}
