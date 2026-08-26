## Why

Faz 7 (form backend'i). Sitedeki 7 form sayfası (`iletisim`, `randevu-al`, `doktora-sorun`,
`sizi-arayalim`, `sizi-dinliyoruz`, `anketimize-katilin`, `insan-kaynaklari`) + `PreFooter` ve
`BizeUlasin` bileşenleri **prototipti**: sahte başarı, backend yok, veri saklanmıyor/iletilmiyor.
Bu değişiklik onları **gerçek** kılar — gönderim saklanır + e-posta ile iletilir — KVKK uyumuyla
(openspec/config.yaml §5: açık rıza + sunucu doğrulaması + spam koruması + asgari veri).

## What Changes

- **Additive migration'lar:** `form_definitions` (admin-yönetilen form yapılandırması: `key`,
  translatable `title`/`subjects`/`kvkk_text`/`success_message`/`error_message`, `recipients` array,
  `is_active`), `form_submissions` (gönderi kutusu: `payload` JSON, `locale`, `consent_at`, `ip`,
  `user_agent`, `status`). DB asla silinmez/yenilenmez.
- **Modeller:** `FormDefinition` (spatie HasTranslations; kayıt kaydında cache flush; `active(key)`
  önbellekli çözüm), `FormSubmission` (`payload`/`consent_at` cast).
- **Idempotent seeder:** `FormDefinitionSeeder` — key başına bir satır, iki dilli başlık + standart
  KVKK açık rıza metni (TR+EN) + başarı/hata mesajları + placeholder alıcı. `firstOrCreate` →
  yeniden çalıştırma admin düzenlemelerini bozmaz.
- **Controller:** `FormSubmissionController@store(Request, key)` — aktif tanımı çöz (yoksa 404),
  honeypot (`website` doluysa sessizce başarı-noop), KVKK `required|accepted`, sunucu doğrulaması,
  gönderiyi sakla (payload = doğrulanan veri − kvkk/honeypot; `consent_at`=now; ip; user_agent;
  locale), alıcılara kuyruklu `FormSubmitted` bildirimi (`Notification::route('mail', ...)`),
  `back()->with('form_success', true)` (alıcılar istemciye sızmaz).
- **Rota:** locale gruplarının DIŞINDA `POST /form/{key}` + `throttle:6,1`.
- **İK/CV yükleme:** `cv` dosyası pdf/doc/docx, maks ~5MB; `private` (local) diskte saklanır,
  yolu payload'a yazılır.
- **Frontend:** 7 form + `PreFooter`/`BizeUlasin` artık Inertia ile POST eder (`useForm`/`router`),
  gizli honeypot `website`, KVKK checkbox `kvkk`'ya bağlı, başarı ekranı `onSuccess` ile; "prototip /
  gönderim aktif değildir" uyarıları kaldırıldı. Markup/COPY/etiketler korundu.
- **Filament:** `FormDefinitionResource` (grup 'Formlar', 'Form Tanımları'; TagsInput alıcılar +
  LocaleTabs translatable alanlar + `is_active`), `FormSubmissionResource` (salt-okunur gelen kutusu,
  `canCreate()=false`, görüntüle + sil).

**Non-goals:** arama (Faz 8), gerçek randevu takvimi entegrasyonu (randevu-al yalnız lead capture),
gerçek SMTP/OTP sağlayıcısı, CAPTCHA (honeypot + throttle yeterli kabul edildi).

## Capabilities

### Modified Capabilities
- `service-forms`: prototip (sahte başarı, backend yok) → **canlı** (DB'ye saklanan + e-posta ile
  iletilen gönderim), KVKK açık rıza kaydı + honeypot/throttle spam koruması + sunucu-tarafı
  (FormRequest/inline validator) doğrulama + dosya yükleme tip/boyut kontrolü ile.
