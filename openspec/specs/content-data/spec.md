# content-data Specification

## Purpose
Ana sayfanın ve sonraki içerik sayfalarının tükettiği içerik verisini (şimdilik
dummy, ileride PostgreSQL + admin) tipli, tek-kaynak ve DB'ye mekanik geçecek
biçimde tanımlar.

## Requirements

### Requirement: Tipli, tek-kaynak içerik verisi
Sistem, içerik varlıklarını (`departments`, `hospitals`, `blogPosts` ve ilgili
yardımcılar) tek bir kaynakta ve tiplenmiş şekilde SUNMALIDIR (SHALL); aynı kavram
birden çok yerde farklı şekille tanımlanmaz.

#### Scenario: Tek kaynaktan okuma
- **WHEN** bir sayfa/bölüm içerik verisine erişir
- **THEN** veriyi tek kaynaklı, tiplenmiş modelden alır (dağınık kopyalar yoktur)

### Requirement: Slug/id ilişkileri (fuzzy yok)
Sistem, varlıklar arası ilişkileri slug/id ile açık kurmalıdır (SHALL); serbest-metin
fuzzy string eşleştirme (normalize + içerme) ilişki için kullanılmaz.

#### Scenario: İlişki slug ile çözülür
- **WHEN** bir bölüm↔hastane veya blog↔bölüm ilişkisi çözülür
- **THEN** ilişki slug/id referansıyla kurulur, string içerme ile değil

### Requirement: DB'ye hazır dummy veri
Sistem, dummy veriyi ileride Eloquent modeli + admin CRUD ile MEKANİK değiştirilecek
biçimde izole SUNMALIDIR (SHALL); veri rastgele UI bileşenlerine gömülmez.

#### Scenario: İzole veri katmanı
- **WHEN** dummy veri tanımlanır
- **THEN** ayrı bir veri modülünde tiplenmiş şekilde durur ve sayfa bileşenleri onu import eder

### Requirement: Çevrilebilir içerik alanları (TR + EN)
Sistem, kullanıcıya görünen içerik alanlarını (ad, başlık, özet vb.) çevrilebilir
(TR + EN) SUNMALIDIR (SHALL); TR-only alan EN'i bloke etmez, eksik EN alan TR'ye düşer.

#### Scenario: İki dilli içerik alanı
- **WHEN** aktif dil İngilizce'dir
- **THEN** içerik varlığının görünen metni İngilizce döner; yoksa Türkçe'ye düşer

### Requirement: Tam içerik kataloğu
Sistem, içerik veri katmanını sitenin tüm sayfalarının ihtiyaç duyduğu varlıkları
kapsayacak şekilde SUNMALIDIR (SHALL): mevcut `departments`, `hospitals`, `blogPosts`
yanına `doctors`, `diseases`, `treatments`, `technologies`, `events`, `packages`,
`press` ve `faq` (ve detay sayfalarının gösterdiği ek alanlar). Tümü mevcut ilkelerle:
tipli, tek-kaynak, slug/id ilişkili, `{tr,en}` çevrilebilir, DB'ye hazır ve
locale-resolved hook'larla erişilebilir.

#### Scenario: Her detay şablonu verisini bulur
- **WHEN** bir detay sayfası (doktor/bölüm/hastalık/tedavi/teknoloji/etkinlik/blog/
  paket/basın) geçerli bir slug/id ile açılır
- **THEN** ilgili varlık verisi content-data'dan çözülür ve render edilir

#### Scenario: İlişkiler slug/id ile
- **WHEN** varlıklar arası bir ilişki (ör. doktor↔bölüm, bölüm↔tedavi) çözülür
- **THEN** ilişki slug/id referansıyla kurulur, fuzzy string eşleştirme ile değil

#### Scenario: İçerik iki dilli
- **WHEN** aktif dil İngilizce
- **THEN** varlıkların görünen alanları İngilizce (eksikse TR fallback) döner
