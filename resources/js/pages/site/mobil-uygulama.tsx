import { Head } from '@inertiajs/react';
import { Smartphone, Download, CalendarCheck, FileText, Stethoscope, Bell, ShieldCheck } from 'lucide-react';

import { siteLayout, PageHeader } from '@/layouts/site-layout';
import { useLocale } from '@/lib/i18n';

const APP_STORE_URL = '#';
const GOOGLE_PLAY_URL = '#';

/* Static (locale-independent) feature icons — text lives in COPY.features. */
const FEATURE_ICONS = [CalendarCheck, FileText, Stethoscope, Bell, ShieldCheck];

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Hisar Mobile — Hisar Hospital',
            description: 'Hisar Hospital mobil uygulaması ile randevu alın, sonuçlarınıza ulaşın, doktor bulun ve sağlık süreçlerinizi takip edin.',
            ogDescription: 'Hisar Hospital mobil uygulaması ile sağlık cebinizde.',
        },
        pageTitle: 'Hisar Mobile',
        intro: 'Sağlık cebinizde: randevu alın, laboratuvar ve görüntüleme sonuçlarınıza anında ulaşın, uzman hekimleri keşfedin ve sağlık süreçlerinizi tek dokunuşla yönetin.',
        appStoreFrom: "App Store'dan",
        googlePlayFrom: "Google Play'den",
        download: 'İndirin',
        featuresTitle: 'Uygulama ile Neler Yapabilirsiniz?',
        features: [
            { title: 'Randevu Yönetimi', desc: 'Hızlı randevu alın, hatırlatıcıları görün ve planınızı takip edin.' },
            { title: 'E-Sonuç', desc: 'Laboratuvar ve görüntüleme sonuçlarınıza anında güvenli erişim.' },
            { title: 'Doktor Bul', desc: 'Uzman hekimleri inceleyin, uzaktan görüşme talep edin.' },
            { title: 'Bildirimler', desc: 'Randevu, sonuç ve sağlık ipuçlarından anında haberdar olun.' },
            { title: 'Güvenli Giriş', desc: 'Kişisel verileriniz hastane altyapısıyla aynı güvenlik standartlarıyla korunur.' },
        ],
        bottomNote: 'Uygulama mağazası linkleri hazırlandığında yukarıdaki butonlar otomatik olarak yönlendirecektir. Şimdiden Hisar Mobile deneyimini sabırsızlıkla bekliyoruz.',
    },
    en: {
        head: {
            title: 'Hisar Mobile — Hisar Hospital',
            description: 'With the Hisar Hospital mobile app, book appointments, access your results, find a doctor and track your health journey.',
            ogDescription: 'Your health in your pocket with the Hisar Hospital mobile app.',
        },
        pageTitle: 'Hisar Mobile',
        intro: 'Your health in your pocket: book appointments, instantly access your laboratory and imaging results, discover expert physicians and manage your health processes with a single tap.',
        appStoreFrom: 'From the App Store',
        googlePlayFrom: 'From Google Play',
        download: 'Download',
        featuresTitle: 'What Can You Do with the App?',
        features: [
            { title: 'Appointment Management', desc: 'Book quickly, see reminders and track your schedule.' },
            { title: 'E-Results', desc: 'Instant, secure access to your laboratory and imaging results.' },
            { title: 'Find a Doctor', desc: 'Browse expert physicians and request a remote consultation.' },
            { title: 'Notifications', desc: 'Get instant updates on appointments, results and health tips.' },
            { title: 'Secure Login', desc: 'Your personal data is protected with the same security standards as the hospital infrastructure.' },
        ],
        bottomNote: 'When the app store links are ready, the buttons above will redirect automatically. We can’t wait for you to experience Hisar Mobile.',
    },
} as const;

export default function MobileApp() {
    const locale = useLocale();
    const c = COPY[locale];
    const features = c.features.map((f, i) => ({ ...f, icon: FEATURE_ICONS[i] }));

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.title} />
                <meta property="og:description" content={c.head.ogDescription} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/mobil-uygulama" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/mobil-uygulama" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/mobil-uygulama" />
            </Head>

            <PageHeader title={c.pageTitle} />
            <section className="py-12 lg:py-20">
                <div className="container-x">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary text-primary-foreground shadow-brand">
                            <Smartphone className="h-10 w-10" />
                        </div>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {c.intro}
                        </p>
                    </div>

                    <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
                        <a
                            href={APP_STORE_URL}
                            className="group hover-lift flex items-center gap-5 rounded-2xl border border-border/70 bg-gradient-card p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <AppleIcon className="h-7 w-7" />
                            </span>
                            <div className="text-left">
                                <span className="block text-xs font-semibold text-muted-foreground">{c.appStoreFrom}</span>
                                <span className="block text-lg font-bold text-primary">{c.download}</span>
                            </div>
                            <Download className="ml-auto h-5 w-5 text-muted-foreground transition group-hover:text-brand-orange" />
                        </a>

                        <a
                            href={GOOGLE_PLAY_URL}
                            className="group hover-lift flex items-center gap-5 rounded-2xl border border-border/70 bg-gradient-card p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <PlayStoreIcon className="h-7 w-7" />
                            </span>
                            <div className="text-left">
                                <span className="block text-xs font-semibold text-muted-foreground">{c.googlePlayFrom}</span>
                                <span className="block text-lg font-bold text-primary">{c.download}</span>
                            </div>
                            <Download className="ml-auto h-5 w-5 text-muted-foreground transition group-hover:text-brand-orange" />
                        </a>
                    </div>

                    <div className="mt-14 lg:mt-20">
                        <h2 className="text-center text-xl font-bold text-primary lg:text-2xl">{c.featuresTitle}</h2>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((f) => (
                                <div
                                    key={f.title}
                                    className="rounded-2xl border border-border/70 bg-gradient-card p-5"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-brand">
                                        <f.icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="mt-4 text-[15px] font-bold text-primary">{f.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-14 rounded-2xl border border-border/70 bg-gradient-card p-6 text-center lg:mt-20">
                        <p className="text-sm text-muted-foreground">
                            {c.bottomNote}
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

MobileApp.layout = siteLayout;

function AppleIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
    );
}

function PlayStoreIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
        </svg>
    );
}
