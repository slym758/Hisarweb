<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

/**
 * Seeds the site settings singleton with defaults that MATCH the previously hardcoded
 * frontend values, so the site looks identical after the migration. Idempotent:
 * updateOrCreate by key, so re-running never duplicates or wipes admin edits' keys.
 */
class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'phone_display' => '444 5 888',
            'phone_href' => 'tel:4445888',
            'whatsapp_number' => '904445888',
            'whatsapp_message' => [
                'tr' => 'Merhaba, bilgi almak istiyorum.',
                'en' => "Hello, I'd like some information.",
            ],
            'appointment_url' => 'https://online.hisarhospital.com',
            'appointment_label' => [
                'tr' => 'Randevu Al',
                'en' => 'Get an Appointment',
            ],
            'instagram_url' => '',
            'facebook_url' => '',
            'x_url' => '',
            'youtube_url' => '',
            'linkedin_url' => '',
            'footer_tagline' => [
                'tr' => '',
                'en' => '',
            ],
        ];

        foreach ($defaults as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
