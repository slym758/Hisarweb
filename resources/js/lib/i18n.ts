import { usePage } from '@inertiajs/react';

/**
 * The CONTENT locale. Dummy content (`site-data.ts`, page `COPY`) is authored only in
 * Turkish + English, so content is resolved in one of these. The real, dynamic site
 * locale (any of the admin-managed languages) is {@link useActiveLocale} — used for
 * routing, the switcher, text direction and UI-chrome strings. When content moves to
 * the database (multi-locale), this clamp goes away.
 */
export type Locale = 'tr' | 'en';

/** Locales the dummy content is actually authored in. */
const CONTENT_LOCALES: Locale[] = ['tr', 'en'];

/** A site language as shared from the backend (admin-managed `languages` table). */
export interface LanguageOption {
    code: string;
    name: string;
    native_name: string;
    is_rtl: boolean;
    is_default: boolean;
    fallback_code: string | null;
}

type Translations = Record<string, unknown>;

interface SharedI18n {
    locale: string;
    defaultLocale: string;
    locales: LanguageOption[];
    dir: 'ltr' | 'rtl';
    translations: Translations;
}

function shared(): SharedI18n {
    const props = usePage().props as unknown as Partial<SharedI18n>;

    return {
        locale: (props.locale as string) ?? 'tr',
        defaultLocale: (props.defaultLocale as string) ?? 'tr',
        locales: (props.locales as LanguageOption[]) ?? [
            { code: 'tr', name: 'Turkish', native_name: 'Türkçe', is_rtl: false, is_default: true, fallback_code: null },
        ],
        dir: (props.dir as 'ltr' | 'rtl') ?? 'ltr',
        translations: (props.translations as Translations) ?? {},
    };
}

/** The real, dynamic active locale (e.g. 'tr' | 'en' | 'ar' | 'de'…). */
export function useActiveLocale(): string {
    return shared().locale;
}

/**
 * The active CONTENT locale — the real locale if it's an authored content locale
 * (tr/en), otherwise the first content locale along its fallback chain (e.g. de → en,
 * ar → en → tr). Lets the tr/en-only dummy content render for every site language
 * without crashing until content becomes multi-locale in the DB.
 */
export function useLocale(): Locale {
    const { locale, locales } = shared();

    if ((CONTENT_LOCALES as string[]).includes(locale)) {
        return locale as Locale;
    }

    const fallbackOf: Record<string, string | null> = {};
    for (const l of locales) {
        fallbackOf[l.code] = l.fallback_code;
    }

    const seen = new Set<string>();
    let cur = fallbackOf[locale] ?? null;
    while (cur && !seen.has(cur)) {
        if ((CONTENT_LOCALES as string[]).includes(cur)) {
            return cur as Locale;
        }
        seen.add(cur);
        cur = fallbackOf[cur] ?? null;
    }

    return 'en';
}

/** The default (root, unprefixed) locale code. */
export function useDefaultLocale(): string {
    return shared().defaultLocale;
}

/** All active site languages, ordered — for the language switcher. */
export function useLocales(): LanguageOption[] {
    return shared().locales;
}

/** Text direction of the active locale ('ltr' | 'rtl'). */
export function useDir(): 'ltr' | 'rtl' {
    return shared().dir;
}

/** Locale codes that carry a URL prefix (everything except the default). */
function prefixedCodes(s: SharedI18n): string[] {
    return s.locales.map((l) => l.code).filter((c) => c !== s.defaultLocale);
}

/**
 * The current pathname with any locale prefix (/en, /ar…) and query/hash stripped,
 * so navigation active-state checks work against locale-agnostic paths.
 */
export function useCurrentPath(): string {
    const s = shared();
    const url = usePage().url;
    const path = url.split('?')[0].split('#')[0];

    const prefixes = prefixedCodes(s);
    const stripped = prefixes.length
        ? path.replace(new RegExp(`^/(${prefixes.join('|')})(?=/|$)`), '')
        : path;

    return stripped === '' ? '/' : stripped;
}

/**
 * Prefix an internal path with a locale. The default locale is served at the root
 * (no prefix); others get a `/{locale}` prefix. External URLs (http, tel:, mailto:)
 * and anything not starting with `/` are returned unchanged.
 */
export function localizedPath(path: string, locale: string, defaultLocale = 'tr'): string {
    if (!path.startsWith('/')) {
        return path;
    }
    if (locale === defaultLocale) {
        return path;
    }
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/** Hook variant of {@link localizedPath} bound to the real active locale + default. */
export function useLocalizedPath(): (path: string) => string {
    const { locale, defaultLocale } = shared();
    return (path: string) => localizedPath(path, locale, defaultLocale);
}

/**
 * Translate UI chrome strings from the shared `translations` bag (the `site` lang file,
 * already merged over its fallback chain server-side). Missing keys fall back to the
 * provided fallback, then to the key itself — the UI never renders empty/broken.
 */
export function useTranslations() {
    const { locale, locales, translations } = shared();

    const t = (key: string, fallback?: string): string => {
        const value = key
            .split('.')
            .reduce<unknown>(
                (acc, part) =>
                    acc != null && typeof acc === 'object'
                        ? (acc as Record<string, unknown>)[part]
                        : undefined,
                translations,
            );

        return typeof value === 'string' ? value : (fallback ?? key);
    };

    return { t, locale, locales };
}
