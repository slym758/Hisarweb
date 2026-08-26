## ADDED Requirements

### Requirement: DB-destekli site araması uç noktası
Sistem, header arama overlay'ini besleyen locale-agnostik bir `GET /api/search` uç noktası
SUNMALIDIR (SHALL). Uç nokta `q` (arama metni) ve `locale` (varsayılan: aktif app locale)
parametrelerini alır ve `{ query, empty, emptyMessage, groups }` biçiminde JSON döner; her grup
`{ type, label, items: [{ label, to, meta? }] }` şeklindedir. `to` yolları locale-agnostiktir
(`/bolum/<slug>`, `/doktor/<code>`, `/tedavi/<slug>`, `/hastalik/<slug>`, `/teknoloji/<slug>`,
`/hastane/<slug>`) ve frontend tarafından localize edilir. Rota, locale gruplarının DIŞINDA yaşar.

#### Scenario: Bölüm bulma (tam eşleşme)
- **WHEN** `GET /api/search?q=kardiyoloji&locale=tr` çağrılır
- **THEN** `type: "departments"` grubunda `label: "Kardiyoloji"`, `to: "/bolum/kardiyoloji"` öğesi döner

#### Scenario: Kısa sorgu guard'ı
- **WHEN** `q` uzunluğu 2 karakterden azdır (örn. `q=x`)
- **THEN** DB sorgulanmaz ve `empty: true` ile boş `groups` döner (emptyMessage dahil)

#### Scenario: Sonuç yok
- **WHEN** eşleşmeyen bir sorgu gönderilir (örn. `q=zzzznomatch`)
- **THEN** `empty: true`, `groups: []` ve locale'e uygun `emptyMessage` döner

### Requirement: Typo-toleranslı, çok-dilli eşleşme
Sistem, arama eşleşmesini Postgres `pg_trgm` + `unaccent` ile typo-toleranslı yapMALIDIR (SHALL):
aktif locale'in `name`/`title` sütununda `unaccent()` + `ILIKE` (substring) VEYA `similarity()`
(eşik 0.3) ile eşleşir, sonuçları ILIKE-eşleşmesi önce sonra benzerliğe göre sıralar ve grup başına
en çok 5 öğe döner. Varsayılan-locale sütunu da fallback olarak denenir; böylece bir dildeki
arayüzden diğer dildeki içerik bulunabilir. Yalnızca `published()` kayıtlar döner (hastaneler ve
symptom_maps hariç — bunların yayın kapısı yoktur/hepsi dahil edilir).

#### Scenario: Diller arası fallback
- **WHEN** `GET /api/search?q=cardio&locale=en` çağrılır
- **THEN** `label: "Cardiology"`, `to: "/bolum/kardiyoloji"` döner (EN içerik eşleşir)

#### Scenario: Yazım hatası toleransı
- **WHEN** `q=kardyoloji` (eksik harf) gönderilir
- **THEN** `similarity()` sayesinde `Kardiyoloji` bölümü sonuçlarda en üstte döner

### Requirement: Symptom→bölüm birleştirmesi (tek kaynak)
Sistem, belirti/hastalık aramalarını `symptom_maps` tablosundan (label + `keywords` JSON dizisi,
aktif locale + fallback) çözMELİ (SHALL) ve her eşleşmeyi ilgili bölüme map'lemelidir
(`to: "/bolum/<deptSlug>"`, `meta` = 'ilgili bölüm'/'related department'), bölüme göre tekilleştirerek.
Frontend'in daha önce kopyaladığı `SYMPTOM_MAP` KULLANILMAMALIDIR; tek kaynak DB'dir.

#### Scenario: Belirtiden bölüme
- **WHEN** `GET /api/search?q=migren&locale=tr` çağrılır
- **THEN** `type: "symptom"` grubunda `label: "Nöroloji"`, `to: "/bolum/noroloji"` öğesi döner

### Requirement: Overlay veri kaynağının değişmesi (UX korunur)
Sistem, header `SearchOverlay` bileşeninin görsel yapısını ve etkileşimini (grup başlıkları,
grup başına ≤5 öğe, symptom→bölüm önce, quickItems + searchTip boş-sorgu durumu, aç/kapa/klavye
davranışı) KORUMALIDIR (SHALL); yalnızca veri kaynağı in-memory filtreden debounced (~250ms)
`/api/search` fetch'ine geçer. Dönen öğelerin `to`'su `lp()` ile localize edilir (EN → `/en/…`),
loading ve fetch hataları zarifçe ele alınır (hata → no-results, çökme yok).

#### Scenario: EN sonucu gerçek localize sayfaya gider
- **WHEN** EN arayüzde bir arama sonucuna tıklanır
- **THEN** `to` `/en/…` olarak localize edilir ve gerçek localize sayfaya gidilir (eski `#second-opinion`
  hash davranışı yerine)

#### Scenario: Fetch hatası çökmez
- **WHEN** `/api/search` isteği başarısız olur
- **THEN** overlay çökmeden no-results durumunu (`emptyMessage`) gösterir
