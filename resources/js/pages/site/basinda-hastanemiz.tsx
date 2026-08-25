import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Newspaper, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { useAnimatedPlaceholder } from '@/hooks/useAnimatedPlaceholder';
import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { usePress } from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Basında Hastanemiz — Hisar Hospital',
            description: 'Hisar Hospital hakkında ulusal ve uluslararası basında yer alan haberler, röportajlar ve yayınlar.',
        },
        headerTitle: 'Basında Hastanemiz',
        headerSubtitle: "Hisar Hospital'ın ulusal ve uluslararası basındaki yansımaları.",
        crumbKurumsal: 'Kurumsal',
        crumbPress: 'Basında Hastanemiz',
        searchPrefix: 'Haber, yayın veya başlık ara — ',
        searchAria: 'Basın haberi ara',
        allYears: 'Tüm yıllar',
        yearAria: 'Yıl filtresi',
        allPublications: 'Tüm yayınlar',
        publicationAria: 'Kaynak / yayın filtresi',
        readArticle: 'Haberi Oku',
        noResults: 'Filtreye uygun haber bulunamadı.',
        corpTitle: 'Kurumsal İletişim',
        corpDesc: 'Basın talepleriniz, röportaj ve içerik iş birlikleri için bize ulaşın.',
        corpCta: 'İletişime Geç',
        suggestions: ['Da Vinci', 'JCI', 'Onkoloji', 'Kalp', 'Göz'],
    },
    en: {
        head: {
            title: 'Our Hospital in the Press — Hisar Hospital',
            description: 'News, interviews and publications about Hisar Hospital in the national and international press.',
        },
        headerTitle: 'Our Hospital in the Press',
        headerSubtitle: "Hisar Hospital's presence in the national and international press.",
        crumbKurumsal: 'Corporate',
        crumbPress: 'In the Press',
        searchPrefix: 'Search news, publications or titles — ',
        searchAria: 'Search press news',
        allYears: 'All years',
        yearAria: 'Year filter',
        allPublications: 'All publications',
        publicationAria: 'Source / publication filter',
        readArticle: 'Read Article',
        noResults: 'No news matches your filters.',
        corpTitle: 'Corporate Communications',
        corpDesc: 'Reach out for press requests, interviews and content collaborations.',
        corpCta: 'Get in Touch',
        suggestions: ['Da Vinci', 'JCI', 'Oncology', 'Heart', 'Eye'],
    },
} as const;

function formatDate(iso: string, locale: 'tr' | 'en'): string {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(y, m - 1, d));
}

export default function PressPage() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const items = usePress();

    const [year, setYear] = useState<'all' | number>('all');
    const [publication, setPublication] = useState<'all' | string>('all');
    const [q, setQ] = useState('');
    const typed = useAnimatedPlaceholder(c.suggestions as unknown as string[], !q);

    const years = useMemo(() => Array.from(new Set(items.map((i) => Number(i.date.slice(0, 4))))).sort((a, b) => b - a), [items]);
    const publications = useMemo(() => Array.from(new Set(items.map((i) => i.source))), [items]);

    const filtered = items.filter((i) => {
        if (year !== 'all' && Number(i.date.slice(0, 4)) !== year) return false;
        if (publication !== 'all' && i.source !== publication) return false;
        if (q && !(i.title + i.source + i.excerpt).toLocaleLowerCase(locale).includes(q.toLocaleLowerCase(locale))) return false;
        return true;
    });

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/basinda-hastanemiz" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/basinda-hastanemiz" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/basinda-hastanemiz" />
            </Head>

            <PageHeader title={c.headerTitle} subtitle={c.headerSubtitle} />
            <Breadcrumb items={[{ label: c.crumbKurumsal, to: '/kurumsal' }, { label: c.crumbPress }]} />

            <section className="py-8 lg:py-12">
                <div className="container-x">
                    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" aria-hidden />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={`${c.searchPrefix}${typed}`}
                                className="border-border/70 bg-background focus:ring-brand-orange h-11 w-full rounded-full border pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
                                aria-label={c.searchAria}
                            />
                        </div>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="border-border/70 bg-background h-11 rounded-full border px-4 text-sm"
                            aria-label={c.yearAria}
                        >
                            <option value="all">{c.allYears}</option>
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                        <select
                            value={publication}
                            onChange={(e) => setPublication(e.target.value)}
                            className="border-border/70 bg-background h-11 rounded-full border px-4 text-sm"
                            aria-label={c.publicationAria}
                        >
                            <option value="all">{c.allPublications}</option>
                            {publications.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((p) => (
                            <Link
                                key={p.slug}
                                href={lp('/basinda-hastanemiz/' + p.slug)}
                                aria-label={`${p.title} — ${p.source}`}
                                className="group hover-lift border-border/70 bg-gradient-card focus-visible:ring-brand-orange/60 flex flex-col overflow-hidden rounded-2xl border focus-visible:ring-2 focus-visible:outline-none"
                            >
                                <div className="bg-primary-soft/60 relative grid aspect-[16/9] place-items-center">
                                    <Newspaper className="text-primary/60 h-10 w-10" aria-hidden />
                                    <span className="bg-background/95 text-primary absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm">
                                        {p.source}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-primary group-hover:text-brand-orange mt-2 text-[15px] leading-snug font-bold transition">
                                        {p.title}
                                    </h3>
                                    <p className="text-muted-foreground mt-2 flex-1 text-xs">{p.excerpt}</p>
                                    <div className="mt-4 flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground inline-flex items-center gap-1">
                                            <Calendar className="h-3 w-3" aria-hidden /> {formatDate(p.date, locale)}
                                        </span>
                                        <span className="text-brand-orange inline-flex items-center gap-1 font-bold">
                                            {c.readArticle} <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filtered.length === 0 && <p className="text-muted-foreground py-16 text-center text-sm">{c.noResults}</p>}

                    <div className="border-border/70 bg-primary text-primary-foreground mt-10 flex flex-col justify-between gap-4 rounded-2xl border p-6 lg:flex-row lg:items-center lg:p-8">
                        <div>
                            <h3 className="text-lg font-bold">{c.corpTitle}</h3>
                            <p className="text-primary-foreground/80 mt-1 text-sm">{c.corpDesc}</p>
                        </div>
                        <a
                            href="mailto:kurumsal.iletisim@hisarhospital.com"
                            className="bg-brand-orange text-brand-orange-foreground inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold"
                        >
                            {c.corpCta}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}

PressPage.layout = siteLayout;
