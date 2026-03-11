export interface SocialPlatform {
  name: string
  icon: string
  color: string
  bgColor: string
}

const PLATFORMS: Array<{ patterns: string[]; platform: SocialPlatform }> = [
  {
    patterns: ['instagram.com'],
    platform: { name: 'Instagram', icon: '📸', color: '#E1306C', bgColor: '#FCE4EC' },
  },
  {
    patterns: ['twitter.com', 'x.com'],
    platform: { name: 'X (Twitter)', icon: '𝕏', color: '#000000', bgColor: '#F5F5F5' },
  },
  {
    patterns: ['youtube.com', 'youtu.be'],
    platform: { name: 'YouTube', icon: '▶', color: '#FF0000', bgColor: '#FFEBEE' },
  },
  {
    patterns: ['tiktok.com'],
    platform: { name: 'TikTok', icon: '🎵', color: '#000000', bgColor: '#F5F5F5' },
  },
  {
    patterns: ['facebook.com', 'fb.com'],
    platform: { name: 'Facebook', icon: 'f', color: '#1877F2', bgColor: '#E3F2FD' },
  },
  {
    patterns: ['linkedin.com'],
    platform: { name: 'LinkedIn', icon: 'in', color: '#0A66C2', bgColor: '#E3F2FD' },
  },
  {
    patterns: ['github.com'],
    platform: { name: 'GitHub', icon: '⌥', color: '#181717', bgColor: '#F5F5F5' },
  },
  {
    patterns: ['twitch.tv'],
    platform: { name: 'Twitch', icon: '🎮', color: '#9146FF', bgColor: '#EDE7F6' },
  },
  {
    patterns: ['spotify.com'],
    platform: { name: 'Spotify', icon: '♫', color: '#1DB954', bgColor: '#E8F5E9' },
  },
  {
    patterns: ['discord.com', 'discord.gg'],
    platform: { name: 'Discord', icon: '💬', color: '#5865F2', bgColor: '#EDE7F6' },
  },
  {
    patterns: ['telegram.me', 't.me'],
    platform: { name: 'Telegram', icon: '✈', color: '#26A5E4', bgColor: '#E3F2FD' },
  },
  {
    patterns: ['whatsapp.com', 'wa.me'],
    platform: { name: 'WhatsApp', icon: '📱', color: '#25D366', bgColor: '#E8F5E9' },
  },
  {
    patterns: ['pinterest.com'],
    platform: { name: 'Pinterest', icon: '📌', color: '#E60023', bgColor: '#FFEBEE' },
  },
  {
    patterns: ['etsy.com'],
    platform: { name: 'Etsy', icon: '🛍', color: '#F56400', bgColor: '#FFF3E0' },
  },
  {
    patterns: ['patreon.com'],
    platform: { name: 'Patreon', icon: '🎨', color: '#FF424D', bgColor: '#FFEBEE' },
  },
]

export function detectPlatform(url: string): SocialPlatform | null {
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase()
    for (const { patterns, platform } of PLATFORMS) {
      if (patterns.some(p => hostname.includes(p))) return platform
    }
  } catch { /* invalid URL */ }
  return null
}

export function getPlatformIcon(url: string): string {
  const p = detectPlatform(url)
  return p ? p.icon : '🔗'
}
