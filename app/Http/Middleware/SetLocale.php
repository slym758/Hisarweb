<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /** Supported locales. The first is the default and has no URL prefix. */
    public const SUPPORTED = ['tr', 'en'];

    /** Locales that appear as a URL prefix (TR is served at the root). */
    public const PREFIXED = ['en'];

    /**
     * Resolve the active locale from the first URL segment (e.g. /en/...).
     * Runs before HandleInertiaRequests so shared translations use the right locale.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $segment = $request->segment(1);
        $locale = in_array($segment, self::PREFIXED, true) ? $segment : 'tr';

        app()->setLocale($locale);

        return $next($request);
    }
}
