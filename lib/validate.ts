// Ortak girdi doğrulama yardımcıları

export const RESERVED_USERNAMES = new Set([
  'admin', 'api', 'dashboard', 'giris', 'kayit', 'cikis', 'pro', 'onboarding',
  'hakkimizda', 'iletisim', 'gizlilik-politikasi', 'mesafeli-satis-sozlesmesi',
  'on-bilgilendirme-formu', 'iptal-ve-iade', 'kullanim-sartlari',
  'uploads', 'public', 'static', 'assets', 'destek', 'support', 'help',
  'blog', 'login', 'register', 'signup', 'signin', 'logout', 'settings',
  'ayarlar', 'profil', 'profile', 'linkbiopro', 'linkbio', 'www', 'mail',
  'ftp', 'root', 'sistem', 'system', 'test', 'null', 'undefined',
])

export function isValidEmail(email: string): boolean {
  return (
    typeof email === 'string' &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  )
}

export function isValidHttpUrl(url: string): boolean {
  if (typeof url !== 'string' || url.length > 2048) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/

// themeConfig: sadece bilinen anahtarlar, renkler hex formatında olmak zorunda
export function sanitizeThemeConfig(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const src = input as Record<string, unknown>
  const out: Record<string, unknown> = {}

  const enums: Record<string, string[]> = {
    btnStyle: ['rounded', 'pill', 'square'],
    fontFamily: ['inter', 'poppins', 'raleway', 'playfair'],
    avatarShape: ['circle', 'rounded', 'square'],
    socialIconStyle: ['none', 'left', 'center'],
  }
  for (const [key, allowed] of Object.entries(enums)) {
    if (typeof src[key] === 'string' && allowed.includes(src[key] as string)) out[key] = src[key]
  }

  for (const key of ['btnColor', 'btnTextColor', 'bgFrom', 'bgTo', 'titleColor']) {
    if (typeof src[key] === 'string' && HEX_COLOR.test(src[key] as string)) out[key] = src[key]
  }

  if (typeof src.bgGradient === 'boolean') out.bgGradient = src.bgGradient
  if (typeof src.showBio === 'boolean') out.showBio = src.showBio
  if (typeof src.cardOpacity === 'number' && src.cardOpacity >= 0 && src.cardOpacity <= 100) {
    out.cardOpacity = Math.round(src.cardOpacity)
  }

  return out
}
