import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar, RefreshCw, Clock, ArrowRight, CalendarDays, Info, User, Building2, ShieldCheck, ClipboardList, Stethoscope,
} from 'lucide-react';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { BizeUlasin } from '@/components/site/BizeUlasin';
import { AppointmentCTAButton } from '@/components/site/AppointmentCTA';
import { LeadFormDialog } from '@/components/site/LeadFormDialog';
import { RelatedContent } from '@/components/site/RelatedContent';
import { DetailLeadConversion } from '@/components/site/DetailLeadConversion';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath, type Locale } from '@/lib/i18n';
import { useBlogPosts, useDepartments, useDoctors, type BlogPost } from '@/lib/site-data';
import { getDeptSlugForPost } from '@/lib/relations';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        notFound: 'İçerik bulunamadı.',
        allArticles: '← Tüm içerikler',
        headFallbackTitle: 'Sağlıklı Hayat Rehberi — Hisar Hospital',
        headFallbackDesc: 'Hisar Hospital Sağlıklı Hayat Rehberi içeriği.',
        breadcrumbGuide: 'Sağlıklı Hayat Rehberi',
        published: 'Yayın',
        updated: 'Güncelleme',
        readTime7: '7 dk okuma',
        readTime6: '6 dk okuma',
        expertChecked: 'Uzman kontrolünden geçmiştir',
        benzerIcerikler: 'Benzer İçerikler',
        ilgiliBolum: 'İlgili Bölüm',
        infoLabel: 'Bilgi',
        infoBody: 'Bu içerik yalnızca bilgilendirme amaçlıdır ve tıbbi tanı-tedavi yerine geçmez. Şikâyetleriniz için mutlaka bir hekimden değerlendirme alın.',
        bolumDoktorlari: 'Bölüm Doktorları',
        bolumDoktorlariSub: (dept: string) => `${dept} için Hisar Hospital uzman kadrosu.`,
        randevuLabel: 'Randevu',
        randevuTitle: 'Uzmanımıza danışın',
        randevuSub: 'Uzman hekimlerimizle hızlıca görüşün.',
        randevuAl: 'Randevu Al',
        tumDoktorlar: 'Tüm Doktorlar',
        bizeUlasinTitle: (title: string) => `"${title}" hakkında bilgi alın`,
        bizeUlasinSub: 'Sorularınız için formu doldurun; ekibimiz kısa süre içinde sizi arasın.',
        leadTitle: 'Randevu / değerlendirme talebi',
        leadSubtitle: (title: string) => `"${title}" içeriği üzerinden talebinizi iletin; ekibimiz sizi arasın.`,
        yazar: 'Yazar',
        noBodyNoteLabel: 'Bilgi',
        noBodyNote: 'Bu konuda ayrıntılı değerlendirme ve bilgi için uzman hekimlerimizle görüşebilir, randevu talebi oluşturabilirsiniz.',
    },
    en: {
        notFound: 'Content not found.',
        allArticles: '← All articles',
        headFallbackTitle: 'Healthy Living Guide — Hisar Hospital',
        headFallbackDesc: 'Hisar Hospital Healthy Living Guide content.',
        breadcrumbGuide: 'Healthy Living Guide',
        published: 'Published',
        updated: 'Updated',
        readTime7: '7 min read',
        readTime6: '6 min read',
        expertChecked: 'Reviewed by a specialist',
        benzerIcerikler: 'Similar Articles',
        ilgiliBolum: 'Related Department',
        infoLabel: 'Information',
        infoBody: 'This content is for informational purposes only and is not a substitute for medical diagnosis or treatment. For your complaints, be sure to get an evaluation from a physician.',
        bolumDoktorlari: 'Department Doctors',
        bolumDoktorlariSub: (dept: string) => `Hisar Hospital's expert team for ${dept}.`,
        randevuLabel: 'Appointment',
        randevuTitle: 'Consult our specialist',
        randevuSub: 'Consult our expert physicians quickly.',
        randevuAl: 'Book Appointment',
        tumDoktorlar: 'All Doctors',
        bizeUlasinTitle: (title: string) => `Get information about "${title}"`,
        bizeUlasinSub: 'Fill out the form for your questions; our team will call you shortly.',
        leadTitle: 'Appointment / evaluation request',
        leadSubtitle: (title: string) => `Submit your request through the "${title}" content; our team will call you.`,
        yazar: 'Author',
        noBodyNoteLabel: 'Information',
        noBodyNote: 'For a detailed evaluation and information on this topic, you can consult our specialist physicians and create an appointment request.',
    },
} as const;

/* ───────────────────────── PAGE ───────────────────────── */
export default function RehberDetay() {
    const { slug } = usePage().props as unknown as { slug: string };
    const locale = useLocale();
    const c = COPY[locale];
    const post = useBlogPosts().find((p) => p.slug === slug);

    const title = post ? `${post.title} — Hisar Hospital` : c.headFallbackTitle;
    const desc = post?.excerpt ?? c.headFallbackDesc;

    return (
        <>
            <Head title={title}>
                <meta name="description" content={desc} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={desc} />
                {post && <meta property="og:image" content={post.cover} />}
                {/* Per-locale SEO alternates. */}
                <link rel="alternate" hrefLang="tr" href={`https://app.hisarweb.test/saglikli-hayat-rehberi/${slug}`} />
                <link rel="alternate" hrefLang="en" href={`https://app.hisarweb.test/en/saglikli-hayat-rehberi/${slug}`} />
                <link rel="alternate" hrefLang="x-default" href={`https://app.hisarweb.test/saglikli-hayat-rehberi/${slug}`} />
            </Head>

            {!post ? (
                <NotFound />
            ) : post.body && post.body.length > 0 ? (
                <ArticleWithBody post={post} />
            ) : (
                <ArticleWithoutBody post={post} />
            )}
        </>
    );
}

RehberDetay.layout = siteLayout;

/* ───────────────────────── NOT FOUND ───────────────────────── */
function NotFound() {
    const c = COPY[useLocale()];
    const lp = useLocalizedPath();
    return (
        <div className="container-x py-24 text-center">
            <p className="text-muted-foreground">{c.notFound}</p>
            <Link href={lp('/saglikli-hayat-rehberi')} className="mt-4 inline-flex text-primary font-semibold">
                {c.allArticles}
            </Link>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Full article — used when the post has an authored `body` (bilingual)      */
/* -------------------------------------------------------------------------- */
function ArticleWithBody({ post }: { post: BlogPost }) {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const [leadOpen, setLeadOpen] = useState(false);
    const departments = useDepartments();
    const doctors = useDoctors();
    const posts = useBlogPosts();
    const categoryLabel = (cat: string) => departments.find((d) => d.slug === cat)?.name ?? cat;

    const deptSlug = getDeptSlugForPost(post, locale);
    const dept = departments.find((d) => d.slug === deptSlug) ?? departments[0];
    const deptDoctors = doctors.filter((d) => d.departmentSlug === dept.slug).slice(0, 4);
    const body = post.body ?? [];

    return (
        <>
            <Breadcrumb items={[{ label: c.breadcrumbGuide, to: '/saglikli-hayat-rehberi' }, { label: post.title }]} />

            <section className="container-x py-6 lg:py-10">
                <div className="max-w-5xl">
                    <Link
                        href={lp('/saglikli-hayat-rehberi')}
                        className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-widest text-brand-orange"
                    >
                        <span className="h-[2px] w-6 bg-brand-orange" /> {categoryLabel(post.category)}
                    </Link>
                    <h1 className="mt-3 text-2xl lg:text-[2.6rem] font-black text-primary tracking-tight leading-tight">
                        {post.title}
                    </h1>
                    <p className="mt-4 text-sm lg:text-lg text-muted-foreground leading-relaxed max-w-4xl">
                        {post.excerpt}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {c.published}: {formatDate(post.date, locale)}</span>
                        <span className="inline-flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> {c.updated}: {formatDate(post.date, locale)}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {c.readTime7}</span>
                        <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-brand-cyan" /> {c.expertChecked}</span>
                    </div>
                </div>
            </section>

            <section className="container-x pb-16 lg:pb-24 grid lg:grid-cols-[1fr_300px] gap-10">
                <article className="min-w-0 max-w-3xl">
                    <div className="rounded-2xl overflow-hidden border border-border">
                        {/* TODO: real asset — cover comes from content-data (post.cover). */}
                        <img src={post.cover} alt={post.title} className="w-full aspect-[16/9] object-cover" />
                    </div>

                    <div className="mt-8 space-y-5 text-[15px] leading-[1.85] text-foreground/85">
                        {body.map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}

                        <div className="rounded-2xl border border-primary/20 bg-primary-soft/50 p-4 lg:p-5">
                            <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-primary">
                                <Info className="h-4 w-4" /> {c.infoLabel}
                            </p>
                            <p className="mt-1 text-[14px] text-primary/90 leading-relaxed">
                                {c.infoBody}
                            </p>
                        </div>
                    </div>

                    {/* Bölüm Doktorları — bottom placement */}
                    {deptDoctors.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-lg lg:text-xl font-black text-primary tracking-tight">{c.bolumDoktorlari}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{c.bolumDoktorlariSub(dept.name)}</p>
                            <div className="mt-4 grid sm:grid-cols-2 gap-3">
                                {deptDoctors.map((d) => (
                                    <Link key={d.id} href={lp('/doktor/' + d.id)} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover-lift">
                                        <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border">
                                            {d.photo ? (
                                                <img src={d.photo} alt={d.name} className="h-full w-full object-cover object-top" />
                                            ) : (
                                                <User className="h-4 w-4 m-auto text-primary/50" />
                                            )}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13.5px] font-bold text-primary leading-tight truncate">{d.name}</p>
                                            <p className="text-[11.5px] text-muted-foreground truncate">{d.department}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-12">
                        <BizeUlasin
                            title={c.bizeUlasinTitle(post.title)}
                            subtitle={c.bizeUlasinSub}
                            context={post.title}
                        />
                    </div>

                    <div className="mt-12">
                        <h3 className="text-lg font-black text-primary tracking-tight">{c.benzerIcerikler}</h3>
                        <div className="mt-4 grid sm:grid-cols-2 gap-4">
                            {posts.filter((p) => p.slug !== post.slug).slice(0, 2).map((rel) => (
                                <Link
                                    key={rel.slug}
                                    href={lp('/saglikli-hayat-rehberi/' + rel.slug)}
                                    className="group rounded-2xl overflow-hidden border border-border bg-card hover-lift"
                                >
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img src={rel.cover} alt={rel.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                                    </div>
                                    <div className="p-4">
                                        <p className="text-[11px] font-bold text-brand-orange">{categoryLabel(rel.category)}</p>
                                        <h4 className="mt-1 text-[13.5px] font-bold text-primary leading-snug line-clamp-2 group-hover:text-brand-orange transition">
                                            {rel.title}
                                        </h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </article>

                <aside>
                    <div className="lg:sticky lg:top-36 space-y-4">
                        <div className="rounded-2xl border border-border bg-card p-5">
                            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" /> {c.ilgiliBolum}
                            </p>
                            <Link
                                href={lp('/bolum/' + dept.slug)}
                                className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-primary-soft/60 hover:bg-primary-soft p-3 transition"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                                        <dept.icon className="h-5 w-5" strokeWidth={1.5} />
                                    </span>
                                    <p className="text-[13px] font-bold text-primary truncate">{dept.name}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-primary" />
                            </Link>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-brand-orange">{c.randevuLabel}</p>
                            <h3 className="mt-1 text-lg font-black text-primary leading-tight">{c.randevuTitle}</h3>
                            <p className="mt-1.5 text-[13px] text-muted-foreground">
                                {c.randevuSub}
                            </p>
                            <AppointmentCTAButton
                                onClick={() => setLeadOpen(true)}
                                className="mt-3 h-11 w-full"
                            >
                                <CalendarDays className="h-4 w-4" /> {c.randevuAl}
                            </AppointmentCTAButton>
                            <Link
                                href={lp('/doktorlarimiz')}
                                className="mt-2 flex items-center justify-center gap-1.5 rounded-full border border-border h-11 text-sm font-semibold text-primary hover:border-primary/40"
                            >
                                <Stethoscope className="h-4 w-4" /> {c.tumDoktorlar}
                            </Link>
                        </div>
                    </div>
                </aside>
            </section>

            <section className="container-x pb-12">
                <RelatedContent deptSlug={dept.slug} excludeBlogSlug={post.slug} />
            </section>

            <DetailLeadConversion pageTitle={post.title} pageType="disease" />

            <LeadFormDialog
                open={leadOpen}
                onClose={() => setLeadOpen(false)}
                title={c.leadTitle}
                subtitle={c.leadSubtitle(post.title)}
                context={post.title}
            />
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*  Fallback article — used when the post has no authored `body`.             */
/*  Renders the excerpt plus a short bilingual note (no fabricated content).  */
/* -------------------------------------------------------------------------- */
function ArticleWithoutBody({ post }: { post: BlogPost }) {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const departments = useDepartments();
    const doctors = useDoctors();
    const categoryLabel = (cat: string) => departments.find((d) => d.slug === cat)?.name ?? cat;

    const deptSlug = getDeptSlugForPost(post, locale);
    const dept =
        departments.find((d) => d.slug === deptSlug) ??
        departments.find((d) =>
            post.category.toLocaleLowerCase('tr').includes(d.name.split(' ')[0].toLocaleLowerCase('tr')),
        ) ?? departments[0];
    const author = doctors.find((d) => d.departmentSlug === dept.slug && d.photo) ?? doctors.find((d) => d.photo) ?? doctors[0];
    const related = useBlogPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

    return (
        <>
            <Breadcrumb items={[{ label: c.breadcrumbGuide, to: '/saglikli-hayat-rehberi' }, { label: post.title }]} />

            <section className="container-x py-6 lg:py-10">
                <div className="max-w-3xl">
                    <Link href={lp('/saglikli-hayat-rehberi')} className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-widest text-brand-orange">
                        <span className="h-[2px] w-6 bg-brand-orange" /> {categoryLabel(post.category)}
                    </Link>
                    <h1 className="mt-3 text-2xl lg:text-4xl font-black text-primary tracking-tight leading-tight">
                        {post.title}
                    </h1>
                    <p className="mt-3 text-sm lg:text-base text-muted-foreground leading-relaxed">{post.excerpt}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {c.published}: {formatDate(post.date, locale)}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {c.readTime6}</span>
                    </div>
                </div>
            </section>

            <section className="container-x pb-16 lg:pb-24 grid lg:grid-cols-[1fr_300px] gap-10">
                <article className="min-w-0 max-w-3xl">
                    <div className="rounded-2xl overflow-hidden border border-border">
                        {/* TODO: real asset — cover comes from content-data (post.cover). */}
                        <img src={post.cover} alt={post.title} className="w-full aspect-[16/9] object-cover" />
                    </div>

                    <div className="mt-8 space-y-5 text-[15px] leading-[1.85] text-foreground/85">
                        <p>{post.excerpt}</p>

                        <div className="rounded-2xl border border-primary/20 bg-primary-soft/50 p-4 lg:p-5">
                            <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-primary">
                                <Info className="h-4 w-4" /> {c.noBodyNoteLabel}
                            </p>
                            <p className="mt-1 text-[14px] text-primary/90 leading-relaxed">
                                {c.noBodyNote}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-lg font-black text-primary tracking-tight">{c.benzerIcerikler}</h3>
                        <div className="mt-4 grid sm:grid-cols-3 gap-4">
                            {related.map((rel) => (
                                <Link key={rel.slug} href={lp('/saglikli-hayat-rehberi/' + rel.slug)} className="group rounded-2xl overflow-hidden border border-border bg-card hover-lift">
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img src={rel.cover} alt={rel.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                                    </div>
                                    <div className="p-4">
                                        <p className="text-[11px] font-bold text-brand-orange">{categoryLabel(rel.category)}</p>
                                        <h4 className="mt-1 text-[13.5px] font-bold text-primary leading-snug line-clamp-2 group-hover:text-brand-orange transition">{rel.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </article>

                <aside>
                    <div className="lg:sticky lg:top-36 space-y-4">
                        <div className="rounded-2xl border border-border bg-card p-5">
                            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" /> {c.ilgiliBolum}
                            </p>
                            <Link href={lp('/bolum/' + dept.slug)} className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-primary-soft/60 hover:bg-primary-soft p-3 transition">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                                        <dept.icon className="h-5 w-5" strokeWidth={1.5} />
                                    </span>
                                    <p className="text-[13px] font-bold text-primary truncate">{dept.name}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-primary" />
                            </Link>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-5">
                            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                <ClipboardList className="h-3.5 w-3.5" /> {c.yazar}
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                                <span className="h-10 w-10 rounded-full overflow-hidden bg-muted ring-1 ring-border">
                                    {author.photo ? <img src={author.photo} alt={author.name} className="h-full w-full object-cover object-top" /> : <User className="h-4 w-4 m-auto" />}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-bold text-primary truncate">{author.name}</p>
                                    <p className="text-[11.5px] text-muted-foreground truncate">{author.department}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            <section className="container-x pb-12">
                <RelatedContent deptSlug={dept.slug} excludeBlogSlug={post.slug} />
            </section>

            <DetailLeadConversion pageTitle={post.title} pageType="disease" />
        </>
    );
}

function formatDate(iso: string, locale: Locale): string {
    try {
        return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
        return iso;
    }
}
