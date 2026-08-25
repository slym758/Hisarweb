/**
 * Site-wide content relation layer.
 *
 * All relations are slug-based; no fuzzy text matching or "#" links are used.
 * Every relation resolves to a real route:
 *  - /bolum/$slug, /doktor/$id, /tedavi/$slug, /hastalik/$slug,
 *    /teknoloji/$slug, /videolar, /saglikli-hayat-rehberi/$slug
 *
 * Framework-agnostic: no React/router imports. Consumers pass the active
 * `Locale` (mirrors the `get*(l)` resolvers in `site-data`).
 */
import {
    getBlogPosts,
    getDepartments,
    getDiseases,
    getDoctorsForDept,
    getTechnologies,
    getTreatmentsForDept,
    getVideos,
    normalizeTr,
    type BlogPost,
    type Department,
    type Disease,
    type Doctor,
    type Technology,
    type Treatment,
    type Video,
} from '@/lib/site-data';
import type { Locale } from '@/lib/i18n';

/** Resolve a blog category to a department slug (category is a dept slug in the data model). */
export function getDeptSlugFromCategory(category: string, departments: Department[]): string | null {
    const bySlug = departments.find((d) => d.slug === category);
    if (bySlug) return bySlug.slug;
    const norm = normalizeTr(category);
    const byName = departments.find(
        (d) => normalizeTr(d.name).includes(norm) || norm.includes(normalizeTr(d.name)),
    );
    return byName?.slug ?? null;
}

/** Blog post → department slug resolution. */
export function getDeptSlugForPost(post: BlogPost, locale: Locale = 'tr'): string | null {
    return getDeptSlugFromCategory(post.category, getDepartments(locale));
}

export type DeptRelations = {
    deptSlug: string;
    deptName: string;
    doctors: Doctor[];
    treatments: Treatment[];
    diseases: Disease[];
    technologies: Technology[];
    videos: Video[];
    articles: BlogPost[];
};

/** Gathers every related content item around a department slug. */
export function getRelations(
    deptSlug: string | null,
    locale: Locale,
    opts: { excludeBlogSlug?: string; limit?: number } = {},
): DeptRelations | null {
    if (!deptSlug) return null;
    const departments = getDepartments(locale);
    const dept = departments.find((d) => d.slug === deptSlug);
    if (!dept) return null;
    const limit = opts.limit ?? 6;
    const articles = getBlogPosts(locale)
        .filter((p) => getDeptSlugFromCategory(p.category, departments) === deptSlug)
        .filter((p) => p.slug !== opts.excludeBlogSlug)
        .slice(0, limit);
    return {
        deptSlug,
        deptName: dept.name,
        doctors: getDoctorsForDept(deptSlug, locale).slice(0, limit),
        treatments: getTreatmentsForDept(deptSlug, locale).slice(0, limit),
        diseases: getDiseases(locale).filter((d) => d.deptSlug === deptSlug).slice(0, limit),
        technologies: getTechnologies(locale).filter((t) => t.deptSlugs.includes(deptSlug)).slice(0, limit),
        videos: getVideos(locale).filter((v) => v.deptSlug === deptSlug).slice(0, limit),
        articles,
    };
}
