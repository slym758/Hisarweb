import { Head } from '@inertiajs/react';
import {
    Award,
    HeartPulse,
    ShieldCheck,
    Sparkles,
    Leaf,
    Users,
    Scale,
    Activity,
    GraduationCap,
    TrendingUp,
    CheckCircle2,
} from 'lucide-react';

import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale } from '@/lib/i18n';

const VALUE_ICONS = [HeartPulse, ShieldCheck, Scale, Leaf];
const STAT_VALUES = ['20+', '50+', '3', 'JCI'];
const QUALITY_CARD_ICONS = [Activity, Users, GraduationCap, TrendingUp, ShieldCheck, Sparkles];

const COPY = {
    tr: {
        head: {
            title: 'Kurumsal — Hisar Hospital Intercontinental',
            description:
                "Hisar Hospital Intercontinental'in vizyonu, misyonu, değerleri ve kalite politikası. Hayat boyu sağlık anlayışıyla referans bir sağlık kurumu.",
        },
        pageTitle: 'Kurumsal',
        aboutBadge: 'Hakkımızda',
        aboutTitle: 'Hayat boyu sağlık anlayışıyla yanınızdayız',
        aboutP1:
            'Hisar Hospital Intercontinental olarak ilk önceliğimiz her zaman hastalarımızı sağlığına kavuşturmaktır. Hastalarımızı ve onların değerli ailelerini hastanemizin kapısından girdikleri ilk andan itibaren tedavi ve sonrasındaki süreçlerinde özenle dinliyor; konfor ve memnuniyetlerini arttırmak için elimizden gelen tüm çabayı gösteriyoruz.',
        aboutP2:
            'Modern teknolojiyi akademik kadromuz ve hasta odaklı hizmet anlayışımızla birleştirerek; uluslararası kalite standartlarında, kişiselleştirilmiş bir sağlık deneyimi sunuyoruz.',
        statLabels: ['Yıllık tecrübe', 'Branş', 'Hastane', 'Akreditasyon'],
        valuesBadge: 'Değerlerimiz',
        valuesTitle: 'Her temasta hissettirdiğimiz dört temel ilke',
        valuesDesc:
            'Hisar Hospital deneyiminin temelinde, hastalarımıza ve topluma karşı sorumluluğumuzu tanımlayan değerler yer alır.',
        values: [
            {
                title: 'Hastalarımıza Değer Veriyoruz',
                body: 'Sorumluluk, duyarlılık ve paylaşma bilinciyle; hastalarımızı ve ailelerini başvurdukları andan taburcu olana dek özenle dinler, yanlarında oluruz.',
            },
            {
                title: 'Güvenliğinizi Önemsiyoruz',
                body: 'Hasta, refakatçi ve çalışan güvenliğini esas alırız. Önlenebilir hataları en aza indirmek için tüm riskleri sistematik biçimde gözden geçiririz.',
            },
            {
                title: 'Haklarınıza Sahip Çıkıyoruz',
                body: 'Hasta hak ve sorumlulukları konusunda açık ve yeterli bilgi sunar; ayrım gözetmeksizin haklarınızı koruruz.',
            },
            {
                title: 'Topluma ve Çevreye Duyarlıyız',
                body: 'Doğal kaynakları korur, atıklarımızı kontrol altında tutar, çevreye olan sorumluluğumuzu kurumsal bir kültür olarak yaşatırız.',
            },
        ],
        qualityBadge: 'Kalite Politikamız',
        qualityTitle: 'Uluslararası standartlarda, sürekli gelişen hizmet',
        qualityDesc:
            'Kalite Yönetim Sistemi şartlarından ödün vermeden, ölçülebilir hedeflerle ilerleyen bir hizmet kültürünü esas alırız.',
        qualityCards: ['Modern tıp', 'Çalışan', 'Eğitim', 'Performans', 'KYS', 'Gelişim'],
        quality: [
            'Çağdaş tıbbın gerektirdiği modern teknoloji ile kaliteli sağlık hizmeti sunmak',
            'Halk sağlığını koruyucu ve geliştirici çalışmalar yapmak',
            'Çalışan memnuniyetini ve eğitimini sürekli artırmak',
            'Optimum mali performansı sağlamak',
            'Kalite Yönetim Sistemi şartlarından ödün vermemek, etkinliğini sürekli artırmak',
            'Sürekli gelişimi sağlamak',
        ],
    },
    en: {
        head: {
            title: 'Corporate — Hisar Hospital Intercontinental',
            description:
                'The vision, mission, values and quality policy of Hisar Hospital Intercontinental. A reference healthcare institution with a lifelong health approach.',
        },
        pageTitle: 'Corporate',
        aboutBadge: 'About Us',
        aboutTitle: 'By your side with a lifelong health approach',
        aboutP1:
            'As Hisar Hospital Intercontinental, our first priority is always to restore our patients to health. From the very first moment our patients and their valued families step through our doors, we listen to them carefully throughout treatment and the processes that follow; we make every effort to increase their comfort and satisfaction.',
        aboutP2:
            'By combining modern technology with our academic team and patient-focused service approach, we offer a personalized healthcare experience at international quality standards.',
        statLabels: ['Years of experience', 'Specialties', 'Hospitals', 'Accreditation'],
        valuesBadge: 'Our Values',
        valuesTitle: 'Four core principles we convey at every touchpoint',
        valuesDesc:
            'At the heart of the Hisar Hospital experience lie the values that define our responsibility to our patients and to society.',
        values: [
            {
                title: 'We Value Our Patients',
                body: 'With a sense of responsibility, sensitivity and sharing, we listen carefully to our patients and their families from the moment they apply until discharge, and we stand by them.',
            },
            {
                title: 'We Care About Your Safety',
                body: 'We prioritize the safety of patients, companions and staff. We systematically review all risks to minimize preventable errors.',
            },
            {
                title: 'We Uphold Your Rights',
                body: 'We provide clear and adequate information about patient rights and responsibilities; we protect your rights without discrimination.',
            },
            {
                title: 'We Care for Society and the Environment',
                body: 'We protect natural resources, keep our waste under control, and sustain our responsibility to the environment as a corporate culture.',
            },
        ],
        qualityBadge: 'Our Quality Policy',
        qualityTitle: 'Continuously improving service at international standards',
        qualityDesc:
            'We embrace a service culture that advances with measurable goals, without compromising on Quality Management System requirements.',
        qualityCards: ['Modern medicine', 'Staff', 'Training', 'Performance', 'QMS', 'Improvement'],
        quality: [
            'To provide quality healthcare with the modern technology required by contemporary medicine',
            'To carry out work that protects and improves public health',
            'To continuously increase employee satisfaction and training',
            'To achieve optimum financial performance',
            'To never compromise on Quality Management System requirements and continuously improve its effectiveness',
            'To ensure continuous improvement',
        ],
    },
} as const;

export default function KurumsalPage() {
    const locale = useLocale();
    const c = COPY[locale];

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/kurumsal" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/kurumsal" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/kurumsal" />
            </Head>

            <PageHeader title={c.pageTitle} />

            {/* Intro */}
            <section id="hakkimizda" className="py-12 lg:py-16 scroll-mt-24">
                <div className="container-x grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                            <Sparkles className="h-3.5 w-3.5" /> {c.aboutBadge}
                        </span>
                        <h2 className="mt-4 text-3xl lg:text-4xl font-black tracking-tight text-primary text-balance">
                            {c.aboutTitle}
                        </h2>
                        <p className="mt-5 text-muted-foreground leading-relaxed">{c.aboutP1}</p>
                        <p className="mt-4 text-muted-foreground leading-relaxed">{c.aboutP2}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {STAT_VALUES.map((value, i) => (
                            <div
                                key={c.statLabels[i]}
                                className="rounded-2xl border border-border/70 bg-card p-5 lg:p-6"
                            >
                                <p className="text-3xl lg:text-4xl font-black text-primary tracking-tight">{value}</p>
                                <p className="mt-1 text-xs lg:text-sm font-medium text-muted-foreground">
                                    {c.statLabels[i]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vizyon & Misyon has moved to /vizyon-misyon */}

            {/* Değerlerimiz */}
            <section id="degerlerimiz" className="py-12 lg:py-20 scroll-mt-24">
                <div className="container-x">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                            <HeartPulse className="h-3.5 w-3.5" /> {c.valuesBadge}
                        </span>
                        <h2 className="mt-4 text-3xl lg:text-4xl font-black tracking-tight text-primary text-balance">
                            {c.valuesTitle}
                        </h2>
                        <p className="mt-3 text-muted-foreground">{c.valuesDesc}</p>
                    </div>

                    <div className="mt-8 lg:mt-10 grid sm:grid-cols-2 gap-4 lg:gap-5">
                        {c.values.map((v, i) => {
                            const Icon = VALUE_ICONS[i];
                            return (
                                <article
                                    key={v.title}
                                    className="group relative rounded-2xl border border-border/70 bg-card p-6 lg:p-7 transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="mt-4 text-lg font-bold text-primary tracking-tight">{v.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Kalite Politikası */}
            <section id="kalite-politikamiz" className="py-12 lg:py-20 bg-surface scroll-mt-24">
                <div className="container-x grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 items-start">
                    <div className="lg:sticky lg:top-36">
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                            <Award className="h-3.5 w-3.5" /> {c.qualityBadge}
                        </span>
                        <h2 className="mt-4 text-3xl lg:text-4xl font-black tracking-tight text-primary text-balance">
                            {c.qualityTitle}
                        </h2>
                        <p className="mt-4 text-muted-foreground leading-relaxed">{c.qualityDesc}</p>

                        <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
                            {QUALITY_CARD_ICONS.map((Icon, i) => (
                                <div
                                    key={c.qualityCards[i]}
                                    className="rounded-xl border border-border/70 bg-card p-3 text-center"
                                >
                                    <Icon className="mx-auto h-4 w-4 text-primary" />
                                    <p className="mt-1.5 text-[11px] font-semibold text-primary">{c.qualityCards[i]}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ol className="space-y-3">
                        {c.quality.map((q, i) => (
                            <li
                                key={q}
                                className="flex gap-4 rounded-2xl border border-border/70 bg-card p-5 lg:p-6"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-black">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div className="flex-1">
                                    <p className="text-[15px] lg:text-base font-semibold text-primary leading-snug">{q}</p>
                                </div>
                                <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0" />
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        </>
    );
}

KurumsalPage.layout = siteLayout;
