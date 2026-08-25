<?php

namespace App\Http\Middleware;

use App\Support\LocaleService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Resolve the active locale from the first URL segment (e.g. /en/…, /ar/…).
     * The default locale is served at the root (no prefix). Supported locales are
     * managed in the DB via {@see LocaleService}. Runs before HandleInertiaRequests
     * so shared data uses the right locale.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $segment = (string) $request->segment(1);

        $locale = in_array($segment, LocaleService::prefixed(), true)
            ? $segment
            : LocaleService::default();

        app()->setLocale($locale);

        return $next($request);
    }
}
