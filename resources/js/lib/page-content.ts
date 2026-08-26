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
