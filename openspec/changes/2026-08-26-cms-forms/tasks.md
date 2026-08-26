# Tasks — Faz 7: Form backend'i (service-forms prototip → canlı)

## Backend
- [x] Additive migration `form_definitions` (key unique, translatable title/subjects/kvkk_text/
      success_message/error_message, recipients array, is_active).
- [x] Additive migration `form_submissions` (form_definition_id fk nullable, key, payload json,
      locale, consent_at, ip, user_agent, status default 'new').
- [x] `App\Models\FormDefinition` (HasTranslations $translatable; recipients=>array; save'de cache
      flush; `active(key)` önbellekli).
- [x] `App\Models\FormSubmission` (payload=>array, consent_at=>datetime).
- [x] Idempotent `FormDefinitionSeeder` — 7 key, iki dilli title + KVKK açık rıza (TR+EN) + başarı/
      hata mesajları + `["info@hisarhospital.com"]` alıcı. `DatabaseSeeder`'a eklendi.
- [x] `migrate` + `db:seed --class=FormDefinitionSeeder` çalıştırıldı (FormDefinition::count()=7).
- [x] `App\Notifications\FormSubmitted` (ShouldQueue, mail kanalı, asgari veri; kişisel veri loglanmaz).
- [x] `App\Http\Controllers\FormSubmissionController@store` — 404 (aktif değilse), honeypot noop,
      KVKK required|accepted, sunucu doğrulaması, sakla, kuyruklu bildirim, `back()->with(form_success)`.
- [x] CV yükleme: pdf/doc/docx, maks 5MB, `local` (private) disk, yol payload'da.
- [x] Rota `POST /form/{key}` + `throttle:6,1` (locale gruplarının dışında) + controller import.

## Frontend (7 form + PreFooter/BizeUlasin canlı POST)
- [x] `iletisim.tsx` — useForm + honeypot + kvkk; başarı mesajı; prototip uyarısı kaldırıldı.
- [x] `doktora-sorun.tsx` — aynı desen.
- [x] `sizi-arayalim.tsx` — aynı desen.
- [x] `sizi-dinliyoruz.tsx` — aynı desen.
- [x] `anketimize-katilin.tsx` — anket payload'ı (ratings/nps) + kvkk + honeypot.
- [x] `randevu-al.tsx` — sihirbaz UI korunur; son adımda `/form/randevu-al`'a lead capture POST;
      sahte slotlar "tercih edilen saat" ipucu olarak kaldı.
- [x] `insan-kaynaklari.tsx` — CV dosyası POST'a dahil (multipart), KVKK checkbox eklendi, honeypot.
- [x] `PreFooter.tsx` — `/form/iletisim`'e POST; honeypot; KVKK linki gerçek; prototip uyarısı kaldırıldı.
- [x] `BizeUlasin.tsx` — `/form/iletisim`'e POST; honeypot; başarı ekranı.

## Filament
- [x] `FormDefinitionResource` (grup 'Formlar', 'Form Tanımları') — recipients TagsInput +
      translatable title/kvkk_text/success/error/subjects (LocaleTabs) + is_active toggle.
- [x] `FormSubmissionResource` (grup 'Formlar', 'Form Gönderileri') — salt-okunur gelen kutusu,
      view action payload gösterir, `canCreate()=false`, silme açık.

## Doğrulama
- [x] `migrate:status` yeni migration'lar çalıştı; `FormDefinition::count()`=7.
- [x] `pint` ilgili dosyalar.
- [x] `npm run build` (TS hatasız).
- [x] `route:list | grep form` → POST rotası + iki resource.
- [x] `curl -X POST /form/iletisim` → 419 (CSRF), 500 değil.
