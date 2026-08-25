## Purpose

Kullanıcıdan veri toplayan form sayfalarını (randevu, iletişim, doktora sorun, sizi
arayalım, sizi dinliyoruz, anket, İK, online hizmetler) tanımlar — kaynakla birebir,
iki dilli, KVKK'lı ve güvenli; ancak (bu aşamada) backend'siz prototip.

## ADDED Requirements

### Requirement: Form sayfaları çalışır ve birebir
Sistem, kaynak sitemap'teki tüm form sayfalarını çalışır route + Inertia sayfası
olarak, kaynakla görsel birebir ve iki dilli SUNMALIDIR (SHALL).

#### Scenario: Form sayfası açılır
- **WHEN** kullanıcı bir form sayfasına gider (ör. randevu-al)
- **THEN** kaynaktaki form/adımlar kabuk içinde birebir render olur

### Requirement: KVKK onayı ve istemci doğrulaması
Sistem, kişisel veri toplayan formlarda KVKK açık rıza onayını ZORUNLU KILMALI ve
istemci tarafı doğrulaması UYGULAMALIDIR (SHALL); onaysız veya geçersiz gönderim engellenir.

#### Scenario: KVKK olmadan gönderilemez
- **WHEN** kullanıcı KVKK onayı vermeden gönderir
- **THEN** gönderim engellenir ve uyarı gösterilir

#### Scenario: Geçersiz alan uyarısı
- **WHEN** zorunlu/format alanları geçersizdir
- **THEN** ilgili alan hatası gösterilir

### Requirement: Prototip — gerçek gönderim yok
Sistem, formların backend'e bağlı OLMADIĞINI açıkça belirtmeli (SHALL) ve kullanıcıyı
sahte başarı ile yanıltmamalıdır.

#### Scenario: Prototip notu görünür
- **WHEN** bir form sayfası açılır
- **THEN** "gönderim aktif değildir" gibi açık bir prototip notu görünür ve gerçek bir gönderim yapılmaz
