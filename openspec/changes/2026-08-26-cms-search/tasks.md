# Tasks — Faz 8: DB-destekli site araması (SearchOverlay prototip → canlı)

## Backend
- [x] `App\Http\Controllers\SearchController@index` — `q`+`locale` param, JSON `{query, empty,
      emptyMessage, groups}`; `q<2` guard → boş gruplar.
- [x] Typo-toleranslı eşleşme: `unaccent()`+`ILIKE` (substring) OR `similarity()>0.3` (pg_trgm),
      aktif locale + varsayılan-locale (fallback) sütunları; sıralama ILIKE-önce sonra similarity;
      grup başına 5. Sadece `published()` (hastaneler/symptom_maps hariç → hepsi).
- [x] Gruplar: symptom (symptom_maps label+keywords → `/bolum/<deptSlug>`, meta 'ilgili bölüm'/
      'related department', bölüme göre dedup), departments, doctors (`name`+`title`, meta bölüm adı),
      treatments, diseases, technologies, hospitals. `to` locale-agnostik.
- [x] Grup etiketleri + emptyMessage locale'e göre (tr/en; fallback zinciri ile `pick()`).
- [x] Rota `GET /api/search` (`->name('search')`) locale gruplarının DIŞINDA, form rotasının yanında
      + controller import.
- [x] Additive migration `2026_08_26_150000_add_search_trgm_indexes` — GIN `gin_trgm_ops` index'leri
      (departments/doctors/treatments/diseases/technologies/hospitals, tr+en), `IF NOT EXISTS` + try/catch.
      `migrate` çalıştırıldı (DB silinmedi/yenilenmedi).

## Frontend (`HeaderShared.tsx` `SearchOverlay`)
- [x] In-memory filtreleme + `useMemo` kaldırıldı; debounced (250ms) `fetch('/api/search')` + AbortController.
- [x] Dönen `groups` aynı görsel yapı/class'larla render (ResultGroup başlıkları, ≤5 öğe, symptom önce).
- [x] Öğe `to`'su `lp()` ile localize (EN → `/en/…`); eski EN→`#second-opinion` hash davranışı kaldırıldı.
- [x] Boş-sorgu: quickItems + searchTip korundu; sonuç yok: `emptyMessage` + iletişim CTA; loading göstergesi.
- [x] Fetch hatası zarifçe (no-results, çökme yok); overlay aç/kapa/klavye davranışı değişmedi.
- [x] Frontend'in tekrarlanan `SYMPTOM_MAP` + `normalize` export'ları kaldırıldı (tek kaynak: DB).
- [x] EN `quickItems`'a gerçek `to` değerleri eklendi (locale-agnostik yollar, `lp()` ile prefixlenir).

## Doğrulama
- [x] `pint` SearchController + migration + routes/web.php.
- [x] `npm run build` (TS hatasız).
- [x] `curl /api/search?q=kardiyoloji&locale=tr` → departments grubu (Kardiyoloji) + doctors.
- [x] `curl /api/search?q=kalp&locale=tr` → symptom/dept/treatment/disease/technology sonuçları.
- [x] `curl /api/search?q=cardio&locale=en` → Cardiology (+ Cardiovascular Surgery, doctors, treatments).
- [x] `curl /api/search?q=x&locale=tr` → boş gruplar (q<2 guard) + emptyMessage.
- [x] İki dil: `migren/tr` → symptom→Nöroloji; `headache/en` → symptom→Neurology (fallback + localize doğru).
- [x] `curl / ` = 200 (regression yok); DB `migrate:fresh`/refresh ÇALIŞTIRILMADI (additive).
