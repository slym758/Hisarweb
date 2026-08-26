import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    Search,
    ShieldCheck,
    X,
    ChevronDown,
    Info,
    Phone,
    CalendarHeart,
    Mail,
    ArrowRight,
    Building2,
} from 'lucide-react';

import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath, type Locale } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { normalizeTr } from '@/lib/site-data';

/* ──────────────── Data (bilingual) ──────────────── */

type Loc = { tr: string; en: string };
const L = (tr: string, en: string): Loc => ({ tr, en });

type Institution = { name: string; note?: Loc };
type Category = { key: string; label: Loc; items: Institution[] };

/** Reusable bilingual notes. */
const N_ACIL_TEDAVI = L('Acil Tedavi Sigortası', 'Emergency Treatment Insurance');
const N_ACIL_SAGLIK = L('Acil Sağlık Sigortası', 'Emergency Health Insurance');

const CATEGORIES: Category[] = [
    {
        key: 'ozel-saglik',
        label: L('Özel Sağlık Sigortaları', 'Private Health Insurance'),
        items: [
            { name: 'Ak Sigorta A.Ş.' },
            { name: 'Allianz Sigorta A.Ş.' },
            { name: 'Anadolu Anonim Türk Sigorta Şirketi A.Ş.' },
            { name: 'Ankara Anonim Türk Sigorta Şirketi' },
            { name: 'AvivaSA Emeklilik ve Hayat A.Ş.' },
            { name: 'Aviva Sigorta' },
            { name: 'AXA Sigorta A.Ş.' },
            { name: 'Bupa Acıbadem Sigorta A.Ş.' },
            { name: 'Demir Sağlık' },
            { name: 'Doğa Sigorta' },
            { name: 'Dubai Starr Sigorta A.Ş.' },
            { name: 'Eureko Sigorta' },
            { name: 'Generali Sigorta A.Ş.' },
            { name: 'Groupama Sigorta A.Ş.' },
            { name: 'Halk Sigorta' },
            { name: 'HDI Sigorta A.Ş.' },
            { name: 'Katılım Emeklilik' },
            { name: 'Magdeburger Sigorta' },
            { name: 'Mapfre Genel Sigorta A.Ş.' },
            { name: 'MetLife Emeklilik ve Hayat' },
            { name: 'NN Hayat ve Emeklilik' },
            { name: 'Ray Sigorta A.Ş.' },
            { name: 'SBN Sigorta' },
            { name: 'Sompo Japan Sigorta' },
            { name: 'Turins Sigorta' },
            { name: 'Türk Nippon Sigorta A.Ş.' },
            { name: 'Türkiye Sigorta' },
            { name: 'Unico Sigorta' },
            { name: 'Vakıf Emeklilik' },
            { name: 'Ziraat Sigorta' },
            { name: 'Zirve Sigorta' },
            { name: 'Zürich Sigorta A.Ş.' },
        ],
    },
    {
        key: 'acil-saglik',
        label: L('Acil Sağlık Sigortaları', 'Emergency Health Insurance'),
        items: [
            { name: 'Ankara Sigorta', note: N_ACIL_TEDAVI },
            { name: 'Aviva Sigorta', note: N_ACIL_TEDAVI },
            { name: 'Dubai Starr Sigorta', note: N_ACIL_TEDAVI },
            { name: 'Halk Sigorta', note: N_ACIL_TEDAVI },
            { name: 'HDI Sigorta', note: N_ACIL_SAGLIK },
            { name: 'MetLife Emeklilik', note: N_ACIL_TEDAVI },
            { name: 'NN Hayat ve Emeklilik', note: N_ACIL_TEDAVI },
            { name: 'SBN Sigorta', note: N_ACIL_TEDAVI },
            { name: 'Turins Sigorta', note: N_ACIL_TEDAVI },
            { name: 'Türk Nippon Sigorta', note: N_ACIL_TEDAVI },
            { name: 'Zirve Sigorta', note: N_ACIL_TEDAVI },
        ],
    },
    {
        key: 'asistans',
        label: L('Asistans Firmaları ve Sağlık Hizmetleri', 'Assistance Companies and Health Services'),
        items: [
            { name: 'AXA PPP & AXA Assistance' },
            { name: 'Care & Create' },
            { name: 'Compugroup Medical CGM A.Ş.' },
            { name: 'Dr. Back-Up Kişisel Sağlık Sistemi' },
            { name: 'HS Grup' },
            { name: 'İmece Destek Danışmanlık Hizmetleri A.Ş.' },
            { name: 'Inter Partner Assistance' },
            { name: 'Medline Box Üyeleri', note: L('Bireysel & Kurumsal', 'Individual & Corporate') },
            { name: 'Moneta Danışmanlık' },
            { name: 'Nar Sağlık Hizmetleri' },
        ],
    },
    {
        key: 'kart-uyelik',
        label: L('Kart ve Üyelik Programları', 'Card and Membership Programs'),
        items: [
            { name: 'Benefit Card' },
            { name: 'Benefit Global & AIG Card' },
            { name: 'Benefit Global & Eureko Sigorta', note: L('KOBİ Sağlık Paketi Card', 'SME Health Package Card') },
            { name: 'Dr. Back-Up & Fortis Bank Card' },
            { name: 'IPA Card' },
            { name: 'IPA Privilege Card' },
            { name: 'Life Card' },
            { name: 'MetLife Emeklilik ve Hayat', note: L('KOBİ’ler için İşletme Kartı', 'Business Card for SMEs') },
            { name: 'TAV Passport Edition' },
        ],
    },
    {
        key: 'bankalar',
        label: L('Bankalar ve Finans Kurumları', 'Banks and Financial Institutions'),
        items: [
            { name: 'Akbank' },
            { name: 'Fortis Bank Sandık' },
            { name: 'Garanti Bankası', note: L('Çalışanları ve iştirakleri', 'Employees and affiliates') },
            { name: 'ING Bank Platinum Card' },
            { name: 'Türkiye Petrolleri A.Ş.' },
        ],
    },
    {
        key: 'kurumsal',
        label: L('Kurumsal / Özel Programlar', 'Corporate / Special Programs'),
        items: [
            { name: 'ACE European Sigorta' },
            { name: 'ACE Group Sigorta Üyeleri' },
            { name: 'Avon' },
            { name: 'Çağdaş Koruma Planı' },
            { name: 'Fortis Bank Sandık', note: L('Çalışan ve bağımlıları', 'Employees and dependents') },
            { name: 'Galatasaray Aslan Taraftarım Güvende' },
            { name: 'HDI – GS Sigorta', note: L('Galatasaray Aslan Yürek', 'Galatasaray Aslan Yürek') },
            { name: 'Mapfre Genel Sigorta', note: L('Ferdi Kaza', 'Personal Accident') },
            { name: 'SBN Sigorta & Boğaziçi Brokerlik' },
            { name: 'SBN Şeker Hayat Projesi' },
        ],
    },
    {
        key: 'uluslararasi',
        label: L('Uluslararası Sigorta ve Asistans Firmaları', 'International Insurance and Assistance Companies'),
        items: [
            { name: 'ACE European Sigorta' },
            { name: 'AXA PPP & AXA Assistance' },
            { name: 'Inter Partner Assistance' },
        ],
    },
];

/* ──────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Anlaşmalı Kurumlar — Hisar Hospital',
            description: 'Hisar Hospital Intercontinental ile anlaşmalı sigorta şirketleri, bankalar, asistans firmaları ve kurumlar. Arama ve kategori filtreleriyle hızlıca sorgulayın.',
            ogDescription: 'Anlaşmalı sigorta, banka ve asistans firmalarını arayın, kategoriye göre filtreleyin.',
        },
        h1: 'Anlaşmalı Kurumlar',
        heroDesc: 'Hisar Hospital Intercontinental ile anlaşmalı sigorta şirketleri, bankalar, asistans firmaları ve kurumları arayın veya kategoriye göre filtreleyin.',
        searchPrefix: 'Örn: ',
        clear: 'Temizle',
        all: 'Tümü',
        listedSuffix: 'kurum listeleniyor',
        resultPre: '',
        infoNote: 'Anlaşmalı kurum kapsamları poliçe türüne, plan detayına ve hizmet alınacak bölüme göre değişiklik gösterebilir. Güncel kapsam bilgisi için randevu öncesinde sigorta şirketiniz veya hastanemizle iletişime geçmenizi öneririz.',
        countSuffix: 'kurum',
        empty: {
            title: 'Aramanıza uygun kurum bulunamadı',
            body: 'Kurum adını farklı şekilde yazarak tekrar deneyebilir veya detaylı bilgi için bizimle iletişime geçebilirsiniz.',
            reset: 'Filtreleri Temizle',
            contact: 'İletişime Geç',
        },
        sidebar: {
            badge: 'Bilgi alın',
            title: 'Kurumunuzun kapsamını öğrenmek ister misiniz?',
            body: 'Anlaşmalı kurum ve sigorta kapsamınız hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz.',
            appointment: 'Randevu Al',
            contact: 'İletişime Geçin',
            note: 'Kapsam bilgisi güncellenebilir. Listede göremediğiniz kurumlar için lütfen bizimle iletişime geçin.',
        },
    },
    en: {
        head: {
            title: 'Contracted Institutions — Hisar Hospital',
            description: 'Insurance companies, banks, assistance firms and institutions contracted with Hisar Hospital Intercontinental. Search quickly with category filters.',
            ogDescription: 'Search contracted insurance, bank and assistance firms and filter them by category.',
        },
        h1: 'Contracted Institutions',
        heroDesc: 'Search or filter by category the insurance companies, banks, assistance firms and institutions contracted with Hisar Hospital Intercontinental.',
        searchPrefix: 'e.g. ',
        clear: 'Clear',
        all: 'All',
        listedSuffix: 'institutions listed',
        resultPre: '',
        infoNote: 'Contracted institution coverage may vary by policy type, plan details and the department where service is received. For up-to-date coverage information, we recommend contacting your insurance company or our hospital before your appointment.',
        countSuffix: 'institutions',
        empty: {
            title: 'No institutions match your search',
            body: 'Try typing the institution name differently, or contact us for detailed information.',
            reset: 'Clear Filters',
            contact: 'Get in Touch',
        },
        sidebar: {
            badge: 'Get information',
            title: 'Would you like to learn your institution’s coverage?',
            body: 'You can contact us to get detailed information about your contracted institution and insurance coverage.',
            appointment: 'Book Appointment',
            contact: 'Contact Us',
            note: 'Coverage information may be updated. For institutions you can’t find in the list, please contact us.',
        },
    },
} as const;

/* ──────────────── Page ──────────────── */

export default function ContractedInstitutions() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const [q, setQ] = useState('');
    const [activeCat, setActiveCat] = useState<string>('all');
    const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(CATEGORIES.map((cat) => [cat.key, true])),
    );

    /* Locale-resolved categories (labels + notes as strings). */
    const localized = useMemo(
        () =>
            CATEGORIES.map((cat) => ({
                key: cat.key,
                label: cat.label[locale],
                items: cat.items.map((it) => ({ name: it.name, note: it.note ? it.note[locale] : undefined })),
            })),
        [locale],
    );

    const totalCount = useMemo(
        () => localized.reduce((acc, cat) => acc + cat.items.length, 0),
        [localized],
    );

    const filteredCategories = useMemo(() => {
        const nq = normalizeTr(q.trim());
        return localized
            .filter((cat) => activeCat === 'all' || cat.key === activeCat)
            .map((cat) => ({
                ...cat,
                items: cat.items.filter((i) =>
                    !nq ? true : normalizeTr(`${i.name} ${i.note ?? ''}`).includes(nq),
                ),
            }));
    }, [q, activeCat, localized]);

    const resultCount = useMemo(
        () => filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0),
        [filteredCategories],
    );

    const suggestions = useMemo(
        () => ['Allianz', 'AXA', 'Ak Sigorta', 'Mapfre', 'HDI', 'Akbank', 'TAV Passport'],
        [],
    );
    const [typed, setTyped] = useState('');
    useEffect(() => {
        if (q) return; // pause animation while user typing
        let wordIdx = 0;
        let charIdx = 0;
        let deleting = false;
        let timer: ReturnType<typeof setTimeout>;
        const tick = () => {
            const word = suggestions[wordIdx];
            if (!deleting) {
                charIdx++;
                setTyped(word.slice(0, charIdx));
                if (charIdx === word.length) {
                    deleting = true;
                    timer = setTimeout(tick, 1400);
                    return;
                }
            } else {
                charIdx--;
                setTyped(word.slice(0, charIdx));
                if (charIdx === 0) {
                    deleting = false;
                    wordIdx = (wordIdx + 1) % suggestions.length;
                }
            }
            timer = setTimeout(tick, deleting ? 45 : 90);
        };
        timer = setTimeout(tick, 400);
        return () => clearTimeout(timer);
    }, [q, suggestions]);

    const toggleCat = (key: string) =>
        setOpenMap((m) => ({ ...m, [key]: !m[key] }));

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.title} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/anlasmali-kurumlar" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/anlasmali-kurumlar" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/anlasmali-kurumlar" />
            </Head>

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 via-surface to-background border-b border-border/60">
                <div
                    className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_55%)]"
                    aria-hidden
                />
                <div className="container-x relative py-6 lg:py-12">
                    <div className="text-center">
                        <h1 className="text-xl lg:text-4xl font-black tracking-tight text-primary">
                            {c.h1}
                        </h1>
                        <p className="mx-auto mt-1.5 lg:mt-2 max-w-2xl text-xs lg:text-sm text-muted-foreground">
                            {c.heroDesc}
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mx-auto mt-4 lg:mt-6 max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={`${c.searchPrefix}${typed || suggestions[0]}`}
                                className="w-full rounded-full bg-card border border-border h-11 pl-11 pr-10 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 shadow-sm"
                            />
                            {q && (
                                <button
                                    onClick={() => setQ('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
                                    aria-label={c.clear}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category chips */}
                    <div className="mt-5 lg:mt-7 -mx-4 lg:mx-0 overflow-x-auto no-scrollbar">
                        <div className="flex lg:flex-wrap lg:justify-center gap-1.5 lg:gap-2 px-4 lg:px-0 min-w-max lg:min-w-0">
                            <CategoryChip
                                active={activeCat === 'all'}
                                onClick={() => setActiveCat('all')}
                                label={c.all}
                                count={totalCount}
                            />
                            {localized.map((cat) => (
                                <CategoryChip
                                    key={cat.key}
                                    active={activeCat === cat.key}
                                    onClick={() => setActiveCat(cat.key)}
                                    label={cat.label}
                                    count={cat.items.length}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 lg:mt-4 flex items-center justify-center gap-2 text-[11px] lg:text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>
                            {q ? (
                                locale === 'tr' ? (
                                    <>
                                        “{q}” için <b className="text-primary">{resultCount}</b> sonuç bulundu
                                    </>
                                ) : (
                                    <>
                                        <b className="text-primary">{resultCount}</b> result(s) found for “{q}”
                                    </>
                                )
                            ) : (
                                <>
                                    <b className="text-primary">{resultCount}</b> {c.listedSuffix}
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-8 lg:py-14 bg-surface/40 pb-[calc(var(--bottom-nav-h)+3rem)] lg:pb-16">
                <div className="container-x grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-10 items-start">
                    <div className="min-w-0">
                        {/* Info note */}
                        <div className="mb-5 lg:mb-6 flex gap-3 rounded-2xl border border-border/70 bg-card p-4 lg:p-5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                                <Info className="h-4 w-4" />
                            </span>
                            <p className="text-[12.5px] lg:text-sm text-muted-foreground leading-relaxed">
                                {c.infoNote}
                            </p>
                        </div>

                        {/* Categories */}
                        {resultCount === 0 ? (
                            <EmptyState query={q} onReset={() => { setQ(''); setActiveCat('all'); }} />
                        ) : (
                            <div className="space-y-3 lg:space-y-4">
                                {filteredCategories
                                    .filter((cat) => cat.items.length > 0)
                                    .map((cat) => {
                                        const open = q ? true : openMap[cat.key];
                                        return (
                                            <div
                                                key={cat.key}
                                                className="rounded-2xl border border-border/70 bg-card overflow-hidden"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCat(cat.key)}
                                                    className="w-full flex items-center justify-between gap-3 p-4 lg:p-5 text-left hover:bg-primary-soft/30 transition"
                                                    aria-expanded={open}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                                                            <Building2 className="h-4 w-4" />
                                                        </span>
                                                        <div className="min-w-0">
                                                            <h3 className="text-[15px] lg:text-base font-bold text-primary leading-tight truncate">
                                                                {cat.label}
                                                            </h3>
                                                            <p className="mt-0.5 text-[11.5px] lg:text-xs text-muted-foreground">
                                                                {cat.items.length} {c.countSuffix}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                                                            open ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>

                                                <div
                                                    className={`grid transition-all duration-300 ease-out ${
                                                        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                    }`}
                                                >
                                                    <div className="overflow-hidden">
                                                        <div className="border-t border-border/60 p-3 lg:p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 lg:gap-2.5">
                                                            {cat.items.map((i, idx) => (
                                                                <div
                                                                    key={`${cat.key}-${idx}-${i.name}`}
                                                                    className="group flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3 lg:p-3.5 hover:border-primary/30 hover:shadow-sm transition"
                                                                >
                                                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary text-[11px] font-black">
                                                                        {i.name.charAt(0)}
                                                                    </span>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-[13.5px] font-semibold text-primary leading-snug">
                                                                            {i.name}
                                                                        </p>
                                                                        {i.note && (
                                                                            <p className="mt-0.5 text-[11.5px] text-muted-foreground leading-snug">
                                                                                {i.note}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>

                    {/* Sidebar CTA */}
                    <aside className="lg:sticky lg:top-36 space-y-4">
                        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card to-primary-soft/30 p-5 lg:p-6 shadow-[0_10px_30px_-18px_oklch(0.28_0.16_268/0.35)]">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange">
                                {c.sidebar.badge}
                            </span>
                            <h3 className="mt-3 text-lg font-bold text-primary leading-tight">
                                {c.sidebar.title}
                            </h3>
                            <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
                                {c.sidebar.body}
                            </p>

                            <div className="mt-4 space-y-2">
                                <AppointmentCTA href={settings.appointment_url}>
                                    <CalendarHeart className="h-4 w-4" /> {c.sidebar.appointment}
                                </AppointmentCTA>
                                <a
                                    href="tel:4445888"
                                    className="flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition"
                                >
                                    <Phone className="h-4 w-4" /> 444 5 888
                                </a>
                                <Link
                                    href={lp('/iletisim')}
                                    className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-2.5 text-sm font-bold text-primary hover:border-primary/40 transition"
                                >
                                    <Mail className="h-4 w-4" /> {c.sidebar.contact}
                                </Link>
                            </div>
                        </div>

                        <p className="text-[11.5px] text-muted-foreground leading-relaxed px-1">
                            {c.sidebar.note}
                        </p>
                    </aside>
                </div>
            </section>
        </>
    );
}

ContractedInstitutions.layout = siteLayout;

/* ──────────────── Subcomponents ──────────────── */

function CategoryChip({
    active,
    onClick,
    label,
    count,
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    count: number;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                active
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-card text-primary/85 hover:border-primary/40 hover:bg-primary-soft/50'
            }`}
        >
            {label}
            <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 min-w-[20px] text-[10.5px] font-bold ${
                    active ? 'bg-white/20 text-primary-foreground' : 'bg-primary-soft text-primary'
                }`}
            >
                {count}
            </span>
        </button>
    );
}

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
    const locale: Locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    return (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 lg:p-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Search className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-primary">
                {c.empty.title}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
                {query ? <>“{query}” </> : null}
                {c.empty.body}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <button
                    onClick={onReset}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-primary hover:border-primary/40 transition"
                >
                    <X className="h-3.5 w-3.5" /> {c.empty.reset}
                </button>
                <Link
                    href={lp('/iletisim')}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition"
                >
                    {c.empty.contact} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        </div>
    );
}
