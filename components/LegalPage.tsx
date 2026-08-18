import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { SiteFooter } from '@/components/SiteFooter'

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <header className="border-b border-line bg-paper/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <Link
            href="/kayit"
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-14">
        <article className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">{title}</h1>
          {updated && <p className="text-sm text-ink-faint mb-10">Son güncelleme: {updated}</p>}
          <div className="legal-prose space-y-4 text-[15px] leading-relaxed text-ink-soft [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_strong]:text-ink [&_a]:text-brand-600 [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:py-2 [&_th]:pr-4 [&_th]:border-b [&_th]:border-line [&_td]:py-2 [&_td]:pr-4 [&_td]:border-b [&_td]:border-line">
            {children}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
