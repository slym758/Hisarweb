import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';

import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { useTreatments, useDepartments, useHospitals } from '@/lib/site-data';
import { useAnimatedPlaceholder } from '@/hooks/use-animated-placeholder';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Tedavi Yöntemleri — Hisar Hospital',
            description: "Hisar Hospital'da uygulanan modern tedavi yöntemleri.",
        },
        title: 'Tedavi Yöntemleri',
        searchPlaceholder: 'Tedavi ara',
        searchAria: 'Tedavi yöntemi ara',
        deptPlaceholder: 'Bölüm',
        diseasePlaceholder: 'Hastalık',
        hospitalPlaceholder: 'Hastane',
        suggestions: ['Açık kalp ameliyatı', 'Katarakt', 'Diz protezi', 'Robotik cerrahi', 'Bariatrik'],
    },
    en: {
        head: {
            title: 'Treatment Methods — Hisar Hospital',
            description: 'Modern treatment methods offered at Hisar Hospital.',
        },
        title: 'Treatment Methods',
        searchPlaceholder: 'Search a treatment',
        searchAria: 'Search a treatment method',
        deptPlaceholder: 'Department',
        diseasePlaceholder: 'Disease',
        hospitalPlaceholder: 'Hospital',
        suggestions: ['Open-heart surgery', 'Cataract', 'Knee replacement', 'Robotic surgery', 'Bariatric'],
    },
} as const;

export default function TreatmentsPage() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const treatments = useTreatments();
    const departments = useDepartments();
    const hospitals = useHospitals();
    const [q, setQ] = useState('');
    const [dept, setDept] = useState('all');
    const typed = useAnimatedPlaceholder(c.suggestions as unknown as string[], !q);
    const filtered = useMemo(() => treatments.filter((t) =>
        (!q || t.name.toLowerCase().includes(q.toLowerCase())) &&
        (dept === 'all' || t.department.toLowerCase().includes(dept.toLowerCase()))
    ), [q, dept, treatments]);

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/tedavi-yontemleri" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/tedavi-yontemleri" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/tedavi-yontemleri" />
            </Head>

            <PageHeader title={c.title}>
                <div className="relative max-w-xl">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder={`${c.searchPlaceholder} — ${typed}`}
                        aria-label={c.searchAria}
                        className="w-full rounded-full bg-card border border-border h-12 pl-4 pr-12 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                    />
                    <span className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-orange text-brand-orange-foreground">
                        <Search className="h-4 w-4" />
                    </span>
                </div>
            </PageHeader>

            <section className="container-x pt-8 grid gap-3 md:grid-cols-3">
                <select value={dept} onChange={(e) => setDept(e.target.value)} className="rounded-xl bg-card border border-border h-12 px-4 text-sm outline-none focus:border-primary/40">
                    <option value="all">{c.deptPlaceholder}</option>
                    {departments.map((d) => <option key={d.slug} value={d.name}>{d.name}</option>)}
                </select>
                <select className="rounded-xl bg-card border border-border h-12 px-4 text-sm outline-none focus:border-primary/40">
                    <option>{c.diseasePlaceholder}</option>
                </select>
                <select className="rounded-xl bg-card border border-border h-12 px-4 text-sm outline-none focus:border-primary/40">
                    <option>{c.hospitalPlaceholder}</option>
                    {hospitals.map((h) => <option key={h.slug}>{h.name}</option>)}
                </select>
            </section>

            <section className="py-10">
                <div className="container-x grid gap-3 max-w-3xl mx-auto">
                    {filtered.map((t) => (
                        <Link
                            key={t.slug}
                            href={lp('/tedavi-yontemleri/' + t.slug)}
                            className="group hover-lift flex items-center gap-4 rounded-2xl bg-card border border-border/70 p-3 pr-5"
                        >
                            <img src={t.cover} alt={t.name} loading="lazy" className="h-20 w-24 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[16px] font-bold text-primary leading-tight">{t.name}</h3>
                                <p className="text-[13px] italic text-brand-cyan mt-1">{t.department}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                        </Link>
                    ))}

                </div>
            </section>
        </>
    );
}

TreatmentsPage.layout = siteLayout;
