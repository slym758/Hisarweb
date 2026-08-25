## Why

Faz 0 (cms-foundation) altyapıyı kurdu. Şimdi sitenin içeriği dummy `resources/js/lib/site-data.ts`
+ sayfa-içi `COPY`'den **DB'ye** taşınır ve editör (Filament) yönetimine açılır — görünüm birebir
korunarak. Ayrıca site **dinamik çok dilli** olur (admin dil ekler). Bkz. mimari:
`~/.claude/plans/snappy-kindling-scott.md` + şema artifact'i.

## What Changes

- **Dinamik çok dil (checkpoint 1 — TAMAM):** admin-yönetilen `languages` tablosu; 12 dil seed;
  `LocaleService` (önbellekli); dinamik locale routing (`/`=varsayılan + `/en /de /ar …`);
  `SetLocale` + `HandleInertiaRequests` dinamik (locale/locales/dir/defaultLocale + fallback-zinciri
  çevirileri); frontend `useActiveLocale` (gerçek) / `useLocale` (içerik, tr/en clamp) / RTL.
- **Çekirdek içerik modelleri + migration'lar (checkpoint 2):** departments, hospitals(+rooms),
  doctors(+cv), diseases, treatments, technologies, blog_posts, videos, events, health_packages,
  press_items, faq_categories, symptom_maps, quality_certificates — translatable JSON (spatie),
  `status`/`published_at`, slug/sortable; + polimorfik `seo_meta` + `redirects`.
- **Mekanik seed (checkpoint 3):** `site-data.ts` kataloğu kayıpsız DB'ye (mevcut TR/EN dolu; diğer
  diller boş → fallback).
- **Frontend'i DB'ye bağla (checkpoint 4):** `site-data.ts`'in dış API'si sabit; içi Inertia
  props'tan (locale sunucuda çözülür) beslenir; Site controller'ları + gerçek 404.
- **İlk Filament içerik resource'ları (checkpoint 5):** filament-astart yetki deseniyle.

**Non-goals:** ilişkiler/oto-manuel (Faz 2), medya bağlama (Faz 3), menü/slider/ayar (Faz 4),
sayfa-metin editörü (Faz 5), kampanya/popup (Faz 6), formlar (Faz 7), arama (Faz 8).

## Capabilities

### Modified Capabilities
- `localization`: iki-dilden (TR+EN) **dinamik çok dile** (admin-yönetilen `languages`, N locale,
  RTL, fallback zinciri) genişler.
- `content-data`: dummy in-memory katalog → DB-destekli (Eloquent + translatable), aynı public
  hook API'si korunur; `quality_certificates` eklenir; SEO/yayın alanları.
