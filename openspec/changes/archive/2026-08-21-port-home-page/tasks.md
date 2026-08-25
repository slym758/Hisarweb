## 1. İçerik verisi (content-data dummy)

- [x] 1.1 `resources/js/lib/site-data.ts` tiplenmiş dummy model: 12 bölüm (slug + `{tr,en}` name/blurb + lucide icon), 3 hastane, 6 blog, 8 semptom, doktor/tedavi örnekleri — iç bilingual kaynak + locale-resolved hook'lar (`useDepartments/useHospitals/useBlogPosts/useSymptomMap/useTreatments`) + geriye-uyumlu TR consts (SearchOverlay için) + `normalizeTr`; tsc + build temiz
- [x] 1.2 İlişkiler slug ile (fuzzy yok: dept slug referansları), görünen alanlar `{tr,en}` bilingual kaynaktan resolve ediliyor; görseller geçici Unsplash URL'leri (+ prod'da gerçek asset notu)

## 2. Bölüm bileşenleri (port)

- [x] 2.1 `AppointmentCTA` (+ `AppointmentCTAButton`) ve `QualityCertificates` portlandı (Inertia `href`, iki dilli); build'de derlendi
- [x] 2.2 `AppShowcase` portlandı (iki dilli, `useLocale`-sürücülü; Unsplash placeholder + TODO); derlendi
- [x] 2.3 `PreFooter` portlandı — zod (v4 uyumu) + KVKK zorunlu + MOCK; "gönderim aktif değildir" iki dilli prototip notu eklendi (sahte başarı yok); iki dilli COPY
- [x] 2.4 Home'un kullandığı bileşenler tamam (PreFooter/AppShowcase/AppointmentCTA/QualityCertificates); tüm import'lar çözüldü, full build ✓

## 3. Ana sayfa (home.tsx — birebir)

- [x] 3.1 Kaynak `index.tsx` (1291 satır) inline bölümleri `home.tsx`'e birebir portlandı — 10 üst bölüm kaynak sırasında (Hero/slider+AnnouncementStrip, QuickShortcuts, TrustBand+CountUp+QualityCertificates, Departments+SymptomFinder, ÖzelMerkezler, OnkolojiSpotlight, Hospitals, BlogTeaser, PreFooter, AppShowcase); slider/CountUp/IntersectionObserver/YouTube mantığı korundu
- [x] 3.2 Home persistent `SiteLayout`'a bağlandı (`Home.layout = siteLayout`); iskele yerine gerçek içerik; header/footer korunuyor, içerik `<main>` içinde
- [x] 3.3 Semptom bulucu locale-farkında yönlendiriyor (`router.visit(lp('/bolumlerimiz'))` — kaynak davranışı; kaynak da matched slug'a değil `/bolumlerimiz`'e gidiyordu); EN'de `/en/bolumlerimiz`

## 4. İki dilli içerik (TR + EN)

- [x] 4.1 UI/pazarlama metni inline `COPY = {tr,en}` deseniyle iki dilli (design.md hibrit yaklaşımı — lang dosyası yerine bileşen-içi bilingual, bu hacim için daha temiz); `/` TR, `/en` EN başlık/CTA'lar
- [x] 4.2 İçerik verisi `{tr,en}` alanları content-data hook'larıyla (`useDepartments` vb.) locale'e göre çözülüyor; bölüm/hastane/blog adları iki dilde
- [x] 4.3 Agent taraması: görünür TR-only literal bırakılmadı (kalan Türkçe yalnız kod yorumlarında). *Not: görsel TR/EN teyidi kullanıcıda (6.2).*

## 5. Görseller

- [x] 5.1 Görseller: hero/onkoloji/merkez/jci için geçici Unsplash URL'leri + `TODO`; hastane/blog görselleri content-data'dan (Unsplash). `.asset.json` importu yok. *Broken-image görsel teyidi kullanıcıda (6.x).*

## 6. Doğrulama

- [x] 6.1 GÖRSEL 1:1: kullanıcı `app.hisarweb.test`'te kontrol etti — home kaynakla **birebir** onaylandı
- [x] 6.2 ÇİFT DİL: `/` tam TR, `/en` tam EN (kullanıcı EN'i onayladı); dil değiştirici + eksik-EN fallback foundation'dan
- [x] 6.3 FORM: PreFooter `z.literal(true)` (KVKK zorunlu) + zod istemci doğrulaması + iki dilli "gönderim aktif değildir" prototip notu (sahte başarı yok) — kodda doğrulandı
- [x] 6.4 A11y + SEO: SiteLayout landmark'ları (header/nav/main/footer), 7 `alt` attribute, per-locale `<html lang>`, `<Head>` title + description + hreflang (tr/en/x-default) — doğrulandı
- [x] 6.5 RESPONSIVE + BUILD: `npm run build` ✓ (222kB home bundle); mobil düzen kullanıcı görsel onayına dahil

## 7. Doküman

- [x] 7.1 `CLAUDE.md` güncellendi — `content-data` (dummy, locale-resolved hook'lar, DB'ye hazır) + bilingual desen (inline COPY vs t() vs içerik hook'ları) + görsel/asset notu
