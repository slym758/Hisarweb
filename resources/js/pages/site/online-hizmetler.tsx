import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, MonitorPlay, Stethoscope, MessageCircleQuestion, ClipboardList, PhoneCall, Ear, FileText } from 'lucide-react';

import { siteLayout, PageHeader } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';

const HISAR_ONLINE_URL = 'https://online.hisarhospital.com/#/';

/* Static (locale-independent) service meta — text lives in COPY.services. */
type ServiceMeta = {
    id: string;
    icon: typeof MonitorPlay;
    href?: string;
    external?: boolean;
    to?: string;
};

const SERVICE_META: ServiceMeta[] = [
    { id: 'hisar-online', icon: MonitorPlay, href: HISAR_ONLINE_URL, external: true },
    { id: 'online-doktor', icon: Stethoscope, href: HISAR_ONLINE_URL, external: true },
    { id: 'doktora-sorun', icon: MessageCircleQuestion, to: '/doktora-sorun' },
    { id: 'anketimize-katilin', icon: ClipboardList, to: '/anketimize-katilin' },
    { id: 'sizi-arayalim', icon: PhoneCall, to: '/sizi-arayalim' },
    { id: 'sizi-dinliyoruz', icon: Ear, to: '/sizi-dinliyoruz' },
    { id: 'e-sonuc', icon: FileText, href: 'https://online.hisarhospital.com/#/', external: true },
];

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Online Hizmetler — Hisar Hospital',
            description: 'Hisar Online, Online Doktor, Doktora Sorun, anket, geri arama ve geri bildirim — dijital sağlık hizmetlerimiz.',
        },
        pageTitle: 'Online Hizmetler',
        pageSubtitle: 'Sağlık deneyiminizi dijital olarak kolaylaştıran araçlarımız.',
        goToService: 'Hizmete git',
        services: {
            'hisar-online': { title: 'Hisar Online', desc: 'Online doktor görüşmeleri, sonuç takibi ve dijital sağlık servisleri.' },
            'online-doktor': { title: 'Online Doktor', desc: 'Uzman hekimlerimizle uzaktan görüntülü konsültasyon.' },
            'doktora-sorun': { title: 'Doktora Sorun', desc: 'Sağlığınızla ilgili sorularınızı uzmanlarımıza iletin.' },
            'anketimize-katilin': { title: 'Anketimize Katılın', desc: 'Hizmet kalitemizi birlikte geliştirelim; deneyiminizi paylaşın.' },
            'sizi-arayalim': { title: 'Sizi Arayalım', desc: 'Numaranızı bırakın, iletişim merkezimiz en kısa sürede sizi arasın.' },
            'sizi-dinliyoruz': { title: 'Sizi Dinliyoruz', desc: 'Görüş, öneri ve geri bildirimlerinizi bizimle paylaşın.' },
            'e-sonuc': { title: 'E-Sonuç', desc: 'Laboratuvar ve tetkik sonuçlarınıza online güvenli erişim.' },
        },
    },
    en: {
        head: {
            title: 'Online Services — Hisar Hospital',
            description: 'Hisar Online, Online Doctor, Ask a Doctor, survey, call-back and feedback — our digital health services.',
        },
        pageTitle: 'Online Services',
        pageSubtitle: 'Our tools that make your health experience easier, digitally.',
        goToService: 'Go to service',
        services: {
            'hisar-online': { title: 'Hisar Online', desc: 'Online doctor consultations, result tracking and digital health services.' },
            'online-doktor': { title: 'Online Doctor', desc: 'Remote video consultation with our expert physicians.' },
            'doktora-sorun': { title: 'Ask a Doctor', desc: 'Send your health questions to our specialists.' },
            'anketimize-katilin': { title: 'Take Our Survey', desc: 'Let’s improve our service quality together; share your experience.' },
            'sizi-arayalim': { title: 'We’ll Call You', desc: 'Leave your number and our contact centre will call you shortly.' },
            'sizi-dinliyoruz': { title: 'We’re Listening', desc: 'Share your opinions, suggestions and feedback with us.' },
            'e-sonuc': { title: 'E-Results', desc: 'Secure online access to your laboratory and test results.' },
        },
    },
} as const;

export default function OnlineServices() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const services = SERVICE_META.map((m) => ({ ...m, ...c.services[m.id as keyof typeof c.services] }));

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/online-hizmetler" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/online-hizmetler" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/online-hizmetler" />
            </Head>

            <PageHeader title={c.pageTitle} subtitle={c.pageSubtitle} />
            <section className="py-12 lg:py-16">
                <div className="container-x grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((s) => {
                        const cardClass =
                            'group relative hover-lift rounded-2xl border border-border/70 bg-gradient-card p-6 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60';
                        const inner = (
                            <>
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-brand">
                                    <s.icon className="h-5 w-5" />
                                </span>
                                <h3 className="mt-4 text-[15px] font-bold text-primary">{s.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground flex-1">{s.desc}</p>
                                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-orange">
                                    {c.goToService} {s.external ? <ArrowUpRight className="h-3 w-3" /> : <span aria-hidden>→</span>}
                                </span>
                            </>
                        );
                        return s.external ? (
                            <a key={s.id} id={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                                {inner}
                            </a>
                        ) : (
                            <Link key={s.id} id={s.id} href={lp(s.to!)} className={cardClass}>
                                {inner}
                            </Link>
                        );
                    })}
                </div>
            </section>
        </>
    );
}

OnlineServices.layout = siteLayout;
