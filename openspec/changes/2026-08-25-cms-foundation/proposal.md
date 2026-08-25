## Why

Site bugün tamamen dummy/statik içerikle çalışıyor (`resources/js/lib/site-data.ts`,
sayfa-içi `COPY`, hardcode nav/CTA). Doktrin (config.yaml §3/§9) DB + admin geçişini
ayrı bir OpenSpec change'i olarak şart koşuyor. Editörün her şeyi yönetebildiği bir CMS'e
(içerik CRUD, ilişkiler, menü/slider/CTA/popup/form/ayar, sayfa-metinleri, çok-dilli arama)
geçişin **temel altyapısı** bu change'dir. Kullanıcıya görünür değişiklik YOKTUR; bu faz,
sonraki tüm fazların (çekirdek içerik DB'ye, medya, ilişkiler, arama) dayandığı paket +
yetkilendirme + Postgres zeminini kurar.

Bkz. tam mimari: `/home/suleymanardic/.claude/plans/snappy-kindling-scott.md` (Faz 0).

## What Changes

- **CMS paketleri kurulur** (container içinde, composer):
  - `spatie/laravel-translatable` — içerik alanları için per-field `{tr,en}` JSON çeviri.
  - `spatie/laravel-medialibrary` — görsel/medya (kapak/foto/galeri/poster).
  - `spatie/eloquent-sortable` — editör sıralaması (`order_column`).
  - `spatie/laravel-sluggable` — slug üretimi (site tamamen slug-anahtarlı).
  - **NOT:** Filament'in birinci-parti `filament/spatie-*` plugin'leri bu ortamdaki Filament
    5.7 ile kurulamıyor (yalnız v3.x tag'leri var, `filament/support` v3 istiyor; Filament 5
    çekirdeğine de taşınmamışlar). Bu nedenle KURULMAZ. Filament formlarında çeviri (TR/EN)
    ve medya, **native bileşenlerle** yapılır: locale için `Filament\Schemas\Components\Tabs`
    (locale başına Tab, alanlar `name.tr`/`name.en` statePath'ine bağlı), medya için native
    `Filament\Forms\Components\FileUpload` + model seviyesinde `spatie/laravel-medialibrary`
    (kaydetmede media collection'a bağlama). Kesin API Faz 1'de kurulu vendor'a karşı doğrulanır.
- **Çeviri config'i:** `config/translatable.php` publish → `fallback_locale => 'tr'`,
  `use_fallback_locale => true` (bugünkü EN→TR fallback davranışını birebir korur).
- **Medya altyapısı:** medialibrary migration publish + migrate (`media` tablosu).
- **Postgres arama zemini:** `pg_trgm` + `unaccent` extension'larını etkinleştiren migration
  (Faz 8 aramasının bunlara ihtiyacı olacak; şimdi kurulur, kullanımı sonra).
- **AAuth panel yetkilendirme zemini:**
  - İzin adlandırma şeması `<resource>.<ability>` (viewAny/view/create/update/delete/reorder)
    `config/aauth.php`'de `admin` paneli için tanımlanır.
  - `App\Filament\Resources\Concerns\AuthorizesWithAauth` trait'i — resource statik
    yetki hook'larını `aauth()->can()`'a yönlendirir (boilerplate'siz gating).
  - `App\Http\Middleware\SetAauthPanelRole` — admin paneline giren kullanıcının aktif
    rolünü (`roleId`) oturuma yazar; AdminPanelProvider `->middleware([...])`'e eklenir.
  - Başlangıç `super-admin` rolü + izinleri seed'lenir (resource-bazlı roller Faz 1'de
    resource'lar oluşunca genişler).

**Non-goals:** İçerik modelleri/migrasyonları/seed (Faz 1); Filament içerik resource'ları
(Faz 1); medya alanlarının modellere bağlanması (Faz 3); gerçek arama endpoint'i (Faz 8);
rol-değiştirme UI'ının tam hâli (Faz 1'de resource gating ile birlikte).

**Plandan zorunlu sapma:** Onaylı plan `filament/spatie-*` plugin'lerini varsaymıştı; bu
ortamda Filament 5 ile uyumlu sürümleri olmadığından kurulmaz, yerine native Filament
bileşenleri kullanılır (yukarıdaki NOT). Veri katmanı omurgası (4 spatie Laravel paketi)
ve mimari intent aynen korunur.

## Capabilities

### New Capabilities
- `admin-panel`: DB-destekli CMS'in yönetim zemini — çeviri/medya/sıralama/slug paket
  altyapısı, Filament panel entegrasyonları ve AAuth panel-scoped izin/rol modeli (izin
  adlandırma şeması, `aauth()->can()` gating trait'i, panel `roleId` middleware'i,
  başlangıç `super-admin` rolü). Postgres `pg_trgm`/`unaccent` zemini.
