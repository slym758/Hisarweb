import { usePage } from '@inertiajs/react';

export type Locale = 'tr' | 'en';

/**
 * The current pathname with the `/en` locale prefix and any query/hash stripped,
 * so navigation active-state checks work against locale-agnostic paths.
 */
export function useCurrentPath(): string {
    const url = usePage().url;
    const path = url.split('?')[0].split('#')[0];
    const stripped = path.replace(/^\/en(?=\/|$)/, '');
    return stripped === '' ? '/' : stripped;
}

type Translations = Record<string, unknown>;

interface SharedI18n {
    locale: Locale;
    locales: Locale[];
    translations: Translations;
}

function shared(): SharedI18n {
    const props = usePage().props as unknown as Partial<SharedI18n>;

    return {
        locale: (props.locale as Locale) ?? 'tr',
        locales: (props.locales as Locale[]) ?? ['tr', 'en'],
        translations: (props.translations as Translations) ?? {},
    };
}

/** The active locale ('tr' | 'en'), resolved from the shared Inertia props. */
export function useLocale(): Locale {
    return shared().locale;
}

/**
 * Prefix an internal path with the active locale. Turkish is served at the root;
 * English uses a `/en` prefix. External URLs (http, tel:, mailto:) and anything
 * not starting with `/` are returned unchanged.
 */
export function localizedPath(path: string, locale: Locale): string {
    if (!path.startsWith('/')) {
        return path;
    }
    if (locale === 'en') {
        return path === '/' ? '/en' : `/en${path}`;
    }
    return path;
}

/** Hook variant of {@link localizedPath} bound to the active locale. */
export function useLocalizedPath(): (path: string) => string {
    const locale = useLocale();
    return (path: string) => localizedPath(path, locale);
}

/**
 * Translate UI strings from the shared `translations` bag (the `site` lang file).
 * Missing keys fall back to the provided fallback, then to the key itself — the UI
 * never renders empty/broken. English falls back to Turkish server-side (see
 * HandleInertiaRequests), so a missing EN key shows the TR value.
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
