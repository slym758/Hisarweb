<?php

namespace App\Support;

use App\Models\Language;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

/**
 * Single, cached source of truth for the site's active languages. Read by routing,
 * the SetLocale middleware, Inertia sharing and the frontend switcher. Backed by the
 * admin-managed `languages` table; the cache is flushed on any Language change.
 *
 * Defensive: before the table exists (fresh install / migrating) it returns a safe
 * tr+en default without caching, so `routes/web.php` and artisan never crash.
 */
class LocaleService
{
    private const CACHE_KEY = 'locales.active';

    /** @return array<int, array{code:string,name:string,native_name:string,is_rtl:bool,is_default:bool,fallback_code:?string}> */
    public static function all(): array
    {
        try {
            if (! Schema::hasTable('languages')) {
                return self::defaults();
            }

            return Cache::rememberForever(self::CACHE_KEY, function () {
                $rows = Language::query()->where('is_active', true)->orderBy('sort_order')->get([
                    'code', 'name', 'native_name', 'is_rtl', 'is_default', 'fallback_code',
                ]);

                if ($rows->isEmpty()) {
                    return self::defaults();
                }

                return $rows->map(fn (Language $l) => [
                    'code' => $l->code,
                    'name' => $l->name,
                    'native_name' => $l->native_name,
                    'is_rtl' => (bool) $l->is_rtl,
                    'is_default' => (bool) $l->is_default,
                    'fallback_code' => $l->fallback_code,
                ])->all();
            });
        } catch (\Throwable $e) {
            return self::defaults();
        }
    }

    /** Active locale codes, default first. @return array<int,string> */
    public static function codes(): array
    {
        return array_column(self::all(), 'code');
    }

    /** The default (root, unprefixed) locale code. */
    public static function default(): string
    {
        foreach (self::all() as $l) {
            if ($l['is_default']) {
                return $l['code'];
            }
        }

        return self::all()[0]['code'] ?? 'tr';
    }

    /** Active locales that carry a URL prefix (everything except the default). @return array<int,string> */
    public static function prefixed(): array
    {
        $default = self::default();

        return array_values(array_filter(self::codes(), fn (string $c) => $c !== $default));
    }

    public static function isSupported(string $code): bool
    {
        return in_array($code, self::codes(), true);
    }

    public static function isRtl(string $code): bool
    {
        foreach (self::all() as $l) {
            if ($l['code'] === $code) {
                return $l['is_rtl'];
            }
        }

        return false;
    }

    public static function dir(string $code): string
    {
        return self::isRtl($code) ? 'rtl' : 'ltr';
    }

    /**
     * Fallback chain for a locale, following `fallback_code` until it ends
     * (e.g. ar → en → tr). The starting locale is not included.
     *
     * @return array<int,string>
     */
    public static function fallbackChain(string $code): array
    {
        $byCode = [];
        foreach (self::all() as $l) {
            $byCode[$l['code']] = $l['fallback_code'];
        }

        $chain = [];
        $next = $byCode[$code] ?? null;
        while ($next !== null && ! in_array($next, $chain, true) && $next !== $code) {
            $chain[] = $next;
            $next = $byCode[$next] ?? null;
        }

        return $chain;
    }

    public static function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /** @return array<int, array{code:string,name:string,native_name:string,is_rtl:bool,is_default:bool,fallback_code:?string}> */
    private static function defaults(): array
    {
        return [
            ['code' => 'tr', 'name' => 'Turkish', 'native_name' => 'Türkçe', 'is_rtl' => false, 'is_default' => true, 'fallback_code' => null],
            ['code' => 'en', 'name' => 'English', 'native_name' => 'English', 'is_rtl' => false, 'is_default' => false, 'fallback_code' => 'tr'],
        ];
    }
}
