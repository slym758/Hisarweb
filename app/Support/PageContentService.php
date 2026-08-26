<?php

namespace App\Support;

use App\Models\Page;
use App\Models\PageContent;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

/**
 * Cached, locale-resolved source of truth for admin-editable page copy + per-page SEO.
 *
 * {@see self::all()} returns EXACTLY the shape the frontend `useContent(slug)` hook reads:
 *   { [page_slug]: { [section]: { [key]: resolvedValue } } }
 * across every {@see PageContent} row, each value reduced to the active locale (walking the
 * admin-defined fallback chain). {@see self::meta()} returns a single page's resolved SEO
 * (seo_title / seo_description / og image / title).
 *
 * Cached per locale; flushed on any {@see Page}/{@see PageContent} change. Defensive: before
 * the tables exist (fresh install / migrating) it returns empty, so Inertia sharing and
 * artisan never crash — and because empty means "no override", pages keep their inline COPY.
 */
class PageContentService
{
    /**
     * All page content blocks, grouped by page/section/key and resolved to the locale.
     *
     * @return array<string, array<string, array<string, mixed>>>
     */
    public static function all(string $locale): array
    {
        if (! Schema::hasTable('page_contents')) {
            return [];
        }

        return Cache::rememberForever(
            "page_content.{$locale}",
            fn () => self::build($locale)
        );
    }

    /**
     * Per-page SEO for the current page, resolved to the locale. Returns null when the page
     * has no row, so the frontend keeps its inline `<Head>` meta.
     *
     * @return array{title:mixed,seo_title:mixed,seo_description:mixed,og_image:?string}|null
     */
    public static function meta(string $slug, string $locale): ?array
    {
        if (! Schema::hasTable('pages')) {
            return null;
        }

        $metas = Cache::rememberForever(
            "page_meta.{$locale}",
            fn () => self::buildMeta($locale)
        );

        return $metas[$slug] ?? null;
    }

    /**
     * @return array<string, array<string, array<string, mixed>>>
     */
    private static function build(string $locale): array
    {
        $bag = [];

        foreach (PageContent::query()->orderBy('sort_order')->get() as $content) {
            $bag[$content->page_slug][$content->section][$content->key] = $content->loc('value', $locale);
        }

        return $bag;
    }

    /**
     * @return array<string, array{title:mixed,seo_title:mixed,seo_description:mixed,og_image:?string}>
     */
    private static function buildMeta(string $locale): array
    {
        $metas = [];

        foreach (Page::query()->where('is_active', true)->get() as $page) {
            $metas[$page->slug] = [
                'title' => $page->loc('title', $locale),
                'seo_title' => $page->loc('seo_title', $locale),
                'seo_description' => $page->loc('seo_description', $locale),
                'og_image' => Media::url($page->og_image_path, $page->og_image_url),
            ];
        }

        return $metas;
    }

    public static function flush(): void
    {
        $codes = array_unique(array_merge(LocaleService::codes(), ['tr', 'en']));

        foreach ($codes as $code) {
            Cache::forget("page_content.{$code}");
            Cache::forget("page_meta.{$code}");
        }
    }
}
