# LinkBio Pro

Türkçe link-in-bio SaaS uygulaması. Kullanıcılar tek bir profil sayfasında tüm linklerini toplayıp Instagram, TikTok veya Twitter biyografilerinde paylaşabilir.

**Canlı:** https://linkbiopro.com.tr

---

## Özellikler

### Kullanıcı
- Kayıt / giriş (JWT, httpOnly cookie)
- Profil sayfası: `/{kullanici_adi}`
- Link ekleme, düzenleme, silme, sıralama (▲▼)
- Aktif/pasif link toggle
- Tıklama takibi — her link `/api/click/[id]` üzerinden redirect eder ve sayaç artırır
- 5 tema: **Koyu**, **Açık** (ücretsiz) — **Mor**, **Pembe**, **Yeşil** (Pro)
- Bio ve görünen ad düzenleme
- Analitik: link başına tıklama sayısı + progress bar

### Plan Yapısı
| Özellik | Ücretsiz | Pro (₺59/ay) |
|---|---|---|
| Link sayısı | 5 | Sınırsız |
| Tema | Koyu + Açık | Tüm temalar |
| Analitik | Tıklama sayısı | Tıklama sayısı |
| Destek | — | Öncelikli |

### Admin Paneli
- URL: `/admin/giris` → `/admin/panel`
- Kullanıcı listesi (arama + filtre: Hepsi / Pro / Ücretsiz)
- Genel istatistikler: toplam üye, Pro üye, link sayısı, toplam tıklama
- Pro aktifleştirme: bitiş tarihi + ödeme notu ile
- Pro kaldırma
- Kullanıcı silme

---

## Teknoloji

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 15 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS v3 |
| Veritabanı | PostgreSQL (Prisma ORM) |
| Auth | JWT (jose) + bcryptjs |
| Sunucu | Node.js (PM2) |
| Reverse Proxy | nginx |

---

## Proje Yapısı

```
linkbiopro/
├── app/
│   ├── page.tsx                    # Landing sayfası
│   ├── giris/page.tsx              # Kullanıcı girişi
│   ├── kayit/page.tsx              # Kayıt
│   ├── dashboard/page.tsx          # Kullanıcı paneli
│   ├── pro/page.tsx                # Pro yükseltme sayfası
│   ├── [username]/page.tsx         # Herkese açık profil
│   ├── admin/
│   │   ├── giris/page.tsx          # Admin girişi
│   │   └── panel/page.tsx          # Admin paneli
│   └── api/
│       ├── auth/giris/             # POST — kullanıcı girişi
│       ├── auth/kayit/             # POST — kayıt
│       ├── auth/cikis/             # POST — çıkış
│       ├── me/                     # GET — oturum bilgisi
│       ├── links/                  # GET, POST — link listesi / yeni link
│       ├── links/[id]/             # PUT, DELETE — link güncelle / sil
│       ├── profile/                # PUT — profil güncelle
│       ├── click/[id]/             # GET — tıklama takip + redirect
│       └── admin/
│           ├── auth/               # POST, DELETE — admin oturumu
│           ├── stats/              # GET — platform istatistikleri
│           └── users/[id]/         # PATCH, DELETE — kullanıcı yönetimi
├── lib/
│   ├── auth.ts                     # JWT yardımcıları (kullanıcı)
│   ├── admin-auth.ts               # JWT yardımcıları (admin)
│   └── db.ts                       # Prisma client singleton
├── middleware.ts                   # Route koruması
└── prisma/
    └── schema.prisma               # Veritabanı şeması
```

---

## Veritabanı Şeması

```prisma
User       — id, email, password, username, displayName, bio, theme
             isPro, proExpiresAt, proNote, createdAt
Link       — id, userId, title, url, order, clicks, isActive, createdAt
ClickLog   — id, linkId, clickedAt, referrer
```

---

## Ortam Değişkenleri

`.env` dosyasında tanımlanması gerekenler (fallback YOK — biri eksikse uygulama build/start anında hata verir):

```env
DATABASE_URL="postgresql://kullanici:sifre@127.0.0.1:5432/linkbiopro"
JWT_SECRET="openssl rand -hex 32 ile uretilmis guclu bir deger"
ADMIN_PASSWORD="guclu bir yonetim sifresi"
NEXT_PUBLIC_BASE_URL="https://linkbiopro.com.tr"
NODE_ENV="production"
```

İşletme/iletişim bilgileri (footer, yasal sayfalar, iletişim sayfası) tek
dosyadan yönetilir: [`lib/company.ts`](lib/company.ts).

---

## VPS Kurulumu

```bash
# Bağımlılıklar
npm install

# Veritabanı şemasını uygula
npx prisma db push

# Build
npm run build

# PM2 ile başlat (port 3004)
pm2 start npm --name "linkbiopro" -- start -- -p 3004
pm2 save
```

**nginx** `/etc/nginx/sites-available/linkbiopro.com.tr`:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name linkbiopro.com.tr www.linkbiopro.com.tr;

    location / {
        proxy_pass         http://127.0.0.1:3004;
        proxy_http_version 1.1;
        proxy_set_header   Host               $host;
        proxy_set_header   X-Real-IP          $remote_addr;
        proxy_set_header   X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto  $scheme;
    }
}
```

SSL, `certbot --nginx -d linkbiopro.com.tr -d www.linkbiopro.com.tr` ile
kurulup nginx config'ine otomatik işlenir.

---

## Çalışan Servisler (VPS)

Bu sunucu paylaşımlıdır — birçok farklı proje aynı VPS'de PM2 altında
çalışır. `linkbiopro` PM2 process adı ve port 3004, diğer servislerle
çakışmayacak şekilde seçilmiştir; yeni bir servis eklerken
`pm2 list` ve `ss -tlnp` ile mevcut port/isimleri kontrol edin.

| Servis | PM2 Adı | Port |
|---|---|---|
| Next.js app | `linkbiopro` | 3004 (nginx → 80/443) |

---

## Roadmap

- [ ] PayTR entegrasyonu (bkz. `app/api/payment/`)
- [ ] Pro süresi dolan kullanıcıları otomatik düşüren günlük cron
- [ ] Özel domain desteği (Pro)
- [ ] Sosyal medya ikon desteği genişletme
- [ ] `db push` → `prisma migrate` geçişi (güvenli baseline gerektirir)
