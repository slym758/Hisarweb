## Why

Foundation + ana sayfa hazır ve arşivli. Şimdi sitenin GERİ KALAN TÜM sayfalarını
(kaynak sitemap'teki ~35 statik sayfa + 11 dinamik detay şablonu) çalışır, DOLU
(gerçekçi içerikle) ve baştan iki dilli (TR + EN) hale getirmek gerekiyor — tek büyük
change. Bu, siteyi "iskele + ana sayfa"dan tam gezilebilir bir siteye taşır: her
nav/footer bağlantısı gerçek bir sayfaya gider, detay sayfaları slug/id ile açılır.

## What Changes

- **content-data tam kataloğa genişler:** mevcut dummy (departments/hospitals/blog)
  yanına `doctors`, `diseases`, `treatments`, `technologies`, `events`, `packages`,
  `press`, `faq` (+ bunların detay alanları) eklenir — hepsi tipli, tek-kaynak,
  slug/id ilişkili, `{tr,en}` bilingual, DB'ye hazır. Locale-resolved hook'lar.

- **Statik sayfalar (birebir, iki dilli, dolu):**
  - *Kurumsal:* kurumsal, vizyon-misyon, kalite-calismalari, web-ve-tibbi-yayin-kurulu,
    insan-kaynaklari, gebe-okulu, moral-takimi, basinda-hastanemiz, etkinlikler
  - *Tıbbi index:* bolumlerimiz, doktorlarimiz, hastaliklar, tedavi-yontemleri,
    teknolojilerimiz, hastanelerimiz
  - *Onkoloji:* butunlesik-onkoloji, butunlesik-onkoloji/medikal-kadro
  - *Rehber/içerik:* saglikli-hayat-rehberi, videolar, bilgi-rehberi, guvenli-cerrahi,
    paketler, anlasmali-kurumlar, mobil-uygulama
  - *Yasal:* kvkk-politikamiz, bilgi-guvenligi-politikamiz, cerez-politikasi,
    mesafeli-satis-sozlesmesi

- **Dinamik detay şablonları (slug/id → content-data, notFound):** doktor/$id,
  bolum/$slug, hastane/$slug, hastalik/$slug, tedavi/$slug, tedavi-yontemleri/$slug,
  teknoloji/$slug, etkinlikler/$slug, saglikli-hayat-rehberi/$slug,
  basinda-hastanemiz/$slug, paketler/$slug.

- **Form sayfaları (prototip):** randevu-al, doktora-sorun, sizi-arayalim,
  sizi-dinliyoruz, anketimize-katilin, iletisim, online-hizmetler — KVKK onayı +
  istemci doğrulaması; backend YOK (prototip, "gönderim aktif değil").

- **Route'lar:** her sayfa `{locale?}` grubunda `Inertia::render('site/...')`; dinamik
  route'lar `{slug}`/`{id}` parametreli, eşleşme yoksa 404. Tüm iç bağlantılar
  locale-farkında (`lp()`). Nav/footer artık gerçek sayfalara gider.

- **Görseller:** geçici Unsplash URL'leri + `TODO` (gerçek asset ayrı iş).

**Non-goals:** formların gerçek backend'i; içerik verisinin DB + admin paneline
taşınması (ayrı change); gerçek görsel asset'leri; SSR (SEO için — design.md open
question). İçerik "dolu" ama temsili örnek boyutunda (her kategoride yeterli sayıda
gerçekçi kayıt; katalogun tam gerçek envanteri değil).

## Capabilities

### New Capabilities
- `site-pages`: kaynak sitemap'teki tüm statik ve dinamik içerik sayfaları — çalışır
  route + Inertia sayfası, kaynakla birebir, iki dilli, content-data'dan dolu,
  responsive, a11y + per-locale SEO.
- `service-forms`: randevu/iletişim/lead/anket/İK form sayfaları — KVKK onayı +
  istemci doğrulaması + prototip (backend yok, sahte başarı yok).

### Modified Capabilities
- `content-data`: mevcut veri katmanı tam içerik kataloğuna genişletilir (doctors,
  diseases, treatments, technologies, events, packages, press, faq + detay alanları),
  aynı tipli/tek-kaynak/slug-id/bilingual/DB'ye-hazır ilkeleriyle.

## Impact

- **Kod:** ~35 statik + 11 dinamik `resources/js/pages/site/**`, ek `components/site/*`
  bölüm bileşenleri, `resources/js/lib/site-data.ts` (tam katalog), `routes/web.php`
  (tüm route'lar + dinamik param'lar), gerekli lang/bilingual alanlar, görsel URL'leri.
- **Veri:** tüm içerik varlıkları dummy (temsili örnek) olarak, ilişkileri slug/id ile.
- **Bağımlılıklar:** bazı sayfaların kullandığı ek shadcn/embla vb. (gerekirse).
- **Ölçek:** büyük change; uygulama ağır paralel orkestrasyonla (sayfa-grubu bazında
  agent'lar) yürütülür — bkz. design.md.
