// İşletme bilgileri — tek yerden yönetilir.
// [KÖŞELİ PARANTEZLİ] alanları gerçek bilgilerle doldurun; site genelinde
// (footer, yasal sayfalar, iletişim) otomatik güncellenir.
export const COMPANY = {
  // Ticari unvan (şahıs işletmesiyse: "Ad Soyad — Şahıs İşletmesi" biçiminde)
  name: '[İŞLETME UNVANI]',
  brand: 'LinkBio Pro',
  address: '[AÇIK ADRES — mahalle, cadde, no, ilçe/il]',
  email: 'destek@linkbiopro.com.tr',
  phone: '[+90 5XX XXX XX XX]',
  taxOffice: '[VERGİ DAİRESİ]',
  taxNo: '[VERGİ / TC KİMLİK NO]',
  mersis: '', // varsa MERSİS no
  domain: 'linkbiopro.com.tr',
  baseUrl: 'https://linkbiopro.com.tr',
  // Online ödeme (PayTR) aktifleşene kadar manuel havale/EFT için kullanılır.
  // Gerçek IBAN bilgisi girilmeden bu bölüm public sitede GÖSTERİLMEZ.
  bankName: '[BANKA ADI]',
  iban: '',
  ibanAccountHolder: '[HESAP SAHİBİ ADI]',
}

export const PRICING = {
  monthly: 59,
  yearly: 708,
  currency: '₺',
}
