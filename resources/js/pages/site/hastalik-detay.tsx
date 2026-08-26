import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle, ArrowRight, Building2, CalendarDays, ChevronRight, ClipboardList, Home,
    MessageSquareText, Phone, Sparkles, Stethoscope,
} from 'lucide-react';
import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { LeadFormDialog } from '@/components/site/LeadFormDialog';
import { siteLayout } from '@/layouts/site-layout';
import { useCurrentPath, useLocale, useLocalizedPath } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { getDiseaseBySlug, getDoctorsForDept, getTreatmentsForDept, useDepartments } from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        titleSuffix: ' — Hisar Hospital',
        notFound: 'Bu hastalık için detay sayfası henüz hazır değil.',
        notFoundLink: '← Tüm hastalıklar',
        home: 'Anasayfa',
        crumb: 'Hastalıklar',
        eyebrow: 'Hastalık Rehberi',
        whatSuffix: ' Nedir?',
        symptoms: 'Belirtileri',
        warningLabel: 'Uyarı',
        warningText: 'Şikâyetleriniz ani başladıysa, hızla ilerliyorsa veya günlük yaşamınızı belirgin şekilde kısıtlıyorsa vakit kaybetmeden bir hekime başvurun.',
        causes: 'Nedenleri',
        risks: 'Risk Faktörleri',
        diagnosis: 'Tanı Yöntemleri',
        treatment: 'Tedavi Yöntemleri',
        whenToDoctor: 'Ne Zaman Doktora Başvurulmalı?',
        technologies: 'Kullanılan Teknolojiler',
        faqs: 'Sık Sorulan Sorular',
        ctaSoftText: 'Şikâyetlerinizi uzman hekimlerimizle paylaşın; size uygun tanı ve tedavi planını birlikte belirleyelim.',
        ctaBandText: 'Tedavi seçenekleri, süreç ve hazırlık hakkında bilgi almak için formu doldurun ya da randevu oluşturun.',
        ctaPrimary: 'Detaylı Bilgi Al',
        ctaAppointment: 'Randevu Al',
        ctaFormTitle: 'Detaylı Bilgi Al',
        ctaFormSubtitle: 'Formu doldurun, ekibimiz sizinle iletişime geçsin.',
        sideKicker: 'Randevu',
        sideTitleTail: ' için değerlendirme',
        sideDesc: 'Uzman hekimlerimizle hızlıca görüşün.',
        appointment: 'Randevu Al',
        relatedDept: 'İlgili Bölüm',
        relatedDoctors: 'İlgili Hekimler',
        relatedTreatments: 'İlgili Tedaviler',
        phoneLabel: '0216 524 13 00',
    },
    en: {
        titleSuffix: ' — Hisar Hospital',
        notFound: 'A detail page for this condition is not ready yet.',
        notFoundLink: '← All conditions',
        home: 'Home',
        crumb: 'Conditions',
        eyebrow: 'Condition Guide',
        whatSuffix: ': What Is It?',
        symptoms: 'Symptoms',
        warningLabel: 'Warning',
        warningText: 'If your symptoms started suddenly, are progressing rapidly, or significantly restrict your daily life, consult a physician without delay.',
        causes: 'Causes',
        risks: 'Risk Factors',
        diagnosis: 'Diagnostic Methods',
        treatment: 'Treatment Methods',
        whenToDoctor: 'When Should You See a Doctor?',
        technologies: 'Technologies Used',
        faqs: 'Frequently Asked Questions',
        ctaSoftText: 'Share your symptoms with our specialist physicians; let us determine the right diagnosis and treatment plan together.',
        ctaBandText: 'Fill in the form or book an appointment to learn about treatment options, the process and preparation.',
        ctaPrimary: 'Get Detailed Information',
        ctaAppointment: 'Book Appointment',
        ctaFormTitle: 'Get Detailed Information',
        ctaFormSubtitle: 'Fill in the form and our team will contact you.',
        sideKicker: 'Appointment',
        sideTitleTail: ' assessment',
        sideDesc: 'Talk to our specialist physicians quickly.',
        appointment: 'Book Appointment',
        relatedDept: 'Related Department',
        relatedDoctors: 'Related Physicians',
        relatedTreatments: 'Related Treatments',
        phoneLabel: '0216 524 13 00',
    },
} as const;

/* Bilingual CTA headline builders (interpolate the localized disease name). */
const CTA_HEADLINE = {
    tr: {
        soft: (n: string) => `${n} için doğru değerlendirme ile başlayın`,
        band: (n: string) => `${n} sürecinizi uzmanlarımızla planlayın.`,
    },
    en: {
        soft: (n: string) => `Start with the right assessment for ${n}`,
        band: (n: string) => `Plan your ${n} journey with our specialists.`,
    },
} as const;

/* ───────────────────────── PAGE ───────────────────────── */
export default function HastalikDetay() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const path = useCurrentPath();
    const { slug } = usePage().props as unknown as { slug: string };

    const disease = getDiseaseBySlug(slug, locale);
    const departments = useDepartments();

    if (!disease) {
        return (
            <>
                <Head title={`404${c.titleSuffix}`} />
                <div className="container-x py-24 text-center">
                    <p className="text-muted-foreground">{c.notFound}</p>
                    <Link href={lp('/hastaliklar')} className="mt-4 inline-flex text-primary font-semibold">
                        {c.notFoundLink}
                    </Link>
                </div>
            </>
        );
    }

    const dept = departments.find((d) => d.slug === disease.deptSlug);
    const relatedDoctors = getDoctorsForDept(disease.deptSlug, locale).slice(0, 3);
    const relatedTreatments = getTreatmentsForDept(disease.deptSlug, locale).slice(0, 3);
    const detail = disease.detail;

    /* Prefer the rich name+desc cards; gracefully fall back to the name-only lists. */
    const diagnosisCards = detail.diagnosisDetail ?? [];
    const diagnosisNames = diagnosisCards.length === 0 ? detail.diagnosis : [];
    const treatmentCards = detail.treatments ?? [];
    const treatmentNames = treatmentCards.length === 0 ? detail.treatment : [];

    const title = `${disease.name}${c.titleSuffix}`;

    return (
        <>
            <Head title={title}>
                <meta name="description" content={disease.summary} />
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
                    <Link href={lp('/hastaliklar')} className="hover:text-primary transition whitespace-nowrap">{c.crumb}</Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="text-primary font-semibold whitespace-nowrap truncate max-w-[45vw]">{disease.name}</span>
                </div>
            </nav>

            <section className="container-x py-6 lg:py-10">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-brand-orange">
                    <span className="h-[2px] w-6 bg-brand-orange" /> {c.eyebrow}
                </p>
                <h1 className="mt-2 text-2xl lg:text-4xl font-black text-primary tracking-tight max-w-3xl">{disease.name}</h1>
                <p className="mt-3 text-sm lg:text-base text-muted-foreground max-w-3xl leading-relaxed">{disease.summary}</p>
            </section>

            <section className="container-x pb-16 lg:pb-24 grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-10">
                <article className="min-w-0 max-w-3xl space-y-10">
                    <div className="rounded-2xl overflow-hidden border border-border">
                        {/* TODO: real asset — disease cover from content-data */}
                        <img src={disease.cover} alt={disease.name} className="w-full aspect-[16/9] object-cover" />
                    </div>

                    <Section title={`${disease.name}${c.whatSuffix}`}>
                        <p>{detail.what}</p>
                    </Section>

                    <InlineLeadCTA
                        locale={locale}
                        headline={CTA_HEADLINE[locale].soft(disease.name)}
                        text={c.ctaSoftText}
                        context={`disease · ${disease.name}`}
                        variant="soft"
                    />

                    {detail.symptoms.length > 0 && (
                        <Section title={c.symptoms}>
                            <BulletList items={detail.symptoms} />
                        </Section>
                    )}

                    <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/[0.05] p-4 lg:p-5">
                        <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-orange">
                            <AlertTriangle className="h-4 w-4" /> {c.warningLabel}
                        </p>
                        <p className="mt-1 text-[14px] text-primary/90 leading-relaxed">{detail.warning ?? c.warningText}</p>
                    </div>

                    {detail.causes.length > 0 && (
                        <Section title={c.causes}>
                            <BulletList items={detail.causes} />
                        </Section>
                    )}

                    {detail.risks && detail.risks.length > 0 && (
                        <Section title={c.risks}>
                            <BulletList items={detail.risks} />
                        </Section>
                    )}

                    {diagnosisCards.length > 0 && (
                        <Section title={c.diagnosis}>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {diagnosisCards.map((d) => (
                                    <div key={d.name} className="rounded-xl border border-border bg-card p-4">
                                        <h4 className="text-[14px] font-bold text-primary">{d.name}</h4>
                                        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{d.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {diagnosisNames.length > 0 && (
                        <Section title={c.diagnosis}>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {diagnosisNames.map((d) => (
                                    <div key={d} className="rounded-xl border border-border bg-card p-4">
                                        <h4 className="text-[14px] font-bold text-primary">{d}</h4>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {treatmentCards.length > 0 && (
                        <Section title={c.treatment}>
                            <ol className="space-y-3 counter-reset">
                                {treatmentCards.map((t, i) => (
                                    <li key={t.name} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                                        <span className="h-8 w-8 shrink-0 rounded-full bg-primary text-primary-foreground text-[13px] font-bold flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h4 className="text-[14px] font-bold text-primary">{t.name}</h4>
                                            <p className="mt-0.5 text-[13px] text-muted-foreground leading-relaxed">{t.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </Section>
                    )}

                    {treatmentNames.length > 0 && (
                        <Section title={c.treatment}>
                            <ol className="space-y-3 counter-reset">
                                {treatmentNames.map((t, i) => (
                                    <li key={t} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                                        <span className="h-8 w-8 shrink-0 rounded-full bg-primary text-primary-foreground text-[13px] font-bold flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h4 className="text-[14px] font-bold text-primary">{t}</h4>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </Section>
                    )}

                    {detail.whenToDoctor && detail.whenToDoctor.length > 0 && (
                        <Section title={c.whenToDoctor}>
                            <BulletList items={detail.whenToDoctor} />
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

                    <InlineLeadCTA
                        locale={locale}
                        headline={detail.midCta ?? CTA_HEADLINE[locale].band(disease.name)}
                        text={c.ctaBandText}
                        context={`disease · ${disease.name}`}
                        variant="band"
                    />

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

                {/* Sidebar */}
                <aside className="min-w-0">
                    <div className="lg:sticky lg:top-36 space-y-4">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-brand-orange">
                                <CalendarDays className="h-3.5 w-3.5" /> {c.sideKicker}
                            </p>
                            <h3 className="mt-2 text-lg font-black text-primary leading-tight">
                                {disease.name}{c.sideTitleTail}
                            </h3>
                            <p className="mt-1.5 text-[13px] text-muted-foreground">{c.sideDesc}</p>
                            <AppointmentCTA href={settings.appointment_url} className="mt-4 h-11 w-full">
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </AppointmentCTA>
                            <div className="mt-2">
                                <CompactPhoneCTA label={c.phoneLabel} />
                            </div>
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
                                    <Stethoscope className="h-3.5 w-3.5" /> {c.relatedDoctors}
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

                        {relatedTreatments.length > 0 && (
                            <div className="rounded-2xl border border-border bg-card p-5">
                                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                    <ClipboardList className="h-3.5 w-3.5" /> {c.relatedTreatments}
                                </p>
                                <ul className="mt-2 space-y-1.5">
                                    {relatedTreatments.map((t) => (
                                        <li key={t.slug}>
                                            <Link
                                                href={lp('/tedavi/' + t.slug)}
                                                className="flex items-center gap-2 text-[13px] text-primary hover:text-brand-orange transition"
                                            >
                                                <ArrowRight className="h-3 w-3 text-brand-orange shrink-0" /> {t.name}
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

HastalikDetay.layout = siteLayout;

/* Inlined equivalent of the source InlineLeadCTA (no shared component in target). */
function InlineLeadCTA({
    locale,
    headline,
    text,
    context,
    variant = 'soft',
}: {
    locale: Locale;
    headline: string;
    text: string;
    context: string;
    variant?: 'soft' | 'band';
}) {
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const [open, setOpen] = useState(false);
    const band = variant === 'band';

    return (
        <div
            className={
                band
                    ? 'rounded-3xl bg-primary p-6 lg:p-7 text-primary-foreground'
                    : 'rounded-2xl border border-border bg-primary-soft/35 p-5 lg:p-6'
            }
        >
            <h3
                className={`text-[17px] lg:text-lg font-black leading-snug tracking-tight ${
                    band ? 'text-primary-foreground' : 'text-primary'
                }`}
            >
                {headline}
            </h3>
            <p className={`mt-1.5 text-[13.5px] leading-relaxed ${band ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {text}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <AppointmentCTA href={settings.appointment_url} className="h-11 w-full sm:w-auto">
                    <CalendarDays className="h-4 w-4" /> {c.ctaAppointment}
                </AppointmentCTA>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border px-5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:w-auto ${
                        band
                            ? 'border-primary-foreground/35 text-primary-foreground hover:bg-primary-foreground/10'
                            : 'border-primary/25 bg-card text-primary hover:border-primary/50'
                    }`}
                >
                    <MessageSquareText className="h-4 w-4" /> {c.ctaPrimary}
                </button>
            </div>

            <LeadFormDialog
                open={open}
                onClose={() => setOpen(false)}
                title={c.ctaFormTitle}
                subtitle={c.ctaFormSubtitle}
                context={context}
            />
        </div>
    );
}

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
