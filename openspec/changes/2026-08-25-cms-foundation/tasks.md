## 1. CMS paketleri

- [x] 1.1 `composer require spatie/laravel-translatable spatie/laravel-medialibrary spatie/eloquent-sortable spatie/laravel-sluggable` (container içinde). Kuruldu: translatable ^6.14, medialibrary ^11.23, eloquent-sortable ^5.0, sluggable ^4.0.
- [x] 1.2 ~~filament/spatie-* plugin'leri~~ — Filament 5.7 ile uyumsuz (yalnız v3.x). KURULMADI; native `Tabs`/`FileUpload` + model-seviyesi medialibrary kullanılacak (proposal NOT). Native bileşenlerin vendor'da mevcudiyeti doğrulandı: `Filament\Schemas\Components\Tabs`, `Filament\Forms\Components\{Repeater,Builder,FileUpload}`.

## 2. Config + çeviri

- [x] 2.1 spatie/laravel-translatable v6'da config dosyası YOK. Fallback `AppServiceProvider::boot()`'ta `app(Translatable::class)->fallback(fallbackLocale: 'tr')` ile kuruldu (committed, ekip-güvenli).
- [x] 2.2 medialibrary config + migration publish + `migrate` → `media` tablosu oluştu (doğrulandı).

## 3. Postgres arama zemini

- [x] 3.1 `enable_pg_trgm_and_unaccent` migration çalıştı; `pg_extension`'da `pg_trgm` + `unaccent` doğrulandı.

## 4. Yetkilendirme + Erişim Yönetimi UI'ı — filament-astart (plandan sapma, kullanıcı onaylı)

Kullanıcı geri bildirimi: (a) AAuth'un organizasyon-rol modeli kullanılsın; (b) panelde
kullanıcı/organizasyon/rol yönetim sayfaları beklendi. AAuth **başsız** (hiç Filament UI
içermiyor) olduğundan, satıcının Filament admin UI paketi **`aurorawebsoftware/filament-astart`**
kuruldu (User/Role/OrganizationScope/Node/Tree resource'ları + RoleSwitch + ABAC + audit,
filogin ile entegre). Bu, benim özel `AuthorizesWithAauth`/`SetAauthPanelRole`/`super_admin`
scaffolding'imin yerini aldı.

- [x] 4.1 Özel scaffolding kaldırıldı: `AuthorizesWithAauth` trait + `SetAauthPanelRole`
  middleware silindi; `super_admin` bypass geri alındı (aauth-advanced enabled=false);
  `is_super_admin` migration'ı kaldırıldı.
- [x] 4.2 filament-astart 6.0.1 (Filament 5 hattı) kuruldu (SSH VCS: filament-astart + arflow +
  acalendar repo'ları). **aauth 22→21.2.0 downgrade** (filament-astart ^21 istiyor; filogin
  aauth'a bağımlı değil, çakışma yok). Ek zorunlu paketler: arflow, acalendar, prism, panel/dil/
  telefon switch (aktif kullanılmıyor, bağımlılık olarak gelir).
- [x] 4.3 `AdminPanelProvider`: `->plugins([FiLoginPlugin::make(), FilamentAstartPlugin::make()])`.
- [x] 4.4 `php artisan filament-astart:install` çalıştı (migration'lar + config/lang publish +
  `SampleFilamentDataSeeder`). Seeder user1 çakışması için idempotent yapıldı (`firstOrCreate`).
  Sonuç: "System Admin" organizasyon rolü (24 izin: user_*/role_*/organization_*) user1'e atandı.
- [x] 4.5 Doğrulandı: `admin/users`, `admin/roles`, `admin/organization-{nodes,scopes,tree}`
  route'ları kayıtlı; AAuth `can(user_view_any/role_view_any/organization_node_view_any)` = YES.

## 5. Doğrulama + dokümantasyon

- [x] 5.1 `optimize:clear` sonrası `/`→200, `/admin`→302 (login), `/admin/login`→200; log temiz.
- [ ] 5.2 `./vendor/bin/pint` + `npm run build` temiz.
- [ ] 5.3 Tarayıcıda user1 ile `/admin` yenilenip Kullanıcılar/Roller/Organizasyon sayfalarının
  göründüğü kullanıcıyla teyit edilir (gerekirse rol seçimi).
- [ ] 5.4 Bu change tamamlanınca `openspec/specs/admin-panel/` oluşturulur ve CLAUDE.md'ye
  admin/DB + filament-astart notu eklenir.
