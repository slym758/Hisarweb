import { Link } from '@inertiajs/react';
import { ArrowRight, Activity, Cpu, Play, Stethoscope, User } from 'lucide-react';
import type { ReactNode } from 'react';

import { getRelations } from '@/lib/relations';
import { useLocale, useLocalizedPath } from '@/lib/i18n';

const COPY = {
    tr: {
        heading: 'İlgili içerikler',
        doctors: 'İlgili Doktorlar',
        treatments: 'Tedavi Yöntemleri',
        diseases: 'İlgili Hastalıklar',
        technologies: 'Kullanılan Teknolojiler',
        videos: 'Videolar',
        articles: 'İlgili Yazılar',
        all: 'Tümü',
    },
    en: {
        heading: 'Related content',
        doctors: 'Related Doctors',
        treatments: 'Treatment Methods',
        diseases: 'Related Conditions',
        technologies: 'Technologies Used',
        videos: 'Videos',
        articles: 'Related Articles',
        all: 'See all',
    },
} as const;

function Group({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h3 className="text-[13px] font-black uppercase tracking-[0.14em] text-primary">{title}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
        </section>
    );
}

function Card({
    icon,
    title,
    note,
}: {
    icon: ReactNode;
    title: string;
    note?: string;
    children?: never;
}) {
    return (
        <span className="flex h-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 transition group-hover:border-primary/35 group-hover:bg-primary-soft/20">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft/60 text-primary">
                {icon}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-bold text-primary leading-snug">{title}</span>
                {note && <span className="mt-0.5 block truncate text-[11.5px] text-muted-foreground">{note}</span>}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
        </span>
    );
}

/**
 * Shared related-content block resolved from a department slug.
 * Empty relations are fully hidden; every card resolves to a real route.
 */
export function RelatedContent({
    deptSlug,
    excludeBlogSlug,
    className,
}: {
    deptSlug: string | null;
    excludeBlogSlug?: string;
    className?: string;
}) {
    const locale = useLocale();
    const lp = useLocalizedPath();
    const t = COPY[locale];
    const rel = getRelations(deptSlug, locale, { excludeBlogSlug });
    if (!rel) return null;

    const hasAny =
        rel.doctors.length ||
        rel.treatments.length ||
        rel.diseases.length ||
        rel.technologies.length ||
        rel.videos.length ||
        rel.articles.length;
    if (!hasAny) return null;

    return (
        <div className={className}>
            <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg lg:text-xl font-black tracking-tight text-primary">{t.heading}</h2>
                <Link
                    href={lp('/bolum/' + rel.deptSlug)}
                    className="text-[12px] font-bold text-brand-orange hover:underline"
                >
                    {rel.deptName}
                </Link>
            </div>

            <div className="mt-6 space-y-8">
                {rel.doctors.length > 0 && (
                    <Group title={t.doctors}>
                        {rel.doctors.map((d) => (
                            <Link key={d.id} href={lp('/doktor/' + d.id)} className="group">
                                <Card
                                    icon={
                                        d.photo ? (
                                            <img src={d.photo} alt="" className="h-10 w-10 rounded-xl object-cover object-top" />
                                        ) : (
                                            <User className="h-5 w-5" strokeWidth={1.5} />
                                        )
                                    }
                                    title={d.name}
                                    note={d.department}
                                />
                            </Link>
                        ))}
                    </Group>
                )}

                {rel.treatments.length > 0 && (
                    <Group title={t.treatments}>
                        {rel.treatments.map((tr) => (
                            <Link key={tr.slug} href={lp('/tedavi/' + tr.slug)} className="group">
                                <Card icon={<Stethoscope className="h-5 w-5" strokeWidth={1.5} />} title={tr.name} note={tr.department} />
                            </Link>
                        ))}
                    </Group>
                )}

                {rel.diseases.length > 0 && (
                    <Group title={t.diseases}>
                        {rel.diseases.map((d) => (
                            <Link key={d.slug} href={lp('/hastalik/' + d.slug)} className="group">
                                <Card icon={<Activity className="h-5 w-5" strokeWidth={1.5} />} title={d.name} />
                            </Link>
                        ))}
                    </Group>
                )}

                {rel.technologies.length > 0 && (
                    <Group title={t.technologies}>
                        {rel.technologies.map((tech) => (
                            <Link key={tech.slug} href={lp('/teknoloji/' + tech.slug)} className="group">
                                <Card icon={<Cpu className="h-5 w-5" strokeWidth={1.5} />} title={tech.name} note={tech.desc} />
                            </Link>
                        ))}
                    </Group>
                )}

                {rel.videos.length > 0 && (
                    <Group title={t.videos}>
                        {rel.videos.map((v) => (
                            <Link key={v.id} href={lp('/videolar')} className="group">
                                <Card icon={<Play className="h-5 w-5" strokeWidth={1.5} />} title={v.title} note={`${v.category} · ${v.duration}`} />
                            </Link>
                        ))}
                    </Group>
                )}

                {rel.articles.length > 0 && (
                    <Group title={t.articles}>
                        {rel.articles.map((a) => (
                            <Link key={a.slug} href={lp('/saglikli-hayat-rehberi/' + a.slug)} className="group">
                                <Card
                                    icon={<img src={a.cover} alt="" className="h-10 w-10 rounded-xl object-cover" />}
                                    title={a.title}
                                    note={a.category}
                                />
                            </Link>
                        ))}
                    </Group>
                )}
            </div>
        </div>
    );
}
