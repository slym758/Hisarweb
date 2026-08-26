import { Head, Link } from '@inertiajs/react';
import { Award, CheckCircle2, ShieldCheck, HeartPulse, Stethoscope, TrendingUp } from 'lucide-react';

import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';

const PILLAR_ICONS = [ShieldCheck, Stethoscope, HeartPulse, TrendingUp];

const COPY = {
    tr: {
        head: {
            title: 'Kalite Çalışmaları — Hisar Hospital',
            description: 'JCI akreditasyonu, hasta güvenliği, güvenli cerrahi ve sürekli iyileştirme çalışmalarımız.',
        },
        pageTitle: 'Kalite Çalışmaları',
        crumbCorporate: 'Kurumsal',
        crumbCurrent: 'Kalite Çalışmaları',
        approachEyebrow: '— Kalite Yaklaşımımız',
        approachTitle: 'Ölçen, iyileştiren ve öğrenen bir hastane',
        approachBody:
            'Klinik sonuçlar, hasta deneyimi ve süreç göstergelerini bütüncül şekilde izleriz. Elde ettiğimiz veriler; ekip eğitimleri, süreç iyileştirme projeleri ve teknoloji yatırımlarımıza yön verir. Amacımız; uluslararası standartlarda ölçülebilir, güvenli ve sürdürülebilir sağlık hizmeti sunmaktır.',
        accreditationEyebrow: 'Uluslararası Akreditasyon',
        accreditationTitle: 'JCI Akreditasyonu',
        accreditationBody:
            'Joint Commission International tarafından uluslararası hasta güvenliği ve kalite standartları çerçevesinde değerlendirilmekte ve akredite edilmekteyiz. Bu süreç, tüm klinik ve destek birimlerimizin ortak sorumluluğu ile yürütülmektedir.',
        pillarsEyebrow: '— Ana Kalite Alanları',
        pillarsTitle: 'Odaklandığımız dört alan',
        pillars: [
            {
                title: 'Hasta Güvenliği',
                desc: 'Hasta kimliğinin doğrulanması, ilaç güvenliği ve düşme risklerinin yönetimi için standart süreçler.',
            },
            {
                title: 'Güvenli Cerrahi',
                desc: 'WHO güvenli cerrahi kontrol listesi ve ekip iletişim protokolleri ile ameliyat güvenliği.',
            },
            {
                title: 'Enfeksiyon Kontrolü',
                desc: 'Enfeksiyon kontrol komitesi tarafından yürütülen izlem, sürveyans ve önleme programları.',
            },
            {
                title: 'Sürekli İyileştirme',
                desc: 'Klinik göstergeler, hasta memnuniyeti ve kök neden analizleri ile veriye dayalı iyileştirme.',
            },
        ],
        certsEyebrow: '— Kalite Belgeleri',
        certsTitle: 'Sertifikalarımız',
        certificates: [
            'JCI Akreditasyon Sertifikası',
            'ISO 9001 Kalite Yönetim Sistemi',
            'ISO 27001 Bilgi Güvenliği Yönetimi',
        ],
        certBadge: 'Belge kütüphanesi',
        certNote: 'Belge listesi periyodik olarak kurumsal doküman kütüphanesinden güncellenmektedir.',
        policiesEyebrow: '— İlgili Politikalar',
        policyInfo: 'Bilgi Güvenliği Politikamız',
        policyKvkk: 'KVKK Politikamız',
    },
    en: {
        head: {
            title: 'Quality Work — Hisar Hospital',
            description: 'Our JCI accreditation, patient safety, safe surgery and continuous improvement work.',
        },
        pageTitle: 'Quality Work',
        crumbCorporate: 'Corporate',
        crumbCurrent: 'Quality Work',
        approachEyebrow: '— Our Quality Approach',
        approachTitle: 'A hospital that measures, improves and learns',
        approachBody:
            'We monitor clinical outcomes, patient experience and process indicators holistically. The data we obtain guides our team trainings, process improvement projects and technology investments. Our aim is to provide measurable, safe and sustainable healthcare at international standards.',
        accreditationEyebrow: 'International Accreditation',
        accreditationTitle: 'JCI Accreditation',
        accreditationBody:
            'We are evaluated and accredited by Joint Commission International within the framework of international patient safety and quality standards. This process is carried out with the shared responsibility of all our clinical and support units.',
        pillarsEyebrow: '— Main Quality Areas',
        pillarsTitle: 'The four areas we focus on',
        pillars: [
            {
                title: 'Patient Safety',
                desc: 'Standard processes for patient identity verification, medication safety and fall-risk management.',
            },
            {
                title: 'Safe Surgery',
                desc: 'Surgical safety with the WHO safe surgery checklist and team communication protocols.',
            },
            {
                title: 'Infection Control',
                desc: 'Monitoring, surveillance and prevention programs conducted by the infection control committee.',
            },
            {
                title: 'Continuous Improvement',
                desc: 'Data-driven improvement through clinical indicators, patient satisfaction and root-cause analyses.',
            },
        ],
        certsEyebrow: '— Quality Documents',
        certsTitle: 'Our Certificates',
        certificates: [
            'JCI Accreditation Certificate',
            'ISO 9001 Quality Management System',
            'ISO 27001 Information Security Management',
        ],
        certBadge: 'Document library',
        certNote: 'The document list is periodically updated from the corporate document library.',
        policiesEyebrow: '— Related Policies',
        policyInfo: 'Our Information Security Policy',
        policyKvkk: 'Our KVKK Policy',
    },
} as const;

export default function Page() {
    const c = usePageCopy('kalite-calismalari', COPY[useLocale()]);
    const lp = useLocalizedPath();

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/kalite-calismalari" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/kalite-calismalari" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/kalite-calismalari" />
            </Head>

            <PageHeader title={c.pageTitle} />
            <div className="container-x pt-6">
                <Breadcrumb items={[{ label: c.crumbCorporate, to: '/kurumsal' }, { label: c.crumbCurrent }]} />
            </div>

            <article className="container-x py-10 lg:py-14 max-w-3xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">{c.approachEyebrow}</p>
                <h2 className="mt-2 text-2xl lg:text-3xl font-black tracking-tight text-primary text-balance">
                    {c.approachTitle}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.85] text-foreground/85">{c.approachBody}</p>
            </article>

            <div className="border-t border-border/60" />

            <section className="container-x py-10 lg:py-14">
                <div className="max-w-3xl">
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                        <Award className="h-3.5 w-3.5" aria-hidden /> {c.accreditationEyebrow}
                    </p>
                    <h3 className="mt-2 text-xl lg:text-2xl font-black text-primary">{c.accreditationTitle}</h3>
                    <p className="mt-3 text-[15px] leading-[1.85] text-foreground/85">{c.accreditationBody}</p>
                </div>
            </section>

            <div className="border-t border-border/60" />

            <section className="container-x py-10 lg:py-14">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">{c.pillarsEyebrow}</p>
                <h3 className="mt-2 text-xl lg:text-2xl font-black text-primary">{c.pillarsTitle}</h3>
                <div className="mt-8 grid sm:grid-cols-2 gap-x-10 gap-y-8">
                    {c.pillars.map((p, i) => {
                        const Icon = PILLAR_ICONS[i];
                        return (
                            <div key={p.title} className="flex gap-4">
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                                    <Icon className="h-5 w-5" aria-hidden />
                                </span>
                                <div>
                                    <h4 className="text-[15px] font-bold text-primary">{p.title}</h4>
                                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="border-t border-border/60" />

            <section className="container-x py-10 lg:py-14">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">{c.certsEyebrow}</p>
                <h3 className="mt-2 text-xl lg:text-2xl font-black text-primary">{c.certsTitle}</h3>
                <ul className="mt-6 divide-y divide-border/60 border-y border-border/60">
                    {c.certificates.map((cert) => (
                        <li key={cert} className="flex items-center justify-between gap-4 py-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" aria-hidden />
                                <span className="text-[15px] font-semibold text-primary truncate">{cert}</span>
                            </div>
                            <span className="text-[11px] uppercase tracking-wider text-muted-foreground shrink-0">{c.certBadge}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-4 text-[11px] text-muted-foreground">{c.certNote}</p>
            </section>

            <div className="border-t border-border/60" />

            <section className="container-x py-10 lg:py-14 max-w-3xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">{c.policiesEyebrow}</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li>
                        <Link href={lp('/bilgi-guvenligi-politikamiz')} className="text-brand-orange font-semibold hover:underline">
                            {c.policyInfo}
                        </Link>
                    </li>
                    <li>
                        <Link href={lp('/kvkk-politikamiz')} className="text-brand-orange font-semibold hover:underline">
                            {c.policyKvkk}
                        </Link>
                    </li>
                </ul>
            </section>
        </>
    );
}

Page.layout = siteLayout;
