## ADDED Requirements

### Requirement: CMS içerik altyapısı paketleri
Sistem, DB-destekli çok-dilli içerik yönetimi için gerekli paket altyapısını
SUNMALIDIR (SHALL): per-field çeviri (`spatie/laravel-translatable`), medya
(`spatie/laravel-medialibrary`), editör sıralaması (`spatie/eloquent-sortable`) ve slug
üretimi (`spatie/laravel-sluggable`). Filament formlarında çeviri ve medya, native Filament
bileşenleriyle (locale `Tabs` + `FileUpload`) sağlanır — birinci-parti `filament/spatie-*`
plugin'leri bu Filament sürümüyle uyumlu olmadığından kullanılmaz.

#### Scenario: Çeviri fallback TR
- **WHEN** çevrilebilir bir alanın İngilizce değeri boş
- **THEN** `fallback_locale` (`tr`) değeri döner (boş string render edilmez)

#### Scenario: Medya tablosu hazır
- **WHEN** medialibrary migration çalıştırılır
- **THEN** `media` tablosu oluşur ve modeller medya ekleyebilir hâle gelir

### Requirement: Postgres arama extension'ları
Sistem, çok-dilli/typo-toleranslı aramanın zeminini kurmak için Postgres `pg_trgm` ve
`unaccent` extension'larını ETKİNLEŞTİRMELİDİR (SHALL).

#### Scenario: Extension'lar kurulu
- **WHEN** temel migration'lar çalıştırılır
- **THEN** `pg_trgm` ve `unaccent` `pg_extension`'da mevcuttur

### Requirement: AAuth panel-scoped yetkilendirme modeli
Sistem, admin paneli için AAuth tabanlı bir yetkilendirme modeli SUNMALIDIR (SHALL):
`<resource>.<ability>` (viewAny/view/create/update/delete/reorder) izin adlandırma şeması,
resource yetki hook'larını `aauth()->can()`'a bağlayan bir mekanizma ve giriş yapan
kullanıcının aktif rolünü oturuma (`roleId`) yazan panel middleware'i. Başlangıçta tam
yetkili bir `super-admin` rolü bulunmalıdır.

#### Scenario: Rol oturuma yazılır
- **WHEN** bir kullanıcı admin paneline erişir
- **THEN** aktif admin-panel rolü `session('roleId')`'e yazılır ve `aauth()` bu rolü kullanır

#### Scenario: İzin gating
- **WHEN** bir resource'un yetki hook'u (`canViewAny` vb.) çağrılır
- **THEN** karar `aauth()->can('<resource>.<ability>')` üzerinden verilir

#### Scenario: Super-admin tam yetki
- **WHEN** `super-admin` rolündeki kullanıcı herhangi bir izin sorar
- **THEN** izin verilir (`*`)
