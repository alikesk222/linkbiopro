import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinkBio Pro — Bio Linkinizi Oluşturun',
  description:
    'Tek bir link ile tüm sosyal medya hesaplarınızı ve web sitelerinizi paylaşın. Ücretsiz başlayın, Pro ile sınırsız kullanın.',
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
