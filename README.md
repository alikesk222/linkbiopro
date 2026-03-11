# LinkBio Pro

Türkçe link-in-bio SaaS uygulaması. Kullanıcılar tek bir profil sayfasında tüm linklerini toplayıp Instagram, TikTok veya Twitter biyografilerinde paylaşabilir.

**Canlı:** `http://89.47.113.48:7000`

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
| Veritabanı | SQLite (Prisma ORM) |
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

`.env` dosyasında tanımlanması gerekenler:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="guclu-bir-secret-key"
ADMIN_PASSWORD="admin-sifresi"
```

---

## VPS Kurulumu

```bash
# Bağımlılıklar
npm install

# Veritabanı oluştur
npx prisma db push

# Build
npm run build

# PM2 ile başlat (port 3003)
pm2 start npm --name "linkbiopro-web" -- start -- -p 3003
pm2 save
```

**nginx** `/etc/nginx/sites-available/linkbiopro`:
```nginx
server {
    listen 7000;
    location / {
        proxy_pass http://localhost:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Çalışan Servisler (VPS)

| Servis | PM2 Adı | Port |
|---|---|---|
| Next.js app | `linkbiopro-web` | 3003 (nginx → 7000) |
| SecAudit API | `secaudit-api` | 8001 |
| SecAudit Web | `secaudit-web` | nginx → 4000 |
| CVOptimizer API | `cvoptimizer-api` | 8002 |
| CVOptimizer Web | `cvoptimizer-web` | nginx → 5000 |

---

## Roadmap

- [ ] Papara / iyzico ile otomatik ödeme entegrasyonu
- [ ] Özel domain desteği (Pro)
- [ ] Günlük/haftalık tıklama grafiği
- [ ] Sosyal medya ikon desteği
- [ ] QR kod oluşturma
