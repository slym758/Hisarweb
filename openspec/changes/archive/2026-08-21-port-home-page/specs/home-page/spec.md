## Purpose

Sitenin vitrini olan ana sayfanın tüm bölümlerini ve davranışını tanımlar — kaynak
UI ile görsel olarak birebir, responsive, iki dilli (TR + EN) ve erişilebilir.

## ADDED Requirements

### Requirement: Ana sayfa tüm bölümleriyle birebir
Sistem, ana sayfayı kaynak UI'daki tüm bölümlerle (hero/banner, duyuru şeridi,
güven/sayaç şeridi, hızlı kısayollar, semptom bulucu, özel merkezler, bölümler
grid'i, onkoloji vurgusu, hastaneler, blog teaser, uygulama tanıtımı, kalite
belgeleri, randevu CTA, iletişim/ön-footer) SUNMALIDIR (SHALL); düzen, renk ve
tipografi kaynakla birebir aynıdır.

#### Scenario: Tüm bölümler görünür
- **WHEN** ana sayfa açılır
- **THEN** kaynaktaki bölümler aynı sırayla ve görünümle render olur

#### Scenario: Persistent kabuk korunur
- **WHEN** ana sayfa render olur
- **THEN** ortak site kabuğu (header/footer/mobil nav) korunur ve içerik `<main>` içindedir

### Requirement: İki dilli ana sayfa (TR + EN)
Sistem, ana sayfanın tüm görünür metnini aktif locale'de SUNMALIDIR (SHALL): Türkçe
(`/`) ve İngilizce (`/en`). TR-only hardcode ile EN bloke edilemez; eksik EN metni
tanımlı fallback (TR) ile gösterilir, boş kalmaz.

#### Scenario: Türkçe ana sayfa
- **WHEN** kullanıcı `/` adresine gider
- **THEN** tüm bölüm başlıkları, metinler ve CTA'lar Türkçe görünür

#### Scenario: İngilizce ana sayfa
- **WHEN** kullanıcı `/en` adresine gider
- **THEN** tüm bölüm başlıkları, metinler ve CTA'lar İngilizce görünür; eksik metin
  Türkçe'ye düşer

### Requirement: Semptom bulucu bölüme yönlendirir
Sistem, ana sayfadaki semptom bulucuda bir semptom seçildiğinde ilgili bölüme,
aktif locale'i koruyarak YÖNLENDİRMELİDİR (SHALL).

#### Scenario: Semptomdan bölüme
- **WHEN** kullanıcı bir semptom seçer veya arar
- **THEN** eşlenen bölüm sayfasına (locale-farkında yol ile) yönlendirilir

### Requirement: İç bağlantılar locale-farkında Inertia
Sistem, ana sayfadaki tüm iç bağlantıları Inertia ile ve aktif locale'e göre
(`/en` prefix) üretmelidir (SHALL); dış, `tel:` ve `mailto:` bağlantıları düz
bağlantı olarak kalır.

#### Scenario: İngilizce'de iç bağlantı
- **WHEN** aktif dil İngilizce iken bir iç bağlantıya tıklanır
- **THEN** `/en...` hedefine Inertia ile gidilir (tam sayfa yenilenmeden)

### Requirement: Responsive ve erişilebilir
Sistem, ana sayfayı mobil ve masaüstünde kaynakla uyumlu responsive SUNMALIDIR
(SHALL); semantik yapı, görsellerde anlamlı `alt` metni, klavye erişimi ve
`prefers-reduced-motion` desteği korunur.

#### Scenario: Mobil düzen
- **WHEN** ana sayfa dar ekranda açılır
- **THEN** bölümler kaynaktaki mobil düzeniyle, yatay taşma olmadan görünür

#### Scenario: Görsellerde alt metni
- **WHEN** bir içerik görseli render olur
- **THEN** anlamlı bir `alt` metni bulunur

### Requirement: Per-locale SEO
Sistem, ana sayfada aktif locale'e uygun `<Head>` meta SUNMALIDIR (SHALL): title,
meta description ve TR/EN hreflang alternatifleri; `<html lang>` aktif locale'i yansıtır.

#### Scenario: SEO meta mevcut
- **WHEN** ana sayfa yüklenir
- **THEN** locale'e uygun title, description ve hreflang alternatifleri head'de bulunur

### Requirement: İletişim formu KVKK'lı ve güvenli
Ana sayfadaki iletişim/ön-footer formu KVKK açık rıza onayı ve istemci doğrulaması
İÇERMELİDİR (SHALL). Backend bağlanmadıysa form PROTOTİP olduğunu açıkça belirtmeli,
kullanıcıyı sahte başarı ile yanıltmamalıdır.

#### Scenario: KVKK olmadan gönderilemez
- **WHEN** kullanıcı KVKK onayı vermeden göndermeye çalışır
- **THEN** gönderim engellenir ve bir uyarı gösterilir

#### Scenario: Prototip olduğu belirtilir
- **WHEN** form gerçek bir backend'e bağlı değildir
- **THEN** "gönderim aktif değildir" gibi açık bir not gösterilir ve sahte başarı gösterilmez
