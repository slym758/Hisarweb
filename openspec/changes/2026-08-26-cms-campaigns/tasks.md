# Tasks — Faz 6: Kampanya / landing sayfaları (yeni capability: campaigns)

## Backend
- [x] Additive migration `campaigns` (slug unique, translatable title/subtitle/body/cta_label/
      seo_title/seo_description, hero_image_path + hero_image_url, cta_link, starts_at/ends_at,
      is_active, sort_order).
- [x] `App\Models\Campaign` (HasTranslations $translatable; SortableTrait sort_order; SerializesLocale
      loc(); getRouteKeyName=slug; casts is_active/starts_at/ends_at; `active()` scope).
- [x] `App\Http\Controllers\Site\CampaignController@show` — active()->firstOrFail (unknown/expired →
      404); locale-resolved `record` (title/subtitle/body/cta_label/cta_link/hero/seo_*).
- [x] Rota `GET /kampanya/{slug}` — `$sitePages` closure içinde (localized) + controller import.
- [x] Idempotent `CampaignSeeder` — tek örnek (`kis-check-up`), iki dilli, aktif. `firstOrCreate`
      (slug). `DatabaseSeeder`'a eklendi.
- [x] `migrate` + `db:seed --class=CampaignSeeder` çalıştırıldı (Campaign::count()>=1).

## Frontend
- [x] `resources/js/pages/site/kampanya-detay.tsx` — siteLayout, `<Head>` seo_title/seo_description,
      hero + gövde + CTA/iletişim bölümü, marka token'ları, `lp()` ile iç CTA, kayıt yoksa iki dilli
      not-found. `record`+`slug` usePage().props'tan.

## Filament
- [x] `CampaignResource` (grup 'İçerik', 'Kampanyalar') — Genel section (slug, hero FileUpload
      disk public dir 'campaigns', cta_link, starts_at/ends_at, is_active) + LocaleTabs (title/
      subtitle/body Textarea repeater/cta_label/seo_title/seo_description) + reorderable(sort_order)
      tablo + Edit'te TranslatesRecord. Departments desenini izler.

## Doğrulama
- [x] `migrate:status` yeni migration çalıştı; `Campaign::count()` >= 1.
- [x] `pint` ilgili dosyalar.
- [x] `npm run build` (TS hatasız — kampanya-detay.tsx derlenir).
- [x] `route:list | grep kampanya` → localized GET rotaları + `campaigns` resource.
- [x] `curl /kampanya/kis-check-up` = 200; `/en/kampanya/kis-check-up` = 200; `/kampanya/yok-boyle` = 404.
