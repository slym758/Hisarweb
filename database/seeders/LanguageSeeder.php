<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

/**
 * Seeds the initial 12 site languages. Idempotent (keyed by `code`) so it can be
 * re-run safely. The admin can add/remove/reorder languages afterwards.
 * Fallback chain: any → en → tr (tr is the ultimate default).
 */
class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            ['code' => 'tr', 'name' => 'Turkish',    'native_name' => 'Türkçe',     'is_default' => true,  'is_rtl' => false, 'fallback_code' => null, 'sort_order' => 0],
            ['code' => 'en', 'name' => 'English',    'native_name' => 'English',    'is_default' => false, 'is_rtl' => false, 'fallback_code' => 'tr', 'sort_order' => 1],
            ['code' => 'fr', 'name' => 'French',     'native_name' => 'Français',   'is_default' => false, 'is_rtl' => false, 'fallback_code' => 'en', 'sort_order' => 2],
            ['code' => 'ru', 'name' => 'Russian',    'native_name' => 'Русский',    'is_default' => false, 'is_rtl' => false, 'fallback_code' => 'en', 'sort_order' => 3],
            ['code' => 'kk', 'name' => 'Kazakh',     'native_name' => 'қазақ',      'is_default' => false, 'is_rtl' => false, 'fallback_code' => 'en', 'sort_order' => 4],
            ['code' => 'ar', 'name' => 'Arabic',     'native_name' => 'العربية',    'is_default' => false, 'is_rtl' => true,  'fallback_code' => 'en', 'sort_order' => 5],
            ['code' => 'ro', 'name' => 'Romanian',   'native_name' => 'Română',     'is_default' => false, 'is_rtl' => false, 'fallback_code' => 'en', 'sort_order' => 6],
            ['code' => 'ka', 'name' => 'Georgian',   'native_name' => 'ქართული',    'is_default' => false, 'is_rtl' => false, 'fallback_code' => 'en', 'sort_order' => 7],
            ['code' => 'de', 'name' => 'German',     'native_name' => 'Deutsch',    'is_default' => false, 'is_rtl' => false, 'fallback_code' => 'en', 'sort_order' => 8],
            ['code' => 'sq', 'name' => 'Albanian',   'native_name' => 'Shqip',      'is_default' => false, 'is_rtl' => false, 'fallback_code' => 'en', 'sort_order' => 9],
            ['code' => 'mk', 'name' => 'Macedonian', 'native_name' => 'македонски', 'is_default' => false, 'is_rtl' => false, 'fallback_code' => 'en', 'sort_order' => 10],
            ['code' => 'bg', 'name' => 'Bulgarian',  'native_name' => 'български',   'is_default' => false, 'is_rtl' => false, 'fallback_code' => 'en', 'sort_order' => 11],
        ];

        foreach ($languages as $lang) {
            Language::updateOrCreate(['code' => $lang['code']], $lang + ['is_active' => true]);
        }
    }
}
