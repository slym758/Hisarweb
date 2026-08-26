## Why

Faz 4 — bugün kodda gömülü olan üç editöryel yüzeyi admin'e açar: (1) site geneli **ayarlar**
(telefon `444 5 888` ~31 yerde hardcode, WhatsApp, randevu CTA, sosyal linkler), (2) **menüler**
(header mega-menü + footer + rail + mobil — 4 ayrı hardcode liste), (3) **slider/banner**
(ana sayfa hero + duyuru/kısayol carousel'leri kodda sabit dizi). Amaç: editör bunları panelden
yönetsin; site görünümü birebir kalsın. Bkz. mimari plan Faz 4 + şema artifact'i.

## What Changes

- **Site Ayarları (tekil):** `site_settings` key/value tablosu + `SettingsService` (önbellekli) +
  Filament "Site Ayarları" sayfası (İletişim, çok-dilli WhatsApp mesajı / randevu etiketi / footer,
  sosyal linkler). `HandleInertiaRequests` `settings` prop'u paylaşır (aktif dile çözülmüş);
  `resources/js/lib/settings.ts` `useSettings()`. Frontend'deki telefon/WhatsApp/CTA literal'leri
  bununla değişir (varsayılanlar mevcut değerlerle birebir → görünüm değişmez).
- **Menüler:** `menus` (location: header/footer/rail/bottom_nav) + `menu_items` (nestable, iki
  dilli label, iç/dış link, rozet, sıra) + Filament yönetimi; `navigation.ts` `NAV_SOURCE` yerine
  `menus` prop'undan resolver. Header/footer/rail/mobil tek kaynaktan beslenir.
- **Slider/banner:** `sliders` (placement) + `slides` (görsel/mobil görsel/odak/link/iki dilli
  metin/sıra/aktiflik) + Filament (ekle/çıkar/sırala); `home.tsx` hero + carousel'leri prop'tan.

**Non-goals:** sayfa-metin editörü (Faz 5), popup/kampanya (Faz 6), form backend (Faz 7), arama
(Faz 8). Medya yükleme deseni (Faz 3-lite) mevcut (`*_path` + `Media::url` + FileUpload).

## Capabilities

### New Capabilities
- `site-settings`: admin-yönetilen site geneli ayarları (iletişim/CTA/sosyal), Inertia ile
  paylaşılır, çok-dilli değerler aktif dile çözülür; frontend hardcode literal'leri kaldırılır.

### Modified Capabilities
- `site-shell`: navigasyon (header/footer/rail/mobil) tek DB-kaynaklı menü modeline taşınır.
- `home-page`: hero + carousel içerikleri DB-kaynaklı slider/slide modeline taşınır.
