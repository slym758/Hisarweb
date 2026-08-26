import { Head, Link } from '@inertiajs/react';
import { ArrowRight, MapPin, Navigation, CalendarDays, Building2, Phone } from 'lucide-react';

import { siteLayout } from '@/layouts/site-layout';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { useHospitals } from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Hastanelerimiz — Hisar Hospital',
            description: 'Hisar Hospital hastane şubeleri: Intercontinental, Çamlıca ve yakında Avrupa. Konum, iletişim ve randevu bilgileri.',
            ogTitle: 'Hastanelerimiz — Hisar Hospital',
            ogDescription: "Hisar Hospital'ın hastane şubeleri ve hizmet noktaları.",
        },
        breadcrumb: 'Hastanelerimiz',
        title: 'Hastanelerimiz',
        subtitle: "İstanbul'un iki yakasında; deneyimli hekim kadromuz ve ileri teknoloji altyapımızla yanınızdayız.",
        countLabel: 'hastane',
        comingSoonBadge: 'Çok Yakında',
        inspect: 'İncele',
        soon: 'Yakında',
        directions: 'Yol',
        appointment: 'Randevu',
        extras: {
            intercontinental: {
                blurb: 'JCI onaylı, çok disiplinli genel hastane. Onkoloji, robotik cerrahi ve ileri kardiyoloji merkezleri.',
                highlights: ['Onkoloji Merkezi', 'Da Vinci Robotik Cerrahi', '24 Saat Acil Servis', 'İleri Görüntüleme'],
            },
            camlica: {
                blurb: 'Poliklinik ağırlıklı, aile odaklı sağlık hizmeti. Kadın-doğum, çocuk sağlığı ve check-up birimleri.',
                highlights: ['Kadın Doğum', 'Çocuk Sağlığı', 'Check-Up', 'Fizik Tedavi'],
            },
            avrupa: {
                blurb: "Avrupa Yakası'ndaki yeni hastanemiz; modern altyapı, geniş uzman kadro ve dijital hasta deneyimiyle yakında açılıyor.",
                highlights: ['Modern Altyapı', 'Geniş Kadro', 'Dijital Deneyim'],
            },
        } as Record<string, { blurb: string; highlights: string[] }>,
    },
    en: {
        head: {
            title: 'Our Hospitals — Hisar Hospital',
            description: 'Hisar Hospital branches: Intercontinental, Çamlıca and soon Avrupa. Location, contact and appointment information.',
            ogTitle: 'Our Hospitals — Hisar Hospital',
            ogDescription: "Hisar Hospital's branches and service points.",
        },
        breadcrumb: 'Our Hospitals',
        title: 'Our Hospitals',
        subtitle: 'On both sides of Istanbul; by your side with our experienced physicians and advanced technology.',
        countLabel: 'hospitals',
        comingSoonBadge: 'Coming Soon',
        inspect: 'Explore',
        soon: 'Soon',
        directions: 'Route',
        appointment: 'Appointment',
        extras: {
            intercontinental: {
                blurb: 'A JCI-accredited, multidisciplinary general hospital. Oncology, robotic surgery and advanced cardiology centers.',
                highlights: ['Oncology Center', 'Da Vinci Robotic Surgery', '24-Hour Emergency', 'Advanced Imaging'],
            },
            camlica: {
                blurb: 'Outpatient-focused, family-oriented healthcare. Obstetrics, paediatrics and check-up units.',
                highlights: ['Obstetrics & Gynaecology', 'Paediatrics', 'Check-Up', 'Physiotherapy'],
            },
            avrupa: {
                blurb: 'Our new hospital on the European side; opening soon with modern infrastructure, a broad expert team and a digital patient experience.',
                highlights: ['Modern Infrastructure', 'Broad Team', 'Digital Experience'],
            },
        } as Record<string, { blurb: string; highlights: string[] }>,
    },
} as const;

/* Google Maps search query per branch (locale-independent). */
const MAPS_QUERY: Record<string, string> = {
    intercontinental: 'Hisar Hospital Intercontinental',
    camlica: 'Hisar Hospital Çamlıca',
    avrupa: 'Hisar Hospital',
};

export default function HastanelerimizPage() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const items = useHospitals();

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.ogTitle} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/hastanelerimiz" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/hastanelerimiz" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/hastanelerimiz" />
            </Head>

            <Breadcrumb items={[{ label: c.breadcrumb }]} />

            <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 via-surface to-background border-b border-border/60">
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_55%)]" aria-hidden />
                <div className="container-x relative py-6 lg:py-12 text-center">
                    <h1 className="text-xl lg:text-4xl font-black tracking-tight text-primary">{c.title}</h1>
                    <p className="mx-auto mt-1.5 lg:mt-2 max-w-xl text-xs lg:text-sm text-muted-foreground">
                        {c.subtitle}
                    </p>
                    <div className="mt-3 lg:mt-4 inline-flex items-center gap-2 text-[11px] lg:text-xs text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{items.length} {c.countLabel}</span>
                    </div>
                </div>
            </section>

            <section className="py-8 lg:py-14 bg-surface/40 pb-[calc(var(--bottom-nav-h)+3rem)] lg:pb-16">
                <div className="container-x">
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((h) => {
                            const extras = c.extras[h.slug] ?? { blurb: '', highlights: [] };
                            const mapsQuery = MAPS_QUERY[h.slug] ?? h.name;
                            return (
                                <article
                                    key={h.slug}
                                    id={`hisar-hospital-${h.slug}`}
                                    className={`scroll-mt-24 group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card transition ${
                                        h.comingSoon ? 'opacity-95' : 'hover-lift'
                                    }`}
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                        <img
                                            src={h.cover}
                                            alt={h.name}
                                            loading="lazy"
                                            className={`h-full w-full object-cover transition duration-500 ${
                                                h.comingSoon ? 'grayscale-[.35] opacity-90' : 'group-hover:scale-105'
                                            }`}
                                        />
                                        {/* TODO: real asset */}
                                        {h.comingSoon && (
                                            <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-[11px] font-bold text-primary shadow-sm">
                                                {c.comingSoonBadge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-[16px] font-black text-primary leading-snug">{h.name}</h3>
                                        <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                                            <MapPin className="h-3.5 w-3.5" /> {h.area}
                                        </p>
                                        <p className="mt-2.5 text-[13px] text-muted-foreground leading-relaxed line-clamp-3">
                                            {extras.blurb}
                                        </p>

                                        <ul className="mt-3 flex flex-wrap gap-1.5">
                                            {extras.highlights.map((f) => (
                                                <li
                                                    key={f}
                                                    className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] text-primary/80"
                                                >
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            {!h.comingSoon ? (
                                                <Link
                                                    href={lp('/hastane/' + h.slug)}
                                                    className="col-span-3 sm:col-span-1 inline-flex items-center justify-center gap-1 rounded-full bg-primary text-primary-foreground text-[12.5px] font-semibold h-10 hover:bg-primary/90 transition"
                                                >
                                                    {c.inspect} <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            ) : (
                                                <span className="col-span-3 sm:col-span-1 inline-flex items-center justify-center gap-1 rounded-full bg-muted text-muted-foreground text-[12.5px] font-semibold h-10 cursor-not-allowed">
                                                    {c.soon}
                                                </span>
                                            )}
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center gap-1 rounded-full border border-border bg-surface text-[12.5px] font-semibold h-10 text-primary hover:border-primary/40 transition"
                                            >
                                                <Navigation className="h-3.5 w-3.5" /> {c.directions}
                                            </a>
                                            <a
                                                href={settings.appointment_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center justify-center gap-1 rounded-full text-[12.5px] font-semibold h-10 transition ${
                                                    h.comingSoon
                                                        ? 'border border-border bg-surface text-muted-foreground'
                                                        : 'bg-brand-orange text-brand-orange-foreground hover:opacity-95 shadow-orange'
                                                }`}
                                            >
                                                <CalendarDays className="h-3.5 w-3.5" /> {c.appointment}
                                            </a>
                                        </div>

                                        <a
                                            href={`tel:${h.phone.replace(/\s/g, '')}`}
                                            className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary"
                                        >
                                            <Phone className="h-3.5 w-3.5" /> {h.phone}
                                        </a>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

HastanelerimizPage.layout = siteLayout;
