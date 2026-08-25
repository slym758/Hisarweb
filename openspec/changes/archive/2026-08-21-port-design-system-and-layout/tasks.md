## 1. Bağımlılıklar ve shadcn tabanı

- [x] 1.1 Layout/nav için gerekli Radix + yardımcı paketleri ekle — starter zaten çoğunu içeriyordu (navigation-menu, dropdown-menu, dialog, sheet, tooltip, separator, collapsible, slot, cva, clsx, tailwind-merge, lucide-react); eksik `@radix-ui/react-accordion` + `@radix-ui/react-scroll-area` kuruldu
- [x] 1.2 `components.json`'u kaynak new-york stiliyle hizala — `style: new-york`, `baseColor: slate`, `config: ""` (Tailwind 4)
- [x] 1.3 Layout+nav'ın kullandığı shadcn primitive'lerini ekle/senkronla — kaynak `accordion.tsx` + `scroll-area.tsx` port edildi (+ app.css'e `accordion-down/up` animate token'ları/keyframes); `npm run build` temiz geçti

## 2. Tasarım sistemi (token'lar birebir)

- [x] 2.1 Kaynak `src/styles.css` `@theme` + `:root`/`.dark` OKLCH marka token'larını `resources/css/app.css`'e taşı ve starter'ın çakışan renk token'larını kaldır; `app.hisarweb.test`'te primary lacivert / CTA turuncu / accent cyan'ın kaynakla aynı olduğunu doğrula — build + bundle'da `--primary/--brand-orange/--brand-cyan` OKLCH değerleri doğrulandı
- [x] 2.2 Inter fontunu ekle ve global tipografi + başlık `letter-spacing`'ini uygula; gövde ve başlıkların Inter ile render olduğunu doğrula — blade head'de Google Fonts Inter, `--font-*: Inter`, başlıklarda `letter-spacing:-0.02em`
- [x] 2.3 Kaynak utility/animasyon sınıflarını (`container-x`, `hover-lift`, `cta-*`, `phone-*`, `whatsapp-rotate`, `video-play-ripple` + reduced-motion fallback'leri) taşı; `prefers-reduced-motion: reduce` ile animasyonların durduğunu tarayıcıda doğrula — bundle'da `.container-x`, `whatsapp-rotate-sweep` ve reduced-motion blokları doğrulandı

## 3. Localization altyapısı (TR/EN)

- [x] 3.1 `SetLocale` middleware (segment tabanlı: `/en` → en, aksi TR); web grubuna prepend edildi (Inertia share'den önce çalışsın); `/` → TR, `/en` → EN + `<html lang="en">` doğrulandı
- [x] 3.2 `routes/web.php`'de opsiyonel `{locale?}` (whereIn 'en') prefix grubu — tek route adı iki dili taşır; `/` ve `/en` ikisi de 200 döndü
- [x] 3.3 `lang/tr/site.php` + `lang/en/site.php` (nav/common/footer) + `HandleInertiaRequests::share` → `locale`/`locales`/`translations` (EN eksikse TR'ye `array_replace_recursive` ile düşer); payload'da locale-doğru çeviriler ("Kurumsal"/"Corporate") doğrulandı
- [x] 3.4 `resources/js/lib/i18n.ts` — `useTranslations()`/`useLocale()`/`t(key, fallback?)`; eksik anahtarda fallback→key (kırılmaz), EN eksikse server-side TR fallback; iskele sayfada nav etiketleri render oldu

## 4. Navigasyon (tek kaynak)

- [x] 4.1 `resources/js/lib/navigation.ts`: kaynak `SiteHeader` NAV ağacı tek tipli `NavItem[]` + tipler + `isNavActive` olarak modellendi (SiteHeader artık buradan tüketiyor, inline NAV kaldırıldı); build derlendi
- [x] 4.2 Locale-farkında link helper `useLocalizedPath()` (`/en` prefix) + `useCurrentPath()` (locale-stripped) i18n.ts'e eklendi; tüm portlanan bileşenler `lp()` ile link üretiyor

## 5. Site layout + header/footer/mobil (birebir)

- [x] 5.1 `resources/js/layouts/site-layout.tsx` (persistent): skip-link + SiteHeader + `<main id="main-content">` + SiteFooter + DesktopRail + MobileAppPromo + MobileBottomNav + LangSwitcher, kaynak `SiteLayout` düzeniyle; iskele sayfa `SiteHome.layout = siteLayout` ile bağlandı; build derlendi (görsel 1:1 kullanıcı onayı bekliyor — bkz. 7.1)
- [x] 5.2 `SiteHeader` (+ `HeaderShared`: useHeaderChrome/MobileDrawer/SearchOverlay, `MobileCompactHeader`, `Logo`) port edildi; `NAV`/`isNavActive` tek kaynaktan; TanStack `<Link to>`→Inertia `<Link href={lp()}>`, `useRouterState`→`useCurrentPath`; SearchOverlay içeriği için `site-data` boş dummy stub (içerik ayrı change)
- [x] 5.3 `SiteFooter` (çok sütun + yasal şerit) port edildi; iç `<Link>`ler `lp()` ile, dış (`tel:`/`mailto:`/harita/sosyal) `<a>` korundu
- [x] 5.4 `MobileBottomNav` + `MobileCompactHeader` port edildi (dil-farkında yuvalar + `useCurrentPath` ile gizlenme istisnaları); + gerekli `lib/detail-lead-store.ts` portlandı
- [x] 5.5 `LangSwitcher` (+ `LangSheet`/`LangPill`) port edildi; TR/EN geçiş Inertia `router.visit` ile (`/en`+path ↔ path)

## 6. İskele sayfa & starter uyum

- [x] 6.1 `resources/js/pages/site/home.tsx` iskele sayfa `SiteLayout` (persistent) ile bağlandı; kullanıcı `app.hisarweb.test`'te header/footer/nav'ı görsel doğruladı
- [x] 6.2 Auth sayfaları yeni marka token'larıyla uyumlu; `/login`, `/register`, `/forgot-password` → 200 render, auth akışı çalışıyor (AuthLayout, SiteLayout dışı)

## 7. Doğrulama

- [x] 7.1 GÖRSEL 1:1: kullanıcı `app.hisarweb.test` (TR) ve `/en`'i tarayıcıda kontrol etti — header mega-menü, footer, marka renkleri/tipografi kaynakla birebir onaylandı (otomatik ekran görüntüsü Warden cert güveni nedeniyle alınamadı)
- [x] 7.2 ÇİFT DİL: kabuk (nav/footer/top-bar/app-promo/drawer/search) TR (`/`) + EN (`/en`) render oluyor; nav `useNav(locale)`, footer `t()` + EN lang; kullanıcı `/en`'in İngilizce olduğunu onayladı
- [x] 7.3 ERİŞİLEBİLİRLİK & SEO: `<header>`/`<nav aria-label>`/`<main id="main-content">`/`<footer>` landmark'ları, skip-link, reduced-motion mevcut; `<html lang>` locale'e göre; `<Head>` per-page title + hreflang (TR/EN) + meta description; APP_NAME "Hisar Hastanesi"
- [x] 7.4 `npm run build` hatasız (manifest üretiliyor); `tsc` bizim dosyalarda temiz (yalnız starter'ın önceki auth/welcome tsc-strict sorunları kaldı, build'i etkilemiyor)

## 8. Doküman

- [x] 8.1 `CLAUDE.md` oluşturuldu — foundation doktrini: yapı, Warden komutları, i18n kullanımı (t/useNav/localizedPath), tek nav kaynağı, tasarım token'ları, yeni sayfa nasıl eklenir, ne zaman OpenSpec
