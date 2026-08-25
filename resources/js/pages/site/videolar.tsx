import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Play, Search, X, Clock } from 'lucide-react';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { useAnimatedPlaceholder } from '@/hooks/useAnimatedPlaceholder';
import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale } from '@/lib/i18n';
import { useDepartments, useVideos, type Video } from '@/lib/site-data';

/** Video enriched with its resolved (localized) department name. */
type VideoRow = Video & { department: string };

const COPY = {
    tr: {
        head: {
            title: 'Videolar — Hisar Hospital',
            description: 'Uzman hekimlerimizden tedavi, rehabilitasyon ve sağlıklı yaşam üzerine bilgilendirici videolar.',
        },
        suggestions: ['Da Vinci', 'Katarakt', 'Diz protezi', 'Obezite', 'Gebelik'],
        pageTitle: 'Videolar',
        pageSubtitle: 'Uzman hekimlerimizden bilgilendirici videolar.',
        crumbHasta: 'Hasta Rehberi',
        crumbSelf: 'Videolar',
        searchPlaceholder: (typed: string) => `Video ara — ${typed}`,
        searchAria: 'Video ara',
        deptAria: 'Bölüm',
        catAria: 'Kategori',
        allDepts: 'Tüm bölümler',
        allCats: 'Tüm kategoriler',
        featured: 'ÖNE ÇIKAN',
        close: 'Kapat',
        playerPreview: 'Video oynatıcı önizlemesi (prototip)',
    },
    en: {
        head: {
            title: 'Videos — Hisar Hospital',
            description: 'Informative videos from our expert physicians on treatment, rehabilitation and healthy living.',
        },
        suggestions: ['Da Vinci', 'Cataract', 'Knee replacement', 'Obesity', 'Pregnancy'],
        pageTitle: 'Videos',
        pageSubtitle: 'Informative videos from our expert physicians.',
        crumbHasta: 'Patient Guide',
        crumbSelf: 'Videos',
        searchPlaceholder: (typed: string) => `Search video — ${typed}`,
        searchAria: 'Search video',
        deptAria: 'Department',
        catAria: 'Category',
        allDepts: 'All departments',
        allCats: 'All categories',
        featured: 'FEATURED',
        close: 'Close',
        playerPreview: 'Video player preview (prototype)',
    },
} as const;

export default function Videolar() {
    const locale = useLocale();
    const c = COPY[locale];
    const rawVideos = useVideos();
    const departmentsList = useDepartments();

    const videos: VideoRow[] = useMemo(
        () => rawVideos.map((v) => ({ ...v, department: departmentsList.find((d) => d.slug === v.deptSlug)?.name ?? '' })),
        [rawVideos, departmentsList],
    );

    // Initial modal video from the `?v=<id>` query param (Inertia URL).
    const url = usePage().url;
    const initialId = new URLSearchParams(url.split('?')[1] ?? '').get('v') ?? undefined;

    const [q, setQ] = useState('');
    const [dept, setDept] = useState<'all' | string>('all');
    const [cat, setCat] = useState<'all' | string>('all');
    const [modal, setModal] = useState<VideoRow | null>(
        () => videos.find((x) => x.id === initialId) ?? null,
    );
    const typed = useAnimatedPlaceholder(c.suggestions, !q);

    const depts = useMemo(() => Array.from(new Set(videos.map((v) => v.department))), [videos]);
    const cats = useMemo(() => Array.from(new Set(videos.map((v) => v.category))), [videos]);

    const filtered = videos.filter((v) => {
        if (dept !== 'all' && v.department !== dept) return false;
        if (cat !== 'all' && v.category !== cat) return false;
        if (q && !v.title.toLocaleLowerCase(locale).includes(q.toLocaleLowerCase(locale))) return false;
        return true;
    });

    // The source data had a `featured` flag; the content-data model does not, so
    // the first video stands in as the featured highlight.
    const featured = videos[0];

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/videolar" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/videolar" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/videolar" />
            </Head>

            <PageHeader title={c.pageTitle} subtitle={c.pageSubtitle} />
            <Breadcrumb items={[{ label: c.crumbHasta }, { label: c.crumbSelf }]} />

            <section className="py-8 lg:py-12">
                <div className="container-x space-y-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
                            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.searchPlaceholder(typed)} aria-label={c.searchAria} className="w-full h-11 rounded-full border border-border/70 bg-background pl-10 pr-4 text-sm" />
                        </div>
                        <select value={dept} onChange={(e) => setDept(e.target.value)} aria-label={c.deptAria} className="h-11 rounded-full border border-border/70 bg-background px-4 text-sm">
                            <option value="all">{c.allDepts}</option>
                            {depts.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label={c.catAria} className="h-11 rounded-full border border-border/70 bg-background px-4 text-sm">
                            <option value="all">{c.allCats}</option>
                            {cats.map((category) => <option key={category} value={category}>{category}</option>)}
                        </select>
                    </div>

                    {featured && (
                        <button onClick={() => setModal(featured)} className="group w-full text-left rounded-3xl border border-border/70 bg-gradient-card overflow-hidden grid lg:grid-cols-2">
                            <div className="relative aspect-video lg:aspect-auto bg-primary/90 grid place-items-center">
                                <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-orange text-brand-orange-foreground shadow-orange group-hover:scale-105 transition"><Play className="h-6 w-6" aria-hidden /></span>
                                <span className="absolute top-3 left-3 rounded-full bg-brand-orange px-2.5 py-0.5 text-[10px] font-bold text-brand-orange-foreground">{c.featured}</span>
                                <span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-bold text-primary inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden />{featured.duration}</span>
                            </div>
                            <div className="p-6 lg:p-10 flex flex-col justify-center">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">{featured.category}</span>
                                <h2 className="mt-2 text-xl lg:text-2xl font-black text-primary">{featured.title}</h2>
                                <p className="mt-2 text-sm text-muted-foreground">{featured.department}</p>
                            </div>
                        </button>
                    )}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.filter((v) => v.id !== featured?.id).map((v) => (
                            <button key={v.id} onClick={() => setModal(v)} className="text-left hover-lift rounded-2xl border border-border/70 bg-card overflow-hidden">
                                <div className="relative aspect-video bg-primary-soft/60 grid place-items-center">
                                    <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-orange text-brand-orange-foreground shadow-orange"><Play className="h-5 w-5" aria-hidden /></span>
                                    <span className="absolute bottom-2 right-2 rounded-full bg-background/95 px-2 py-0.5 text-[11px] font-bold text-primary inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden />{v.duration}</span>
                                </div>
                                <div className="p-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">{v.category}</span>
                                    <h3 className="mt-1 text-sm font-bold text-primary leading-snug">{v.title}</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">{v.department}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {modal && (
                <div className="fixed inset-0 z-[150] bg-primary/70 backdrop-blur-sm grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={modal.title} onClick={() => setModal(null)}>
                    <div className="w-full max-w-3xl rounded-2xl bg-background shadow-elevated overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-5 py-3 border-b">
                            <h3 className="text-sm font-bold text-primary truncate">{modal.title}</h3>
                            <button onClick={() => setModal(null)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-primary-soft/60" aria-label={c.close}><X className="h-4 w-4" aria-hidden /></button>
                        </div>
                        <div className="aspect-video bg-primary/95 grid place-items-center text-primary-foreground/80 text-sm">{c.playerPreview}</div>
                        <div className="p-5">
                            <p className="text-xs text-muted-foreground">{modal.department} · {modal.duration}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Videolar.layout = siteLayout;
