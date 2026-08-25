import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Search, X, ArrowRight, HeartPulse, Filter, ChevronDown } from 'lucide-react';

import { siteLayout } from '@/layouts/site-layout';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { useDepartments, useDiseases, normalizeTr } from '@/lib/site-data';
import { useAnimatedPlaceholder } from '@/hooks/use-animated-placeholder';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Hastalıklar — Hisar Hospital',
            description: 'Sık karşılaşılan hastalıklar, belirtileri ve tedavi yaklaşımları için Hisar Hospital hastalık rehberi.',
            ogTitle: 'Hastalıklar — Hisar Hospital',
            ogDescription: 'Hastalık rehberi: belirtiler, tanı ve tedavi yöntemleri.',
        },
        breadcrumb: 'Hastalıklar',
        title: 'Hastalıklar',
        subtitle: 'Belirtileri, nedenleri ve tedavi seçenekleriyle hastalıklar hakkında güvenilir bilgi.',
        searchPlaceholder: 'Hastalık ara',
        searchAria: 'Hastalık ara',
        clear: 'Temizle',
        allDepartments: 'Tüm Bölümler',
        filter: 'Filtre',
        alphabetAll: 'Tümü',
        countLabel: 'hastalık',
        empty: 'Aramanıza uygun hastalık bulunamadı.',
        clearFilters: 'Filtreleri Temizle',
        loadMore: 'Daha Fazla Göster',
        suggestions: ['Retina Dekolmanı', 'Kolesistit', 'Migren', 'Bel Fıtığı', 'Hipertansiyon'],
    },
    en: {
        head: {
            title: 'Diseases — Hisar Hospital',
            description: "Hisar Hospital's disease guide for common conditions, their symptoms and treatment approaches.",
            ogTitle: 'Diseases — Hisar Hospital',
            ogDescription: 'Disease guide: symptoms, diagnosis and treatment methods.',
        },
        breadcrumb: 'Diseases',
        title: 'Diseases',
        subtitle: 'Reliable information about conditions, with their symptoms, causes and treatment options.',
        searchPlaceholder: 'Search a disease',
        searchAria: 'Search a disease',
        clear: 'Clear',
        allDepartments: 'All Departments',
        filter: 'Filter',
        alphabetAll: 'All',
        countLabel: 'diseases',
        empty: 'No disease matched your search.',
        clearFilters: 'Clear Filters',
        loadMore: 'Show More',
        suggestions: ['Retinal Detachment', 'Cholecystitis', 'Migraine', 'Herniated Disc', 'Hypertension'],
    },
} as const;

type DiseaseCard = { slug: string; name: string; deptSlug: string; deptName: string };

const ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');

export default function HastaliklarPage() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const departments = useDepartments();
    const diseases = useDiseases();
    const [q, setQ] = useState('');
    const [dept, setDept] = useState('all');
    const [letter, setLetter] = useState<string | null>(null);
    const typed = useAnimatedPlaceholder(c.suggestions as unknown as string[], !q);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const all: DiseaseCard[] = useMemo(() => {
        const deptNameBySlug = new Map(departments.map((d) => [d.slug, d.name]));
        return diseases
            .map((d) => ({
                slug: d.slug,
                name: d.name,
                deptSlug: d.deptSlug,
                deptName: deptNameBySlug.get(d.deptSlug) ?? d.deptSlug,
            }))
            .sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    }, [diseases, departments]);

    const filtered = useMemo(() => {
        const nq = normalizeTr(q.trim());
        return all.filter((it) => {
            if (dept !== 'all' && it.deptSlug !== dept) return false;
            if (letter && it.name[0].toLocaleUpperCase('tr') !== letter) return false;
            if (!nq) return true;
            return normalizeTr(`${it.name} ${it.deptName}`).includes(nq);
        });
    }, [all, q, dept, letter]);

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.ogTitle} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/hastaliklar" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/hastaliklar" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/hastaliklar" />
            </Head>

            <Breadcrumb items={[{ label: c.breadcrumb }]} />

            <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 via-surface to-background border-b border-border/60">
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_55%)]" aria-hidden />
                <div className="container-x relative py-6 lg:py-12 text-center">
                    <h1 className="text-xl lg:text-4xl font-black tracking-tight text-primary">{c.title}</h1>
                    <p className="mx-auto mt-1.5 lg:mt-2 max-w-xl text-xs lg:text-sm text-muted-foreground">
                        {c.subtitle}
                    </p>

                    <div className="mx-auto mt-4 lg:mt-6 max-w-4xl grid gap-2 sm:grid-cols-[1fr_200px]">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={`${c.searchPlaceholder} — ${typed}`}
                                aria-label={c.searchAria}
                                className="w-full rounded-full bg-card border border-border h-11 pl-11 pr-10 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 shadow-sm"
                            />
                            {q && (
                                <button
                                    onClick={() => setQ('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
                                    aria-label={c.clear}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                        <select
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                            className="hidden sm:block rounded-full bg-card border border-border h-11 px-4 text-sm text-foreground outline-none focus:border-primary/40 shadow-sm"
                        >
                            <option value="all">{c.allDepartments}</option>
                            {departments.map((d) => (
                                <option key={d.slug} value={d.slug}>{d.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setFiltersOpen((v) => !v)}
                            className="sm:hidden inline-flex items-center justify-center gap-1.5 rounded-full bg-card border border-border h-11 px-4 text-sm font-semibold text-primary"
                        >
                            <Filter className="h-4 w-4" /> {c.filter}
                            <ChevronDown className={`h-4 w-4 transition ${filtersOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {filtersOpen && (
                        <div className="sm:hidden mt-3 max-w-4xl mx-auto">
                            <select
                                value={dept}
                                onChange={(e) => setDept(e.target.value)}
                                className="w-full rounded-full bg-card border border-border h-11 px-4 text-sm shadow-sm"
                            >
                                <option value="all">{c.allDepartments}</option>
                                {departments.map((d) => (
                                    <option key={d.slug} value={d.slug}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Alphabet filter */}
                    <div className="mx-auto mt-4 max-w-4xl flex gap-1 flex-wrap justify-center">
                        <button
                            onClick={() => setLetter(null)}
                            className={`h-8 min-w-8 px-2 text-[12px] font-bold rounded-full border transition ${
                                !letter ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-primary hover:border-primary/40'
                            }`}
                        >
                            {c.alphabetAll}
                        </button>
                        {ALPHABET.map((l) => {
                            const hasAny = all.some((it) => it.name[0].toLocaleUpperCase('tr') === l);
                            return (
                                <button
                                    key={l}
                                    disabled={!hasAny}
                                    onClick={() => setLetter(letter === l ? null : l)}
                                    className={`h-8 w-8 text-[12px] font-bold rounded-full border transition ${
                                        letter === l
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : hasAny
                                            ? 'bg-card border-border text-primary hover:border-primary/40'
                                            : 'bg-muted/50 border-border/50 text-muted-foreground/50 cursor-not-allowed'
                                    }`}
                                >
                                    {l}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 lg:mt-4 inline-flex items-center gap-2 text-[11px] lg:text-xs text-muted-foreground">
                        <HeartPulse className="h-3.5 w-3.5" />
                        <span>{filtered.length} {c.countLabel}</span>
                    </div>
                </div>
            </section>

            <section className="py-8 lg:py-14 bg-surface/40 pb-[calc(var(--bottom-nav-h)+3rem)] lg:pb-16">
                <div className="container-x">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground">{c.empty}</p>
                            <button
                                onClick={() => { setQ(''); setDept('all'); setLetter(null); }}
                                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
                            >
                                {c.clearFilters}
                            </button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {filtered.map((it) => (
                                <Link
                                    key={`${it.deptSlug}-${it.name}`}
                                    href={lp('/hastalik/' + it.slug)}
                                    className="group rounded-2xl border border-border/70 bg-card p-4 lg:p-5 hover:border-primary/30 hover:shadow-card transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="h-10 w-10 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0">
                                            <HeartPulse className="h-5 w-5" strokeWidth={1.5} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-[14.5px] font-bold text-primary leading-tight group-hover:text-brand-orange transition">
                                                {it.name}
                                            </h3>
                                            <p className="mt-0.5 text-[12px] text-muted-foreground truncate">{it.deptName}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-orange group-hover:translate-x-0.5 transition" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {filtered.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <button className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary hover:border-primary/40 transition">
                                {c.loadMore}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

HastaliklarPage.layout = siteLayout;
