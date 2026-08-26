import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowRight, Search, UserRound } from 'lucide-react';

import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { BizeUlasin } from '@/components/site/BizeUlasin';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { OnkolojiSubNav } from '@/components/site/OnkolojiSubNav';
import { useAnimatedPlaceholder } from '@/hooks/useAnimatedPlaceholder';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { useDoctors } from '@/lib/site-data';

/**
 * Department slugs that participate in the multidisciplinary oncology board.
 * (The source filtered by localized Turkish department names; filtering by slug
 * keeps the roster stable across locales.)
 */
const ONK_DEPT_SLUGS = ['onkoloji', 'genel-cerrahi', 'uroloji', 'kadin-hastaliklari-dogum', 'kbb', 'radyoloji', 'ortopedi'];

const COPY = {
    tr: {
        head: {
            title: 'Medikal Kadro — Bütünleşik Onkoloji',
            description: "Hisar Hospital Bütünleşik Onkoloji'de görev yapan medikal onkoloji, radyasyon onkolojisi, cerrahi ve destek branşlarından hekim kadrosu.",
        },
        suggestions: ['Medikal onkoloji', 'Radyasyon onkolojisi', 'Cerrahi', 'Hematoloji', 'Üroloji'],
        crumbOnko: 'Bütünleşik Onkoloji',
        crumbSelf: 'Medikal Kadro',
        title: 'Medikal Kadro',
        intro: 'Bütünleşik Onkoloji Merkezimizde onkoloji, cerrahi, radyasyon, hematoloji ve destek branşlarından deneyimli hekimlerimiz multidisipliner tümör konseyinde bir araya gelir.',
        all: 'Tümü',
        searchPlaceholder: (typed: string) => `Hekim ara — ${typed}`,
        searchAria: 'Hekim ara',
        count: (n: number) => `${n} hekim listeleniyor`,
        profile: 'Profil',
        appointment: 'Randevu Al',
        empty: 'Aramanızla eşleşen hekim bulunamadı.',
    },
    en: {
        head: {
            title: 'Medical Staff — Integrated Oncology',
            description: 'The physician staff from medical oncology, radiation oncology, surgery and support specialties working at Hisar Hospital Integrated Oncology.',
        },
        suggestions: ['Medical oncology', 'Radiation oncology', 'Surgery', 'Hematology', 'Urology'],
        crumbOnko: 'Integrated Oncology',
        crumbSelf: 'Medical Staff',
        title: 'Medical Staff',
        intro: 'At our Integrated Oncology Center, our experienced physicians from oncology, surgery, radiation, hematology and support specialties come together in the multidisciplinary tumor board.',
        all: 'All',
        searchPlaceholder: (typed: string) => `Search physician — ${typed}`,
        searchAria: 'Search physician',
        count: (n: number) => `${n} physicians listed`,
        profile: 'Profile',
        appointment: 'Book Appointment',
        empty: 'No physicians match your search.',
    },
} as const;

export default function ButunlesikOnkolojiMedikalKadro() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const allDoctors = useDoctors();

    const roster = useMemo(
        () => allDoctors.filter((d) => ONK_DEPT_SLUGS.includes(d.departmentSlug)),
        [allDoctors],
    );

    const departments = useMemo(() => {
        const set = new Set<string>();
        roster.forEach((d) => set.add(d.department));
        return [c.all, ...Array.from(set).sort((a, b) => a.localeCompare(b, locale))];
    }, [roster, c.all, locale]);

    const [q, setQ] = useState('');
    const [dept, setDept] = useState<string>(c.all);
    const typed = useAnimatedPlaceholder(c.suggestions, !q);

    const filtered = roster.filter((d) => {
        const matchDept = dept === c.all || d.department === dept;
        const matchQ = !q || d.name.toLocaleLowerCase(locale).includes(q.toLocaleLowerCase(locale));
        return matchDept && matchQ;
    });

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.title} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/butunlesik-onkoloji/medikal-kadro" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/butunlesik-onkoloji/medikal-kadro" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/butunlesik-onkoloji/medikal-kadro" />
            </Head>

            <OnkolojiSubNav />
            <div className="container-x pt-6">
                <Breadcrumb items={[
                    { label: c.crumbOnko, to: '/butunlesik-onkoloji' },
                    { label: c.crumbSelf },
                ]} />
            </div>

            <section className="py-8 lg:py-12">
                <div className="container-x">
                    <h1 className="text-2xl lg:text-4xl font-black text-primary tracking-tight">{c.title}</h1>
                    <p className="mt-3 max-w-3xl text-sm lg:text-base text-foreground/85 leading-relaxed">
                        {c.intro}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_240px]">
                        <label className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={c.searchPlaceholder(typed)}
                                aria-label={c.searchAria}
                                className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                            />
                        </label>
                        <select
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                            className="h-11 rounded-full border border-border bg-surface px-4 text-sm font-medium text-primary outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                        >
                            {departments.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">{c.count(filtered.length)}</p>
                </div>
            </section>

            <section className="pb-12 lg:pb-20">
                <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((d) => (
                        <article key={d.id} className="hover-lift group rounded-2xl border border-border/70 bg-card p-5">
                            <div className="flex items-start gap-4">
                                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft">
                                    <UserRound className="h-6 w-6 text-primary" aria-hidden />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-[15px] font-bold text-primary leading-snug">{d.name}</h3>
                                    <p className="mt-0.5 text-[12px] font-semibold uppercase tracking-wide text-brand-orange">{d.department}</p>
                                    {d.subspecialties && d.subspecialties.length > 0 && (
                                        <p className="mt-1 text-[12px] text-muted-foreground">{d.subspecialties.join(' · ')}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Link
                                    href={lp('/doktor/' + d.id)}
                                    className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-[12px] font-semibold text-primary border border-border hover:border-primary/40 transition"
                                >
                                    {c.profile} <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                                <AppointmentCTA href={settings.appointment_url}>
                                    {c.appointment}
                                </AppointmentCTA>
                            </div>
                        </article>
                    ))}

                    {filtered.length === 0 && (
                        <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                            {c.empty}
                        </div>
                    )}
                </div>

                <div className="container-x mt-14">
                    <BizeUlasin />
                </div>
            </section>
        </>
    );
}

ButunlesikOnkolojiMedikalKadro.layout = siteLayout;
