<?php

namespace App\Http\Middleware;

use App\Support\CatalogService;
use App\Support\LocaleService;
use App\Support\MenuService;
use App\Support\PageContentService;
use App\Support\PopupService;
use App\Support\SettingsService;
use App\Support\SliderService;
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
            // Site settings singleton (phone, WhatsApp, appointment CTA, socials),
            // translatable values reduced to the active locale. Lazy like `catalog`.
            'settings' => fn () => SettingsService::resolved(app()->getLocale()),
            // Admin-managed navigation, resolved to the active locale. `header` matches the
            // frontend NavItem[] shape; the in-memory nav stays as a fallback when empty.
            'menus' => fn () => [
                'header' => MenuService::tree('header', app()->getLocale()),
                'footer' => MenuService::tree('footer', app()->getLocale()),
                'footer_legal' => MenuService::tree('footer_legal', app()->getLocale()),
                'rail' => MenuService::tree('rail', app()->getLocale()),
                'bottom_nav' => MenuService::tree('bottom_nav', app()->getLocale()),
            ],
            // Admin-managed home hero slider, resolved to the active locale. Null when no
            // active slides exist, so the frontend falls back to its in-memory hero. Lazy.
            'homeHero' => fn () => SliderService::forPlacement('home_hero', app()->getLocale()),
            // Admin-editable page copy, keyed { [slug]: { [section]: { [key]: value } } },
            // resolved to the active locale. Empty for pages the editor hasn't touched, so
            // the frontend `useContent()` hook falls back to each page's inline COPY. Lazy.
            'pageContent' => fn () => PageContentService::all(app()->getLocale()),
            // Admin-managed pop-ups/promos visible on the current (locale-stripped) path,
            // resolved to the active locale, priority desc. Empty for routes with no matching
            // popup (or before the table exists), so the frontend MobileAppPromo falls back to
            // its hardcoded behaviour. Lazy like the props above.
            'popups' => fn () => PopupService::forPath($this->localeStrippedPath($request), app()->getLocale()),
        ]);
    }

    /**
     * The request path with any leading locale prefix (/en, /de, /ar…) removed, so it can be
     * matched against the locale-agnostic route globs stored on popups. Root stays '/'.
     */
    protected function localeStrippedPath(Request $request): string
    {
        $path = '/'.ltrim($request->path(), '/');

        $prefixes = LocaleService::prefixed();

        if ($prefixes !== []) {
            $group = implode('|', array_map(fn (string $c) => preg_quote($c, '#'), $prefixes));
            $path = (string) preg_replace('#^/('.$group.')(?=/|$)#', '', $path);
        }

        return $path === '' ? '/' : $path;
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
