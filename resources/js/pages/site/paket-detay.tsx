import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    CalendarDays, ArrowRight, CheckCircle2, Clock, ClipboardList, ChevronRight, Home,
    MessageSquare, Send, Info,
} from 'lucide-react';

import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath, type Locale } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { getPackageBySlug } from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        home: 'Anasayfa',
        crumbPackages: 'Paketler & Check-Up',
        eyebrow: 'Paket',
        appointment: 'Randevu Al',
        scopeTitle: 'Paket Kapsamı',
        sidebar: {
            eyebrow: 'Randevu',
            applicationLabel: 'Uygulama',
            applicationBody: 'Paketler randevu ile ve önceden planlama yapılarak uygulanır. Detaylı bilgi ve uygun tarihler için iletişim merkezimizle iletişime geçebilirsiniz.',
            otherPackages: 'Diğer paketler',
        },
        contact: {
            eyebrow: 'İletişim',
            subtitle: 'Sorularınız için formu doldurun; ekibimiz en kısa sürede sizi arasın.',
            name: 'Ad Soyad',
            phone: 'Telefon',
            message: 'Mesajınız',
            kvkk: 'KVKK aydınlatma metnini okudum, kişisel verilerimin işlenmesine onay veriyorum.',
            send: 'Gönder',
            prototype: 'Bu form tasarım prototipidir; gönderim aktif değildir.',
        },
        notFound: {
            body: 'Bu paket için detay sayfası henüz hazır değil.',
            back: '← Tüm paketler',
        },
        headFallbackTitle: 'Paket',
        headFallbackDesc: 'Hisar Hospital paket detay sayfası.',
    },
    en: {
        home: 'Home',
        crumbPackages: 'Packages & Check-Up',
        eyebrow: 'Package',
        appointment: 'Book Appointment',
        scopeTitle: 'Package Scope',
        sidebar: {
            eyebrow: 'Appointment',
            applicationLabel: 'Application',
            applicationBody: 'Packages are carried out by appointment and with advance planning. For detailed information and available dates, you can contact our communication centre.',
            otherPackages: 'Other packages',
        },
        contact: {
            eyebrow: 'Contact',
            subtitle: 'Fill in the form with your questions; our team will call you back as soon as possible.',
            name: 'Full Name',
            phone: 'Phone',
            message: 'Your Message',
            kvkk: 'I have read the KVKK privacy notice and consent to the processing of my personal data.',
            send: 'Send',
            prototype: 'This form is a design prototype; submission is not active.',
        },
        notFound: {
            body: 'The detail page for this package is not ready yet.',
            back: '← All packages',
        },
        headFallbackTitle: 'Package',
        headFallbackDesc: 'Hisar Hospital package detail page.',
    },
} as const;

export default function PackageDetail() {
    const { slug } = usePage().props as unknown as { slug: string };
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const pkg = getPackageBySlug(slug, locale);

    /* Missing package → bilingual not-found state. */
    if (!pkg) {
        return (
            <>
                <Head title={`${c.headFallbackTitle} — Hisar Hospital`}>
                    <meta name="description" content={c.headFallbackDesc} />
                </Head>
                <div className="container-x py-24 text-center">
                    <p className="text-muted-foreground">{c.notFound.body}</p>
                    <Link href={lp('/paketler')} className="mt-4 inline-flex text-primary font-semibold">
                        {c.notFound.back}
                    </Link>
                </div>
            </>
        );
    }

    const heading = pkg.name;
    const title = `${heading} — Hisar Hospital`;
    const desc = pkg.summary;

    return (
        <>
            <Head title={title}>
                <meta name="description" content={desc} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={desc} />
                <meta property="og:image" content={pkg.cover} />
                <link rel="alternate" hrefLang="tr" href={`https://app.hisarweb.test/paketler/${slug}`} />
                <link rel="alternate" hrefLang="en" href={`https://app.hisarweb.test/en/paketler/${slug}`} />
                <link rel="alternate" hrefLang="x-default" href={`https://app.hisarweb.test/paketler/${slug}`} />
            </Head>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="border-b border-border/60 bg-surface/50">
                <div className="container-x py-3 flex items-center gap-1.5 text-[12px] lg:text-[13px] text-muted-foreground overflow-x-auto scrollbar-thin">
                    <Link href={lp('/')} className="inline-flex items-center gap-1 hover:text-primary transition">
                        <Home className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{c.home}</span>
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <Link href={lp('/paketler')} className="hover:text-primary transition whitespace-nowrap">
                        {c.crumbPackages}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="text-primary font-semibold whitespace-nowrap truncate max-w-[45vw]">{heading}</span>
                </div>
            </nav>

            <section className="container-x py-6 lg:py-10">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                    <div>
                        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-brand-orange">
                            <span className="h-[2px] w-6 bg-brand-orange" /> {c.eyebrow}
                        </p>
                        <h1 className="mt-2 text-2xl lg:text-4xl font-black text-primary tracking-tight">
                            {heading}
                        </h1>
                        <p className="mt-3 text-sm lg:text-base text-muted-foreground leading-relaxed">
                            {pkg.summary}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <AppointmentCTA href={settings.appointment_url}>
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </AppointmentCTA>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-border shadow-card">
                        {/* TODO: real asset — cover comes from content-data (temporary Unsplash imagery). */}
                        <img src={pkg.cover} alt={heading} loading="lazy" className="w-full aspect-[16/10] object-cover" />
                    </div>
                </div>
            </section>

            <section className="container-x pb-16 lg:pb-24 grid lg:grid-cols-[1fr_320px] gap-10">
                <article className="min-w-0 max-w-3xl space-y-10">
                    <section>
                        <h2 className="text-lg lg:text-xl font-black text-primary tracking-tight">{c.scopeTitle}</h2>
                        <div className="mt-3 grid gap-3">
                            <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
                                <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-primary">
                                    <ClipboardList className="h-4 w-4 text-brand-orange" /> {c.scopeTitle}
                                </p>
                                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                                    {pkg.scope.map((it) => (
                                        <li key={it} className="flex items-start gap-2 text-[13px] text-foreground/85">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                                            <span>{it}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <BizeUlasin heading={heading} locale={locale} />
                </article>

                <aside className="min-w-0">
                    <div className="lg:sticky lg:top-36 space-y-4">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-brand-orange">{c.sidebar.eyebrow}</p>
                            <h3 className="mt-1 text-lg font-black text-primary leading-tight">
                                {locale === 'tr' ? `${heading} için görüşün` : `Talk to us about ${heading}`}
                            </h3>
                            <AppointmentCTA href={settings.appointment_url} className="mt-3 h-11 w-full">
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </AppointmentCTA>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5">
                            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" /> {c.sidebar.applicationLabel}
                            </p>
                            <p className="mt-1.5 text-[13px] text-primary leading-relaxed">
                                {c.sidebar.applicationBody}
                            </p>
                            <Link
                                href={lp('/paketler')}
                                className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-brand-orange"
                            >
                                {c.sidebar.otherPackages} <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </aside>
            </section>
        </>
    );
}

PackageDetail.layout = siteLayout;

/**
 * Universal "Bize Ulaşın" contact block for detail pages.
 * Passive prototype — no backend wiring.
 */
function BizeUlasin({ heading, locale }: { heading: string; locale: Locale }) {
    const c = COPY[locale];
    const title = locale === 'tr' ? `${heading} — Bize Ulaşın` : `${heading} — Contact Us`;
    const prefill = locale === 'tr'
        ? `${heading} hakkında bilgi almak istiyorum.`
        : `I would like to get information about ${heading}.`;
    const [form, setForm] = useState({ name: '', phone: '', message: prefill, kvkk: false });

    return (
        <section className="rounded-3xl border border-border/70 bg-gradient-to-br from-primary-soft/40 via-card to-surface p-6 lg:p-8 shadow-[0_8px_30px_-16px_oklch(0.28_0.16_268/0.15)]">
            <div className="flex items-start gap-3">
                <span className="hidden sm:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <MessageSquare className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-orange">{c.contact.eyebrow}</p>
                    <h3 className="mt-1 text-lg lg:text-2xl font-black text-primary tracking-tight leading-tight">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-lg">{c.contact.subtitle}</p>
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="text-[12px] font-semibold text-primary/90">
                    {c.contact.name}
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="mt-1 w-full rounded-xl bg-card border border-border h-11 px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                    />
                </label>
                <label className="text-[12px] font-semibold text-primary/90">
                    {c.contact.phone}
                    <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="mt-1 w-full rounded-xl bg-card border border-border h-11 px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                    />
                </label>
                <label className="sm:col-span-2 text-[12px] font-semibold text-primary/90">
                    {c.contact.message}
                    <textarea
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="mt-1 w-full rounded-xl bg-card border border-border px-3 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                    />
                </label>
                <label className="sm:col-span-2 flex items-start gap-2 text-[12px] text-muted-foreground">
                    <input
                        type="checkbox"
                        checked={form.kvkk}
                        onChange={(e) => setForm({ ...form, kvkk: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-border"
                    />
                    <span>{c.contact.kvkk}</span>
                </label>
                <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                    <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-5 py-2.5 text-sm font-bold text-brand-orange-foreground shadow-orange opacity-60 cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" /> {c.contact.send}
                    </button>
                    <span className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                        <Info className="h-3.5 w-3.5" /> {c.contact.prototype}
                    </span>
                </div>
            </form>
        </section>
    );
}
