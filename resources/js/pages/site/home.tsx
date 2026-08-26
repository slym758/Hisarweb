import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight, ArrowUpRight, Award, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight,
    ClipboardList, Dna, Globe, MapPin, Microscope, Navigation, Phone, Play,
    Search as SearchIcon, ShieldCheck, Sparkles, UserSearch, X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AppShowcase } from '@/components/site/AppShowcase';
import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { PreFooter } from '@/components/site/PreFooter';
import { QualityCertificates } from '@/components/site/QualityCertificates';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';
import { useSettings } from '@/lib/settings';
import { normalizeTr, useBlogPosts, useDepartments, useHomeCenters, useHospitals, useSymptomMap } from '@/lib/site-data';

/* ──────────────────── TEMPORARY IMAGERY (Unsplash placeholders) ──────────────────── */
/* TODO: real asset — swap every Unsplash URL below for optimized production assets. */
const ph = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const onkolojiImg = ph('1581056771107-24ca5f033842');
const jciImg = ph('1554774853-b415df9eeb92', 400);

/* Static (locale-independent) hero media — text lives in COPY.hero.slides. */
type HeroMedia = { image: string; mobileImage: string; position: string; mobilePosition: string; href: string };

/* DB-managed hero (shared as `homeHero` by SliderService). When present it drives the Hero;
   otherwise the in-memory HERO_SLIDE_MEDIA + COPY.hero.slides below are used as a fallback. */
type HeroSlideDb = {
    image: string | null; mobileImage: string | null; position: string | null; mobilePosition: string | null; href: string | null;
    eyebrow: string | null; title: string | null; mobileTitle: string | null; desc: string | null; mobileDesc: string | null;
};
type HomeHero = { autoplay: boolean; interval_ms: number; slides: HeroSlideDb[] };

const HERO_SLIDE_MEDIA: HeroMedia[] = [
    { image: ph('1538108149393-fbbd81895907'), mobileImage: ph('1516841273335-e39b37888115', 800), position: '50% 78%', mobilePosition: '50% 35%', href: '/kurumsal' },
    { image: ph('1579154204601-01588f351e67'), mobileImage: ph('1516574200030-89bf6d9f7f66', 800), position: '70% 50%', mobilePosition: '72% 40%', href: '/tedavi-yontemleri' },
    { image: ph('1579684385127-1ef15d508118'), mobileImage: ph('1587393855524-087f83d95bc9', 800), position: '70% 50%', mobilePosition: '70% 35%', href: '/tedavi-yontemleri' },
];

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Hisar Hospital — Hayat Boyu Sağlık',
            description: 'JCI akreditasyonlu sağlık hizmeti, uzman hekim kadrosu ve ileri teknoloji altyapısıyla; tanı, tedavi ve takip süreçlerinizde yanınızdayız.',
        },
        hero: {
            slide: 'Slayt',
            appointment: 'Randevu Al',
            findDoctor: 'Doktor Bul',
            intlPatients: 'International Patients',
            slides: [
                {
                    eyebrow: 'Hisar Intercontinental',
                    title: 'Hayat boyu sağlığınız için yanınızdayız',
                    mobileTitle: 'Hayat boyu sağlığınız için',
                    desc: 'Uzman hekim kadromuz ve ileri teknoloji altyapımızla, sağlığınız için yanınızdayız.',
                    mobileDesc: 'Uzman hekim kadromuz ve ileri teknolojiyle yanınızdayız.',
                },
                {
                    eyebrow: 'Robotik Cerrahi',
                    title: 'Robotik cerrahi ile hizmetinizdeyiz',
                    mobileTitle: 'Robotik cerrahi ile hizmetinizdeyiz',
                    desc: 'Milimetrik hassasiyet, daha küçük kesi ve hızlı iyileşme; cerrahide yeni nesil bir dönem.',
                    mobileDesc: 'Milimetrik hassasiyet, küçük kesi, hızlı iyileşme.',
                },
                {
                    eyebrow: 'İleri Göz Tedavileri Kliniği',
                    title: 'Göz sağlığında ileri teknoloji ve uzman yaklaşım',
                    mobileTitle: 'Göz sağlığında uzman yaklaşım',
                    desc: 'Lazer, retina ve katarakt tedavilerinde uzman değerlendirme ve takip.',
                    mobileDesc: 'Lazer, retina ve katarakt tedavilerinde uzman değerlendirme ve takip.',
                },
            ],
        },
        announce: {
            prev: 'Önceki',
            next: 'Sonraki',
            items: [
                { title: 'Mobil Uygulamamız Çıktı', sub: "Randevu, sonuç ve doktor; App Store & Google Play'de.", cta: 'İndir' },
                { title: 'Gebelik Eğitim Semineri', sub: "12 Ekim'de Hisar Hospital'de.", cta: 'Detaylar' },
                { title: 'Yenilenen Göz Sağlığı Merkezi', sub: 'Hizmetinizde — randevu alın.', cta: 'Detaylar' },
                { title: 'Çocuk Sağlığı Check-up', sub: 'Okul dönemi özel paketler.', cta: 'Detaylar' },
            ],
        },
        quick: {
            eyebrow: 'Hızlı Erişim',
            title: 'Size nasıl yardımcı olabiliriz?',
            subtitle: 'Randevu, doktor ve e-sonuç işlemlerine hızlıca ulaşın.',
            items: [
                { label: 'E-Sonuç', desc: 'Laboratuvar ve görüntüleme sonuçlarınıza güvenli şekilde ulaşın.', mobileDesc: 'Sonuçlara ulaş', cta: 'Sonuçlara Git' },
                { label: 'Anlaşmalı Kurumlar', desc: 'Anlaşmalı kurum ve sigorta bilgilerine ulaşın.', mobileDesc: 'Kurumları gör', cta: 'Kurumları İncele' },
                { label: 'Doktor Ara', desc: 'Uzman hekimleri branş, isim veya ilgi alanına göre inceleyin.', mobileDesc: 'Hekimleri incele', cta: 'Doktorları Gör' },
                { label: 'Hisar Online', desc: 'Tüm online işlemlerinizi güvenli şekilde gerçekleştirin.', mobileDesc: 'Online işlemler', cta: 'Giriş Yap' },
            ],
        },
        departments: {
            eyebrow: 'Bölümlerimiz',
            titleLead: 'Hayatın her döneminde',
            titleAccent: 'yanınızdayız',
            desc: "50'den fazla branşta uzman hekim kadromuz ve multidisipliner yaklaşımımızla; tanı, tedavi ve takip süreçlerinde yanınızdayız.",
            featured: 'Öne çıkan bölümler',
            seeAll: 'Tümünü gör',
            seeAllDepartments: 'Tüm Bölümleri Gör',
        },
        symptom: {
            title: 'Hangi bölüme gitmeliyim?',
            subtitle: 'Şikayetinizi yazın, sizi doğru bölüme yönlendirelim.',
            placeholder: 'Şikayetinizi yazın',
            findDept: 'Bölümü Bul',
            example: 'Örnek',
            suggestions: ['Baş ağrısı', 'Çarpıntı', 'Safra kesesi', 'Çocuk ateşi'],
        },
        onko: {
            badge: 'BÜTÜNLEŞİK ONKOLOJİ',
            titleLead: 'Kanser tedavisinde',
            titleAccent: 'bütünleşik',
            titleTail: 'bir yaklaşım',
            desc: "Hisar Hospital Bütünleşik Onkoloji Merkezi'nde tanı, tedavi ve takip süreçleriniz tek merkezde ve tümör konseyi ile değerlendirilerek yapılır.",
            imgAlt: 'Hisar Hospital Bütünleşik Onkoloji Merkezi',
            iframeTitle: 'Hisar Hospital Bütünleşik Onkoloji Merkezi',
            videoBadge: 'Tanıtım Videosu',
            youtubeId: 'EMGGDcEurkg',
            playAria: 'Bütünleşik Onkoloji Merkezi tanıtım videosunu oynat',
            closeAria: 'Videoyu kapat',
            cardComprehensive: 'Comprehensive',
            cardCancerCenter: 'Cancer Center',
            cardJci: 'JCI Akreditasyonlu',
            cardJciDesc: 'Uluslararası Kalite Standartı',
            appointment: 'Randevu Al',
            exploreCenter: 'Merkezi İncele',
            features: [
                { title: 'Multidisipliner Yaklaşım', desc: 'Tanı ve tedavi süreçleri ilgili branşların ortak değerlendirmesiyle planlanır.' },
                { title: 'İleri Teknoloji', desc: 'Tanı, görüntüleme ve tedavi süreçlerinde ileri teknoloji altyapısı kullanılır.' },
                { title: 'Tüm Tedaviler Tek Merkezde', desc: 'Tanıdan tedaviye ve takibe kadar tüm süreçler tek bir merkezde sunulur.' },
            ],
            checklist: [
                { label: 'Multidisipliner tümör konseyi', hide: false },
                { label: 'İleri görüntüleme ve tanı altyapısı', hide: true },
                { label: 'Robotik cerrahi olanakları', hide: false },
                { label: 'Hassas radyoterapi teknolojileri', hide: false },
                { label: 'Moleküler tanı ve patoloji desteği', hide: true },
                { label: 'İkinci görüş ve kişiye özel tedavi planı', hide: false },
            ],
        },
        merkezler: {
            eyebrow: 'Özel Merkezler',
            title: 'Özel Hizmetler ve Merkezler',
            subtitle: 'Alanında uzman akademik kadromuz ve ileri teknoloji altyapımızla; özel ilgi alanlarımızda sağlığınız için yanınızdayız.',
            items: [
                { name: 'Robotik Kalp Cerrahisi', desc: 'Da Vinci robotik sistemi ile milimetrik hassasiyet, küçük kesi ve hızlı iyileşme.', accent: 'Robotik Cerrahi' },
                { name: 'Prostat Sağlığı Kliniği', desc: 'Akademik kadro ve ileri teknolojik donanımla prostat sağlığına bütünsel yaklaşım.', accent: 'Üroloji' },
                { name: 'İleri Göz Tedavileri Kliniği', desc: 'Modern tedavi yöntemleri ve uzman kadromuzla sağlıklı, net bir görüş için.', accent: 'Göz Sağlığı' },
                { name: 'Baş ve Boyun Kanser Cerrahisi', desc: 'Multidisipliner yaklaşım ve güncel tedavi yöntemleriyle kişiye özel çözümler.', accent: 'Onkolojik Cerrahi' },
            ],
        },
        hospitals: {
            eyebrow: 'Hastanelerimiz',
            title: 'Hisar Hospital şehrin iki yakasında yanınızda',
            subtitle: 'Aynı hasta odaklı yaklaşım, aynı yüksek hizmet standartları; şimdi farklı noktalarda yanınızda.',
            comingSoonBadge: 'Çok Yakında',
            comingSoonBody: 'Açılış için hazırlık süreci devam ediyor. Yeni kampüsümüz hakkındaki gelişmeleri yakında paylaşacağız.',
            openBody: 'JCI akreditasyonlu sağlık hizmeti, ileri teknoloji altyapısı ve uzman hekim kadrosu ile hizmetinizdeyiz.',
            openingSoon: 'Yakında Açılıyor',
            getInfo: 'Bilgi Al',
            directions: 'Yol Tarifi',
            moreInfo: 'Detaylı Bilgi',
        },
        trust: {
            eyebrow: 'Güvenin sayılarla ifadesi',
            title: 'Sağlıkta deneyim, kalite ve güven.',
            desc: 'Uzman kadromuz, ileri teknoloji altyapımız ve uluslararası kalite standartlarımızla sağlık yolculuğunuzda yanınızdayız.',
            stats: [
                { target: 300, suffix: '+', label: 'Uzman hekim' },
                { target: 1, suffix: 'M+', label: 'Hasta deneyimi' },
                { target: 20, suffix: '+', label: 'Yıllık deneyim' },
                { target: 3, suffix: '', label: 'Hastane' },
            ],
        },
        blog: {
            eyebrow: 'Rehber',
            title: "Sağlıklı Hayat Rehberi'nden öne çıkanlar",
            allArticles: 'Tüm İçerikler',
            readMore: 'Devamı',
            swipe: 'Kaydırın →',
        },
    },
    en: {
        head: {
            title: 'Hisar Hospital — Lifelong Health',
            description: 'JCI-accredited healthcare with expert physicians and advanced technology — by your side through diagnosis, treatment and follow-up.',
        },
        hero: {
            slide: 'Slide',
            appointment: 'Book Appointment',
            findDoctor: 'Find a Doctor',
            intlPatients: 'International Patients',
            slides: [
                {
                    eyebrow: 'Hisar Intercontinental',
                    title: 'By your side for lifelong health',
                    mobileTitle: 'For your lifelong health',
                    desc: 'With our expert physicians and advanced technology, we are here for your health.',
                    mobileDesc: 'Expert physicians and advanced technology, by your side.',
                },
                {
                    eyebrow: 'Robotic Surgery',
                    title: 'At your service with robotic surgery',
                    mobileTitle: 'At your service with robotic surgery',
                    desc: 'Millimetric precision, smaller incisions and faster recovery — a new era in surgery.',
                    mobileDesc: 'Millimetric precision, small incisions, fast recovery.',
                },
                {
                    eyebrow: 'Advanced Eye Treatments Clinic',
                    title: 'Advanced technology and expert care in eye health',
                    mobileTitle: 'Expert care in eye health',
                    desc: 'Expert evaluation and follow-up in laser, retina and cataract treatments.',
                    mobileDesc: 'Expert evaluation and follow-up in laser, retina and cataract treatments.',
                },
            ],
        },
        announce: {
            prev: 'Previous',
            next: 'Next',
            items: [
                { title: 'Our Mobile App Is Here', sub: 'Appointments, results and doctors — on the App Store & Google Play.', cta: 'Download' },
                { title: 'Pregnancy Education Seminar', sub: 'On October 12 at Hisar Hospital.', cta: 'Details' },
                { title: 'Renewed Eye Health Center', sub: 'Now open — book your appointment.', cta: 'Details' },
                { title: 'Pediatric Check-up', sub: 'Special back-to-school packages.', cta: 'Details' },
            ],
        },
        quick: {
            eyebrow: 'Quick Access',
            title: 'How can we help you?',
            subtitle: 'Quickly reach appointments, doctors and e-results.',
            items: [
                { label: 'E-Results', desc: 'Securely access your laboratory and imaging results.', mobileDesc: 'View results', cta: 'Go to Results' },
                { label: 'Contracted Institutions', desc: 'Access contracted institution and insurance information.', mobileDesc: 'View institutions', cta: 'View Institutions' },
                { label: 'Find a Doctor', desc: 'Browse expert physicians by specialty, name or area of interest.', mobileDesc: 'Browse doctors', cta: 'View Doctors' },
                { label: 'Hisar Online', desc: 'Carry out all your online transactions securely.', mobileDesc: 'Online services', cta: 'Sign In' },
            ],
        },
        departments: {
            eyebrow: 'Our Departments',
            titleLead: 'In every stage of life',
            titleAccent: "we're by your side",
            desc: 'With expert physicians across more than 50 specialties and our multidisciplinary approach, we support you through diagnosis, treatment and follow-up.',
            featured: 'Featured departments',
            seeAll: 'See all',
            seeAllDepartments: 'See All Departments',
        },
        symptom: {
            title: 'Which department should I visit?',
            subtitle: "Describe your symptom and we'll guide you to the right department.",
            placeholder: 'Describe your symptom',
            findDept: 'Find Department',
            example: 'Example',
            suggestions: ['Headache', 'Palpitations', 'Gallbladder', 'Child fever'],
        },
        onko: {
            badge: 'INTEGRATED ONCOLOGY',
            titleLead: 'An',
            titleAccent: 'integrated',
            titleTail: 'approach to cancer treatment',
            desc: 'At the Hisar Hospital Integrated Oncology Center, your diagnosis, treatment and follow-up are carried out in a single center and evaluated by a tumor board.',
            imgAlt: 'Hisar Hospital Integrated Oncology Center',
            iframeTitle: 'Hisar Hospital Integrated Oncology Center',
            videoBadge: 'Intro Video',
            youtubeId: 'EMGGDcEurkg',
            playAria: 'Play the Integrated Oncology Center intro video',
            closeAria: 'Close video',
            cardComprehensive: 'Comprehensive',
            cardCancerCenter: 'Cancer Center',
            cardJci: 'JCI Accredited',
            cardJciDesc: 'International Quality Standard',
            appointment: 'Book Appointment',
            exploreCenter: 'Explore the Center',
            features: [
                { title: 'Multidisciplinary Approach', desc: 'Diagnosis and treatment are planned through the joint evaluation of the relevant specialties.' },
                { title: 'Advanced Technology', desc: 'Advanced technology is used across diagnosis, imaging and treatment.' },
                { title: 'All Treatments in One Center', desc: 'From diagnosis to treatment and follow-up, every step is offered in a single center.' },
            ],
            checklist: [
                { label: 'Multidisciplinary tumor board', hide: false },
                { label: 'Advanced imaging and diagnostic infrastructure', hide: true },
                { label: 'Robotic surgery capabilities', hide: false },
                { label: 'Precision radiotherapy technologies', hide: false },
                { label: 'Molecular diagnostics and pathology support', hide: true },
                { label: 'Second opinion and personalized treatment plan', hide: false },
            ],
        },
        merkezler: {
            eyebrow: 'Special Centers',
            title: 'Special Services and Centers',
            subtitle: 'With our expert academic staff and advanced technology, we are by your side in our special areas of focus.',
            items: [
                { name: 'Robotic Heart Surgery', desc: 'Millimetric precision, small incisions and fast recovery with the Da Vinci robotic system.', accent: 'Robotic Surgery' },
                { name: 'Prostate Health Clinic', desc: 'A holistic approach to prostate health with academic staff and advanced technology.', accent: 'Urology' },
                { name: 'Advanced Eye Treatments Clinic', desc: 'For healthy, clear vision with modern treatment methods and our expert team.', accent: 'Eye Health' },
                { name: 'Head and Neck Cancer Surgery', desc: 'Personalized solutions with a multidisciplinary approach and current treatment methods.', accent: 'Oncologic Surgery' },
            ],
        },
        hospitals: {
            eyebrow: 'Our Hospitals',
            title: 'Hisar Hospital, by your side on both sides of the city',
            subtitle: 'The same patient-focused approach and high service standards — now at more locations near you.',
            comingSoonBadge: 'Coming Soon',
            comingSoonBody: "Preparations for the opening are ongoing. We'll share updates about our new campus soon.",
            openBody: 'At your service with JCI-accredited healthcare, advanced technology and expert physicians.',
            openingSoon: 'Opening Soon',
            getInfo: 'Get Info',
            directions: 'Directions',
            moreInfo: 'More Info',
        },
        trust: {
            eyebrow: 'Trust, expressed in numbers',
            title: 'Experience, quality and trust in healthcare.',
            desc: "With our expert team, advanced technology and international quality standards, we're with you on your health journey.",
            stats: [
                { target: 300, suffix: '+', label: 'Expert physicians' },
                { target: 1, suffix: 'M+', label: 'Patient experiences' },
                { target: 20, suffix: '+', label: 'Years of experience' },
                { target: 3, suffix: '', label: 'Hospitals' },
            ],
        },
        blog: {
            eyebrow: 'Guide',
            title: 'Highlights from the Healthy Living Guide',
            allArticles: 'All Articles',
            readMore: 'Read More',
            swipe: 'Swipe →',
        },
    },
} as const;

/* ───────────────────────── PAGE ───────────────────────── */
export default function Home() {
    const c = usePageCopy('home', COPY[useLocale()]);
    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                {/* Per-locale SEO alternates. */}
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/" />
            </Head>

            <Hero />
            {/* 1. Hemen aksiyon: randevu / e-sonuç kısayolları */}
            <QuickShortcuts />
            {/* 2. Güven: JCI, hekim sayısı, deneyim */}
            <TrustBand />
            {/* 3. "Hangi bölüme gitmeliyim?" — bölüm bulma + şikayet arama */}
            <Departments />
            {/* 4. Uzmanlık alanları ve öne çıkan merkez */}
            <OzelMerkezler />
            <OnkolojiSpotlight />
            {/* 5. Nereye geleceğim? — hastaneler */}
            <Hospitals />
            {/* 6. Süreklilik: içerik */}
            <BlogTeaser />
            <PreFooter />
            <AppShowcase />
        </>
    );
}

Home.layout = siteLayout;

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
    const c = usePageCopy('home', COPY[useLocale()]);
    const lp = useLocalizedPath();
    const settings = useSettings();
    const [active, setActive] = useState(0);

    // DB-managed hero wins; fall back to the in-memory media + COPY when absent/empty.
    const homeHero = (usePage().props as { homeHero?: HomeHero | null }).homeHero ?? null;
    const dbSlides = homeHero?.slides ?? [];
    const slides = dbSlides.length > 0
        ? dbSlides.map((s) => ({
            image: s.image ?? '',
            mobileImage: s.mobileImage ?? '',
            position: s.position ?? '50% 50%',
            mobilePosition: s.mobilePosition ?? s.position ?? '50% 50%',
            href: s.href ?? '#',
            eyebrow: s.eyebrow ?? '',
            title: s.title ?? '',
            mobileTitle: s.mobileTitle ?? '',
            desc: s.desc ?? '',
            mobileDesc: s.mobileDesc ?? '',
        }))
        : HERO_SLIDE_MEDIA.map((m, i) => ({ ...m, ...c.hero.slides[i] }));
    const total = slides.length;
    const intervalMs = homeHero?.interval_ms ?? 3000;
    const autoplay = homeHero?.autoplay ?? true;

    useEffect(() => {
        if (!autoplay || total <= 1) return;
        const t = setInterval(() => setActive((p) => (p + 1) % total), intervalMs);
        return () => clearInterval(t);
    }, [total, intervalMs, autoplay]);

    return (
        <section className="relative overflow-hidden">
            <div className="relative h-[72svh] min-h-[520px] max-h-[860px] sm:h-[82svh] sm:min-h-[620px] w-full">
                {/* Crossfade background stack */}
                {slides.map((slide, idx) => (
                    <picture
                        key={slide.image}
                        aria-hidden={idx !== active}
                        className="absolute inset-0 h-full w-full transition-opacity duration-[1600ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[opacity]"
                        style={{ opacity: idx === active ? 1 : 0 }}
                    >
                        {slide.mobileImage && (
                            <source media="(max-width: 639px)" srcSet={slide.mobileImage} />
                        )}
                        <img
                            src={slide.image}
                            alt=""
                            width={1920}
                            height={1280}
                            loading={idx === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            fetchPriority={idx === 0 ? 'high' : 'low'}
                            className="absolute inset-0 h-full w-full object-cover"
                            style={{
                                objectPosition: slide.mobileImage
                                    ? 'var(--hero-pos, 50% 50%)'
                                    : '50% 50%',
                                ['--hero-pos' as string]: slide.mobilePosition ?? slide.position,
                            } as React.CSSProperties}
                        />
                        {/* TODO: real asset */}
                    </picture>
                ))}

                {/* Okunurluk katmanları */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/10" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
                {/* Sol alt lokal koyu gradient — sadece metin alanını destekler */}
                <div
                    className="absolute inset-0 hidden sm:block pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 55% 70% at 22% 78%, rgba(6,14,38,0.72) 0%, rgba(6,14,38,0.45) 35%, rgba(6,14,38,0.15) 60%, rgba(6,14,38,0) 80%)',
                    }}
                />

                <div className="relative container-x h-full flex flex-col">
                    {/* MOBİL */}
                    <div className="sm:hidden flex-1 flex flex-col text-center text-white px-2 pt-10 pb-6">
                        <div className="flex-1" />

                        <div className="rounded-2xl bg-primary/40 backdrop-blur-sm ring-1 ring-white/10 shadow-[0_10px_30px_-20px_rgba(8,18,46,0.6)] px-3.5 pt-3 pb-2.5">
                            {/* Rotating highlight — only this text crossfades */}
                            <div className="relative min-h-[86px]">
                                {slides.map((s, idx) => (
                                    <div
                                        key={s.title}
                                        aria-hidden={idx !== active}
                                        className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
                                        style={{ opacity: idx === active ? 1 : 0 }}
                                    >
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-cyan drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
                                            <span className="inline-block h-px w-4 bg-brand-cyan/70" />
                                            {s.eyebrow}
                                        </span>
                                        <h2 className="mt-1 text-[16px] font-bold leading-snug text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.7)]">
                                            {s.mobileTitle}
                                        </h2>
                                        <p className="mt-1 text-[12px] text-white/88 leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
                                            {s.mobileDesc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* CTAs — completely static, never affected by slide changes */}
                            <div className="mt-3 space-y-1.5">
                                <AppointmentCTA href={settings.appointment_url} className="w-full">
                                    {c.hero.appointment} <CalendarDays className="h-4 w-4" />
                                </AppointmentCTA>
                                <button
                                    type="button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-site-search'))}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 py-2.5 text-[14px] font-bold text-primary"
                                >
                                    {c.hero.findDoctor} <SearchIcon className="h-4 w-4" />
                                </button>
                                <Link
                                    href={lp('/iletisim')}
                                    className="flex w-full items-center justify-center gap-1.5 pt-1 pb-0.5 text-[11.5px] font-medium tracking-wide text-white/75 hover:text-white transition"
                                >
                                    {c.hero.intlPatients} <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* MASAÜSTÜ */}
                    <div className="hidden sm:block flex-1" />

                    {/* Sol alt: rotating highlight + sabit CTA */}
                    <div className="hidden sm:block pb-12 lg:pb-14">
                        <div className="max-w-xl text-white">
                            {/* Rotating highlight strip */}
                            <div className="relative min-h-[230px] lg:min-h-[244px] max-w-xl">
                                {slides.map((s, idx) => (
                                    <div
                                        key={s.title}
                                        aria-hidden={idx !== active}
                                        className="absolute inset-0 transition-opacity duration-[1100ms] ease-out"
                                        style={{ opacity: idx === active ? 1 : 0 }}
                                    >
                                        <span className="inline-flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.24em] text-brand-cyan drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)]">
                                            <span className="inline-block h-px w-8 bg-brand-cyan" />
                                            {s.eyebrow}
                                        </span>
                                        <h1 className="mt-3 text-[2rem] lg:text-[2.4rem] font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_22px_rgba(0,0,0,0.75)]">
                                            {s.title}
                                        </h1>
                                        <p className="mt-3.5 text-[15px] lg:text-base font-medium text-white/95 leading-relaxed max-w-md [text-shadow:0_1px_14px_rgba(0,0,0,0.7)]">
                                            {s.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* CTA paneli — slide değişiminden tamamen bağımsız, hep aynı yerde */}
                            <div className="mt-6 inline-flex items-center gap-3 p-2 rounded-2xl bg-primary/35 backdrop-blur-md ring-1 ring-white/15 shadow-[0_18px_45px_-22px_rgba(8,18,46,0.7)]">
                                <AppointmentCTA href={settings.appointment_url}>
                                    {c.hero.appointment}
                                    <CalendarDays className="h-4 w-4" />
                                </AppointmentCTA>
                                <button
                                    type="button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-site-search'))}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/95 px-6 py-3 text-sm font-bold text-primary hover:bg-white transition"
                                >
                                    {c.hero.findDoctor}
                                    <SearchIcon className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Slide göstergeleri — premium, ince ve net */}
                            <div className="mt-6 flex items-center gap-2.5">
                                {slides.map((s, idx) => (
                                    <button
                                        key={s.title}
                                        type="button"
                                        onClick={() => setActive(idx)}
                                        aria-label={`${c.hero.slide} ${idx + 1}`}
                                        className="group relative h-[4px] rounded-full overflow-hidden bg-white/40 transition-all duration-500 hover:bg-white/55"
                                        style={{ width: idx === active ? 48 : 20 }}
                                    >
                                        <span
                                            key={`${idx}-${active}`}
                                            className="absolute inset-y-0 left-0 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.85)]"
                                            style={{
                                                width: idx === active ? '100%' : '0%',
                                                transition: idx === active ? `width ${intervalMs}ms linear` : 'width 400ms ease',
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="hidden lg:block mt-5">
                            <AnnouncementStrip />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const ANNOUNCEMENT_HREFS = ['/mobil-uygulama', '#', '#', '#'] as const;

function AnnouncementStrip() {
    const c = usePageCopy('home', COPY[useLocale()]);
    const lp = useLocalizedPath();
    const [i, setI] = useState(0);
    const announcements = c.announce.items.map((a, idx) => ({ ...a, href: ANNOUNCEMENT_HREFS[idx] }));
    useEffect(() => {
        const t = setInterval(() => setI((p) => (p + 1) % announcements.length), 5000);
        return () => clearInterval(t);
    }, [announcements.length]);
    const item = announcements[i];
    const prev = () => setI((p) => (p - 1 + announcements.length) % announcements.length);
    const next = () => setI((p) => (p + 1) % announcements.length);
    const isInternal = item.href.startsWith('/');
    return (
        <div className="ml-auto flex max-w-md items-center gap-3 rounded-full bg-white/90 backdrop-blur-md px-4 py-2.5 ring-1 ring-white/40 shadow-[0_8px_24px_-12px_rgba(8,18,46,0.4)]">
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                <span className="absolute h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <p className="flex-1 truncate text-[13px] leading-snug text-primary">
                <span className="font-semibold">{item.title}</span>{' '}
                <span className="text-primary/70">— {item.sub}</span>
            </p>
            {isInternal ? (
                <Link href={lp(item.href)} className="shrink-0 text-[12.5px] font-semibold text-primary hover:text-primary hover:underline">
                    {item.cta}
                </Link>
            ) : (
                <a href={item.href} className="shrink-0 text-[12.5px] font-semibold text-primary hover:text-primary hover:underline">
                    {item.cta}
                </a>
            )}
            <div className="flex items-center gap-0.5 pl-2 border-l border-primary/15">
                <button onClick={prev} className="flex h-5 w-5 items-center justify-center rounded-full text-primary/50 hover:bg-primary/10 hover:text-primary transition" aria-label={c.announce.prev}>
                    <ChevronLeft className="h-3 w-3" />
                </button>
                <button onClick={next} className="flex h-5 w-5 items-center justify-center rounded-full text-primary/50 hover:bg-primary/10 hover:text-primary transition" aria-label={c.announce.next}>
                    <ChevronRight className="h-3 w-3" />
                </button>
            </div>
        </div>
    );
}

/* ───────────────── HIZLI İŞLEMLER ───────────────── */
function QuickShortcuts() {
    const c = usePageCopy('home', COPY[useLocale()]);
    const lp = useLocalizedPath();
    const meta = [
        { to: 'https://online.hisarhospital.com/#/', external: true, icon: ClipboardList },
        { to: '/anlasmali-kurumlar', external: false, icon: ShieldCheck },
        { to: '/doktorlarimiz', external: false, icon: UserSearch },
        { to: 'https://online.hisarhospital.com', external: true, icon: Globe },
    ];
    const items = meta.map((m, i) => ({ ...m, ...c.quick.items[i] }));
    return (
        <section className="bg-surface py-10 lg:py-14">
            <div className="container-x">
                <SectionHead
                    eyebrow={c.quick.eyebrow}
                    title={c.quick.title}
                    subtitle={c.quick.subtitle}
                />

                {/* Mobile: 2x2 kompakt grid */}
                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:hidden">
                    {items.map((it) => {
                        const cls = 'group relative flex flex-col justify-between rounded-2xl p-3.5 min-h-[108px] border transition active:scale-[0.98] bg-card text-foreground border-border/70';
                        const inner = (
                            <>
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary ring-1 ring-inset ring-primary/10">
                                    <it.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                                </span>
                                <div className="mt-2.5 flex items-end justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="text-[13.5px] font-bold leading-tight truncate text-primary">
                                            {it.label}
                                        </h3>
                                        <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                                            {it.mobileDesc}
                                        </p>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-orange" strokeWidth={2.25} />
                                </div>
                            </>
                        );
                        return it.external ? (
                            <a key={it.label} href={it.to} target="_blank" rel="noopener noreferrer" className={cls}>
                                {inner}
                            </a>
                        ) : (
                            <Link key={it.label} href={lp(it.to)} className={cls}>
                                {inner}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop / Tablet: 4 kolon kartlar */}
                <div className="mt-8 hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4">
                    {items.map((it) => {
                        const cls = 'group relative overflow-hidden rounded-2xl border transition-all duration-300 bg-card text-foreground border-border/55';
                        const inner = (
                            <>
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(0.99_0.005_265)_0%,oklch(0.98_0.01_265)_100%)]" />
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

                                <div className="relative flex h-full flex-col p-4 lg:p-[1.1rem]">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary-soft text-primary ring-1 ring-inset ring-primary/15">
                                        <it.icon className="h-[19px] w-[19px]" strokeWidth={1.6} />
                                    </span>

                                    <h3 className="mt-3.5 text-[15px] font-bold leading-tight tracking-tight text-primary">
                                        {it.label}
                                    </h3>
                                    <p className="mt-1 text-[12.5px] leading-snug text-muted-foreground">
                                        {it.desc}
                                    </p>

                                    {/* Divider + CTA */}
                                    <div className="mt-auto pt-3">
                                        <div className="mb-2.5 h-px w-full bg-border/60" />
                                        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold tracking-tight text-brand-orange">
                                            {it.cta}
                                            <ArrowRight className="h-3.5 w-3.5 text-brand-orange" />
                                        </span>
                                    </div>
                                </div>
                            </>
                        );
                        return it.external ? (
                            <a key={it.label} href={it.to} target="_blank" rel="noopener noreferrer" className={cls}>
                                {inner}
                            </a>
                        ) : (
                            <Link key={it.label} href={lp(it.to)} className={cls}>
                                {inner}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ───────────────────── BÖLÜMLER ───────────────────── */
function Departments() {
    const c = usePageCopy('home', COPY[useLocale()]);
    const lp = useLocalizedPath();
    const departments = useDepartments();
    return (
        <section className="relative py-14 lg:py-20 bg-gradient-to-b from-surface via-primary-soft/15 to-surface overflow-hidden">
            {/* Premium ambient accents */}
            <div aria-hidden className="absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-primary/[0.05] blur-3xl" />
            <div aria-hidden className="absolute -bottom-32 -right-24 h-[24rem] w-[24rem] rounded-full bg-brand-orange/[0.05] blur-3xl" />

            <div className="container-x relative">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    {/* LEFT: title + finder */}
                    <div className="lg:col-span-5 lg:sticky lg:top-36">
                        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">
                            <span className="h-px w-6 bg-brand-orange/60" />
                            {c.departments.eyebrow}
                        </span>
                        <h2 className="mt-4 text-[2rem] sm:text-[2.35rem] lg:text-[2.75rem] font-semibold tracking-tight text-primary text-balance leading-[1.05]">
                            {c.departments.titleLead}{' '}
                            <span className="italic font-serif font-normal text-brand-orange/90 tracking-tight">
                                {c.departments.titleAccent}
                            </span>
                            <span className="text-primary">.</span>
                        </h2>
                        <p className="mt-5 text-[15px] text-muted-foreground max-w-[36ch] leading-[1.7]">
                            {c.departments.desc}
                        </p>

                        <SymptomFinder />
                    </div>

                    {/* RIGHT: department list */}
                    <div className="lg:col-span-7">
                        <div className="rounded-2xl border border-border/70 bg-card shadow-[0_18px_44px_-28px_oklch(0.28_0.16_268/0.28)] overflow-hidden">
                            <div className="flex items-center justify-between px-5 lg:px-6 py-3.5 border-b border-border/70 bg-gradient-to-r from-primary-soft/40 to-transparent">
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/75">
                                    {c.departments.featured}
                                </span>
                                <Link
                                    href={lp('/bolumlerimiz')}
                                    className="hidden sm:inline-flex items-center gap-1 text-[12px] font-semibold text-brand-orange hover:text-brand-orange/80 transition"
                                >
                                    {c.departments.seeAll} <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-border/60">
                                {departments.slice(0, 8).map((d, i) => {
                                    const row = Math.floor(i / 2);
                                    const col = i % 2;
                                    const borderTop = row > 0 ? 'sm:border-t sm:border-border/60' : '';
                                    const borderLeft = col === 1 ? 'sm:border-l sm:border-border/60' : '';
                                    const mobileHide = i >= 5 ? 'hidden sm:block' : '';
                                    return (
                                        <li key={d.slug} className={`${borderTop} ${borderLeft} ${mobileHide}`}>
                                            <Link
                                                href={lp('/bolum/' + d.slug)}
                                                className="group relative flex items-start gap-3.5 px-5 lg:px-6 py-4 lg:py-[1.05rem] transition-all duration-300 hover:bg-primary-soft/40"
                                            >
                                                <span className="absolute left-0 top-0 h-full w-[2px] bg-brand-orange scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
                                                <span className="mt-[3px] inline-flex h-[22px] min-w-[26px] items-center justify-center rounded-md bg-brand-orange/10 px-1.5 text-[10.5px] font-mono font-bold tracking-wider text-brand-orange ring-1 ring-inset ring-brand-orange/20 group-hover:bg-brand-orange group-hover:text-brand-orange-foreground group-hover:ring-brand-orange transition-colors">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-[15px] lg:text-[15.5px] font-bold text-primary leading-snug group-hover:text-brand-orange transition-colors">
                                                        {d.name}
                                                    </h3>
                                                    <p className="mt-1 text-[12.5px] lg:text-[13px] text-muted-foreground line-clamp-2 leading-[1.55]">
                                                        {d.blurb}
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground/35 group-hover:text-brand-orange group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-1.5" />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>

                            <Link
                                href={lp('/bolumlerimiz')}
                                className="group flex items-center justify-center gap-2 border-t border-border/70 bg-gradient-to-r from-primary-soft/30 via-card to-primary-soft/30 px-5 py-3.5 text-[13px] font-bold uppercase tracking-[0.14em] text-primary hover:text-brand-orange transition"
                            >
                                {c.departments.seeAllDepartments}
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SymptomFinder() {
    const c = usePageCopy('home', COPY[useLocale()]);
    const lp = useLocalizedPath();
    const symptomMap = useSymptomMap();
    const [q, setQ] = useState('');

    const matches = useMemo(() => {
        const n = normalizeTr(q);
        if (!n || n.length < 2) return [];
        const seen = new Set<string>();
        const out: { label: string; deptSlug: string }[] = [];
        for (const m of symptomMap) {
            if (m.keywords.some((k) => normalizeTr(k).includes(n) || n.includes(normalizeTr(k)))) {
                if (!seen.has(m.deptSlug)) {
                    seen.add(m.deptSlug);
                    out.push({ label: m.label, deptSlug: m.deptSlug });
                }
            }
        }
        return out.slice(0, 4);
    }, [q, symptomMap]);

    return (
        <div className="relative mt-7 rounded-2xl border border-border/70 bg-card p-5 lg:p-6 shadow-[0_18px_44px_-24px_oklch(0.28_0.16_268/0.28)] overflow-hidden">
            <div aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-orange/60 to-transparent" />

            <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange ring-1 ring-inset ring-brand-orange/20">
                    <SearchIcon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                    <p className="text-[15px] font-bold text-primary leading-tight">{c.symptom.title}</p>
                    <p className="mt-1 text-[12.5px] text-muted-foreground leading-snug">
                        {c.symptom.subtitle}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background pl-3.5 pr-1.5 py-1.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={c.symptom.placeholder}
                    className="flex-1 min-w-0 bg-transparent text-[13.5px] py-1.5 outline-none placeholder:text-muted-foreground/70"
                />
                <button
                    type="button"
                    onClick={() => router.visit(lp('/bolumlerimiz'))}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 hover:shadow-elevated transition shrink-0"
                >
                    {c.symptom.findDept} <ArrowRight className="h-3 w-3" />
                </button>
            </div>

            {matches.length > 0 ? (
                <div className="mt-3.5 flex flex-wrap gap-2">
                    {matches.map((m) => (
                        <button
                            key={m.deptSlug}
                            onClick={() => router.visit(lp('/bolumlerimiz'))}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition"
                        >
                            {m.label} <ArrowRight className="h-3 w-3" />
                        </button>
                    ))}
                </div>
            ) : (
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">{c.symptom.example}</span>
                    {c.symptom.suggestions.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setQ(s)}
                            className="rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11.5px] font-semibold text-primary/85 hover:border-primary/40 hover:bg-primary-soft/60 hover:text-primary transition"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ───────────────────── ONKOLOJİ ───────────────────── */
function OnkolojiSpotlight() {
    const c = usePageCopy('home', COPY[useLocale()]);
    const lp = useLocalizedPath();
    const settings = useSettings();
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const youtubeId = c.onko.youtubeId || 'EMGGDcEurkg';

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const update = () => setIsDesktop(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    const featureIcons = [Dna, Microscope, Award];
    const features = c.onko.features.map((f, i) => ({ ...f, icon: featureIcons[i] }));
    return (
        <section className="relative py-14 lg:py-24 overflow-hidden bg-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
            <div className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-brand-cyan/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-brand-orange/10 blur-3xl" />

            <div className="relative container-x">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    {/* Content — mobilde önce gelir */}
                    <div className="order-1 lg:order-2 lg:col-span-6 text-white">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-cyan border border-white/15">
                            <Microscope className="h-3.5 w-3.5" /> {c.onko.badge}
                        </span>
                        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
                            {c.onko.titleLead} <span className="text-brand-cyan">{c.onko.titleAccent}</span> {c.onko.titleTail}
                        </h2>
                        <p className="mt-5 text-white/85 text-base lg:text-lg leading-relaxed max-w-xl">
                            {c.onko.desc}
                        </p>

                        {/* Mobil görsel / video — açıklama metninin hemen altında */}
                        <div className="lg:hidden mt-6 relative w-full aspect-[4/5] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-elevated ring-1 ring-white/10 bg-black">
                            {videoPlaying && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setVideoPlaying(false); }}
                                    aria-label={c.onko.closeAria}
                                    className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur border border-white/20 text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                            {videoPlaying && !isDesktop ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                                    title={c.onko.iframeTitle}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute inset-0 h-full w-full"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setVideoPlaying(true)}
                                    aria-label={c.onko.playAria}
                                    className="group absolute inset-0 block"
                                >
                                    {/* TODO: real asset */}
                                    <img
                                        src={onkolojiImg}
                                        alt={c.onko.imgAlt}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/15 to-primary/30" />
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-primary shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] ring-1 ring-white/40">
                                            <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                                            <Play className="relative h-6 w-6 fill-current ml-0.5" />
                                        </span>
                                    </span>
                                    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-brand-orange-foreground shadow-orange">
                                        <Play className="h-3 w-3 fill-current" /> {c.onko.videoBadge}
                                    </span>
                                    <div className="absolute bottom-4 left-4 right-4 sm:right-auto rounded-2xl bg-white/95 backdrop-blur p-3.5 shadow-elevated max-w-[260px] text-left">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-orange text-brand-orange-foreground">
                                                <Award className="h-5 w-5" />
                                            </span>
                                            <div>
                                                <p className="text-[11px] font-semibold text-muted-foreground">{c.onko.cardComprehensive}</p>
                                                <p className="text-sm font-semibold text-primary leading-tight">{c.onko.cardCancerCenter}</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )}
                        </div>

                        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
                            {features.map((f, i) => (
                                <div
                                    key={f.title}
                                    className={`rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-3 sm:p-4 hover:bg-white/10 transition ${
                                        i === 2 ? 'col-span-2 sm:col-span-1' : ''
                                    }`}
                                >
                                    <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-brand-cyan/15 text-brand-cyan">
                                        <f.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </span>
                                    <h3 className="mt-2 sm:mt-3 text-[12.5px] sm:text-sm font-bold leading-tight">{f.title}</h3>
                                    <p className="mt-1 text-[11px] sm:text-xs text-white/70 leading-snug">{f.desc}</p>
                                </div>
                            ))}
                        </div>

                        <ul className="mt-8 grid sm:grid-cols-2 gap-2.5">
                            {c.onko.checklist.map((item) => (
                                <li
                                    key={item.label}
                                    className={`flex items-center gap-2 text-sm text-white/85 ${item.hide ? 'hidden sm:flex' : ''}`}
                                >
                                    <CheckCircle2 className="h-4 w-4 text-brand-cyan shrink-0" />
                                    {item.label}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex items-center gap-3">
                            <AppointmentCTA href={settings.appointment_url}>
                                {c.onko.appointment} <CalendarDays className="h-4 w-4" />
                            </AppointmentCTA>
                            <Link
                                href={lp('/butunlesik-onkoloji')}
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/15 transition sm:px-6 sm:py-3.5 sm:text-sm"
                            >
                                {c.onko.exploreCenter} <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Image / Video */}
                    <div className="hidden lg:block order-2 lg:order-1 lg:col-span-6 relative">
                        <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[540px] xl:h-[600px] rounded-3xl overflow-hidden shadow-elevated ring-1 ring-white/10 bg-black">
                            {videoPlaying && isDesktop ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                                    title={c.onko.iframeTitle}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute inset-0 h-full w-full"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setVideoPlaying(true)}
                                    aria-label={c.onko.playAria}
                                    className="group absolute inset-0 block"
                                >
                                    {/* TODO: real asset */}
                                    <img
                                        src={onkolojiImg}
                                        alt={c.onko.imgAlt}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/15 to-primary/25" />
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/95 text-primary shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-110">
                                            <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                                            <span className="absolute -inset-3 rounded-full ring-1 ring-white/30" />
                                            <Play className="relative h-9 w-9 fill-current ml-1" />
                                        </span>
                                    </span>
                                    <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                                        <Play className="h-3 w-3 fill-current" /> {c.onko.videoBadge}
                                    </span>
                                    <div className="absolute bottom-5 left-5 right-5 sm:right-auto rounded-2xl bg-white/95 backdrop-blur p-4 shadow-elevated max-w-[280px] text-left">
                                        <div className="flex items-center gap-3.5">
                                            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-transparent">
                                                {/* TODO: real asset */}
                                                <img src={jciImg} alt="JCI" className="h-full w-full object-contain" />
                                            </span>
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground">{c.onko.cardJci}</p>
                                                <p className="text-sm font-semibold text-primary leading-tight">{c.onko.cardJciDesc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )}
                        </div>
                        {videoPlaying && (
                            <button
                                type="button"
                                onClick={() => setVideoPlaying(false)}
                                aria-label={c.onko.closeAria}
                                className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur border border-white/20 text-white hover:bg-black/80 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ───────────────── ÖZEL MERKEZLER ───────────────── */
function OzelMerkezler() {
    const c = usePageCopy('home', COPY[useLocale()]);
    const lp = useLocalizedPath();
    const media = [
        { image: ph('1551190822-a9333d879b1f'), href: '/tedavi-yontemleri' },
        { image: ph('1576091160399-112ba8d25d1d'), href: '/tedavi-yontemleri' },
        { image: ph('1579684385127-1ef15d508118'), href: '/tedavi-yontemleri' },
        { image: ph('1582719508461-905c673771fd'), href: '/tedavi-yontemleri' },
    ];
    // Editor-managed centers (DB) win; fall back to the bundled media + copy items.
    const dbCenters = useHomeCenters();
    const merkezler =
        dbCenters && dbCenters.length
            ? dbCenters
            : media.map((m, i) => ({ ...m, ...c.merkezler.items[i] }));

    return (
        <section className="bg-background py-14 lg:py-20">
            <div className="container-x">
                <SectionHead
                    eyebrow={c.merkezler.eyebrow}
                    title={c.merkezler.title}
                    subtitle={c.merkezler.subtitle}
                />

                <div className="mt-8 lg:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {merkezler.map((m) => (
                        <Link
                            key={m.name}
                            href={lp(m.href)}
                            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_oklch(0.2_0.05_265/0.04),0_10px_30px_-18px_oklch(0.2_0.05_265/0.18)] hover:border-primary/30 hover:shadow-[0_2px_4px_oklch(0.2_0.05_265/0.06),0_22px_50px_-20px_oklch(0.2_0.05_265/0.28)] hover:-translate-y-[3px] transition-all duration-300"
                        >
                            <div className="relative aspect-[16/9] overflow-hidden bg-primary">
                                {/* TODO: real asset */}
                                <img
                                    src={m.image}
                                    alt={m.name}
                                    loading="eager"
                                    decoding="async"
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] group-hover:scale-[1.04]"
                                />
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/40 to-transparent" />
                            </div>

                            <div className="flex items-center justify-between gap-3 p-4 lg:p-5">
                                <div className="min-w-0">
                                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                                        {m.accent}
                                    </p>
                                    <h3 className="mt-1 text-[15px] lg:text-base font-bold leading-tight text-primary">
                                        {m.name}
                                    </h3>
                                    <p className="mt-1 hidden sm:block text-[12.5px] leading-snug text-muted-foreground line-clamp-2">
                                        {m.desc}
                                    </p>
                                </div>
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary ring-1 ring-inset ring-primary/15 transition-all duration-300 group-hover:bg-gradient-orange group-hover:text-brand-orange-foreground group-hover:ring-transparent">
                                    <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ───────────────────── HASTANELER ───────────────────── */
function Hospitals() {
    const c = usePageCopy('home', COPY[useLocale()]);
    const lp = useLocalizedPath();
    const hospitals = useHospitals();
    return (
        <section className="relative py-14 lg:py-20 bg-background border-t border-border/60">
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface/60 to-transparent" />
            <div className="container-x relative">
                <SectionHead
                    eyebrow={c.hospitals.eyebrow}
                    title={c.hospitals.title}
                    subtitle={c.hospitals.subtitle}
                />
                <div className="mt-10 lg:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">

                    {hospitals.map((h) => (
                        <article
                            key={h.slug}
                            className="group relative overflow-hidden rounded-2xl bg-card border border-border/60 shadow-sm"
                        >

                            <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                    src={h.cover}
                                    alt={h.name}
                                    loading="lazy"
                                    className={`h-full w-full object-cover ${h.comingSoon ? 'grayscale-[35%]' : ''}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />

                                {h.comingSoon && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="relative inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary shadow-md">
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-75" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
                                            </span>
                                            {c.hospitals.comingSoonBadge}
                                        </span>
                                    </div>
                                )}

                                <div className="absolute bottom-5 left-6 right-6 text-white">
                                    <h3 className="text-xl lg:text-2xl font-semibold tracking-tight drop-shadow-md">{h.name}</h3>
                                    <p className="mt-1.5 text-sm text-white/90 flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" /> {h.area}
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 lg:p-6 space-y-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {h.comingSoon
                                        ? c.hospitals.comingSoonBody
                                        : c.hospitals.openBody}
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                    {h.comingSoon ? (
                                        <>
                                            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                                                <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
                                                {c.hospitals.openingSoon}
                                            </span>
                                            <Link
                                                href={lp('/iletisim')}
                                                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition"
                                            >
                                                {c.hospitals.getInfo} <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(h.address)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition"
                                            >
                                                <Navigation className="h-3.5 w-3.5" /> {c.hospitals.directions}
                                            </a>
                                            <Link
                                                href={lp('/iletisim')}
                                                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition"
                                            >
                                                {c.hospitals.moreInfo} <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                            <a
                                                href={`tel:${h.phone.replace(/\s/g, '')}`}
                                                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-primary-soft/60 transition"
                                            >
                                                <Phone className="h-3.5 w-3.5" /> {h.phone}
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ───────────────────── GÜVEN BANDI ───────────────────── */
function CountUp({ target, suffix, start, duration = 1800 }: { target: number; suffix: string; start: boolean; duration?: number }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!start) return;
        let raf = 0;
        const t0 = performance.now();
        const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(target * eased);
            if (p < 1) raf = requestAnimationFrame(tick);
            else setVal(target);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [start, target, duration]);

    const display =
        suffix === 'M+'
            ? val >= target
                ? '1M'
                : `${Math.floor(val * 1000)}K`
            : `${Math.floor(val)}`;
    const finalSuffix = suffix === 'M+' ? '+' : suffix;
    return <>{display}{finalSuffix}</>;
}

function TrustBand() {
    const c = usePageCopy('home', COPY[useLocale()]);
    const stats = c.trust.stats;
    const ref = useRef<HTMLDivElement | null>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!ref.current || started) return;
        const el = ref.current;
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        setStarted(true);
                        io.disconnect();
                        break;
                    }
                }
            },
            { threshold: 0.3 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [started]);

    return (
        <section className="py-14 lg:py-20 bg-background">
            <div className="container-x">
                <div className="relative rounded-3xl border border-border/70 bg-card px-6 sm:px-10 lg:px-14 py-10 lg:py-14 overflow-hidden">
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="grid gap-10">
                        <div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                {c.trust.eyebrow}
                            </span>
                            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-primary leading-[1.15] text-balance">
                                {c.trust.title}
                            </h2>
                            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                                {c.trust.desc}
                            </p>

                            <div ref={ref} className="mt-8 lg:mt-10 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/70 border-y sm:border-y border-border/70">
                                {stats.map((s) => (
                                    <div key={s.label} className="px-4 py-5 sm:py-4 first:border-l-0 first:pl-0 sm:first:pl-4">
                                        <p className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-primary tabular-nums">
                                            <CountUp target={Number(s.target) || 0} suffix={s.suffix} start={started} />
                                        </p>
                                        <p className="mt-1.5 text-[12px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                                            {s.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-border/70">
                        <QualityCertificates />
                    </div>

                </div>
            </div>
        </section>
    );
}

/* ───────────────────── BLOG ───────────────────── */
function BlogTeaser() {
    const c = usePageCopy('home', COPY[useLocale()]);
    const lp = useLocalizedPath();
    const allBlogPosts = useBlogPosts();
    // Editor-flagged posts (Anasayfada öne çıkar) win; otherwise the latest 4.
    const featuredBlog = allBlogPosts.filter((p) => p.homeFeatured);
    const blogPosts = featuredBlog.length ? featuredBlog : allBlogPosts;
    return (
        <section className="bg-surface py-14 lg:py-20">
            <div className="container-x">
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <SectionHead eyebrow={c.blog.eyebrow} title={c.blog.title} />
                    <Link href={lp('/saglikli-hayat-rehberi')} className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                        {c.blog.allArticles} <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div
                    className="mt-8 lg:mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 -mx-5 px-5 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                >
                    {blogPosts.slice(0, 4).map((p, i) => (
                        <article
                            key={p.slug}
                            className={`group hover-lift flex shrink-0 basis-[80%] snap-start flex-col overflow-hidden rounded-2xl border border-border/70 bg-card sm:basis-[46%] md:basis-auto md:shrink ${i === 3 ? 'md:hidden' : ''}`}
                        >
                            <Link
                                href={lp('/saglikli-hayat-rehberi/' + p.slug)}
                                className="flex h-full flex-col"
                            >
                                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
                                    <img
                                        src={p.cover}
                                        alt={p.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/55 to-transparent" />
                                    <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-[10.5px] font-bold text-primary shadow-sm backdrop-blur">
                                        {p.category}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-4 sm:p-5">
                                    <h3 className="text-[15px] font-bold leading-snug text-primary transition line-clamp-2 group-hover:text-brand-orange">
                                        {p.title}
                                    </h3>
                                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                                        {p.excerpt}
                                    </p>
                                    <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-orange">
                                        {c.blog.readMore} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                    </span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground md:hidden">
                    {c.blog.swipe}
                </p>

                <div className="mt-8 flex justify-center sm:hidden">
                    <Link href={lp('/saglikli-hayat-rehberi')} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                        {c.blog.allArticles} <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function SectionHead({
    eyebrow, title, subtitle, align = 'left', className = '',
}: { eyebrow: string; title: string; subtitle?: string; align?: 'left' | 'center'; className?: string }) {
    const isCenter = align === 'center';
    return (
        <div className={`flex flex-col ${isCenter ? 'items-center text-center mx-auto max-w-2xl' : 'items-start text-left'} ${className}`}>
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-brand-orange">
                <span className="h-px w-6 bg-brand-orange/60" />
                {eyebrow}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-primary text-balance leading-[1.15]">{title}</h2>
            {subtitle && <p className={`mt-3 text-[13.5px] sm:text-base text-muted-foreground text-balance ${isCenter ? 'max-w-2xl' : 'max-w-2xl'}`}>{subtitle}</p>}
        </div>
    );
}
