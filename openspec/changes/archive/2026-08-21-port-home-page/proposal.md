## Why

Foundation (tasarım sistemi + layout + navigasyon + TR/EN i18n) tamamlandı ve
arşivlendi; ana sayfa şu an yalnızca geçici bir iskele. Sıradaki iş: sitenin
vitrini olan ana sayfayı kaynak `Hisar Hastanesi/src/routes/index.tsx` (1291 satır)
ile GÖRSEL OLARAK BİREBİR, tam işlevsel ve baştan iki dilli (TR + EN) tamamlamak.
Ana sayfa aynı zamanda ilk gerçek içerik sayfası olduğundan, tükettiği dummy içerik
veri modelini de kurar — sonraki sayfalar (bölümler, doktorlar, blog) bunu yeniden
kullanır.

## What Changes

- **Ana sayfa bölümleri (birebir):** kaynak home'un tüm bölümleri taşınır — Hero
  (slider/banner), AnnouncementStrip, TrustBand (CountUp sayaçları), QuickShortcuts,
  SymptomFinder (semptom→bölüm arama), Özel Merkezler (robotik kalp / prostat / göz /
  baş-boyun), Departments grid, OnkolojiSpotlight, Hospitals, BlogTeaser.
- **Section bileşenleri portlanır** (henüz yok): `AppShowcase`, `AppointmentCTA`,
  `QualityCertificates`, `PreFooter` ve home'un kullandığı diğer bölüm bileşenleri.
  Framework uyarlaması foundation'daki kurallarla (Inertia `<Link>` + `lp()`,
  `useCurrentPath`, i18n; TanStack/Lovable özgü kod taşınmaz).
- **Baştan tam TR + EN:** ana sayfanın HER metni (başlıklar, pazarlama metinleri,
  kart etiketleri, CTA'lar, bölüm başlıkları) iki dilde. UI metni `t()` (lang
  dosyaları) veya veri düzeyinde `{tr, en}` bilingual alanla sağlanır.
- **Dummy içerik verisi (`content-data`):** home'un tükettiği veri (`departments`
  icon'lu, `hospitals`, `blogPosts`, `SYMPTOM_TO_DEPT`, `normalizeTr`) tipli,
  tek-kaynak, slug/id ilişkili ve ileride DB + admin'e MEKANİK geçecek biçimde;
  çevrilebilir (TR+EN) alanlarla. Mevcut boş `@/lib/site-data` stub'ı bununla değişir.
- **Görseller:** kaynak Unsplash/CDN URL'leri GEÇİCİ kullanılır (dolu görünsün);
  prodüksiyonda gerçek/optimize, uygulamadan servis edilen asset'lerle değişecek
  (TODO). Çözülemeyen Lovable-CDN relative asset'ler için placeholder.
- **Route:** `/` (ve `/en`) artık gerçek ana sayfayı render eder; geçici iskele
  içeriği kaldırılır, persistent `SiteLayout` kabuğu korunur.

**Non-goals (bu change DIŞINDA):** içerik detay sayfaları (bölüm/doktor/hastalık/
blog detayları) — home yalnız onlara link verir; formların gerçek backend'i
(PreFooter iletişim formu KVKK onaylı + doğrulamalı ama PROTOTİP/mock kalır,
"gönderim aktif değildir" açıkça belirtilir); gerçek görsel asset'leri (ayrı asset
change); `site-data`'nın tamamı (yalnız home'un ihtiyaç duyduğu dilimler).

## Capabilities

### New Capabilities
- `home-page`: ana sayfanın tüm bölümleri — kaynakla görsel birebir, responsive,
  iki dilli (TR+EN), erişilebilir ve per-locale SEO'lu.
- `content-data`: home'un (ve sonraki sayfaların) tükettiği tipli dummy içerik
  verisi — tek-kaynak, slug/id ilişkili, DB'ye hazır, çevrilebilir (TR+EN) alanlı.

### Modified Capabilities
<!-- Yok — localization mekanizması değişmiyor; home yalnızca yeni çeviriler ekliyor. -->

## Impact

- **Kod:** `resources/js/pages/site/home.tsx` (iskele → gerçek içerik), yeni
  `resources/js/components/site/*` bölüm bileşenleri, `resources/js/lib/site-data.ts`
  (dummy içerik modeli — boş stub'ın yerine), `lang/tr|en/site.php` (home çevirileri)
  ve/veya bilingual veri alanları, görsel URL sabitleri.
- **Veri:** `departments` (icon'lu), `hospitals`, `blogPosts`, `SYMPTOM_TO_DEPT`,
  `normalizeTr` dummy olarak kurulur (home'un okuduğu şekiller).
- **Bağımlılıklar:** home bölüm bileşenlerinin kullandığı ek shadcn/embla vb.
  primitive'ler (gerekirse `warden env exec php-fpm npm i ...`).
- **Form:** `PreFooter` iletişim formu — KVKK onayı + istemci doğrulaması, ama backend
  bağlanmaz (prototip; sahte başarı yok, "gönderim aktif değil" belirtilir).
- **İleriye etki:** `content-data` şeması sonraki içerik sayfalarının ve DB+admin
  geçişinin temeli olur.
