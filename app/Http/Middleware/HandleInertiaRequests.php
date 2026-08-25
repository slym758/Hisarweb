<?php

namespace App\Http\Middleware;

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
            'locales' => SetLocale::SUPPORTED,
            'translations' => $this->translations(),
        ]);
    }

    /**
     * UI translations for the active locale (the `site` lang file). English falls
     * back to Turkish for any missing key so the UI never renders empty strings.
     *
     * @return array<string, mixed>
     */
    protected function translations(): array
    {
        $fallback = Lang::get('site', [], 'tr');
        $fallback = is_array($fallback) ? $fallback : [];

        if (app()->getLocale() === 'tr') {
            return $fallback;
        }

        $current = Lang::get('site', [], app()->getLocale());

        return array_replace_recursive($fallback, is_array($current) ? $current : []);
    }
}
