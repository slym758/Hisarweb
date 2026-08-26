import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, MapPin, Phone } from 'lucide-react';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { getEventBySlug, useEvents } from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        crumbKurumsal: 'Kurumsal',
        crumbEvents: 'Etkinlikler',
        eyebrow: 'Etkinlik',
        about: 'Etkinlik Hakkında',
        regBadge: 'Kayıt & Bilgi',
        regTitle: 'Etkinlik için yer ayırtın',
        regDesc: 'Katılım ücretsiz, kontenjan sınırlıdır.',
        appointment: 'Randevu Al',
        otherEvents: 'Diğer Etkinlikler',
        notFoundTitle: 'Etkinlik',
        notFoundDesc: 'Hisar Hospital etkinlik sayfası.',
        notFound: 'Etkinlik bulunamadı.',
        allEvents: 'Tüm etkinlikler',
    },
    en: {
        crumbKurumsal: 'Corporate',
        crumbEvents: 'Events',
        eyebrow: 'Event',
        about: 'About the Event',
        regBadge: 'Registration & Info',
        regTitle: 'Reserve your place for the event',
        regDesc: 'Participation is free, places are limited.',
        appointment: 'Book Appointment',
        otherEvents: 'Other Events',
        notFoundTitle: 'Event',
        notFoundDesc: 'Hisar Hospital event page.',
        notFound: 'Event not found.',
        allEvents: 'All events',
    },
} as const;

const PHONE_DISPLAY = '444 5 888';

function formatDate(iso: string, locale: 'tr' | 'en'): string {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(y, m - 1, d));
}

export default function EventDetailPage() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const { slug } = usePage().props as unknown as { slug: string };
    const data = getEventBySlug(slug, locale);
    const events = useEvents();

    if (!data) {
        return (
            <>
                <Head title={c.notFoundTitle}>
                    <meta name="description" content={c.notFoundDesc} />
                </Head>
                <div className="container-x py-24 text-center">
                    <p className="text-muted-foreground">{c.notFound}</p>
                    <Link href={lp('/etkinlikler')} className="text-primary mt-4 inline-flex font-semibold">
                        ← {c.allEvents}
                    </Link>
                </div>
            </>
        );
    }

    const title = `${data.title} — Hisar Hospital`;
    const displayDate = formatDate(data.date, locale);

    return (
        <>
            <Head title={title}>
                <meta name="description" content={data.excerpt} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={data.excerpt} />
                <meta property="og:image" content={data.cover} />
                <link rel="alternate" hrefLang="tr" href={`https://app.hisarweb.test/etkinlikler/${data.slug}`} />
                <link rel="alternate" hrefLang="en" href={`https://app.hisarweb.test/en/etkinlikler/${data.slug}`} />
                <link rel="alternate" hrefLang="x-default" href={`https://app.hisarweb.test/etkinlikler/${data.slug}`} />
            </Head>

            <Breadcrumb items={[{ label: c.crumbKurumsal, to: '/kurumsal' }, { label: c.crumbEvents, to: '/etkinlikler' }, { label: data.title }]} />

            <section className="container-x pt-4 pb-8 lg:pt-6 lg:pb-12">
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
                    <div className="min-w-0">
                        <p className="text-brand-orange inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase">
                            <span className="bg-brand-orange h-[2px] w-6" /> {c.eyebrow}
                        </p>
                        <h1 className="text-primary mt-3 text-2xl leading-[1.1] font-black tracking-tight text-balance lg:text-[2.4rem]">
                            {data.title}
                        </h1>
                        <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="text-brand-orange h-4 w-4" /> {displayDate}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="text-brand-orange h-4 w-4" /> {data.place}
                            </span>
                        </div>
                        <p className="text-foreground/80 mt-5 line-clamp-3 max-w-2xl text-[14.5px] leading-relaxed">{data.excerpt}</p>
                    </div>
                    <figure className="border-border/70 bg-surface relative aspect-[4/3] overflow-hidden rounded-2xl border lg:aspect-[5/4]">
                        <img src={data.cover} alt={data.title} className="h-full w-full object-cover" />
                        {/* TODO: real asset */}
                    </figure>
                </div>
            </section>

            <div className="border-border/60 border-t" />

            <section className="container-x grid gap-10 pb-16 lg:grid-cols-[1fr_320px] lg:pb-24">
                <article className="max-w-3xl min-w-0 space-y-10">
                    <section>
                        <h2 className="text-primary text-lg font-black tracking-tight lg:text-xl">{c.about}</h2>
                        <p className="text-foreground/85 mt-3 text-[14.5px] leading-[1.75]">{data.body}</p>
                    </section>
                </article>

                <aside>
                    <div className="space-y-4 lg:sticky lg:top-36">
                        <div className="border-border bg-card shadow-card rounded-2xl border p-5">
                            <p className="text-brand-orange text-[11px] font-bold tracking-widest uppercase">{c.regBadge}</p>
                            <h3 className="text-primary mt-1 text-lg leading-tight font-black">{c.regTitle}</h3>
                            <p className="text-muted-foreground mt-1.5 text-[13px]">{c.regDesc}</p>
                            <a
                                href="tel:4445888"
                                className="bg-brand-orange text-brand-orange-foreground shadow-orange mt-4 flex h-11 items-center justify-center gap-1.5 rounded-full text-sm font-bold"
                            >
                                <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
                            </a>
                            <a
                                href={settings.appointment_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border-border text-primary hover:border-primary/40 mt-2 flex h-11 items-center justify-center gap-1.5 rounded-full border text-sm font-semibold"
                            >
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </a>
                        </div>

                        <div className="border-border bg-card rounded-2xl border p-5">
                            <p className="text-muted-foreground inline-flex items-center gap-1.5 text-[11px] font-semibold">
                                <CalendarDays className="h-3.5 w-3.5" /> {c.otherEvents}
                            </p>
                            <ul className="mt-2 space-y-2">
                                {events
                                    .filter((e) => e.slug !== data.slug)
                                    .slice(0, 3)
                                    .map((e) => (
                                        <li key={e.slug}>
                                            <Link href={lp('/etkinlikler/' + e.slug)} className="hover:bg-surface block rounded-xl p-2 transition">
                                                <p className="text-primary line-clamp-2 text-[13px] font-bold">{e.title}</p>
                                                <p className="text-muted-foreground mt-0.5 text-[11px]">{formatDate(e.date, locale)}</p>
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </aside>
            </section>
        </>
    );
}

EventDetailPage.layout = siteLayout;
