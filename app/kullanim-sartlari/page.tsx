import { LegalPage } from '@/components/LegalPage'
import { COMPANY, PRICING } from '@/lib/company'

export const metadata = { title: 'Kullanım Şartları — LinkBio Pro' }

export default function Page() {
  return (
    <LegalPage title="Kullanım Şartları" updated="18 Ağustos 2026">
      <h2>1. Kabul</h2>
      <p>
        {COMPANY.baseUrl} adresinde sunulan {COMPANY.brand} hizmetine ({'"'}
        Hizmet{'"'}) kayıt olarak veya hizmeti kullanarak işbu şartları kabul
        etmiş olursunuz. Şartları kabul etmiyorsanız hizmeti kullanmayınız.
      </p>

      <h2>2. Hizmetin Tanımı</h2>
      <p>
        {COMPANY.brand}, kullanıcıların tek bir profil sayfasında sosyal
        medya ve web bağlantılarını toplamasını sağlayan bir link-in-bio
        aracıdır. Ücretsiz plan ve Pro plan olarak iki seviyede sunulur; Pro
        planın güncel fiyatı ve kapsamı {' '}
        <a href="/pro">Pro sayfasında</a> ve {' '}
        <a href="/on-bilgilendirme-formu">Ön Bilgilendirme Formu</a>&apos;nda
        belirtilir (Aylık {PRICING.currency}{PRICING.monthly} / Yıllık{' '}
        {PRICING.currency}{PRICING.yearly}).
      </p>

      <h2>3. Hesap Sorumluluğu</h2>
      <ul>
        <li>Kayıt sırasında verdiğiniz bilgilerin doğru olduğunu taahhüt edersiniz.</li>
        <li>Hesap kimlik bilgilerinizin gizliliğinden ve hesabınız altında gerçekleşen tüm işlemlerden siz sorumlusunuz.</li>
        <li>13 yaşından küçüklerin hesap açması yasaktır.</li>
      </ul>

      <h2>4. Kabul Edilebilir Kullanım</h2>
      <p>Hizmeti kullanırken şunları yapamazsınız:</p>
      <ul>
        <li>Yasa dışı içerik, dolandırıcılık, oltalama (phishing) veya kötü amaçlı yazılım barındıran/yönlendiren linkler eklemek,</li>
        <li>Başkalarının fikri mülkiyet haklarını ihlal eden içerik paylaşmak,</li>
        <li>Nefret söylemi, taciz veya şiddet içeren içerik yaymak,</li>
        <li>Hizmeti otomatik araçlarla (bot, scraper) kötüye kullanmak veya aşırı yüklemek,</li>
        <li>Başka bir kullanıcının hesabına yetkisiz erişim sağlamaya çalışmak.</li>
      </ul>
      <p>
        Bu kurallara aykırı kullanım tespit edildiğinde, bildirimde bulunmadan
        ilgili içerik kaldırılabilir veya hesap askıya alınabilir/kapatılabilir.
      </p>

      <h2>5. Ücretlendirme</h2>
      <p>
        Ücretsiz plan süresiz olarak kullanılabilir. Pro plan ücretlidir ve{' '}
        <a href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</a> ile{' '}
        <a href="/iptal-ve-iade">İptal &amp; İade Koşulları</a> hükümlerine
        tabidir.
      </p>

      <h2>6. Fikri Mülkiyet</h2>
      <p>
        {COMPANY.brand} markası, logosu ve site tasarımı {COMPANY.name}
        &apos;a aittir. Eklediğiniz içerik (profil bilgileri, linkler) size
        aittir; hizmeti sunabilmemiz için gerekli ölçüde bu içeriği
        barındırma ve görüntüleme hakkını bize verirsiniz.
      </p>

      <h2>7. Hizmetin Değişimi ve Sonlandırılması</h2>
      <p>
        Hizmeti geliştirmek amacıyla özelliklerde değişiklik yapma hakkımızı
        saklı tutarız. Kullanım şartlarının ihlali hâlinde hesabınızı önceden
        bildirimde bulunarak veya bulunmaksızın askıya alabilir ya da
        kapatabiliriz.
      </p>

      <h2>8. Sorumluluğun Sınırlandırılması</h2>
      <p>
        Hizmet {'"'}olduğu gibi{'"'} sunulur. Planlı bakım, üçüncü taraf
        altyapı kesintileri veya mücbir sebeplerden kaynaklanan geçici
        erişim sorunlarından sorumluluk kabul edilmez; bu durumlarda makul
        özen gösterilerek hizmetin en kısa sürede yeniden sağlanması
        amaçlanır.
      </p>

      <h2>9. Değişiklikler</h2>
      <p>
        İşbu şartlar güncellenebilir; önemli değişiklikler sitede veya
        e-posta ile bildirilir. Güncel sürüm her zaman bu sayfada yer alır.
      </p>

      <h2>10. İletişim</h2>
      <p>Sorularınız için: {COMPANY.email}</p>
    </LegalPage>
  )
}
