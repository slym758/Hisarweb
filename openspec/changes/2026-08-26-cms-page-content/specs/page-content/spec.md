## ADDED Requirements

### Requirement: Admin-yönetilen sayfa metinleri
Sistem, public sayfaların başlık, alt-başlık, paragraf ve buton metinlerini admin panelinden
(bölüm/anahtar/tür + çok-dilli değer) düzenlenebilir TEK kaynaktan SUNMALIDIR (SHALL). Bu metinler
frontend'e (`pageContent` prop) paylaşılır ve aktif dile çözülür (fallback zinciriyle). Bir metin
DB'de yoksa frontend o sayfanın inline `COPY` fallback'ini KULLANMALIDIR (SHALL) — böylece geçişi
yapılmamış sayfalar bozulmaz.

#### Scenario: Editör bir bölüm başlığını değiştirir
- **WHEN** editör bir sayfanın bir içerik bloğunun değerini panelden değiştirir
- **THEN** ilgili sayfada o metin (aktif dile çözülmüş olarak) yeni değeriyle görünür

#### Scenario: DB boşken görünüm birebir
- **WHEN** bir bloğun (page_slug, section, key) satırı DB'de yok
- **THEN** sayfa o metin için inline COPY fallback'ini gösterir ve önceki haliyle birebir aynıdır

#### Scenario: Çok-dilli çözümleme
- **WHEN** aktif dil İngilizce ve blok iki dilli (tr/en) girilmiş
- **THEN** metin İngilizce (eksikse fallback zinciriyle) gösterilir

### Requirement: Per-sayfa SEO
Sistem, her sayfanın SEO başlığı, SEO açıklaması ve OG görselini admin panelinden düzenlenebilir
YAPMALIDIR (SHALL); çok-dilli değerler aktif dile çözülür. SEO girilmemişse sayfa mevcut inline
`<Head>` meta'sını KORUMALIDIR (SHALL).

#### Scenario: SEO girilince yansır
- **WHEN** editör bir sayfaya SEO başlığı/açıklaması girer
- **THEN** `PageContentService::meta(slug, locale)` bu değerleri çözülmüş olarak döner

#### Scenario: SEO boşken fallback
- **WHEN** bir sayfanın SEO alanları boş (seed varsayılanı)
- **THEN** sayfa kendi inline `<Head>` meta'sıyla render edilir
