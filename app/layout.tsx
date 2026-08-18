import type { Metadata } from 'next'
import './globals.css'
import { COMPANY } from '@/lib/company'

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
    <html lang="tr">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
