## Context

Hedef uygulama Laravel 12 + Inertia 2 + React 19 starter kit'i olarak zaten kurulu:
`resources/js/app.tsx`, `resources/js/pages/`, `resources/js/layouts/`,
`resources/js/components/ui/` (shadcn), `components.json`, Ziggy, Tailwind 4
(`resources/css/app.css` `@theme`), auth sayfaları. Kaynak `Hisar Hastanesi/`:
TanStack Start, Tailwind 4 CSS-first (`src/styles.css`), shadcn new-york, Inter;
layout kaynakta `SiteLayout` bileşeni, navigasyon `SiteHeader` içinde hardcode `NAV`
dizisi, i18n yok (tek `/en` sayfası). Motivasyon için bkz. proposal.md - Why;
davranış sözleşmesi için bkz. specs/{design-system,localization,site-shell}.

Kısıtlar: kaynakla GÖRSEL BİREBİR; temiz Inertia yapısı; TR+EN baştan; komutlar
Warden içinde (`warden env exec php-fpm ...`), Vite dev `https://vite.hisarweb.test`.

## Goals / Non-Goals

**Goals (design düzeyi):**
- Kaynak `styles.css` token setini tek `app.css` `@theme`'ine birebir taşımak ve
  starter'ın kendi tema renkleriyle çakışmayı çözmek.
- Persistent site layout desenini Inertia idiomatik biçimde kurmak.
- Navigasyonu tek tipli kaynağa toplamak (header/footer/mobil türevleri buradan).
- Locale-farkında routing + server-paylaşımlı i18n mekanizmasını kurmak.

**Non-Goals (design düzeyi):**
- İçerik veri modeli / dummy data (ayrı change).
- Tüm shadcn primitive'lerini kurmak — yalnız layout+nav'ın kullandıkları.
- Inertia SSR'ı bu aşamada zorunlu kılmak (foundation CSR ile doğrulanır).

## Decisions

1. **Token taşıma — tek marka kaynağı.** Kaynak `styles.css`'in `@theme inline` +
   `:root`/`.dark` OKLCH değişkenleri hedef `resources/css/app.css`'e taşınır; starter
   kit'in kendi renk/tema token'ları KALDIRILIR ve marka token'larıyla değiştirilir.
   *Neden:* iki tema seti çakışır; tek kaynak-of-truth marka olmalı. *Alternatif
   (starter token'larını koruyup üzerine eklemek)* reddedildi — görsel sapma riski.

2. **Persistent layout.** Public sayfalar Inertia persistent layout deseniyle
   `SiteLayout` (`resources/js/layouts/site-layout.tsx`) altına alınır (sayfa
   bileşeninde `Page.layout` ata veya `app.tsx` resolve'da varsayılan layout ver).
   Auth/starter sayfaları kendi `AuthLayout`'unda kalır. *Neden:* kaynağın persistent
   header/footer davranışının Inertia karşılığı budur.

3. **Tek kaynaklı navigasyon.** `resources/js/lib/navigation.ts` — tipli `NavItem[]`
   (kaynak `SiteHeader` NAV + footer + mobil). Etiketler i18n anahtarları; hedefler
   locale-farkında Ziggy `route()` adları. Header/footer/mobil bu tek kaynaktan
   türetilir. *Neden:* config kuralı #2 (hardcode dağınıklığını topla).

4. **Locale routing + server-paylaşımlı i18n.** Kök yol grubu (TR) + `/en` prefix
   grubu; bir `SetLocale` middleware locale'i segmentten çözüp `app()->setLocale()`
   çağırır. Çeviriler `lang/tr/*` + `lang/en/*`; `HandleInertiaRequests::share()`
   ile `locale` + gerekli çeviri sözlüğü Inertia prop'u olarak paylaşılır; React
   tarafında küçük `useTranslations()/t()` helper. *Neden:* framework-native, ağır
   bir i18n paketi gerektirmez, SSR/CSR ikisinde çalışır ve SEO ile uyumludur.
   *Alternatif (yalnız client-side react-i18next)* reddedildi — SSR/SEO ve Laravel
   lang ekosistemiyle uyum için server-shared tercih edildi.

5. **shadcn tabanı.** Mevcut `components.json` + `ui/` korunur, kaynak new-york
   stiliyle hizalanır; layout+nav'ın kullandığı primitive'ler (navigation-menu,
   sheet, dropdown-menu, accordion, dialog, button ...) ve `lucide-react` eklenir.
   *Neden:* kaynakla aynı primitive tabanı; yeniden icat yok.

6. **İskele sayfa.** `resources/js/pages/` altında layout+nav'ı saran bir iskele
   sayfa (veya `welcome` uyarlaması) — foundation'ı `app.hisarweb.test` üzerinde 1:1
   doğrulamak için. Gerçek ana sayfa içeriği sonraki change.

## Risks / Trade-offs

- Starter token'ları ile kaynak token çakışması → tek `app.css` `@theme`'de birleştir,
  starter renklerini kaldır; auth sayfalarını yeni token'larla gözden geçir (login/
  register görünümü değişebilir — marka bütünlüğü için kabul).
- Kaynak animasyon/utility sınıflarının Tailwind 4'e eksik taşınması → `styles.css`'i
  bölüm bölüm taşı, tarayıcıda görsel diff ile doğrula.
- Locale-farkında Ziggy route deseni yanlış kurulursa tüm linkler etkilenir → nav
  helper'da tek noktadan üret, baştan tutarlı `{locale}` param deseni.
- i18n aktarım yükü → foundation'da yalnız nav/layout string'leri; fallback TR.

## Migration Plan

Additive; mevcut auth akışı korunur. Rollback: yeni layout/token commit'lerini geri
al, starter defaultlarına dön.

## Open Questions

- (Ertelenebilir) Inertia SSR prod'da açılacak mı — foundation'ı etkilemez, SEO/
  içerik change'inde karara bağlanır.
- (Ertelenebilir) Çeviri biçimi (`lang/*.php` vs tek JSON sözlük) — mekanizma (server-
  shared) sabit; biçim detayı tasks aşamasında netleşir, specs'i etkilemez.
