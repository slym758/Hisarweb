import { Head } from '@inertiajs/react';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { PageSectionNavigation } from '@/components/site/PageSectionNavigation';
import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';

/* Stable anchor ids — locale-independent (used by scroll-spy + section nav). */
const SECTION_IDS = ['nedir', 'turler', 'sureler', 'ucuncu-taraf', 'yonetim', 'guncelleme'] as const;

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Çerez Politikası — Hisar Hospital',
            description: 'Hisar Hospital web sitesinde kullanılan çerez türleri, süreleri ve tercih yönetimine ilişkin politika.',
        },
        header: 'Çerez Politikası',
        crumbCorporate: 'Kurumsal',
        crumbSelf: 'Çerez Politikası',
        sections: [
            {
                title: 'Çerez Nedir?',
                body: [
                    'Çerezler; ziyaret ettiğiniz siteler tarafından cihazınıza yerleştirilen küçük metin dosyalarıdır.',
                    'Site deneyimini iyileştirmek, kullanıcı tercihlerini hatırlamak ve site kullanımına ilişkin analiz üretmek amacıyla kullanılır.',
                ],
            },
            {
                title: 'Kullanılan Çerez Türleri',
                body: [
                    'Zorunlu çerezler: Sitenin temel işlevselliği için gereklidir; devre dışı bırakılamaz.',
                    'Performans çerezleri: Ziyaretçi davranışlarını anonim olarak analiz etmek için kullanılır.',
                    'İşlevsellik çerezleri: Dil, tema ve tercih ayarlarınızı hatırlar.',
                    'Pazarlama çerezleri: İlgi alanlarınıza uygun içerik ve reklam sunumu için kullanılır.',
                ],
            },
            {
                title: 'Saklama Süreleri',
                body: [
                    'Oturum çerezleri tarayıcı kapatıldığında silinir.',
                    'Kalıcı çerezler belirli bir süre veya kullanıcı tarafından silinene kadar cihazda kalır.',
                ],
            },
            {
                title: 'Üçüncü Taraf Çerezleri',
                body: [
                    'Analiz, harita ve video gibi hizmetler için ilgili sağlayıcıların çerezleri kullanılabilir.',
                    'Bu sağlayıcıların kendi gizlilik politikaları geçerlidir.',
                ],
            },
            {
                title: 'Çerez Tercihlerinizi Yönetme',
                body: [
                    'Tarayıcı ayarlarınızdan çerezleri silebilir, engelleyebilir veya bildirim almayı seçebilirsiniz.',
                    'Zorunlu çerezlerin engellenmesi sitenin bazı işlevlerini etkileyebilir.',
                ],
            },
            {
                title: 'Politikadaki Değişiklikler',
                body: ['Çerez Politikamız gerektiğinde güncellenebilir; güncel metin bu sayfada yayınlanır.'],
            },
        ],
    },
    en: {
        head: {
            title: 'Cookie Policy — Hisar Hospital',
            description: 'Policy on the cookie types, retention periods and preference management used on the Hisar Hospital website.',
        },
        header: 'Cookie Policy',
        crumbCorporate: 'Corporate',
        crumbSelf: 'Cookie Policy',
        sections: [
            {
                title: 'What Is a Cookie?',
                body: [
                    'Cookies are small text files placed on your device by the sites you visit.',
                    'They are used to improve the site experience, remember user preferences and generate analytics about how the site is used.',
                ],
            },
            {
                title: 'Types of Cookies Used',
                body: [
                    'Essential cookies: Required for the core functionality of the site; they cannot be disabled.',
                    'Performance cookies: Used to analyze visitor behavior anonymously.',
                    'Functionality cookies: Remember your language, theme and preference settings.',
                    'Marketing cookies: Used to deliver content and advertising relevant to your interests.',
                ],
            },
            {
                title: 'Retention Periods',
                body: [
                    'Session cookies are deleted when the browser is closed.',
                    'Persistent cookies remain on the device for a set period or until the user deletes them.',
                ],
            },
            {
                title: 'Third-Party Cookies',
                body: [
                    'Cookies from the relevant providers may be used for services such as analytics, maps and video.',
                    "These providers' own privacy policies apply.",
                ],
            },
            {
                title: 'Managing Your Cookie Preferences',
                body: [
                    'From your browser settings you can delete or block cookies, or choose to be notified about them.',
                    'Blocking essential cookies may affect some functions of the site.',
                ],
            },
            {
                title: 'Changes to the Policy',
                body: ['Our Cookie Policy may be updated when necessary; the current text is published on this page.'],
            },
        ],
    },
} as const;

export default function CerezPolitikasi() {
    const locale = useLocale();
    const c = usePageCopy('cerez-politikasi', COPY[locale]);
    const sections = SECTION_IDS.map((id, i) => ({ id, ...c.sections[i] }));

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/cerez-politikasi" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/cerez-politikasi" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/cerez-politikasi" />
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

CerezPolitikasi.layout = siteLayout;
