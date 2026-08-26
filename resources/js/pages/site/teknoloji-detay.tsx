import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight, Building2, CalendarDays, CheckCircle2, ChevronRight, Home, Phone, Users,
} from 'lucide-react';
import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { siteLayout } from '@/layouts/site-layout';
import { useCurrentPath, useLocale, useLocalizedPath } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import {
    getDiseaseBySlug, getHospitalsForDept, getTechnologyBySlug, getTreatmentBySlug,
    useDepartments, useDoctors,
    type Disease, type Hospital, type Treatment,
} from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        titleSuffix: ' — Hisar Hospital',
        notFound: 'Bu teknoloji için detay sayfası henüz hazır değil.',
        notFoundLink: '← Tüm teknolojiler',
        home: 'Anasayfa',
        crumb: 'Teknolojilerimiz',
        eyebrow: 'Teknoloji',
        getInfo: 'Bilgi Al',
        appointment: 'Randevu Al',
        whatTitle: 'Teknoloji Nedir?',
        howTitle: 'Nasıl Çalışır?',
        diseasesTitle: 'Hangi Hastalıklarda Kullanılır?',
        treatmentsTitle: 'Hangi Tedavilerde Kullanılır?',
        advantages: 'Avantajları',
        deptsTitle: 'Kullanıldığı Bölümler',
        hospitalsTitle: 'Bulunduğu Hastaneler',
        sideKicker: 'Bilgi & Randevu',
        sideTitle: 'Bu teknolojiden yararlanmak ister misiniz?',
        relatedDoctors: 'İlgili Hekimler',
        phoneLabel: '0216 524 13 00',
    },
    en: {
        titleSuffix: ' — Hisar Hospital',
        notFound: 'A detail page for this technology is not ready yet.',
        notFoundLink: '← All technologies',
        home: 'Home',
        crumb: 'Our Technologies',
        eyebrow: 'Technology',
        getInfo: 'Get Info',
        appointment: 'Book Appointment',
        whatTitle: 'What Is This Technology?',
        howTitle: 'How Does It Work?',
        diseasesTitle: 'Which Diseases Is It Used For?',
        treatmentsTitle: 'Which Treatments Is It Used In?',
        advantages: 'Advantages',
        deptsTitle: 'Departments That Use It',
        hospitalsTitle: 'Available Hospitals',
        sideKicker: 'Info & Appointment',
        sideTitle: 'Would you like to benefit from this technology?',
        relatedDoctors: 'Related Physicians',
        phoneLabel: '0216 524 13 00',
    },
} as const;

/* ───────────────────────── PAGE ───────────────────────── */
export default function TeknolojiDetay() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const path = useCurrentPath();
    const { slug } = usePage().props as unknown as { slug: string };

    const tech = getTechnologyBySlug(slug, locale);
    const departments = useDepartments();
    const allDoctors = useDoctors();

    if (!tech) {
        return (
            <>
                <Head title={`404${c.titleSuffix}`} />
                <div className="container-x py-24 text-center">
                    <p className="text-muted-foreground">{c.notFound}</p>
                    <Link href={lp('/teknolojilerimiz')} className="mt-4 inline-flex text-primary font-semibold">
                        {c.notFoundLink}
                    </Link>
                </div>
            </>
        );
    }

    const detail = tech.detail;
    const depts = departments.filter((d) => tech.deptSlugs.includes(d.slug));
    const techDoctors = allDoctors.filter((d) => tech.deptSlugs.includes(d.departmentSlug)).slice(0, 4);

    // Related diseases / treatments resolved per slug (rendered only when present).
    const relatedDiseases = (detail.diseaseSlugs ?? [])
        .map((s) => getDiseaseBySlug(s, locale))
        .filter((d): d is Disease => Boolean(d));
    const relatedTreatments = (detail.treatmentSlugs ?? [])
        .map((s) => getTreatmentBySlug(s, locale))
        .filter((t): t is Treatment => Boolean(t));

    // Hospitals derived from the technology's departments (deduped, in canonical order).
    const hospitalMap = new Map<string, Hospital>();
    for (const ds of tech.deptSlugs) {
        for (const { hospital } of getHospitalsForDept(ds, locale)) hospitalMap.set(hospital.slug, hospital);
    }
    const techHospitals = [...hospitalMap.values()];

    const title = `${tech.name}${c.titleSuffix}`;

    return (
        <>
            <Head title={title}>
                <meta name="description" content={tech.desc} />
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
                    <Link href={lp('/teknolojilerimiz')} className="hover:text-primary transition whitespace-nowrap">{c.crumb}</Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="text-primary font-semibold whitespace-nowrap truncate max-w-[45vw]">{tech.name}</span>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative border-b border-border/60 bg-gradient-to-b from-primary-soft/30 to-background">
                <div className="container-x py-8 lg:py-14 grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-brand-orange">
                            <span className="h-[2px] w-6 bg-brand-orange" /> {c.eyebrow}
                        </p>
                        <h1 className="mt-2 text-2xl lg:text-4xl font-black text-primary tracking-tight">{tech.name}</h1>
                        <p className="mt-3 text-sm lg:text-base text-muted-foreground leading-relaxed">{tech.desc}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <a
                                href="tel:02165241300"
                                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary hover:border-primary/40"
                            >
                                <Phone className="h-4 w-4" /> {c.getInfo}
                            </a>
                            <AppointmentCTA href={settings.appointment_url}>
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </AppointmentCTA>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-border shadow-elevated">
                        {/* TODO: real asset — technology cover from content-data */}
                        <img src={tech.cover} alt={tech.name} className="w-full aspect-[4/3] object-cover" />
                    </div>
                </div>
            </section>

            <section className="container-x py-10 lg:py-14 grid lg:grid-cols-[1fr_320px] gap-10">
                <article className="min-w-0 max-w-3xl space-y-10">
                    {detail.what && <Section title={c.whatTitle}><p>{detail.what}</p></Section>}
                    {detail.how && <Section title={c.howTitle}><p>{detail.how}</p></Section>}

                    {relatedDiseases.length > 0 && (
                        <Section title={c.diseasesTitle}>
                            <div className="flex flex-wrap gap-2">
                                {relatedDiseases.map((d) => (
                                    <Link
                                        key={d.slug}
                                        href={lp('/hastalik/' + d.slug)}
                                        className="rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] text-primary hover:border-primary/30 transition"
                                    >
                                        {d.name}
                                    </Link>
                                ))}
                            </div>
                        </Section>
                    )}

                    {relatedTreatments.length > 0 && (
                        <Section title={c.treatmentsTitle}>
                            <ul className="space-y-2">
                                {relatedTreatments.map((t) => (
                                    <li key={t.slug}>
                                        <Link
                                            href={lp('/tedavi/' + t.slug)}
                                            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 hover:border-primary/30 transition"
                                        >
                                            <span className="h-2 w-2 rounded-full bg-brand-orange" />
                                            <span className="text-[14px] font-semibold text-primary">{t.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {detail.advantages.length > 0 && (
                        <Section title={c.advantages}>
                            <div className="grid sm:grid-cols-2 gap-2.5">
                                {detail.advantages.map((a) => (
                                    <div key={a} className="flex items-start gap-2 rounded-xl border border-border bg-card p-3">
                                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                                        <span className="text-[13.5px] text-foreground/85">{a}</span>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {depts.length > 0 && (
                        <Section title={c.deptsTitle}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {depts.map((d) => (
                                    <Link
                                        key={d.slug}
                                        href={lp('/bolum/' + d.slug)}
                                        className="group rounded-xl border border-border bg-card p-3 hover:border-primary/30 hover:shadow-card transition"
                                    >
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                                            <d.icon className="h-4 w-4" strokeWidth={1.5} />
                                        </span>
                                        <p className="mt-2 text-[12.5px] font-semibold text-primary">{d.name}</p>
                                    </Link>
                                ))}
                            </div>
                        </Section>
                    )}

                    {techHospitals.length > 0 && (
                        <Section title={c.hospitalsTitle}>
                            <div className="grid sm:grid-cols-2 gap-2.5">
                                {techHospitals.map((h) => (
                                    <Link
                                        key={h.slug}
                                        href={lp('/hastane/' + h.slug)}
                                        className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="h-10 w-10 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                                                <Building2 className="h-5 w-5" strokeWidth={1.5} />
                                            </span>
                                            <p className="text-[13.5px] font-bold text-primary">{h.name}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </Link>
                                ))}
                            </div>
                        </Section>
                    )}
                </article>

                <aside>
                    <div className="lg:sticky lg:top-36 space-y-4">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-brand-orange">{c.sideKicker}</p>
                            <h3 className="mt-1 text-lg font-black text-primary leading-tight">{c.sideTitle}</h3>
                            <div className="mt-3">
                                <CompactPhoneCTA label={c.phoneLabel} />
                            </div>
                            <AppointmentCTA href={settings.appointment_url} className="mt-2 h-11 w-full">
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </AppointmentCTA>
                        </div>

                        {techDoctors.length > 0 && (
                            <div className="rounded-2xl border border-border bg-card p-5">
                                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                    <Users className="h-3.5 w-3.5" /> {c.relatedDoctors}
                                </p>
                                <ul className="mt-2 space-y-2">
                                    {techDoctors.map((d) => (
                                        <li key={d.id}>
                                            <Link href={lp('/doktor/' + d.id)} className="flex items-center gap-3 rounded-xl hover:bg-surface p-2 transition">
                                                <span className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted ring-1 ring-border">
                                                    {d.photo ? (
                                                        <img src={d.photo} alt={d.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="flex h-full w-full items-center justify-center text-primary font-bold text-sm">
                                                            {d.name.split(' ').slice(-1)[0][0]}
                                                        </span>
                                                    )}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-[12.5px] font-bold text-primary truncate">{d.name}</p>
                                                    <p className="text-[11px] text-muted-foreground truncate">{d.department}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </aside>
            </section>
        </>
    );
}

TeknolojiDetay.layout = siteLayout;

/* Inlined equivalent of the source CompactPhoneCTA (no shared component in target). */
function CompactPhoneCTA({ tel = '02165241300', label }: { tel?: string; label: string }) {
    return (
        <a
            href={`tel:${tel}`}
            className="inline-flex h-11 w-full max-w-full items-center justify-center gap-1.5 rounded-full border border-border/80 bg-transparent px-3 text-[13px] font-semibold text-primary transition hover:border-primary/45 hover:bg-primary-soft/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:h-[38px] sm:w-full sm:justify-center"
        >
            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
        </a>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-lg lg:text-xl font-black text-primary tracking-tight">{title}</h2>
            <div className="mt-3 text-[14.5px] text-foreground/85 leading-[1.75]">{children}</div>
        </section>
    );
}
