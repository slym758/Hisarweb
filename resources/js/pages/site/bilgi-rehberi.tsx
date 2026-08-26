import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Search, ArrowRight, ClipboardList, LogIn, LogOut, Users, ShieldQuestion, FileText, FlaskConical, MapPin, HelpCircle, X, Sparkles, Phone, CalendarDays, ChevronDown, CalendarCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { useAnimatedPlaceholder } from '@/hooks/useAnimatedPlaceholder';
import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';

/* Locale-independent category ids + icons (text lives in COPY.cats). */
const CAT_IDS = [
    'gelmeden-once', 'muayene', 'yatis', 'taburculuk', 'ziyaretci', 'refakatci', 'hasta-haklari', 'tibbi-kayit', 'sonuc', 'ulasim', 'sss',
];
/* TODO: real asset — source used a masked PNG (icon-gelmeden-once) for the first
   category; substituted with a Lucide icon until the optimized asset is available. */
const CAT_ICONS: LucideIcon[] = [
    CalendarCheck, ClipboardList, LogIn, LogOut, Users, ShieldQuestion, FileText, FileText, FlaskConical, MapPin, HelpCircle,
];

const COPY = {
    tr: {
        head: {
            title: 'Bilgi Rehberi — Hisar Hospital',
            description: 'Hastane deneyiminizi kolaylaştıran operasyonel bilgiler: randevu, muayene, yatış, taburculuk ve daha fazlası.',
        },
        pageTitle: 'Bilgi Rehberi',
        pageSubtitle: 'Randevudan taburculuğa, hastane deneyiminizin her adımı için pratik cevaplar.',
        crumbHasta: 'Hasta Rehberi',
        crumbSelf: 'Bilgi Rehberi',
        suggestions: ['Randevu', 'Oda tipi', 'Ziyaret saati', 'Yol tarifi', 'Sonuç'],
        searchPlaceholder: (typed: string) => `Bilgi rehberinde ara — ${typed}`,
        searchAria: 'Bilgi rehberinde ara',
        clear: 'Temizle',
        resultCount: (n: number) => `${n} sonuç`,
        overviewCount: (topics: number, items: number) => `${topics} konu · ${items} başlık`,
        topics: 'Konular',
        headingCount: (n: number) => `${n} başlık`,
        emptyTitle: 'Aramanızla eşleşen içerik bulunamadı',
        emptyBody: 'Farklı bir kelimeyle tekrar deneyin ya da bize ulaşın.',
        helpEyebrow: 'Yardım',
        helpTitle: 'Aradığınızı bulamadınız mı?',
        helpBody: 'İletişim Merkezimiz 7/24 size yardımcı olsun.',
        appointment: 'Randevu Al',
        cats: [
            { title: 'Hastaneye Gelmeden Önce', items: [
                { q: 'Randevu nasıl alabilirim?', a: 'Web sitemizden Randevu Al bölümü, iletişim merkezimiz (444 5 888) veya Hisar Online üzerinden hekim ve tarih seçerek randevu oluşturabilirsiniz.' },
                { q: 'Yanımda hangi belgeleri getirmeliyim?', a: 'Kimlik belgeniz, geçerli sigorta / özel sağlık sigortası kartınız ve varsa daha önceki tıbbi kayıtlarınızı getirmeniz süreci hızlandırır.' },
            ] },
            { title: 'Muayene Süreci', items: [
                { q: 'Muayene öncesi ne yapmalıyım?', a: 'Randevu saatinizden 15–20 dakika önce hastanede olmanızı öneririz. Kayıt işlemleriniz karşılama bankosunda tamamlanır.' },
                { q: 'Refakatçi kabul ediliyor mu?', a: 'Genel poliklinik muayenelerinde bir refakatçi kabul edilir; ilgili klinik uygulamalarına göre değişebilir.' },
            ] },
            { title: 'Yatış İşlemleri', items: [
                { q: 'Yatış için hangi süreç izlenir?', a: 'Hekiminizin yatış onayı ardından hasta kabul birimimiz oda ve sigorta işlemlerinizi tamamlar.' },
                { q: 'Oda tipleri nelerdir?', a: 'Standart tek kişilik ve süit oda seçeneklerimiz bulunur; müsaitlik durumuna göre bilgi verilir.' },
            ] },
            { title: 'Taburculuk Süreci', items: [
                { q: 'Taburculuk günü ne olacak?', a: 'Hekiminizin onayı sonrası taburcu özeti, reçete ve kontrol tarihiniz size iletilir; hasta kabul birimimizde işlemleriniz tamamlanır.' },
            ] },
            { title: 'Ziyaretçi Kuralları', items: [
                { q: 'Ziyaret saatleri nelerdir?', a: 'Servis katlarında ziyaret saatleri 11:00–20:00 arasındadır. Yoğun bakım üniteleri için özel saatler uygulanır.' },
                { q: 'Çocuk ziyaretçi kabul ediliyor mu?', a: 'Enfeksiyon kontrol politikamız kapsamında belirli yaş ve dönemlerde sınırlama olabilir.' },
            ] },
            { title: 'Refakatçi Bilgileri', items: [
                { q: 'Refakatçi bilgileri nelerdir?', a: 'Refakatçi kartı ve kimliğinin yanınızda olması gerekir. Refakatçi değişiklikleri hasta kabulüne bildirilmelidir.' },
            ] },
            { title: 'Hasta Hakları ve Sorumlulukları', items: [
                { q: 'Hasta haklarım nelerdir?', a: 'Bilgilendirme, mahremiyet, güvenli bakım ve saygılı hizmet almak temel haklarınız arasındadır. Detaylar Hasta Hakları Birimimizce iletilir.' },
                { q: 'Sorumluluklarım nelerdir?', a: 'Sağlığınızla ilgili doğru bilgi vermek, tedavi planına uyum sağlamak ve hastane kurallarına saygı göstermek beklenir.' },
            ] },
            { title: 'Tıbbi Kayıt Talepleri', items: [
                { q: 'Tıbbi kayıt talebimi nasıl iletirim?', a: 'Hasta hakları birimimize kimlik ile başvurarak veya yasal temsilci aracılığıyla talepte bulunabilirsiniz.' },
            ] },
            { title: 'Laboratuvar ve Görüntüleme Sonuçları', items: [
                { q: 'Sonuçlarımı nereden görüntüleyebilirim?', a: 'E-Sonuç servisi veya Hisar Online üzerinden güvenli girişle görüntüleyebilirsiniz.' },
            ] },
            { title: 'Otopark ve Ulaşım', items: [
                { q: 'Otopark hizmetiniz var mı?', a: 'Hastanelerimizde vale ve kapalı otopark hizmeti sunulmaktadır.' },
                { q: 'Toplu taşıma ile nasıl ulaşırım?', a: 'İletişim sayfamızda kampüs bazlı ulaşım seçenekleri ve yol tarifleri yer alır.' },
            ] },
            { title: 'Sık Sorulan Sorular', items: [
                { q: 'Yabancı hastalar için hizmetiniz var mı?', a: 'Uluslararası Hasta Merkezimiz süreç boyunca tercüme ve koordinasyon desteği sağlar.' },
            ] },
        ],
    },
    en: {
        head: {
            title: 'Information Guide — Hisar Hospital',
            description: 'Operational information that makes your hospital experience easier: appointments, examination, admission, discharge and more.',
        },
        pageTitle: 'Information Guide',
        pageSubtitle: 'Practical answers for every step of your hospital experience, from appointment to discharge.',
        crumbHasta: 'Patient Guide',
        crumbSelf: 'Information Guide',
        suggestions: ['Appointment', 'Room type', 'Visiting hours', 'Directions', 'Results'],
        searchPlaceholder: (typed: string) => `Search the information guide — ${typed}`,
        searchAria: 'Search the information guide',
        clear: 'Clear',
        resultCount: (n: number) => `${n} results`,
        overviewCount: (topics: number, items: number) => `${topics} topics · ${items} entries`,
        topics: 'Topics',
        headingCount: (n: number) => `${n} entries`,
        emptyTitle: 'No content matches your search',
        emptyBody: 'Try again with a different word or get in touch with us.',
        helpEyebrow: 'Help',
        helpTitle: "Couldn't find what you were looking for?",
        helpBody: 'Let our Contact Center help you 24/7.',
        appointment: 'Book Appointment',
        cats: [
            { title: 'Before Coming to the Hospital', items: [
                { q: 'How can I book an appointment?', a: 'You can book by selecting a doctor and date through the Book Appointment section of our website, our contact center (444 5 888) or Hisar Online.' },
                { q: 'Which documents should I bring with me?', a: 'Bringing your ID document, valid insurance / private health insurance card and any previous medical records speeds up the process.' },
            ] },
            { title: 'The Examination Process', items: [
                { q: 'What should I do before the examination?', a: 'We recommend arriving at the hospital 15–20 minutes before your appointment time. Your registration is completed at the reception desk.' },
                { q: 'Is a companion accepted?', a: 'One companion is accepted for general outpatient examinations; this may vary according to the relevant clinic practices.' },
            ] },
            { title: 'Admission Procedures', items: [
                { q: 'What process is followed for admission?', a: 'After your doctor approves admission, our patient admission unit completes your room and insurance procedures.' },
                { q: 'What are the room types?', a: 'We offer standard single rooms and suite room options; information is provided based on availability.' },
            ] },
            { title: 'The Discharge Process', items: [
                { q: 'What happens on discharge day?', a: 'After your doctor’s approval, your discharge summary, prescription and follow-up date are provided; your procedures are completed at our patient admission unit.' },
            ] },
            { title: 'Visitor Rules', items: [
                { q: 'What are the visiting hours?', a: 'On the ward floors, visiting hours are between 11:00–20:00. Special hours apply for intensive care units.' },
                { q: 'Are child visitors accepted?', a: 'Under our infection control policy, restrictions may apply for certain ages and periods.' },
            ] },
            { title: 'Companion Information', items: [
                { q: 'What is the companion information?', a: 'You must have the companion card and ID with you. Companion changes must be reported to patient admission.' },
            ] },
            { title: 'Patient Rights and Responsibilities', items: [
                { q: 'What are my patient rights?', a: 'Being informed, privacy, safe care and receiving respectful service are among your fundamental rights. Details are provided by our Patient Rights Unit.' },
                { q: 'What are my responsibilities?', a: 'You are expected to provide accurate information about your health, comply with the treatment plan and respect hospital rules.' },
            ] },
            { title: 'Medical Record Requests', items: [
                { q: 'How do I submit my medical record request?', a: 'You can make a request by applying to our patient rights unit with your ID or through a legal representative.' },
            ] },
            { title: 'Laboratory and Imaging Results', items: [
                { q: 'Where can I view my results?', a: 'You can view them via the E-Results service or through a secure login on Hisar Online.' },
            ] },
            { title: 'Parking and Transportation', items: [
                { q: 'Do you have parking service?', a: 'Valet and indoor parking service is provided at our hospitals.' },
                { q: 'How do I get there by public transport?', a: 'Campus-based transportation options and directions are available on our contact page.' },
            ] },
            { title: 'Frequently Asked Questions', items: [
                { q: 'Do you have a service for international patients?', a: 'Our International Patient Center provides translation and coordination support throughout the process.' },
            ] },
        ],
    },
} as const;

export default function BilgiRehberi() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const CATS = useMemo(
        () => c.cats.map((cat, i) => ({ id: CAT_IDS[i], icon: CAT_ICONS[i], title: cat.title, items: cat.items })),
        [c],
    );

    const [q, setQ] = useState('');
    const [active, setActive] = useState<string>(CAT_IDS[0]);
    const typed = useAnimatedPlaceholder(c.suggestions, !q);

    const filtered = useMemo(() => {
        if (!q) return CATS;
        const nq = q.toLocaleLowerCase('tr');
        return CATS.map((cat) => ({ ...cat, items: cat.items.filter((i) => (i.q + i.a).toLocaleLowerCase('tr').includes(nq)) })).filter((cat) => cat.items.length > 0);
    }, [q, CATS]);

    const totalItems = CATS.reduce((n, cat) => n + cat.items.length, 0);
    const shownItems = filtered.reduce((n, cat) => n + cat.items.length, 0);

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/bilgi-rehberi" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/bilgi-rehberi" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/bilgi-rehberi" />
            </Head>

            <PageHeader title={c.pageTitle} subtitle={c.pageSubtitle} />
            <Breadcrumb items={[{ label: c.crumbHasta }, { label: c.crumbSelf }]} />

            <section className="py-8 lg:py-14">
                <div className="container-x">
                    {/* Search + meta */}
                    <div className="mx-auto max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={c.searchPlaceholder(typed)}
                                aria-label={c.searchAria}
                                className="w-full h-12 rounded-full border border-border/70 bg-card pl-11 pr-11 text-sm shadow-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                            />
                            {q && (
                                <button
                                    onClick={() => setQ('')}
                                    aria-label={c.clear}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-full hover:bg-muted text-muted-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                            <Sparkles className="h-3 w-3 text-brand-cyan" />
                            <span>{q ? c.resultCount(shownItems) : c.overviewCount(CATS.length, totalItems)}</span>
                        </div>
                    </div>

                    {/* Two-column: sticky category rail + content */}
                    <div className="mt-10 grid gap-8 lg:gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
                        {/* Category rail */}
                        <aside className="hidden lg:block">
                            <nav aria-label={c.topics} className="lg:sticky lg:top-36">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">{c.topics}</p>
                                <ul className="mt-3 space-y-0.5">
                                    {CATS.map((cat) => {
                                        const on = active === cat.id;
                                        return (
                                            <li key={cat.id}>
                                                <a
                                                    href={`#${cat.id}`}
                                                    onClick={() => setActive(cat.id)}
                                                    className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] transition ${on ? 'bg-primary-soft/70 text-primary font-bold' : 'text-foreground/75 hover:bg-primary/5 hover:text-primary font-medium'}`}
                                                >
                                                    <span className={`grid h-7 w-7 place-items-center rounded-lg transition ${on ? 'bg-primary text-primary-foreground' : 'bg-primary-soft/50 text-primary group-hover:bg-primary/10'}`}>
                                                        <cat.icon className="h-3.5 w-3.5" aria-hidden />
                                                    </span>
                                                    <span className="flex-1 truncate">{cat.title}</span>
                                                    <span className={`text-[10px] tabular-nums ${on ? 'text-primary/70' : 'text-muted-foreground'}`}>{cat.items.length}</span>
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </aside>

                        {/* Mobile chips */}
                        <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-none">
                            <div className="flex gap-2 pb-1 w-max">
                                {CATS.map((cat) => {
                                    const on = active === cat.id;
                                    return (
                                        <a
                                            key={cat.id}
                                            href={`#${cat.id}`}
                                            onClick={() => setActive(cat.id)}
                                            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${on ? 'border-brand-orange bg-orange-soft/50 text-primary' : 'border-border/70 bg-card text-foreground/75'}`}
                                        >
                                            <cat.icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                                            {cat.title}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="min-w-0">
                            {filtered.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-border/70 bg-card/50 py-20 text-center">
                                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-soft/70">
                                        <Search className="h-5 w-5 text-primary/70" />
                                    </div>
                                    <p className="mt-4 text-sm font-semibold text-primary">{c.emptyTitle}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{c.emptyBody}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filtered.map((cat) => (
                                        <section
                                            key={cat.id}
                                            id={cat.id}
                                            className="scroll-mt-40 rounded-3xl border border-border/60 bg-card overflow-hidden"
                                        >
                                            <header className="flex items-center gap-3 border-b border-border/60 bg-gradient-to-r from-primary-soft/40 via-card to-card px-5 py-4 lg:px-6 lg:py-5">
                                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                                    <cat.icon className="h-4 w-4" aria-hidden />
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <h2 className="text-[15px] lg:text-lg font-black text-primary leading-tight">{cat.title}</h2>
                                                    <p className="text-[11px] text-muted-foreground">{c.headingCount(cat.items.length)}</p>
                                                </div>
                                            </header>
                                            <div className="divide-y divide-border/50">
                                                {cat.items.map((it) => (
                                                    <details key={it.q} className="group">
                                                        <summary className="flex cursor-pointer list-none items-center gap-3 px-5 lg:px-6 py-4 hover:bg-primary/[0.03] transition">
                                                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border/70 bg-card text-brand-orange group-open:bg-brand-orange group-open:text-brand-orange-foreground group-open:border-brand-orange transition">
                                                                <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-out group-open:rotate-180" aria-hidden />
                                                            </span>
                                                            <span className="flex-1 text-[14px] font-bold text-primary">{it.q}</span>
                                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition" />
                                                        </summary>
                                                        <div className="px-5 lg:px-6 pb-5 pl-[3.75rem] lg:pl-[3.75rem]">
                                                            <p className="text-[13.5px] leading-relaxed text-foreground/80">{it.a}</p>
                                                        </div>
                                                    </details>
                                                ))}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            )}

                            {/* CTA */}
                            <div className="mt-10 relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary via-primary to-primary/85 text-primary-foreground p-6 lg:p-8">
                                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-orange/25 blur-3xl" aria-hidden />
                                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div>
                                        <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                                            <span className="h-px w-6 bg-brand-orange" /> {c.helpEyebrow}
                                        </p>
                                        <h3 className="mt-2 text-xl lg:text-2xl font-black leading-tight">{c.helpTitle}</h3>
                                        <p className="mt-1.5 text-sm text-primary-foreground/85">{c.helpBody}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <a href="tel:4445888" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur px-5 py-2.5 text-sm font-bold text-primary-foreground transition">
                                            <Phone className="h-4 w-4" /> 444 5 888
                                        </a>
                                        <AppointmentCTA href={settings.appointment_url}>
                                            <CalendarDays className="h-4 w-4" /> {c.appointment} <ArrowRight className="h-4 w-4" />
                                        </AppointmentCTA>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

BilgiRehberi.layout = siteLayout;
