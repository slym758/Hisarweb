## 1. content-data tam katalog

- [x] 1.1 `resources/js/lib/site-data.ts`'i genişlet: `doctors` (detaylı: id, `{tr,en}` name/title/bio, department slug, hospital, photo), `diseases` (slug + `{tr,en}` + deptSlug + detay), `treatments` (slug + `{tr,en}` + deptSlug + detay), `technologies` (slug + `{tr,en}` + deptSlugs), `events` (slug + `{tr,en}` + date/place + detay), `packages` (slug + `{tr,en}` + kapsam), `press` (slug + `{tr,en}`), `faq` (kategori + `{tr,en}` q/a). Tümü tipli, slug/id ilişkili, `getX(locale)` + `useX()` hook'ları. tsc + build temiz olduğunu doğrula
- [x] 1.2 İlişkilerin slug/id ile kurulduğu (fuzzy yok) ve tüm görünen alanların `{tr,en}` olduğu doğrulanır; detay şablonlarının çözebileceği yeterli örnek kayıt bulunur

## 2. Route'lar (toplu)

- [x] 2.1 `routes/web.php` `{locale?}` grubunda tüm statik route'lar (`Inertia::render('site/...')`) + dinamik route'lar (`/bolum/{slug}`, `/doktor/{id}`, `/hastane/{slug}`, `/hastalik/{slug}`, `/tedavi/{slug}`, `/tedavi-yontemleri/{slug}`, `/teknoloji/{slug}`, `/etkinlikler/{slug}`, `/saglikli-hayat-rehberi/{slug}`, `/basinda-hastanemiz/{slug}`, `/paketler/{slug}`) kurulur; dinamik route slug/id yoksa `abort(404)`. `route:list` ile tüm route'ların kayıtlı olduğunu ve TR/EN'de 200/404 döndüğünü doğrula

## 3. Kurumsal sayfalar (port, iki dilli)

- [x] 3.1 kurumsal, vizyon-misyon, kalite-calismalari, web-ve-tibbi-yayin-kurulu, moral-takimi port; her biri `/` ve `/en`'de birebir render doğrula
- [x] 3.2 basinda-hastanemiz (index + `$slug`), etkinlikler (index + `$slug`) port; index dolu + detay slug'dan, geçersiz slug 404 doğrula

## 4. Tıbbi index sayfaları

- [x] 4.1 bolumlerimiz, doktorlarimiz, hastaliklar, tedavi-yontemleri, teknolojilerimiz, hastanelerimiz port; content-data'dan dolu listeler, filtre/arama korunur, iki dilli doğrula

## 5. Tıbbi detay şablonları

- [x] 5.1 bolum/$slug, doktor/$id, hastane/$slug port; ilgili kayıt + ilişkili içerik (slug ile) render, geçersiz 404, iki dilli doğrula
- [x] 5.2 hastalik/$slug, tedavi/$slug, tedavi-yontemleri/$slug, teknoloji/$slug port; kaynak inline DB'ler content-data'ya taşınmış, detay dolu, iki dilli doğrula

## 6. Onkoloji + rehber/içerik sayfaları

- [x] 6.1 butunlesik-onkoloji (+ medikal-kadro) port; onkoloji üniteleri/kadro dolu, iki dilli doğrula
- [x] 6.2 saglikli-hayat-rehberi (index + `$slug`), videolar, bilgi-rehberi, guvenli-cerrahi port; iki dilli + detay 404 doğrula
- [x] 6.3 paketler (index + `$slug`), anlasmali-kurumlar, mobil-uygulama port; dolu + iki dilli doğrula

## 7. Form sayfaları (prototip)

- [x] 7.1 randevu-al (çok adımlı), online-hizmetler port; KVKK + doğrulama + "gönderim aktif değil"; iki dilli doğrula
- [x] 7.2 doktora-sorun, sizi-arayalim, sizi-dinliyoruz, anketimize-katilin, iletisim port; KVKK zorunlu + prototip notu + iki dilli doğrula

## 8. Yasal sayfalar

- [x] 8.1 kvkk-politikamiz, bilgi-guvenligi-politikamiz, cerez-politikasi, mesafeli-satis-sozlesmesi port; iki dilli + birebir doğrula

## 9. Doğrulama

- [x] 9.1 BUILD + tsc: `warden env exec php-fpm npm run build` hatasız; tüm sayfa/bileşen import'ları çözülür
- [x] 9.2 ROUTE/404: her statik sayfa `/` ve `/en`'de 200; dinamik sayfa geçerli slug'da 200, geçersizde 404 (örnekleme) doğrula
- [x] 9.3 ÇİFT DİL taraması: rastgele sayfalarda `/en`'de görünür TR-only literal kalmadığını doğrula
- [x] 9.4 A11y + SEO: sayfalarda semantik landmark + `alt` + per-locale `<Head>`/`<html lang>` doğrula
- [x] 9.5 GÖRSEL: kullanıcı örnek sayfaları (kurumsal, bölüm detay, doktor detay, blog detay, form) tarayıcıda kaynakla karşılaştırıp birebir onaylar; kırık görsel yok

## 10. Doküman

- [x] 10.1 CLAUDE.md güncellenir (tüm sayfalar aktif; sayfa ekleme/route deseni; content-data tam katalog); ilgili openspec/specs capability arşive girer
