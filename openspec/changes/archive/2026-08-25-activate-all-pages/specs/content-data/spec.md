## ADDED Requirements

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
