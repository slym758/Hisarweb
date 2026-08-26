## 1. Site Ayarları (tekil)

- [x] 1.1 `create_site_settings_table` (additive: key uniq, value json) + `SiteSetting` modeli (flush cache on save/delete).
- [x] 1.2 `SettingsService` (all() cached, get, resolved(locale) — çok-dilli değerleri aktif dile indirger, flush).
- [x] 1.3 `SiteSettingsSeeder` (idempotent) — mevcut değerlerle: phone_display "444 5 888", phone_href, whatsapp_number, whatsapp_message{tr,en}, appointment_url, appointment_label{tr,en}, sosyal url'ler, footer_tagline{tr,en}.
- [x] 1.4 `HandleInertiaRequests` `settings` prop'u (lazy, aktif dile çözülmüş).
- [x] 1.5 `resources/js/lib/settings.ts` `useSettings()` + `waHref()`.
- [x] 1.6 Filament `ManageSiteSettings` sayfası (İletişim + çok-dilli LocaleTabs + Sosyal); mount/save; nav 'Ayarlar'.
- [x] 1.7 Frontend süpürme: SiteHeader/SiteFooter/HeaderShared/DesktopRail/MobileBottomNav + iletisim/home telefon/WhatsApp/CTA literal'leri `useSettings()` ile; görünüm birebir.
- [x] 1.8 Doğrulama: build + pint temiz; `/` 200; settings prop var; ayar sayfası route'u kayıtlı.

## 2. Menüler

- [x] 2.1 `menus` + `menu_items` migration (nestable parent_id, iki dilli label json, link_type, route/url, badge json, icon, order, is_active, column_group json).
- [x] 2.2 Modeller (Menu, MenuItem; translatable label/badge/column_group; sortable) + `MenuService` (location → resolved tree, cached, flush).
- [x] 2.3 Seeder — mevcut `navigation.ts` NAV_SOURCE + footer + rail + bottom-nav'ı DB'ye aktar (iki dilli).
- [x] 2.4 Filament `MenuResource` (+ MenuItems yönetimi, 2 seviye).
- [x] 2.5 `HandleInertiaRequests` `menus` prop (locations). `navigation.ts` resolver → prop (NAV_SOURCE fallback). SiteFooter/DesktopRail/MobileBottomNav de menüden.
- [x] 2.6 Doğrulama: header/footer/rail/mobil birebir; build/pint temiz.

## 3. Slider / banner

- [ ] 3.1 `sliders` + `slides` migration (placement; image/mobile_image path + url, focal, link, eyebrow/title/desc json, order, is_active, starts/ends_at).
- [ ] 3.2 Modeller + serileştirme (locale + Media::url) + share/controller prop.
- [ ] 3.3 Seeder — home hero + announce/quick/merkezler dizilerini DB'ye.
- [ ] 3.4 Filament `SliderResource` + Slides (reorderable, görsel yükleme).
- [ ] 3.5 `home.tsx` hero + carousel'ler prop'tan (in-memory fallback).
- [ ] 3.6 Doğrulama: ana sayfa birebir; build/pint temiz.

## 4. Genel

- [ ] 4.1 Her alt-adım sonrası milestone commit.
- [ ] 4.2 `openspec/specs/site-settings` + `site-shell`/`home-page` güncellenir (apply/arşiv).
