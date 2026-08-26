# Hisar Hastanesi — Geliştirici Doktrini

Hisar Hastanesi grubunun halka açık kurumsal/tanıtım web sitesi. Lovable ile üretilmiş
UI (`Hisar Hastanesi/` — gitignored referans) **görsel olarak birebir** korunarak temiz
bir Inertia yapısına taşınıyor. Kapsamlı kurallar: `openspec/config.yaml`.

## ⛔ VERİTABANI GÜVENLİĞİ — MUTLAK KURAL (asla ihlal etme)
Veritabanı **ASLA silinmez / sıfırlanmaz / tazelenmez**. Kullanıcı **açıkça** talep
etmedikçe hiçbir veri-kaybı işlemi yapılmaz.
- **YASAK komutlar:** `migrate:fresh`, `migrate:refresh`, `migrate:reset`, `db:wipe`,
  `schema:dump --prune`, ve tabloları `DROP`/`TRUNCATE` eden her destructive işlem.
- Şema değişikliği **her zaman YENİ, additive migration** ile yapılır (kolon ekle/değiştir);
  var olan migration'ı düzenleyip fresh ile uygulamak YASAK. İleri gidiş: yeni migration + `migrate`.
- Seeder'lar idempotent olmalı (`updateOrCreate`), gerçek/editör verisini silmemeli.
  `SiteCatalogSeeder` yalnız **ilk kurulum** içindir ve içeriği temizler → **gerçek içerik
  girildikten sonra ASLA yeniden çalıştırılmaz**.
- Bir şey silinecekse önce dur, kullanıcıya sor, açık onay al.

## Stack
PHP 8.4 · Laravel 12 · Inertia 2 · React 19 + TypeScript · Vite 6 · Tailwind 4 (CSS-first
`@theme`) · shadcn/ui · PostgreSQL 15 · Warden (Docker).

Komutlar **container içinde** çalışır:
```bash
warden env exec php-fpm php artisan ...
warden env exec php-fpm composer ...
warden env exec php-fpm npm run dev      # Vite dev (HMR) → https://vite.hisarweb.test
warden env exec php-fpm npm run build
```
Uygulama: `https://app.hisarweb.test` (TR) · `https://app.hisarweb.test/en` (EN).

## Frontend yapısı
- Sayfalar: `resources/js/pages/**` → Laravel route `Inertia::render('site/...')`.
- Layout: `resources/js/layouts/site-layout.tsx` — persistent public kabuk (header + main +
  footer + rail + mobil nav + dil değiştirici). Sayfaya `Page.layout = siteLayout` ile bağlanır.
- Bileşenler: `resources/js/components/site/*` (site chrome) + `resources/js/components/ui/*`
  (shadcn primitive'leri). Auth/dashboard sayfaları kendi `AuthLayout`'unda (SiteLayout dışı).

**Yeni public sayfa eklemek:** `routes/web.php`'de `{locale?}` grubuna bir route ekle
(`Inertia::render('site/<ad>')`), `resources/js/pages/site/<ad>.tsx` oluştur, sonuna
`Sayfa.layout = siteLayout` ekle, `<Head>` ile per-locale meta ver.

## i18n (TR + EN, baştan)
- Rota: TR kökte, EN `/en` prefix (`{locale?}` grubu + `SetLocale` middleware).
- Aktif locale + çeviriler `HandleInertiaRequests::share` ile paylaşılır (`lang/tr|en/site.php`;
  EN eksikse TR'ye düşer).
- React: `@/lib/i18n` → `useTranslations()` `{ t }`, `useLocale()`, `useCurrentPath()`
  (locale-stripped), `useLocalizedPath()` (`lp('/x')` → EN'de `/en/x`).
- **Kural:** görünür UI metni ya `t('...')` (lang dosyalarına ekle) ya da veri düzeyinde
  `{tr, en}` bilingual alan olmalı; TR'yi hardcode edip EN'i bloke etme. Dahili linkler
  `<Link href={lp('/x')}>`; dış/`tel:`/`mailto:` düz `<a>`.

## Navigasyon — tek kaynak
`resources/js/lib/navigation.ts` (iki dilli). Header/drawer `useNav()` (locale'e göre çözülmüş
etiketler) kullanır. Nav değişikliği yalnız burada yapılır.

## Tasarım sistemi
`resources/css/app.css` `@theme` — marka token'ları kaynaktan birebir: primary lacivert
`oklch(0.28 0.16 268)`, CTA turuncu `--brand-orange`, accent cyan `--brand-cyan`, font **Inter**.
Yeni görsel dil uydurma; token'ları kullan. Görseller `public/assets/` + gövdede geçici
Unsplash URL'leri (`{/* TODO: real asset */}`); gerçek/optimize asset'ler follow-up.

## Sayfalar & routing
Kaynak sitemap'teki **tüm sayfalar aktif** (statik + dinamik detaylar), TR (kök) + EN
(`/en`). Route'lar `routes/web.php`'de iki grupta (bkz. dosya başı notu). Yeni sayfa:
`Route::inertia('/x','site/x')` (statik) veya `Route::get('/x/{slug}', fn()=>Inertia::render('site/x-detay',['slug'=>request()->route('slug')]))` (detay) — HER İKİ gruba
(kök + `/en`) ekle; sayfayı `resources/js/pages/site/` altında `.layout = siteLayout` ile yaz.
Detay sayfası slug'ı `usePage().props` ile okur, `getXBySlug(slug, useLocale())` ile çözer,
bulunamazsa iki dilli not-found gösterir.

## İçerik verisi (`@/lib/site-data`)
**Dummy ama DB'ye hazır** tam katalog: departments (+`DepartmentDetail`), hospitals
(+`HospitalDetail`), doctors (+`cv`/email/languages), diseases/treatments/technologies
(+ zengin `detail` alanları), blog (+`body`), events, packages, press, faq, videos.
İç kaynak `{tr,en}` bilingual + slug/id ilişkili. Bileşenlerde **locale-resolved hook'ları**
kullan (`useDepartments()`, `useHospitals()`, `useDoctors()`, `useBlogPosts()`, `useTreatments()`,
`useDiseases()`, `useTechnologies()` …) ve detay için `getXBySlug(slug, useLocale())` /
`getDoctorById(id, useLocale())` / `getHospitalDetail`/`getDepartmentDetail`. Dept-scoped:
`getDoctorsForDept`/`getTreatmentsForDept`/`getDiseasesForDept`/`getTechnologiesForDept`/
`getVideosForDept`/`getBlogPostsForDept`/`getHospitalsForDept`. Yeni alanları **opsiyonel** ekle
(mevcut kayıtlar bozulmasın). İleride Eloquent + admin geçişi MEKANİK olacak (ayrı change);
fuzzy string eşleştirme kullanma, slug/id ilişkisi kur.

## Bilingual desen
- **Sayfa/bileşen içi pazarlama/UI metni:** inline `const COPY = { tr:{…}, en:{…} } as const;
  const c = COPY[useLocale()];` → `c.key`. (Kısa/ortak metinler için `t('...')` + lang dosyası
  da olur.) Görünür TR-only literal bırakma.
- **İçerik verisi:** content-data hook'ları (yukarıda) — zaten locale'e göre çözülür.

## Ne zaman OpenSpec
Büyük/riskli/çok yeri etkileyen işler önce OpenSpec ile (`/opsx:propose` → `/opsx:apply`):
yeni sayfa tipi + veri modeli, i18n/SEO mimarisi, form backend'i, DB + admin geçişi. Ayrıntı
ve katı kurallar: `openspec/config.yaml`.
