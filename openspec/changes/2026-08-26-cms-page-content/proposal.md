## Why

Faz 5 — bugün her sayfanın içinde `const COPY = { tr, en }` olarak gömülü olan başlık,
alt-başlık, paragraf ve buton metinleri ile per-sayfa SEO editöre kapalı. Editör bir bölümün
başlığını ya da SEO açıklamasını değiştirmek istediğinde koda dokunmak gerekiyor. Amaç: bu
metinleri ve SEO'yu admin panelinden düzenlenebilir yapmak — **47 mevcut sayfayı bozmadan** ve
**görünümü birebir koruyarak** (DB boşken sayfalar mevcut inline `COPY`'ye düşer).

## What Changes

- **Şema (additive):** `pages` (slug rota anahtarı, çok-dilli `title`/`seo_title`/
  `seo_description`, og görsel, is_active) + `page_contents` (page_slug, section, key, type,
  çok-dilli `value`, sort_order; unique(page_slug,section,key)). Var olan veriyi asla silmez.
- **Modeller + servis:** `Page` / `PageContent` (spatie translatable, kaydetme/silmede cache
  flush) + `PageContentService` (önbellekli; `all(locale)` → `{slug:{section:{key:value}}}`,
  `meta(slug,locale)` → çözülmüş SEO). Locale başına önbellek, değişimde temizlenir.
- **Inertia paylaşımı:** `HandleInertiaRequests` tek yeni **lazy** prop `pageContent`
  (aktif dile çözülmüş tüm blok haritası). Diğer prop'lara dokunulmaz.
- **Frontend (fallback-safe):** `resources/js/lib/page-content.ts` → `useContent(slug)` →
  `pc(section, key, fallback)`. DB'de blok yoksa fallback (inline COPY) döner → sayfa birebir.
- **Örnek geçiş:** yalnız 3 sayfa (kurumsal, vizyon-misyon, kalite-calismalari) üst-bölüm
  metinlerini `pc('section','key', c.key)` ile DB'den okur; kalan 44 sayfa inline COPY'de kalır.
- **Seeder:** idempotent `PageSeeder` — ~18 ana sayfa için `pages` satırı (boş SEO) + 3 örnek
  sayfanın üst-bölüm metinlerini `page_contents`'e iki dilli aktarır (yalnızca yoksa).
- **Filament:** `PageResource` (grup 'İçerik', 'Sayfalar') — SEO (LocaleTabs) + og görsel +
  `page_contents` ilişki Repeater'ı (section/key/type/value LocaleTabs, sort ile sıralanır).

**Non-goals:** 44 sayfanın tümünü geçirmek (mekanik follow-up), popup/kampanya (Faz 6), form
backend (Faz 7). Görsel yükleme deseni (`*_path` + `Media::url` + FileUpload) mevcut.

## Capabilities

### New Capabilities
- `page-content`: admin-yönetilen, çok-dilli sayfa metinleri + per-sayfa SEO; Inertia ile
  paylaşılır, aktif dile çözülür; DB boşken sayfalar inline COPY'ye düşerek birebir kalır.
