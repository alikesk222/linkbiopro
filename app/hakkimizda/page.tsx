import { LegalPage } from '@/components/LegalPage'
import { COMPANY } from '@/lib/company'

export const metadata = { title: 'Hakkımızda — LinkBio Pro' }

export default function Page() {
  return (
    <LegalPage title="Hakkımızda">
      <p>
        {COMPANY.brand}, Türkiye&apos;deki içerik üreticileri, girişimciler ve
        markaların sosyal medya biyografilerinde tüm bağlantılarını tek bir
        adreste toplayabilmesi için geliştirilen bir link-in-bio hizmetidir.
      </p>
      <p>
        Instagram, TikTok, YouTube ve Twitter/X gibi platformların biyografi
        alanına yalnızca bir link eklenebilmesi kısıtını aşmak için; kullanıcı
        adı, e-posta ve sosyal medya hesapları, kişisel web siteleri, dijital
        ürünler ve iletişim bilgileri gibi tüm bağlantıları tek bir profil
        sayfasında birleştiriyoruz.
      </p>

      <h2>Ne Sunuyoruz</h2>
      <ul>
        <li>Sınırsız özelleştirilebilir profil sayfası (Pro planda sınırsız link)</li>
        <li>Tıklama başına analitik ve zaman içindeki trend grafikleri</li>
        <li>Koyu, açık ve Pro&apos;ya özel renkli temalar</li>
        <li>Profil için otomatik QR kod üretimi</li>
      </ul>

      <h2>Kurumsal Bilgiler</h2>
      <ul>
        <li>Ticari Unvan: {COMPANY.name}</li>
        <li>Adres: {COMPANY.address}</li>
        <li>Vergi Dairesi / No: {COMPANY.taxOffice} / {COMPANY.taxNo}</li>
        <li>E-posta: {COMPANY.email}</li>
        <li>Telefon: {COMPANY.phone}</li>
      </ul>

      <h2>İletişim</h2>
      <p>
        Sorularınız, iş birliği talepleriniz veya destek ihtiyaçlarınız için{' '}
        <a href="/iletisim">İletişim sayfamızı</a> ziyaret edebilir veya
        doğrudan {COMPANY.email} adresine yazabilirsiniz.
      </p>
    </LegalPage>
  )
}
