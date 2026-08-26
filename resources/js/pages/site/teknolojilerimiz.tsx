import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Search, X, ArrowRight, Cpu, Filter, ChevronDown } from 'lucide-react';

import { siteLayout } from '@/layouts/site-layout';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';
import { useDepartments, useTechnologies, normalizeTr } from '@/lib/site-data';
import { useAnimatedPlaceholder } from '@/hooks/use-animated-placeholder';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Teknolojilerimiz — Hisar Hospital',
            description: "Hisar Hospital'da kullanılan ileri medikal teknolojiler, cihazlar ve tanı-tedavi sistemleri.",
            ogTitle: 'Teknolojilerimiz — Hisar Hospital',
            ogDescription: 'Da Vinci, MR-LINAC, 3T MR, PET-CT ve daha fazlası.',
        },
        breadcrumb: 'Teknolojilerimiz',
        title: 'Teknolojilerimiz',
        subtitle: 'Tanıdan tedaviye; hasta güvenliği ve etkinliği yüksek klinik teknolojiler.',
        searchPlaceholder: 'Teknoloji veya cihaz ara',
        searchAria: 'Teknoloji veya cihaz ara',
        clear: 'Temizle',
        allDepartments: 'Tüm Bölümler',
        allHospitals: 'Tüm Hastaneler',
        filter: 'Filtre',
        countLabel: 'teknoloji',
        empty: 'Aramanıza uygun teknoloji bulunamadı.',
        cardCta: 'Teknolojiyi İncele',
        loadMore: 'Daha Fazla Göster',
        suggestions: ['Da Vinci', 'MR-LINAC', '3T MR', 'PET-CT', 'SMILE Pro'],
    },
    en: {
        head: {
            title: 'Our Technologies — Hisar Hospital',
            description: 'Advanced medical technologies, devices and diagnostic-treatment systems used at Hisar Hospital.',
            ogTitle: 'Our Technologies — Hisar Hospital',
            ogDescription: 'Da Vinci, MR-LINAC, 3T MR, PET-CT and more.',
        },
        breadcrumb: 'Our Technologies',
        title: 'Our Technologies',
        subtitle: 'From diagnosis to treatment; clinical technologies with high patient safety and efficacy.',
        searchPlaceholder: 'Search a technology or device',
        searchAria: 'Search a technology or device',
        clear: 'Clear',
        allDepartments: 'All Departments',
        allHospitals: 'All Hospitals',
        filter: 'Filter',
        countLabel: 'technologies',
        empty: 'No technology matched your search.',
        cardCta: 'Explore Technology',
        loadMore: 'Show More',
        suggestions: ['Da Vinci', 'MR-LINAC', '3T MR', 'PET-CT', 'SMILE Pro'],
    },
} as const;

/* Proper-noun hospital labels (locale-independent). */
const hospitalNames: Record<string, string> = {
    intercontinental: 'Intercontinental',
    camlica: 'Çamlıca',
};

export default function TekPage() {
    const locale = useLocale();
    const c = usePageCopy('teknolojilerimiz', COPY[locale]);
    const lp = useLocalizedPath();
    const departments = useDepartments();
    const technologies = useTechnologies();
    const [q, setQ] = useState('');
    const [dept, setDept] = useState('all');
    const [hospital, setHospital] = useState('all');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const typed = useAnimatedPlaceholder(c.suggestions as unknown as string[], !q);

    // The Technology content model has no hospital relation; mirror the source data
    // (every technology hosted at Intercontinental) so the hospital filter/pill behave
    // identically. Replace with a real relation when the model gains one.
    const techs = useMemo(
        () => technologies.map((t) => ({ ...t, deptSlug: t.deptSlugs[0], hospitalSlug: 'intercontinental' as const })),
        [technologies],
    );

    const filtered = useMemo(() => {
        const nq = normalizeTr(q.trim());
        return techs.filter((t) => {
            if (dept !== 'all' && !t.deptSlugs.includes(dept)) return false;
            if (hospital !== 'all' && t.hospitalSlug !== hospital) return false;
            if (!nq) return true;
            return normalizeTr(`${t.name} ${t.desc}`).includes(nq);
        });
    }, [techs, q, dept, hospital]);

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.ogTitle} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/teknolojilerimiz" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/teknolojilerimiz" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/teknolojilerimiz" />
            </Head>

            <Breadcrumb items={[{ label: c.breadcrumb }]} />

            <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 via-surface to-background border-b border-border/60">
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_55%)]" aria-hidden />
                <div className="container-x relative py-6 lg:py-12 text-center">
                    <h1 className="text-xl lg:text-4xl font-black tracking-tight text-primary">{c.title}</h1>
                    <p className="mx-auto mt-1.5 lg:mt-2 max-w-xl text-xs lg:text-sm text-muted-foreground">
                        {c.subtitle}
                    </p>

                    <div className="mx-auto mt-4 lg:mt-6 max-w-4xl grid gap-2 sm:grid-cols-[1fr_180px_180px]">
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
                        <select
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                            className="hidden sm:block rounded-full bg-card border border-border h-11 px-4 text-sm text-foreground outline-none focus:border-primary/40 shadow-sm"
                        >
                            <option value="all">{c.allHospitals}</option>
                            <option value="intercontinental">Intercontinental</option>
                            <option value="camlica">Çamlıca</option>
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
                        <div className="sm:hidden mt-3 max-w-4xl mx-auto grid gap-2">
                            <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full rounded-full bg-card border border-border h-11 px-4 text-sm">
                                <option value="all">{c.allDepartments}</option>
                                {departments.map((d) => (<option key={d.slug} value={d.slug}>{d.name}</option>))}
                            </select>
                            <select value={hospital} onChange={(e) => setHospital(e.target.value)} className="w-full rounded-full bg-card border border-border h-11 px-4 text-sm">
                                <option value="all">{c.allHospitals}</option>
                                <option value="intercontinental">Intercontinental</option>
                                <option value="camlica">Çamlıca</option>
                            </select>
                        </div>
                    )}

                    <div className="mt-3 lg:mt-4 inline-flex items-center gap-2 text-[11px] lg:text-xs text-muted-foreground">
                        <Cpu className="h-3.5 w-3.5" />
                        <span>{filtered.length} {c.countLabel}</span>
                    </div>
                </div>
            </section>

            <section className="py-8 lg:py-14 bg-surface/40 pb-[calc(var(--bottom-nav-h)+3rem)] lg:pb-16">
                <div className="container-x">
                    {filtered.length === 0 ? (
                        <p className="text-center text-muted-foreground py-20">{c.empty}</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((t) => {
                                const dep = departments.find((d) => d.slug === t.deptSlug);
                                const isDaVinci = t.slug === 'da-vinci-robotik-cerrahi';
                                const card = (
                                    <>
                                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                            <img src={t.cover} alt={t.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                                            {/* TODO: real asset */}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-[15px] font-black text-primary leading-snug">{t.name}</h3>
                                            <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed line-clamp-2">{t.desc}</p>
                                            <div className="mt-3 flex flex-wrap gap-1.5 text-[11.5px]">
                                                {dep && (
                                                    <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-primary/80">
                                                        {dep.name}
                                                    </span>
                                                )}
                                                <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-primary/80">
                                                    Hisar {hospitalNames[t.hospitalSlug]}
                                                </span>
                                            </div>
                                            <div className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-orange group-hover:translate-x-0.5 transition">
                                                {c.cardCta} <ArrowRight className="h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                    </>
                                );
                                return isDaVinci ? (
                                    <Link
                                        key={t.slug}
                                        href={lp('/teknoloji/' + t.slug)}
                                        className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card hover-lift"
                                    >
                                        {card}
                                    </Link>
                                ) : (
                                    <Link
                                        key={t.slug}
                                        href={lp('/teknoloji/' + t.slug)}
                                        className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card hover-lift"
                                    >
                                        {card}
                                    </Link>
                                );
                            })}
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

TekPage.layout = siteLayout;
