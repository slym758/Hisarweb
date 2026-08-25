import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { useEvents } from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Etkinlikler — Hisar Hospital',
            description: 'Hisar Hospital tarafından düzenlenen sağlık farkındalık etkinlikleri, eğitimler ve toplantılar.',
        },
        headerTitle: 'Etkinlikler',
        headerSubtitle: 'Sağlık farkındalık günleri, eğitimler ve topluluk etkinliklerimiz.',
        crumbKurumsal: 'Kurumsal',
        crumbEvents: 'Etkinlikler',
        viewDetails: 'Detayları gör',
    },
    en: {
        head: {
            title: 'Events — Hisar Hospital',
            description: 'Health awareness events, trainings and meetings organized by Hisar Hospital.',
        },
        headerTitle: 'Events',
        headerSubtitle: 'Our health awareness days, trainings and community events.',
        crumbKurumsal: 'Corporate',
        crumbEvents: 'Events',
        viewDetails: 'View details',
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

export default function EventsPage() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const events = useEvents();

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/etkinlikler" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/etkinlikler" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/etkinlikler" />
            </Head>

            <PageHeader title={c.headerTitle} subtitle={c.headerSubtitle} />
            <Breadcrumb items={[{ label: c.crumbKurumsal, to: '/kurumsal' }, { label: c.crumbEvents }]} />

            <section className="py-10 lg:py-14">
                <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((e) => (
                        <Link
                            key={e.slug}
                            href={lp('/etkinlikler/' + e.slug)}
                            aria-label={e.title}
                            className="group border-border/70 bg-card hover-lift focus-visible:ring-brand-orange/60 overflow-hidden rounded-2xl border focus-visible:ring-2 focus-visible:outline-none"
                        >
                            <div className="bg-primary-soft/40 aspect-[16/10] overflow-hidden">
                                <img
                                    src={e.cover}
                                    alt={e.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                                />
                                {/* TODO: real asset */}
                            </div>
                            <div className="p-5">
                                <div className="text-muted-foreground flex items-center gap-3 text-[11px]">
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays className="h-3.5 w-3.5" /> {formatDate(e.date, locale)}
                                    </span>
                                </div>
                                <h3 className="text-primary group-hover:text-brand-orange mt-2 text-[15px] leading-snug font-bold transition">
                                    {e.title}
                                </h3>
                                <p className="text-muted-foreground mt-1.5 line-clamp-2 text-[12.5px]">{e.excerpt}</p>
                                <p className="text-muted-foreground mt-2 inline-flex items-center gap-1 text-[11.5px]">
                                    <MapPin className="h-3.5 w-3.5" /> {e.place}
                                </p>
                                <span className="text-brand-orange mt-4 inline-flex items-center gap-1 text-[13px] font-bold">
                                    {c.viewDetails} <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}

EventsPage.layout = siteLayout;
