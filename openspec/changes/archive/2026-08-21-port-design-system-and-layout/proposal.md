## Why

Kaynak `Hisar Hastanesi/` UI'ı (Lovable / TanStack Start) görsel olarak hazır, ama
hedef stack Laravel 12 + Inertia 2 + React 19. Herhangi bir içerik sayfasını
taşımadan önce ORTAK TEMELİ kurmak gerekir: tasarım sistemi (marka token'ları,
tipografi, shadcn tabanı), kalıcı site layout'u ve navigasyon (mega-menü / footer /
mobil), ve iki dilli (TR/EN) altyapı. Bu temel olmadan her sayfa kendi stilini ve
nav'ını taşır → tutarsızlık ve tekrar. Bu change o temeli birebir ve temiz biçimde
atar; sonraki tüm sayfa-taşıma change'leri buna dayanır.

## What Changes

- **Tasarım sistemi (birebir):** kaynak `src/styles.css` marka token'ları — primary
  lacivert `oklch(0.28 0.16 268)`, CTA turuncu `--brand-orange`, accent cyan
  `--brand-cyan`, tek font **Inter**, radius/gölge/gradient token'ları, dark palet —
  hedef `resources/css/app.css` `@theme`'ine SADIK taşınır. Utility/animasyon
  sınıfları (`container-x`, `hover-lift`, `cta-*`, `phone-*`, `whatsapp-rotate`,
  `prefers-reduced-motion` fallback'leri dahil) korunur. Yeni bir görsel dil
  uydurulmaz.
- **shadcn/ui tabanı:** layout+nav'ın ihtiyaç duyduğu primitive'ler (button,
  navigation-menu, sheet/drawer, dropdown-menu, accordion, dialog, ... — kaynak
  `components/ui/*`) Inertia app'ine kurulur (`components.json` + tema uyumu).
- **Kalıcı site layout:** kaynak `SiteLayout` → Inertia **persistent layout**
  (`resources/js/layouts/site-layout.tsx`): Header + `<main>` + Footer + BackToTop +
  DesktopRail + MobileAppPromo düzeni birebir.
- **Navigasyon:** `SiteHeader` mega-menüsü, `SiteFooter`, `MobileBottomNav`,
  `MobileCompactHeader` birebir taşınır; nav ağacı **tek tipli kaynaktan** beslenir
  (kaynaktaki hardcode dağınıklığı toplanır).
- **İki dilli (TR/EN) temel:** locale-farkında yönlendirme (TR `/`, EN `/en`
  prefix), UI metinleri için hafif i18n mekanizması, çevrilebilir nav etiketleri,
  dil değiştirici (kaynak `LangSwitcher` / `EnHeader` / `EnFooter` mantığı) ve eksik
  EN için fallback.
- **Yönlendirme:** Inertia `<Link>` + Ziggy `route()`; kaynak TanStack `<Link to>`
  Inertia'ya çevrilir. TanStack Router/Start ve Lovable'a özgü hiçbir şey (file-based
  routing, `createServerFn`, `server.ts`/`start.ts`, TanStack Query, Lovable
  telemetri/scroll-sync) TAŞINMAZ.
- **Görsel doğrulama:** layout+nav'ı saran bir iskele ana sayfa ile
  `https://app.hisarweb.test` üzerinde kaynakla 1:1 karşılaştırma mümkün olur;
  mevcut starter `welcome`/auth sayfaları bu foundation'la uyumlu hale getirilir
  (auth akışı bozulmaz).

**Non-goals (bu change'in DIŞINDA — sonraki change'ler):** içerik sayfalarının
taşınması ve `site-data.ts`'in dummy modele dönüştürülmesi; formların (randevu/lead/
İK) gerçekleştirilmesi; TÜM EN içerik metinleri (burada yalnız nav/kabuk için TR+EN
string altyapısı + `/en` iskeleti); per-page SEO/meta içerikleri (temel `<Head>`
altyapısı kurulur, içerik meta'sı sayfa change'lerinde). Bu kapsam daraltması
kasıtlıdır; foundation'ı küçük ve doğrulanabilir tutar.

## Capabilities

### New Capabilities
- `design-system`: marka token'ları, tipografi (Inter), Tailwind 4 `@theme`,
  shadcn/ui tabanı ve global stil/animasyonların kaynak `styles.css` ile BİREBİR
  kurulması.
- `localization`: locale-farkında yönlendirme (TR `/`, EN `/en`), UI metinleri için
  i18n mekanizması, dil değiştirme ve eksik-çeviri fallback'i — sitenin iki dilli
  temeli (bu change kapsamında kabuk/nav düzeyinde; içerik çevirisi sonraki
  change'lerde bu capability'yi genişletir).
- `site-shell`: kalıcı site layout'u + navigasyon (mega-menü header, footer, mobil
  alt-nav, desktop rail) — tek tipli nav kaynağından, `design-system` ve
  `localization` üzerine kurulu.

### Modified Capabilities
<!-- Yok — yeni proje; henüz openspec/specs altında mevcut capability yok. -->

## Impact

- **Kod:** `resources/css/app.css` (token'lar/animasyonlar), `resources/js/app.tsx`
  (Inertia bootstrap + layout/i18n resolver), yeni `resources/js/layouts/site-layout.tsx`,
  `resources/js/components/site/*` + `resources/js/components/ui/*`,
  `resources/js/lib/i18n.*`, tipli nav kaynağı, `routes/web.php` (locale-farkında
  route + `Inertia::render`), Ziggy.
- **Bağımlılıklar:** shadcn/ui için Radix paketleri + yardımcılar (cva, clsx,
  tailwind-merge, lucide-react) — kaynaktaki sürümlerle uyumlu; hafif i18n yardımcısı
  (gerekiyorsa). Kurulum: `warden env exec php-fpm npm i ...`.
- **Starter kit:** mevcut `welcome` ve auth sayfaları/varsayılan layout, yeni
  foundation ve token'larla uyumlu hale getirilir (login/register akışı korunur).
- **Referans:** `Hisar Hastanesi/` gitignored kalır; yalnızca taşıma kaynağıdır,
  build'e girmez.
- **İleriye etki:** tüm sonraki sayfa-taşıma change'leri bu layout + token'lar +
  i18n mekanizması üzerine oturur.
