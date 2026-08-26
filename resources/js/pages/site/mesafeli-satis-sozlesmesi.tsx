import { Head } from '@inertiajs/react';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { PageSectionNavigation } from '@/components/site/PageSectionNavigation';
import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';

/* Stable anchor ids — locale-independent (used by scroll-spy + section nav). */
const SECTION_IDS = ['taraflar', 'konu', 'urun', 'teslim', 'cayma', 'uyusmazlik', 'iletisim'] as const;

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Mesafeli Satış Sözleşmesi — Hisar Hospital',
            description: 'Hisar Hospital web sitesi üzerinden yapılan elektronik satın alımlar için mesafeli satış sözleşmesi.',
        },
        header: 'Mesafeli Satış Sözleşmesi',
        crumbCorporate: 'Kurumsal',
        crumbSelf: 'Mesafeli Satış Sözleşmesi',
        sections: [
            {
                title: 'Taraflar',
                body: [
                    'Bu Mesafeli Satış Sözleşmesi; Hisar Hospital ("Satıcı") ile web sitesi üzerinden hizmet/paket satın alan gerçek veya tüzel kişi ("Alıcı") arasında elektronik ortamda kurulur.',
                    'Sözleşme, siparişin tamamlanmasıyla birlikte tarafları bağlayıcı hale gelir.',
                ],
            },
            {
                title: 'Sözleşmenin Konusu',
                body: [
                    "Sözleşmenin konusu; Alıcı'nın Satıcı'ya ait web sitesinden elektronik ortamda seçtiği sağlık paketi, check-up hizmeti veya dijital hizmete ilişkin nitelik, satış bedeli ve ödeme şeklinin belirlenmesidir.",
                ],
            },
            {
                title: 'Hizmet Bilgileri',
                body: [
                    'Satın alınan hizmetin adı, kapsamı ve geçerlilik süresi ilgili paket detay sayfasında yer alır.',
                    'Vergiler dahil toplam bedel, sipariş özetinde ve elektronik faturada belirtilir.',
                ],
            },
            {
                title: 'İfa ve Teslim',
                body: [
                    'Dijital hizmetler; ödeme onayının ardından e-posta ile iletilen randevu bilgileri üzerinden ifa edilir.',
                    'Fiziksel bir teslimat söz konusu değildir.',
                ],
            },
            {
                title: 'Cayma Hakkı',
                body: [
                    'Alıcı, tüketici mevzuatı kapsamında 14 gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkını kullanabilir.',
                    'Ancak; ifasına başlanmış sağlık hizmetleri ve kişiye özel hazırlanan paketlerde cayma hakkı mevzuat gereği sınırlanabilir.',
                ],
            },
            {
                title: 'Uyuşmazlıkların Çözümü',
                body: [
                    'Sözleşmeden doğan uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.',
                    'Parasal sınırlar her yıl Bakanlıkça güncellenir.',
                ],
            },
            {
                title: 'İletişim',
                body: ['Satıcı: Hisar Hospital', 'E-posta: info@hisarhospital.com', 'Telefon: 444 5 888'],
            },
        ],
    },
    en: {
        head: {
            title: 'Distance Sales Agreement — Hisar Hospital',
            description: 'Distance sales agreement for electronic purchases made through the Hisar Hospital website.',
        },
        header: 'Distance Sales Agreement',
        crumbCorporate: 'Corporate',
        crumbSelf: 'Distance Sales Agreement',
        sections: [
            {
                title: 'Parties',
                body: [
                    'This Distance Sales Agreement is concluded electronically between Hisar Hospital (the "Seller") and the natural or legal person purchasing a service/package through the website (the "Buyer").',
                    'The agreement becomes binding on the parties upon completion of the order.',
                ],
            },
            {
                title: 'Subject of the Agreement',
                body: [
                    "The subject of the agreement is the determination of the qualities, sale price and payment method of the health package, check-up service or digital service that the Buyer selects electronically from the Seller's website.",
                ],
            },
            {
                title: 'Service Information',
                body: [
                    'The name, scope and validity period of the purchased service are provided on the relevant package detail page.',
                    'The total amount, including taxes, is stated in the order summary and on the electronic invoice.',
                ],
            },
            {
                title: 'Performance and Delivery',
                body: [
                    'Digital services are performed on the basis of the appointment details sent by email following payment confirmation.',
                    'No physical delivery is involved.',
                ],
            },
            {
                title: 'Right of Withdrawal',
                body: [
                    'Under consumer legislation, the Buyer may exercise the right of withdrawal within 14 days without giving any reason and without paying any penalty.',
                    'However, the right of withdrawal may be restricted by legislation for healthcare services that have already commenced and for personalized packages.',
                ],
            },
            {
                title: 'Resolution of Disputes',
                body: [
                    'For disputes arising from the agreement, the Consumer Arbitration Committees and Consumer Courts have jurisdiction.',
                    'The monetary thresholds are updated each year by the Ministry.',
                ],
            },
            {
                title: 'Contact',
                body: ['Seller: Hisar Hospital', 'Email: info@hisarhospital.com', 'Phone: 444 5 888'],
            },
        ],
    },
} as const;

export default function MesafeliSatisSozlesmesi() {
    const locale = useLocale();
    const c = usePageCopy('mesafeli-satis-sozlesmesi', COPY[locale]);
    const sections = SECTION_IDS.map((id, i) => ({ id, ...c.sections[i] }));

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/mesafeli-satis-sozlesmesi" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/mesafeli-satis-sozlesmesi" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/mesafeli-satis-sozlesmesi" />
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

MesafeliSatisSozlesmesi.layout = siteLayout;
