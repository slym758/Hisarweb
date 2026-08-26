<?php

namespace App\Http\Middleware;

use App\Support\CatalogService;
use App\Support\LocaleService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'locale' => app()->getLocale(),
            'defaultLocale' => LocaleService::default(),
            'locales' => LocaleService::all(),
            'dir' => LocaleService::dir(app()->getLocale()),
            'translations' => $this->translations(),
            // Light content catalog (lists/search/related), DB-backed + locale-resolved.
            // Lazily evaluated so it's only built for Inertia site responses that use it.
            'catalog' => fn () => CatalogService::forLocale(app()->getLocale()),
        ]);
    }

    /**
     * UI chrome translations for the active locale (the `site` lang file), merged over
     * its fallback chain so no key renders empty. Base is the default locale; then each
     * fallback (far → near) is layered, then the active locale on top. Example: for `ar`
     * the chain is en → tr, so Arabic falls back to English, then Turkish.
     *
     * @return array<string, mixed>
     */
    protected function translations(): array
    {
        $default = LocaleService::default();
        $active = app()->getLocale();

        $result = $this->langArray($default);

        if ($active === $default) {
            return $result;
        }

        // Apply fallbacks from farthest to nearest, then the active locale last (wins).
        foreach (array_reverse(LocaleService::fallbackChain($active)) as $code) {
            if ($code === $default) {
                continue;
            }
            $result = array_replace_recursive($result, $this->langArray($code));
        }

        return array_replace_recursive($result, $this->langArray($active));
    }

    /**
     * The `site` lang array for a locale, or [] if that locale has no lang file yet.
     *
     * @return array<string, mixed>
     */
    protected function langArray(string $locale): array
    {
        $lines = Lang::get('site', [], $locale);

        return is_array($lines) ? $lines : [];
    }
}
