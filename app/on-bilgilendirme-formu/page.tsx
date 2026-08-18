import { LegalPage } from '@/components/LegalPage'
import { COMPANY, PRICING } from '@/lib/company'

export const metadata = { title: 'Ön Bilgilendirme Formu — LinkBio Pro' }

export default function Page() {
  return (
    <LegalPage title="Ön Bilgilendirme Formu" updated="18 Ağustos 2026">
      <p>
        İşbu form, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
        Sözleşmeler Yönetmeliği uyarınca, mesafeli satış sözleşmesi
        kurulmadan önce tüketicinin bilgilendirilmesi amacıyla hazırlanmıştır.
      </p>

      <h2>1. Satıcı Bilgileri</h2>
      <ul>
        <li>Unvan: {COMPANY.name}</li>
        <li>Adres: {COMPANY.address}</li>
        <li>E-posta: {COMPANY.email}</li>
        <li>Telefon: {COMPANY.phone}</li>
        <li>Vergi Dairesi / No: {COMPANY.taxOffice} / {COMPANY.taxNo}</li>
      </ul>

      <h2>2. Hizmetin Temel Nitelikleri</h2>
      <p>
        <strong>{COMPANY.brand} Pro Aboneliği:</strong> {COMPANY.baseUrl}{' '}
        üzerinde sunulan link-in-bio profil hizmetinin genişletilmiş sürümü.
        Kapsamı: sınırsız link ekleme, tüm temalar ve tema editörü, detaylı
        tıklama analitiği, öncelikli destek.
      </p>

      <h2>3. Fiyat ve Ödeme</h2>
      <table>
        <thead>
          <tr><th>Plan</th><th>Süre</th><th>Fiyat (KDV dahil)</th></tr>
        </thead>
        <tbody>
          <tr><td>Pro Aylık</td><td>1 ay</td><td>{PRICING.currency}{PRICING.monthly}</td></tr>
          <tr><td>Pro Yıllık</td><td>12 ay</td><td>{PRICING.currency}{PRICING.yearly}</td></tr>
        </tbody>
      </table>
      <p>
        Belirtilen fiyatlara tüm vergiler dahildir; ayrıca kargo, teslimat veya
        başkaca ek masraf yoktur. Ödeme, sitede sunulan ödeme yöntemleriyle
        (kredi kartı / banka kartı) yapılır. Abonelik otomatik yenilenmez.
      </p>

      <h2>4. İfa (Teslimat)</h2>
      <p>
        Hizmet dijitaldir; ödemenin onaylanmasıyla birlikte Pro özellikler
        hesabınızda <strong>anında</strong> aktifleştirilir.
      </p>

      <h2>5. Cayma Hakkına İlişkin Bilgilendirme</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği m.15/1-ğ uyarınca, elektronik ortamda
        anında ifa edilen hizmetlerde <strong>cayma hakkı bulunmamaktadır</strong>.
        Ödemeyi tamamlayarak hizmetin anında ifasına onay vermiş ve cayma
        hakkınızın bulunmadığı konusunda bilgilendirilmiş sayılırsınız.
        Hizmetin hiç veya gereği gibi sunulmaması hâlindeki yasal haklarınız
        saklıdır (bkz. <a href="/iptal-ve-iade">İptal &amp; İade Koşulları</a>).
      </p>

      <h2>6. Şikâyet ve Uyuşmazlık</h2>
      <p>
        Şikâyetlerinizi {COMPANY.email} adresine iletebilirsiniz.
        Uyuşmazlıklarda, Ticaret Bakanlığınca ilan edilen parasal sınırlar
        dâhilinde yerleşim yerinizdeki Tüketici Hakem Heyetleri ve Tüketici
        Mahkemeleri yetkilidir.
      </p>
    </LegalPage>
  )
}
