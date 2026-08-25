## 1. Dinamik dil altyapısı (checkpoint 1)

- [x] 1.1 `languages` migration (code, name, native_name, is_active, is_default, is_rtl, fallback_code, sort_order) + `Language` modeli (saved/deleted → LocaleService::flush).
- [x] 1.2 `LanguageSeeder` — 12 dil (tr*, en, fr, ru, kk, ar-rtl, ro, ka, de, sq, mk, bg); idempotent; fallback zinciri any→en→tr.
- [x] 1.3 `App\Support\LocaleService` — önbellekli active locale seti (codes/default/prefixed/isRtl/dir/fallbackChain), tablo yoksa güvenli tr+en default.
- [x] 1.4 `SetLocale` + `routes/web.php` dinamik (kök=varsayılan + prefix'li grup/dil); `HandleInertiaRequests` locale/locales/dir/defaultLocale + fallback-birleşik çeviriler.
- [x] 1.5 Frontend `i18n.ts`: `useActiveLocale` (gerçek) / `useLocale` (içerik tr/en clamp) / `useLocales`/`useDir`/`useDefaultLocale`; `localizedPath`/`useCurrentPath` dinamik. `LangSwitcher` 12 dili yönlendirir. Layout `dir=rtl`.
- [x] 1.6 Doğrulandı: 12 locale 200; `/ar` dir=rtl; `/de` 12 dil paylaşıyor; build + pint temiz.

## 2. Çekirdek içerik modelleri + migration'lar (checkpoint 2 — TAMAM)

- [x] 2.1 Migration'lar (17 tablo): departments, hospitals, hospital_rooms, doctors, diseases, treatments, technologies, blog_posts, videos, events, health_packages, press_items, faq_categories, symptom_maps, quality_certificates — translatable JSON + slug/code + status/published_at + order_column + FK'ler.
- [x] 2.2 Polimorfik `seo_meta` + `redirects` migration'ları.
- [x] 2.3 Modeller: ortak `ContentModel` tabanı (HasTranslations + SortableTrait + `SerializesLocale` + `HasPublishing`) + 15 varlık + SeoMeta/Redirect; ilişkiler (belongsTo/hasMany). Detay/cv tek translatable JSON. (HasSlug şimdilik yok — slug seed/Filament'ten; sonra eklenebilir.)
- [x] 2.4 Spike doğrulandı: translatable string+dizi, fallback de→tr, sortable order_column, bool cast — hepsi çalışıyor.

## 3. Mekanik seed (checkpoint 3 — TAMAM)

- [x] 3.1 `scripts/export-catalog.ts` + `scripts/i18n-stub.ts` — esbuild bundle (alias `@`→resources/js, i18n stub inertia'yı hariç tutar) ile `database/seeders/data/site-catalog.json` üretir (getX('tr')+getX('en'), detail merge, icon→ad).
- [x] 3.2 `SiteCatalogSeeder` — 13 entity + hospital_rooms + symptom_maps + gallery; translatable {tr,en}; `*_url` (Unsplash) fallback; kanonik (temizle+ekle), re-runnable. Doğrulandı: sayılar eşleşti, tr/en+fallback, ilişkiler, detail/cv/gallery/dept_slugs korundu.

## 4. Frontend'i DB'ye bağla (checkpoint 4)

- [ ] 4.1 `app/Http/Controllers/Site/*` + `app/Http/Resources/Site/*` (nested detail yeniden kurulur, locale sunucuda çözülür).
- [ ] 4.2 `routes/web.php` Inertia::render closure'ları → controller'lar; `firstOrFail()` gerçek 404 + `errors/404` sayfası.
- [ ] 4.3 `site-data.ts` iç gövde → `usePage().props` (dış API sabit); `iconFor()`; `searchIndex` global paylaşım (HeaderShared).
- [ ] 4.4 Doğrulama: seed sonrası TR + `/en` birebir aynı; bilinmeyen slug 404.

## 5. İlk Filament içerik resource'ları (checkpoint 5)

- [ ] 5.1 DepartmentResource + DoctorResource (filament-astart yetki deseni; locale sekmeleri/`FileUpload` native), CRUD doğrula.
- [ ] 5.2 Kalan içerik resource'ları aynı desenle.

## 6. Doğrulama + dokümantasyon

- [ ] 6.1 Her checkpoint: `pint` + `npm run build` temiz; tarayıcıda birebir + çok dil + RTL kontrolü.
- [ ] 6.2 `content-data` + `localization` spec'leri güncellenir; CLAUDE.md'ye çok-dil + DB içerik notu.
