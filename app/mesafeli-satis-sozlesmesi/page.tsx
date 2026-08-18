import { LegalPage } from '@/components/LegalPage'
import { COMPANY, PRICING } from '@/lib/company'

export const metadata = { title: 'Mesafeli Satış Sözleşmesi — LinkBio Pro' }

export default function Page() {
  return (
    <LegalPage title="Mesafeli Satış Sözleşmesi" updated="18 Ağustos 2026">
      <h2>1. Taraflar</h2>
      <p><strong>Satıcı:</strong></p>
      <ul>
        <li>Unvan: {COMPANY.name}</li>
        <li>Adres: {COMPANY.address}</li>
        <li>E-posta: {COMPANY.email}</li>
        <li>Telefon: {COMPANY.phone}</li>
        <li>Vergi Dairesi / No: {COMPANY.taxOffice} / {COMPANY.taxNo}</li>
      </ul>
      <p>
        <strong>Alıcı:</strong> {COMPANY.baseUrl} sitesine üye olan ve Pro abonelik
        satın alma işlemini gerçekleştiren gerçek kişi (bundan sonra
        &quot;Alıcı&quot; olarak anılacaktır). Alıcının kimlik ve iletişim
        bilgileri, üyelik kaydı sırasında beyan ettiği bilgilerden oluşur.
      </p>

      <h2>2. Konu</h2>
      <p>
        İşbu sözleşmenin konusu, Alıcının {COMPANY.baseUrl} internet sitesi
        üzerinden elektronik ortamda siparişini verdiği aşağıda nitelikleri ve
        satış fiyatı belirtilen dijital hizmetin sunumu ile ilgili olarak 6502
        sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin
        belirlenmesidir.
      </p>

      <h2>3. Sözleşme Konusu Hizmet</h2>
      <p>
        <strong>{COMPANY.brand} Pro Aboneliği</strong> — link-in-bio profil
        sayfası hizmetinin genişletilmiş sürümü: sınırsız link ekleme, tüm
        temalar ve tema editörü, detaylı tıklama analitiği ve öncelikli destek.
      </p>
      <table>
        <thead>
          <tr><th>Plan</th><th>Süre</th><th>Fiyat (KDV dahil)</th></tr>
        </thead>
        <tbody>
          <tr><td>Pro Aylık</td><td>1 ay</td><td>{PRICING.currency}{PRICING.monthly}</td></tr>
          <tr><td>Pro Yıllık</td><td>12 ay</td><td>{PRICING.currency}{PRICING.yearly}</td></tr>
        </tbody>
      </table>

      <h2>4. Teslimat (İfa)</h2>
      <p>
        Hizmet dijital ortamda sunulur; fiziksel teslimat yoktur. Ödemenin
        onaylanmasının ardından Pro özellikler Alıcının hesabında{' '}
        <strong>anında</strong> aktifleştirilir. Aktivasyon, hizmetin ifasının
        başladığı an kabul edilir.
      </p>

      <h2>5. Ödeme</h2>
      <p>
        Ödeme, sitede sunulan ödeme yöntemleri (kredi kartı / banka kartı)
        aracılığıyla yapılır. Abonelik, süre sonunda otomatik olarak
        yenilenmez; Alıcı dilerse süresi dolmadan yeni dönem satın alabilir.
      </p>

      <h2>6. Cayma Hakkı</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15/1-ğ maddesi uyarınca,
        <strong> elektronik ortamda anında ifa edilen hizmetler ve tüketiciye
        anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde cayma
        hakkı kullanılamaz.</strong> Pro abonelik, ödeme sonrasında anında
        aktifleştirilen dijital bir hizmet olduğundan, Alıcı sipariş öncesinde
        bu istisna hakkında bilgilendirildiğini ve aktivasyonla birlikte cayma
        hakkının bulunmadığını kabul eder.
      </p>
      <p>
        Hizmetin hiç sunulamaması veya ayıplı ifası hâlinde Alıcının 6502
        sayılı Kanun&apos;dan doğan hakları saklıdır; bu durumlarda{' '}
        <a href="/iptal-ve-iade">İptal &amp; İade Koşulları</a> uygulanır.
      </p>

      <h2>7. Satıcının Yükümlülükleri</h2>
      <p>
        Satıcı, hizmeti sözleşmeye uygun, eksiksiz ve taahhüt edilen
        niteliklere uygun şekilde sunmakla yükümlüdür. Planlı bakım veya
        teknik zorunluluklar dışında hizmetin kesintisiz sunulması için makul
        özen gösterilir.
      </p>

      <h2>8. Uyuşmazlıkların Çözümü</h2>
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığınca her yıl
        ilan edilen parasal sınırlar dâhilinde Alıcının yerleşim yerinin
        bulunduğu veya işlemin yapıldığı yerdeki Tüketici Hakem Heyetleri ile
        Tüketici Mahkemeleri yetkilidir.
      </p>

      <h2>9. Yürürlük</h2>
      <p>
        Alıcı, sipariş onayı öncesinde işbu sözleşmeyi ve{' '}
        <a href="/on-bilgilendirme-formu">Ön Bilgilendirme Formu</a>&apos;nu
        okuduğunu ve kabul ettiğini elektronik ortamda teyit eder. Sözleşme,
        ödemenin tamamlanmasıyla yürürlüğe girer.
      </p>
    </LegalPage>
  )
}
