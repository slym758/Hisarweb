## Purpose

Kaynak sitemap'teki tüm statik ve dinamik içerik sayfalarını tanımlar — çalışır
route + Inertia sayfası, kaynak UI ile görsel birebir, iki dilli (TR+EN),
content-data'dan dolu, responsive ve erişilebilir.

## ADDED Requirements

### Requirement: Tüm statik sayfalar çalışır ve birebir
Sistem, kaynak sitemap'teki tüm statik içerik sayfalarını (kurumsal, vizyon-misyon,
kalite-calismalari, web-ve-tibbi-yayin-kurulu, insan-kaynaklari, gebe-okulu,
moral-takimi, basinda-hastanemiz, etkinlikler, bolumlerimiz, doktorlarimiz,
hastaliklar, tedavi-yontemleri, teknolojilerimiz, hastanelerimiz, butunlesik-onkoloji
(+medikal-kadro), saglikli-hayat-rehberi, videolar, bilgi-rehberi, guvenli-cerrahi,
paketler, anlasmali-kurumlar, mobil-uygulama ve yasal sayfalar) çalışır route + Inertia
sayfası olarak, kaynakla görsel birebir SUNMALIDIR (SHALL).

#### Scenario: Nav/footer bağlantıları gerçek sayfaya gider
- **WHEN** kullanıcı header/footer'daki bir bağlantıya tıklar
- **THEN** ilgili gerçek sayfa açılır (404 değil) ve ortak kabuk içinde render olur

#### Scenario: Sayfa kaynakla birebir
- **WHEN** bir statik sayfa açılır
- **THEN** düzen, renk, tipografi ve bölümler kaynak UI ile aynıdır

### Requirement: Dinamik detay sayfaları slug/id ile çözülür
Sistem, dinamik detay şablonlarını (bolum/$slug, doktor/$id, hastane/$slug,
hastalik/$slug, tedavi/$slug, tedavi-yontemleri/$slug, teknoloji/$slug,
etkinlikler/$slug, saglikli-hayat-rehberi/$slug, basinda-hastanemiz/$slug,
paketler/$slug) content-data'dan slug/id ile çözerek SUNMALIDIR (SHALL); eşleşme
yoksa 404 döner.

#### Scenario: Geçerli slug detayı açar
- **WHEN** kullanıcı geçerli bir slug/id ile detay sayfasına gider
- **THEN** ilgili kaydın içeriği render olur

#### Scenario: Geçersiz slug 404
- **WHEN** kullanıcı content-data'da olmayan bir slug/id ister
- **THEN** 404 (notFound) döner, boş/kırık sayfa değil

### Requirement: İki dilli sayfalar (TR + EN)
Sistem, tüm sayfaları hem TR (`/`) hem EN (`/en`) sunmalıdır (SHALL); görünür metin
aktif locale'de, eksik EN tanımlı fallback (TR) ile gösterilir.

#### Scenario: EN sayfa
- **WHEN** kullanıcı `/en/<sayfa>`'ya gider
- **THEN** sayfanın görünür metni İngilizce (eksikse TR) render olur

### Requirement: content-data'dan dolu içerik
Sistem, liste/index sayfalarını (bölümler, doktorlar, hastalıklar, tedaviler,
teknolojiler, blog, etkinlikler, paketler, hastaneler) content-data'dan doldurmalı
(SHALL); detay sayfaları ilgili kayıttan beslenir. Boş/placeholder liste bırakılmaz.

#### Scenario: Index dolu
- **WHEN** bir liste sayfası açılır
- **THEN** content-data'daki kayıtlar gerçekçi içerikle listelenir

### Requirement: Responsive, erişilebilir ve per-locale SEO
Sistem, her sayfayı responsive SUNMALI (SHALL); semantik yapı, görsellerde `alt`,
klavye erişimi; per-locale `<Head>` (title, description, hreflang) ve `<html lang>`.

#### Scenario: SEO ve landmark'lar
- **WHEN** bir sayfa yüklenir
- **THEN** locale'e uygun title/description/hreflang bulunur ve semantik landmark'lar mevcuttur
