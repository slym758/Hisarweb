<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Fills each Page's admin management title (the label shown in Site Yapısı → Sayfalar) from the
 * page's own copy.head.title, stripping the " — Hisar Hospital" style suffix. Falls back to a
 * humanized slug when no head title exists.
 *
 * Idempotent + non-destructive: only sets a title when it is currently empty, so it never
 * overwrites a title an editor already entered. Safe to re-run.
 */
class PageTitleSeeder extends Seeder
{
    public function run(): void
    {
        $filled = 0;

        foreach (Page::all() as $page) {
            if (! empty($page->getTranslation('title', 'tr', false))) {
                continue;
            }

            $tr = $this->label($page, 'tr') ?: Str::headline($page->slug);
            $en = $this->label($page, 'en') ?: $tr;

            $page->setTranslations('title', ['tr' => $tr, 'en' => $en])->save();
            $filled++;
        }

        $this->command?->info("Filled {$filled} page title(s).");
    }

    /** The page's head title for a locale, without its site-name suffix. */
    private function label(Page $page, string $locale): ?string
    {
        $head = data_get($page->getTranslation('copy', $locale, false), 'head.title');

        if (! is_string($head) || $head === '') {
            return null;
        }

        // "Anlaşmalı Kurumlar — Hisar Hospital" → "Anlaşmalı Kurumlar"
        $parts = preg_split('/\s[—–-]\s/u', $head, 2);

        return trim($parts[0]);
    }
}
