import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { COMPANY } from '@/lib/company'

const LEGAL_LINKS = [
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/kullanim-sartlari', label: 'Kullanım Şartları' },
  { href: '/gizlilik-politikasi', label: 'Gizlilik & KVKK' },
  { href: '/mesafeli-satis-sozlesmesi', label: 'Mesafeli Satış Sözleşmesi' },
  { href: '/on-bilgilendirme-formu', label: 'Ön Bilgilendirme Formu' },
  { href: '/iptal-ve-iade', label: 'İptal & İade Koşulları' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              Tüm linklerinizi tek bir sayfada toplayın, sosyal medya
              biyografinizde paylaşın.
            </p>
            <p className="mt-4 text-xs text-ink-faint">
              {COMPANY.name}
              <br />
              {COMPANY.address}
              <br />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-ink-soft transition-colors">
                {COMPANY.email}
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm content-start">
            <p className="col-span-2 text-xs font-semibold uppercase tracking-wider text-ink-faint mb-2">
              Kurumsal
            </p>
            {LEGAL_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-ink-soft hover:text-ink transition-colors py-0.5"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint">
          <p>&copy; {new Date().getFullYear()} {COMPANY.brand} — Tüm hakları saklıdır.</p>
          <p>Dijital hizmet · Ödeme sonrası anında aktivasyon</p>
        </div>
      </div>
    </footer>
  )
}
