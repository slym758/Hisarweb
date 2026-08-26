<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

/**
 * Seeds the static pages' whole-page copy (the inline `const COPY = { tr, en }` trees,
 * exported by scripts/export-page-copy.mjs into data/page-copy.json) into each Page's
 * translatable `copy` column, so editors can edit page texts from the admin. The frontend
 * deep-merges this over the page's inline COPY (usePageCopy), so pages stay visually
 * identical and any absent/empty key falls back to code.
 *
 * Idempotent + non-destructive: updateOrCreate by slug refreshes the copy tree in place;
 * it never wipes other pages or touches unrelated Page attributes (title/SEO stay as-is).
 * Re-runnable any time. Re-run export + this seeder after editing a page's inline COPY.
 */
class PageCopySeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/page-copy.json');

        if (! is_file($path)) {
            $this->command?->warn("page-copy.json not found at {$path} — run scripts/export-page-copy.mjs first.");

            return;
        }

        $catalog = json_decode(file_get_contents($path), true);

        if (! is_array($catalog)) {
            $this->command?->warn('page-copy.json is empty or invalid — nothing seeded.');

            return;
        }

        foreach ($catalog as $slug => $data) {
            if (empty($data['tr']) && empty($data['en'])) {
                continue;
            }

            Page::updateOrCreate(
                ['slug' => $slug],
                [
                    'copy' => ['tr' => $data['tr'] ?? [], 'en' => $data['en'] ?? []],
                    'is_active' => true,
                ],
            );
        }

        $this->command?->info('Seeded page copy for '.count($catalog).' pages.');
    }
}
