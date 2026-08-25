# design-system Specification

## Purpose
Hisar Hastanesi markasının görsel dilini (renk, tipografi, yarıçap, gölge, gradient,
animasyon) tek bir tasarım-token kaynağı olarak tanımlar; tüm arayüz bu tokenlarla
kaynak UI'a görsel olarak birebir sadık kalır.

## Requirements

### Requirement: Marka renk token'ları kaynakla birebir
Sistem, kaynak UI'daki marka renk token'larını (primary lacivert, CTA turuncu,
accent cyan, surface/muted, success/destructive ve karanlık palet) hedef uygulamanın
tema katmanında BİREBİR aynı değerlerle sunmalıdır (SHALL).

#### Scenario: Primary ve CTA renkleri eşleşir
- **WHEN** herhangi bir sayfa render edilir
- **THEN** primary renk `oklch(0.28 0.16 268)` lacivert, birincil CTA turuncu
  (`--brand-orange`) ve accent cyan (`--brand-cyan`) olarak kaynaktaki değerlerle
  aynı görünür

#### Scenario: Karanlık mod paleti mevcut
- **WHEN** koyu tema aktifleştirilir
- **THEN** kaynaktaki karanlık palet token'ları uygulanır ve okunabilir kontrast korunur

### Requirement: Tipografi Inter
Sistem tüm arayüz tipografisinde tek font ailesi olarak Inter kullanmalı (SHALL) ve
kaynaktaki başlık harf aralığı/hiyerarşisini korumalıdır.

#### Scenario: Inter yüklenir ve uygulanır
- **WHEN** sayfa yüklenir
- **THEN** gövde ve başlık metinleri Inter ile render edilir ve başlıklarda kaynaktaki
  negatif `letter-spacing` uygulanır

### Requirement: Yarıçap, gölge, gradient ve animasyon token'ları korunur
Sistem, kaynaktaki radius/gölge/gradient token'larını ve imza animasyon/utility
sınıflarını (ör. `container-x`, `hover-lift`, `cta-*`, `phone-*`, `whatsapp-rotate`)
davranışsal olarak birebir sunmalıdır (SHALL); tüm hareket `prefers-reduced-motion`
tercihine saygı göstermelidir.

#### Scenario: Azaltılmış hareket tercihine uyum
- **WHEN** kullanıcının `prefers-reduced-motion: reduce` ayarı vardır
- **THEN** dekoratif animasyonlar durdurulur/azaltılır ve içerik erişilebilir kalır

#### Scenario: Bileşenler ortak token'ları kullanır
- **WHEN** bir buton veya kart render edilir
- **THEN** köşe yarıçapı ve gölgesi kaynaktaki ilgili token ile aynıdır

### Requirement: Arayüz primitive'leri tema token'larına bağlı
Sistem, arayüz primitive'lerini (button, navigation-menu, sheet, dropdown-menu,
accordion, dialog vb.) renklerini tema token'larından türetecek şekilde sağlamalı
(SHALL); primitive'lerde sabit/hardcode renk kullanılmamalıdır.

#### Scenario: Primitive tema ile uyumlu
- **WHEN** bir primitive render edilir
- **THEN** rengini tema token'larından alır ve açık/karanlık tema değişiminde tutarlı kalır
