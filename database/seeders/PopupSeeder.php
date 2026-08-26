<?php

namespace Database\Seeders;

use App\Models\Popup;
use Illuminate\Database\Seeder;

/**
 * Seeds the ONE `app_promo` popup transcribed from the frontend MobileAppPromo's current
 * bilingual COPY (title/desc/cta), the placeholder emblem image, the exact suppressed routes
 * and session dismiss — so the mobile app-promo looks and behaves identically once it becomes
 * DB-driven. Idempotent & non-destructive: firstOrCreate keyed by type never duplicates the
 * row nor overwrites later admin edits.
 */
class PopupSeeder extends Seeder
{
    public function run(): void
    {
        Popup::firstOrCreate(
            ['type' => 'app_promo'],
            [
                'title' => [
                    'tr' => 'Hisar Mobil',
                    'en' => 'Hisar Mobile',
                ],
                'body' => [
                    'tr' => 'Sağlığınız her an yanınızda',
                    'en' => 'Your health with you, anytime',
                ],
                'cta_label' => [
                    'tr' => 'İndir',
                    'en' => 'Download',
                ],
                'image_url' => '/assets/hisar-emblem.png',
                'cta_link' => '/mobil-uygulama',
                'target_routes' => null, // all routes
                'suppress_routes' => [
                    '/mobil-uygulama',
                    '/randevu-al',
                    '/butunlesik-onkoloji*',
                ],
                'dismiss_scope' => 'session',
                'dismiss_days' => 7,
                'priority' => 0,
                'is_active' => true,
            ],
        );
    }
}
