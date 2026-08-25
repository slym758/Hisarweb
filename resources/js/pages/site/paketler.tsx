import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, ChevronRight, Home, Package } from 'lucide-react';

import { siteLayout, PageHeader } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { usePackages } from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Paketler & Check-Up — Hisar Hospital',
            description: 'Hisar Hospital paketleri ve check-up seçenekleri: genel, kadın, erkek ve doğum paketleri.',
            ogDescription: 'Sağlığınızı proaktif olarak değerlendiren check-up ve paket seçenekleri.',
        },
        home: 'Anasayfa',
        crumb: 'Paketler & Check-Up',
        pageTitle: 'Paketler & Check-Up',
        pageSubtitle: 'Sağlığınızı proaktif olarak takip edebilmeniz için hazırlanmış kapsamlı paketler.',
        badge: 'Paket',
        explore: 'İncele',
    },
    en: {
        head: {
            title: 'Packages & Check-Up — Hisar Hospital',
            description: 'Hisar Hospital packages and check-up options: general, women’s, men’s and birth packages.',
            ogDescription: 'Check-up and package options that proactively assess your health.',
        },
        home: 'Home',
        crumb: 'Packages & Check-Up',
        pageTitle: 'Packages & Check-Up',
        pageSubtitle: 'Comprehensive packages designed so you can track your health proactively.',
        badge: 'Package',
        explore: 'Explore',
    },
} as const;

export default function Packages() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const packages = usePackages();

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.title} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/paketler" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/paketler" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/paketler" />
            </Head>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="border-b border-border/60 bg-surface/50">
                <div className="container-x py-3 flex items-center gap-1.5 text-[12px] lg:text-[13px] text-muted-foreground overflow-x-auto scrollbar-thin">
                    <Link href={lp('/')} className="inline-flex items-center gap-1 hover:text-primary transition">
                        <Home className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{c.home}</span>
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="text-primary font-semibold whitespace-nowrap truncate max-w-[45vw]">{c.crumb}</span>
                </div>
            </nav>

            <PageHeader title={c.pageTitle} subtitle={c.pageSubtitle} />

            <section className="container-x py-8 lg:py-14 pb-[calc(var(--bottom-nav-h)+3rem)] lg:pb-16">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {packages.map((p) => (
                        <Link
                            key={p.slug}
                            href={lp('/paketler/' + p.slug)}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card hover:border-primary/30 hover:shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                {/* TODO: real asset — cover comes from content-data (temporary Unsplash imagery). */}
                                <img
                                    src={p.cover}
                                    alt={p.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500"
                                />
                                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10.5px] font-bold text-primary">
                                    <Package className="h-3 w-3" /> {c.badge}
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col p-4 lg:p-5">
                                <h3 className="text-[15.5px] font-bold text-primary leading-tight group-hover:text-brand-orange transition">
                                    {p.name}
                                </h3>
                                <ul className="mt-3 space-y-1.5 flex-1">
                                    {p.scope.slice(0, 3).map((h) => (
                                        <li key={h} className="flex items-start gap-1.5 text-[12.5px] text-muted-foreground">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                                            <span>{h}</span>
                                        </li>
                                    ))}
                                </ul>
                                <span className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground h-10 text-[13px] font-semibold group-hover:opacity-95 transition">
                                    {c.explore} <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}

Packages.layout = siteLayout;
