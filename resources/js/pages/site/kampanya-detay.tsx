import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, ArrowRight, PhoneCall, Sparkles } from 'lucide-react';

import { appointmentCtaClass } from '@/components/site/AppointmentCTA';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        eyebrow: 'Kampanya',
        home: 'Anasayfa',
        defaultCta: 'Randevu Al',
        ctaSectionEyebrow: 'Fırsatı kaçırmayın',
        ctaSectionTitle: 'Sağlığınız için ilk adımı bugün atın',
        ctaSectionSub: 'Kampanyadan yararlanmak veya sorularınız için ekibimizle iletişime geçin; en kısa sürede size dönüş yapalım.',
        callCenter: 'Bizi arayın',
        notFoundTitle: 'Kampanya bulunamadı',
        notFoundBody: 'Aradığınız kampanya sona ermiş veya yayında olmayabilir.',
        backHome: '← Anasayfaya dön',
        headFallbackTitle: 'Kampanya — Hisar Hospital',
        headFallbackDesc: 'Hisar Hospital kampanya sayfası.',
    },
    en: {
        eyebrow: 'Campaign',
        home: 'Home',
        defaultCta: 'Book Now',
        ctaSectionEyebrow: "Don't miss out",
        ctaSectionTitle: 'Take the first step for your health today',
        ctaSectionSub: 'Contact our team to benefit from the campaign or for any questions; we will get back to you as soon as possible.',
        callCenter: 'Call us',
        notFoundTitle: 'Campaign not found',
        notFoundBody: 'The campaign you are looking for may have ended or is not currently published.',
        backHome: '← Back to home',
        headFallbackTitle: 'Campaign — Hisar Hospital',
        headFallbackDesc: 'Hisar Hospital campaign page.',
    },
} as const;

type CampaignRecord = {
    title: string;
    subtitle: string;
    body: string[];
    cta_label: string;
    cta_link: string;
    hero: string | null;
    seo_title: string;
    seo_description: string;
};

export default function KampanyaDetay() {
    const { slug, record } = usePage().props as unknown as { slug: string; record?: CampaignRecord };
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();

    /* Missing record → bilingual not-found state. */
    if (!record) {
        return (
            <>
                <Head title={`${c.notFoundTitle} — Hisar Hospital`}>
                    <meta name="description" content={c.headFallbackDesc} />
                </Head>
                <div className="container-x py-24 text-center">
                    <h1 className="text-2xl font-black text-primary">{c.notFoundTitle}</h1>
                    <p className="mt-2 text-muted-foreground">{c.notFoundBody}</p>
                    <Link href={lp('/')} className="mt-6 inline-flex text-primary font-semibold">
                        {c.backHome}
                    </Link>
                </div>
            </>
        );
    }

    const title = record.seo_title || `${record.title} — Hisar Hospital`;
    const desc = record.seo_description || record.subtitle || c.headFallbackDesc;
    const ctaLabel = record.cta_label || c.defaultCta;
    const ctaLink = record.cta_link || '/randevu-al';
    const ctaInternal = ctaLink.startsWith('/');

    /* Internal links go through the localized Inertia router; external links stay plain anchors. */
    const PrimaryCta = ({ className }: { className?: string }) =>
        ctaInternal ? (
            <Link href={lp(ctaLink)} className={`${appointmentCtaClass} ${className ?? ''}`}>
                <CalendarDays className="h-4 w-4" /> {ctaLabel}
            </Link>
        ) : (
            <a href={ctaLink} className={`${appointmentCtaClass} ${className ?? ''}`}>
                <CalendarDays className="h-4 w-4" /> {ctaLabel}
            </a>
        );

    return (
        <>
            <Head title={title}>
                <meta name="description" content={desc} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={desc} />
                {record.hero && <meta property="og:image" content={record.hero} />}
                <link rel="alternate" hrefLang="tr" href={`https://app.hisarweb.test/kampanya/${slug}`} />
                <link rel="alternate" hrefLang="en" href={`https://app.hisarweb.test/en/kampanya/${slug}`} />
                <link rel="alternate" hrefLang="x-default" href={`https://app.hisarweb.test/kampanya/${slug}`} />
            </Head>

            {/* ───────────── HERO ───────────── */}
            <section className="relative overflow-hidden bg-primary text-primary-foreground">
                {record.hero && (
                    <>
                        {/* TODO: real asset — hero comes from the campaign record (upload or Unsplash). */}
                        <img
                            src={record.hero}
                            alt={record.title}
                            className="absolute inset-0 h-full w-full object-cover opacity-25"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
                    </>
                )}
                <div className="container-x relative py-16 lg:py-28">
                    <div className="max-w-3xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-brand-cyan/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-cyan ring-1 ring-brand-cyan/40">
                            <Sparkles className="h-3.5 w-3.5" /> {c.eyebrow}
                        </p>
                        <h1 className="mt-4 text-3xl lg:text-5xl font-black tracking-tight leading-[1.1]">
                            {record.title}
                        </h1>
                        {record.subtitle && (
                            <p className="mt-5 text-base lg:text-xl text-primary-foreground/85 leading-relaxed">
                                {record.subtitle}
                            </p>
                        )}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <PrimaryCta className="h-12 px-6 text-base" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────── BODY ───────────── */}
            {record.body.length > 0 && (
                <section className="container-x py-14 lg:py-20">
                    <article className="max-w-3xl mx-auto space-y-5 text-[16px] leading-[1.9] text-foreground/85">
                        {record.body.map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </article>
                </section>
            )}

            {/* ───────────── CTA / CONTACT ───────────── */}
            <section className="container-x pb-16 lg:pb-24">
                <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-primary-soft/50 via-card to-surface p-8 lg:p-12 text-center shadow-[0_10px_40px_-20px_oklch(0.28_0.16_268/0.25)]">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-orange">
                        {c.ctaSectionEyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl lg:text-3xl font-black text-primary tracking-tight">
                        {c.ctaSectionTitle}
                    </h2>
                    <p className="mt-3 text-sm lg:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {c.ctaSectionSub}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                        <PrimaryCta className="h-12 px-6 text-base" />
                        <Link
                            href={lp('/iletisim')}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 h-12 px-6 text-sm font-semibold text-primary hover:border-primary/50 hover:bg-primary-soft/40 transition"
                        >
                            <PhoneCall className="h-4 w-4" /> {c.callCenter}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

KampanyaDetay.layout = siteLayout;
