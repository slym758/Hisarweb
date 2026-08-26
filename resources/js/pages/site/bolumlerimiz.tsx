import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowRight, Search, Stethoscope, X } from 'lucide-react';

import { siteLayout } from '@/layouts/site-layout';
import { DeptIcon } from '@/components/site/DeptIcon';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';
import { useDepartments } from '@/lib/site-data';
import { cn } from '@/lib/utils';
import { useAnimatedPlaceholder } from '@/hooks/use-animated-placeholder';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Bölümlerimiz — Hisar Hospital',
            description: "Hisar Hospital'da 50'den fazla branşta uzman kadromuzla bütüncül sağlık hizmeti.",
        },
        title: 'Bölümlerimiz',
        subtitle: 'Hayatın her döneminde, ihtiyacınız olan tüm branşlarda yanınızdayız.',
        searchPlaceholder: 'Bölüm veya hizmet ara',
        clear: 'Temizle',
        sortAz: 'A → Z Sırala',
        sortZa: 'Z → A Sırala',
        countLabel: 'bölüm listeleniyor',
        empty: 'Aramanıza uygun bölüm bulunamadı.',
        cardCta: 'Bölümü İncele',
        suggestions: ['Kardiyoloji', 'Ortopedi', 'Göz', 'KBB', 'Onkoloji', 'Nöroloji'],
    },
    en: {
        head: {
            title: 'Our Departments — Hisar Hospital',
            description: 'Holistic healthcare at Hisar Hospital with expert staff across more than 50 specialties.',
        },
        title: 'Our Departments',
        subtitle: "In every stage of life, we're by your side across all the specialties you need.",
        searchPlaceholder: 'Search a department or service',
        clear: 'Clear',
        sortAz: 'Sort A → Z',
        sortZa: 'Sort Z → A',
        countLabel: 'departments listed',
        empty: 'No department matched your search.',
        cardCta: 'Explore Department',
        suggestions: ['Cardiology', 'Orthopaedics', 'Eye', 'ENT', 'Oncology', 'Neurology'],
    },
} as const;

function normalizeTr(s: string) {
    return s
        .toLocaleLowerCase('tr')
        .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c')
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o');
}

export default function BolumlerPage() {
    const locale = useLocale();
    const c = usePageCopy('bolumlerimiz', COPY[locale]);
    const lp = useLocalizedPath();
    const departments = useDepartments();
    const [q, setQ] = useState('');
    const [sort, setSort] = useState<'az' | 'za'>('az');
    const typed = useAnimatedPlaceholder(c.suggestions as unknown as string[], !q);

    const filtered = useMemo(() => {
        const nq = normalizeTr(q.trim());
        const list = departments.filter((d) => {
            if (!nq) return true;
            return normalizeTr(`${d.name} ${d.blurb}`).includes(nq);
        });
        return list.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return sort === 'az'
                ? a.name.localeCompare(b.name, 'tr')
                : b.name.localeCompare(a.name, 'tr');
        });
    }, [q, sort, departments]);

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/bolumlerimiz" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/bolumlerimiz" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/bolumlerimiz" />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 via-surface to-background border-b border-border/60">
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_55%)]" aria-hidden />
                <div className="container-x relative py-6 lg:py-12 text-center">
                    <h1 className="text-xl lg:text-4xl font-black tracking-tight text-primary">{c.title}</h1>
                    <p className="mx-auto mt-1 lg:mt-2 max-w-xl text-xs lg:text-sm text-muted-foreground">
                        {c.subtitle}
                    </p>

                    <div className="mx-auto mt-3 lg:mt-5 max-w-3xl grid gap-2 sm:grid-cols-[1fr_200px]">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={`${c.searchPlaceholder} — ${typed}`}
                                className="w-full rounded-full bg-card border border-border h-10 pl-10 pr-9 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 shadow-sm"
                            />
                            {q && (
                                <button
                                    onClick={() => setQ('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
                                    aria-label={c.clear}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as typeof sort)}
                            className="rounded-full bg-card border border-border h-10 px-3 text-sm text-foreground outline-none focus:border-primary/40 shadow-sm"
                        >
                            <option value="az">{c.sortAz}</option>
                            <option value="za">{c.sortZa}</option>
                        </select>
                    </div>

                    <div className="mt-2 lg:mt-3 inline-flex items-center gap-2 text-[11px] lg:text-xs text-muted-foreground">
                        <Stethoscope className="h-3.5 w-3.5" />
                        <span>{filtered.length} {c.countLabel}</span>
                    </div>
                </div>
            </section>

            <section className="py-6 lg:py-10 bg-surface/40 pb-[calc(var(--bottom-nav-h)+5rem)] lg:pb-20">
                <div className="container-x">
                    {filtered.length === 0 ? (
                        <p className="text-center text-muted-foreground py-20">{c.empty}</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 lg:gap-5">
                            {filtered.map((d) => {
                                return (
                                    <Link
                                        key={d.slug}
                                        href={lp('/bolum/' + d.slug)}
                                        className="group relative flex flex-col items-center text-center rounded-2xl border border-border/70 bg-card px-3 pt-3 pb-3.5 lg:px-4 lg:pt-4 lg:pb-4 shadow-[0_2px_8px_-2px_oklch(0.28_0.16_268/0.06),0_1px_2px_oklch(0.28_0.16_268/0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_36px_-16px_oklch(0.28_0.16_268/0.22),0_4px_12px_-4px_oklch(0.28_0.16_268/0.1)] active:border-primary/30"
                                    >
                                        {/* Icon medallion — SVG fills the full circle */}
                                        <span className={cn(
                                            'relative flex h-[64px] w-[64px] lg:h-[72px] lg:w-[72px] items-center justify-center overflow-hidden rounded-full transition-transform duration-300',
                                            'group-hover:scale-105'
                                        )}>
                                            <DeptIcon dept={d} className="h-full w-full" strokeWidth={1.25} />
                                        </span>


                                    {/* Department name */}
                                    <h3 className="mt-2.5 lg:mt-3 text-[13px] lg:text-[14px] font-extrabold tracking-tight text-primary leading-[1.3] text-balance">
                                        {d.name}
                                    </h3>

                                    {/* 2-line clamped blurb */}
                                    <p className="mt-1 text-[11.5px] lg:text-[12px] text-muted-foreground leading-[1.5] line-clamp-2 text-balance">
                                        {d.blurb}
                                    </p>

                                    {/* Pill CTA */}
                                    <span className="mt-2.5 lg:mt-3.5 inline-flex items-center gap-1 rounded-full border border-brand-orange/25 bg-brand-orange/[0.06] px-2.5 py-[5px] text-[11px] lg:text-[11.5px] font-semibold text-brand-orange transition-all duration-200 group-hover:border-brand-orange/50 group-hover:bg-brand-orange group-hover:text-brand-orange-foreground group-hover:shadow-orange">
                                        <span>{c.cardCta}</span>
                                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
                                    </span>
                                </Link>
                            );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

BolumlerPage.layout = siteLayout;
