import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { detectPlatform } from '@/lib/social-icons'

interface ThemeConfig {
  btnStyle?: 'rounded' | 'pill' | 'square'
  fontFamily?: 'inter' | 'poppins' | 'raleway' | 'playfair'
  bgGradient?: boolean
  bgFrom?: string
  bgTo?: string
}

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

const GOOGLE_FONTS: Record<string, string> = {
  poppins: 'Poppins:wght@400;500;600;700',
  raleway: 'Raleway:wght@400;500;600;700',
  playfair: 'Playfair+Display:wght@400;500;600;700',
}

const FONT_STACKS: Record<string, string> = {
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  raleway: "'Raleway', sans-serif",
  playfair: "'Playfair Display', serif",
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

  const preset = THEMES[user.theme] ?? THEMES.koyu
  const tc = (user.isPro && user.themeConfig && typeof user.themeConfig === 'object' && !Array.isArray(user.themeConfig)
    ? user.themeConfig
    : {}) as ThemeConfig

  // Background
  const hasCusBg = tc.bgGradient && tc.bgFrom
  const bgStyle = hasCusBg
    ? { background: `linear-gradient(135deg, ${tc.bgFrom}, ${tc.bgTo || tc.bgFrom})` }
    : undefined
  const bgClass = hasCusBg ? 'min-h-screen' : preset.bg

  // Button shape
  const btnRadius = tc.btnStyle === 'pill' ? 'rounded-full' : tc.btnStyle === 'square' ? 'rounded-lg' : 'rounded-2xl'
  const btnClass = `${preset.btn} ${btnRadius}`

  // Font
  const fontFamily = tc.fontFamily ? FONT_STACKS[tc.fontFamily] : undefined
  const googleFontKey = tc.fontFamily && tc.fontFamily !== 'inter' ? tc.fontFamily : null

  const initials = user.displayName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className={bgClass} style={{ ...bgStyle, fontFamily }}>
      {googleFontKey && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link
          href={`https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS[googleFontKey]}&display=swap`}
          rel="stylesheet"
        />
      )}
      <div className={`${preset.card} max-w-md mx-auto px-5 py-16`}>

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
          <h1 className={`text-xl font-bold ${preset.text}`}>{user.displayName}</h1>
          {user.bio && (
            <p className={`mt-1.5 text-sm leading-relaxed ${preset.subtext}`}>{user.bio}</p>
          )}
        </div>

        {/* Links */}
        {user.links.length === 0 ? (
          <p className={`text-center text-sm ${preset.subtext}`}>Henüz link eklenmemiş.</p>
        ) : (
          <div className="space-y-3">
            {user.links.map(link => {
              const platform = detectPlatform(link.url)
              return (
                <a
                  key={link.id}
                  href={`/api/click/${link.id}`}
                  className={`flex items-center justify-center gap-2.5 w-full py-3.5 px-5 font-semibold text-sm transition-all duration-200 ${btnClass}`}
                >
                  {platform && <span className="text-base">{platform.icon}</span>}
                  {link.title}
                </a>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <a href="/" className={`text-xs ${preset.subtext} hover:opacity-80 transition-opacity`}>
            LinkBio Pro ile oluşturuldu
          </a>
        </div>

      </div>
    </div>
  )
}
