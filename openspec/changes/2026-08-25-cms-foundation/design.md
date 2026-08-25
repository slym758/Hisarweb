## Bağlam

Bu faz yalnızca zemin kurar; içerik modelleri Faz 1'de gelir. Tasarım kararları
(paket seçimi, çeviri stratejisi, AAuth entegrasyonu) ana mimari planında gerekçelendirildi:
`/home/suleymanardic/.claude/plans/snappy-kindling-scott.md`.

## Paketler ve sürümler

| Paket | Rol | Not |
|---|---|---|
| `spatie/laravel-translatable` | per-field `{tr,en}` JSON | Laravel 12 uyumlu (v6). `HasTranslations` trait. |
| `spatie/laravel-medialibrary` | medya | v11 (L12). `media` tablosu + conversions. |
| `spatie/eloquent-sortable` | sıralama | `SortableTrait` + `order_column`. |
| `spatie/laravel-sluggable` | slug | `HasSlug`. Slug locale-agnostik (tek slug). |

**Filament UI plugin'leri KURULMADI.** `filament/spatie-laravel-media-library-plugin` ve
`filament/spatie-laravel-translatable-plugin` yalnız v3.x'te (filament/support v3 gerektirir);
bu ortamdaki Filament 5.7.6 (resmi `filamentphp/panels`) ile uyumsuz ve çekirdeğe de
taşınmamışlar. Filament formlarında karşılıkları **native bileşenlerle** kurulur:
- **Çeviri (TR/EN):** `Filament\Schemas\Components\Tabs` — locale başına bir `Tab`, alanlar
  `field.tr` / `field.en` statePath'ine bağlı (translatable JSON'a doğrudan yazar).
- **Medya:** native `Filament\Forms\Components\FileUpload` + model seviyesinde
  `spatie/laravel-medialibrary` (form kaydında `addMediaFromDisk`/collection ilişkisi).
Kesin Filament 5 API imzaları (Tabs/FileUpload/Repeater/Builder) Faz 1'de kurulu vendor'a
karşı doğrulanır — bu ortamın Filament sürümü eğitim bilgisinden yeni olabilir.

## Çeviri stratejisi (config)

`config/translatable.php`:
- `fallback_locale => 'tr'`, `use_fallback_locale => true` → EN alan boşsa TR döner
  (bugünkü `HandleInertiaRequests` + `resolveX()` davranışının aynısı).

Modellerde uygulanışı (Faz 1'de): `public array $translatable = [...]` + dizi alanlar için
`$casts array`. Ortak `SerializesLocale` concern (`loc($attr)`) Faz 1'de eklenecek; bu fazda
yalnız config hazırlanır. **Rollout riski:** spatie'nin translatable-array cast davranışı
Faz 1'de Doctor spike'ıyla doğrulanır (plan A1).

## Postgres extension'ları

Yeni migration (`enable_pg_trgm_and_unaccent`):
```php
DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
DB::statement('CREATE EXTENSION IF NOT EXISTS unaccent');
```
down()'da drop edilmez (başka şeyler kullanıyor olabilir; idempotent create yeterli).
Yalnız pgsql'de anlamlı; env pgsql (`DB_CONNECTION=pgsql` doğrulandı).

## AAuth panel yetkilendirme

- **İzin şeması:** `config/aauth.php` `permissions.organization` (veya panel grubu) altında
  `<resource>.<ability>` düz string listesi. Ability seti: `viewAny, view, create, update,
  delete, reorder`. Faz 0'da yalnız şema + `super-admin` için `*` seed'i; resource-bazlı
  izinler Faz 1'de resource'larla birlikte eklenir.
- **Gating trait:** `AuthorizesWithAauth` — resource'ta `protected static string $permissionKey`
  + statik hook'lar (`canViewAny` → `aauth()->can(static::$permissionKey.'.viewAny')` …).
  Faz 1 resource'ları bu trait'i kullanır.
- **Panel rolü middleware'i:** `SetAauthPanelRole` — `auth()->user()` varsa
  `aauth_for_panel('admin')` ile kullanıcının admin-panel rolünü çözer, `session(['roleId'=>...])`.
  AdminPanelProvider `->middleware([...])` sonuna eklenir (AAuth `Session::get('roleId')` bekler).
- **Başlangıç rolü seed'i:** `super-admin` (panel_id='admin', `*` izinleri). İlk admin
  kullanıcısına atama, kullanıcı `make:filament-user` sonrası yapılır (parola girmem yasak;
  kullanıcı kendi oluşturur). Rol atama komutu/seed'i idempotent.

## Riskler / açık noktalar

- filament spatie plugin'lerinin 5.7.6 ile birebir çözülmesi — kurulumda doğrulanır.
- medialibrary'nin default disk'i (`public`) → `php artisan storage:link` gerekebilir (Faz 3
  medya kullanımında; bu fazda migration yeterli).
- `super-admin` seed'inin AAuth v22 API'siyle (RolePermissionService / Role modeli) doğru
  yazılması — kurulumda `vendor/aurorawebsoftware/aauth` API'si kontrol edilir.
