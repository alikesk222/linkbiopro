import type { Metadata } from 'next'
import { Bricolage_Grotesque, Manrope, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { COMPANY } from '@/lib/company'

const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
})
const body = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
})
const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.baseUrl),
  title: {
    default: 'LinkBio Pro — Bio Linkinizi Oluşturun',
    template: '%s',
  },
  description:
    'Tek bir link ile tüm sosyal medya hesaplarınızı ve web sitelerinizi paylaşın. Ücretsiz başlayın, Pro ile sınırsız kullanın.',
  openGraph: {
    title: 'LinkBio Pro — Bio Linkinizi Oluşturun',
    description:
      'Tek bir link ile tüm sosyal medya hesaplarınızı ve web sitelerinizi paylaşın.',
    url: COMPANY.baseUrl,
    siteName: COMPANY.brand,
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'LinkBio Pro — Bio Linkinizi Oluşturun',
    description:
      'Tek bir link ile tüm sosyal medya hesaplarınızı ve web sitelerinizi paylaşın.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
