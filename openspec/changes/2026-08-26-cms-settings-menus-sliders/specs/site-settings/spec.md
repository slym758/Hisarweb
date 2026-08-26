## ADDED Requirements

### Requirement: Admin-yönetilen site ayarları
Sistem, site geneli iletişim ve CTA ayarlarını (çağrı merkezi telefonu, WhatsApp numarası +
mesajı, randevu URL'i + etiketi, sosyal medya linkleri, footer sloganı) admin panelinden
düzenlenebilir TEK kaynaktan SUNMALIDIR (SHALL). Bu değerler frontend'e paylaşılır; çok-dilli
olanlar aktif dile çözülür (fallback ile). Frontend'de aynı bilgiler hardcode edilmez.

#### Scenario: Telefon tek yerden değişir
- **WHEN** editör Site Ayarları'ndan çağrı merkezi telefonunu değiştirir
- **THEN** header, footer, rail, mobil ve form sayfalarında telefon tek seferde güncellenir

#### Scenario: Çok-dilli CTA
- **WHEN** aktif dil İngilizce ve randevu etiketi iki dilli girilmiş
- **THEN** CTA etiketi İngilizce (eksikse fallback) gösterilir

#### Scenario: Görünüm birebir (varsayılanlar)
- **WHEN** ayarlar henüz değiştirilmemiş (seed varsayılanları)
- **THEN** site, ayar sistemi öncesiyle görsel olarak birebir aynı görünür
