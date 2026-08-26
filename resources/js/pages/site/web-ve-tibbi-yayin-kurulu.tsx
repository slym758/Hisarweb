import { Head } from '@inertiajs/react';

import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { PageSectionNavigation } from '@/components/site/PageSectionNavigation';
import { useLocale } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';

const COPY = {
    tr: {
        head: {
            title: 'Web ve Tıbbi Yayın Kurulu — Hisar Hospital',
            description:
                'Hisar Hospital dijital kanallarında yayımlanan sağlık içeriklerinin denetiminden sorumlu Web ve Tıbbi Yayın Kurulu.',
        },
        pageTitle: 'Web ve Tıbbi Yayın Kurulu',
        pageSubtitle: 'Dijital sağlık içeriklerimizin bilimsel doğruluk ve hasta dostu anlatımını denetleyen kurul.',
        crumbCorporate: 'Kurumsal',
        crumbCurrent: 'Web ve Tıbbi Yayın Kurulu',
        sections: [
            {
                id: 'amac',
                title: 'Kurulun Amacı',
                body: [
                    'Web ve Tıbbi Yayın Kurulu; Hisar Hospital web sitesi ve dijital kanallarında yayımlanan sağlık içeriklerinin bilimsel doğruluğunu, güncelliğini ve hasta dostu anlatımını denetler.',
                    'Amaç; ziyaretçilere güvenilir, kanıta dayalı ve anlaşılır sağlık bilgisi sunmaktır.',
                ],
            },
            {
                id: 'uyeler',
                title: 'Üyeler ve Yapı',
                body: [
                    'Kurul; klinik disiplinlerden temsilcilerin yanı sıra kalite, hasta hakları, kurumsal iletişim ve dijital yayın uzmanlarından oluşur.',
                    'İçerikler ilgili uzmanlık alanındaki hekimin gözden geçirmesinden sonra yayına alınır.',
                ],
            },
            {
                id: 'tibbi-kurul',
                title: 'Tıbbi İçerik Yayın Kurulu',
                body: ['Doç. Dr. Ramazan GÖZÜKÜÇÜK — Mesul Müdür – Enfeksiyon Hastalıkları'],
            },
            {
                id: 'web-kurul',
                title: 'Web Yönetim Kurulu',
                body: [
                    'N. Elçin SEVİM — Kurumsal İletişim ve Pazarlama Direktörü',
                    'Faik SİPAHİOĞLU — Dijital Pazarlama Yöneticisi',
                    'Enes AKSU — Web Tasarım ve Yayın Sorumlusu',
                ],
            },
            {
                id: 'surec',
                title: 'Yayın Süreci',
                body: [
                    'İçerik önerisi: Editör ekibi, güncel klinik gündem ve ziyaretçi ihtiyaçlarına göre içerik önerisi oluşturur.',
                    'Uzman değerlendirmesi: İlgili hekim/hekimler içeriği kanıta dayalı biçimde inceler.',
                    'Dil ve erişilebilirlik: Metin, hasta anlayabileceği bir dile uyarlanır.',
                    'Yayın ve arşiv: Onaylı içerik yayına alınır ve düzenli olarak güncellik açısından gözden geçirilir.',
                ],
            },
            {
                id: 'prensipler',
                title: 'Yayın İlkeleri',
                body: [
                    'Kanıta dayalı tıp ve güncel klinik kılavuzlara uyum.',
                    'Reklam içeriği ile bilimsel içeriğin ayrıştırılması.',
                    "Hasta mahremiyeti ve KVKK'ya tam uyum.",
                    'Yanıltıcı, abartılı veya vaatte bulunan ifadelerden kaçınma.',
                ],
            },
            {
                id: 'geribildirim',
                title: 'Geri Bildirim',
                body: [
                    'Sağlık içerikleriyle ilgili görüş ve düzeltme talepleri için iletisim@hisarhospital.com adresini kullanabilirsiniz.',
                    'Tüm geri bildirimler Kurul tarafından değerlendirilir.',
                ],
            },
            {
                id: 'iletisim',
                title: 'İletişim',
                body: ['Tel: +90 216 524 13 00 ( 61 50 – 60 94 )'],
            },
            {
                id: 'guncelleme',
                title: 'Son Güncelleme Tarihi',
                body: ['23.07.2026'],
            },
        ],
    },
    en: {
        head: {
            title: 'Web & Medical Publication Board — Hisar Hospital',
            description:
                'The Web and Medical Publication Board responsible for overseeing the health content published on Hisar Hospital digital channels.',
        },
        pageTitle: 'Web & Medical Publication Board',
        pageSubtitle: 'The board overseeing the scientific accuracy and patient-friendly presentation of our digital health content.',
        crumbCorporate: 'Corporate',
        crumbCurrent: 'Web & Medical Publication Board',
        sections: [
            {
                id: 'amac',
                title: 'Purpose of the Board',
                body: [
                    'The Web and Medical Publication Board oversees the scientific accuracy, currency and patient-friendly presentation of the health content published on the Hisar Hospital website and digital channels.',
                    'The aim is to provide visitors with reliable, evidence-based and understandable health information.',
                ],
            },
            {
                id: 'uyeler',
                title: 'Members and Structure',
                body: [
                    'The board consists of representatives from clinical disciplines as well as experts in quality, patient rights, corporate communications and digital publishing.',
                    'Content is published after review by the physician in the relevant field of expertise.',
                ],
            },
            {
                id: 'tibbi-kurul',
                title: 'Medical Content Publication Board',
                body: ['Assoc. Prof. Dr. Ramazan GÖZÜKÜÇÜK — Responsible Manager – Infectious Diseases'],
            },
            {
                id: 'web-kurul',
                title: 'Web Management Board',
                body: [
                    'N. Elçin SEVİM — Corporate Communications and Marketing Director',
                    'Faik SİPAHİOĞLU — Digital Marketing Manager',
                    'Enes AKSU — Web Design and Publishing Officer',
                ],
            },
            {
                id: 'surec',
                title: 'Publication Process',
                body: [
                    'Content proposal: The editorial team creates content proposals based on the current clinical agenda and visitor needs.',
                    'Expert review: The relevant physician(s) review the content in an evidence-based manner.',
                    'Language and accessibility: The text is adapted into language a patient can understand.',
                    'Publication and archive: Approved content is published and regularly reviewed for currency.',
                ],
            },
            {
                id: 'prensipler',
                title: 'Publication Principles',
                body: [
                    'Adherence to evidence-based medicine and current clinical guidelines.',
                    'Separation of advertising content from scientific content.',
                    'Full compliance with patient privacy and KVKK.',
                    'Avoiding misleading, exaggerated or promissory statements.',
                ],
            },
            {
                id: 'geribildirim',
                title: 'Feedback',
                body: [
                    'For opinions and correction requests regarding health content, you can use the address iletisim@hisarhospital.com.',
                    'All feedback is evaluated by the Board.',
                ],
            },
            {
                id: 'iletisim',
                title: 'Contact',
                body: ['Tel: +90 216 524 13 00 ( 61 50 – 60 94 )'],
            },
            {
                id: 'guncelleme',
                title: 'Last Update Date',
                body: ['23.07.2026'],
            },
        ],
    },
} as const;

export default function Page() {
    const locale = useLocale();
    const c = usePageCopy('web-ve-tibbi-yayin-kurulu', COPY[locale]);

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/web-ve-tibbi-yayin-kurulu" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/web-ve-tibbi-yayin-kurulu" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/web-ve-tibbi-yayin-kurulu" />
            </Head>

            <PageHeader title={c.pageTitle} subtitle={c.pageSubtitle} />
            <Breadcrumb items={[{ label: c.crumbCorporate, to: '/kurumsal' }, { label: c.crumbCurrent }]} />

            <section className="py-10 lg:py-16">
                <div className="container-x grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
                    <aside className="lg:sticky lg:top-36 self-start">
                        <PageSectionNavigation
                            sections={c.sections.map((s) => ({ id: s.id, label: s.title }))}
                            lang={locale}
                        />
                    </aside>

                    <article className="relative">
                        <div className="absolute top-0 bottom-0 left-0 w-px bg-border/50 hidden lg:block" aria-hidden />
                        {c.sections.map((s) => (
                            <section key={s.id} id={s.id} className="relative pl-0 lg:pl-12 pb-12 last:pb-0 scroll-mt-28">
                                <span
                                    className="absolute top-1 left-[-5px] hidden lg:flex h-2.5 w-2.5 rounded-full bg-brand-orange ring-4 ring-background"
                                    aria-hidden
                                />
                                <div className="max-w-3xl">
                                    <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4 tracking-tight">{s.title}</h2>
                                    <div className="space-y-3 text-foreground/85 leading-relaxed">
                                        {s.body.map((b, i) => (
                                            <p key={i} className="text-sm lg:text-base">{b}</p>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        ))}
                    </article>
                </div>
            </section>
        </>
    );
}

Page.layout = siteLayout;
