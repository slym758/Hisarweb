## Purpose

Tüm sayfaların paylaştığı kalıcı site kabuğunu tanımlar: header (mega-menü), footer,
mobil navigasyon ve yardımcı öğeler — kaynak UI ile birebir, tek bir tipli
navigasyon kaynağından beslenen.

## ADDED Requirements

### Requirement: Kalıcı site layout'u
Sistem, tüm halka açık sayfaları ortak bir kalıcı layout ile sarmalamalıdır (SHALL):
üstte header, ortada sayfa içeriği, altta footer; ayrıca kaynaktaki yardımcı öğeler
(BackToTop, desktop rail, mobil uygulama promosu). Layout sayfa geçişlerinde yeniden
kurulmamalıdır (persistent).

#### Scenario: Ortak kabuk her sayfada
- **WHEN** herhangi bir halka açık sayfa render edilir
- **THEN** aynı header ve footer görünür ve düzen kaynaktaki `SiteLayout` ile birebir aynıdır

#### Scenario: Sayfa geçişinde layout korunur
- **WHEN** kullanıcı iki sayfa arasında gezinir
- **THEN** header ve footer yeniden yüklenmez, kalıcı kalır

### Requirement: Mega-menü header (birebir)
Sistem, kaynak header mega-menüsünü birebir sunmalıdır (SHALL): üst düzey öğeler
(Kurumsal, Doktorlarımız, Bölümlerimiz, Hastanelerimiz, Hasta Rehberi, Online
Hizmetler, İletişim), açılır çok-sütunlu paneller, arama ve aktif-durum vurgusu.

#### Scenario: Mega-menü açılır
- **WHEN** kullanıcı bir mega-menü öğesine gelir veya odaklanır
- **THEN** kaynaktakiyle aynı sütun ve bağlantı yapısına sahip panel görünür

#### Scenario: Aktif menü vurgusu
- **WHEN** kullanıcı bir bölümün alt sayfasındadır
- **THEN** ilgili üst menü öğesi aktif olarak vurgulanır

### Requirement: Footer ve mobil navigasyon (birebir)
Sistem, kaynak footer'ı (çok sütunlu + yasal şerit) ve mobil navigasyonu birebir
sunmalı (SHALL); mobil alt-nav, kaynaktaki kurala göre belirli sayfalarda
gizlenebilmelidir.

#### Scenario: Footer içeriği
- **WHEN** bir sayfanın altına inilir
- **THEN** kaynaktaki footer sütunları, iletişim bilgisi ve yasal bağlantılar görünür

#### Scenario: Mobil alt-nav görünürlüğü
- **WHEN** dar ekranda gezinilir
- **THEN** kaynaktaki mobil alt-nav görünür ve kaynaktaki istisna sayfalarda (ör.
  randevu, doktor detayı) gizlenir

### Requirement: Tek kaynaklı, dile duyarlı navigasyon
Sistem, navigasyon yapısını (header/footer/mobil) tek bir tipli kaynaktan üretmeli
(SHALL); dağınık hardcode kopyalar bulunmamalı, bağlantı etiketleri localization ile
dile göre çözülmeli ve yönlendirme Inertia bağlantılarıyla yapılmalıdır.

#### Scenario: Tek kaynak, çok yüzey
- **WHEN** navigasyon öğeleri değişir
- **THEN** header, footer ve mobil türevler aynı kaynaktan tutarlı biçimde güncellenir

#### Scenario: Dile duyarlı bağlantılar
- **WHEN** aktif dil İngilizce'dir
- **THEN** navigasyon bağlantıları `/en` locale'ine ve İngilizce etiketlere çözülür

### Requirement: İskele sayfa ile görsel doğrulama
Sistem, layout ve navigasyonu saran en az bir iskele sayfa sağlamalıdır (SHALL); böylece
foundation, kaynakla 1:1 görsel karşılaştırma için canlı görülebilir.

#### Scenario: Foundation canlı görülebilir
- **WHEN** iskele sayfa `app.hisarweb.test` üzerinde açılır
- **THEN** header, footer ve navigasyon kaynak UI ile aynı görünür ve etkileşir
