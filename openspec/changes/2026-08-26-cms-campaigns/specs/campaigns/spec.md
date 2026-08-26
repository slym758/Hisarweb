## ADDED Requirements

### Requirement: Editör-yönetilen kampanya landing sayfaları
Sistem, editörün admin panelinden oluşturduğu **zaman-sınırlı** kampanya/landing sayfalarını,
her biri kendi URL'ine (`/kampanya/{slug}`) sahip olacak şekilde SUNMALIDIR (SHALL). Kampanya
içeriği (başlık, alt başlık, gövde paragrafları, CTA etiketi/bağlantısı, SEO başlığı/açıklaması)
çok-dillidir ({tr,en,…}) ve aktif dile (fallback zinciriyle) çözülür; hero görseli yüklenen
`hero_image_path` (yoksa `hero_image_url` fallback) üzerinden çözülür.

#### Scenario: Aktif kampanya tüm dillerde sunulur
- **WHEN** ziyaretçi aktif bir kampanyanın `/kampanya/{slug}` (veya `/en/…`, `/de/…`, `/ar/…`) adresini açar
- **THEN** landing sayfası ilgili dile çözülmüş içerikle 200 döner

#### Scenario: Bilinmeyen veya süresi geçmiş slug 404 döner
- **WHEN** ziyaretçi var olmayan, pasif (`is_active=false`) veya yayın penceresi dışındaki (starts_at gelecekte / ends_at geçmişte) bir slug'ı açar
- **THEN** sistem gerçek bir 404 döner (içerik sızmaz)

#### Scenario: Yayın penceresi ve aktiflik
- **WHEN** editör bir kampanyaya `starts_at`/`ends_at` tarihleri veya `is_active` değeri atar
- **THEN** kampanya yalnızca aktif VE pencere içindeyken (`active()` scope) herkese açık olur

#### Scenario: CTA bağlantısı localize edilir
- **WHEN** kampanyanın CTA bağlantısı iç bir yol (örn. `/randevu-al`) ve aktif dil İngilizce
- **THEN** CTA butonu `lp()` ile localize edilmiş yola (`/en/randevu-al`) yönlendirir; dış URL'ler düz bağlantı kalır
