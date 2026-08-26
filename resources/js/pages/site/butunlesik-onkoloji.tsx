import { Head } from '@inertiajs/react';
import {
    Activity, ArrowRight, HeartPulse, Microscope, Sparkles, Stethoscope, Users, Award, ShieldCheck, Users2, Brain, Apple, Scan, Dna, Syringe, Radiation, FlaskConical, CalendarCheck,
} from 'lucide-react';

import { AppointmentCTA } from '@/components/site/AppointmentCTA';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { OnkolojiSubNav } from '@/components/site/OnkolojiSubNav';
import { BizeUlasin } from '@/components/site/BizeUlasin';
import { OncologyJourney } from '@/components/site/OncologyJourney';
import { OncologyUnitsMatrix } from '@/components/site/OncologyUnitsMatrix';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';
import { useSettings } from '@/lib/settings';

/* ──────────────────── TEMPORARY IMAGERY (Unsplash placeholders) ──────────────────── */
/* TODO: real asset — swap every Unsplash URL below for optimized production assets. */
const ph = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const binaImg = ph('1587351021759-3e566b6af7cc');
const GALLERY_IMAGES = [
    ph('1516549655169-df83a0774514'),
    ph('1587351021759-3e566b6af7cc'),
    ph('1579165466741-7f35e4755660'),
    ph('1512678080530-7760d81faba6'),
    ph('1582719508461-905c673771fd'),
    ph('1512678080530-7760d81faba6'),
    ph('1631815589968-fdb09a223b1e'),
    ph('1576091160399-112ba8d25d1d'),
];

/* Static icon scaffolding — text lives in COPY. */
const HIGHLIGHT_ICONS = [Users, Microscope, HeartPulse, ShieldCheck];
const MEMBER_ICONS = [Apple, Stethoscope, HeartPulse, Activity, Scan, Radiation, Syringe, Dna, Microscope, FlaskConical, Brain];

const COPY = {
    tr: {
        head: {
            title: 'Bütünleşik Onkoloji — Hisar Hospital',
            description: 'Cerrahi, medikal ve radyasyon onkolojisi ekiplerinin ortak yaklaşımı ile bütünleşik kanser tedavisi.',
        },
        badge: 'Bütünleşik Onkoloji',
        heroTitle: 'Kanserde çok yönlü yaklaşım, tek çatı altında.',
        heroDesc:
            "Hisar Hospital Bütünleşik Onkoloji'de tecrübeli ekibimiz ve multidisipliner yaklaşımımızla, dünyadaki en güncel cihaz ve tedavi metotlarını kaliteli, etkin bir hizmet anlayışıyla birleştiriyoruz. Hastalarımızın ve yakınlarının kendilerini evlerinde hissetmelerini ve yaşam kalitelerini korumayı öncelik olarak benimsiyoruz.",
        heroImgAlt: 'Hisar Hospital Bütünleşik Onkoloji Merkezi binası',
        randevuAl: 'Randevu Al',
        breadcrumb: { hospitals: 'Hastanelerimiz', current: 'Bütünleşik Onkoloji' },
        approachTitle: 'Yaklaşımımız',
        approachDesc:
            'Her hasta için tümör konseyimizde bir araya gelen çok disiplinli ekip; tıbbi, cerrahi ve radyoterapi seçeneklerini bir arada değerlendirir. Tanıdan tedaviye ve rehabilitasyona kadar tüm süreç, hasta koordinatörümüz aracılığıyla planlanır ve takip edilir.',
        units: [
            'Onkolojik Tanı',
            'Tıbbi Genetik',
            'Medikal Onkoloji',
            'Girişimsel Onkoloji',
            'Onkolojik Cerrahi',
            'Radyasyon Onkolojisi',
            'Hematolojik Onkoloji',
            'Nükleer Tıp & Radyoaktif İyot',
            'Hiperbarik Oksijen Tedavisi',
            'Çocuk Hematolojisi ve Onkolojisi',
            'Destekleyici Bakım',
            'Palyatif Bakım',
        ],
        unitsAria: (n: number) => `${n} alt birim`,
        council: {
            badge: 'Multidisipliner Yaklaşım',
            title: 'Tümör Konseyi ile doğru karar, doğru tedavi',
            weekly: 'Her hafta düzenli toplanır',
            desc:
                'Her vaka; cerrahi, medikal ve radyasyon onkolojisi başta olmak üzere farklı branşlardan uzmanların bir arada değerlendirdiği tümör konseyinde ele alınır. Hastalarımız her hekime ayrı ayrı başvurmak zorunda kalmaz; tedavi kararı ortak alınır, süreç güvenle ilerler.',
            membersLabel: 'Konseyde yer alan uzmanlar',
            members: [
                'Onkoloji Diyetisyeni',
                'Cerrahi Onkoloji',
                'Medikal Onkoloji',
                'Radyasyon Onkolojisi',
                'Radyoloji',
                'Nükleer Tıp',
                'Girişimsel Onkoloji',
                'Tıbbi Genetik',
                'Patoloji',
                'Hematoloji',
                'Psikoonkolog',
            ],
            membersNote:
                'Onkoloji diyetisyeni ve psikoonkolog dahil; tıbbi tedavinin yanında beslenme ve psikososyal destek de aynı ekipte planlanır.',
            benefits: [
                { n: '01', t: 'Tek başvuru, ortak karar', d: 'Farklı branşlar aynı masada buluşur.' },
                { n: '02', t: 'Kişiye özel plan', d: 'Tanı, evre ve moleküler profile göre.' },
                { n: '03', t: 'Güncel literatür', d: 'Uluslararası kılavuzlar ve son yayınlar.' },
                { n: '04', t: 'Bütüncül destek', d: 'Beslenme ve psikoonkoloji dahildir.' },
            ],
        },
        gallery: {
            eyebrow: 'Merkezimizden',
            title: 'Bütünleşik Onkoloji Merkezi Turu',
            items: [
                { title: 'Merkez Girişi', desc: 'Comprehensive Cancer Center — özel giriş.' },
                { title: 'Karşılama & Danışma', desc: 'Ferah lobi ve hasta yönlendirme birimi.' },
                { title: 'Bekleme Lounge', desc: 'Hastalarımız ve refakatçileri için sakin bekleme alanı.' },
                { title: 'Poliklinik Bekleme', desc: 'Poliklinik katlarında sessiz, konforlu bölümler.' },
                { title: 'Kemoterapi Üniteleri', desc: 'Bireysel kabinlerde güvenli ve mahremiyet odaklı uygulama.' },
                { title: 'MR-LINAC Radyoterapi', desc: 'Görüntü kılavuzluğunda milimetrik doğrulukta ışın tedavisi.' },
                { title: 'Robotik İlaç Hazırlama', desc: 'Sitotoksik ilaçların steril, robotik hazırlanması.' },
                { title: 'Yatış Odaları', desc: 'Doğal ışık alan konforlu tek kişilik hasta odaları.' },
            ],
        },
        highlights: [
            { title: 'Multidisipliner Tümör Konseyi', desc: 'Cerrahi, medikal ve radyasyon onkolojisi ekiplerinin haftalık ortak vaka değerlendirmesi.' },
            { title: 'Kanıta Dayalı Tedavi', desc: 'Güncel klinik kılavuzlar ve moleküler tanı ile kişiye özel tedavi planı.' },
            { title: 'Bütüncül Bakım', desc: 'Tıbbi tedavinin yanında beslenme, psikoonkoloji ve palyatif bakım desteği.' },
            { title: 'Hasta Koordinatörü', desc: 'Tanıdan takibe kadar tek bir yetkili ile kesintisiz süreç yönetimi.' },
        ],
        numbersTitle: 'Rakamlarla Merkezimiz',
        numbers: { years: 'Yıl deneyim', experts: 'Onkoloji uzmanı', subUnits: 'Alt birim', support: 'Hasta desteği' },
        quickTitle: 'Alt Birimlerimize Hızlı Erişim',
    },
    en: {
        head: {
            title: 'Integrated Oncology — Hisar Hospital',
            description: 'Integrated cancer treatment through the joint approach of surgical, medical and radiation oncology teams.',
        },
        badge: 'Integrated Oncology',
        heroTitle: 'A multifaceted approach to cancer, under one roof.',
        heroDesc:
            'At Hisar Hospital Integrated Oncology, with our experienced team and multidisciplinary approach, we combine the world’s most up-to-date devices and treatment methods with a high-quality, effective service philosophy. We adopt as a priority helping our patients and their relatives feel at home and preserving their quality of life.',
        heroImgAlt: 'Hisar Hospital Integrated Oncology Center building',
        randevuAl: 'Book Appointment',
        breadcrumb: { hospitals: 'Our Hospitals', current: 'Integrated Oncology' },
        approachTitle: 'Our Approach',
        approachDesc:
            'For each patient, a multidisciplinary team convening at our tumor board evaluates the medical, surgical and radiotherapy options together. From diagnosis to treatment and rehabilitation, the entire process is planned and followed up through our patient coordinator.',
        units: [
            'Oncologic Diagnosis',
            'Medical Genetics',
            'Medical Oncology',
            'Interventional Oncology',
            'Oncologic Surgery',
            'Radiation Oncology',
            'Hematologic Oncology',
            'Nuclear Medicine & Radioactive Iodine',
            'Hyperbaric Oxygen Therapy',
            'Pediatric Hematology and Oncology',
            'Supportive Care',
            'Palliative Care',
        ],
        unitsAria: (n: number) => `${n} sub-units`,
        council: {
            badge: 'Multidisciplinary Approach',
            title: 'The right decision, the right treatment with the Tumor Board',
            weekly: 'Meets regularly every week',
            desc:
                'Every case is handled at the tumor board, where specialists from different branches — chiefly surgical, medical and radiation oncology — evaluate it together. Our patients do not have to consult each physician separately; the treatment decision is made jointly and the process proceeds safely.',
            membersLabel: 'Specialists on the board',
            members: [
                'Oncology Dietitian',
                'Surgical Oncology',
                'Medical Oncology',
                'Radiation Oncology',
                'Radiology',
                'Nuclear Medicine',
                'Interventional Oncology',
                'Medical Genetics',
                'Pathology',
                'Hematology',
                'Psycho-oncologist',
            ],
            membersNote:
                'Including the oncology dietitian and psycho-oncologist; alongside medical treatment, nutrition and psychosocial support are planned within the same team.',
            benefits: [
                { n: '01', t: 'One application, joint decision', d: 'Different branches meet at the same table.' },
                { n: '02', t: 'Personalized plan', d: 'According to diagnosis, stage and molecular profile.' },
                { n: '03', t: 'Current literature', d: 'International guidelines and the latest publications.' },
                { n: '04', t: 'Holistic support', d: 'Nutrition and psycho-oncology are included.' },
            ],
        },
        gallery: {
            eyebrow: 'From Our Center',
            title: 'Integrated Oncology Center Tour',
            items: [
                { title: 'Center Entrance', desc: 'Comprehensive Cancer Center — private entrance.' },
                { title: 'Reception & Information', desc: 'A spacious lobby and patient guidance unit.' },
                { title: 'Waiting Lounge', desc: 'A calm waiting area for our patients and their companions.' },
                { title: 'Outpatient Waiting', desc: 'Quiet, comfortable sections on the outpatient floors.' },
                { title: 'Chemotherapy Units', desc: 'Safe, privacy-focused administration in individual cabins.' },
                { title: 'MR-LINAC Radiotherapy', desc: 'Image-guided radiation therapy with millimetric accuracy.' },
                { title: 'Robotic Drug Preparation', desc: 'Sterile, robotic preparation of cytotoxic drugs.' },
                { title: 'Inpatient Rooms', desc: 'Comfortable single patient rooms with natural light.' },
            ],
        },
        highlights: [
            { title: 'Multidisciplinary Tumor Board', desc: 'Weekly joint case evaluation by surgical, medical and radiation oncology teams.' },
            { title: 'Evidence-Based Treatment', desc: 'A personalized treatment plan with current clinical guidelines and molecular diagnostics.' },
            { title: 'Holistic Care', desc: 'Alongside medical treatment, support in nutrition, psycho-oncology and palliative care.' },
            { title: 'Patient Coordinator', desc: 'Uninterrupted process management from diagnosis to follow-up with a single point of contact.' },
        ],
        numbersTitle: 'Our Center in Numbers',
        numbers: { years: 'Years of experience', experts: 'Oncology specialists', subUnits: 'Sub-units', support: 'Patient support' },
        quickTitle: 'Quick Access to Our Sub-units',
    },
} as const;

export default function ButunlesikOnkoloji() {
    const locale = useLocale();
    const c = usePageCopy('butunlesik-onkoloji', COPY[locale]);
    const lp = useLocalizedPath();
    const settings = useSettings();

    const units = c.units;
    const highlights = c.highlights.map((h, i) => ({ ...h, icon: HIGHLIGHT_ICONS[i] }));
    const gallery = c.gallery.items.map((g, i) => ({ ...g, src: GALLERY_IMAGES[i] }));
    const members = c.council.members.map((label, i) => ({ label, icon: MEMBER_ICONS[i], wide: i === 0 }));
    const numbers = [
        { k: '20+', v: c.numbers.years },
        { k: '50+', v: c.numbers.experts },
        { k: String(units.length), v: c.numbers.subUnits },
        { k: '24/7', v: c.numbers.support },
    ];

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/butunlesik-onkoloji" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/butunlesik-onkoloji" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/butunlesik-onkoloji" />
            </Head>

            <div className="relative overflow-hidden bg-gradient-primary text-primary-foreground">
                <div className="container-x py-12 lg:py-20 grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden /> {c.badge}
                        </div>
                        <h1 className="mt-3 text-3xl lg:text-5xl font-black leading-tight">
                            {c.heroTitle}
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm lg:text-base text-primary-foreground/85">
                            {c.heroDesc}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <AppointmentCTA href={settings.appointment_url}>{c.randevuAl}</AppointmentCTA>
                            <a href="tel:4445888" className="inline-flex items-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold border border-white/20">444 5 888</a>
                        </div>
                    </div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/20">
                        {/* TODO: real asset */}
                        <img src={binaImg} alt={c.heroImgAlt} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                </div>
            </div>

            <OnkolojiSubNav />

            <div className="container-x pt-6">
                <Breadcrumb items={[{ label: c.breadcrumb.hospitals, to: '/hastanelerimiz' }, { label: c.breadcrumb.current }]} />
            </div>

            <section className="py-10 lg:py-14">
                <div className="container-x">
                    <div>
                        <h2 className="text-2xl font-black text-primary">{c.approachTitle}</h2>
                        <p className="mt-3 text-sm lg:text-base text-foreground/85 leading-relaxed">
                            {c.approachDesc}
                        </p>
                        <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-2.5" aria-label={c.unitsAria(units.length)}>
                            {units.map((unit) => (
                                <li key={unit} className="flex items-start gap-2 text-[12px] sm:text-sm font-medium text-foreground/80 leading-snug">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/45" aria-hidden />
                                    <span>{unit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12">
                    <OncologyUnitsMatrix />
                </div>

                <div className="container-x mt-12">
                    <div className="space-y-12">


                        <OncologyJourney />

                        {/* Tümör Konseyi */}
                        <section aria-labelledby="tumor-konseyi-title" className="relative overflow-hidden rounded-none bg-transparent p-0 md:rounded-3xl md:border md:border-border/70 md:bg-card md:p-8 lg:p-10">
                            <div className="relative">
                                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                                    <Users2 className="h-3.5 w-3.5" aria-hidden /> {c.council.badge}
                                </div>
                                <h2 id="tumor-konseyi-title" className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-primary">
                                    {c.council.title}
                                </h2>
                                <div className="mt-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface px-2.5 py-1 text-[11px] font-semibold text-primary">
                                        <CalendarCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
                                        {c.council.weekly}
                                    </span>
                                </div>
                                <p className="mt-4 max-w-3xl text-sm lg:text-base text-foreground/85 leading-relaxed">
                                    {c.council.desc}
                                </p>
                            </div>

                            {/* Konsey masası — branş listesi */}
                            <div className="relative mt-8">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{c.council.membersLabel}</p>
                                {/* Mobile — compact 2-col list */}
                                <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:hidden">
                                    {members.map((n) => (
                                        <li
                                            key={n.label}
                                            className={`flex items-center gap-2 text-[12px] font-semibold text-primary ${n.wide ? 'col-span-2' : ''}`}
                                        >
                                            <n.icon className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />
                                            <span className="truncate">{n.label}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* Desktop — pill chips */}
                                <div className="mt-3 hidden sm:flex flex-wrap gap-2">
                                    {members.map((n) => (
                                        <span
                                            key={n.label}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface px-3 py-1.5 text-[12px] font-semibold text-primary"
                                        >
                                            <n.icon className="h-3.5 w-3.5" aria-hidden />
                                            {n.label}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-3 text-[12px] text-muted-foreground">
                                    {c.council.membersNote}
                                </p>
                            </div>

                            {/* Faydalar */}
                            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {c.council.benefits.map((b) => (
                                    <li key={b.t} className="rounded-2xl border border-border/60 bg-surface/60 p-4">
                                        <div className="text-[11px] font-black text-primary/70">{b.n}</div>
                                        <p className="mt-1 text-[13px] font-bold text-primary leading-tight">{b.t}</p>
                                        <p className="mt-1 text-[12px] text-muted-foreground leading-snug">{b.d}</p>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6">
                                <AppointmentCTA href={settings.appointment_url}>
                                    {c.randevuAl} <ArrowRight className="h-4 w-4" aria-hidden />
                                </AppointmentCTA>
                            </div>
                        </section>




                        <div>
                            <div className="flex items-end justify-between gap-4 mb-5">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{c.gallery.eyebrow}</p>
                                    <h2 className="mt-1 text-2xl font-black text-primary">{c.gallery.title}</h2>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                                <figure className="col-span-2 lg:row-span-2 relative overflow-hidden rounded-2xl border border-border/70 aspect-[4/3] lg:aspect-auto group">
                                    {/* TODO: real asset */}
                                    <img src={gallery[0].src} alt={gallery[0].title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                                    <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white">
                                        <p className="text-sm font-bold drop-shadow">{gallery[0].title}</p>
                                        <p className="text-[12px] text-white/90 drop-shadow">{gallery[0].desc}</p>
                                    </figcaption>
                                </figure>
                                {gallery.slice(1).map((g) => (
                                    <figure key={g.title} className="group">
                                        <div className="relative overflow-hidden rounded-2xl border border-border/70 aspect-[4/3]">
                                            {/* TODO: real asset */}
                                            <img src={g.src} alt={g.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" />
                                            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                                            <figcaption className="absolute inset-x-0 bottom-0 p-3 text-white">
                                                <p className="text-[13px] font-bold leading-tight drop-shadow">{g.title}</p>
                                            </figcaption>
                                        </div>
                                        <p className="mt-2 px-0.5 text-[12px] text-muted-foreground leading-snug">{g.desc}</p>
                                    </figure>
                                ))}
                            </div>
                        </div>


                        <div className="grid sm:grid-cols-2 gap-4">
                            {highlights.map((h) => (
                                <article key={h.title} className="hover-lift rounded-2xl border border-border/70 bg-gradient-card p-5">
                                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft">
                                        <h.icon className="h-5 w-5 text-primary" aria-hidden />
                                    </span>
                                    <h3 className="mt-3 text-[15px] font-bold text-primary">{h.title}</h3>
                                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
                                </article>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-card p-6 lg:p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft">
                                    <Award className="h-5 w-5 text-primary" aria-hidden />
                                </span>
                                <h3 className="text-lg font-bold text-primary">{c.numbersTitle}</h3>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {numbers.map((n) => (
                                    <div key={n.v} className="rounded-xl bg-surface p-4 text-center">
                                        <div className="text-2xl lg:text-3xl font-black text-primary">{n.k}</div>
                                        <div className="mt-1 text-[12px] font-medium text-muted-foreground">{n.v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-primary mb-4">{c.quickTitle}</h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {units.map((b) => (
                                    <div
                                        key={b}
                                        className="flex items-center justify-between rounded-xl border border-border/70 bg-surface px-4 py-3 text-sm font-semibold text-primary"
                                    >
                                        <span>{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <div className="container-x pb-16 lg:pb-16" style={{ paddingBottom: 'calc(var(--bottom-nav-h, 0px) + 30px + 2rem + env(safe-area-inset-bottom, 0px))' }}>
                <BizeUlasin />
            </div>
        </>
    );
}

ButunlesikOnkoloji.layout = siteLayout;
