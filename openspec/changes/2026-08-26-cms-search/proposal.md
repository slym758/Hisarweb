## Why

Faz 8 (site araması). Header'daki `SearchOverlay` (bkz. `resources/js/components/site/HeaderShared.tsx`)
**prototipti**: statik `site-data` export'ları (`departments`/`doctors`/`treatments`) + bileşende
**tekrar kopyalanmış** bir `SYMPTOM_MAP` üzerinde tarayıcıda `normalize()` ile in-memory filtreleme
yapıyordu. Bunun iki sorunu vardı: (1) arama artık DB'ye taşınan içerikten değil, dondurulmuş
dummy export'lardan besleniyordu; (2) EN'de sonuçlar gerçek sayfaya değil `#second-opinion`
hash'ine gidiyordu. Bu değişiklik aramayı **DB-destekli** kılar (Postgres `pg_trgm` + `unaccent`,
zaten etkin) ve overlay'in görsel/etkileşim UX'ini birebir korur.

## What Changes

- **Controller:** `App\Http\Controllers\SearchController@index(Request)` — `q` + `locale` (varsayılan
  app locale) alır, JSON döner: `{ query, empty, emptyMessage, groups: [{ type, label, items:
  [{ label, to, meta? }] }] }`. Her varlık için aktif locale'in `name`/`title` sütunu **typo-toleranslı**
  eşlenir: `unaccent()` + `ILIKE` (substring) VEYA `similarity()` (pg_trgm, eşik 0.3) ile; varsayılan-locale
  sütunu da fallback olarak denenir (EN arayüzden TR içeriği bulunur). Sıralama: ILIKE-eşleşmesi önce,
  sonra similarity; grup başına 5. Sadece `published()` kayıtlar (hastaneler/symptom_maps hariç —
  hepsi). Gruplar: symptom→bölüm, departments, doctors, treatments, diseases, technologies, hospitals.
  `to` yolları **locale-agnostik** (`/bolum/<slug>`, `/doktor/<code>`, …); frontend localize eder.
  `q` uzunluğu < 2 ise boş gruplar döner (guard).
- **Symptom birleştirme:** symptom grubu artık `symptom_maps` tablosundan (label + `keywords`
  JSON dizisi, locale + fallback) çözülür ve ilgili bölüme (`/bolum/<deptSlug>`) map'lenir; frontend'in
  **tekrarlanan `SYMPTOM_MAP`'i kaldırıldı** (tek kaynak: DB).
- **Rota:** locale gruplarının DIŞINDA, form rotasının yanında `GET /api/search` (`->name('search')`).
- **Additive migration:** en çok aranan translatable sütunlar için GIN `gin_trgm_ops` index'leri
  (`departments`/`doctors`/`treatments`/`diseases`/`technologies`/`hospitals` name/title, tr+en).
  `CREATE INDEX IF NOT EXISTS` + her biri try/catch (idempotent, additive; korpus küçük olduğundan
  index'ler bir zorunluluktan çok geleceğe hazırlıktır). NOT: WHERE `unaccent()` sardığından ve
  unaccent IMMUTABLE olmadığından bu index'ler doğrudan o path'te vurulmayabilir; küçük korpusta sorun değil.
- **Frontend (`HeaderShared.tsx` `SearchOverlay`):** in-memory filtreleme yerine **debounced (~250ms)**
  `fetch('/api/search?q=…&locale=…')`. Dönen `groups` **aynı görsel yapı/class'larla** render edilir
  (grup başlıkları, ≤5 öğe, symptom→bölüm önce). Her öğenin `to`'su `lp()` ile localize edilir
  (EN → `/en/…`) — eski EN→hash davranışı düzeltildi. Boş-sorgu durumu için quickItems + searchTip,
  sonuç yoksa `emptyMessage` korunur; loading + fetch hatası zarifçe ele alınır (hata → no-results,
  çökme yok). Overlay aç/kapa/klavye davranışı değişmedi. EN `quickItems`'a gerçek `to`'lar eklendi.

**Non-goals:** ayrı bir tam-sayfa arama sonuçları ekranı, arama analitiği/loglama, öneri/otomatik-tamamlama
uç noktası, ağırlıklı skorlama tuning'i (basit ILIKE-önce + similarity yeterli), Filament tarafı.

## Capabilities

### Added Capabilities
- `search`: DB-destekli, çok-dilli, typo-toleranslı site araması — header overlay'ini besleyen
  locale-agnostik `GET /api/search` uç noktası (Postgres `pg_trgm`/`unaccent`), symptom→bölüm
  birleştirmesi ve locale-localize edilen sonuç linkleri ile.
