<?php

namespace App\Support;

use App\Models\Popup;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

/**
 * Cached, locale-resolved source of truth for admin-managed pop-ups / promos.
 *
 * `forPath('/randevu-al', $locale)` returns the active popups (ordered by `priority` desc)
 * that should render on that locale-stripped path — i.e. matched by `target_routes`
 * (empty/null = every route) AND not matched by `suppress_routes`. Each is resolved to:
 *   { id, type, title, body, cta_label, image (Media::url), cta_link, dismiss_scope, dismiss_days }
 * Only popups that are active() (is_active + inside their date window) are considered. Images
 * resolve via {@see Media::url()} (uploaded path wins, else URL). Returns [] when nothing
 * matches, so the frontend renders nothing (matching a suppressed route).
 *
 * The full active set is cached per locale (path matching is a cheap in-PHP pass on top),
 * flushed on any {@see Popup} change. Defensive: before the table exists (fresh install /
 * migrating) it returns [], so Inertia sharing and artisan never crash — and because empty
 * means "no popup", the frontend falls back to its hardcoded app-promo behaviour.
 */
class PopupService
{
    /**
     * Active popups visible on $path (locale-stripped), resolved to $locale, priority desc.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function forPath(string $path, string $locale): array
    {
        if (! Schema::hasTable('popups')) {
            return [];
        }

        $result = [];

        foreach (self::activeForLocale($locale) as $popup) {
            if (! self::visibleOn($popup['target_routes'], $popup['suppress_routes'], $path)) {
                continue;
            }

            unset($popup['target_routes'], $popup['suppress_routes']);
            $result[] = $popup;
        }

        return $result;
    }

    /**
     * All active popups resolved to a locale (including their route globs for matching),
     * priority desc. Cached per locale; flushed on any Popup change.
     *
     * @return array<int, array<string, mixed>>
     */
    private static function activeForLocale(string $locale): array
    {
        return Cache::rememberForever(
            "popups.{$locale}",
            fn () => self::build($locale)
        );
    }

    /** @return array<int, array<string, mixed>> */
    private static function build(string $locale): array
    {
        return Popup::query()
            ->active()
            ->orderByDesc('priority')
            ->orderBy('id')
            ->get()
            ->map(fn (Popup $popup) => [
                'id' => $popup->id,
                'type' => $popup->type,
                'title' => $popup->loc('title', $locale),
                'body' => $popup->loc('body', $locale),
                'cta_label' => $popup->loc('cta_label', $locale),
                'image' => Media::url($popup->image_path, $popup->image_url),
                'cta_link' => $popup->cta_link,
                'dismiss_scope' => $popup->dismiss_scope,
                'dismiss_days' => (int) $popup->dismiss_days,
                'target_routes' => $popup->target_routes ?? [],
                'suppress_routes' => $popup->suppress_routes ?? [],
            ])
            ->all();
    }

    /**
     * A popup is visible on $path when it is targeted there (no targets = everywhere)
     * and not suppressed there.
     *
     * @param  array<int, string>  $targets
     * @param  array<int, string>  $suppress
     */
    private static function visibleOn(array $targets, array $suppress, string $path): bool
    {
        $targeted = count($targets) === 0 || self::anyMatch($targets, $path);

        return $targeted && ! self::anyMatch($suppress, $path);
    }

    /**
     * @param  array<int, string>  $patterns
     */
    private static function anyMatch(array $patterns, string $path): bool
    {
        foreach ($patterns as $pattern) {
            if (self::matches((string) $pattern, $path)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Simple glob match: `*` is a wildcard for any run of characters (so `/foo*` matches
     * `/foo` and `/foo/bar`); otherwise an exact match.
     */
    private static function matches(string $pattern, string $path): bool
    {
        if ($pattern === '') {
            return false;
        }

        if (! str_contains($pattern, '*')) {
            return $pattern === $path;
        }

        $regex = '#^'.str_replace('\*', '.*', preg_quote($pattern, '#')).'$#';

        return (bool) preg_match($regex, $path);
    }

    public static function flush(): void
    {
        $codes = array_unique(array_merge(LocaleService::codes(), ['tr', 'en']));

        foreach ($codes as $code) {
            Cache::forget("popups.{$code}");
        }
    }
}
