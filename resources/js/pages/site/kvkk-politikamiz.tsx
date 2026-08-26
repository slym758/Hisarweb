import { Head } from '@inertiajs/react';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { PageSectionNavigation } from '@/components/site/PageSectionNavigation';
import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';

/* Stable anchor ids — locale-independent (used by scroll-spy + section nav). */
const SECTION_IDS = ['amac', 'kapsam', 'ilkeler', 'kategoriler', 'haklar', 'basvuru', 'iletisim', 'dokumanlar'] as const;

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'KVKK Politikamız — Hisar Hospital',
            description: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Hisar Hospital kişisel veri işleme politikası.',
        },
        header: 'KVKK Politikamız',
        crumbCorporate: 'Kurumsal',
        crumbSelf: 'KVKK Politikamız',
        sections: [
            {
                title: 'Politikanın Amacı',
                body: [
                    'Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında Hisar Hospital tarafından yürütülen kişisel veri işleme faaliyetlerine ilişkin esasları belirler.',
                    'Amaç; hasta, ziyaretçi, çalışan ve iş ortaklarının kişisel verilerinin hukuka uygun şekilde işlenmesini sağlamaktır.',
                ],
            },
            {
                title: 'Kapsam',
                body: [
                    'Politika; sağlık hizmetlerinin sunulması sürecinde toplanan tüm kişisel veriler ile web sitesi, iletişim merkezi ve dijital hizmetler aracılığıyla elde edilen verileri kapsar.',
                ],
            },
            {
                title: 'Kişisel Veri İşleme İlkeleri',
                body: [
                    'Hukuka ve dürüstlük kurallarına uygunluk.',
                    'Doğru ve gerektiğinde güncel olma.',
                    'Belirli, açık ve meşru amaçlarla işleme.',
                    'İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü olma.',
                    'İlgili mevzuatta öngörülen süre kadar muhafaza etme.',
                ],
            },
            {
                title: 'Veri Kategorileri',
                body: [
                    'Kimlik ve iletişim bilgileri.',
                    'Sağlık ve tıbbi kayıt bilgileri (özel nitelikli).',
                    'Finansal ve ödeme bilgileri.',
                    'Randevu, ziyaret ve işlem kayıtları.',
                    'Web sitesi ve dijital hizmet kullanım verileri.',
                ],
            },
            {
                title: 'Veri Sahiplerinin Hakları',
                body: [
                    'Kişisel verilerinin işlenip işlenmediğini öğrenme.',
                    'İşleme faaliyetine ilişkin bilgi talep etme.',
                    'Verilerin düzeltilmesini ya da silinmesini isteme.',
                    'İşlemenin sınırlandırılmasını talep etme.',
                    'Zararın giderilmesini talep etme.',
                ],
            },
            {
                title: 'Başvuru Yöntemleri',
                body: [
                    'Yazılı başvuru: kurumsal adresimize elden veya noter kanalıyla.',
                    'E-posta: kvkk@hisarhospital.com üzerinden kimlik doğrulanabilir şekilde.',
                    "Başvurular, KVKK'nın öngördüğü süreler içinde sonuçlandırılır.",
                ],
            },
            {
                title: 'İletişim Bilgisi',
                body: ['Veri sorumlusu: Hisar Hospital', 'E-posta: kvkk@hisarhospital.com', 'Telefon: 444 5 888'],
            },
            {
                title: 'İlgili Dokümanlar',
                body: ['Bilgi Güvenliği Politikamız', 'Aydınlatma Metinleri', 'Çerez Politikası'],
            },
        ],
    },
    en: {
        head: {
            title: 'Personal Data Protection (KVKK) Policy — Hisar Hospital',
            description: "Hisar Hospital's personal data processing policy under Law No. 6698 on the Protection of Personal Data (KVKK).",
        },
        header: 'Personal Data Protection Policy',
        crumbCorporate: 'Corporate',
        crumbSelf: 'Personal Data Protection Policy',
        sections: [
            {
                title: 'Purpose of the Policy',
                body: [
                    'This policy sets out the principles for the personal data processing activities carried out by Hisar Hospital under Law No. 6698 on the Protection of Personal Data (KVKK).',
                    'Its purpose is to ensure that the personal data of patients, visitors, employees and business partners is processed in accordance with the law.',
                ],
            },
            {
                title: 'Scope',
                body: [
                    'The policy covers all personal data collected during the delivery of healthcare services, as well as data obtained through the website, contact center and digital services.',
                ],
            },
            {
                title: 'Principles of Personal Data Processing',
                body: [
                    'Compliance with the law and the rules of good faith.',
                    'Being accurate and, where necessary, kept up to date.',
                    'Processing for specific, explicit and legitimate purposes.',
                    'Being relevant to, limited to and proportionate with the purpose of processing.',
                    'Retention only for the period stipulated by the relevant legislation.',
                ],
            },
            {
                title: 'Data Categories',
                body: [
                    'Identity and contact information.',
                    'Health and medical record information (special category).',
                    'Financial and payment information.',
                    'Appointment, visit and transaction records.',
                    'Website and digital service usage data.',
                ],
            },
            {
                title: 'Rights of Data Subjects',
                body: [
                    'Learning whether their personal data is being processed.',
                    'Requesting information about the processing activity.',
                    'Requesting that the data be corrected or deleted.',
                    'Requesting that the processing be restricted.',
                    'Requesting compensation for any damage incurred.',
                ],
            },
            {
                title: 'Application Methods',
                body: [
                    'Written application: in person to our corporate address or via a notary.',
                    'Email: via kvkk@hisarhospital.com in a way that allows identity verification.',
                    'Applications are concluded within the periods stipulated by the KVKK.',
                ],
            },
            {
                title: 'Contact Information',
                body: ['Data controller: Hisar Hospital', 'Email: kvkk@hisarhospital.com', 'Phone: 444 5 888'],
            },
            {
                title: 'Related Documents',
                body: ['Our Information Security Policy', 'Disclosure Statements', 'Cookie Policy'],
            },
        ],
    },
} as const;

export default function KvkkPolitikamiz() {
    const locale = useLocale();
    const c = usePageCopy('kvkk-politikamiz', COPY[locale]);
    const sections = SECTION_IDS.map((id, i) => ({ id, ...c.sections[i] }));

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/kvkk-politikamiz" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/kvkk-politikamiz" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/kvkk-politikamiz" />
            </Head>

            <PageHeader title={c.header} />
            <Breadcrumb items={[{ label: c.crumbCorporate, to: '/kurumsal' }, { label: c.crumbSelf }]} />

            <section className="py-10 lg:py-14">
                <div className="container-x grid gap-8 lg:grid-cols-[260px_1fr]">
                    <aside className="self-start lg:sticky lg:top-36">
                        <PageSectionNavigation sections={sections.map((s) => ({ id: s.id, label: s.title }))} lang={locale} />
                    </aside>

                    <article className="space-y-6">
                        {sections.map((s) => (
                            <section key={s.id} id={s.id} className="border-border/70 bg-card scroll-mt-24 rounded-2xl border p-6 lg:p-8">
                                <h2 className="text-primary mb-3 text-lg font-bold">{s.title}</h2>
                                <ul className="text-foreground/85 space-y-2 text-sm">
                                    {s.body.map((b, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="bg-brand-orange mt-2 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </article>
                </div>
            </section>
        </>
    );
}

KvkkPolitikamiz.layout = siteLayout;
