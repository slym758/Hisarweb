import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight, BookOpen, Briefcase, CalendarDays, ChevronDown, ChevronLeft, Clock,
    GraduationCap, Languages, Mail, MapPin, Navigation, Stethoscope, Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { DetailLeadConversion } from '@/components/site/DetailLeadConversion';
import { RelatedDoctorContent } from '@/components/site/RelatedDoctorContent';
import { siteLayout } from '@/layouts/site-layout';
import { useCurrentPath, useLocale, useLocalizedPath } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { getDoctorById, useHospitals, type Hospital } from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        titleTail: ' | Hisar Hospital',
        descTail: ' Hisar Hospital’da ilk uygun randevu için profili inceleyin.',
        back: 'Tüm Doktorlar',
        notFound: 'Doktor bulunamadı.',
        notFoundLink: '← Doktorlara dön',
        prefixFallback: 'Doktor',
        appointment: 'Randevu Al',
        interests: 'Uzmanlık Alanları',
        hospitalTitle: 'Çalıştığı Hastane',
        directions: 'Yol Tarifi',
        stickyCta: 'Randevu al',
        trustBadges: ['Uzman hekim', 'Hisar Hospital'],
        cvAbout: 'Hakkında',
        cvInterventional: 'Girişimsel Deneyim',
        cvEducation: 'Eğitim',
        cvExperience: 'Mesleki Deneyim',
        cvPublications: 'Yayınlar',
        cvMemberships: 'Üyelikler',
    },
    en: {
        titleTail: ' | Hisar Hospital',
        descTail: ' Review the profile to book the first available appointment at Hisar Hospital.',
        back: 'All Doctors',
        notFound: 'Doctor not found.',
        notFoundLink: '← Back to doctors',
        prefixFallback: 'Doctor',
        appointment: 'Book Appointment',
        interests: 'Areas of Expertise',
        hospitalTitle: 'Hospital',
        directions: 'Directions',
        stickyCta: 'Book',
        trustBadges: ['Specialist physician', 'Hisar Hospital'],
        cvAbout: 'About',
        cvInterventional: 'Interventional Experience',
        cvEducation: 'Education',
        cvExperience: 'Professional Experience',
        cvPublications: 'Publications',
        cvMemberships: 'Memberships',
    },
} as const;

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

/* ───────────────────────── PAGE ───────────────────────── */
export default function DoktorDetay() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const path = useCurrentPath();
    const { id } = usePage().props as unknown as { id: string };

    const doc = getDoctorById(id, locale);
    const hospitals = useHospitals();

    // Hide the global BackToTop FAB on this page — it overlaps the sticky CTA.
    useEffect(() => {
        document.body.setAttribute('data-hide-back-to-top', 'true');
        return () => document.body.removeAttribute('data-hide-back-to-top');
    }, []);

    const [showStickyCta, setShowStickyCta] = useState(false);
    useEffect(() => {
        const onScroll = () => setShowStickyCta(window.scrollY > 280);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!doc) {
        return (
            <>
                <Head title={`404${c.titleTail}`} />
                <div className="container-x py-24 text-center">
                    <p className="text-muted-foreground">{c.notFound}</p>
                    <Link href={lp('/doktorlarimiz')} className="mt-4 inline-flex text-primary font-semibold">
                        {c.notFoundLink}
                    </Link>
                </div>
            </>
        );
    }

    const hospital = hospitals.find((h) => h.slug === doc.hospitalSlug);
    const { prefix, name } = splitName(doc.name);
    const interests = doc.subspecialties;
    const deptSlug = doc.departmentSlug;

    const title = `${doc.name} — ${doc.department}${c.titleTail}`;
    const description = `${doc.name}, ${doc.department}.${c.descTail}`;

    return (
        <>
            <Head title={title}>
                <meta name="description" content={description} />
                <link rel="alternate" hrefLang="tr" href={`https://app.hisarweb.test${path}`} />
                <link rel="alternate" hrefLang="en" href={`https://app.hisarweb.test/en${path}`} />
                <link rel="alternate" hrefLang="x-default" href={`https://app.hisarweb.test${path}`} />
            </Head>

            {/* Reserve space at the bottom of the mobile viewport so the sticky CTA never covers content. */}
            <style>{`
        body[data-hide-back-to-top="true"] [aria-label="Yukarı çık"]{display:none!important}
        @media (max-width: 1023px){
          body:has([data-doctor-sticky-cta]){
            padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>

            {/* Back bar */}
            <div className="border-b border-border/60 bg-surface/60">
                <div className="container-x py-2 lg:py-3">
                    <Link
                        href={lp('/doktorlarimiz')}
                        className="inline-flex items-center gap-1 text-[11px] lg:text-xs font-semibold text-primary/80 hover:text-primary min-h-11 py-2"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" /> {c.back}
                    </Link>
                </div>
            </div>

            <div className="relative bg-gradient-to-b from-primary-soft/30 via-surface/40 to-background">
                <div
                    className="absolute inset-x-0 top-0 h-[420px] lg:h-[380px] pointer-events-none opacity-60 bg-[radial-gradient(circle_at_30%_-20%,rgba(99,102,241,0.16),transparent_60%)]"
                    aria-hidden
                />

                <div className="container-x relative py-4 lg:py-10">
                    <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_340px] items-start">
                        {/* LEFT COLUMN */}
                        <div>
                            {/* ============ HERO ============ */}
                            <section className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                                {/* Mobile: portrait + badges/name side-by-side. Desktop: portrait stays as-is. */}
                                <div className="flex gap-4 md:block">
                                    {/* Portrait */}
                                    <div className="relative shrink-0 w-[150px] h-[150px] md:w-[240px] md:h-auto md:aspect-[4/5] overflow-hidden rounded-2xl bg-surface border border-border/70 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)]">
                                        {doc.photo ? (
                                            <img
                                                src={doc.photo}
                                                alt={doc.name}
                                                className="h-full w-full object-cover"
                                                style={{ objectPosition: '50% 22%' }}
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <Stethoscope className="h-10 w-10 text-primary/25" strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile-only compact identity + trust badges next to portrait */}
                                    <div className="min-w-0 flex-1 md:hidden">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                            {prefix || c.prefixFallback}
                                        </p>
                                        <h1 className="mt-1 text-[1.2rem] font-black tracking-tight text-primary leading-[1.15]">
                                            {name}
                                        </h1>
                                        <Link
                                            href={lp('/bolum/' + deptSlug)}
                                            className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold text-foreground/75 hover:text-brand-orange transition-colors leading-snug"
                                        >
                                            <span className="line-clamp-2">{doc.department}</span>
                                            <ArrowRight className="h-3 w-3 shrink-0" />
                                        </Link>

                                        {/* Trust badges */}
                                        <ul className="mt-2 flex flex-wrap gap-1.5">
                                            {c.trustBadges.map((b) => (
                                                <li
                                                    key={b}
                                                    className="inline-flex items-center rounded-full bg-primary/8 px-2.5 py-1 text-[10.5px] font-semibold text-primary leading-none"
                                                >
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Desktop text side */}
                                <div className="hidden md:block text-left min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-brand-cyan">{prefix || c.prefixFallback}</p>
                                    <h1 className="mt-1 text-[2.4rem] font-black tracking-tight text-primary leading-[1.1]">
                                        {name}
                                    </h1>
                                    <Link
                                        href={lp('/bolum/' + deptSlug)}
                                        className="mt-2 inline-flex items-center gap-1 text-base font-semibold text-foreground/80 hover:text-brand-orange transition-colors"
                                    >
                                        {doc.department}
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>

                                    {(doc.email || (doc.languages && doc.languages.length > 0)) && (
                                        <div className="mt-4 flex flex-col items-start gap-2 text-sm text-foreground/75">
                                            {doc.email && (
                                                <a
                                                    href={`mailto:${doc.email}`}
                                                    className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                                                >
                                                    <Mail className="h-4 w-4 text-brand-orange" />
                                                    <span>{doc.email}</span>
                                                </a>
                                            )}
                                            {doc.languages && doc.languages.length > 0 && (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Languages className="h-4 w-4 text-brand-orange" />
                                                    <span>{doc.languages.join(', ')}</span>
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <AppointmentCTA href={settings.appointment_url} className="min-h-11">
                                            <CalendarDays className="h-4 w-4" /> {c.appointment}
                                        </AppointmentCTA>
                                    </div>
                                </div>
                            </section>

                            {/* Mobile CTA */}
                            <div className="md:hidden mt-4 flex items-stretch gap-2">
                                <AppointmentCTA
                                    href={settings.appointment_url}
                                    className="flex-1 h-[46px] active:brightness-95"
                                >
                                    <CalendarDays className="h-4 w-4" /> {c.appointment}
                                </AppointmentCTA>
                            </div>

                            {/* ============ Content below hero ============ */}
                            <div className="mt-6 lg:mt-12 space-y-3 lg:space-y-4">
                                {/* Interests */}
                                <Card>
                                    <CardHeader icon={Stethoscope} title={c.interests} />
                                    <ul className="mt-3 flex flex-wrap gap-1.5">
                                        {interests.map((s) => (
                                            <li
                                                key={s}
                                                className="rounded-full bg-primary/5 border border-primary/15 px-3 py-1 text-xs font-medium text-primary"
                                            >
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                                {/* Mobile-only: hospital + contact (moved from hero) */}
                                <div className="lg:hidden">
                                    <HospitalCard
                                        hospital={hospital}
                                        title={c.hospitalTitle}
                                        directions={c.directions}
                                        email={doc.email}
                                        languages={doc.languages}
                                    />
                                </div>

                                {/* Full CV — accordions rendered from doc.cv (only sub-sections with data) */}
                                {doc.cv && (
                                    <>
                                        {doc.cv.about.length > 0 && (
                                            <CvSection icon={BookOpen} label={c.cvAbout} defaultOpen>
                                                <div className="space-y-4 text-[15px] leading-[1.75] text-foreground/85">
                                                    {doc.cv.about.map((p) => (
                                                        <p key={p}>{p}</p>
                                                    ))}
                                                </div>
                                            </CvSection>
                                        )}

                                        <CvGroup>
                                            {doc.cv.interventional && doc.cv.interventional.length > 0 && (
                                                <CvSection icon={Stethoscope} label={c.cvInterventional} flat>
                                                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                                                        {doc.cv.interventional.map((s) => (
                                                            <li
                                                                key={s}
                                                                className="flex gap-3 py-2 text-sm text-foreground/85 leading-relaxed border-b border-border/40 last:border-0 sm:[&:nth-last-child(2)]:border-0"
                                                            >
                                                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-orange/70" />
                                                                <span>{s}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CvSection>
                                            )}

                                            {doc.cv.education.length > 0 && (
                                                <CvSection icon={GraduationCap} label={c.cvEducation} flat>
                                                    <CvList items={doc.cv.education} />
                                                </CvSection>
                                            )}

                                            {doc.cv.experience.length > 0 && (
                                                <CvSection icon={Briefcase} label={c.cvExperience} flat>
                                                    <CvList items={doc.cv.experience} />
                                                </CvSection>
                                            )}

                                            {doc.cv.publications && (
                                                <CvSection icon={BookOpen} label={c.cvPublications} flat>
                                                    <p className="text-[15px] leading-[1.75] text-foreground/85">
                                                        {doc.cv.publications}
                                                    </p>
                                                </CvSection>
                                            )}

                                            {doc.cv.memberships.length > 0 && (
                                                <CvSection icon={Users} label={c.cvMemberships} flat>
                                                    <ul className="flex flex-wrap gap-2">
                                                        {doc.cv.memberships.map((m) => (
                                                            <li
                                                                key={m}
                                                                className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs font-semibold text-foreground/80"
                                                            >
                                                                {m}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CvSection>
                                            )}
                                        </CvGroup>
                                    </>
                                )}

                                <RelatedDoctorContent doctor={doc} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN — sticky sidebar (desktop only) */}
                        <aside className="hidden lg:block space-y-4 lg:sticky lg:top-36 self-start">
                            {hospital && (
                                <Card>
                                    <CardHeader icon={MapPin} title={c.hospitalTitle} />
                                    <div className="mt-3">
                                        <p className="text-sm font-bold text-primary">{hospital.name}</p>
                                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                            {hospital.address}
                                        </p>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/25 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5 transition min-h-11"
                                        >
                                            <Navigation className="h-3.5 w-3.5" /> {c.directions}
                                        </a>
                                    </div>
                                </Card>
                            )}
                        </aside>
                    </div>
                </div>
            </div>

            {/* ============ Mobile sticky bottom bar — max 64px, safe-area aware ============ */}
            <div
                data-doctor-sticky-cta
                className={`lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur transition-transform duration-300 ${
                    showStickyCta ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                <div className="flex h-[64px] items-center justify-between gap-3 px-4">
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {prefix || c.prefixFallback}
                        </p>
                        <p className="text-sm font-bold text-primary leading-tight truncate">
                            {name}
                        </p>
                    </div>
                    <a
                        href={settings.appointment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand-orange px-4 h-11 text-sm font-bold text-brand-orange-foreground active:brightness-95 transition"
                    >
                        <CalendarDays className="h-4 w-4" /> {c.stickyCta}
                    </a>
                </div>
            </div>

            <DetailLeadConversion pageTitle={doc.name} pageType="doctor" />
        </>
    );
}

DoktorDetay.layout = siteLayout;

/* ---------- Hospital card (mobile flow, includes email/lang when present) ---------- */
function HospitalCard({
    hospital,
    title,
    directions,
    email,
    languages,
}: {
    hospital?: Hospital;
    title: string;
    directions: string;
    email?: string;
    languages?: string[];
}) {
    if (!hospital) return null;
    return (
        <Card>
            <CardHeader icon={MapPin} title={title} />
            <div className="mt-3">
                <p className="text-sm font-bold text-primary">{hospital.name}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{hospital.address}</p>
            </div>
            <div className="mt-3">
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/25 px-3 h-11 text-xs font-semibold text-primary hover:bg-primary/5 transition"
                >
                    <Navigation className="h-3.5 w-3.5" /> {directions}
                </a>
            </div>
            {(email || (languages && languages.length > 0)) && (
                <dl className="mt-3 space-y-1.5 text-[13px] text-foreground/80 border-t border-border/50 pt-3">
                    {email && (
                        <div className="flex items-center gap-2 min-w-0">
                            <Mail className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                            <a href={`mailto:${email}`} className="truncate hover:text-primary">
                                {email}
                            </a>
                        </div>
                    )}
                    {languages && languages.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Languages className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                            <span>{languages.join(', ')}</span>
                        </div>
                    )}
                </dl>
            )}
        </Card>
    );
}

/* ---------- tiny card helpers ---------- */
function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl bg-card border border-border/60 p-4 lg:p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {children}
        </div>
    );
}
function CardHeader({ icon: Icon, title }: { icon: typeof Clock; title: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-sm lg:text-base font-bold text-primary">{title}</h2>
        </div>
    );
}

/* ---------- Accessible accordion (button + aria-expanded) ---------- */
function CvSection({
    icon: Icon,
    label,
    title,
    defaultOpen = false,
    flat = false,
    children,
}: {
    icon: typeof Clock;
    label: string;
    title?: string;
    defaultOpen?: boolean;
    /** Tek kutu içinde satır olarak render edilir (kendi kartı olmaz). */
    flat?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const heading = title ?? label;
    return (
        <div
            className={
                flat
                    ? 'border-b border-border/50 last:border-0'
                    : `rounded-2xl bg-card border border-border/60 transition ${
                          open ? 'shadow-[0_2px_20px_-8px_oklch(0.28_0.16_268/0.12)]' : ''
                      }`
            }
        >
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className={`w-full flex items-center gap-3 text-left min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 ${
                    flat ? 'px-4 py-4 lg:px-5' : 'p-4 lg:p-5 rounded-2xl'
                }`}
            >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                    <h2 className="text-base lg:text-lg font-bold text-primary leading-tight truncate">{heading}</h2>
                </div>
                <ChevronDown
                    className={`shrink-0 h-5 w-5 text-brand-orange transition-transform ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                />
            </button>
            {open && (
                <div className={flat ? 'px-4 pb-5 lg:px-5 -mt-1' : 'px-4 pb-5 lg:px-5 lg:pb-6 -mt-1'}>{children}</div>
            )}
        </div>
    );
}

/** 5 CV bölümünü tek kutuda toplayan kapsayıcı. */
function CvGroup({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl bg-card border border-border/60 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {children}
        </div>
    );
}

function CvList({ items }: { items: string[] }) {
    return (
        <ul className="divide-y divide-border/50">
            {items.map((s) => (
                <li key={s} className="flex gap-3 py-2.5 text-sm text-foreground/85 leading-relaxed">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-orange/70" />
                    <span>{s}</span>
                </li>
            ))}
        </ul>
    );
}
