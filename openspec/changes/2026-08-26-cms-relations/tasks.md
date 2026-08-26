## 1. Şema + modeller

- [x] 1.1 `create_related_items_table` (source_type/source_id, target_type/target_id, relation default 'related', position, index(source_type,source_id,relation)) — additive.
- [x] 1.2 `create_department_technology_table` (department_id fk, technology_id fk, position, unique(department_id,technology_id)) — additive.
- [x] 1.3 `RelatedItem` modeli (morphTo source + target, int cast'ler).
- [x] 1.4 Department `technologies()` + Technology `departments()` belongsToMany (pivot position sıralı).
- [x] 1.5 `HasRelatedContent` trait (`relatedItems($targetClass, $relation, $limit)` MANUEL→else AUTO; Filament için `related<Target>()` morph ilişkileri). Doctor/Disease/Treatment/Technology'ye eklendi.
- [x] 1.6 `AutoRelatedResolver::resolve($model, $targetClass, $limit)` — aynı bölüm (Technology için pivot/`dept_slugs`), self hariç, published+ordered+limit.

## 2. Seeder

- [x] 2.1 Idempotent `RelationSeeder` — Technology `dept_slugs` → `department_technology` (syncWithoutDetaching). DatabaseSeeder'a kaydedildi. detail chip'leri değiştirilmez.

## 3. Detay wiring (doktor — flagship, fallback korunur)

- [x] 3.1 `SiteContentController@doctor` yeni `related` prop = `{ treatments, diseases, technologies, videos }` (doktorun `relatedItems(...)` → light shape SiteSerializer ile).
- [x] 3.2 `SiteSerializer` light metotları (treatmentLight/diseaseLight/technologyLight/videoLight) — CatalogService liste shape'leriyle aynı.
- [x] 3.3 `site-data.ts` dept-scoped getter'lar (`getTreatmentsForDept`/`getDiseasesForDept`/`getTechnologiesForDept`/`getVideosForDept`): `related` prop varsa dilimi döner, yoksa in-memory fallback. İmzalar değişmez.
- [x] 3.4 `RelatedDoctorContent.tsx`/`doktor-detay.tsx` markup değişmeden aynı getter'larla render eder (doğrulandı).

## 4. Filament (AUTO/MANUEL editör)

- [x] 4.1 Yeniden kullanılabilir `App\Filament\Support\RelatedContent::section([...])` — hedef-tip başına Repeater (aranabilir Select + `orderColumn('position')` sürükle sırala, `related_items` yazar, "boş bırakılırsa AUTO" notu).
- [x] 4.2 Doctor (treatments/diseases/technologies/videos), Disease (treatments/technologies), Treatment (diseases/technologies), Technology (diseases/treatments) form'larına "İlgili İçerikler" bölümü eklendi.

## 5. Doğrulama

- [x] 5.1 `migrate:status` yeni migration'lar çalıştı; `DB::table('department_technology')->count()` = 14 (>0).
- [x] 5.2 `pint` temiz; `npm run build` TS hatasız.
- [x] 5.3 `curl /doktor/d1` = 200; ilgili bölümler AUTO ile aynı veriyle render olur.
- [x] 5.4 MANUEL override kanıtı: tinker ile d1 → Treatment(acik-kalp-ameliyati) satırı eklendi → curl'de o tedavi related listede ilk sırada göründü (AUTO koroner-anjiyografi'yi geçersiz kıldı) → satır geri alındı, `related_items` count 0.
- [x] 5.5 `route:list` tüm resource'lar fatal hatasız yüklenir.
