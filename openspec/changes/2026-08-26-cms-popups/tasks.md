# Tasks — Faz 6b: Pop-up / promo yönetimi (yeni capability: popups)

## Backend
- [x] Additive migration `popups` (type default app_promo, translatable title/body/cta_label,
      image_path + image_url, cta_link, target_routes + suppress_routes json, dismiss_scope +
      dismiss_days, is_active, starts_at/ends_at, priority).
- [x] `App\Models\Popup` (HasTranslations title/body/cta_label; SerializesLocale loc();
      target_routes/suppress_routes array cast; `active()` scope; saved/deleted → PopupService::flush).
- [x] `App\Support\PopupService::forPath($path, $locale)` — aktif pop-up'lar (priority desc),
      target/suppress glob eşleşmesi (`*` joker), locale başına cache, in-PHP path filtresi.
- [x] `HandleInertiaRequests::share` — tek lazy prop `popups`; istek path'inden locale önekini
      `LocaleService::prefixed()` ile soyan private `localeStrippedPath()`.
- [x] Idempotent `PopupSeeder` — tek `app_promo` (MobileAppPromo COPY'sinden birebir, iki dilli,
      image_url `/assets/hisar-emblem.png`, suppress_routes 3'lü, session dismiss, aktif).
      `firstOrCreate` (type). `DatabaseSeeder`'a eklendi.
- [x] `migrate` + `db:seed --class=PopupSeeder` çalıştırıldı (Popup::count()>=1).

## Frontend
- [x] `resources/js/components/site/MobileAppPromo.tsx` — paylaşılan `popups` içindeki ilk
      `app_promo`'yu kullanır (title/body/cta_label/image/cta_link + kapatma). Prop dizi ise sunucuya
      güvenilir (rotada pop-up yoksa render yok = gizleme); prop yoksa eski hardcoded COPY + gizleme
      AYNEN. Markup/sınıf/animasyon birebir.

## Filament
- [x] `PopupResource` (grup 'İçerik', 'Pop-up\'lar') — Genel section (type Select, image FileUpload
      disk public dir 'popups', image_url, cta_link, target_routes + suppress_routes TagsInput,
      dismiss_scope Select, dismiss_days, priority, is_active, starts_at/ends_at) + LocaleTabs
      (title/body/cta_label) + reorderable(priority) tablo + Edit'te TranslatesRecord.

## Doğrulama
- [x] `migrate:status` yeni migration çalıştı; `Popup::count()` >= 1.
- [x] `pint` ilgili dosyalar.
- [x] `npm run build` (TS hatasız — MobileAppPromo.tsx derlenir).
- [x] `curl /` = 200; `popups` prop `/`'de var (app_promo döner), `/randevu-al`'da boş (gizli).
- [x] Mobil app-promo görsel/davranış birebir aynı (metin/görsel, gizli rotalar, kapatma çalışır).
