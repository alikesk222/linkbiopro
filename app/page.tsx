import Link from 'next/link'

const FEATURES = [
  {
    icon: '🔗',
    title: 'Sınırsız Link',
    desc: 'Pro planda istediğiniz kadar link ekleyin. Sosyal medya, web sitesi, iletişim — hepsi tek yerde.',
  },
  {
    icon: '📊',
    title: 'Tıklama Analitiği',
    desc: 'Her linkin kaç tıklama aldığını gerçek zamanlı takip edin. Hangi içeriğin işe yaradığını görün.',
  },
  {
    icon: '🎨',
    title: 'Özel Temalar',
    desc: 'Koyu, açık, mor, yeşil ve daha fazlası. Profilinizi markanıza uygun şekilde özelleştirin.',
  },
  {
    icon: '⚡',
    title: 'Hızlı Kurulum',
    desc: 'Dakikalar içinde profilinizi oluşturun. Hesap açın, linklerinizi ekleyin, paylaşın.',
  },
  {
    icon: '📱',
    title: 'Mobil Uyumlu',
    desc: 'Her cihazda mükemmel görünen profil sayfası. Instagram, TikTok, Twitter bio\'ya hazır.',
  },
  {
    icon: '🔒',
    title: 'Güvenli & Hızlı',
    desc: 'HTTPS ile güvenli, CDN ile hızlı. Profiliniz her zaman erişilebilir.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Ücretsiz Kayıt Olun',
    desc: 'E-posta adresinizle saniyeler içinde hesap oluşturun. Kredi kartı gerekmez.',
  },
  {
    num: '02',
    title: 'Linklerinizi Ekleyin',
    desc: 'Instagram, YouTube, web siteniz, Etsy mağazanız — istediğiniz her şeyi ekleyin.',
  },
  {
    num: '03',
    title: 'Bio\'nuza Yapıştırın',
    desc: 'linkbio.pro/kullaniciadi adresinizi Instagram veya TikTok bio\'nuzda paylaşın.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <header className="border-b border-slate-800/60 bg-[#0a0f1e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">L</div>
            <span className="font-bold text-white text-lg tracking-tight">LinkBio Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/giris"
              className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
            >
              Giriş Yap
            </Link>
            <Link
              href="/kayit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden pt-24 pb-20 px-6">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-800/50 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Türkiye&apos;nin link-in-bio aracı
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
              Tüm Linkleriniz<br />
              <span className="text-indigo-400">Tek Adreste</span>
            </h1>

            <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Bio linkinizi oluşturun, sosyal medya hesaplarınızı ve web sitelerinizi
              tek bir sayfada toplayın. Ücretsiz başlayın.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/kayit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors w-full sm:w-auto text-center"
              >
                Ücretsiz Oluştur &rarr;
              </Link>
              <Link
                href="/giris"
                className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-8 py-4 rounded-xl text-lg transition-colors w-full sm:w-auto text-center"
              >
                Giriş Yap
              </Link>
            </div>

            {/* Demo profile preview */}
            <div className="mt-16 flex justify-center">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 w-72 text-center shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold mx-auto mb-3">A</div>
                <p className="font-semibold text-white mb-1">Ahmet Yılmaz</p>
                <p className="text-slate-400 text-sm mb-5">Dijital pazarlama uzmanı</p>
                <div className="space-y-2.5">
                  {['Instagram', 'YouTube', 'Web Sitesi', 'İletişim'].map(l => (
                    <div key={l} className="bg-indigo-600/20 border border-indigo-700/40 rounded-xl py-2.5 text-sm text-white font-medium">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-slate-600 text-xs mt-4">linkbio.pro/ahmet</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="nasil-calisir" className="py-20 px-6 border-t border-slate-800/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Nasıl Çalışır</p>
              <h2 className="text-3xl sm:text-4xl font-bold">3 adımda hazır</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {STEPS.map(step => (
                <div key={step.num} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-7">
                  <div className="text-5xl font-black text-slate-800 mb-4 leading-none">{step.num}</div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 border-t border-slate-800/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Özellikler</p>
              <h2 className="text-3xl sm:text-4xl font-bold">İhtiyacınız olan her şey</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(f => (
                <div key={f.title} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-colors">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="fiyatlar" className="py-20 px-6 border-t border-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Fiyatlandırma</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Basit ve şeffaf</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Free */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h3 className="font-bold text-xl mb-1">Ücretsiz</h3>
                <p className="text-slate-400 text-sm mb-6">Başlamak için ideal</p>
                <div className="text-4xl font-black mb-6">₺0<span className="text-slate-500 text-base font-normal">/ay</span></div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  {['5 link', '2 tema (Koyu & Açık)', 'Tıklama sayısı', 'Özel profil URL'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/kayit"
                  className="block w-full border border-slate-700 hover:border-indigo-500 text-center font-semibold py-3 rounded-xl transition-colors"
                >
                  Ücretsiz Başla
                </Link>
              </div>

              {/* Pro */}
              <div className="relative bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-700/60 rounded-2xl p-8">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  POPÜLER
                </div>
                <h3 className="font-bold text-xl mb-1">Pro</h3>
                <p className="text-slate-400 text-sm mb-6">Ciddi içerik üreticileri için</p>
                <div className="text-4xl font-black mb-6">₺59<span className="text-slate-500 text-base font-normal">/ay</span></div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  {[
                    'Sınırsız link',
                    'Tüm temalar (5 tema)',
                    'Detaylı analitik',
                    'Öncelikli destek',
                    'Yakında: özel domain',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-indigo-400">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/kayit"
                  className="block w-full bg-indigo-600 hover:bg-indigo-500 text-center font-semibold py-3 rounded-xl transition-colors"
                >
                  Pro&apos;ya Geç
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 border-t border-slate-800/50">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-800/40 rounded-3xl p-12 text-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/15 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-600/10 rounded-full blur-xl" />
              </div>
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Hemen başlayın</h2>
                <p className="text-slate-400 mb-8 text-lg">
                  Dakikalar içinde profilinizi oluşturun. Kredi kartı gerekmez.
                </p>
                <Link
                  href="/kayit"
                  className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-colors"
                >
                  Ücretsiz Hesap Oluştur &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">L</div>
            <span>LinkBio Pro</span>
          </div>
          <p>&copy; {new Date().getFullYear()} LinkBio Pro. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <a href="#nasil-calisir" className="hover:text-slate-300 transition-colors">Nasıl Çalışır</a>
            <a href="#fiyatlar" className="hover:text-slate-300 transition-colors">Fiyatlar</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
