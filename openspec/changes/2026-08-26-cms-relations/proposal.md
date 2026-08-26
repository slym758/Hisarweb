## Why

Faz 2 — detay sayfalarındaki "İlgili İçerikler" (ilgili tedaviler/hastalıklar/teknolojiler/
videolar) bugün frontend'de `getXForDept(deptSlug)` in-memory getter'larıyla, doktorun/kaydın
bölümüne göre OTOMATİK üretiliyor; editör bu listeyi kontrol edemiyor (belirli bir öğeyi öne
çıkarma / farklı bölümden ekleme mümkün değil). Amaç: editöre AUTO/MANUEL kontrolü vermek —
MANUEL seçim yapıldığında o liste otomatiği geçersiz kılar, boş bırakılınca aynı bölümden AUTO
gelmeye devam eder. **Görünüm birebir korunur** (MANUEL yokken AUTO sonuçları eskisiyle aynıdır),
**DB asla sıfırlanmaz** (yalnız additive migration + idempotent seeder).

## What Changes

- **Şema (additive):** `related_items` (polimorfik editöryel: source_type/source_id →
  target_type/target_id, `relation` default 'related', `position`, index(source_type,source_id,
  relation)) + `department_technology` pivot (department_id, technology_id, position,
  unique(department_id,technology_id)). Var olan tabloya dokunulmaz.
- **Modeller:** `RelatedItem` (morphTo source + target) · Department `technologies()` ve
  Technology `departments()` belongsToMany (pivot, position sıralı) · `HasRelatedContent` trait
  (Doctor/Disease/Treatment/Technology): `relatedItems($targetClass)` → MANUEL satır varsa
  position sırasıyla döner, yoksa `AutoRelatedResolver`'a devreder + Filament editörleri için
  hedef-tipe göre kapsanmış `related<Target>()` morph ilişkileri.
- **AutoRelatedResolver:** eski `getXForDept` mantığını merkezîleştirir — aynı bölüm
  (Technology için pivot/`dept_slugs`), self hariç, `published()` + `ordered()` + limit.
- **Seeder:** idempotent `RelationSeeder` — her Technology'nin `dept_slugs`'undan
  `department_technology` pivotunu kurar (slug→id), `syncWithoutDetaching` ile tekrar
  çalıştırılabilir. disease/treatment `detail` içindeki fuzzy görünen-ad çipleri OLDUĞU GİBİ
  bırakılır (display metni). DatabaseSeeder'a eklenir.
- **Detay wiring (doktor sayfası — flagship):** `SiteContentController@doctor` yeni `related`
  prop'u ekler = `{ treatments, diseases, technologies, videos }` (doktorun `relatedItems(...)`
  sonuçları, light shape'e serileştirilmiş). `site-data.ts`'te doktor sayfasının kullandığı
  dept-scoped getter'lar (`getTreatmentsForDept`/`getDiseasesForDept`/`getTechnologiesForDept`/
  `getVideosForDept`) `related` prop varsa o dilimi döner, yoksa mevcut in-memory mantığına
  düşer (imza değişmez). Diğer sayfalar (bölüm/tedavi/… detay) `related` göndermediği için
  in-memory AUTO ile çalışmaya devam eder.
- **Filament:** Doctor/Disease/Treatment/Technology resource'larına yeniden kullanılabilir
  `RelatedContent::section([...])` — hedef-tip başına Repeater (aranabilir hedef Select + sürükle
  sırala, `related_items` satırlarını yazar); "boş bırakılırsa aynı bölümden otomatik gelir" notu.

**Non-goals:** Bölüm/tedavi/hastalık/teknoloji detay sayfalarının controller-wiring'i (mekanik
follow-up; bugün in-memory AUTO fallback ile birebir çalışıyor). detail içindeki chip'lerin
gerçek M2M'e taşınması (ayrı change). Route/nav/HandleInertiaRequests değişmez.

## Capabilities

### Modified Capabilities
- `content-data`: dept-scoped ilgili içerik artık AUTO (aynı bölüm) **veya** MANUEL (editöryel
  `related_items`) olarak çözülür; MANUEL otomatiği geçersiz kılar, boşken AUTO'ya düşer. Public
  getter imzaları ve görünüm değişmez.
