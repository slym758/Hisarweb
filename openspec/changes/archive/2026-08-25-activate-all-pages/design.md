## Context

Foundation + ana sayfa + content-data (home dilimi) hazır. Geriye ~35 statik sayfa +
11 dinamik detay şablonu kaldı (kaynak `Hisar Hastanesi/src/routes/*`). Bazı detay
şablonları kaynakta inline `DB` kaydı + `buildPlaceholder` içerir (hastalik.$slug,
tedavi-yontemleri.$slug, paketler.$slug). content-data şu an yalnız home'un
ihtiyaçlarını kapsıyor. Motivasyon: proposal.md; sözleşme: specs/{site-pages,
service-forms,content-data}.

## Goals / Non-Goals

**Goals (design):** tüm sayfaları çalışır+dolu+iki dilli yapmak; content-data'yı tam
kataloğa genişletmek; route'ları toplu kurmak. **Non-Goals:** gerçek backend/asset,
DB+admin geçişi, SSR, katalogun tam gerçek envanteri (temsili örnek yeterli).

## Decisions

1. **content-data önce ve tek interface.** `site-data.ts` genişletilir: `doctors`
   (detaylı), `diseases`, `treatments`(detay), `technologies`, `events`, `packages`
   (detay), `press`, `faq` + gerekli detay alanları — hepsi `{tr,en}`, slug/id
   ilişkili, `getX(locale)`/`useX()` hook'ları. Kaynak inline `DB` kayıtları buraya
   TAŞINIR (tek-kaynak); az sayıda authored kayıt + kalanı için graceful alanlar.
   Bu, sayfa agent'larının ortak sözleşmesidir; ÖNCE ben kurarım.

2. **Route toplu kurulumu.** `routes/web.php` `{locale?}` grubunda tüm statik
   route'lar (`Route::inertia(...)` veya `Inertia::render`) + dinamik route'lar
   (`/bolum/{slug}`, `/doktor/{id}` …). Dinamik route controller/closure content-data'da
   slug/id kontrol eder; yoksa `abort(404)`. Tek yerde, okunur liste.

3. **Sayfa portlama — kümeler halinde paralel.** ~46 sayfa ~6-7 kümeye ayrılır
   (kurumsal, tıbbi-index, tıbbi-detay, onkoloji, rehber/içerik, formlar, yasal) ve
   her küme bir agent'a verilir; foundation kurallarıyla (Inertia `<Link>`+`lp()`,
   `useCurrentPath`, content-data hook'ları), inline bilingual `COPY`, Unsplash
   görselleri. Ben content-data + route + entegrasyon/doğrulamayı yaparım.

4. **İki dilli — hibrit (foundation deseni).** UI/pazarlama metni inline `COPY={tr,en}`,
   içerik content-data hook'larından. Görünür TR-only literal bırakılmaz.

5. **Formlar — prototip.** `service-forms` sayfaları PreFooter formu desenini izler:
   zod + KVKK zorunlu + mock + "gönderim aktif değil" notu. Backend yok.

6. **Detay eksikliği.** content-data'da authored detayı olmayan slug için graceful
   fallback (temel alanlar + "içerik yakında" değil, mevcut alanlarla dolu görünüm).
   Geçersiz slug → 404.

7. **Görseller.** Unsplash mutlak URL'leri (content-data cover'ları + sayfa-içi) +
   `TODO`; `.asset.json` importu yok.

## Risks / Trade-offs

- Ölçek/tutarlılık: çok sayıda dosya + paralel agent → ortak kural seti + content-data
  sözleşmesi + sonda entegrasyon build + düzeltme taraması (TR-only literal, kırık
  import, 404 davranışı).
- content-data hacmi: detay sayfalarının çözülmesi için her tipte yeterli kayıt +
  ilişki; eksikse detay 404/boş → yeterli örnek + graceful alanlar.
- Route sayısı: 40+ route → tek okunur liste; dinamik param + 404 tutarlı.
- Kaynak inline DB'lerin taşınması: sadık kalırken tek-kaynağa toplama → az authored +
  graceful.

## Migration Plan

Additive; iskele/eksik sayfaların yerini alır, content-data genişler. Rollback:
sayfa/route/veri commit'lerini geri al.

## Open Questions

- (Ertelenebilir) İçerik hacmi (örnek sayısı) — tasks'ta netleşir, specs'i etkilemez.
- (Ertelenebilir) SSR (SEO) — foundation'ı etkilemez, ayrı karar.
