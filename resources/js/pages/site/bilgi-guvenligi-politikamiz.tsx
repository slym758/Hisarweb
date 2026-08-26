import { Head, Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';

/* Stable anchor ids for the mapped privacy-term sections. */
const PRIVACY_IDS = ['amac', 'kullanim', 'gizlilik', 'cerezler', 'haklar', 'sorumluluk', 'guncelleme'] as const;

/* Related-policy links — locale-agnostic targets (labels live in COPY). */
const RELATED_LINKS = [{ to: '/kvkk-politikamiz' }, { to: '/kalite-calismalari' }] as const;

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Bilgi Güvenliği Politikamız — Hisar Hospital',
            description: 'Hisar Hospital bilgi güvenliği politikası, sorumluluklar ve ana ilkeler.',
        },
        header: 'Bilgi Güvenliği Politikamız',
        crumbCorporate: 'Kurumsal',
        crumbSelf: 'Bilgi Güvenliği Politikamız',
        docInfoTitle: 'Doküman Bilgisi',
        docRows: [
            ['Doküman', 'Bilgi Güvenliği Politikası'],
            ['Doküman Kodu', 'BGP-01 (örnek)'],
            ['Yayın Tarihi', '01.01.2024 (örnek)'],
            ['Revizyon Tarihi', '01.06.2024 (örnek)'],
            ['Revizyon No', '01 (örnek)'],
        ],
        docNote: 'Doküman bilgileri örnek olarak gösterilmektedir; nihai kurumsal doküman kütüphanesindeki değerlerle güncellenecektir.',
        intro: {
            purpose: {
                kicker: 'Politikanın Amacı',
                title: 'Bilgi varlıklarımızı korumak',
                body: 'Hisar Hospital olarak; hasta, çalışan ve kurumsal bilgi varlıklarının gizliliğini, bütünlüğünü ve erişilebilirliğini korumak; ilgili yasal düzenlemelere ve uluslararası kabul görmüş bilgi güvenliği standartlarına uygun süreçler yürütmek temel taahhüdümüzdür.',
            },
            principles: {
                kicker: 'Ana Maddeler',
                title: 'Temel ilkelerimiz',
                items: [
                    'Bilgi varlıklarının tanımlanması, sınıflandırılması ve risk değerlendirmesi yapılır.',
                    'Erişim yetkileri yalnızca görevin gerektirdiği ölçüde tanımlanır (en az ayrıcalık ilkesi).',
                    'Bilgi güvenliği farkındalık eğitimleri düzenli olarak tekrarlanır.',
                    'Olay yönetim süreci ile güvenlik ihlalleri kayıt altına alınır ve müdahale edilir.',
                    'Yasal, düzenleyici ve sözleşmesel yükümlülüklere tam uyum sağlanır.',
                ],
            },
            responsibilities: {
                kicker: 'Sorumluluklar',
                title: 'Rol ve sorumluluklar',
                body: 'Politikanın uygulanması, tüm çalışanların ortak sorumluluğudur. Üst yönetim bilgi güvenliği yönetim sistemine liderlik eder; Bilgi Güvenliği Komitesi politikayı gözden geçirir ve iyileştirme aksiyonlarını takip eder. Bilgi işlem birimi teknik güvenlik kontrollerinden sorumludur; tüm çalışanlar, alt yükleniciler ve iş ortakları bu politikaya uymakla yükümlüdür.',
            },
            review: {
                kicker: 'Gözden Geçirme',
                title: 'Sürekli iyileştirme',
                body: 'Politika en az yılda bir kez gözden geçirilir. Süreç, teknoloji veya mevzuat değişikliklerinde ara revizyon yapılabilir. Güncel doküman, çalışanların erişebileceği kurumsal kanallardan yayımlanır.',
            },
        },
        terms: [
            {
                kicker: 'Amaç ve Kapsam',
                title: 'Gizlilik ve kullanım esasları',
                body: [
                    'Bu metin; Hisar Hospital web sitesinin ve dijital hizmetlerinin kullanımına ilişkin genel şart ve gizlilik esaslarını düzenler.',
                    'Siteyi kullanan her ziyaretçi bu şartları kabul etmiş sayılır.',
                ],
            },
            {
                kicker: 'Kullanım Şartları',
                title: 'Site kullanımına dair kurallar',
                body: [
                    'Site içeriği yalnızca bilgilendirme amaçlıdır; tıbbi tanı veya tedavi yerine geçmez.',
                    'Kullanıcı; site içeriğini kopyalama, çoğaltma, ticari amaçla kullanma haklarına sahip değildir.',
                    'Kullanıcı; formlar aracılığıyla gerçek ve güncel bilgi paylaşmayı taahhüt eder.',
                ],
            },
            {
                kicker: 'Gizlilik',
                title: 'Kişisel verilerin korunması',
                body: [
                    'Kişisel veriler yalnızca hizmetin sunulması amacıyla, KVKK ve ilgili mevzuata uygun olarak işlenir.',
                    'Ziyaretçilere ait teknik veriler; site performansı, güvenlik ve deneyim iyileştirme amacıyla anonimleştirilerek analiz edilebilir.',
                ],
            },
            {
                kicker: 'Çerez Kullanımı',
                title: 'Çerezler',
                body: [
                    'Sitemiz temel işlevsellik, ölçümleme ve pazarlama amacıyla çerezler kullanır.',
                    'Ayrıntılı bilgi için Çerez Politikamızı inceleyebilirsiniz.',
                ],
            },
            {
                kicker: 'Fikri Mülkiyet',
                title: 'Marka ve içerik hakları',
                body: ["Sitede yer alan logo, marka, görsel ve metinler Hisar Hospital'a aittir.", 'İzinsiz kullanım hukuki takibe tabidir.'],
            },
            {
                kicker: 'Sorumluluğun Sınırlandırılması',
                title: 'Sorumluluk sınırları',
                body: [
                    'Sitedeki bilgilerin doğruluğu için özen gösterilmekle birlikte; içerikten kaynaklanan doğrudan/dolaylı zararlardan Hisar Hospital sorumlu tutulamaz.',
                    'Dış bağlantılara verilen linklerin içeriği ilgili üçüncü tarafların sorumluluğundadır.',
                ],
            },
            {
                kicker: 'Değişiklikler',
                title: 'Metnin güncellenmesi',
                body: [
                    'Bu metin gerektiğinde güncellenebilir; yayınlandığı anda geçerlilik kazanır.',
                    'Kullanıcıların dönem dönem içeriği takip etmesi önerilir.',
                ],
            },
        ],
        relatedTitle: 'İlgili Politikalar',
        relatedLabels: ['KVKK Politikamız', 'Kalite Çalışmaları'],
    },
    en: {
        head: {
            title: 'Information Security Policy — Hisar Hospital',
            description: 'Hisar Hospital information security policy, responsibilities and core principles.',
        },
        header: 'Information Security Policy',
        crumbCorporate: 'Corporate',
        crumbSelf: 'Information Security Policy',
        docInfoTitle: 'Document Details',
        docRows: [
            ['Document', 'Information Security Policy'],
            ['Document Code', 'BGP-01 (example)'],
            ['Publication Date', '01.01.2024 (example)'],
            ['Revision Date', '01.06.2024 (example)'],
            ['Revision No.', '01 (example)'],
        ],
        docNote: 'The document details are shown as examples; they will be updated with the values from the final corporate document library.',
        intro: {
            purpose: {
                kicker: 'Purpose of the Policy',
                title: 'Protecting our information assets',
                body: 'As Hisar Hospital, our fundamental commitment is to protect the confidentiality, integrity and availability of our patient, employee and corporate information assets, and to run processes that comply with the relevant legal regulations and internationally accepted information security standards.',
            },
            principles: {
                kicker: 'Core Provisions',
                title: 'Our fundamental principles',
                items: [
                    'Information assets are identified, classified and assessed for risk.',
                    'Access rights are granted only to the extent required by the task (the principle of least privilege).',
                    'Information security awareness training is repeated regularly.',
                    'Security breaches are recorded and responded to through the incident management process.',
                    'Full compliance with legal, regulatory and contractual obligations is ensured.',
                ],
            },
            responsibilities: {
                kicker: 'Responsibilities',
                title: 'Roles and responsibilities',
                body: 'Implementing the policy is the shared responsibility of all employees. Senior management leads the information security management system; the Information Security Committee reviews the policy and follows up on improvement actions. The IT department is responsible for technical security controls; all employees, subcontractors and business partners are obliged to comply with this policy.',
            },
            review: {
                kicker: 'Review',
                title: 'Continuous improvement',
                body: 'The policy is reviewed at least once a year. Interim revisions may be made in the event of changes in process, technology or legislation. The current document is published through corporate channels accessible to employees.',
            },
        },
        terms: [
            {
                kicker: 'Purpose and Scope',
                title: 'Privacy and usage principles',
                body: [
                    'This text sets out the general terms and privacy principles for the use of the Hisar Hospital website and digital services.',
                    'Every visitor who uses the site is deemed to have accepted these terms.',
                ],
            },
            {
                kicker: 'Terms of Use',
                title: 'Rules on the use of the site',
                body: [
                    'The site content is for information purposes only; it is not a substitute for medical diagnosis or treatment.',
                    'The user does not have the right to copy, reproduce or use the site content for commercial purposes.',
                    'The user undertakes to share accurate and current information through the forms.',
                ],
            },
            {
                kicker: 'Privacy',
                title: 'Protection of personal data',
                body: [
                    'Personal data is processed solely for the purpose of providing the service, in accordance with the KVKK and the relevant legislation.',
                    "Visitors' technical data may be anonymized and analyzed for the purposes of site performance, security and experience improvement.",
                ],
            },
            {
                kicker: 'Cookie Usage',
                title: 'Cookies',
                body: [
                    'Our site uses cookies for core functionality, measurement and marketing purposes.',
                    'For detailed information, please review our Cookie Policy.',
                ],
            },
            {
                kicker: 'Intellectual Property',
                title: 'Trademark and content rights',
                body: [
                    'The logos, trademarks, visuals and texts on the site belong to Hisar Hospital.',
                    'Unauthorized use is subject to legal action.',
                ],
            },
            {
                kicker: 'Limitation of Liability',
                title: 'Limits of liability',
                body: [
                    'While care is taken to ensure the accuracy of the information on the site, Hisar Hospital cannot be held liable for any direct or indirect damages arising from the content.',
                    'The content of links to external sites is the responsibility of the relevant third parties.',
                ],
            },
            {
                kicker: 'Changes',
                title: 'Updating the text',
                body: [
                    'This text may be updated when necessary; it takes effect at the moment it is published.',
                    'Users are advised to check the content periodically.',
                ],
            },
        ],
        relatedTitle: 'Related Policies',
        relatedLabels: ['Personal Data Protection Policy', 'Quality Initiatives'],
    },
} as const;

export default function BilgiGuvenligiPolitikamiz() {
    const locale = useLocale();
    const lp = useLocalizedPath();
    const c = usePageCopy('bilgi-guvenligi-politikamiz', COPY[locale]);
    const terms = PRIVACY_IDS.map((id, i) => ({ id, ...c.terms[i] }));

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/bilgi-guvenligi-politikamiz" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/bilgi-guvenligi-politikamiz" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/bilgi-guvenligi-politikamiz" />
            </Head>

            <PageHeader title={c.header} />
            <Breadcrumb items={[{ label: c.crumbCorporate, to: '/kurumsal' }, { label: c.crumbSelf }]} />

            <section className="py-10 lg:py-14">
                <div className="container-x grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
                    <aside className="border-border/70 bg-gradient-card self-start rounded-2xl border p-5 lg:sticky lg:top-36">
                        <div className="text-primary flex items-center gap-2 text-xs font-bold">
                            <FileText className="text-brand-orange h-4 w-4" aria-hidden /> {c.docInfoTitle}
                        </div>
                        <dl className="mt-4 space-y-3 text-sm">
                            {c.docRows.map(([k, v]) => (
                                <div key={k} className="border-border/60 flex justify-between gap-3 border-b pb-2 last:border-0">
                                    <dt className="text-muted-foreground">{k}</dt>
                                    <dd className="text-primary text-right font-semibold">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="text-muted-foreground mt-4 text-[11px]">{c.docNote}</p>
                    </aside>

                    <article className="max-w-3xl">
                        <section>
                            <p className="text-brand-orange text-[11px] font-bold tracking-[0.18em] uppercase">— {c.intro.purpose.kicker}</p>
                            <h2 className="text-primary mt-2 text-xl font-black tracking-tight lg:text-2xl">{c.intro.purpose.title}</h2>
                            <p className="text-foreground/85 mt-4 text-[15px] leading-[1.85]">{c.intro.purpose.body}</p>
                        </section>

                        <hr className="border-border/60 my-10" />

                        <section>
                            <p className="text-brand-orange text-[11px] font-bold tracking-[0.18em] uppercase">— {c.intro.principles.kicker}</p>
                            <h2 className="text-primary mt-2 text-xl font-black tracking-tight lg:text-2xl">{c.intro.principles.title}</h2>
                            <ul className="text-foreground/85 mt-4 space-y-3 text-[15px] leading-[1.85]">
                                {c.intro.principles.items.map((it) => (
                                    <li key={it} className="flex gap-3">
                                        <span className="bg-brand-orange mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
                                        <span>{it}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <hr className="border-border/60 my-10" />

                        <section>
                            <p className="text-brand-orange text-[11px] font-bold tracking-[0.18em] uppercase">— {c.intro.responsibilities.kicker}</p>
                            <h2 className="text-primary mt-2 text-xl font-black tracking-tight lg:text-2xl">{c.intro.responsibilities.title}</h2>
                            <p className="text-foreground/85 mt-4 text-[15px] leading-[1.85]">{c.intro.responsibilities.body}</p>
                        </section>

                        <hr className="border-border/60 my-10" />

                        <section>
                            <p className="text-brand-orange text-[11px] font-bold tracking-[0.18em] uppercase">— {c.intro.review.kicker}</p>
                            <h2 className="text-primary mt-2 text-xl font-black tracking-tight lg:text-2xl">{c.intro.review.title}</h2>
                            <p className="text-foreground/85 mt-4 text-[15px] leading-[1.85]">{c.intro.review.body}</p>
                        </section>

                        <hr className="border-border/60 my-10" />

                        {terms.map((s) => (
                            <div key={s.id}>
                                <section id={s.id} className="scroll-mt-32">
                                    <p className="text-brand-orange text-[11px] font-bold tracking-[0.18em] uppercase">— {s.kicker}</p>
                                    <h2 className="text-primary mt-2 text-xl font-black tracking-tight lg:text-2xl">{s.title}</h2>
                                    <ul className="text-foreground/85 mt-4 space-y-3 text-[15px] leading-[1.85]">
                                        {s.body.map((b) => (
                                            <li key={b} className="flex gap-3">
                                                <span className="bg-brand-orange mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                                <hr className="border-border/60 my-10" />
                            </div>
                        ))}

                        <section>
                            <p className="text-brand-orange text-[11px] font-bold tracking-[0.18em] uppercase">— {c.relatedTitle}</p>
                            <ul className="mt-4 space-y-2 text-sm">
                                {RELATED_LINKS.map((link, i) => (
                                    <li key={link.to}>
                                        <Link href={lp(link.to)} className="text-brand-orange font-semibold hover:underline">
                                            {c.relatedLabels[i]}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </article>
                </div>
            </section>
        </>
    );
}

BilgiGuvenligiPolitikamiz.layout = siteLayout;
