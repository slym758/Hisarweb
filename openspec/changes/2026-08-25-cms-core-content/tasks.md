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

Yaklaşım (plandan pragmatik sapma): 47 controller yerine **global hafif katalog** (liste/
index/arama/related) + detay sayfaları için ayrı controller. In-memory fallback ile kademeli,
kırılmasız.

- [x] 4.1 `App\Support\CatalogService` — locale-çözümlü hafif katalog (13 entity liste şekli),
  locale başına önbellekli, içerik değişince flush (ContentModel::booted). `loc()` fallback
  zincirli (de→en→tr).
- [x] 4.2 `HandleInertiaRequests` `catalog` prop'unu paylaşır (aktif locale).
- [x] 4.3 `site-data.ts` adapter: 13 `useX()` hook → `catalog ?? in-memory`; `iconFor()` (ad→
  lucide). Dış API sabit, 47 sayfa dokunulmadı.
- [x] 4.4 Doğrulama: CatalogService sayıları + tr/en/de-fallback; CANLI kanıt (DB'de ad değişince
  ana sayfada göründü, geri alınca kayboldu); build temiz.
- [x] 4.5 `SiteContentController` + `SiteSerializer` — 10 detay rotası (doktor/bölüm/hastalık/tedavi/
  tedavi-yöntemi/teknoloji/hastane/etkinlik/paket/basın) DB'den tam kayıt (detail/cv/rooms/gallery,
  locale-çözümlü) + `firstOrFail` gerçek 404. `getXBySlug/getDoctorById` slug/id-guard'lı `record`
  prop okur (in-memory fallback korunur). rehber-detay blog body katalogdan. Doğrulandı: detay 200 +
  CANLI DB-driven kanıt (doktor unvanı DB'de değişince /doktor/d1'de göründü), bilinmeyen slug 404
  (tr/en/ar).
- [ ] 4.6 (kalan, düşük öncelik) `errors/404` markalı Inertia sayfası (durum kodu zaten 404) +
  `searchIndex` global paylaşımı (HeaderShared şimdilik in-memory; Faz 8 aramada DB'ye taşınacak).

## 5. Filament içerik resource'ları (checkpoint 5)

Çeviri düzenleme deseni (spatie translatable plugin'i yok): `LocaleTabs` (aktif dil başına
Tab, alanlar `attr.$locale` dot-path) + `TranslatesRecord` trait (Edit fill → getTranslations;
kaydetme tam {tr,en,…} dizisini yazar → dil kaybı yok). Native `Tabs/Repeater/Select/Textarea`.

- [x] 5.1 Altyapı: `App\Filament\Support\LocaleTabs`, `App\Filament\Concerns\TranslatesRecord`.
- [x] 5.2 DepartmentResource (tam desen kanıtı: metin/textarea/paragraf-dizisi/nesne-dizisi
  translatable + slug/durum/öne-çıkar + reorderable). Panele kayıtlı ("İçerik" grubu), API
  doğrulandı. **Tarayıcı testi bekliyor** (Livewire — headless doğrulanamıyor).
- [ ] 5.3 Desen tarayıcıda onaylanınca kalan 14 resource: Doctor(+ilişki+cv), Hospital(+rooms),
  Disease, Treatment, Technology, BlogPost, Video, EventItem, HealthPackage, PressItem,
  FaqCategory, SymptomMap, QualityCertificate.
- [ ] 5.4 Görsel yükleme (medya) Faz 3'te; şimdilik `*_url` alanları.

## 6. Doğrulama + dokümantasyon

- [ ] 6.1 Her checkpoint: `pint` + `npm run build` temiz; tarayıcıda birebir + çok dil + RTL kontrolü.
- [ ] 6.2 `content-data` + `localization` spec'leri güncellenir; CLAUDE.md'ye çok-dil + DB içerik notu.
