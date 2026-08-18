'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Logo } from '@/components/Logo'
import { SiteFooter } from '@/components/SiteFooter'

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7 10a3 3 0 0 1 3-3h1.5v1.5H10a1.5 1.5 0 0 0 0 3h1.5V13H10a3 3 0 0 1-3-3z" fill="currentColor"/>
        <path d="M13 10a3 3 0 0 1-3 3H8.5v-1.5H10a1.5 1.5 0 0 0 0-3H8.5V7H10a3 3 0 0 1 3 3z" fill="currentColor"/>
        <rect x="9.25" y="7" width="1.5" height="6" rx=".75" fill="currentColor"/>
      </svg>
    ),
    title: 'Sınırsız Link',
    desc: 'Pro planda istediğiniz kadar link ekleyin. Sosyal medya, web sitesi, iletişim — hepsi tek yerde.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 14l3.5-4 2.5 3 3-4L16 14H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="14" cy="5" r="1.5" fill="currentColor"/>
      </svg>
    ),
    title: 'Tıklama Analitiği',
    desc: 'Her linkin kaç tıklama aldığını gerçek zamanlı takip edin. Hangi içeriğin işe yaradığını görün.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3" fill="currentColor"/>
        <path d="M10 3v2m0 10v2M3 10h2m10 0h2m-2.93-4.07-1.42 1.42M7.35 12.65l-1.42 1.42m0-8.14 1.42 1.42m5.3 5.3 1.42 1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Özel Temalar',
    desc: 'Koyu, açık, mor, yeşil ve daha fazlası. Gradient arka plan ve özel renk desteği.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L3 7v11h5v-5h4v5h5V7l-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Hızlı Kurulum',
    desc: 'Dakikalar içinde profilinizi oluşturun. Hesap açın, linklerinizi ekleyin, paylaşın.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Mobil Uyumlu',
    desc: 'Her cihazda mükemmel görünen profil sayfası. Instagram, TikTok, Twitter bio\'ya hazır.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2a5 5 0 0 0-5 5c0 3.5 5 11 5 11s5-7.5 5-11a5 5 0 0 0-5-5z" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="10" cy="7" r="1.5" fill="currentColor"/>
      </svg>
    ),
    title: 'QR Kod',
    desc: 'Profiliniz için otomatik QR kod. Kartvizitinize ekleyin, yazdırın, paylaşın.',
  },
]

const STEPS = [
  { num: '01', title: 'Ücretsiz Kayıt Olun', desc: 'E-posta adresinizle saniyeler içinde hesap oluşturun. Kredi kartı gerekmez.' },
  { num: '02', title: 'Linklerinizi Ekleyin', desc: 'Instagram, YouTube, web siteniz, Etsy mağazanız — istediğiniz her şeyi ekleyin.' },
  { num: '03', title: 'Bio\'nuza Yapıştırın', desc: 'Profilinizin adresini Instagram veya TikTok bio\'nuzda paylaşın.' },
]

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`scroll-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">

      {/* Navbar */}
      <header className="border-b border-line bg-paper/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="animate-fade-in">
            <Logo />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-soft animate-fade-in delay-100">
            <a href="#nasil-calisir" className="hover:text-ink transition-colors">Nasıl Çalışır</a>
            <a href="#ozellikler" className="hover:text-ink transition-colors">Özellikler</a>
            <a href="#fiyatlar" className="hover:text-ink transition-colors">Fiyatlar</a>
          </nav>
          <div className="flex items-center gap-3 animate-fade-in delay-200">
            <Link href="/giris" className="text-sm font-medium text-ink-soft hover:text-ink transition-colors px-3 py-2">
              Giriş Yap
            </Link>
            <Link
              href="/kayit"
              className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-brand-200 hover:shadow-md"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-28 px-6">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[820px] h-[820px] rounded-full bg-brand-100/60 blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left: text */}
              <div className="text-left">
                <div className="animate-fade-in-up inline-flex items-center gap-2 bg-ink text-white rounded-full px-4 py-1.5 text-sm font-medium mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                  Türkiye&apos;nin link-in-bio aracı
                </div>

                <h1 className="animate-fade-in-up delay-100 font-display text-5xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.05] text-ink mb-6">
                  Tüm Linkleriniz<br />
                  <span className="text-brand-500">
                    Tek Adreste
                  </span>
                </h1>

                <p className="animate-fade-in-up delay-200 text-ink-soft text-xl max-w-xl mb-10 leading-relaxed">
                  Bio linkinizi oluşturun, sosyal medya hesaplarınızı ve web sitelerinizi
                  tek bir sayfada toplayın. Ücretsiz başlayın.
                </p>

                <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-start gap-4 mb-8">
                  <Link
                    href="/kayit"
                    className="group relative bg-ink hover:bg-ink/90 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-ink/10 hover:-translate-y-0.5 w-full sm:w-auto text-center overflow-hidden"
                  >
                    <span className="relative z-10">Ücretsiz Oluştur →</span>
                    <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100" />
                  </Link>
                  <Link
                    href="/giris"
                    className="border border-line hover:border-brand-300 bg-white text-ink-soft hover:text-brand-600 font-medium px-8 py-4 rounded-xl text-base transition-all w-full sm:w-auto text-center hover:shadow-md"
                  >
                    Giriş Yap
                  </Link>
                </div>

                <div className="animate-fade-in-up delay-400 flex items-center gap-3 text-sm text-ink-faint">
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z" fill="#17A589"/></svg>
                    Kredi kartı gerekmez
                  </span>
                  <span className="w-1 h-1 rounded-full bg-line" />
                  <span>2 dakikada kurulum</span>
                  <span className="w-1 h-1 rounded-full bg-line" />
                  <span>Ücretsiz plan sonsuza kadar</span>
                </div>
              </div>

              {/* Right: real profile preview */}
              <div className="animate-fade-in-up delay-400 flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-500/15 rounded-[36px] blur-2xl scale-110" />

                  <div className="animate-float relative bg-ink rounded-[32px] p-2.5 shadow-2xl shadow-ink/30 w-64 rotate-[-2deg]">
                    <div className="bg-[#0f0f13] rounded-[24px] overflow-hidden px-5 pt-8 pb-6">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-xl font-display font-bold text-white">
                          A
                        </div>
                      </div>
                      <p className="text-center font-display font-semibold text-white text-sm">Ahmet Yılmaz</p>
                      <p className="text-center text-white/40 text-xs mt-0.5 mb-5">Dijital pazarlama uzmanı</p>
                      <div className="space-y-2.5">
                        {[
                          { icon: '📸', label: 'Instagram' },
                          { icon: '▶️', label: 'YouTube' },
                          { icon: '🌐', label: 'Web Sitesi' },
                          { icon: '✉️', label: 'İletişim' },
                        ].map(l => (
                          <div
                            key={l.label}
                            className="bg-white/[0.06] hover:bg-white/10 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white font-medium flex items-center gap-2 transition-colors cursor-default"
                          >
                            <span>{l.icon}</span>
                            <span>{l.label}</span>
                          </div>
                        ))}
                        <p className="text-center text-white/25 text-[10px] pt-1">linkbiopro.com.tr/ahmet</p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex absolute -left-20 -top-6 animate-fade-in-up delay-600 bg-white border border-line rounded-2xl px-4 py-2.5 shadow-lg shadow-ink/5 items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-teal-soft flex items-center justify-center text-teal text-sm font-bold shrink-0">↑</div>
                    <div>
                      <p className="text-xs font-bold text-ink font-mono">+248 tıklama</p>
                      <p className="text-[10px] text-ink-faint">Bu hafta</p>
                    </div>
                  </div>

                  <div className="hidden sm:block absolute -right-14 -bottom-6 animate-fade-in-up delay-700 bg-white border border-line rounded-2xl px-4 py-2.5 shadow-lg shadow-ink/5">
                    <p className="text-[10px] text-ink-faint mb-0.5">Bio linki aktif</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                      <p className="text-xs font-bold text-ink">linkbiopro.com.tr/ahmet</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social platforms */}
        <section className="py-8 border-b border-line bg-paper">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-6">Bu platformlara hazır profil</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-ink-faint text-sm font-semibold">
              {['Instagram', 'TikTok', 'YouTube', 'Twitter / X', 'LinkedIn', 'Twitch'].map((p, i) => (
                <RevealSection key={p} delay={i * 60}>
                  <span className="hover:text-ink-soft transition-colors cursor-default tracking-wide">{p}</span>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="nasil-calisir" className="py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <RevealSection className="text-center mb-16">
              <span className="inline-block bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                Nasıl Çalışır
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">3 adımda hazır</h2>
              <p className="text-ink-soft mt-3 text-lg">Dakikalar içinde profilinizi yayınlayın</p>
            </RevealSection>
            <div className="grid sm:grid-cols-3 gap-8">
              {STEPS.map((step, i) => (
                <RevealSection key={step.num} delay={i * 120}>
                  <div className="relative group">
                    {i < STEPS.length - 1 && (
                      <div className="hidden sm:block absolute top-8 left-full w-8 border-t-2 border-dashed border-brand-200 -translate-x-4 z-10" />
                    )}
                    <div className="bg-white border border-line rounded-2xl p-7 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50 hover:-translate-y-1 transition-all duration-300">
                      <div className="w-12 h-12 rounded-2xl bg-ink flex items-center justify-center text-brand-400 font-mono font-black text-lg mb-5 group-hover:scale-110 transition-transform duration-300">
                        {step.num}
                      </div>
                      <h3 className="font-display text-base font-semibold text-ink mb-2">{step.title}</h3>
                      <p className="text-ink-soft text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="ozellikler" className="py-28 px-6 bg-paper-alt">
          <div className="max-w-5xl mx-auto">
            <RevealSection className="text-center mb-16">
              <span className="inline-block bg-teal-soft text-teal text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                Özellikler
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">İhtiyacınız olan her şey</h2>
              <p className="text-ink-soft mt-3 text-lg">Güçlü araçlar, basit arayüz</p>
            </RevealSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <RevealSection key={f.title} delay={i * 80}>
                  <div className="group bg-white border border-line rounded-2xl p-6 hover:shadow-lg hover:shadow-ink/5 hover:border-brand-200 hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform duration-300">
                      {f.icon}
                    </div>
                    <h3 className="font-display font-semibold text-ink text-base mb-2">{f.title}</h3>
                    <p className="text-ink-soft text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="fiyatlar" className="py-28 px-6">
          <div className="max-w-4xl mx-auto">
            <RevealSection className="text-center mb-16">
              <span className="inline-block bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                Fiyatlandırma
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">Basit ve şeffaf</h2>
              <p className="text-ink-soft mt-3 text-lg">Gizli ücret yok. İstediğiniz zaman iptal.</p>
            </RevealSection>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Free */}
              <RevealSection delay={0}>
                <div className="bg-white border border-line rounded-2xl p-8 hover:shadow-lg hover:border-ink-faint/40 transition-all duration-300 h-full flex flex-col">
                  <div>
                    <h3 className="font-display font-bold text-xl text-ink mb-1">Ücretsiz</h3>
                    <p className="text-ink-soft text-sm mb-6">Başlamak için ideal</p>
                    <div className="mb-6">
                      <span className="font-display text-4xl font-black text-ink">₺0</span>
                      <span className="text-ink-faint text-sm">/ay</span>
                    </div>
                    <ul className="space-y-3 text-sm text-ink-soft mb-8">
                      {['5 link', '2 tema (Koyu & Açık)', 'Tıklama sayısı', 'Özel profil URL'].map(f => (
                        <li key={f} className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-teal-soft text-teal flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/kayit"
                    className="mt-auto block w-full border border-line hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 text-center font-semibold py-3 rounded-xl transition-all text-ink-soft"
                  >
                    Ücretsiz Başla
                  </Link>
                </div>
              </RevealSection>

              {/* Pro */}
              <RevealSection delay={120}>
                <div className="relative bg-ink rounded-2xl p-8 text-white shadow-xl shadow-ink/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg tracking-wide">
                    POPÜLER
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl" />
                  <div className="relative">
                    <h3 className="font-display font-bold text-xl mb-1">Pro</h3>
                    <p className="text-white/50 text-sm mb-6">Ciddi içerik üreticileri için</p>
                    <div className="mb-6">
                      <span className="font-display text-4xl font-black">₺59</span>
                      <span className="text-white/40 text-sm">/ay</span>
                    </div>
                    <ul className="space-y-3 text-sm text-white/80 mb-8">
                      {[
                        'Sınırsız link',
                        'Tüm temalar + Tema editörü',
                        'Detaylı analitik & grafikler',
                        'Özel gradient & font seçimi',
                        'Öncelikli destek',
                      ].map(f => (
                        <li key={f} className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-brand-500/30 text-brand-300 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/kayit"
                    className="mt-auto block w-full bg-brand-500 hover:bg-brand-400 text-white text-center font-semibold py-3 rounded-xl transition-colors"
                  >
                    Pro&apos;ya Geç
                  </Link>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-28 px-6 bg-paper-alt">
          <RevealSection>
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-ink rounded-3xl p-14 text-center overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/10 rounded-full" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-500/10 rounded-full" />

                <div className="relative">
                  <span className="inline-block bg-white/10 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                    Hemen Başlayın
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    Profilinizi bugün<br />oluşturun
                  </h2>
                  <p className="text-white/60 mb-8 text-lg">
                    Dakikalar içinde hazır. Kredi kartı gerekmez.
                  </p>
                  <Link
                    href="/kayit"
                    className="inline-block bg-brand-500 hover:bg-brand-400 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all shadow-xl hover:-translate-y-0.5"
                  >
                    Ücretsiz Hesap Oluştur →
                  </Link>
                </div>
              </div>
            </div>
          </RevealSection>
        </section>

      </main>

      <SiteFooter />

    </div>
  )
}
