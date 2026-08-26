import { usePage } from '@inertiajs/react';

/**
 * Admin-editable page copy, fallback-safe. `useContent(slug)` returns a `pc(section, key,
 * fallback)` getter: it reads the DB-backed, locale-resolved `pageContent` shared prop for
 * this page and returns the stored value, or the given fallback when the block is absent
 * (or the DB is empty). Wire a page by keeping its inline `COPY` as the fallback:
 *
 *   const pc = useContent('kurumsal');
 *   ...
 *   {pc('about', 'title', c.aboutTitle)}
 *
 * With no DB rows every call returns its fallback, so the page renders identically; once an
 * editor fills a block in the admin, that block starts rendering from the database.
 */
export function useContent(pageSlug: string) {
    const bag = (usePage().props as { pageContent?: Record<string, any> }).pageContent ?? {};
    const page = bag[pageSlug] ?? {};

    return function pc<T = string>(section: string, key: string, fallback: T): T {
        const v = page?.[section]?.[key];
        return v === undefined || v === null || v === '' ? fallback : (v as T);
    };
}

/** Deep-merge `source` over `base` (plain objects recurse; arrays/scalars from source win). */
function deepMerge<T>(base: T, source: unknown): T {
    if (source === undefined || source === null) return base;
    if (
        typeof base !== 'object' || base === null || Array.isArray(base) ||
        typeof source !== 'object' || source === null || Array.isArray(source)
    ) {
        // Non-mergeable: source overrides, but skip empty strings so blanks fall back.
        return (source === '' ? base : (source as T));
    }
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(source as Record<string, unknown>)) {
        out[k] = deepMerge((base as Record<string, unknown>)[k], v);
    }
    return out as T;
}

/**
 * Whole-page copy override, fallback-safe. Deep-merges the page's DB copy (the `pageCopy`
 * prop passed by the route, locale-resolved) over the page's inline `COPY`, so ANY text
 * becomes editable while missing keys keep the code value. Wire a page with a single line:
 *
 *   const c = usePageCopy('kurumsal', COPY[useLocale()]);
 *
 * With no DB copy, returns the inline COPY unchanged (page renders identically).
 */
export function usePageCopy<T>(_pageSlug: string, inlineCopy: T): T {
    const dbCopy = (usePage().props as { pageCopy?: unknown }).pageCopy;
    return deepMerge(inlineCopy, dbCopy);
}
