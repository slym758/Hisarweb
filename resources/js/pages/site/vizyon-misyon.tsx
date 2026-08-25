import { Head, Link } from '@inertiajs/react';
import { Compass, Target, Quote, ArrowRight, ShieldCheck, HeartPulse, Users, Sparkles } from 'lucide-react';

import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { useLocale, useLocalizedPath } from '@/lib/i18n';

const PRINCIPLE_ICONS = [HeartPulse, ShieldCheck, Users, Sparkles];

const COPY = {
    tr: {
        head: {
            title: 'Vizyonumuz ve Misyonumuz — Hisar Hospital',
            description: "Hisar Hospital'ın vizyonu, misyonu ve her temasta hissettirdiği temel ilkeler.",
        },
        pageTitle: 'Vizyonumuz ve Misyonumuz',
        crumbCorporate: 'Kurumsal',
        crumbCurrent: 'Vizyonumuz ve Misyonumuz',
        visionLabel: 'Vizyonumuz',
        visionText:
            'İnsan hayatına sonsuz saygı duyarak; dünya standartlarında modern, kapsamlı ve güvenilir hizmet veren referans sağlık kurumu olmak.',
        missionLabel: 'Misyonumuz',
        missionText:
            'Modern teknolojiyi kaliteli ve etkin bir hizmet anlayışıyla birleştirerek insanları sağlıklı yaşama kavuşturmak.',
        missionSub: 'Her tedavi yolculuğunda bilim, şefkat ve teknolojiyi aynı masada buluşturuyoruz.',
        principlesEyebrow: '— Temel ilkelerimiz',
        principlesTitle: 'Her temasta hissettirdiğimiz ilkeler',
        principles: [
            { title: 'İnsan odaklı', desc: 'Her tedavi yolculuğunda hastanın deneyimini merkeze alıyoruz.' },
            { title: 'Güvenli hizmet', desc: 'JCI standartlarında, ölçülebilir sonuçlarla ilerliyoruz.' },
            { title: 'Ekip çalışması', desc: 'Multidisipliner ekiplerle bütüncül bakım sunuyoruz.' },
            { title: 'Sürekli gelişim', desc: 'Bilim ve teknolojiyi güncel tutan bir öğrenme kültürü.' },
        ],
        ctaTitle: 'Değerlerimiz ve Kalite Politikamız',
        ctaDesc: 'Kurumsal sayfamızdan detayları inceleyebilirsiniz.',
        ctaLink: 'Kurumsal',
    },
    en: {
        head: {
            title: 'Vision & Mission — Hisar Hospital',
            description: "Hisar Hospital's vision, mission and the core principles it conveys at every touchpoint.",
        },
        pageTitle: 'Vision & Mission',
        crumbCorporate: 'Corporate',
        crumbCurrent: 'Vision & Mission',
        visionLabel: 'Our Vision',
        visionText:
            'To be a reference healthcare institution that, with infinite respect for human life, provides modern, comprehensive and reliable service at world standards.',
        missionLabel: 'Our Mission',
        missionText:
            'To restore people to healthy living by combining modern technology with a quality and effective service approach.',
        missionSub: 'On every treatment journey, we bring science, compassion and technology to the same table.',
        principlesEyebrow: '— Our core principles',
        principlesTitle: 'The principles we convey at every touchpoint',
        principles: [
            { title: 'Human-focused', desc: "We place the patient's experience at the center of every treatment journey." },
            { title: 'Safe service', desc: 'We advance with measurable results at JCI standards.' },
            { title: 'Teamwork', desc: 'We provide holistic care with multidisciplinary teams.' },
            { title: 'Continuous improvement', desc: 'A learning culture that keeps science and technology up to date.' },
        ],
        ctaTitle: 'Our Values and Quality Policy',
        ctaDesc: 'You can review the details on our Corporate page.',
        ctaLink: 'Corporate',
    },
} as const;

export default function Page() {
    const c = COPY[useLocale()];
    const lp = useLocalizedPath();

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/vizyon-misyon" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/vizyon-misyon" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/vizyon-misyon" />
            </Head>

            <PageHeader title={c.pageTitle} />
            <div className="container-x pt-6">
                <Breadcrumb items={[{ label: c.crumbCorporate, to: '/kurumsal' }, { label: c.crumbCurrent }]} />
            </div>

            <section className="py-10 lg:py-16">
                <div className="container-x grid md:grid-cols-2 gap-5 lg:gap-6">
                    <article className="relative overflow-hidden rounded-3xl bg-gradient-primary text-primary-foreground p-7 lg:p-10 shadow-brand">
                        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-brand-cyan/15 blur-3xl" aria-hidden />
                        <Compass className="h-10 w-10 text-brand-cyan" aria-hidden />
                        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-cyan">{c.visionLabel}</p>
                        <Quote className="mt-3 h-5 w-5 text-primary-foreground/40" aria-hidden />
                        <p className="mt-2 text-xl lg:text-2xl font-semibold leading-snug tracking-tight text-balance">
                            {c.visionText}
                        </p>
                    </article>

                    <article className="relative overflow-hidden rounded-3xl bg-card border border-border/70 p-7 lg:p-10">
                        <Target className="h-10 w-10 text-brand-orange" aria-hidden />
                        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-orange">{c.missionLabel}</p>
                        <p className="mt-3 text-xl lg:text-2xl font-semibold leading-snug tracking-tight text-primary text-balance">
                            {c.missionText}
                        </p>
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{c.missionSub}</p>
                    </article>
                </div>
            </section>

            <section className="py-10 lg:py-16 bg-surface/40 border-t border-border/60">
                <div className="container-x">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">{c.principlesEyebrow}</p>
                    <h2 className="mt-2 text-2xl lg:text-3xl font-black tracking-tight text-primary text-balance max-w-2xl">
                        {c.principlesTitle}
                    </h2>
                    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {c.principles.map((p, i) => {
                            const Icon = PRINCIPLE_ICONS[i];
                            return (
                                <article key={p.title} className="rounded-2xl border border-border/70 bg-card p-5">
                                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                                        <Icon className="h-5 w-5" aria-hidden />
                                    </span>
                                    <h3 className="mt-3 text-[15px] font-bold text-primary">{p.title}</h3>
                                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                                </article>
                            );
                        })}
                    </div>

                    <div className="mt-10 rounded-2xl border border-border/70 bg-primary-soft/40 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h3 className="text-base font-bold text-primary">{c.ctaTitle}</h3>
                            <p className="text-sm text-muted-foreground">{c.ctaDesc}</p>
                        </div>
                        <Link
                            href={lp('/kurumsal')}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:bg-primary/90 transition"
                        >
                            {c.ctaLink} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

Page.layout = siteLayout;
