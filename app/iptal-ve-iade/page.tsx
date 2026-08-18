import { LegalPage } from '@/components/LegalPage'
import { COMPANY } from '@/lib/company'

export const metadata = { title: 'İptal ve İade Koşulları — LinkBio Pro' }

export default function Page() {
  return (
    <LegalPage title="İptal ve İade Koşulları" updated="18 Ağustos 2026">
      <h2>1. Hizmetin Niteliği</h2>
      <p>
        {COMPANY.brand} Pro aboneliği, ödemenin onaylanmasıyla birlikte
        hesabınızda <strong>anında aktifleştirilen dijital bir hizmettir</strong>.
        Fiziksel teslimat yoktur.
      </p>

      <h2>2. Cayma Hakkı İstisnası</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği m.15/1-ğ uyarınca, elektronik ortamda
        anında ifa edilen hizmetlerde cayma hakkı kullanılamaz. Bu nedenle,
        aktivasyonu gerçekleşmiş Pro abonelikler için — hizmet kusursuz
        çalıştığı sürece — iade yapılmaz. Satın alma öncesinde bu husus{' '}
        <a href="/on-bilgilendirme-formu">Ön Bilgilendirme Formu</a>&apos;nda
        açıkça belirtilir ve onayınız alınır.
      </p>

      <h2>3. İade Yapılan Durumlar</h2>
      <p>Aşağıdaki hâllerde ücret iadesi yapılır:</p>
      <ul>
        <li>Ödeme alındığı hâlde Pro özelliklerin <strong>hiç aktifleştirilememesi</strong> ve destek başvurusuna rağmen 48 saat içinde çözülememesi,</li>
        <li>Aynı işlem için <strong>mükerrer tahsilat</strong> yapılması (fazla tahsil edilen tutar iade edilir),</li>
        <li>Hizmetin, taahhüt edilen temel özelliklerle <strong>sürekli ve giderilemez biçimde uyumsuz</strong> olması.</li>
      </ul>
      <p>
        İade talepleri {COMPANY.email} adresine, ödemeye ilişkin bilgilerle
        birlikte iletilmelidir. Onaylanan iadeler, ödemenin yapıldığı yönteme
        bağlı olarak 14 gün içinde gerçekleştirilir; kartınıza yansıma süresi
        bankanıza göre değişebilir.
      </p>

      <h2>4. Abonelik İptali</h2>
      <p>
        Abonelik otomatik yenilenmez; dönem sonunda yenileme yapılmazsa Pro
        özellikler kapanır, hesabınız ücretsiz plana döner ve verileriniz
        korunur. Mevcut dönem içinde iptal talep etmeniz hâlinde hizmet dönem
        sonuna kadar kullanılabilir; kalan süre için kısmi iade yapılmaz.
      </p>

      <h2>5. Hesap Silme</h2>
      <p>
        Hesabınızın tamamen silinmesini istediğinizde {COMPANY.email}{' '}
        adresine başvurabilirsiniz; profiliniz, linkleriniz ve kişisel
        verileriniz <a href="/gizlilik-politikasi">Gizlilik Politikası</a>
        &apos;nda belirtilen esaslara göre silinir.
      </p>

      <h2>6. Başvuru ve Uyuşmazlık</h2>
      <p>
        Her türlü talep için: {COMPANY.email}. Uyuşmazlıklarda Tüketici Hakem
        Heyetleri ve Tüketici Mahkemeleri yetkilidir.
      </p>
    </LegalPage>
  )
}
