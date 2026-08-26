## Why

Faz 6b (pop-up / promo yönetimi). Mobil uygulama tanıtım pop-up'ı (`MobileAppPromo`) bugün
tamamen frontend'e gömülü: metin/görsel inline `COPY`, kapatma `sessionStorage`, gizlenen rotalar
(`/mobil-uygulama`, `/randevu-al`, `/butunlesik-onkoloji*`) hardcoded. Editör hiçbirini
değiştiremiyor; ayrıca ileride gerekecek genel modal/banner/lead widget'ları için bir yüzey yok.
Bu değişiklik pop-up'ları veri modeline taşır: editör başlık/metin/CTA'yı iki dilli girer, görseli
yükler, hangi rotalarda gösterileceğini/gizleneceğini (locale'siz path globları), kapatma davranışını,
yayın penceresini, önceliği ve aktifliği panelden yönetir. **Site görsel olarak birebir aynı kalır**:
DB mevcut `MobileAppPromo` içeriğiyle seed edilir; hiç kayıt yoksa frontend eski hardcoded davranışa
düşer.

## What Changes

- **Additive migration `popups`:** `type` (app_promo|modal|banner|lead, default app_promo),
  translatable `title`/`body`/`cta_label`, `image_path` + `image_url` (proje medya deseni: yüklenen
  path kazanır, yoksa url fallback), `cta_link`, `target_routes` (gösterilecek path globları;
  boş/null = tüm rotalar) + `suppress_routes` (gizlenecek globlar), `dismiss_scope`
  (session|days) + `dismiss_days`, `is_active`, `starts_at`/`ends_at` (yayın penceresi),
  `priority`. DB asla silinmez/yenilenmez.
- **Model `App\Models\Popup`:** spatie HasTranslations (`title`/`body`/`cta_label`) + `loc()`
  (SerializesLocale); `target_routes`/`suppress_routes` array cast; `active()` scope =
  `is_active` AND (`starts_at` null || <=now) AND (`ends_at` null || >=now); save/delete →
  PopupService cache flush.
- **`App\Support\PopupService::forPath($path, $locale)`:** locale'e çözülmüş aktif pop-up'ları
  (öncelik desc) döner — `target_routes` ile eşleşen (veya boş=hepsi) VE `suppress_routes` ile
  eşleşmeyen. Basit glob eşleşmesi (`*` joker). Aktif set locale başına cache'lenir; path filtresi
  ucuz in-PHP geçişle uygulanır. `$path` locale'siz güncel path.
- **`HandleInertiaRequests::share`:** tek yeni lazy prop `popups` — istek URI'sinden locale önekini
  (`/en`, `/de`…) `LocaleService::prefixed()` ile soyup `PopupService::forPath(...)` çağırır. Diğer
  prop'lara dokunulmaz.
- **Idempotent seeder `PopupSeeder`:** `MobileAppPromo` COPY'sinden birebir transkribe edilmiş tek
  `app_promo` pop-up'ı (iki dilli başlık/metin/CTA, `image_url='/assets/hisar-emblem.png'`,
  `cta_link='/mobil-uygulama'`, `suppress_routes=['/mobil-uygulama','/randevu-al','/butunlesik-onkoloji*']`,
  `dismiss_scope='session'`, aktif). `firstOrCreate` (type) → yeniden çalıştırma admin
  düzenlemelerini bozmaz. `DatabaseSeeder`'a eklendi.
- **Frontend `MobileAppPromo.tsx`:** paylaşılan `popups` içindeki ilk `app_promo`'yu kullanır
  (title/body/cta_label/image/cta_link + kapatma davranışı, sessionStorage korunur, `dismiss_scope`
  onurlandırılır). Prop bir dizi olarak paylaşılmışsa sunucuya güvenilir (bu rotada pop-up yoksa
  hiçbir şey render etmez = gizleme). Prop hiç yoksa eski hardcoded COPY + gizleme AYNEN korunur.
  Markup/sınıf/animasyon birebir aynı.
- **Filament `PopupResource`** (grup 'İçerik', 'Pop-up\'lar') — Genel bölümü (type Select, image
  FileUpload disk public dizin 'popups', image_url, cta_link, target_routes + suppress_routes
  TagsInput, dismiss_scope Select, dismiss_days, priority, is_active, starts_at/ends_at) +
  LocaleTabs (title/body/cta_label) + priority ile sıralanabilir tablo + Edit'te TranslatesRecord.
  Departments/Campaign desenini izler.

**Non-goals:** pop-up gösterim/dönüşüm analitiği, A/B test, lead formu backend'i (form capability'de),
frekans sınırlama (impression capping), pop-up başına animasyon/tema seçimi.

## Capabilities

### New Capabilities
- `popups`: editör-yönetilen pop-up/promo yüzeyi — mobil uygulama tanıtımı + genel modal/banner/lead.
  İki dilli metin/CTA, yüklenebilir görsel, locale'siz path globlarıyla hedefleme/gizleme, yayın
  penceresi + aktiflik + öncelik, session/gün bazlı kapatma. Sunucuda çözülüp locale'e göre paylaşılır;
  hiç kayıt yoksa frontend eski hardcoded davranışa düşer (site görsel olarak birebir korunur).
