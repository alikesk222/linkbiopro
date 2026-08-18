import type { MetadataRoute } from 'next'
import { COMPANY } from '@/lib/company'

const STATIC_PATHS = [
  '',
  '/giris',
  '/kayit',
  '/pro',
  '/hakkimizda',
  '/iletisim',
  '/kullanim-sartlari',
  '/gizlilik-politikasi',
  '/mesafeli-satis-sozlesmesi',
  '/on-bilgilendirme-formu',
  '/iptal-ve-iade',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_PATHS.map(path => ({
    url: `${COMPANY.baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.5,
  }))
}
