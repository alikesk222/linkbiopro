import { LegalPage } from '@/components/LegalPage'
import { COMPANY } from '@/lib/company'

export const metadata = { title: 'İletişim — LinkBio Pro' }

export default function Page() {
  return (
    <LegalPage title="İletişim">
      <p>
        Bize aşağıdaki kanallardan ulaşabilirsiniz. Destek taleplerine
        genellikle <strong>1 iş günü</strong> içinde yanıt veriyoruz.
      </p>

      <h2>İletişim Bilgileri</h2>
      <ul>
        <li><strong>Ticari Unvan:</strong> {COMPANY.name}</li>
        <li><strong>Adres:</strong> {COMPANY.address}</li>
        <li><strong>E-posta:</strong> <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
        <li><strong>Telefon:</strong> {COMPANY.phone}</li>
      </ul>

      <h2>Konuya Göre Yönlendirme</h2>
      <ul>
        <li><strong>Fatura / ödeme sorunları:</strong> {COMPANY.email} — konu satırına &quot;Ödeme&quot; yazın</li>
        <li><strong>Teknik destek:</strong> {COMPANY.email} — konu satırına &quot;Destek&quot; yazın</li>
        <li><strong>KVKK / veri talepleri:</strong> {COMPANY.email} — konu satırına &quot;KVKK&quot; yazın</li>
      </ul>
    </LegalPage>
  )
}
