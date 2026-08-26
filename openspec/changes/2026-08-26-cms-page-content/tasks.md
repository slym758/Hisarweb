## 1. Şema + modeller

- [x] 1.1 `create_pages_table` (slug uniq, title/seo_title/seo_description json, og_image_path/url, is_active) — additive.
- [x] 1.2 `create_page_contents_table` (page_slug index, section, key, type default text, value json, sort_order, unique(page_slug,section,key)) — additive.
- [x] 1.3 `Page` modeli (translatable title/seo_title/seo_description, SerializesLocale, contents() hasMany, flush cache).
- [x] 1.4 `PageContent` modeli (translatable value, SerializesLocale, sort_order cast, flush cache).

## 2. Servis + paylaşım

- [x] 2.1 `PageContentService` — `all(locale)` cached `{slug:{section:{key:value}}}`, `meta(slug,locale)` çözülmüş SEO, locale başına flush.
- [x] 2.2 `HandleInertiaRequests` tek yeni lazy prop `pageContent` (aktif dile çözülmüş). Diğer prop'lar değişmez.
- [x] 2.3 `resources/js/lib/page-content.ts` — `useContent(slug)` → `pc(section,key,fallback)` (fallback-safe).

## 3. Seeder + örnek geçiş

- [x] 3.1 Idempotent `PageSeeder` — ~18 ana sayfa `pages` satırı (boş SEO) + 3 örnek sayfanın üst-bölüm metinleri `page_contents`'e (yalnızca yoksa).
- [x] 3.2 3 örnek sayfa (kurumsal, vizyon-misyon, kalite-calismalari) üst-bölüm `c.key` → `pc('section','key', c.key)`. Kalan markup birebir.

## 4. Filament

- [x] 4.1 `PageResource` (grup 'İçerik', 'Sayfalar') — liste + SEO (LocaleTabs) + og görsel + `page_contents` ilişki Repeater'ı (section/key/type/value LocaleTabs, sort_order ile sıralanır).

## 5. Doğrulama

- [x] 5.1 `migrate:status` yeni migration'lar çalıştı; `Page::count()`>0, `PageContent::count()`>0.
- [x] 5.2 `pint` temiz; `npm run build` TS hatasız.
- [x] 5.3 `/kurumsal`, `/en/kurumsal`, `/vizyon-misyon` = 200; `pageContent` prop 3 örnek sayfayı içerir.
- [x] 5.4 Edit→reflect kanıtı: tinker ile bir blok güncelle → curl'de yeni metin görünür → geri al. 3 sayfa birebir.
