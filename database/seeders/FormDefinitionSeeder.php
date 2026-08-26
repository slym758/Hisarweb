<?php

namespace Database\Seeders;

use App\Models\FormDefinition;
use Illuminate\Database\Seeder;

/**
 * Seeds one {@see FormDefinition} per public form with bilingual (TR+EN) defaults: title,
 * a standard KVKK açık rıza (explicit-consent) notice, success/error messages and a
 * placeholder recipient. Idempotent AND non-destructive: uses firstOrCreate keyed by
 * `key`, so re-running never duplicates rows and never overwrites admin edits (recipients,
 * copy, active state).
 */
class FormDefinitionSeeder extends Seeder
{
    public function run(): void
    {
        $kvkk = [
            'tr' => '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, bu form aracılığıyla '
                .'paylaştığım kişisel verilerimin talebimin değerlendirilmesi ve tarafıma dönüş yapılması '
                .'amacıyla Hisar Intercontinental Hospital tarafından işlenmesine açık rıza veriyorum.',
            'en' => 'Under Law No. 6698 on the Protection of Personal Data, I give my explicit consent to '
                .'the processing of the personal data I share through this form by Hisar Intercontinental '
                .'Hospital for the purpose of evaluating my request and getting back to me.',
        ];

        $success = [
            'tr' => 'Talebiniz alındı, en kısa sürede dönüş yapacağız.',
            'en' => "Your request has been received; we'll get back to you shortly.",
        ];

        $error = [
            'tr' => 'Talebiniz gönderilemedi. Lütfen bilgileri kontrol edip tekrar deneyin.',
            'en' => 'Your request could not be sent. Please check the details and try again.',
        ];

        $titles = [
            'iletisim' => ['tr' => 'İletişim', 'en' => 'Contact'],
            'randevu-al' => ['tr' => 'Randevu Talebi', 'en' => 'Appointment Request'],
            'doktora-sorun' => ['tr' => 'Doktora Sorun', 'en' => 'Ask the Doctor'],
            'sizi-arayalim' => ['tr' => 'Sizi Arayalım', 'en' => 'Call Me Back'],
            'sizi-dinliyoruz' => ['tr' => 'Sizi Dinliyoruz', 'en' => "We're Listening"],
            'anketimize-katilin' => ['tr' => 'Memnuniyet Anketi', 'en' => 'Satisfaction Survey'],
            'insan-kaynaklari' => ['tr' => 'İnsan Kaynakları Başvurusu', 'en' => 'HR Application'],
        ];

        foreach ($titles as $key => $title) {
            FormDefinition::firstOrCreate(
                ['key' => $key],
                [
                    'title' => $title,
                    'recipients' => ['info@hisarhospital.com'],
                    'subjects' => null,
                    'kvkk_text' => $kvkk,
                    'success_message' => $success,
                    'error_message' => $error,
                    'is_active' => true,
                ],
            );
        }
    }
}
