import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from '@inertiajs/react';
import {
    Microscope, Dna, Radiation, Syringe, Pill, Droplets, Scissors, Atom, Wind,
    HeartHandshake, HandHeart, Users, Building2, ClipboardCheck, ArrowRight, Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';

type StageKey = 'TANI' | 'TEDAVI' | 'TAKIP';

/* Static (locale-independent) scaffolding — text lives in COPY. */
const STAGE_KEYS: StageKey[] = ['TANI', 'TEDAVI', 'TAKIP'];
const STAGE_STEPS = ['01', '02', '03'] as const;
const STAGE_UNIT_ICONS: LucideIcon[][] = [
    [Microscope, Dna, Syringe, Atom],
    [Pill, Radiation, Scissors, Droplets],
    [HeartHandshake, HandHeart, Wind, Users],
];
const BENEFIT_ICONS: LucideIcon[] = [Building2, ClipboardCheck, Sparkles];

const COPY = {
    tr: {
        sectionAria: 'Hasta Yolculuğu',
        eyebrow: 'Hasta Yolculuğu',
        title: 'Tanıdan takibe, tek çatı altında',
        intro:
            "Bütünleşik Onkoloji'de hastalar; tanı, tedavi ve takip aşamalarını tek bir merkezde, aynı ekiple ve kesintisiz bir akış içinde tamamlar.",
        stagesAria: 'Hasta yolculuğu aşamaları',
        stageWord: 'Aşama',
        randevuAl: 'Randevu Al',
        siziArayalim: 'Sizi Arayalım',
        ekibiInceleyin: 'Uzman ekibimizi inceleyin',
        benefits: [
            { title: 'Tek Çatı Altında', desc: 'İhtiyaç duyduğunuz tüm branşlar aynı merkezde koordineli çalışır. Merkez değiştirmeniz gerekmez.' },
            { title: 'Tümör Konseyi', desc: 'Multidisipliner ekip her vakayı birlikte değerlendirir.' },
            { title: 'Kişiye Özel Plan', desc: 'Genetik ve moleküler profilleme ile hedefe yönelik tedavi.' },
        ],
        stages: [
            {
                title: 'Tanı',
                headline: 'Doğru tanı, doğru başlangıç',
                paragraphs: [
                    'Patoloji, moleküler testler ve görüntülemenin tamamı aynı kampüste yapılır. Başka bir merkeze gitmeniz gerekmez.',
                    "Sonuçlarınız Tümör Konseyi'nde değerlendirilir; tedavi planınızı tek bir hekim değil, ilgili tüm branşlar birlikte belirler.",
                ],
                units: [
                    { label: 'Onkolojik Tanı', desc: 'Patoloji ve laboratuvar incelemeleri' },
                    { label: 'Tıbbi Genetik', desc: 'Kalıtsal risk ve moleküler testler' },
                    { label: 'Girişimsel Onkoloji', desc: 'Görüntüleme eşliğinde biyopsi ve girişimler' },
                    { label: 'PET / Nükleer Tıp', desc: 'Hastalığın yaygınlığını gösteren görüntüleme' },
                ],
            },
            {
                title: 'Tedavi',
                headline: 'Ekip halinde tedavi',
                paragraphs: [
                    'Medikal, cerrahi ve radyasyon onkolojisi ekipleri sizin için eş zamanlı çalışır. Tedaviniz tek bir yöntem değil, ihtiyacınıza göre tasarlanmış bir plandır.',
                    'Hedefe yönelik tedaviler, immünoterapi, robotik cerrahi ve MR-LINAC gibi ileri teknolojiler aynı çatı altında sizi bekler.',
                ],
                units: [
                    { label: 'Medikal Onkoloji', desc: 'Kemoterapi, immünoterapi ve hedefli tedaviler' },
                    { label: 'Radyasyon Onkolojisi', desc: 'MR-LINAC ile hassas ışın tedavisi' },
                    { label: 'Onkolojik Cerrahi', desc: 'Robotik ve minimal invaziv ameliyatlar' },
                    { label: 'Hematolojik Onkoloji', desc: 'Kan ve lenf sistemi kanserleri' },
                ],
            },
            {
                title: 'Takip & Destek',
                headline: 'Tedavi bittikten sonra da yanınızdayız',
                paragraphs: [
                    'Tedavi sonrasında düzenli kontrollerle iyileşme süreciniz izlenir. Yeni bir belirti olduğunda doğrudan ekibinize ulaşabilirsiniz.',
                    'Beslenme, fizyoterapi, psikoonkoloji ve moral takımı; yaşam kalitenizi tedavi kadar önemser.',
                ],
                units: [
                    { label: 'Destekleyici Bakım', desc: 'Beslenme, fizyoterapi ve psikoonkoloji desteği.' },
                    { label: 'Palyatif Bakım', desc: 'Tanı anından itibaren ağrı, semptom ve yan etki yönetimi. Tedavinizle birlikte yürür.' },
                    { label: 'Hiperbarik Oksijen', desc: 'Doku iyileşmesini destekleyen tedavi.' },
                    { label: 'Moral Takımı', desc: 'Psikoonkoloji ve sosyal destek ekibi.' },
                ],
            },
        ],
    },
    en: {
        sectionAria: 'Patient Journey',
        eyebrow: 'Patient Journey',
        title: 'From diagnosis to follow-up, under one roof',
        intro:
            'At Integrated Oncology, patients complete the diagnosis, treatment and follow-up stages in a single center, with the same team and in an uninterrupted flow.',
        stagesAria: 'Patient journey stages',
        stageWord: 'Stage',
        randevuAl: 'Book Appointment',
        siziArayalim: 'We Call You',
        ekibiInceleyin: 'Meet our expert team',
        benefits: [
            { title: 'Under One Roof', desc: 'Every specialty you need works in coordination at the same center. You do not need to change centers.' },
            { title: 'Tumor Board', desc: 'A multidisciplinary team evaluates every case together.' },
            { title: 'Personalized Plan', desc: 'Targeted treatment with genetic and molecular profiling.' },
        ],
        stages: [
            {
                title: 'Diagnosis',
                headline: 'The right diagnosis, the right start',
                paragraphs: [
                    'Pathology, molecular tests and imaging are all performed on the same campus. You do not need to go to another center.',
                    'Your results are evaluated at the Tumor Board; your treatment plan is determined not by a single physician but by all the relevant specialties together.',
                ],
                units: [
                    { label: 'Oncologic Diagnosis', desc: 'Pathology and laboratory investigations' },
                    { label: 'Medical Genetics', desc: 'Hereditary risk and molecular testing' },
                    { label: 'Interventional Oncology', desc: 'Image-guided biopsy and interventions' },
                    { label: 'PET / Nuclear Medicine', desc: 'Imaging that shows the extent of the disease' },
                ],
            },
            {
                title: 'Treatment',
                headline: 'Treatment as a team',
                paragraphs: [
                    'Medical, surgical and radiation oncology teams work simultaneously for you. Your treatment is not a single method but a plan designed to your needs.',
                    'Targeted therapies, immunotherapy, robotic surgery and advanced technologies such as MR-LINAC await you under one roof.',
                ],
                units: [
                    { label: 'Medical Oncology', desc: 'Chemotherapy, immunotherapy and targeted therapies' },
                    { label: 'Radiation Oncology', desc: 'Precise radiation therapy with MR-LINAC' },
                    { label: 'Oncologic Surgery', desc: 'Robotic and minimally invasive operations' },
                    { label: 'Hematologic Oncology', desc: 'Cancers of the blood and lymphatic system' },
                ],
            },
            {
                title: 'Follow-up & Support',
                headline: 'We are by your side after treatment ends, too',
                paragraphs: [
                    'After treatment, your recovery is monitored with regular check-ups. When a new symptom arises, you can reach your team directly.',
                    'Nutrition, physiotherapy, psycho-oncology and the morale team care about your quality of life as much as your treatment.',
                ],
                units: [
                    { label: 'Supportive Care', desc: 'Nutrition, physiotherapy and psycho-oncology support.' },
                    { label: 'Palliative Care', desc: 'Pain, symptom and side-effect management from the moment of diagnosis. It runs alongside your treatment.' },
                    { label: 'Hyperbaric Oxygen', desc: 'A treatment that supports tissue healing.' },
                    { label: 'Morale Team', desc: 'Psycho-oncology and social support team.' },
                ],
            },
        ],
    },
} as const;

export function OncologyJourney() {
    const c = COPY[useLocale()];
    const lp = useLocalizedPath();
    const settings = useSettings();
    const [active, setActive] = useState<number>(0);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

    const stages = c.stages.map((s, i) => ({
        key: STAGE_KEYS[i],
        step: STAGE_STEPS[i],
        title: s.title,
        headline: s.headline,
        paragraphs: s.paragraphs,
        units: s.units.map((u, j) => ({ icon: STAGE_UNIT_ICONS[i][j], label: u.label, desc: u.desc })),
    }));
    const benefits = c.benefits.map((b, i) => ({ icon: BENEFIT_ICONS[i], title: b.title, desc: b.desc }));

    const focusTab = (i: number) => {
        const next = (i + stages.length) % stages.length;
        setActive(next);
        tabRefs.current[next]?.focus();
    };

    const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); focusTab(i + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); focusTab(i - 1); }
        else if (e.key === 'Home') { e.preventDefault(); focusTab(0); }
        else if (e.key === 'End') { e.preventDefault(); focusTab(stages.length - 1); }
    };

    const stage = stages[active];

    // rail: solid primary up to and including active step
    const railFillPct = stages.length > 1 ? (active / (stages.length - 1)) * 100 : 0;

    return (
        <section aria-label={c.sectionAria} className="relative rounded-none bg-transparent p-0 ring-0 md:rounded-3xl md:bg-[oklch(0.985_0.008_240)] md:p-8 md:ring-1 md:ring-border/50 lg:p-10">
            {/* Header */}
            <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {c.eyebrow}
                </span>
                <h2 className="mt-3 text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight text-primary">
                    {c.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm lg:text-[15px] text-foreground/80 leading-relaxed">
                    {c.intro}
                </p>
            </div>

            {/* Benefits */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {benefits.map((b) => (
                    <div key={b.title} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background p-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                            <b.icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div>
                            <div className="text-sm font-bold text-primary">{b.title}</div>
                            <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">{b.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== Stepper — Desktop (rail only connects circles; text sits below) ===== */}
            <div className="mt-10 hidden sm:block">
                <div
                    role="tablist"
                    aria-label={c.stagesAria}
                    className="relative"
                >
                    {/* Rail row — circles + line between */}
                    <div className="relative grid grid-cols-3 items-center">
                        {/* rail background — spans only between first and last circle centers */}
                        <div aria-hidden className="pointer-events-none absolute left-[16.6667%] right-[16.6667%] top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-border" />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute left-[16.6667%] top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-primary transition-[width] duration-500 ease-out"
                            style={{ width: `calc((100% - 33.3333%) * ${railFillPct / 100})` }}
                        />

                        {stages.map((s, i) => {
                            const isActive = i === active;
                            return (
                                <div key={s.key} className="relative flex justify-center">
                                    <button
                                        ref={(el) => { tabRefs.current[i] = el; }}
                                        type="button"
                                        role="tab"
                                        id={`journey-tab-${s.key}`}
                                        aria-selected={isActive}
                                        aria-controls={`journey-panel-${s.key}`}
                                        tabIndex={isActive ? 0 : -1}
                                        onClick={() => setActive(i)}
                                        onKeyDown={(e) => onTabKeyDown(e, i)}
                                        aria-label={`${c.stageWord} ${s.step} — ${s.title}`}
                                        className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 text-sm font-black transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                            isActive
                                                ? 'border-primary bg-background text-primary shadow-md'
                                                : 'border-border bg-background text-muted-foreground hover:border-primary/60 hover:bg-primary/5 hover:text-primary'
                                        }`}
                                    >
                                        {s.step}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Labels row — completely outside the rail */}
                    <div className="mt-4 grid grid-cols-3">
                        {stages.map((s, i) => {
                            const isActive = i === active;
                            return (
                                <button
                                    key={`label-${s.key}`}
                                    type="button"
                                    tabIndex={-1}
                                    aria-hidden
                                    onClick={() => setActive(i)}
                                    className="flex flex-col items-center text-center focus:outline-none"
                                >
                                    <div className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {c.stageWord} {s.step}
                                    </div>
                                    <div className={`text-base font-bold ${isActive ? 'text-primary' : 'text-foreground/80'}`}>
                                        {s.title}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ===== Stepper — Mobile (vertical, full-width) ===== */}
            <div className="mt-6 sm:hidden">
                <div role="tablist" aria-label={c.stagesAria} className="overflow-hidden rounded-2xl border border-border/70 bg-background">
                    {stages.map((s, i) => {
                        const isActive = i === active;
                        return (
                            <button
                                key={s.key}
                                ref={(el) => { tabRefs.current[i] = el; }}
                                type="button"
                                role="tab"
                                id={`journey-tab-m-${s.key}`}
                                aria-selected={isActive}
                                aria-controls={`journey-panel-${s.key}`}
                                tabIndex={isActive ? 0 : -1}
                                onClick={() => setActive(i)}
                                onKeyDown={(e) => onTabKeyDown(e, i)}
                                className={`w-full p-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
                                    i > 0 ? 'border-t border-border/70' : ''
                                } ${
                                    isActive ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-surface'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-black ${
                                            isActive ? 'bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/25' : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {s.step}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className={`text-sm font-bold leading-tight ${isActive ? 'text-primary-foreground' : 'text-foreground/85'}`}>
                                            {s.title}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ===== Content panel ===== */}
            <div
                key={`panel-${stage.key}`}
                role="tabpanel"
                id={`journey-panel-${stage.key}`}
                aria-labelledby={`journey-tab-${stage.key}`}
                className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-5 lg:items-start"
            >
                <div className="lg:col-span-2 animate-fade-in">
                    <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight">
                        {stage.headline}
                    </h3>
                    <div className="mt-3 space-y-3 text-sm lg:text-[15px] text-foreground/85 leading-relaxed">
                        {stage.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <AppointmentCTA href={settings.appointment_url}>
                            {c.randevuAl} <ArrowRight className="h-3.5 w-3.5" />
                        </AppointmentCTA>
                        <Link
                            href={lp('/sizi-arayalim')}
                            className="inline-flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-xs font-bold text-primary ring-1 ring-primary/25 hover:ring-primary/60 transition"
                        >
                            {c.siziArayalim}
                        </Link>
                    </div>
                    <div className="mt-3">
                        <Link
                            href={lp('/butunlesik-onkoloji/medikal-kadro')}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary/80 hover:text-primary underline-offset-4 hover:underline"
                        >
                            {c.ekibiInceleyin} <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {stage.units.map((u, idx) => (
                            <div
                                key={u.label}
                                className="group flex items-start gap-3 rounded-2xl border border-border/70 bg-background p-3.5 sm:p-4 sm:min-h-[112px] hover:border-primary/40 transition-all animate-fade-in"
                                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'backwards' }}
                            >
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                    <u.icon className="h-5 w-5" aria-hidden />
                                </span>
                                <div className="min-w-0">
                                    <div className="text-sm font-bold text-primary leading-snug">{u.label}</div>
                                    <div className="mt-0.5 truncate text-[13px] text-muted-foreground leading-snug">{u.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
}
