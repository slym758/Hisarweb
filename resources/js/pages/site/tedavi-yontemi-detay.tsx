import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle, ArrowRight, Building2, CalendarDays, CheckCircle2, ChevronRight, Home, Phone, Sparkles, Users,
} from 'lucide-react';
import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { siteLayout } from '@/layouts/site-layout';
import { useCurrentPath, useLocale, useLocalizedPath } from '@/lib/i18n';
import { getDoctorsForDept, getTreatmentBySlug, useDepartments } from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        titleSuffix: ' — Hisar Hospital',
        notFound: 'Bu tedavi için detay sayfası henüz hazır değil.',
        notFoundLink: '← Tüm tedavi yöntemleri',
        home: 'Anasayfa',
        crumb: 'Tedavi Yöntemleri',
        eyebrow: 'Tedavi Yöntemi',
        appointment: 'Randevu Al',
        getInfo: 'Bilgi Al',
        what: 'Tedavi Nedir?',
        candidates: 'Kimler İçin Uygundur?',
        procedure: 'Nasıl Uygulanır?',
        process: 'Tedavi Süreci',
        advantages: 'Avantajları',
        cautions: 'Dikkat Edilmesi Gerekenler',
        cautionsLabel: 'Uyarılar',
        relatedDiseases: 'İlgili Hastalıklar',
        technologies: 'Kullanılan Teknolojiler',
        faqs: 'Sık Sorulan Sorular',
        sideKicker: 'Randevu',
        sideTitleTail: ' için görüşün',
        relatedDept: 'İlgili Bölüm',
        relatedDoctors: 'İlgili Hekimler',
        phoneLabel: '0216 524 13 00',
    },
    en: {
        titleSuffix: ' — Hisar Hospital',
        notFound: 'A detail page for this treatment is not ready yet.',
        notFoundLink: '← All treatment methods',
        home: 'Home',
        crumb: 'Treatment Methods',
        eyebrow: 'Treatment Method',
        appointment: 'Book Appointment',
        getInfo: 'Get Info',
        what: 'What Is the Treatment?',
        candidates: 'Who Is It Suitable For?',
        procedure: 'How Is It Performed?',
        process: 'Treatment Process',
        advantages: 'Advantages',
        cautions: 'Points to Consider',
        cautionsLabel: 'Warnings',
        relatedDiseases: 'Related Conditions',
        technologies: 'Technologies Used',
        faqs: 'Frequently Asked Questions',
        sideKicker: 'Appointment',
        sideTitleTail: ' — get in touch',
        relatedDept: 'Related Department',
        relatedDoctors: 'Related Physicians',
        phoneLabel: '0216 524 13 00',
    },
} as const;

/* ───────────────────────── PAGE ───────────────────────── */
export default function TedaviYontemiDetay() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const path = useCurrentPath();
    const { slug } = usePage().props as unknown as { slug: string };

    const treatment = getTreatmentBySlug(slug, locale);
    const departments = useDepartments();

    if (!treatment) {
        return (
            <>
                <Head title={`404${c.titleSuffix}`} />
                <div className="container-x py-24 text-center">
                    <p className="text-muted-foreground">{c.notFound}</p>
                    <Link href={lp('/tedavi-yontemleri')} className="mt-4 inline-flex text-primary font-semibold">
                        {c.notFoundLink}
                    </Link>
                </div>
            </>
        );
    }

    const dept = departments.find((d) => d.slug === treatment.deptSlug);
    const relatedDoctors = dept ? getDoctorsForDept(treatment.deptSlug, locale).slice(0, 3) : [];
    const detail = treatment.detail;

    const title = `${treatment.name}${c.titleSuffix}`;

    return (
        <>
            <Head title={title}>
                <meta name="description" content={treatment.summary} />
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
                    <Link href={lp('/tedavi-yontemleri')} className="hover:text-primary transition whitespace-nowrap">{c.crumb}</Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="text-primary font-semibold whitespace-nowrap truncate max-w-[45vw]">{treatment.name}</span>
                </div>
            </nav>

            <section className="container-x py-6 lg:py-10">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                    <div>
                        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-brand-orange">
                            <span className="h-[2px] w-6 bg-brand-orange" /> {c.eyebrow}
                        </p>
                        <h1 className="mt-2 text-2xl lg:text-4xl font-black text-primary tracking-tight">{treatment.name}</h1>
                        <p className="mt-3 text-sm lg:text-base text-muted-foreground leading-relaxed">{treatment.summary}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <AppointmentCTA href={lp('/randevu-al')}>
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </AppointmentCTA>
                            <a
                                href="tel:02165241300"
                                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary hover:border-primary/40"
                            >
                                <Phone className="h-4 w-4" /> {c.getInfo}
                            </a>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-border shadow-card">
                        {/* TODO: real asset — treatment cover from content-data */}
                        <img src={treatment.cover} alt={treatment.name} className="w-full aspect-[16/10] object-cover" />
                    </div>
                </div>
            </section>

            <section className="container-x pb-16 lg:pb-24 grid lg:grid-cols-[1fr_320px] gap-10">
                <article className="min-w-0 max-w-3xl space-y-10">
                    {detail.what && (
                        <Section title={c.what}><p>{detail.what}</p></Section>
                    )}

                    {detail.candidates && detail.candidates.length > 0 && (
                        <Section title={c.candidates}>
                            <BulletList items={detail.candidates} />
                        </Section>
                    )}

                    {detail.procedure && (
                        <Section title={c.procedure}><p>{detail.procedure}</p></Section>
                    )}

                    {detail.process.length > 0 && (
                        <Section title={c.process}>
                            <div className="grid md:grid-cols-3 gap-3">
                                {detail.process.map((s, i) => (
                                    <div key={s.title} className="relative rounded-2xl border border-border bg-card p-5">
                                        <span className="absolute -top-3 left-5 h-7 w-7 rounded-full bg-primary text-primary-foreground text-[12px] font-bold flex items-center justify-center shadow-brand">
                                            {i + 1}
                                        </span>
                                        <h4 className="text-[14px] font-bold text-primary mt-1">{s.title}</h4>
                                        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
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

                    {detail.cautions && detail.cautions.length > 0 && (
                        <Section title={c.cautions}>
                            <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/[0.05] p-4 lg:p-5">
                                <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-orange">
                                    <AlertCircle className="h-4 w-4" /> {c.cautionsLabel}
                                </p>
                                <ul className="mt-2 space-y-1.5">
                                    {detail.cautions.map((cau) => (
                                        <li key={cau} className="flex gap-2 text-[13.5px] text-primary/90">
                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" /> {cau}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Section>
                    )}

                    {detail.relatedDiseases && detail.relatedDiseases.length > 0 && (
                        <Section title={c.relatedDiseases}>
                            <div className="flex flex-wrap gap-2">
                                {detail.relatedDiseases.map((d) => (
                                    <span key={d} className="rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] text-primary">
                                        {d}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    )}

                    {detail.technologies && detail.technologies.length > 0 && (
                        <Section title={c.technologies}>
                            <div className="flex flex-wrap gap-2">
                                {detail.technologies.map((t) => (
                                    <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft text-primary px-3 py-1.5 text-[12.5px] font-semibold">
                                        <Sparkles className="h-3.5 w-3.5" /> {t}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    )}

                    {detail.faqs && detail.faqs.length > 0 && (
                        <Section title={c.faqs}>
                            <div className="space-y-2.5">
                                {detail.faqs.map((f) => (
                                    <details
                                        key={f.q}
                                        className="group rounded-xl border border-border bg-card p-4 open:shadow-card"
                                    >
                                        <summary className="flex cursor-pointer items-center justify-between gap-3 text-[14px] font-bold text-primary marker:hidden">
                                            {f.q}
                                            <ArrowRight className="h-4 w-4 transition group-open:rotate-90 text-muted-foreground" />
                                        </summary>
                                        <p className="mt-2 text-[13.5px] text-muted-foreground leading-relaxed">{f.a}</p>
                                    </details>
                                ))}
                            </div>
                        </Section>
                    )}
                </article>

                <aside>
                    <div className="lg:sticky lg:top-36 space-y-4">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-brand-orange">{c.sideKicker}</p>
                            <h3 className="mt-1 text-lg font-black text-primary leading-tight">
                                {treatment.name}{c.sideTitleTail}
                            </h3>
                            <AppointmentCTA href={lp('/randevu-al')} className="mt-3 h-11">
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </AppointmentCTA>
                            <a
                                href="tel:02165241300"
                                className="mt-2 flex items-center justify-center gap-1.5 rounded-full border border-border h-11 text-sm font-semibold text-primary"
                            >
                                <Phone className="h-4 w-4" /> {c.phoneLabel}
                            </a>
                        </div>

                        {dept && (
                            <div className="rounded-2xl border border-border bg-card p-5">
                                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                    <Building2 className="h-3.5 w-3.5" /> {c.relatedDept}
                                </p>
                                <Link
                                    href={lp('/bolum/' + dept.slug)}
                                    className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-primary-soft/60 hover:bg-primary-soft p-3 transition"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                                            <dept.icon className="h-5 w-5" strokeWidth={1.5} />
                                        </span>
                                        <p className="text-[13px] font-bold text-primary truncate">{dept.name}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                </Link>
                            </div>
                        )}

                        {relatedDoctors.length > 0 && (
                            <div className="rounded-2xl border border-border bg-card p-5">
                                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                    <Users className="h-3.5 w-3.5" /> {c.relatedDoctors}
                                </p>
                                <ul className="mt-2 space-y-2">
                                    {relatedDoctors.map((d) => (
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

TedaviYontemiDetay.layout = siteLayout;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-lg lg:text-xl font-black text-primary tracking-tight">{title}</h2>
            <div className="mt-3 text-[14.5px] text-foreground/85 leading-[1.75]">{children}</div>
        </section>
    );
}

function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="space-y-2">
            {items.map((it) => (
                <li key={it} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                    <span className="text-[14.5px] text-foreground/85">{it}</span>
                </li>
            ))}
        </ul>
    );
}
