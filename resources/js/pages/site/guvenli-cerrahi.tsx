import { Head } from '@inertiajs/react';
import { ClipboardCheck, ShieldCheck, Users, Sparkles, Activity, HeartPulse } from 'lucide-react';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale } from '@/lib/i18n';

const PILLAR_ICONS = [ClipboardCheck, Users, ShieldCheck, Activity];

const COPY = {
    tr: {
        head: {
            title: 'Güvenli Cerrahi — Hisar Hospital',
            description: 'WHO güvenli cerrahi kontrol listesi ve ekip iletişim protokolleriyle ameliyat güvenliği yaklaşımımız.',
        },
        pageTitle: 'Güvenli Cerrahi',
        pageSubtitle: 'Ameliyat güvenliğini uluslararası standartlarda güvence altına alan protokollerimiz.',
        crumbs: { kurumsal: 'Kurumsal', kalite: 'Kalite Çalışmaları', self: 'Güvenli Cerrahi' },
        heroEyebrow: 'Güvenli Cerrahi Yaklaşımımız',
        heroTitle: 'Doğru hasta, doğru taraf, doğru işlem.',
        heroBody: "Cerrahi güvenlik; kontrol listesi, ekip iletişimi ve teknoloji altyapısının birlikte çalıştığı çok katmanlı bir sistemdir. Hisar Hospital'da tüm ameliyathanelerde bu sistem standart olarak uygulanır.",
        pillarsTitle: 'Temel Uygulamalarımız',
        pillars: [
            { title: 'WHO Kontrol Listesi', desc: 'Ameliyat öncesi, sırası ve sonrasında Dünya Sağlık Örgütü güvenli cerrahi kontrol listesinin sistematik uygulanması.' },
            { title: 'Ekip İçi İletişim', desc: 'Cerrah, anestezi, hemşire ve teknisyen ekiplerinin standart brifing ve debrifing toplantıları.' },
            { title: 'Hasta Doğrulama', desc: 'Kimlik, taraf/işlem ve alerji doğrulaması dahil çift kontrol süreçleri.' },
            { title: 'Vital Takip', desc: 'Ameliyat sırası ve sonrasında ileri monitörizasyon ile hasta güvenliğinin kesintisiz izlenmesi.' },
        ],
        steps: [
            { step: '1', title: 'Sign In', desc: 'Anestezi başlamadan; kimlik, taraf, işlem, alerji ve zor havayolu değerlendirmesi.' },
            { step: '2', title: 'Time Out', desc: 'Cilt kesisinden hemen önce tüm ekiple işlem, kritik adımlar ve antibiyotik profilaksisi gözden geçirilir.' },
            { step: '3', title: 'Sign Out', desc: 'Kapanış öncesi işlem adı, alet-spanç sayımı ve numuneler doğrulanır; taburculuk planı konuşulur.' },
        ],
        resultLabel: 'Sonuç',
        resultBody: 'Güvenli cerrahi protokolleri; komplikasyon oranlarını, ameliyathane içi hataları ve istenmeyen olayları azaltmakta; hasta güvenini artırmaktadır. Süreç göstergeleri düzenli olarak izlenir ve iyileştirme projelerine dönüştürülür.',
    },
    en: {
        head: {
            title: 'Safe Surgery — Hisar Hospital',
            description: 'Our surgical safety approach with the WHO safe surgery checklist and team communication protocols.',
        },
        pageTitle: 'Safe Surgery',
        pageSubtitle: 'Our protocols that safeguard surgical safety to international standards.',
        crumbs: { kurumsal: 'Corporate', kalite: 'Quality Work', self: 'Safe Surgery' },
        heroEyebrow: 'Our Safe Surgery Approach',
        heroTitle: 'Right patient, right side, right procedure.',
        heroBody: 'Surgical safety is a multi-layered system in which the checklist, team communication and technology infrastructure work together. At Hisar Hospital, this system is applied as standard in all operating rooms.',
        pillarsTitle: 'Our Core Practices',
        pillars: [
            { title: 'WHO Checklist', desc: 'Systematic application of the World Health Organization safe surgery checklist before, during and after the operation.' },
            { title: 'Team Communication', desc: 'Standard briefing and debriefing meetings of the surgeon, anaesthesia, nurse and technician teams.' },
            { title: 'Patient Verification', desc: 'Double-check processes including identity, side/procedure and allergy verification.' },
            { title: 'Vital Monitoring', desc: 'Continuous monitoring of patient safety with advanced monitorization during and after the operation.' },
        ],
        steps: [
            { step: '1', title: 'Sign In', desc: 'Before anaesthesia begins; assessment of identity, side, procedure, allergy and difficult airway.' },
            { step: '2', title: 'Time Out', desc: 'Immediately before the skin incision, the procedure, critical steps and antibiotic prophylaxis are reviewed with the whole team.' },
            { step: '3', title: 'Sign Out', desc: 'Before closure, the procedure name, instrument-swab count and specimens are verified; the discharge plan is discussed.' },
        ],
        resultLabel: 'Outcome',
        resultBody: 'Safe surgery protocols reduce complication rates, intraoperative errors and adverse events, and increase patient trust. Process indicators are monitored regularly and turned into improvement projects.',
    },
} as const;

export default function GuvenliCerrahi() {
    const c = COPY[useLocale()];
    const pillars = c.pillars.map((p, i) => ({ ...p, icon: PILLAR_ICONS[i] }));
    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/guvenli-cerrahi" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/guvenli-cerrahi" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/guvenli-cerrahi" />
            </Head>

            <PageHeader title={c.pageTitle} subtitle={c.pageSubtitle} />
            <Breadcrumb items={[{ label: c.crumbs.kurumsal, to: '/kurumsal' }, { label: c.crumbs.kalite, to: '/kalite-calismalari' }, { label: c.crumbs.self }]} />

            <section className="py-10 lg:py-14">
                <div className="container-x space-y-10">
                    <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-6 lg:p-10">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 opacity-90"><Sparkles className="h-4 w-4" aria-hidden /> {c.heroEyebrow}</div>
                        <h2 className="text-2xl lg:text-3xl font-black">{c.heroTitle}</h2>
                        <p className="mt-3 max-w-3xl text-sm lg:text-base text-primary-foreground/85">{c.heroBody}</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-primary mb-4">{c.pillarsTitle}</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {pillars.map((p) => (
                                <article key={p.title} className="hover-lift rounded-2xl border border-border/70 bg-gradient-card p-5">
                                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft"><p.icon className="h-5 w-5 text-primary" aria-hidden /></span>
                                    <h4 className="mt-3 text-[15px] font-bold text-primary">{p.title}</h4>
                                    <p className="mt-1.5 text-xs text-muted-foreground">{p.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-4">
                        {c.steps.map((s) => (
                            <article key={s.step} className="relative rounded-2xl border border-border/70 bg-card p-5">
                                <span className="absolute -top-3 left-5 h-8 w-8 rounded-full bg-brand-orange text-brand-orange-foreground text-[13px] font-bold flex items-center justify-center shadow-orange">{s.step}</span>
                                <h4 className="mt-2 text-[15px] font-bold text-primary">{s.title}</h4>
                                <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
                            </article>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-primary-soft/40 p-6">
                        <div className="flex items-center gap-2 mb-2"><HeartPulse className="h-4 w-4 text-brand-orange" /> <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">{c.resultLabel}</p></div>
                        <p className="text-sm text-foreground/85 max-w-3xl">{c.resultBody}</p>
                    </div>
                </div>
            </section>
        </>
    );
}

GuvenliCerrahi.layout = siteLayout;
