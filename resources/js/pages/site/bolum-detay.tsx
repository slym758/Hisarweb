import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight, CalendarDays, ChevronLeft, ChevronRight, MapPin, Phone, ShieldCheck, Sparkles, Stethoscope, Users,
} from 'lucide-react';
import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { BizeUlasin } from '@/components/site/BizeUlasin';
import { DetailLeadConversion } from '@/components/site/DetailLeadConversion';
import { PageSectionNavigation, type PageSection } from '@/components/site/PageSectionNavigation';
import { siteLayout } from '@/layouts/site-layout';
import { DeptIcon } from '@/components/site/DeptIcon';
import { useCurrentPath, useLocale, useLocalizedPath } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import {
    getBlogPostsForDept, getDepartmentDetail, getDiseasesForDept, getDoctorsForDept, getHospitalsForDept,
    getTreatmentsForDept, getVideosForDept, useDepartments,
} from '@/lib/site-data';
import { cn } from '@/lib/utils';

/* Temporary Unsplash imagery for the technologies grid (no per-tech asset in content-data yet). */
/* TODO: real asset — department technology imagery */
const TECH_IMAGES = [
    'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1200&q=80',
];
function techImage(i: number): string {
    return TECH_IMAGES[i % TECH_IMAGES.length];
}

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        titleSuffix: ' — Hisar Hospital',
        descSuffix: ' bölümü: uzman doktorlar, ileri medikal teknoloji, tedavi yöntemleri ve hasta bilgilendirme kaynakları.',
        back: 'Tüm Bölümler',
        notFound: 'Bölüm bulunamadı.',
        notFoundLink: '← Tüm bölümler',
        badgeJci: 'JCI akreditasyon',
        badgeDoctors: 'uzman doktor',
        badgeTech: 'İleri medikal teknoloji',
        appointment: 'Randevu Al',
        phone: '444 5 888',
        aboutTitle: 'Bölüm Hakkında',
        aboutDesc: 'Bölümün kapsamı, yaklaşımı ve öne çıkan hizmetleri.',
        techTitle: 'Medikal Teknolojiler',
        techDesc: 'Bölümde aktif olarak kullanılan öne çıkan cihaz ve yöntemler.',
        treatmentsTitle: 'Tedavi Yöntemleri',
        treatmentsDesc: 'Bölümümüzde uygulanan başlıca tedavi ve girişimler.',
        diseasesTitle: 'İlgilendiği Durumlar',
        diseasesDesc: 'Bölümün tanı ve tedavi kapsamındaki başlıca durumlar.',
        doctorsTitle: 'Bölüm Doktorları',
        doctorsDescLead: '',
        doctorsDescTail: ' bölümünde görev yapan uzman kadromuz.',
        videosTitle: 'İlgili Videolar',
        videosDescLead: '',
        videosDescTail: ' bölümüyle ilgili uzman hekimlerimizden bilgilendirici videolar.',
        blogTitle: 'Sağlıklı Hayat Rehberi',
        blogDesc: 'Bölümle ilgili öne çıkan içerikler.',
        allDoctors: 'Tüm doktorlar',
        allVideos: 'Tüm videolar',
        locationsKicker: 'Lokasyonlar',
        locationsTitle: 'Hangi Hastanelerimizde?',
        locationsDescLead: '',
        locationsDescTail: ' bölümü aşağıdaki lokasyonlarda hizmet vermektedir.',
        locationsCount: (n: number) => `${n} uzman doktor`,
        toc: {
            hakkinda: 'Bölüm Hakkında',
            teknolojiler: 'Medikal Teknolojiler',
            tedaviler: 'Tedavi Yöntemleri',
            hastaliklar: 'İlgilendiği Durumlar',
            doktorlar: 'Bölüm Doktorları',
            videolar: 'İlgili Videolar',
            blog: 'Sağlıklı Hayat Rehberi',
        },
        contactTitleTail: ' Bölümü ile İletişime Geçin',
    },
    en: {
        titleSuffix: ' — Hisar Hospital',
        descSuffix: ' department: expert doctors, advanced medical technology, treatment methods and patient information resources.',
        back: 'All Departments',
        notFound: 'Department not found.',
        notFoundLink: '← All departments',
        badgeJci: 'JCI accreditation',
        badgeDoctors: 'specialist physicians',
        badgeTech: 'Advanced medical technology',
        appointment: 'Book Appointment',
        phone: '444 5 888',
        aboutTitle: 'About the Department',
        aboutDesc: 'The scope, approach and highlighted services of the department.',
        techTitle: 'Medical Technologies',
        techDesc: 'Featured devices and methods actively used in the department.',
        treatmentsTitle: 'Treatment Methods',
        treatmentsDesc: 'The main treatments and procedures performed in our department.',
        diseasesTitle: 'Conditions Covered',
        diseasesDesc: 'The main conditions within the department’s diagnosis and treatment scope.',
        doctorsTitle: 'Department Doctors',
        doctorsDescLead: 'Our specialist team working in the ',
        doctorsDescTail: ' department.',
        videosTitle: 'Related Videos',
        videosDescLead: 'Informative videos from our specialists related to the ',
        videosDescTail: ' department.',
        blogTitle: 'Healthy Living Guide',
        blogDesc: 'Featured content related to the department.',
        allDoctors: 'All doctors',
        allVideos: 'All videos',
        locationsKicker: 'Locations',
        locationsTitle: 'At Which Hospitals?',
        locationsDescLead: 'The ',
        locationsDescTail: ' department is available at the following locations.',
        locationsCount: (n: number) => `${n} specialist physicians`,
        toc: {
            hakkinda: 'About the Department',
            teknolojiler: 'Medical Technologies',
            tedaviler: 'Treatment Methods',
            hastaliklar: 'Conditions Covered',
            doktorlar: 'Department Doctors',
            videolar: 'Related Videos',
            blog: 'Healthy Living Guide',
        },
        contactTitleTail: ' Department — Get in Touch',
    },
} as const;

/* ───────────────────────── PAGE ───────────────────────── */
export default function BolumDetay() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const path = useCurrentPath();
    const { slug } = usePage().props as unknown as { slug: string };

    const dept = useDepartments().find((d) => d.slug === slug);

    if (!dept) {
        return (
            <>
                <Head title={`404${c.titleSuffix}`} />
                <div className="container-x py-24 text-center">
                    <p className="text-muted-foreground">{c.notFound}</p>
                    <Link href={lp('/bolumlerimiz')} className="mt-4 inline-flex text-primary font-semibold">
                        {c.notFoundLink}
                    </Link>
                </div>
            </>
        );
    }

    const detail = getDepartmentDetail(dept.slug, locale);
    const deptDoctors = getDoctorsForDept(dept.slug, locale);
    const deptTreatments = getTreatmentsForDept(dept.slug, locale);
    const deptDiseases = getDiseasesForDept(dept.slug, locale);
    const deptVideos = getVideosForDept(dept.slug, locale);
    const deptBlog = getBlogPostsForDept(dept.slug, locale);
    const deptHospitals = getHospitalsForDept(dept.slug, locale);

    const hasAbout = !!detail?.about?.length;
    const hasTech = !!detail?.technologies?.length;
    const hasSections =
        hasAbout || hasTech || deptTreatments.length > 0 || deptDiseases.length > 0 ||
        deptDoctors.length > 0 || deptVideos.length > 0 || deptBlog.length > 0;

    // Full TOC — PageSectionNavigation keeps only anchors that actually exist in the DOM.
    const tocSections: PageSection[] = [
        { id: 'hakkinda', label: c.toc.hakkinda },
        { id: 'teknolojiler', label: c.toc.teknolojiler },
        { id: 'tedaviler', label: c.toc.tedaviler },
        { id: 'hastaliklar', label: c.toc.hastaliklar },
        { id: 'doktorlar', label: c.toc.doktorlar },
        { id: 'videolar', label: c.toc.videolar },
        { id: 'blog', label: c.toc.blog },
    ];

    const title = `${dept.name}${c.titleSuffix}`;
    const description = `${dept.name}${c.descSuffix}`;

    return (
        <>
            <Head title={title}>
                <meta name="description" content={description} />
                <link rel="alternate" hrefLang="tr" href={`https://app.hisarweb.test${path}`} />
                <link rel="alternate" hrefLang="en" href={`https://app.hisarweb.test/en${path}`} />
                <link rel="alternate" hrefLang="x-default" href={`https://app.hisarweb.test${path}`} />
            </Head>

            {/* Back bar */}
            <div className="border-b border-border/60 bg-surface/60">
                <div className="container-x py-2 lg:py-3">
                    <Link
                        href={lp('/bolumlerimiz')}
                        className="inline-flex items-center gap-1 text-[11px] lg:text-xs font-semibold text-primary/80 hover:text-primary"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" /> {c.back}
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 via-surface to-background border-b border-border/60">
                <div
                    className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_30%_-20%,rgba(99,102,241,0.18),transparent_55%)]"
                    aria-hidden
                />
                <div className="container-x relative py-6 lg:py-12 grid gap-6 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3 lg:gap-4">
                            <span className="flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-border/40 shadow-sm">
                                <DeptIcon dept={dept} className="h-full w-full" strokeWidth={1.5} />
                            </span>
                            <h1 className="text-2xl lg:text-[2.4rem] font-black tracking-tight text-primary leading-[1.1]">
                                {dept.name}
                            </h1>
                        </div>

                        {/* Short lead: single-line description under the title */}
                        <p className="mt-5 max-w-2xl text-sm lg:text-base leading-relaxed text-foreground/85">
                            {dept.blurb}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] lg:text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-brand-cyan" /> {c.badgeJci}</span>
                            {deptDoctors.length > 0 && (
                                <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5 text-brand-cyan" /> {deptDoctors.length} {c.badgeDoctors}</span>
                            )}
                            <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-brand-cyan" /> {c.badgeTech}</span>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <AppointmentCTA href={settings.appointment_url}>
                                <CalendarDays className="h-4 w-4" /> {c.appointment}
                            </AppointmentCTA>
                            <a
                                href="tel:4445888"
                                className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/60 backdrop-blur px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition"
                            >
                                <Phone className="h-4 w-4" /> {c.phone}
                            </a>
                        </div>
                    </div>

                    {/* Desktop TOC lives in the sticky right rail below */}
                </div>
            </section>

            {/* Mobile sticky TOC — persists across the content section */}
            {hasSections && (
                <div className="lg:hidden container-x pt-4">
                    <PageSectionNavigation mobileOnly sections={tocSections} lang={locale} />
                </div>
            )}

            {/* Content grid with sticky right rail */}
            <section className="bg-surface/40 pb-[calc(var(--bottom-nav-h)+5rem)] lg:pb-20">
                <div className="container-x py-8 lg:py-12 grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="min-w-0 space-y-10 lg:space-y-14">

                        {/* Bölüm Hakkında */}
                        {hasAbout ? (
                            <Block id="hakkinda" title={c.aboutTitle} desc={c.aboutDesc}>
                                <div className="space-y-3 max-w-3xl min-w-0">
                                    {detail!.about.map((p, i) => (
                                        <p key={i} className="text-[14.5px] lg:text-base leading-[1.85] text-foreground/85 break-words">
                                            {p}
                                        </p>
                                    ))}
                                </div>
                            </Block>
                        ) : null}

                        {/* Teknolojiler */}
                        {hasTech ? (
                            <Block id="teknolojiler" title={c.techTitle} desc={c.techDesc}>
                                <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                                    {detail!.technologies.map((t, i) => (
                                        <figure
                                            key={t.name}
                                            className="group overflow-hidden rounded-xl bg-card border border-border/60 transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-14px_oklch(0.28_0.16_268/0.22)]"
                                        >
                                            <div className="aspect-[4/3] overflow-hidden bg-primary-soft/40">
                                                {/* Admin-uploaded image; falls back to a placeholder by index. */}
                                                <img
                                                    src={t.image || techImage(i)}
                                                    alt={t.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                                                />
                                            </div>
                                            <figcaption className="px-3 py-2.5 lg:py-3">
                                                <h3 className="text-[13px] lg:text-[14px] font-bold text-primary leading-snug line-clamp-1">{t.name}</h3>
                                                <p className="mt-0.5 text-[11.5px] text-muted-foreground leading-relaxed line-clamp-2">{t.desc}</p>
                                            </figcaption>
                                        </figure>
                                    ))}
                                </div>
                            </Block>
                        ) : null}

                        {/* Tedaviler */}
                        {deptTreatments.length ? (
                            <Block id="tedaviler" title={c.treatmentsTitle} desc={c.treatmentsDesc}>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {deptTreatments.map((t) => (
                                        <Link
                                            key={t.slug}
                                            href={lp('/tedavi/' + t.slug)}
                                            className="group flex items-center gap-3 rounded-2xl bg-card border border-border/70 p-3 pr-4 hover-lift"
                                        >
                                            {/* TODO: real asset — entity cover from content-data */}
                                            <img src={t.cover} alt={t.name} loading="lazy" className="h-16 w-20 rounded-xl object-cover" />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[15px] font-bold text-primary leading-tight">{t.name}</h3>
                                                <p className="text-[12px] italic text-brand-cyan mt-0.5">{t.department}</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                                        </Link>
                                    ))}
                                </div>
                            </Block>
                        ) : null}

                        {/* Hastalıklar / İlgilenilen Durumlar */}
                        {deptDiseases.length ? (
                            <Block id="hastaliklar" title={c.diseasesTitle} desc={c.diseasesDesc}>
                                <ul className="flex flex-wrap gap-2">
                                    {deptDiseases.map((d) => (
                                        <li key={d.slug}>
                                            <Link
                                                href={lp('/hastalik/' + d.slug)}
                                                className="inline-flex rounded-full bg-white border border-primary/15 px-3 py-1.5 text-xs lg:text-[13px] font-medium text-primary hover:border-primary/40 hover:bg-primary-soft/40 transition"
                                            >
                                                {d.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Block>
                        ) : null}

                        {/* Bölüm Doktorları */}
                        {deptDoctors.length ? (
                            <Block
                                id="doktorlar"
                                title={c.doctorsTitle}
                                desc={`${c.doctorsDescLead}${dept.name}${c.doctorsDescTail}`}
                            >
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {deptDoctors.map((d) => (
                                        <Link
                                            key={d.id}
                                            href={lp('/doktor/' + d.id)}
                                            className={cn(
                                                'group flex items-center gap-3 rounded-2xl bg-card border border-border/70 p-3 hover-lift',
                                            )}
                                        >
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-primary-soft/60 ring-1 ring-primary/10 flex items-center justify-center">
                                                {d.photo ? (
                                                    <img src={d.photo} alt={d.name} className="h-full w-full object-cover object-top" />
                                                ) : (
                                                    <Stethoscope className="h-5 w-5 text-primary/40" strokeWidth={1.5} />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[14px] font-bold text-primary leading-tight line-clamp-2">{d.name}</p>
                                                <p className="mt-0.5 text-[11.5px] text-muted-foreground line-clamp-1">{d.department}</p>
                                                {d.subspecialties?.length ? (
                                                    <p className="mt-0.5 text-[11px] italic text-brand-cyan line-clamp-1">{d.subspecialties[0]}</p>
                                                ) : null}
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href={lp('/doktorlarimiz')}
                                        className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-white px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/5"
                                    >
                                        {c.allDoctors} <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </Block>
                        ) : null}

                        {/* İlgili Videolar */}
                        {deptVideos.length ? (
                            <Block
                                id="videolar"
                                title={c.videosTitle}
                                desc={`${c.videosDescLead}${dept.name}${c.videosDescTail}`}
                            >
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {deptVideos.map((v) => (
                                        <Link
                                            key={v.id}
                                            href={lp('/videolar')}
                                            className="group rounded-2xl bg-card border border-border/70 overflow-hidden hover-lift"
                                        >
                                            <div className="relative aspect-video bg-primary/90 grid place-items-center">
                                                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-orange text-brand-orange-foreground shadow-orange transition group-hover:scale-105">
                                                    <Sparkles className="h-4 w-4" aria-hidden />
                                                </span>
                                                <span className="absolute bottom-2 right-2 rounded-full bg-background/95 px-2 py-0.5 text-[11px] font-bold text-primary">
                                                    {v.duration}
                                                </span>
                                            </div>
                                            <div className="p-3.5">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">{v.category}</p>
                                                <h3 className="mt-1 text-[13.5px] font-bold text-primary leading-snug line-clamp-2">{v.title}</h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href={lp('/videolar')}
                                        className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-white px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/5"
                                    >
                                        {c.allVideos} <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </Block>
                        ) : null}

                        {/* Blog / Sağlıklı Hayat Rehberi */}
                        {deptBlog.length ? (
                            <Block id="blog" title={c.blogTitle} desc={c.blogDesc}>
                                <div className="grid gap-3 md:grid-cols-3">
                                    {deptBlog.map((p) => (
                                        <Link
                                            key={p.slug}
                                            href={lp('/saglikli-hayat-rehberi/' + p.slug)}
                                            className="group rounded-2xl bg-card border border-border/70 overflow-hidden hover-lift"
                                        >
                                            <div className="aspect-[16/10] overflow-hidden bg-primary-soft/40">
                                                {/* TODO: real asset — entity cover from content-data */}
                                                <img src={p.cover} alt={p.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
                                            </div>
                                            <div className="p-3.5">
                                                <p className="text-[11px] italic text-brand-cyan">{p.category}</p>
                                                <h3 className="mt-1 text-[14px] font-bold text-primary leading-snug line-clamp-2">{p.title}</h3>
                                                <p className="mt-1 text-[12px] text-muted-foreground line-clamp-2">{p.excerpt}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </Block>
                        ) : null}

                        {/* Contact form — appears on every department detail */}
                        <BizeUlasin
                            title={`${dept.name}${c.contactTitleTail}`}
                            context={dept.name}
                        />
                    </div>

                    {/* Sticky right rail */}
                    <aside className="hidden lg:block">
                        <div className="lg:sticky lg:top-36 space-y-4">

                            {hasSections && <PageSectionNavigation sections={tocSections} lang={locale} />}

                            {deptHospitals.length ? (
                                <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                                    <p className="text-[11px] font-bold tracking-widest uppercase text-brand-orange">{c.locationsKicker}</p>
                                    <h3 className="mt-1 text-lg font-black text-primary leading-tight">
                                        {c.locationsTitle}
                                    </h3>
                                    <p className="mt-1.5 text-[13px] text-muted-foreground">
                                        {c.locationsDescLead}{dept.name}{c.locationsDescTail}
                                    </p>
                                    <div className="mt-4 space-y-3">
                                        {deptHospitals.map(({ hospital, count }) => (
                                            <Link
                                                key={hospital.slug}
                                                href={lp('/hastane/' + hospital.slug)}
                                                className="group flex items-start gap-3 rounded-xl border border-border/70 bg-surface p-3 hover:border-primary/30 transition"
                                            >
                                                {/* TODO: real asset — hospital cover from content-data */}
                                                <img
                                                    src={hospital.cover}
                                                    alt={hospital.name}
                                                    loading="lazy"
                                                    className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-[13px] font-bold text-primary leading-tight truncate group-hover:text-brand-orange transition">
                                                        {hospital.name}
                                                    </h4>
                                                    <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                                                        <MapPin className="inline h-3 w-3 -mt-0.5 mr-0.5" />
                                                        {hospital.area}
                                                    </p>
                                                    {count > 0 ? (
                                                        <p className="mt-0.5 text-[11px] text-brand-cyan italic">{c.locationsCount(count)}</p>
                                                    ) : null}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </aside>
                </div>
            </section>

            <DetailLeadConversion pageTitle={dept.name} pageType="department" />
        </>
    );
}

BolumDetay.layout = siteLayout;

function Block({
    id, title, desc, children,
}: {
    id?: string;
    title: string;
    desc?: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-24">
            <div className="mb-4 lg:mb-5">
                <h2 className="text-xl lg:text-2xl font-black tracking-tight text-primary">
                    {title}
                </h2>
                {desc && <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{desc}</p>}
            </div>
            {children}
        </section>
    );
}
