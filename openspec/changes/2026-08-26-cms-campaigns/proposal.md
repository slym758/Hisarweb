## Why

Faz 6 (kampanya/landing sayfaları). Site, medikal turizm ve reklam trafiği için (Arapça/Rusça/
Almanca kampanyalar dahil) editörün panelden oluşturabileceği, **zaman-sınırlı**, kendi URL'ine
sahip (`/kampanya/{slug}`) bağımsız landing sayfalarına ihtiyaç duyuyor. Bugün böyle bir yüzey yok;
her kampanya için elle sayfa/route eklemek gerekiyordu. Bu değişiklik kampanyaları veri modeline
taşır: editör başlık/alt başlık/gövde/CTA/SEO alanlarını iki dilli girer, yayın penceresini
(başlangıç/bitiş) ve aktifliği yönetir; site ilgili landing'i tüm aktif dillerde (TR kök + /en,
/de, /ar prefiksleri) otomatik sunar.

## What Changes

- **Additive migration `campaigns`:** `slug` (unique), translatable `title`/`subtitle`/`body`
  (paragraf dizisi)/`cta_label`/`seo_title`/`seo_description`, `hero_image_path` + `hero_image_url`
  (proje medya deseni: yüklenen path kazanır, yoksa url fallback), `cta_link`, `starts_at`/`ends_at`
  (yayın penceresi), `is_active`, `sort_order`. DB asla silinmez/yenilenmez.
- **Model `App\Models\Campaign`:** spatie HasTranslations + eloquent-sortable (`sort_order`) +
  `loc()` (SerializesLocale). `active()` scope = `is_active` AND (`starts_at` null || <=now) AND
  (`ends_at` null || >=now).
- **Controller `App\Http\Controllers\Site\CampaignController@show(slug)`:** aktif kampanyayı slug ile
  çözer (bilinmeyen/süresi geçmiş/pasif → firstOrFail → gerçek 404); locale'e çözülmüş `record`
  prop'u ile `site/kampanya-detay` render eder (hero = `Media::url(path, url)`).
- **Rota:** `routes/web.php` `$sitePages` closure içinde `GET /kampanya/{slug}` — böylece /en, /de,
  /ar prefikslerini otomatik alır.
- **Idempotent seeder `CampaignSeeder`:** tek örnek kampanya (`kis-check-up`, iki dilli başlık
  "Kış Check-Up Kampanyası"/"Winter Check-Up", alt başlık, 2 paragraf gövde, CTA "Randevu Al"/
  "Book Now" → `/randevu-al`, placeholder Unsplash hero, aktif). `firstOrCreate` (slug) →
  yeniden çalıştırma admin düzenlemelerini bozmaz. `DatabaseSeeder`'a eklendi.
- **Frontend `resources/js/pages/site/kampanya-detay.tsx`:** `siteLayout` üzerinde temiz landing —
  hero (başlık/alt başlık/görsel + büyük CTA), gövde paragrafları, belirgin CTA/iletişim bölümü.
  Marka token'ları (lacivert primary, turuncu CTA, cyan accent), `<Head>` seo_title/seo_description,
  iç CTA linki `lp()` ile localize; kayıt yoksa iki dilli not-found.
- **Filament `CampaignResource`** (grup 'İçerik', 'Kampanyalar') — Genel bölümü (slug, hero FileUpload
  disk public dizin 'campaigns', cta_link, starts_at/ends_at, is_active) + LocaleTabs (title/subtitle/
  body[Textarea repeater]/cta_label/seo_title/seo_description) + sıralanabilir tablo + Edit'te
  TranslatesRecord. Departments desenini birebir izler.

**Non-goals:** popup/modal kampanya widget'ları, kampanya analitiği/dönüşüm takibi, A/B test,
kampanyaların nav/menüye otomatik eklenmesi (landing'ler doğrudan reklam linkiyle erişilir).

## Capabilities

### New Capabilities
- `campaigns`: editör-yönetilen, zaman-sınırlı, kendi URL'ine (`/kampanya/{slug}`) sahip çok-dilli
  landing sayfaları — yayın penceresi + aktiflik ile kapsanır, tüm aktif dillerde sunulur,
  bilinmeyen/süresi geçmiş slug gerçek 404 döner.
