import { LegalPage } from '@/components/LegalPage'
import { COMPANY } from '@/lib/company'

export const metadata = { title: 'Gizlilik Politikası ve KVKK — LinkBio Pro' }

export default function Page() {
  return (
    <LegalPage title="Gizlilik Politikası ve KVKK Aydınlatma Metni" updated="18 Ağustos 2026">
      <h2>1. Veri Sorumlusu</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
        uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla{' '}
        <strong>{COMPANY.name}</strong> ({COMPANY.address},{' '}
        {COMPANY.email}) tarafından aşağıda açıklanan kapsamda işlenmektedir.
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li><strong>Kimlik ve iletişim:</strong> ad-soyad (görünen ad), e-posta adresi</li>
        <li><strong>Hesap verileri:</strong> kullanıcı adı, profil bilgileri (bio, avatar), eklediğiniz linkler</li>
        <li><strong>İşlem güvenliği:</strong> IP adresi, oturum kayıtları, erişim logları</li>
        <li><strong>Kullanım verileri:</strong> profil linklerinize yapılan tıklamalara ait anonim istatistikler (zaman, yönlendiren site)</li>
        <li><strong>Ödeme bilgileri:</strong> ödeme işlemleri anlaşmalı ödeme kuruluşu üzerinden gerçekleşir; kart bilgileriniz sistemlerimizde <strong>saklanmaz</strong></li>
      </ul>

      <h2>3. İşleme Amaçları ve Hukuki Sebepler</h2>
      <ul>
        <li>Üyelik sözleşmesinin kurulması ve hizmetin sunulması (KVKK m.5/2-c: sözleşmenin ifası)</li>
        <li>Ödeme ve abonelik işlemlerinin yürütülmesi (m.5/2-c ve m.5/2-ç: hukuki yükümlülük)</li>
        <li>Hizmet güvenliğinin sağlanması, kötüye kullanımın önlenmesi (m.5/2-f: meşru menfaat)</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi ve yetkili kurum taleplerinin karşılanması (m.5/2-ç)</li>
        <li>Destek taleplerinin yanıtlanması (m.5/2-c)</li>
      </ul>

      <h2>4. Verilerin Aktarılması</h2>
      <p>
        Kişisel verileriniz; ödeme işlemlerinin gerçekleştirilmesi amacıyla
        anlaşmalı ödeme kuruluşlarına, barındırma hizmeti aldığımız sunucu
        sağlayıcılarına ve hukuken yetkili kamu kurumlarına, yalnızca ilgili
        amaçla sınırlı olarak aktarılabilir. Verileriniz pazarlama amacıyla
        üçüncü kişilerle paylaşılmaz.
      </p>

      <h2>5. Saklama Süresi</h2>
      <p>
        Hesap verileriniz üyeliğiniz süresince saklanır; hesabınızı
        sildiğinizde profil ve link verileriniz silinir. Yasal saklama
        yükümlülüğüne tabi kayıtlar (ör. fatura ve işlem kayıtları) ilgili
        mevzuattaki süreler boyunca muhafaza edilir.
      </p>

      <h2>6. Çerezler</h2>
      <p>
        Sitede yalnızca oturumunuzu sürdürmek için zorunlu çerezler
        (oturum çerezi) kullanılır. Reklam veya üçüncü taraf takip çerezi
        kullanılmaz.
      </p>

      <h2>7. KVKK Kapsamındaki Haklarınız</h2>
      <p>KVKK m.11 uyarınca;</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
        <li>Aktarıldığı üçüncü kişileri bilme,</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
        <li>KVKK m.7 kapsamında silinmesini veya yok edilmesini isteme,</li>
        <li>İşlemenin münhasıran otomatik sistemlerle analizi sonucu aleyhinize bir sonucun doğmasına itiraz etme,</li>
        <li>Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
      </ul>
      <p>
        haklarına sahipsiniz. Taleplerinizi {COMPANY.email} adresine
        iletebilirsiniz; başvurunuz en geç 30 gün içinde ücretsiz olarak
        sonuçlandırılır.
      </p>
    </LegalPage>
  )
}
