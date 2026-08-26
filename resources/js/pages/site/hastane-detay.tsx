import { Head, Link, usePage } from '@inertiajs/react';
import {
    Ambulance, ArrowRight, Award, BedDouble, Building2, CalendarDays, ChevronRight, Clock, Cpu, Home,
    MapPin, Navigation, Phone, ShieldCheck, Stethoscope, Users, Wifi,
} from 'lucide-react';
import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { BizeUlasin } from '@/components/site/BizeUlasin';
import { siteLayout } from '@/layouts/site-layout';
import { useCurrentPath, useLocale, useLocalizedPath } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import {
    getDepartmentsForHospital, getDoctorsForHospital, getHospitalBySlug, getHospitalDetail, getTreatments,
} from '@/lib/site-data';

/* Temporary Unsplash imagery for the technologies grid (no per-technology asset in content-data yet). */
/* TODO: real asset — hospital technology imagery */
const TECH_IMAGES = [
    'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1200&q=80',
];
function techImage(i: number): string {
    return TECH_IMAGES[i % TECH_IMAGES.length];
}

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        titleSuffix: ' — Hisar Hospital',
        descTail: ' Bölümlerimiz, hekim kadromuz ve iletişim bilgileri.',
        notFound: 'Hastane bulunamadı.',
        notFoundLink: '← Tüm hastaneler',
        home: 'Anasayfa',
        hospitalsCrumb: 'Hastanelerimiz',
        kicker: 'Hastane',
        appointment: 'Randevu Al',
        callNow: 'Hemen Ara',
        qAddress: 'Adres',
        qPhone: 'Telefon',
        qEmergency: 'Acil',
        qDirections: 'Yol Tarifi',
        qMaps: 'Google Maps',
        qAppointment: 'Randevu',
        qBookNow: 'Hemen Al',
        aboutTitle: 'Hastane Hakkında',
        featuresTitle: 'Öne Çıkan Özellikler',
        deptsTitle: 'Bölümler',
        allDepts: 'Tüm bölümler',
        doctorsTitle: 'Hekimlerimiz',
        allDoctors: 'Tüm hekimler',
        techTitle: 'Teknolojilerimiz',
        galleryTitle: 'Fotoğraf Galerisi',
        roomsTitle: 'Odalarımız',
        wifi: 'Wi-Fi',
        hygiene: 'Hijyen',
        treatmentsTitle: 'Tedavi Yöntemleri',
        treatmentDetail: 'Detay',
        allTreatments: 'Tüm tedavi yöntemleri',
        locationTitle: 'Konum & Ulaşım',
        mapTitleSuffix: ' konum',
        sideKicker: 'Randevu',
        sideTitle: 'Uzman kadromuzla tanışın',
        sideDesc: 'Hızlıca online randevu alın veya bizi arayın.',
        workingHoursTitle: 'Çalışma Saatleri',
        contactTitleTail: ' — Bize Ulaşın',
    },
    en: {
        titleSuffix: ' — Hisar Hospital',
        descTail: ' Our departments, physicians and contact information.',
        notFound: 'Hospital not found.',
        notFoundLink: '← All hospitals',
        home: 'Home',
        hospitalsCrumb: 'Our Hospitals',
        kicker: 'Hospital',
        appointment: 'Book Appointment',
        callNow: 'Call Now',
        qAddress: 'Address',
        qPhone: 'Phone',
        qEmergency: 'Emergency',
        qDirections: 'Directions',
        qMaps: 'Google Maps',
        qAppointment: 'Appointment',
        qBookNow: 'Book Now',
        aboutTitle: 'About the Hospital',
        featuresTitle: 'Featured Highlights',
        deptsTitle: 'Departments',
        allDepts: 'All departments',
        doctorsTitle: 'Our Physicians',
        allDoctors: 'All physicians',
        techTitle: 'Our Technologies',
        galleryTitle: 'Photo Gallery',
        roomsTitle: 'Our Rooms',
        wifi: 'Wi-Fi',
        hygiene: 'Hygiene',
        treatmentsTitle: 'Treatment Methods',
        treatmentDetail: 'Details',
        allTreatments: 'All treatment methods',
        locationTitle: 'Location & Access',
        mapTitleSuffix: ' location',
        sideKicker: 'Appointment',
        sideTitle: 'Meet our expert team',
        sideDesc: 'Book online quickly or give us a call.',
        workingHoursTitle: 'Working Hours',
        contactTitleTail: ' — Get in Touch',
    },
} as const;

/* ───────────────────────── PAGE ───────────────────────── */
export default function HastaneDetay() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const path = useCurrentPath();
    const { slug } = usePage().props as unknown as { slug: string };

    const hospital = getHospitalBySlug(slug, locale);

    if (!hospital) {
        return (
            <>
                <Head title={`404${c.titleSuffix}`} />
                <div className="container-x py-24 text-center">
                    <p className="text-muted-foreground">{c.notFound}</p>
                    <Link href={lp('/hastanelerimiz')} className="mt-4 inline-flex text-primary font-semibold">
                        {c.notFoundLink}
                    </Link>
                </div>
            </>
        );
    }

    const detail = getHospitalDetail(hospital.slug, locale);
    const allHospitalDepartments = getDepartmentsForHospital(hospital.slug, locale);
    const hospitalDepartments = allHospitalDepartments.slice(0, 8);
    const hospitalDoctors = getDoctorsForHospital(hospital.slug, locale).slice(0, 4);

    // "Tedavi Yöntemleri" — treatments relevant to the hospital's departments (padded to 3).
    const deptSlugSet = new Set(allHospitalDepartments.map((d) => d.slug));
    const allTreatments = getTreatments(locale);
    const relatedTreatments = allTreatments.filter((t) => deptSlugSet.has(t.deptSlug));
    const treatments = (
        relatedTreatments.length >= 3
            ? relatedTreatments
            : [...relatedTreatments, ...allTreatments.filter((t) => !deptSlugSet.has(t.deptSlug))]
    ).slice(0, 3);

    const telHref = `tel:${hospital.phone.replace(/\s/g, '')}`;
    const mapsQuery = encodeURIComponent(detail?.mapQuery ?? hospital.name);

    const title = `${hospital.name}${c.titleSuffix}`;
    const description = detail?.about?.[0] ?? `${hospital.name}, ${hospital.area}.${c.descTail}`;

    return (
        <>
            <Head title={title}>
                <meta name="description" content={description} />
                <link rel="alternate" hrefLang="tr" href={`https://app.hisarweb.test${path}`} />
                <link rel="alternate" hrefLang="en" href={`https://app.hisarweb.test/en${path}`} />
                <link rel="alternate" hrefLang="x-default" href={`https://app.hisarweb.test${path}`} />
            </Head>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="border-b border-border/60 bg-surface/50">
                <div className="container-x py-3 flex items-center gap-1.5 text-[12px] lg:text-[13px] text-muted-foreground overflow-x-auto scrollbar-thin">
                    <Link href={lp('/')} className="inline-flex items-center gap-1 hover:text-primary transition">
                        <Home className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{c.home}</span>
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <Link href={lp('/hastanelerimiz')} className="hover:text-primary transition whitespace-nowrap">
                        {c.hospitalsCrumb}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="text-primary font-semibold whitespace-nowrap truncate max-w-[45vw]">{hospital.name}</span>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative">
                <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/7] w-full overflow-hidden">
                    {/* TODO: real asset — hospital cover from content-data */}
                    <img src={hospital.cover} alt={hospital.name} className="h-full w-full object-cover" fetchPriority="high" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/45 to-transparent lg:from-primary/85 lg:via-primary/30" />
                    {/* Mobile-only in-hero title */}
                    <div className="absolute inset-x-0 bottom-0 p-5 lg:hidden">
                        <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/80">{c.kicker}</p>
                        <h1 className="mt-1 text-[26px] leading-[1.1] font-black text-white tracking-tight">{hospital.name}</h1>
                        <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-white/85">
                            <MapPin className="h-3.5 w-3.5" /> {hospital.area}
                        </p>
                    </div>
                </div>

                <div className="container-x relative -mt-6 sm:-mt-16 lg:-mt-28 pb-6">
                    <div className="rounded-2xl bg-card border border-border/70 shadow-elevated p-4 sm:p-5 lg:p-7">
                        {/* Desktop title */}
                        <div className="hidden lg:block">
                            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-brand-orange">
                                <span className="h-[2px] w-6 bg-brand-orange" /> {c.kicker}
                            </p>
                            <h1 className="mt-2 text-2xl lg:text-4xl font-black text-primary tracking-tight">{hospital.name}</h1>
                        </div>
                        {detail?.about?.[0] && (
                            <p className="text-[13.5px] lg:text-base text-muted-foreground max-w-3xl leading-relaxed lg:mt-2">
                                {detail.about[0]}
                            </p>
                        )}

                        {/* Primary CTA row (mobile) */}
                        <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
                            <AppointmentCTA href={settings.appointment_url} className="h-12">
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </AppointmentCTA>
                            <a
                                href={telHref}
                                className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/25 text-primary h-12 text-[13px] font-bold"
                            >
                                <Phone className="h-4 w-4" /> {c.callNow}
                            </a>
                        </div>

                        {/* Quick info */}
                        <div className="mt-4 lg:mt-5 grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-2.5">
                            <QuickCard icon={<MapPin className="h-4 w-4" />} title={c.qAddress} desc={hospital.area} />
                            <a
                                href={telHref}
                                className="rounded-xl border border-border bg-surface p-3 text-left hover:border-primary/40 transition min-w-0"
                            >
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                                    <Phone className="h-4 w-4" /> {c.qPhone}
                                </span>
                                <p className="mt-1 text-[13px] font-bold text-primary truncate">{hospital.phone}</p>
                            </a>
                            {detail?.emergency && (
                                <QuickCard icon={<Ambulance className="h-4 w-4" />} title={c.qEmergency} desc={detail.emergency} />
                            )}
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl border border-border bg-surface p-3 text-left hover:border-primary/40 transition min-w-0"
                            >
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                                    <Navigation className="h-4 w-4" /> {c.qDirections}
                                </span>
                                <p className="mt-1 text-[13px] font-bold text-primary">{c.qMaps}</p>
                            </a>
                            {/* Desktop-only appointment tile */}
                            <a
                                href={settings.appointment_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden lg:block rounded-xl bg-brand-orange text-brand-orange-foreground p-3 text-left hover:opacity-95 shadow-orange"
                            >
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold">
                                    <CalendarDays className="h-4 w-4" /> {c.qAppointment}
                                </span>
                                <p className="mt-1 text-[13px] font-bold">{c.qBookNow}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="container-x py-8 lg:py-12 grid lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 space-y-8 lg:space-y-10">

                    {detail?.about?.length ? (
                        <SectionBlock title={c.aboutTitle} icon={<Building2 className="h-4 w-4" />}>
                            <div className="space-y-3">
                                {detail.about.map((p, i) => (
                                    <p key={i} className="text-[15px] leading-relaxed text-foreground/85">{p}</p>
                                ))}
                            </div>
                        </SectionBlock>
                    ) : null}

                    {detail?.features?.length ? (
                        <SectionBlock title={c.featuresTitle} icon={<Award className="h-4 w-4" />}>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {detail.features.map((f) => (
                                    <div key={f.title} className="rounded-xl border border-border bg-card p-4">
                                        <h3 className="text-[14px] font-bold text-primary">{f.title}</h3>
                                        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionBlock>
                    ) : null}

                    {hospitalDepartments.length ? (
                        <SectionBlock title={c.deptsTitle} icon={<Stethoscope className="h-4 w-4" />}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                                {hospitalDepartments.map((d) => (
                                    <Link
                                        key={d.slug}
                                        href={lp('/bolum/' + d.slug)}
                                        className="group rounded-xl border border-border bg-card p-3 hover:border-primary/30 hover:shadow-card transition"
                                    >
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                                            <d.icon className="h-4 w-4" strokeWidth={1.5} />
                                        </span>
                                        <p className="mt-2 text-[12.5px] font-semibold text-primary leading-tight">{d.name}</p>
                                    </Link>
                                ))}
                            </div>
                            <Link href={lp('/bolumlerimiz')} className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-orange">
                                {c.allDepts} <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </SectionBlock>
                    ) : null}

                    {hospitalDoctors.length ? (
                        <SectionBlock title={c.doctorsTitle} icon={<Users className="h-4 w-4" />}>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {hospitalDoctors.map((d) => (
                                    <Link
                                        key={d.id}
                                        href={lp('/doktor/' + d.id)}
                                        className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/30 transition"
                                    >
                                        <span className="h-12 w-12 shrink-0 rounded-full bg-muted overflow-hidden ring-1 ring-border">
                                            {d.photo ? (
                                                <img src={d.photo} alt={d.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="flex h-full w-full items-center justify-center text-primary font-bold text-sm">
                                                    {d.name.split(' ').slice(-1)[0][0]}
                                                </span>
                                            )}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-bold text-primary truncate">{d.name}</p>
                                            <p className="text-[11.5px] text-muted-foreground truncate">{d.department}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link href={lp('/doktorlarimiz')} className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-orange">
                                {c.allDoctors} <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </SectionBlock>
                    ) : null}

                    {detail?.technologies?.length ? (
                        <SectionBlock title={c.techTitle} icon={<Cpu className="h-4 w-4" />}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {detail.technologies.map((t, i) => (
                                    <div key={t.name} className="rounded-xl overflow-hidden border border-border bg-card">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            {/* TODO: real asset — hospital technology imagery */}
                                            <img src={techImage(i)} alt={t.name} loading="lazy" className="h-full w-full object-cover" />
                                        </div>
                                        <p className="p-2.5 text-[12.5px] font-bold text-primary">{t.name}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionBlock>
                    ) : null}

                    {detail?.gallery?.length ? (
                        <SectionBlock title={c.galleryTitle}>
                            {/* Desktop mosaic */}
                            <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-2 h-[420px]">
                                <div className="col-span-2 row-span-2 rounded-xl overflow-hidden">
                                    {/* TODO: real asset — gallery image from content-data */}
                                    <img src={detail.gallery[0].image} alt={detail.gallery[0].caption} className="h-full w-full object-cover" />
                                </div>
                                {detail.gallery.slice(1, 5).map((g, i) => (
                                    <div key={i} className="col-span-1 rounded-xl overflow-hidden">
                                        <img src={g.image} alt={g.caption} className="h-full w-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            {/* Mobile: full-bleed horizontal snap carousel */}
                            <div className="lg:hidden -mx-4 px-4 flex gap-2.5 overflow-x-auto snap-x snap-mandatory scrollbar-thin">
                                {detail.gallery.map((g, i) => (
                                    <figure
                                        key={i}
                                        className="snap-start shrink-0 w-[80%] first:ml-0 aspect-[4/3] rounded-xl overflow-hidden bg-muted"
                                    >
                                        <img src={g.image} alt={g.caption} className="h-full w-full object-cover" loading="lazy" />
                                    </figure>
                                ))}
                            </div>
                        </SectionBlock>
                    ) : null}

                    {detail?.rooms?.length ? (
                        <SectionBlock title={c.roomsTitle} icon={<BedDouble className="h-4 w-4" />}>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {detail.rooms.map((r) => (
                                    <div key={r.name} className="rounded-2xl border border-border bg-card overflow-hidden">
                                        <div className="aspect-[4/3] overflow-hidden bg-primary-soft/40">
                                            {/* TODO: real asset — room image from content-data */}
                                            <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-[14px] font-bold text-primary inline-flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5 text-brand-orange" /> {r.name}</h3>
                                            <p className="mt-2 text-[12.5px] text-muted-foreground leading-relaxed">{r.desc}</p>
                                            <p className="mt-3 inline-flex items-center gap-3 text-[11px] text-muted-foreground">
                                                <span className="inline-flex items-center gap-1"><Wifi className="h-3 w-3" /> {c.wifi}</span>
                                                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> {c.hygiene}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionBlock>
                    ) : null}

                    {treatments.length ? (
                        <SectionBlock title={c.treatmentsTitle} icon={<Stethoscope className="h-4 w-4" />}>
                            <div className="grid sm:grid-cols-3 gap-3">
                                {treatments.map((t) => (
                                    <Link key={t.slug} href={lp('/tedavi/' + t.slug)} className="group rounded-2xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-card transition">
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary"><Stethoscope className="h-4 w-4" /></span>
                                        <h3 className="mt-2 text-[14px] font-bold text-primary leading-tight">{t.name}</h3>
                                        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{t.department}</p>
                                        <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-brand-orange">{c.treatmentDetail} <ArrowRight className="h-3 w-3" /></span>
                                    </Link>
                                ))}
                            </div>
                            <Link href={lp('/tedavi-yontemleri')} className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-orange">
                                {c.allTreatments} <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </SectionBlock>
                    ) : null}

                    <SectionBlock title={c.locationTitle} icon={<MapPin className="h-4 w-4" />}>
                        <div className="rounded-2xl overflow-hidden border border-border">
                            <iframe
                                src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                                width="100%"
                                height="360"
                                loading="lazy"
                                className="w-full"
                                title={`${hospital.name}${c.mapTitleSuffix}`}
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        {detail?.transport?.length ? (
                            <div className="mt-3 grid sm:grid-cols-3 gap-2.5">
                                {detail.transport.map((t) => (
                                    <div key={t} className="rounded-xl border border-border bg-surface p-3 text-[12.5px] text-primary/85">
                                        {t}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </SectionBlock>

                    <BizeUlasin title={`${hospital.name}${c.contactTitleTail}`} context={hospital.name} />
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="lg:sticky lg:top-36 space-y-4">
                        <div className="hidden lg:block rounded-2xl border border-border bg-card p-5 shadow-card">
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-brand-orange">
                                <span className="h-[2px] w-6 bg-brand-orange" /> {c.sideKicker}
                            </div>
                            <h3 className="mt-2 text-lg font-black text-primary leading-tight">{c.sideTitle}</h3>
                            <p className="mt-1.5 text-[13px] text-muted-foreground">{c.sideDesc}</p>
                            <AppointmentCTA href={settings.appointment_url} className="mt-4 h-11">
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </AppointmentCTA>
                            <a
                                href={telHref}
                                className="mt-2 flex items-center justify-center gap-1.5 rounded-full border border-border h-11 text-sm font-semibold text-primary hover:border-primary/40"
                            >
                                <Phone className="h-4 w-4" /> {hospital.phone}
                            </a>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5">
                            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" /> {c.workingHoursTitle}
                            </p>
                            {detail?.workingHours && <p className="mt-1 text-[14px] font-bold text-primary">{detail.workingHours}</p>}
                            <p className="mt-3 text-[12.5px] text-muted-foreground leading-relaxed">{hospital.address}</p>
                        </div>
                    </div>
                </aside>
            </section>
        </>
    );
}

HastaneDetay.layout = siteLayout;

function QuickCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="rounded-xl border border-border bg-surface p-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                {icon} {title}
            </span>
            <p className="mt-1 text-[13px] font-bold text-primary leading-tight">{desc}</p>
        </div>
    );
}

function SectionBlock({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <section>
            <header className="mb-3.5 flex items-center gap-2">
                <span className="h-[2px] w-6 bg-brand-orange" />
                <h2 className="text-[11px] font-bold tracking-widest uppercase text-brand-orange inline-flex items-center gap-1.5">
                    {icon} {title}
                </h2>
            </header>
            {children}
        </section>
    );
}
