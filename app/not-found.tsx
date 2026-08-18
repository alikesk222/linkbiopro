import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-100 px-6 h-16 flex items-center">
        <Link href="/"><Logo /></Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold text-indigo-600 mb-3">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sayfa bulunamadı</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Belki
          aradığınız bir kullanıcı profilidir — kullanıcı adının doğru
          yazıldığından emin olun.
        </p>
        <Link
          href="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Ana sayfaya dön
        </Link>
      </main>
    </div>
  )
}
