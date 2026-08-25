## Context

Foundation (SiteLayout, i18n, nav, tasarım token'ları) hazır; ana sayfa şu an
iskele. Kaynak `Hisar Hastanesi/src/routes/index.tsx` 1291 satır: çoğu bölüm inline
(Hero/slider, TrustBand+CountUp, SymptomFinder, ÖzelMerkezler, Departments,
OnkolojiSpotlight, Hospitals, BlogTeaser) + import edilen bölüm bileşenleri
(`AppShowcase`, `AppointmentCTA`, `QualityCertificates`, `PreFooter`) + veri
(`departments`, `hospitals`, `blogPosts`, `SYMPTOM_TO_DEPT`, `normalizeTr`).
Görseller: Lovable-CDN `.asset.json` (bizim host'ta relative `/__l5e/...` → çözülmez)
+ Unsplash mutlak URL (çözülür). `@/lib/site-data` şu an boş stub. Motivasyon:
proposal.md; sözleşme: specs/{home-page,content-data}.

## Goals / Non-Goals

**Goals (design):** index.tsx'i birebir taşımak; tüm metni iki dilli yapmak; home'un
tükettiği dummy içerik verisini DB'ye hazır tiplenmiş modelle kurmak.
**Non-Goals (design):** detay sayfaları, gerçek form backend'i, gerçek asset'ler,
site-data'nın tamamı.

## Decisions

1. **Bölüm portlama.** `index.tsx` → `resources/js/pages/site/home.tsx`; inline bölüm
   alt-bileşenleri kaynaktaki gibi inline kalır. Import edilen bölüm bileşenleri
   (`AppShowcase`, `AppointmentCTA`, `QualityCertificates`, `PreFooter`) `components/site`
   altına port edilir. Framework uyarlaması foundation kurallarıyla (Inertia `<Link>` +
   `lp()`, `useCurrentPath`; TanStack/Lovable özgü kod taşınmaz).

2. **İki dilli — hibrit yaklaşım.** *Pazarlama/UI metni* (bölüm başlıkları, CTA'lar,
   etiketler) `lang/tr|en/site.php` içinde `home.*` namespace'i → `t('home....')`.
   *Varlık içeriği* (bölüm adı, hastane adı, blog başlık/özet) content-data'da
   `{tr, en}` bilingual alan → locale ile çözülür. *Neden:* foundation'ın iki desenini
   izler (UI için t(), içerik için bilingual veri); DB geçişinde içerik alanları hazır kalır.

3. **content-data dummy modeli.** Boş stub yerine `resources/js/lib/site-data.ts`:
   tiplenmiş `departments` (slug + `{tr,en}` name/blurb + lucide `icon`), `hospitals`
   (`{tr,en}`), `blogPosts` (slug + `{tr,en}` title/excerpt + cover + date),
   `SYMPTOM_TO_DEPT` (`{tr,en}` label + dept slug) ve `normalizeTr` yardımcısı; ayrıca
   SearchOverlay'in beklediği şekiller (departments name/blurb/slug/icon; doctors,
   treatments — temsili örnek). İçerik kaynak `site-data.ts`'ten UYARLANIR ama home
   için TEMSİLİ ÖRNEK boyutunda (tümü değil: ör. ~12-16 bölüm, 3 hastane, ~6-9 blog).
   *Neden:* "fully done" görünüm + yönetilebilir hacim; ilişkiler slug ile.

4. **Bölüm ikonları — lucide eşleştirme.** Kaynak custom SVG dept-icon'ları yerine
   her bölüme görsel olarak yakın bir `lucide-react` ikonu (kaynağın kendi plan'ındaki
   #7 yaklaşımı). SearchOverlay `icon: LucideIcon` beklediğinden uyumlu.

5. **Görseller.** Kaynak Unsplash mutlak URL'leri doğrudan kullanılır (çözülür).
   Lovable-CDN `.asset.json` (hero, banner'lar, merkez kartları) bizim host'ta
   çözülmediğinden, bunlar için uygun Unsplash görselleri GEÇİCİ kullanılır (+ `TODO`
   gerçek asset). Böylece home görsel olarak dolu kalır.

6. **PreFooter formu.** zod doğrulaması + KVKK onayı ile port edilir; gönderim MOCK
   (backend yok) ve "gönderim aktif değildir" açıkça belirtilir (sahte başarı yok).

7. **Carousel/animasyon.** Hero slider + CountUp inline port edilir. Kaynak carousel
   embla kullanıyorsa ve hedefte yoksa `embla-carousel-react` eklenir.

## Risks / Trade-offs

- 1291 satırın tam iki dilli olması büyük çeviri yükü → `home.*` lang anahtarları +
  bilingual veri ile yapılandır; sonda "çevrilmemiş TR kaldı mı" taraması yapılır.
- Lovable-CDN görselleri yüklenmez → Unsplash muadilleri (geçici, TODO); hero kaynakla
  birebir olmayabilir → kabul, gerçek asset sonra.
- Dummy içerik temsili örnek → home'un link verdiği bazı sayfalar henüz yok (tıklayınca
  404) → kabul (foundation nav'ı da böyle); home temsili içerik gösterir.
- Bölüm bileşenleri (AppShowcase vb.) ek veri/bağımlılık isteyebilir → kademeli port,
  gerektikçe bağımlılık eklenir.

## Migration Plan

Additive; iskele home + boş site-data stub'ı yerini alır. Rollback: `home.tsx` +
`site-data.ts` commit'lerini geri al.

## Open Questions

- (Ertelenebilir) Dummy içerik hacmi (tam vs örnek) — "örnek" yeterli; kesin sayı
  tasks'ta netleşir, specs'i etkilemez.
- (Ertelenebilir) Bölüm ikonları lucide eşleştirme vs kaynak SVG'leri port — lucide
  seçildi; kozmetik, specs'i etkilemez.
