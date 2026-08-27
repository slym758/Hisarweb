<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

/**
 * Single, cached source of truth for the site's settings singleton (call-center phone,
 * WhatsApp, appointment CTA, social links, …). Backed by the admin-managed
 * `site_settings` table; the cache is flushed on any {@see SiteSetting} change.
 *
 * Values are either scalars or translatable {tr,en,…} maps. {@see self::resolved()}
 * reduces the translatable ones to a single locale for sharing to the frontend.
 *
 * Defensive: before the table exists (fresh install / migrating) it returns an empty
 * set without caching, so Inertia sharing and artisan never crash.
 */
class SettingsService
{
    private const CACHE_KEY = 'site_settings';

    /**
     * The full key => value map from the table, cached forever.
     *
     * @return array<string,mixed>
     */
    public static function all(): array
    {
        if (! Schema::hasTable('site_settings')) {
            return [];
        }

        return Cache::rememberForever(
            self::CACHE_KEY,
            fn () => SiteSetting::query()->pluck('value', 'key')->all()
        );
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return self::all()[$key] ?? $default;
    }

    public static function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * The settings map with any translatable value (a {tr,en,…} map) reduced to the
     * given locale, falling back down its fallback chain, then to the first value.
     * Non-array (scalar) values pass through untouched.
     *
     * @return array<string,mixed>
     */
    public static function resolved(string $locale): array
    {
        $resolved = [];

        foreach (self::all() as $key => $value) {
            $resolved[$key] = is_array($value)
                ? self::resolveValue($value, $locale)
                : $value;
        }

        // Computed logo URL: uploaded logo wins over a URL, falling back to the bundled emblem.
        $resolved['logo'] = Media::url($resolved['logo_path'] ?? null, $resolved['logo_url'] ?? null)
            ?: '/assets/hisar-emblem.png';

        return $resolved;
    }

    /**
     * Pick the best translation from a {tr,en,…} map for a locale: the locale itself,
     * then its fallback chain, then 'tr', then the first available value.
     *
     * @param  array<string,mixed>  $value
     */
    private static function resolveValue(array $value, string $locale): mixed
    {
        // A list (indexed array) is a real value, not a translations map — pass through.
        if (array_is_list($value)) {
            return $value;
        }

        foreach ([$locale, ...LocaleService::fallbackChain($locale), 'tr'] as $code) {
            if (array_key_exists($code, $value)) {
                return $value[$code];
            }
        }

        return reset($value) ?: '';
    }
}
