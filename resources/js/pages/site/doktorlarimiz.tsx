import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CalendarDays, Search, Stethoscope, X, MapPin } from 'lucide-react';

import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { useDoctors, type Doctor } from '@/lib/site-data';
import { useAnimatedPlaceholder } from '@/hooks/use-animated-placeholder';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Doktorlarımız — Hisar Hospital',
            description: 'Alanında uzman akademik hekim kadromuzla tanışın. Bölüme göre filtreleyin, hızlıca randevu talebi oluşturun.',
        },
        title: 'Doktorlarımız',
        subtitle: 'Uzman hekim kadromuzu bölüm, isim veya hastaneye göre filtreleyin.',
        searchPlaceholder: 'Ara',
        clear: 'Temizle',
        allDepartments: 'Tüm Bölümler',
        allHospitals: 'Tüm Hastaneler',
        countLabel: 'doktor listeleniyor',
        empty: 'Aramanıza uygun sonuç bulunamadı.',
        profileAria: (name: string) => `${name} profilini görüntüle`,
        appointmentAria: 'Randevu al',
        profileCta: 'Profili İncele',
        suggestions: ['Basri Çakıroğlu', 'Gürsel Saka', 'Kardiyoloji', 'Ortopedi', 'Yalçın İşcan'],
    },
    en: {
        head: {
            title: 'Our Doctors — Hisar Hospital',
            description: 'Meet our expert academic physicians. Filter by department and quickly request an appointment.',
        },
        title: 'Our Doctors',
        subtitle: 'Filter our expert physicians by department, name or hospital.',
        searchPlaceholder: 'Search',
        clear: 'Clear',
        allDepartments: 'All Departments',
        allHospitals: 'All Hospitals',
        countLabel: 'doctors listed',
        empty: 'No result matched your search.',
        profileAria: (name: string) => `View ${name}'s profile`,
        appointmentAria: 'Book appointment',
        profileCta: 'View Profile',
        suggestions: ['Basri Çakıroğlu', 'Gürsel Saka', 'Cardiology', 'Orthopaedics', 'Yalçın İşcan'],
    },
} as const;

function normalizeTr(s: string) {
    return s
        .toLocaleLowerCase('tr')
        .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c')
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o');
}

const TITLE_PREFIXES = [
    'Prof. Dr.', 'Doç. Dr.', 'Yrd. Doç. Dr.', 'Dr. Öğr. Üyesi', 'Op. Dr.', 'Uzm. Dr.',
    'Dr. Dt.', 'Dt.', 'Dyt.', 'Uzman Psikolog', 'Embriyolog', 'Dr.',
];
function splitName(full: string): { prefix: string; name: string } {
    for (const p of TITLE_PREFIXES) {
        if (full.startsWith(p + ' ')) return { prefix: p, name: full.slice(p.length + 1) };
    }
    return { prefix: '', name: full };
}

/* Proper-noun hospital brand labels (locale-independent). */
const hospitalLabel: Record<string, string> = {
    intercontinental: 'Hisar Intercontinental',
    camlica: 'Hisar Çamlıca',
};

export default function DoctorsPage() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const doctors = useDoctors();
    const [q, setQ] = useState('');
    const [dept, setDept] = useState('all');
    const [hosp, setHosp] = useState<'all' | string>('all');
    const typed = useAnimatedPlaceholder(c.suggestions as unknown as string[], !q);

    const allDepartments = useMemo(() => {
        return Array.from(new Set(doctors.map((d) => d.department))).sort((a, b) => a.localeCompare(b, 'tr'));
    }, [doctors]);

    const filtered = useMemo(() => {
        const nq = normalizeTr(q.trim());
        return doctors
            .filter((d) => {
                if (dept !== 'all' && d.department !== dept) return false;
                if (hosp !== 'all' && d.hospitalSlug !== hosp) return false;
                if (!nq) return true;
                const hay = normalizeTr(`${d.name} ${d.department} ${d.subspecialties?.join(' ') ?? ''}`);
                return hay.includes(nq);
            })
            .slice()
            .sort((a, b) => (a.photo ? 0 : 1) - (b.photo ? 0 : 1));
    }, [q, dept, hosp, doctors]);

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/doktorlarimiz" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/doktorlarimiz" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/doktorlarimiz" />
            </Head>

            {/* Hero header — kompakt */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 via-surface to-background border-b border-border/60">
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_55%)]" aria-hidden />
                <div className="container-x relative py-6 lg:py-12 text-center">
                    <h1 className="text-xl lg:text-4xl font-black tracking-tight text-primary">{c.title}</h1>
                    <p className="mx-auto mt-1.5 lg:mt-2 max-w-xl text-xs lg:text-sm text-muted-foreground">
                        {c.subtitle}
                    </p>

                    <div className="mx-auto mt-4 lg:mt-6 max-w-4xl grid gap-2 sm:grid-cols-[1fr_200px_200px]">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={`${c.searchPlaceholder} — ${typed}`}
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
                        <select
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                            className="rounded-full bg-card border border-border h-11 px-4 text-sm text-foreground outline-none focus:border-primary/40 shadow-sm"
                        >
                            <option value="all">{c.allDepartments}</option>
                            {allDepartments.map((d) => (<option key={d} value={d}>{d}</option>))}
                        </select>
                        <select
                            value={hosp}
                            onChange={(e) => setHosp(e.target.value as typeof hosp)}
                            className="rounded-full bg-card border border-border h-11 px-4 text-sm text-foreground outline-none focus:border-primary/40 shadow-sm"
                        >
                            <option value="all">{c.allHospitals}</option>
                            <option value="intercontinental">Hisar Intercontinental</option>
                            <option value="camlica">Hisar Çamlıca</option>
                        </select>
                    </div>

                    <div className="mt-3 lg:mt-4 inline-flex items-center gap-2 text-[11px] lg:text-xs text-muted-foreground">
                        <Stethoscope className="h-3.5 w-3.5" />
                        <span>{filtered.length} {c.countLabel}</span>
                    </div>
                </div>
            </section>

            <section className="py-5 lg:py-10 bg-surface/40 pb-[calc(var(--bottom-nav-h)+3rem)] lg:pb-16">
                <div className="container-x">
                    {filtered.length === 0 ? (
                        <p className="text-center text-muted-foreground py-20">{c.empty}</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-2.5 sm:hidden">
                                {filtered.map((doc) => (<DoctorCardMobile key={doc.id} doc={doc} />))}
                            </div>
                            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                                {filtered.map((doc) => (<DoctorCard key={doc.id} doc={doc} />))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

DoctorsPage.layout = siteLayout;

function PlaceholderPortrait({ size = 'md' }: { size?: 'sm' | 'md' }) {
    return (
        <div className="relative h-full w-full bg-[oklch(0.96_0.012_260)] flex items-center justify-center">
            <Stethoscope
                className={size === 'sm' ? 'h-6 w-6 text-primary/25' : 'h-10 w-10 text-primary/25'}
                strokeWidth={1.5}
                aria-hidden
            />
        </div>
    );
}

/* Mobile — kompakt yatay */
function DoctorCardMobile({ doc }: { doc: Doctor }) {
    const c = COPY[useLocale()];
    const lp = useLocalizedPath();
    const { prefix, name } = splitName(doc.name);
    return (
        <article className="relative overflow-hidden rounded-2xl bg-card border border-border/60 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <Link
                href={lp('/doktor/' + doc.id)}
                aria-label={c.profileAria(doc.name)}
                className="absolute inset-0 z-10"
            />
            <div className="flex gap-3 p-2.5">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-primary-soft/50">
                    {doc.photo ? (
                        <img src={doc.photo} alt={doc.name} loading="lazy" className="h-full w-full object-cover object-top" />
                    ) : (
                        <PlaceholderPortrait size="sm" />
                    )}
                </div>
                <div className="min-w-0 flex-1 flex flex-col justify-center pr-1">
                    <p className="text-[10px] font-semibold text-brand-cyan truncate">{prefix || ' '}</p>
                    <h3 className="text-[14px] font-bold text-primary leading-snug line-clamp-2">{name}</h3>
                    <p className="mt-0.5 text-[11px] font-semibold text-foreground/80 truncate" title={doc.department}>
                        {doc.department}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{hospitalLabel[doc.hospitalSlug]}</span>
                    </p>
                </div>
                <Link
                    href={lp('/randevu-al')}
                    aria-label={c.appointmentAria}
                    className="relative z-20 self-center inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-orange text-brand-orange-foreground shadow-sm"
                >
                    <CalendarDays className="h-4 w-4" />
                </Link>
            </div>
        </article>
    );
}

/* Desktop — dikey */
function DoctorCard({ doc }: { doc: Doctor }) {
    const c = COPY[useLocale()];
    const lp = useLocalizedPath();
    const { prefix, name } = splitName(doc.name);
    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border/60 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_40px_-20px_rgba(30,58,138,0.25)] hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300">
            <Link
                href={lp('/doktor/' + doc.id)}
                aria-label={c.profileAria(doc.name)}
                className="absolute inset-0 z-10"
            />
            <div className="relative aspect-[4/5] overflow-hidden bg-primary-soft/50">
                {doc.photo ? (
                    <img
                        src={doc.photo}
                        alt={doc.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                    />
                ) : (
                    <PlaceholderPortrait />
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <p className="text-[11px] font-semibold text-brand-cyan truncate min-h-[14px]">{prefix || ' '}</p>
                <h3 className="mt-0.5 text-[15px] font-bold text-primary leading-snug line-clamp-2 min-h-[40px]">{name}</h3>
                <p className="mt-1.5 text-[12px] font-semibold text-foreground/80 line-clamp-1" title={doc.department}>
                    {doc.department}
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground line-clamp-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{hospitalLabel[doc.hospitalSlug]}</span>
                </p>

                <div className="flex-1" />

                <div className="relative z-20 mt-4 flex items-center gap-2">
                    <Link
                        href={lp('/doktor/' + doc.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/25 px-3 py-2 text-[12px] font-semibold text-primary hover:bg-primary/5 transition"
                    >
                        {c.profileCta}
                    </Link>
                    <Link
                        href={lp('/randevu-al')}
                        aria-label={c.appointmentAria}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-orange text-brand-orange-foreground shadow-sm hover:shadow-md transition"
                    >
                        <CalendarDays className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
