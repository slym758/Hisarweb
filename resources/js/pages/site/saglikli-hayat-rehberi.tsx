import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, ChevronDown, Search, X } from 'lucide-react';

import { useAnimatedPlaceholder } from '@/hooks/useAnimatedPlaceholder';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';
import { normalizeTr, useBlogPosts } from '@/lib/site-data';

const COPY = {
    tr: {
        head: {
            title: 'Sağlıklı Hayat Rehberi — Hisar Hospital',
            description: 'Uzman hekimlerimizden hastalıklar, tedaviler, modern yöntemler ve sağlıklı yaşam üzerine güvenilir içerikler.',
        },
        suggestions: ['Beslenme', 'Kalp sağlığı', 'Retina Dekolmanı', 'Gebelik', 'Uyku'],
        title: 'Sağlıklı Hayat Rehberi',
        subtitle: 'Uzman hekimlerimizden hastalıklar, tedaviler ve modern yöntemler hakkında güvenilir bilgi.',
        searchPlaceholder: (typed: string) => `Rehber içeriği ara — ${typed}`,
        searchAria: 'Rehber içeriği ara',
        clear: 'Temizle',
        allCategories: 'Tüm Kategoriler',
        sortAria: 'Sıralama',
        newest: 'En Yeni',
        popular: 'En Popüler',
        countSuffix: (n: number) => `${n} rehber içeriği listeleniyor`,
        empty: 'Aramanıza uygun içerik bulunamadı.',
        readMore: 'Devamını oku',
    },
    en: {
        head: {
            title: 'Healthy Living Guide — Hisar Hospital',
            description: 'Reliable content from our expert physicians on diseases, treatments, modern methods and healthy living.',
        },
        suggestions: ['Nutrition', 'Heart health', 'Retinal Detachment', 'Pregnancy', 'Sleep'],
        title: 'Healthy Living Guide',
        subtitle: 'Reliable information from our expert physicians on diseases, treatments and modern methods.',
        searchPlaceholder: (typed: string) => `Search guide content — ${typed}`,
        searchAria: 'Search guide content',
        clear: 'Clear',
        allCategories: 'All Categories',
        sortAria: 'Sort',
        newest: 'Newest',
        popular: 'Most Popular',
        countSuffix: (n: number) => `${n} guide articles listed`,
        empty: 'No content matches your search.',
        readMore: 'Read more',
    },
} as const;

export default function SaglikliHayatRehberi() {
    const locale = useLocale();
    const c = usePageCopy('saglikli-hayat-rehberi', COPY[locale]);
    const lp = useLocalizedPath();
    const blogPosts = useBlogPosts();
    const [q, setQ] = useState('');
    const [cat, setCat] = useState('all');
    const [tab, setTab] = useState<'yeni' | 'populer'>('yeni');
    const typed = useAnimatedPlaceholder(c.suggestions, !q);

    const categories = useMemo(
        () => Array.from(new Set(blogPosts.map((g) => g.category))).sort((a, b) => a.localeCompare(b, 'tr')),
        [blogPosts],
    );

    const filtered = useMemo(() => {
        const nq = normalizeTr(q.trim());
        const base = blogPosts.filter((g) => {
            if (cat !== 'all' && g.category !== cat) return false;
            if (!nq) return true;
            return normalizeTr(`${g.title} ${g.excerpt ?? ''} ${g.category}`).includes(nq);
        });
        // Static ordering: "yeni" = default, "populer" = reversed for variety.
        return tab === 'populer' ? [...base].reverse() : base;
    }, [q, cat, tab, blogPosts]);

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/saglikli-hayat-rehberi" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/saglikli-hayat-rehberi" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/saglikli-hayat-rehberi" />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 via-surface to-background border-b border-border/60">
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_55%)]" aria-hidden />
                <div className="container-x relative py-6 lg:py-12 text-center">
                    <h1 className="text-xl lg:text-4xl font-black tracking-tight text-primary">{c.title}</h1>
                    <p className="mx-auto mt-1.5 lg:mt-2 max-w-xl text-xs lg:text-sm text-muted-foreground">
                        {c.subtitle}
                    </p>

                    <div className="mx-auto mt-4 lg:mt-6 max-w-3xl grid gap-2 sm:grid-cols-[1fr_240px]">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={c.searchPlaceholder(typed)}
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
                        <div className="relative">
                            <select
                                value={cat}
                                onChange={(e) => setCat(e.target.value)}
                                className="w-full rounded-full bg-card border border-border h-11 px-4 pr-10 text-sm text-foreground outline-none focus:border-primary/40 shadow-sm appearance-none"
                            >
                                <option value="all">{c.allCategories}</option>
                                {categories.map((category) => (<option key={category} value={category}>{category}</option>))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        <div role="tablist" aria-label={c.sortAria} className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
                            <button role="tab" aria-selected={tab === 'yeni'} onClick={() => setTab('yeni')} className={`h-8 rounded-full px-3.5 text-[12px] font-bold transition ${tab === 'yeni' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-primary-soft/60'}`}>{c.newest}</button>
                            <button role="tab" aria-selected={tab === 'populer'} onClick={() => setTab('populer')} className={`h-8 rounded-full px-3.5 text-[12px] font-bold transition ${tab === 'populer' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-primary-soft/60'}`}>{c.popular}</button>
                        </div>
                    </div>

                    <div className="mt-3 lg:mt-4 inline-flex items-center gap-2 text-[11px] lg:text-xs text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{c.countSuffix(filtered.length)}</span>
                    </div>
                </div>
            </section>

            <section className="py-8 lg:py-14 bg-surface/40 pb-[calc(var(--bottom-nav-h)+3rem)] lg:pb-16">
                <div className="container-x">
                    {filtered.length === 0 ? (
                        <p className="text-center text-muted-foreground py-20">{c.empty}</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((g) => (
                                <article
                                    key={g.slug}
                                    className="group hover-lift overflow-hidden rounded-2xl border border-border/70 bg-card"
                                >
                                    <Link
                                        href={lp('/saglikli-hayat-rehberi/' + g.slug)}
                                        className="block"
                                    >
                                        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
                                            <img
                                                src={g.cover}
                                                alt={g.title}
                                                loading="lazy"
                                                className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition duration-500"
                                            />

                                            <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-primary">
                                                {g.category}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-[15px] font-bold text-primary leading-snug group-hover:text-brand-orange transition line-clamp-2">
                                                {g.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{g.excerpt}</p>
                                            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-orange">
                                                {c.readMore} <ArrowRight className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

SaglikliHayatRehberi.layout = siteLayout;
