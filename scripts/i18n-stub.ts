// Minimal stand-in for `@/lib/i18n` used ONLY by the catalog export bundle, so the
// build doesn't pull in @inertiajs/react (browser-only) at node runtime. site-data.ts's
// getX() functions don't use useLocale — it's only referenced by the useX() hooks.
export type Locale = 'tr' | 'en';

export function useLocale(): Locale {
    return 'tr';
}
