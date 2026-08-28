import { useState, type ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    ChevronDown,
    Clock,
    Cpu,
    FileText,
    Play,
    Stethoscope,
} from 'lucide-react';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import {
    getBlogPostsForDept,
    getDiseasesForDept,
    getTechnologiesForDept,
    getTreatmentsForDept,
    getVideosForDept,
    type Doctor,
} from '@/lib/site-data';

/* ── Bilingual UI copy ── */
const COPY = {
    tr: {
        related: 'İlgili İçerikler',
        treatments: 'Tedavi Yöntemleri',
        diseases: 'İlgilenilen Hastalıklar',
        technologies: 'Kullanılan Teknolojiler',
        videos: 'Videolar',
        articles: 'Sağlıklı Hayat Rehberi Yazıları',
        press: 'Basında',
    },
    en: {
        related: 'Related content',
        treatments: 'Treatment methods',
        diseases: 'Conditions treated',
        technologies: 'Technologies used',
        videos: 'Videos',
        articles: 'Healthy Life articles',
        press: 'In the press',
    },
} as const;

type PressCard = { slug: string; title: string; excerpt: string; source: string; date: string; cover: string };

type Group = {
    key: string;
    title: string;
    count: number;
    body: ReactNode;
};

/**
 * Doktor CV'sinde ilgili içerikler — tek kutu içinde açılır satırlar.
 * Tüm ilişkiler doktorun bölümü (`departmentSlug`) üzerinden merkezî getter'lardan
 * gelir; her kart gerçek route'a gider.
 */
export function RelatedDoctorContent({ doctor }: { doctor: Doctor }) {
    const locale = useLocale();
    const lp = useLocalizedPath();
    const c = COPY[locale];

    const deptSlug = doctor.departmentSlug;
    const treatments = getTreatmentsForDept(deptSlug, locale).slice(0, 6);
    const diseases = getDiseasesForDept(deptSlug, locale).slice(0, 6);
    const technologies = getTechnologiesForDept(deptSlug, locale).slice(0, 4);
    const videos = getVideosForDept(deptSlug, locale).slice(0, 4);
    const articles = getBlogPostsForDept(deptSlug, locale).slice(0, 4);
    // Press has no dept-scoped auto — only the doctor's manual picks (related.press).
    const press = ((usePage().props as { related?: { press?: PressCard[] } }).related?.press ?? []).slice(0, 4);

    const groups: Group[] = [];

    if (treatments.length > 0) {
        groups.push({
            key: 'treatments',
            title: c.treatments,
            count: treatments.length,
            body: (
                <ul className="grid gap-3 sm:grid-cols-2">
                    {treatments.map((t) => (
                        <li key={t.slug}>
                            <Link href={lp('/tedavi/' + t.slug)} className="group block h-full">
                                <RowCard
                                    media={<img src={t.cover} alt="" loading="lazy" decoding="async" className="h-11 w-11 rounded-xl object-cover" />}
                                    title={t.name}
                                    note={t.department}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            ),
        });
    }

    if (diseases.length > 0) {
        groups.push({
            key: 'diseases',
            title: c.diseases,
            count: diseases.length,
            body: (
                <ul className="grid gap-3 sm:grid-cols-2">
                    {diseases.map((d) => (
                        <li key={d.slug}>
                            <Link href={lp('/hastalik/' + d.slug)} className="group block h-full">
                                <RowCard
                                    media={<Activity className="h-5 w-5" strokeWidth={1.5} />}
                                    title={d.name}
                                    note={doctor.department}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            ),
        });
    }

    if (technologies.length > 0) {
        groups.push({
            key: 'technologies',
            title: c.technologies,
            count: technologies.length,
            body: (
                <ul className="grid gap-3 sm:grid-cols-2">
                    {technologies.map((t) => (
                        <li key={t.slug}>
                            <Link href={lp('/teknoloji/' + t.slug)} className="group block h-full">
                                <RowCard media={<Cpu className="h-5 w-5" strokeWidth={1.5} />} title={t.name} note={t.desc} />
                            </Link>
                        </li>
                    ))}
                </ul>
            ),
        });
    }

    if (videos.length > 0) {
        groups.push({
            key: 'videos',
            title: c.videos,
            count: videos.length,
            body: (
                <ul className="grid gap-3 sm:grid-cols-2">
                    {videos.map((v) => (
                        <li key={v.id}>
                            <Link
                                href={lp('/videolar')}
                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition hover:border-primary/30"
                            >
                                <span className="relative grid aspect-video place-items-center bg-primary-soft/60">
                                    <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-orange text-brand-orange-foreground shadow-orange">
                                        <Play className="h-4 w-4" aria-hidden />
                                    </span>
                                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-background/95 px-2 py-0.5 text-[11px] font-bold text-primary">
                                        <Clock className="h-3 w-3" aria-hidden />
                                        {v.duration}
                                    </span>
                                </span>
                                <span className="flex flex-1 flex-col p-3.5">
                                    <span className="text-[13.5px] font-semibold leading-snug text-primary line-clamp-2">{v.title}</span>
                                    <span className="mt-1 text-[11.5px] text-muted-foreground">{v.category}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ),
        });
    }

    if (articles.length > 0) {
        groups.push({
            key: 'articles',
            title: c.articles,
            count: articles.length,
            body: (
                <ul className="grid gap-3 sm:grid-cols-2">
                    {articles.map((p) => (
                        <li key={p.slug}>
                            <Link
                                href={lp('/saglikli-hayat-rehberi/' + p.slug)}
                                className="group flex h-full gap-3 rounded-2xl border border-border/70 bg-card p-3 transition hover:border-primary/30"
                            >
                                <img
                                    src={p.cover}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="h-16 w-20 shrink-0 rounded-xl object-cover"
                                />
                                <span className="min-w-0">
                                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {doctor.department}
                                    </span>
                                    <span className="mt-1 block text-[13.5px] font-semibold leading-snug text-primary line-clamp-2">
                                        {p.title}
                                    </span>
                                    <span className="mt-1 block text-[12px] leading-snug text-muted-foreground line-clamp-2">
                                        {p.excerpt}
                                    </span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ),
        });
    }

    if (press.length > 0) {
        groups.push({
            key: 'press',
            title: c.press,
            count: press.length,
            body: (
                <ul className="grid gap-3 sm:grid-cols-2">
                    {press.map((p) => (
                        <li key={p.slug}>
                            <Link
                                href={lp('/basinda-hastanemiz/' + p.slug)}
                                className="group flex h-full gap-3 rounded-2xl border border-border/70 bg-card p-3 transition hover:border-primary/30"
                            >
                                <img src={p.cover} alt="" loading="lazy" decoding="async" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                                <span className="min-w-0">
                                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{p.source}</span>
                                    <span className="mt-1 block text-[13.5px] font-semibold leading-snug text-primary line-clamp-2">{p.title}</span>
                                    <span className="mt-1 block text-[12px] leading-snug text-muted-foreground line-clamp-2">{p.excerpt}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ),
        });
    }

    if (groups.length === 0) return null;

    return (
        <section aria-labelledby="related-doctor-content" className="mt-10 lg:mt-14">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="related-doctor-content" className="text-lg lg:text-xl font-bold tracking-tight text-primary">
                    {c.related}
                </h2>
                {deptSlug && doctor.department && (
                    <Link
                        href={lp('/bolum/' + deptSlug)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1.5 text-[12px] font-semibold text-primary transition hover:border-primary/30"
                    >
                        <Stethoscope className="h-3.5 w-3.5 text-brand-orange" aria-hidden />
                        {doctor.department}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                )}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                {groups.map((g, i) => (
                    <RelatedGroup key={g.key} title={g.title} count={g.count} defaultOpen={i === 0}>
                        {g.body}
                    </RelatedGroup>
                ))}
            </div>
        </section>
    );
}

function RowCard({ media, title, note }: { media: ReactNode; title: string; note?: string }) {
    return (
        <span className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 transition group-hover:border-primary/30 group-hover:bg-primary-soft/20">
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary-soft/60 text-primary">
                {media}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold leading-snug text-primary line-clamp-2">{title}</span>
                {note && <span className="mt-0.5 block truncate text-[11.5px] text-muted-foreground">{note}</span>}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-brand-orange" aria-hidden />
        </span>
    );
}

/** Tek kutu içinde açılır satır (CV akordeonuyla aynı dil). */
function RelatedGroup({
    title,
    count,
    defaultOpen = false,
    children,
}: {
    title: string;
    count: number;
    defaultOpen?: boolean;
    children: ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-border/50 last:border-0">
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex min-h-11 w-full items-center gap-3 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 lg:px-5"
            >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                    <FileText className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-bold leading-tight text-primary lg:text-lg">{title}</span>
                </span>
                <span className="shrink-0 rounded-full bg-primary-soft/60 px-2 py-0.5 text-[11.5px] font-bold text-primary">
                    {count}
                </span>
                <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-orange transition-transform ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                />
            </button>
            {open && <div className="-mt-1 px-4 pb-5 lg:px-5">{children}</div>}
        </div>
    );
}
