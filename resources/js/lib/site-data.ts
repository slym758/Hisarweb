/**
 * Dummy content data for the site (home page + header search, later content pages).
 * Representative sample — NOT the full catalog. User-visible fields are bilingual
 * ({ tr, en }); consume the locale-resolved hooks (`useDepartments()` …) in
 * components, or `getDepartments(locale)` outside React. Relations use slugs/ids
 * (no fuzzy string matching). Shaped so a later move to Eloquent + admin is
 * mechanical. Images are temporary Unsplash URLs — replace with real optimized
 * assets before shipping (see openspec/config.yaml rule #7).
 */
import type { LucideIcon } from 'lucide-react';
import {
    HeartPulse, Baby, Brain, Bone, Eye, Ear, Stethoscope, Activity,
    Microscope, Scan, Slice, Ribbon, Syringe,
} from 'lucide-react';

import { usePage } from '@inertiajs/react';

import { useLocale, type Locale } from '@/lib/i18n';

/**
 * DB seam: the `useX()` hooks below read the server-provided light catalog
 * (App\Support\CatalogService, shared as the `catalog` Inertia prop, resolved to the
 * active locale) when present, and fall back to the bundled in-memory data otherwise.
 * The public API (types + function signatures) is unchanged, so pages don't change.
 * Detail records (getXBySlug/getDoctorById) still use the in-memory data until each
 * detail route gets its controller.
 */
const ICONS: Record<string, LucideIcon> = {
    HeartPulse, Baby, Brain, Bone, Eye, Ear, Stethoscope, Activity,
    Microscope, Scan, Slice, Ribbon, Syringe,
};

/** Resolve a lucide icon component from its name (the DB stores the name string). */
export function iconFor(name: string | null | undefined): LucideIcon {
    return (name && ICONS[name]) || Stethoscope;
}

/** A light catalog list shared by the backend, or undefined when off-site (fallback). */
function useCatalog<T>(key: string): T[] | undefined {
    const catalog = (usePage().props as { catalog?: Record<string, unknown> }).catalog;
    return catalog ? (catalog[key] as T[]) : undefined;
}

/**
 * The full detail record a detail-page controller passes as the `record` prop (or
 * undefined off such a page). Read inside getXBySlug/getDoctorById during render; callers
 * guard on slug/id so a page's primary record isn't returned for a secondary lookup.
 */
function readRecordProp(): any {
    return (usePage().props as { record?: unknown }).record;
}

/**
 * The per-page related-content slices a detail controller may pass (Faz 2 AUTO/MANUAL
 * system). Keyed by type (treatments/diseases/technologies/videos) and already resolved
 * to the active locale + editor overrides. When present, the dept-scoped getters return
 * the matching slice instead of the in-memory dept fallback. Undefined on pages that don't
 * pass it, so those keep working from the bundled data.
 */
function readRelatedProp(): Record<string, unknown[]> | undefined {
    return (usePage().props as { related?: Record<string, unknown[]> }).related;
}

type Loc = { tr: string; en: string };
const L = (tr: string, en: string): Loc => ({ tr, en });
/** Same value in both locales (proper nouns, names, place names that don't translate). */
const S = (s: string): Loc => ({ tr: s, en: s });

/* ── Resolved (public) shapes — string fields ── */
export type Department = { slug: string; name: string; blurb: string; icon: LucideIcon; iconImage?: string | null; pinned?: boolean };
/** Long-form department detail: "Hakkında" paragraphs + featured medical technologies. */
export type DepartmentDetail = { about: string[]; technologies: { name: string; desc: string; image?: string }[] };
export type Hospital = { slug: string; name: string; area: string; phone: string; address: string; cover: string; comingSoon?: boolean };
/** Long-form hospital detail: about paragraphs, features, technologies, gallery, rooms, transport + quick tiles. */
export type HospitalDetail = {
    about: string[];
    features: { title: string; desc: string }[];
    technologies: { name: string; desc: string }[];
    gallery: { image: string; caption: string }[];
    rooms: { name: string; desc: string; image: string }[];
    transport: string[];
    emergency: string;
    workingHours: string;
    /** Google Maps search query string for the "Yol Tarifi" / embed. */
    mapQuery: string;
};
export type BlogPost = { slug: string; title: string; excerpt: string; category: string; cover: string; date: string; /** Optional full-article body — bilingual paragraphs. Present only on fully-authored posts. */ body?: string[] };
export type Doctor = {
    id: string;
    name: string;
    /** Professional / academic title, e.g. "Cardiology Specialist". */
    title: string;
    bio: string;
    /** Resolved department name (kept for header search backward-compat). */
    department: string;
    /** Relation to a Department.slug. */
    departmentSlug: string;
    /** Relation to a Hospital.slug. */
    hospitalSlug: string;
    photo?: string;
    subspecialties: string[];
    /** Contact e-mail (shown in the hero when present). */
    email?: string;
    /** Spoken languages, resolved to the active locale. */
    languages?: string[];
    /** Optional full CV — rendered on the doctor detail page when present. */
    cv?: DoctorCv;
};
export type DoctorCv = {
    /** "Hakkında" — one or more paragraphs. */
    about: string[];
    /** "Girişimsel Deneyim" — optional (procedural/surgical specialties). */
    interventional?: string[];
    education: string[];
    experience: string[];
    /** "Yayınlar" — a single summary paragraph. */
    publications: string;
    memberships: string[];
};
export type SymptomMap = { keywords: string[]; deptSlug: string; label: string };

export type TreatmentDetail = {
    procedure: string;
    advantages: string[];
    process: { title: string; desc: string }[];
    /* ── Rich optional extensions (present only on fully-authored treatments) ── */
    /** "Tedavi Nedir?" long-form intro paragraph. */
    what?: string;
    /** "Kimler İçin Uygundur?" candidate list. */
    candidates?: string[];
    /** "Dikkat Edilmesi Gerekenler" cautions/warnings. */
    cautions?: string[];
    /** "İlgili Hastalıklar" — display names (chips). */
    relatedDiseases?: string[];
    /** "Kullanılan Teknolojiler" — display names (chips). */
    technologies?: string[];
    /** "Sık Sorulan Sorular". */
    faqs?: { q: string; a: string }[];
};
export type Treatment = { slug: string; name: string; summary: string; department: string; deptSlug: string; cover: string; detail: TreatmentDetail };

export type DiseaseDetail = {
    what: string;
    symptoms: string[];
    causes: string[];
    /** Short diagnosis list (name-only). Always present for backward-compat. */
    diagnosis: string[];
    /** Short treatment list (name-only). Always present for backward-compat. */
    treatment: string[];
    /* ── Rich optional extensions (present only on fully-authored diseases) ── */
    /** "Risk Faktörleri". */
    risks?: string[];
    /** Rich "Tanı Yöntemleri" cards ({ name, desc }); richer parallel to `diagnosis`. */
    diagnosisDetail?: { name: string; desc: string }[];
    /** Rich "Tedavi Yöntemleri" cards ({ name, desc }); richer parallel to `treatment`. */
    treatments?: { name: string; desc: string }[];
    /** "Ne Zaman Doktora Başvurulmalı?". */
    whenToDoctor?: string[];
    /** "Kullanılan Teknolojiler" — display names (chips). */
    technologies?: string[];
    /** "Sık Sorulan Sorular". */
    faqs?: { q: string; a: string }[];
    /** Page-specific warning banner text. */
    warning?: string;
    /** Page-specific mid-content conversion headline. */
    midCta?: string;
};
export type Disease = { slug: string; name: string; summary: string; deptSlug: string; cover: string; detail: DiseaseDetail };

export type TechnologyDetail = {
    what: string;
    how: string;
    advantages: string[];
    /** Relation to Disease.slug values — "Hangi Hastalıklarda Kullanılır?". */
    diseaseSlugs?: string[];
    /** Relation to Treatment.slug values — "Hangi Tedavilerde Kullanılır?". */
    treatmentSlugs?: string[];
};
export type Technology = { slug: string; name: string; desc: string; deptSlugs: string[]; cover: string; detail: TechnologyDetail };

export type EventItem = { slug: string; title: string; excerpt: string; body: string; date: string; place: string; cover: string };

export type HealthPackage = { slug: string; name: string; summary: string; scope: string[]; cover: string };

export type PressItem = { slug: string; title: string; excerpt: string; source: string; date: string; cover: string };

export type FaqItem = { q: string; a: string };
export type FaqCategory = { slug: string; title: string; items: FaqItem[] };

export type Video = { id: string; title: string; youtubeId: string; deptSlug?: string; category: string; duration: string };

/* ── Temporary Unsplash imagery (absolute → loads on our host) ── */
const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
const IMG = {
    cardio: U('1576091160399-112ba8d25d1d'),
    ortho: U('1583912267550-d6c2ac3196c0'),
    eye: U('1579684385127-1ef15d508118'),
    onco: U('1581056771107-24ca5f033842'),
    brain: U('1559757175-08e7c9d63c4b'),
    baby: U('1519494026892-80bbd2d6fd0d'),
    lab: U('1582719508461-905c673771fd'),
    surgery: U('1551190822-a9333d879b1f'),
    hospitalA: U('1587351021759-3e566b6af7cc'),
    hospitalB: U('1516549655169-df83a0774514'),
    blog1: U('1505751172876-fa1923c5c528'),
    blog2: U('1512069772995-ec65ed45afd6'),
    blog3: U('1498837167922-ddd27525d352'),
    // Additional covers for diseases / treatments / technologies / events / packages / press.
    robotic: U('1631815589968-fdb09a223b1e'),
    dental: U('1606811971618-4486d14f3f99'),
    ent: U('1588776814546-1ffcf47267a5'),
    spine: U('1584982751601-97dcc096659c'),
    pain: U('1579154204601-01588f351e67'),
    imaging: U('1512678080530-7760d81faba6'),
    cataract: U('1551601651-2a8555f1a136'),
    derma: U('1620331311520-246422fd82f9'),
    checkup: U('1579165466741-7f35e4755660'),
    event: U('1540575467063-178a50c2df87'),
    press: U('1504868584819-f8e8b4b6d7e3'),
    women: U('1584515933487-779824d29309'),
    child: U('1530026405186-ed1f139313f8'),
    stomach: U('1559757148-5c350d0d3c56'),
    // Hospital-detail imagery (lobby, waiting, rooms, corridors, exterior).
    lobby: U('1519494026892-80bbd2d6fd0d'),
    waitingRoom: U('1538108149393-fbbd81895907'),
    roomStandard: U('1586773860418-d37222d8fce3'),
    roomSuperior: U('1631217868264-e5b90bb7e133'),
    roomSuite: U('1600585152220-90363fe7e115'),
    corridor: U('1504813184591-01572f98c85f'),
    exterior: U('1516549655169-df83a0774514'),
};

/* ── Internal bilingual source ── */
type DeptSrc = { slug: string; name: Loc; blurb: Loc; icon: LucideIcon; pinned?: boolean };
const DEPARTMENTS_SRC: DeptSrc[] = [
    { slug: 'kardiyoloji', icon: HeartPulse, pinned: true, name: L('Kardiyoloji', 'Cardiology'), blurb: L('Kalp ve damar hastalıklarında tanı ve tedavi.', 'Diagnosis and treatment of heart and vascular diseases.') },
    { slug: 'kalp-damar-cerrahisi', icon: Activity, pinned: true, name: L('Kalp ve Damar Cerrahisi', 'Cardiovascular Surgery'), blurb: L('Robotik ve açık kalp cerrahisi.', 'Robotic and open-heart surgery.') },
    { slug: 'genel-cerrahi', icon: Slice, name: L('Genel Cerrahi', 'General Surgery'), blurb: L('Kapsamlı cerrahi girişimler.', 'Comprehensive surgical interventions.') },
    { slug: 'ortopedi', icon: Bone, pinned: true, name: L('Ortopedi ve Travmatoloji', 'Orthopaedics & Traumatology'), blurb: L('Kemik, eklem ve kas iskelet sistemi.', 'Bone, joint and musculoskeletal care.') },
    { slug: 'goz-hastaliklari', icon: Eye, pinned: true, name: L('Göz Hastalıkları', 'Ophthalmology'), blurb: L('Modern göz tanı ve cerrahisi.', 'Modern eye diagnostics and surgery.') },
    { slug: 'kbb', icon: Ear, name: L('Kulak Burun Boğaz', 'Ear, Nose & Throat'), blurb: L('KBB hastalıkları ve cerrahisi.', 'ENT conditions and surgery.') },
    { slug: 'noroloji', icon: Brain, name: L('Nöroloji', 'Neurology'), blurb: L('Sinir sistemi hastalıkları.', 'Nervous system disorders.') },
    { slug: 'uroloji', icon: Stethoscope, name: L('Üroloji', 'Urology'), blurb: L('Robotik üroloji ve prostat tedavileri.', 'Robotic urology and prostate treatments.') },
    { slug: 'kadin-hastaliklari-dogum', icon: Baby, pinned: true, name: L('Kadın Hastalıkları ve Doğum', 'Obstetrics & Gynaecology'), blurb: L('Gebelik takibi ve kadın sağlığı.', 'Pregnancy care and women’s health.') },
    { slug: 'cocuk-sagligi', icon: Baby, name: L('Çocuk Sağlığı ve Hastalıkları', 'Paediatrics'), blurb: L('Bebek ve çocuk sağlığı.', 'Infant and child health.') },
    { slug: 'onkoloji', icon: Ribbon, pinned: true, name: L('Onkoloji', 'Oncology'), blurb: L('Bütünleşik kanser tanı ve tedavisi.', 'Integrated cancer diagnosis and treatment.') },
    { slug: 'radyoloji', icon: Scan, name: L('Radyoloji', 'Radiology'), blurb: L('İleri görüntüleme yöntemleri.', 'Advanced medical imaging.') },
    { slug: 'anesteziyoloji', icon: Syringe, pinned: true, name: L('Anesteziyoloji', 'Anaesthesiology'), blurb: L('Ameliyat öncesi değerlendirmeden ağrı yönetimine kadar güvenli ve modern anestezi hizmeti.', 'Safe, modern anaesthesia care from pre-operative assessment to pain management.') },
];

type HospSrc = { slug: string; name: Loc; area: Loc; phone: string; address: Loc; cover: string; comingSoon?: boolean };
const HOSPITALS_SRC: HospSrc[] = [
    { slug: 'intercontinental', phone: '444 5 888', cover: IMG.hospitalA, name: L('Hisar Hospital Intercontinental', 'Hisar Hospital Intercontinental'), area: L('Ümraniye', 'Ümraniye'), address: L('Yanyanevler Mah. Site Yolu Cd. No:7, Ümraniye / İstanbul', 'Yanyanevler Mah. Site Yolu Cd. No:7, Ümraniye / İstanbul') },
    { slug: 'camlica', phone: '0216 524 13 00', cover: IMG.hospitalB, name: L('Hisar Hospital Çamlıca', 'Hisar Hospital Çamlıca'), area: L('Üsküdar', 'Üsküdar'), address: L('Çamlıca, Üsküdar / İstanbul', 'Çamlıca, Üsküdar / İstanbul') },
    { slug: 'avrupa', phone: '444 5 888', cover: IMG.hospitalA, comingSoon: true, name: L('Hisar Hospital Avrupa', 'Hisar Hospital Avrupa'), area: L('İstanbul (Avrupa)', 'İstanbul (Europe)'), address: L('Yakında', 'Coming soon') },
];

type BlogSrc = { slug: string; title: Loc; excerpt: Loc; category: string; cover: string; date: string; body?: Loc[] };
const BLOG_SRC: BlogSrc[] = [
    {
        slug: 'kalp-sagligi-icin-oneriler', category: 'kardiyoloji', cover: IMG.blog1, date: '2026-07-02', title: L('Kalp Sağlığı İçin 7 Öneri', '7 Tips for a Healthy Heart'), excerpt: L('Günlük yaşamda kalbinizi korumanın basit yolları.', 'Simple ways to protect your heart every day.'),
        body: [
            L('Kalp-damar hastalıkları dünya genelinde önlenebilir ölüm nedenlerinin başında gelir. İyi haber şu ki, kalp sağlığınızı korumak için atacağınız adımların çoğu günlük yaşam alışkanlıklarınızla doğrudan ilgilidir. Küçük ama tutarlı değişiklikler, yıllar içinde kalbinizi koruyan güçlü bir kalkana dönüşür.', 'Cardiovascular disease is one of the leading preventable causes of death worldwide. The good news is that most of the steps you can take to protect your heart are directly tied to your daily habits. Small but consistent changes turn, over the years, into a powerful shield for your heart.'),
            L('1. Dengeli beslenin. Sebze, meyve, tam tahıl ve sağlıklı yağlardan zengin bir diyet; kolesterol ve tansiyonu dengede tutar. Tuz, şeker ve işlenmiş gıdaları azaltmak, damar sağlığını doğrudan olumlu etkiler.', '1. Eat a balanced diet. A diet rich in vegetables, fruit, whole grains and healthy fats keeps cholesterol and blood pressure in balance. Cutting back on salt, sugar and processed food has a direct, positive effect on vascular health.'),
            L('2. Düzenli hareket edin. Haftada en az 150 dakika orta tempolu yürüyüş, yüzme veya bisiklet gibi aktiviteler kalp kasını güçlendirir ve kilo kontrolüne yardımcı olur.', '2. Move regularly. At least 150 minutes a week of moderate activity such as brisk walking, swimming or cycling strengthens the heart muscle and helps with weight control.'),
            L('3. Sigarayı bırakın. Sigara, damar duvarını hasara uğratan en önemli faktörlerden biridir. Bırakıldıktan sonraki ilk yıl içinde bile kalp krizi riski belirgin biçimde azalır.', '3. Quit smoking. Smoking is one of the most significant factors that damages the vessel wall. Even within the first year after quitting, the risk of a heart attack drops markedly.'),
            L('4. Tansiyon, şeker ve kolesterolünüzü takip edin. Bu değerler çoğu zaman belirti vermeden yükselir; düzenli ölçüm ve kontroller erken müdahale şansı sağlar.', '4. Monitor your blood pressure, blood sugar and cholesterol. These values often rise without symptoms; regular measurement and check-ups give you the chance to intervene early.'),
            L('5. Uyku ve stres yönetimine önem verin. Yetersiz uyku ve kronik stres, tansiyonu ve kalp yükünü artırır. Nefes egzersizleri ve düzenli uyku saatleri kalbinizi rahatlatır.', '5. Prioritise sleep and stress management. Inadequate sleep and chronic stress raise blood pressure and the burden on the heart. Breathing exercises and regular sleep hours ease the load on your heart.'),
            L('6. Sağlıklı kiloyu koruyun. Özellikle bel çevresinde biriken yağ, kalp-damar riskini artırır. Dengeli beslenme ve hareketle ideal kiloya yaklaşmak koruyucudur.', '6. Maintain a healthy weight. Fat that accumulates especially around the waist increases cardiovascular risk. Approaching an ideal weight through balanced nutrition and activity is protective.'),
            L('7. Kontrolleri aksatmayın. Ailesinde kalp hastalığı öyküsü olanlar başta olmak üzere, düzenli kardiyoloji değerlendirmesi riskleri erkenden yakalar. Şikâyetiniz olmasa dahi yıllık kontrol önemlidir.', '7. Don’t skip your check-ups. Regular cardiology assessment catches risks early, especially for those with a family history of heart disease. An annual check-up matters even when you have no complaints.'),
            L('Unutmayın: Göğüs ağrısı, nefes darlığı veya çarpıntı gibi belirtiler ihmal edilmemelidir. Bu tür şikâyetlerde vakit kaybetmeden bir sağlık kuruluşuna başvurun.', 'Remember: symptoms such as chest pain, shortness of breath or palpitations should never be ignored. In case of such complaints, seek medical care without delay.'),
        ],
    },
    { slug: 'saglikli-gebelik-sureci', category: 'kadin-hastaliklari-dogum', cover: IMG.blog2, date: '2026-06-18', title: L('Sağlıklı Bir Gebelik Süreci', 'A Healthy Pregnancy Journey'), excerpt: L('Gebelik boyunca dikkat edilmesi gerekenler.', 'What to watch for throughout pregnancy.') },
    { slug: 'gozunuzu-koruyun', category: 'goz-hastaliklari', cover: IMG.blog3, date: '2026-06-01', title: L('Ekran Çağında Gözünüzü Koruyun', 'Protect Your Eyes in the Screen Age'), excerpt: L('Dijital göz yorgunluğuna karşı öneriler.', 'Tips against digital eye strain.') },
    { slug: 'erken-tani-neden-onemli', category: 'onkoloji', cover: IMG.blog1, date: '2026-05-20', title: L('Kanserde Erken Tanı Neden Önemli?', 'Why Early Diagnosis Matters in Cancer'), excerpt: L('Erken tanının tedavi başarısına etkisi.', 'How early diagnosis improves treatment success.') },
    { slug: 'saglikli-eklemler', category: 'ortopedi', cover: IMG.blog2, date: '2026-05-05', title: L('Sağlıklı Eklemler İçin Öneriler', 'Tips for Healthy Joints'), excerpt: L('Eklem sağlığını korumanın yolları.', 'Ways to protect your joint health.') },
    { slug: 'cocuklarda-bagisiklik', category: 'cocuk-sagligi', cover: IMG.blog3, date: '2026-04-22', title: L('Çocuklarda Bağışıklığı Güçlendirmek', 'Boosting Immunity in Children'), excerpt: L('Çocuğunuzun bağışıklığını destekleyin.', 'Support your child’s immune system.') },
    {
        slug: 'kronik-agri-ile-basa-cikmak', category: 'anesteziyoloji', cover: IMG.pain, date: '2026-07-28', title: L('Kronik Ağrı ile Başa Çıkmak', 'Coping with Chronic Pain'), excerpt: L('Kronik ağrıda girişimsel algoloji yöntemleri ve yaşam kalitesi.', 'Interventional pain methods and quality of life in chronic pain.'),
        body: [
            L('Kronik ağrı, üç aydan uzun süren ve kişinin günlük yaşamını, uyku düzenini ve ruh hâlini olumsuz etkileyen kalıcı bir ağrı durumudur. Akut ağrının aksine, kronik ağrı çoğu zaman altta yatan hasar iyileştikten sonra da devam eder ve başlı başına bir sağlık sorunu hâline gelir.', 'Chronic pain is a persistent pain condition lasting more than three months that adversely affects a person’s daily life, sleep and mood. Unlike acute pain, chronic pain often continues even after the underlying damage has healed and becomes a health problem in its own right.'),
            L('Bel ve boyun fıtığı, fibromiyalji, diyabetik nöropati, trigeminal nevralji ve kanser ağrısı; en sık karşılaşılan kronik ağrı kaynaklarındandır. Bu ağrılar yalnızca fiziksel değil; iş gücü kaybı, sosyal geri çekilme ve depresyon gibi çok yönlü etkiler de yaratır.', 'Herniated lumbar and cervical discs, fibromyalgia, diabetic neuropathy, trigeminal neuralgia and cancer pain are among the most common sources of chronic pain. These pains are not only physical; they also create multifaceted effects such as loss of productivity, social withdrawal and depression.'),
            L('Ağrı Polikliniği (Algoloji), kronik ağrının multidisipliner biçimde değerlendirildiği özel bir birimdir. Amaç yalnızca ağrıyı bastırmak değil; kaynağını tespit etmek, işlev kaybını geri kazandırmak ve ilaç kullanımını en aza indirmektir.', 'The Pain Clinic (Algology) is a dedicated unit where chronic pain is evaluated in a multidisciplinary way. The aim is not merely to suppress pain but to identify its source, restore lost function and minimise medication use.'),
            L('Girişimsel algoloji yöntemleri arasında epidural steroid enjeksiyonu, radyofrekans termokoagülasyon, sinir ve ganglion blokları ile nöromodülasyon yer alır. Bu işlemler çoğunlukla lokal anestezi altında, günübirlik olarak uygulanır ve hedefe yöneliktir.', 'Interventional algology methods include epidural steroid injection, radiofrequency thermocoagulation, nerve and ganglion blocks, and neuromodulation. These procedures are mostly performed under local anaesthesia, as day cases, and are targeted.'),
            L('Girişimsel yöntemler; fizik tedavi, egzersiz, psikolojik destek ve akılcı ilaç yönetimiyle birleştiğinde en iyi sonucu verir. Yaşam tarzı düzenlemeleri — düzenli hareket, kilo kontrolü, uyku hijyeni ve stres yönetimi — tedavinin ayrılmaz bir parçasıdır.', 'Interventional methods yield the best results when combined with physiotherapy, exercise, psychological support and rational medication management. Lifestyle adjustments — regular activity, weight control, sleep hygiene and stress management — are an integral part of the treatment.'),
            L('Ağrınız üç aydan uzun sürüyor, ağrı kesicilere rağmen geçmiyor ya da günlük yaşamınızı kısıtlıyorsa bir algoloji uzmanına başvurmanız önerilir. Doğru tanı ve kişiye özel bir plan ile yaşam kalitenizi yeniden kazanmak mümkündür.', 'If your pain lasts more than three months, does not resolve despite painkillers or limits your daily life, it is advisable to consult an algology specialist. With the right diagnosis and a personalised plan, it is possible to regain your quality of life.'),
        ],
    },
    {
        slug: 'bel-fitiginda-epidural', category: 'anesteziyoloji', cover: IMG.spine, date: '2026-07-10', title: L('Bel Fıtığında Epidural Enjeksiyon', 'Epidural Injection for Herniated Disc'), excerpt: L('Bel fıtığına bağlı ağrıda epidural enjeksiyon ne zaman uygulanır?', 'When is an epidural injection used for herniated-disc pain?'),
        body: [
            L('Bel fıtığı, omurlar arasındaki disklerin dışa doğru taşarak sinir köklerine baskı yapmasıyla ortaya çıkar. Bu baskı; bele, kalçaya ve bacağa yayılan ağrı, uyuşma ve güç kaybına neden olabilir. Hastaların önemli bir kısmında şikâyetler istirahat, ilaç ve fizik tedavi ile geriler.', 'A herniated lumbar disc occurs when the discs between the vertebrae bulge outward and press on the nerve roots. This pressure can cause pain radiating to the lower back, hip and leg, along with numbness and loss of strength. In a significant proportion of patients, complaints subside with rest, medication and physiotherapy.'),
            L('Konservatif tedaviye rağmen ağrının sürdüğü durumlarda, cerrahiye geçmeden önce epidural steroid enjeksiyonu önemli bir seçenektir. İşlemde, omuriliği saran zarın dışındaki epidural aralığa steroid ve lokal anestezik karışımı uygulanarak sinir kökündeki iltihap ve ödem azaltılır.', 'When pain persists despite conservative treatment, an epidural steroid injection is an important option before moving on to surgery. In the procedure, a mixture of steroid and local anaesthetic is applied to the epidural space outside the membrane surrounding the spinal cord, reducing inflammation and swelling at the nerve root.'),
            L('Enjeksiyon; skopi (C-kollu röntgen) veya ultrason eşliğinde, ince bir iğneyle yapılır. Böylece ilaç tam hedef bölgeye ulaştırılır. İşlem genellikle 15-20 dakika sürer, günübirliktir ve çoğu hasta aynı gün evine döner.', 'The injection is performed with a fine needle under fluoroscopy (C-arm X-ray) or ultrasound guidance, so that the medication reaches exactly the target area. The procedure usually takes 15-20 minutes, is a day case, and most patients return home the same day.'),
            L('Epidural enjeksiyon; özellikle bacağa yayılan (siyatik tarzı) ağrılarda, cerrahi düşünülen ancak ertelenmek istenen olgularda ve ameliyat sonrası devam eden ağrılarda tercih edilir. Etkisi kişiden kişiye değişmekle birlikte haftalar-aylar boyunca sürebilir ve gerektiğinde tekrarlanabilir.', 'The epidural injection is preferred especially for pain radiating to the leg (sciatica-type), in cases where surgery is being considered but the patient wishes to postpone it, and for pain that continues after surgery. Although its effect varies from person to person, it can last for weeks to months and may be repeated when necessary.'),
            L('Her hasta bu yöntem için uygun olmayabilir. Kanama bozukluğu, aktif enfeksiyon veya bazı ilaç kullanımları işlem öncesi değerlendirilmelidir. Uzman hekim, MR bulgularınızı ve şikâyetlerinizi birlikte değerlendirerek size en uygun tedaviyi planlar.', 'Not every patient is suitable for this method. Bleeding disorders, active infection or the use of certain medications must be evaluated before the procedure. Your specialist plans the most appropriate treatment for you by assessing your MRI findings and complaints together.'),
        ],
    },
];

const SYMPTOMS_SRC: { keywords: Loc[]; deptSlug: string; label: Loc }[] = [
    { deptSlug: 'kardiyoloji', label: L('Göğüs ağrısı', 'Chest pain'), keywords: [L('göğüs ağrısı', 'chest pain'), L('çarpıntı', 'palpitations'), L('nefes darlığı', 'shortness of breath')] },
    { deptSlug: 'noroloji', label: L('Baş ağrısı', 'Headache'), keywords: [L('baş ağrısı', 'headache'), L('migren', 'migraine'), L('baş dönmesi', 'dizziness')] },
    { deptSlug: 'ortopedi', label: L('Eklem ağrısı', 'Joint pain'), keywords: [L('eklem ağrısı', 'joint pain'), L('bel ağrısı', 'back pain'), L('diz ağrısı', 'knee pain')] },
    { deptSlug: 'goz-hastaliklari', label: L('Görme bulanıklığı', 'Blurred vision'), keywords: [L('görme bulanıklığı', 'blurred vision'), L('göz kızarıklığı', 'eye redness')] },
    { deptSlug: 'kbb', label: L('Boğaz ağrısı', 'Sore throat'), keywords: [L('boğaz ağrısı', 'sore throat'), L('kulak ağrısı', 'ear ache'), L('burun tıkanıklığı', 'nasal congestion')] },
    { deptSlug: 'kadin-hastaliklari-dogum', label: L('Gebelik takibi', 'Pregnancy care'), keywords: [L('gebelik', 'pregnancy'), L('adet düzensizliği', 'menstrual irregularity')] },
    { deptSlug: 'uroloji', label: L('İdrar şikayetleri', 'Urinary problems'), keywords: [L('idrar', 'urine'), L('prostat', 'prostate'), L('böbrek taşı', 'kidney stone')] },
    { deptSlug: 'cocuk-sagligi', label: L('Çocuk ateşi', 'Child fever'), keywords: [L('ateş', 'fever'), L('öksürük', 'cough'), L('çocuk', 'child')] },
];

/* ── Resolvers ── */
function resolveDept(d: DeptSrc, l: Locale): Department {
    return { slug: d.slug, name: d.name[l], blurb: d.blurb[l], icon: d.icon, pinned: d.pinned };
}
function resolveHospital(h: HospSrc, l: Locale): Hospital {
    return { slug: h.slug, name: h.name[l], area: h.area[l], phone: h.phone, address: h.address[l], cover: h.cover, comingSoon: h.comingSoon };
}
function resolveBlog(b: BlogSrc, l: Locale): BlogPost {
    return { slug: b.slug, title: b.title[l], excerpt: b.excerpt[l], category: b.category, cover: b.cover, date: b.date, body: b.body ? b.body.map((p) => p[l]) : undefined };
}
function resolveSymptom(s: (typeof SYMPTOMS_SRC)[number], l: Locale): SymptomMap {
    return { deptSlug: s.deptSlug, label: s.label[l], keywords: s.keywords.map((k) => k[l]) };
}

export function getDepartments(l: Locale): Department[] { return DEPARTMENTS_SRC.map((d) => resolveDept(d, l)); }
export function getHospitals(l: Locale): Hospital[] { return HOSPITALS_SRC.map((h) => resolveHospital(h, l)); }
export function getBlogPosts(l: Locale): BlogPost[] { return BLOG_SRC.map((b) => resolveBlog(b, l)); }
/** Blog posts linked to a department slug via their `category` (relation helper for detail pages). */
export function getBlogPostsForDept(deptSlug: string, l: Locale): BlogPost[] {
    const cat = useCatalog<BlogPost>('blogPosts');
    if (cat) return cat.filter((b) => b.category === deptSlug);
    return BLOG_SRC.filter((b) => b.category === deptSlug).map((b) => resolveBlog(b, l));
}
export function getSymptomMap(l: Locale): SymptomMap[] { return SYMPTOMS_SRC.map((s) => resolveSymptom(s, l)); }

/** Locale-resolved hooks — use these inside components for bilingual content. */
export function useDepartments(): Department[] {
    const l = useLocale();
    const c = useCatalog<Department>('departments');
    return c ? c.map((d) => ({ ...d, icon: iconFor((d as unknown as { icon?: string }).icon) })) : getDepartments(l);
}
export function useHospitals(): Hospital[] { const l = useLocale(); const c = useCatalog<Hospital>('hospitals'); return c ?? getHospitals(l); }
export function useBlogPosts(): BlogPost[] { const l = useLocale(); const c = useCatalog<BlogPost>('blogPosts'); return c ?? getBlogPosts(l); }
export function useSymptomMap(): SymptomMap[] { const l = useLocale(); const c = useCatalog<SymptomMap>('symptomMap'); return c ?? getSymptomMap(l); }

/** Resolve a department slug to its localized name (relation helper). */
function deptName(slug: string, l: Locale): string {
    return DEPARTMENTS_SRC.find((d) => d.slug === slug)?.name[l] ?? slug;
}

/* ── Department detail (long-form "Hakkında" + featured technologies), keyed by dept slug ── */
type DepartmentDetailSrc = { about: Loc[]; technologies: { name: Loc; desc: Loc }[] };
const DEPARTMENT_DETAILS_SRC: Record<string, DepartmentDetailSrc> = {
    anesteziyoloji: {
        about: [
            L(
                'Hisar Hospital Anesteziyoloji ve Reanimasyon Bölümü; yenidoğandan ileri yaşlı hastalara kadar tüm yaş gruplarında güvenli, konforlu ve modern anestezi hizmeti sunar. Ameliyat öncesi yapılan ayrıntılı değerlendirme ile her hastaya özel anestezi planı oluşturulur; genel, rejyonal ve sedasyon anestezisi seçenekleri hastanın klinik durumuna göre belirlenir. Ameliyat süresince ve sonrasında canlı monitorizasyon, sıvı-elektrolit yönetimi ve ağrı kontrolü tek bir ekip tarafından bütüncül olarak yürütülür.',
                'The Hisar Hospital Department of Anaesthesiology and Reanimation provides safe, comfortable and modern anaesthesia care for all age groups, from newborns to the elderly. A detailed pre-operative assessment produces an anaesthesia plan tailored to each patient; general, regional and sedation anaesthesia options are chosen according to the patient’s clinical condition. During and after surgery, live monitoring, fluid and electrolyte management and pain control are carried out holistically by a single team.',
            ),
            L(
                'Bölümümüz; ultrason rehberli sinir blokları, hasta kontrollü analjezi (PCA) pompaları, total intravenöz anestezi (TIVA), nöromonitorizasyon ve hedefe yönelik akıllı monitör sistemleriyle uluslararası standartlarda hizmet sağlar. Kardiyak cerrahi, obezite cerrahisi, ortopedik protez cerrahisi, pediatrik cerrahi, doğum ve jinekolojik girişimler başta olmak üzere yüksek riskli olgularda multidisipliner yaklaşımla çalışırız.',
                'Our department delivers care to international standards with ultrasound-guided nerve blocks, patient-controlled analgesia (PCA) pumps, total intravenous anaesthesia (TIVA), neuromonitoring and target-controlled smart monitoring systems. We work with a multidisciplinary approach in high-risk cases, notably cardiac surgery, bariatric surgery, orthopaedic joint-replacement surgery, paediatric surgery, childbirth and gynaecological procedures.',
            ),
            L(
                'Ağrı Polikliniğimizde ise kronik bel-boyun ağrısı, migren, trigeminal nevralji, kanser ağrısı ve nöropatik ağrı gibi durumlar için girişimsel algoloji yöntemleri (epidural enjeksiyon, radyofrekans termokoagülasyon, nöromodülasyon) uygulanır. Amacımız; her hastaya kanıta dayalı, güvenli ve konforlu bir anestezi ile ağrısız bir iyileşme süreci sunmaktır.',
                'In our Pain Clinic, interventional algology methods (epidural injection, radiofrequency thermocoagulation, neuromodulation) are applied for conditions such as chronic low-back and neck pain, migraine, trigeminal neuralgia, cancer pain and neuropathic pain. Our goal is to offer every patient a pain-free recovery through evidence-based, safe and comfortable anaesthesia.',
            ),
        ],
        technologies: [
            { name: L('Ultrason Rehberli Blok', 'Ultrasound-Guided Block'), desc: L('Rejyonal anestezide hedefli sinir bloğu.', 'Targeted nerve block in regional anaesthesia.') },
            { name: L('TIVA', 'TIVA'), desc: L('Total intravenöz anestezi.', 'Total intravenous anaesthesia.') },
            { name: L('PCA Pompaları', 'PCA Pumps'), desc: L('Hasta kontrollü ağrı yönetimi.', 'Patient-controlled pain management.') },
            { name: L('Nöromonitorizasyon', 'Neuromonitoring'), desc: L('Ameliyatta sinir fonksiyonu takibi.', 'Nerve-function monitoring during surgery.') },
        ],
    },
};
function resolveDepartmentDetail(d: DepartmentDetailSrc, l: Locale): DepartmentDetail {
    return {
        about: d.about.map((p) => p[l]),
        technologies: d.technologies.map((t) => ({ name: t.name[l], desc: t.desc[l] })),
    };
}
/** Long-form detail for a department slug, or undefined when the department has no authored detail. */
export function getDepartmentDetail(slug: string, l: Locale): DepartmentDetail | undefined {
    const __r = readRecordProp(); if (__r !== undefined) return (__r ?? undefined) as DepartmentDetail | undefined;
    const d = DEPARTMENT_DETAILS_SRC[slug];
    return d ? resolveDepartmentDetail(d, l) : undefined;
}
export function useDepartmentDetail(slug: string): DepartmentDetail | undefined {
    return getDepartmentDetail(slug, useLocale());
}

/* ── Doctors — representative sample, one+ per department, related by slug ── */
type DoctorSrc = {
    id: string;
    name: Loc;
    title: Loc;
    bio: Loc;
    departmentSlug: string;
    hospitalSlug: string;
    photo?: string;
    subspecialties: Loc[];
    email?: string;
    languages?: Loc[];
    cv?: DoctorCvSrc;
};
type DoctorCvSrc = {
    about: Loc[];
    interventional?: Loc[];
    education: Loc[];
    experience: Loc[];
    publications: Loc;
    memberships: Loc[];
};
/** Every listed doctor speaks Turkish and English (bilingual). */
const LANGS: Loc[] = [L('Türkçe', 'Turkish'), L('İngilizce', 'English')];
const DOCTORS_SRC: DoctorSrc[] = [
    {
        id: 'd1', name: S('Prof. Dr. Ahmet Yılmaz'), departmentSlug: 'kardiyoloji', hospitalSlug: 'intercontinental',
        title: L('Kardiyoloji Uzmanı', 'Cardiology Specialist'),
        bio: L('Girişimsel kardiyoloji ve koroner hastalıklar alanında 20 yılı aşkın deneyime sahiptir; anjiyografi ve kalp pili uygulamalarında uzmanlaşmıştır.', 'Over 20 years of experience in interventional cardiology and coronary disease, specializing in angiography and pacemaker procedures.'),
        subspecialties: [L('Girişimsel Kardiyoloji', 'Interventional Cardiology'), L('Ritim Bozuklukları', 'Arrhythmias'), L('Ekokardiyografi', 'Echocardiography')],
        email: 'ahmet.yilmaz@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Prof. Dr. Ahmet Yılmaz, kardiyoloji alanında 20 yılı aşkın klinik ve akademik deneyime sahip bir uzmandır. Özellikle girişimsel kardiyoloji, koroner arter hastalıkları, anjiyografi ve kalp pili uygulamaları alanlarında ulusal ve uluslararası düzeyde çalışmalar yürütmektedir.', 'Prof. Dr. Ahmet Yılmaz is a specialist with more than 20 years of clinical and academic experience in cardiology. He works at national and international level, particularly in interventional cardiology, coronary artery disease, angiography and pacemaker procedures.'),
                L('Hastalarına kanıta dayalı ve bireyselleştirilmiş bir yaklaşımla hizmet veren Prof. Dr. Yılmaz, tanıdan tedaviye kadar tüm süreçte açık iletişim ve şeffaf bilgilendirmeyi önceliklendirir.', 'Serving his patients with an evidence-based, individualised approach, Prof. Yılmaz prioritises open communication and transparent information throughout the entire process, from diagnosis to treatment.'),
            ],
            interventional: [
                L('Koroner anjiyografi ve stent (anjiyoplasti)', 'Coronary angiography and stenting (angioplasty)'),
                L('Kalıcı kalp pili ve ICD implantasyonu', 'Permanent pacemaker and ICD implantation'),
                L('Ritim bozukluklarında elektrofizyolojik çalışma', 'Electrophysiological study for arrhythmias'),
                L('Balon anjiyoplasti ve periferik damar girişimleri', 'Balloon angioplasty and peripheral vascular interventions'),
            ],
            education: [
                L('İstanbul Üniversitesi, İstanbul Tıp Fakültesi', 'Istanbul University, Istanbul Faculty of Medicine'),
                L('Kardiyoloji Uzmanlık Eğitimi — Ankara Numune Eğitim ve Araştırma Hastanesi', 'Cardiology Residency — Ankara Numune Training & Research Hospital'),
                L('Girişimsel Kardiyoloji Yan Dal — Avrupa Kardiyoloji Derneği (ESC) programı', 'Interventional Cardiology Fellowship — European Society of Cardiology (ESC) programme'),
                L('Doçentlik / Profesörlük — Kardiyoloji', 'Associate Professorship / Professorship — Cardiology'),
            ],
            experience: [
                L('Hisar Hospital Intercontinental — Kardiyoloji Bölüm Başkanı', 'Hisar Hospital Intercontinental — Head of Cardiology'),
                L('Üniversite hastanelerinde 15+ yıl öğretim üyeliği ve eğiticilik', '15+ years of faculty and teaching roles at university hospitals'),
                L('5.000’den fazla anjiyografi ve girişimsel kardiyoloji işlemi', 'More than 5,000 angiography and interventional cardiology procedures'),
            ],
            publications: L('SCI ve SCI-E kapsamlı dergilerde 60’ı aşkın uluslararası makale, çok sayıda kongre bildirisi ve kitap bölümü. Koroner arter hastalıkları ve girişimsel kardiyoloji konularında ödüllü çalışmalar.', 'More than 60 international articles in SCI and SCI-E indexed journals, numerous congress presentations and book chapters. Award-winning work on coronary artery disease and interventional cardiology.'),
            memberships: [
                L('Türk Kardiyoloji Derneği (TKD)', 'Turkish Society of Cardiology (TKD)'),
                L('Avrupa Kardiyoloji Derneği (ESC)', 'European Society of Cardiology (ESC)'),
                L('Amerikan Kardiyoloji Koleji (ACC)', 'American College of Cardiology (ACC)'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd2', name: S('Prof. Dr. Ayşe Demir'), departmentSlug: 'kadin-hastaliklari-dogum', hospitalSlug: 'camlica',
        title: L('Kadın Hastalıkları ve Doğum Uzmanı', 'Obstetrics & Gynaecology Specialist'),
        bio: L('Riskli gebelik takibi, tüp bebek ve jinekolojik cerrahi alanlarında kapsamlı deneyime sahiptir.', 'Broad experience in high-risk pregnancy follow-up, IVF and gynaecological surgery.'),
        subspecialties: [L('Riskli Gebelik', 'High-Risk Pregnancy'), L('Tüp Bebek / IVF', 'IVF'), L('Jinekolojik Cerrahi', 'Gynaecological Surgery')],
        email: 'ayse.demir@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Prof. Dr. Ayşe Demir, kadın hastalıkları ve doğum alanında 20 yılı aşkın klinik ve akademik deneyime sahiptir. Riskli gebelik takibi, tüp bebek (IVF) ve jinekolojik cerrahi alanlarında ulusal ve uluslararası düzeyde çalışmalar yürütmektedir.', 'Prof. Dr. Ayşe Demir has more than 20 years of clinical and academic experience in obstetrics and gynaecology. She works at national and international level in high-risk pregnancy follow-up, in-vitro fertilisation (IVF) and gynaecological surgery.'),
                L('Anne ve bebek sağlığını merkeze alan, kanıta dayalı ve bireyselleştirilmiş bir yaklaşım benimseyen Prof. Dr. Demir, tüm süreçte açık iletişim ve şeffaf bilgilendirmeyi önceliklendirir.', 'Adopting an evidence-based, individualised approach centred on the health of mother and baby, Prof. Demir prioritises open communication and transparent information throughout the process.'),
            ],
            interventional: [
                L('Laparoskopik ve histeroskopik jinekolojik cerrahi', 'Laparoscopic and hysteroscopic gynaecological surgery'),
                L('Riskli gebelik takibi ve sezaryen', 'High-risk pregnancy follow-up and caesarean section'),
                L('Tüp bebek (IVF) ve yumurta toplama işlemleri', 'IVF and egg-retrieval procedures'),
                L('Miyom ve endometriozis cerrahisi', 'Myoma and endometriosis surgery'),
            ],
            education: [
                L('İstanbul Üniversitesi, Cerrahpaşa Tıp Fakültesi', 'Istanbul University, Cerrahpaşa Faculty of Medicine'),
                L('Kadın Hastalıkları ve Doğum Uzmanlık Eğitimi — Zeynep Kamil Kadın ve Çocuk Hastalıkları Hastanesi', 'Obstetrics & Gynaecology Residency — Zeynep Kamil Women’s and Children’s Hospital'),
                L('Üreme Endokrinolojisi ve İnfertilite eğitimleri', 'Training in reproductive endocrinology and infertility'),
                L('Doçentlik / Profesörlük — Kadın Hastalıkları ve Doğum', 'Associate Professorship / Professorship — Obstetrics & Gynaecology'),
            ],
            experience: [
                L('Hisar Hospital Çamlıca — Kadın Hastalıkları ve Doğum Bölüm Başkanı', 'Hisar Hospital Çamlıca — Head of Obstetrics & Gynaecology'),
                L('Üniversite ve eğitim hastanelerinde 15+ yıl uzmanlık ve eğiticilik', '15+ years of specialist practice and teaching at university and training hospitals'),
                L('Binlerce doğum ve jinekolojik cerrahi girişim', 'Thousands of deliveries and gynaecological surgical procedures'),
            ],
            publications: L('Ulusal ve uluslararası hakemli dergilerde 50’yi aşkın bilimsel makale, kongre bildirileri ve kitap bölümleri. Riskli gebelik ve üreme sağlığı alanında çalışmalar.', 'More than 50 scientific articles in national and international peer-reviewed journals, along with congress presentations and book chapters. Work in the field of high-risk pregnancy and reproductive health.'),
            memberships: [
                L('Türk Jinekoloji ve Obstetrik Derneği (TJOD)', 'Turkish Society of Obstetrics and Gynecology (TJOD)'),
                L('Üreme Sağlığı ve İnfertilite Derneği (TSRM)', 'Society of Reproductive Medicine and Infertility (TSRM)'),
                L('Avrupa İnsan Üremesi ve Embriyolojisi Derneği (ESHRE)', 'European Society of Human Reproduction and Embryology (ESHRE)'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd3', name: S('Doç. Dr. Mehmet Kaya'), departmentSlug: 'ortopedi', hospitalSlug: 'intercontinental',
        title: L('Ortopedi ve Travmatoloji Uzmanı', 'Orthopaedics & Traumatology Specialist'),
        bio: L('Diz ve kalça protezi, artroskopik cerrahi ve spor yaralanmaları konusunda çalışmalar yürütmektedir.', 'Works on knee and hip replacement, arthroscopic surgery and sports injuries.'),
        subspecialties: [L('Diz Protezi', 'Knee Replacement'), L('Artroskopik Cerrahi', 'Arthroscopic Surgery'), L('Spor Yaralanmaları', 'Sports Injuries')],
        email: 'mehmet.kaya@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Doç. Dr. Mehmet Kaya, diz ve kalça protezi cerrahisi, artroskopik cerrahi ve spor yaralanmaları konusunda deneyimli bir ortopedi ve travmatoloji uzmanıdır.', 'Assoc. Prof. Dr. Mehmet Kaya is an orthopaedics and traumatology specialist experienced in knee and hip replacement surgery, arthroscopic surgery and sports injuries.'),
            ],
            interventional: [
                L('Diz ve kalça protezi cerrahisi', 'Knee and hip replacement surgery'),
                L('Artroskopik menisküs ve bağ cerrahisi', 'Arthroscopic meniscus and ligament surgery'),
            ],
            education: [
                L('Hacettepe Üniversitesi Tıp Fakültesi', 'Hacettepe University Faculty of Medicine'),
                L('Ortopedi ve Travmatoloji Uzmanlık Eğitimi — Ankara Eğitim ve Araştırma Hastanesi', 'Orthopaedics & Traumatology Residency — Ankara Training & Research Hospital'),
            ],
            experience: [
                L('Hisar Hospital Intercontinental — Ortopedi ve Travmatoloji Uzmanı', 'Hisar Hospital Intercontinental — Orthopaedics & Traumatology Specialist'),
                L('Eğitim ve araştırma hastanelerinde 10+ yıl klinik deneyim', '10+ years of clinical experience at training and research hospitals'),
            ],
            publications: L('Ortopedik cerrahi ve spor yaralanmaları alanında ulusal ve uluslararası dergilerde bilimsel yayınlar ve kongre bildirileri.', 'Scientific publications and congress presentations in national and international journals on orthopaedic surgery and sports injuries.'),
            memberships: [
                L('Türk Ortopedi ve Travmatoloji Birliği Derneği (TOTBİD)', 'Turkish Society of Orthopaedics and Traumatology (TOTBİD)'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd4', name: S('Op. Dr. Elif Şahin'), departmentSlug: 'goz-hastaliklari', hospitalSlug: 'intercontinental',
        title: L('Göz Hastalıkları Uzmanı', 'Ophthalmology Specialist'),
        bio: L('Katarakt, refraktif lazer cerrahisi ve retina hastalıkları alanında modern tanı ve tedavi yöntemleri uygular.', 'Applies modern diagnosis and treatment in cataract, refractive laser surgery and retinal disease.'),
        subspecialties: [L('Katarakt Cerrahisi', 'Cataract Surgery'), L('Refraktif Cerrahi', 'Refractive Surgery'), L('Retina', 'Retina')],
        email: 'elif.sahin@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Op. Dr. Elif Şahin, katarakt cerrahisi, refraktif lazer tedavileri ve retina hastalıkları alanında modern tanı ve tedavi yöntemleri uygulayan bir göz hastalıkları uzmanıdır.', 'Op. Dr. Elif Şahin is an ophthalmology specialist who applies modern diagnostic and treatment methods in cataract surgery, refractive laser treatments and retinal disease.'),
            ],
            interventional: [
                L('Fakoemülsifikasyon ile dikişsiz katarakt cerrahisi', 'Sutureless cataract surgery with phacoemulsification'),
                L('Refraktif lazer (SMILE / LASIK) uygulamaları', 'Refractive laser (SMILE / LASIK) procedures'),
            ],
            education: [
                L('Ege Üniversitesi Tıp Fakültesi', 'Ege University Faculty of Medicine'),
                L('Göz Hastalıkları Uzmanlık Eğitimi — İstanbul Eğitim ve Araştırma Hastanesi', 'Ophthalmology Residency — Istanbul Training & Research Hospital'),
            ],
            experience: [
                L('Hisar Hospital Intercontinental — Göz Hastalıkları Uzmanı', 'Hisar Hospital Intercontinental — Ophthalmology Specialist'),
                L('Özel göz merkezlerinde 8+ yıl cerrahi deneyim', '8+ years of surgical experience at private eye centres'),
            ],
            publications: L('Katarakt ve refraktif cerrahi alanında ulusal kongre bildirileri ve dergi yayınları.', 'National congress presentations and journal publications in cataract and refractive surgery.'),
            memberships: [
                L('Türk Oftalmoloji Derneği (TOD)', 'Turkish Ophthalmological Association (TOD)'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd5', name: S('Prof. Dr. Can Öztürk'), departmentSlug: 'onkoloji', hospitalSlug: 'intercontinental',
        title: L('Medikal Onkoloji Uzmanı', 'Medical Oncology Specialist'),
        bio: L('Kişiselleştirilmiş kanser tedavisi, kemoterapi ve immünoterapi protokollerinde deneyimlidir.', 'Experienced in personalized cancer treatment, chemotherapy and immunotherapy protocols.'),
        subspecialties: [L('Kemoterapi', 'Chemotherapy'), L('İmmünoterapi', 'Immunotherapy'), L('Meme Kanseri', 'Breast Cancer')],
        email: 'can.ozturk@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Prof. Dr. Can Öztürk, kişiselleştirilmiş kanser tedavisi, kemoterapi ve immünoterapi protokolleri konusunda deneyimli bir medikal onkoloji uzmanıdır. Tedavi kararları multidisipliner tümör konseyi çerçevesinde alınır.', 'Prof. Dr. Can Öztürk is a medical oncology specialist experienced in personalised cancer treatment, chemotherapy and immunotherapy protocols. Treatment decisions are made within the framework of a multidisciplinary tumour board.'),
            ],
            education: [
                L('Dokuz Eylül Üniversitesi Tıp Fakültesi', 'Dokuz Eylül University Faculty of Medicine'),
                L('İç Hastalıkları Uzmanlığı ve Medikal Onkoloji Yan Dalı — Ankara Onkoloji Hastanesi', 'Internal Medicine Residency and Medical Oncology Fellowship — Ankara Oncology Hospital'),
                L('Doçentlik / Profesörlük — Medikal Onkoloji', 'Associate Professorship / Professorship — Medical Oncology'),
            ],
            experience: [
                L('Hisar Hospital Intercontinental — Medikal Onkoloji Uzmanı', 'Hisar Hospital Intercontinental — Medical Oncology Specialist'),
                L('Üniversite hastanelerinde 12+ yıl öğretim üyeliği', '12+ years of faculty roles at university hospitals'),
            ],
            publications: L('Meme ve akciğer kanseri ile immünoterapi alanında uluslararası hakemli dergilerde yayınlar ve kongre bildirileri.', 'Publications in international peer-reviewed journals and congress presentations in breast and lung cancer and immunotherapy.'),
            memberships: [
                L('Türk Tıbbi Onkoloji Derneği', 'Turkish Society of Medical Oncology'),
                L('Avrupa Tıbbi Onkoloji Derneği (ESMO)', 'European Society for Medical Oncology (ESMO)'),
            ],
        },
    },
    {
        id: 'd6', name: S('Uzm. Dr. Zeynep Arslan'), departmentSlug: 'cocuk-sagligi', hospitalSlug: 'camlica',
        title: L('Çocuk Sağlığı ve Hastalıkları Uzmanı', 'Paediatrics Specialist'),
        bio: L('Yenidoğan takibi, aşılama ve çocukluk çağı enfeksiyonlarında geniş klinik deneyime sahiptir.', 'Extensive clinical experience in newborn follow-up, vaccination and childhood infections.'),
        subspecialties: [L('Yenidoğan Takibi', 'Newborn Care'), L('Aşılama', 'Vaccination'), L('Büyüme & Gelişim', 'Growth & Development')],
        email: 'zeynep.arslan@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Uzm. Dr. Zeynep Arslan, yenidoğan takibi, aşılama ve çocukluk çağı enfeksiyonları konusunda geniş klinik deneyime sahip bir çocuk sağlığı ve hastalıkları uzmanıdır.', 'Dr. Zeynep Arslan is a paediatrics specialist with broad clinical experience in newborn follow-up, vaccination and childhood infections.'),
            ],
            education: [
                L('Marmara Üniversitesi Tıp Fakültesi', 'Marmara University Faculty of Medicine'),
                L('Çocuk Sağlığı ve Hastalıkları Uzmanlık Eğitimi — Zeynep Kamil Kadın ve Çocuk Hastalıkları Hastanesi', 'Paediatrics Residency — Zeynep Kamil Women’s and Children’s Hospital'),
            ],
            experience: [
                L('Hisar Hospital Çamlıca — Çocuk Sağlığı ve Hastalıkları Uzmanı', 'Hisar Hospital Çamlıca — Paediatrics Specialist'),
                L('Çocuk kliniklerinde 9+ yıl klinik deneyim', '9+ years of clinical experience in paediatric clinics'),
            ],
            publications: L('Çocukluk çağı enfeksiyonları ve büyüme-gelişim izlemi konularında kongre bildirileri.', 'Congress presentations on childhood infections and growth and development monitoring.'),
            memberships: [
                L('Türk Pediatri Kurumu', 'Turkish Paediatric Institution'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd7', name: S('Prof. Dr. Ali Fedakar'), departmentSlug: 'kalp-damar-cerrahisi', hospitalSlug: 'intercontinental',
        title: L('Kalp ve Damar Cerrahisi Uzmanı', 'Cardiovascular Surgery Specialist'),
        bio: L('Koroner baypas, kalp kapak cerrahisi ve aort hastalıklarında ileri cerrahi girişimler gerçekleştirir.', 'Performs advanced surgery in coronary bypass, heart valve surgery and aortic disease.'),
        subspecialties: [L('Baypas Cerrahisi', 'Bypass Surgery'), L('Kapak Ameliyatları', 'Valve Surgery'), L('Aort Cerrahisi', 'Aortic Surgery')],
        email: 'ali.fedakar@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Prof. Dr. Ali Fedakar, koroner baypas, kalp kapak cerrahisi ve aort hastalıkları başta olmak üzere ileri kalp ve damar cerrahisi girişimleri gerçekleştiren deneyimli bir uzmandır.', 'Prof. Dr. Ali Fedakar is an experienced specialist performing advanced cardiovascular surgery, notably coronary bypass, heart valve surgery and aortic disease procedures.'),
            ],
            interventional: [
                L('Koroner baypas (CABG) cerrahisi', 'Coronary artery bypass grafting (CABG)'),
                L('Kalp kapak onarımı ve replasmanı', 'Heart valve repair and replacement'),
                L('Aort anevrizması cerrahisi', 'Aortic aneurysm surgery'),
            ],
            education: [
                L('İstanbul Üniversitesi, İstanbul Tıp Fakültesi', 'Istanbul University, Istanbul Faculty of Medicine'),
                L('Kalp ve Damar Cerrahisi Uzmanlık Eğitimi — Kartal Koşuyolu Yüksek İhtisas Hastanesi', 'Cardiovascular Surgery Residency — Kartal Koşuyolu High Specialisation Hospital'),
                L('Doçentlik / Profesörlük — Kalp ve Damar Cerrahisi', 'Associate Professorship / Professorship — Cardiovascular Surgery'),
            ],
            experience: [
                L('Hisar Hospital Intercontinental — Kalp ve Damar Cerrahisi Uzmanı', 'Hisar Hospital Intercontinental — Cardiovascular Surgery Specialist'),
                L('Kalp merkezlerinde 15+ yıl cerrahi deneyim', '15+ years of surgical experience at cardiac centres'),
            ],
            publications: L('Koroner ve kapak cerrahisi alanında uluslararası hakemli dergilerde makaleler ve kongre bildirileri.', 'Articles in international peer-reviewed journals and congress presentations in coronary and valve surgery.'),
            memberships: [
                L('Türk Kalp ve Damar Cerrahisi Derneği', 'Turkish Society of Cardiovascular Surgery'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd8', name: S('Doç. Dr. Burçin Batman'), departmentSlug: 'genel-cerrahi', hospitalSlug: 'intercontinental',
        title: L('Genel Cerrahi Uzmanı', 'General Surgery Specialist'),
        bio: L('Obezite ve metabolik cerrahi, laparoskopik ve robotik girişimlerde uzmanlaşmıştır.', 'Specializes in obesity and metabolic surgery, laparoscopic and robotic procedures.'),
        subspecialties: [L('Obezite Cerrahisi', 'Bariatric Surgery'), L('Laparoskopik Cerrahi', 'Laparoscopic Surgery'), L('Tiroid', 'Thyroid')],
        email: 'burcin.batman@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Doç. Dr. Burçin Batman, obezite ve metabolik cerrahi ile laparoskopik ve robotik girişimlerde uzmanlaşmış bir genel cerrahi uzmanıdır.', 'Assoc. Prof. Dr. Burçin Batman is a general surgery specialist focused on obesity and metabolic surgery as well as laparoscopic and robotic procedures.'),
            ],
            interventional: [
                L('Tüp mide (sleeve gastrektomi) ameliyatı', 'Sleeve gastrectomy'),
                L('Laparoskopik ve robotik safra kesesi cerrahisi', 'Laparoscopic and robotic gallbladder surgery'),
                L('Tiroid ve meme cerrahisi', 'Thyroid and breast surgery'),
            ],
            education: [
                L('Ankara Üniversitesi Tıp Fakültesi', 'Ankara University Faculty of Medicine'),
                L('Genel Cerrahi Uzmanlık Eğitimi — Şişli Etfal Eğitim ve Araştırma Hastanesi', 'General Surgery Residency — Şişli Etfal Training & Research Hospital'),
            ],
            experience: [
                L('Hisar Hospital Intercontinental — Genel Cerrahi Uzmanı', 'Hisar Hospital Intercontinental — General Surgery Specialist'),
                L('Metabolik cerrahi merkezlerinde 10+ yıl deneyim', '10+ years of experience at metabolic surgery centres'),
            ],
            publications: L('Obezite ve metabolik cerrahi alanında ulusal ve uluslararası yayınlar ve kongre bildirileri.', 'National and international publications and congress presentations in obesity and metabolic surgery.'),
            memberships: [
                L('Türk Cerrahi Derneği', 'Turkish Surgical Society'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd9', name: S('Prof. Dr. Yavuz Selim Yıldırım'), departmentSlug: 'kbb', hospitalSlug: 'camlica',
        title: L('Kulak Burun Boğaz Uzmanı', 'ENT Specialist'),
        bio: L('Endoskopik sinüs cerrahisi, burun estetiği ve uyku apnesi tedavilerinde deneyimlidir.', 'Experienced in endoscopic sinus surgery, rhinoplasty and sleep apnoea treatment.'),
        subspecialties: [L('Endoskopik Sinüs Cerrahisi', 'Endoscopic Sinus Surgery'), L('Rinoplasti', 'Rhinoplasty'), L('Uyku Apnesi', 'Sleep Apnoea')],
        email: 'yavuz.yildirim@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Prof. Dr. Yavuz Selim Yıldırım, endoskopik sinüs cerrahisi, burun estetiği (rinoplasti) ve uyku apnesi tedavilerinde deneyimli bir kulak burun boğaz uzmanıdır.', 'Prof. Dr. Yavuz Selim Yıldırım is an ENT specialist experienced in endoscopic sinus surgery, rhinoplasty and sleep apnoea treatment.'),
            ],
            interventional: [
                L('Endoskopik sinüs cerrahisi', 'Endoscopic sinus surgery'),
                L('Rinoplasti ve septum cerrahisi', 'Rhinoplasty and septal surgery'),
                L('Uyku apnesi cerrahisi ve bademcik ameliyatları', 'Sleep apnoea surgery and tonsil operations'),
            ],
            education: [
                L('Gazi Üniversitesi Tıp Fakültesi', 'Gazi University Faculty of Medicine'),
                L('Kulak Burun Boğaz Uzmanlık Eğitimi — Haseki Eğitim ve Araştırma Hastanesi', 'ENT Residency — Haseki Training & Research Hospital'),
                L('Doçentlik / Profesörlük — Kulak Burun Boğaz', 'Associate Professorship / Professorship — Otorhinolaryngology'),
            ],
            experience: [
                L('Hisar Hospital Çamlıca — Kulak Burun Boğaz Uzmanı', 'Hisar Hospital Çamlıca — ENT Specialist'),
                L('Eğitim ve araştırma hastanelerinde 14+ yıl deneyim', '14+ years of experience at training and research hospitals'),
            ],
            publications: L('Rinoloji ve uyku cerrahisi alanında uluslararası dergilerde makaleler ve kongre bildirileri.', 'Articles in international journals and congress presentations in rhinology and sleep surgery.'),
            memberships: [
                L('Türk Kulak Burun Boğaz ve Baş Boyun Cerrahisi Derneği', 'Turkish Society of Otorhinolaryngology and Head & Neck Surgery'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd10', name: S('Uzm. Dr. Nuran Burcu Arkalı'), departmentSlug: 'noroloji', hospitalSlug: 'intercontinental',
        title: L('Nöroloji Uzmanı', 'Neurology Specialist'),
        bio: L('İnme, migren ve epilepsi başta olmak üzere sinir sistemi hastalıklarının tanı ve tedavisinde çalışır.', 'Works on the diagnosis and treatment of nervous system disorders, notably stroke, migraine and epilepsy.'),
        subspecialties: [L('İnme', 'Stroke'), L('Migren', 'Migraine'), L('Epilepsi', 'Epilepsy')],
        email: 'nuran.arkali@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Uzm. Dr. Nuran Burcu Arkalı, inme, migren ve epilepsi başta olmak üzere sinir sistemi hastalıklarının tanı ve tedavisinde çalışan bir nöroloji uzmanıdır.', 'Dr. Nuran Burcu Arkalı is a neurology specialist working on the diagnosis and treatment of nervous system disorders, notably stroke, migraine and epilepsy.'),
            ],
            education: [
                L('İstanbul Üniversitesi, Cerrahpaşa Tıp Fakültesi', 'Istanbul University, Cerrahpaşa Faculty of Medicine'),
                L('Nöroloji Uzmanlık Eğitimi — İstanbul Üniversitesi Nöroloji Anabilim Dalı', 'Neurology Residency — Istanbul University Department of Neurology'),
            ],
            experience: [
                L('Hisar Hospital Intercontinental — Nöroloji Uzmanı', 'Hisar Hospital Intercontinental — Neurology Specialist'),
                L('Nöroloji kliniklerinde 8+ yıl klinik deneyim', '8+ years of clinical experience in neurology clinics'),
            ],
            publications: L('Baş ağrısı ve serebrovasküler hastalıklar konularında ulusal kongre bildirileri ve dergi yayınları.', 'National congress presentations and journal publications on headache and cerebrovascular disease.'),
            memberships: [
                L('Türk Nöroloji Derneği', 'Turkish Neurological Society'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd11', name: S('Prof. Dr. Basri Çakıroğlu'), departmentSlug: 'uroloji', hospitalSlug: 'intercontinental',
        title: L('Üroloji Uzmanı', 'Urology Specialist'),
        bio: L('Laparoskopik ve robotik ürolojik cerrahi, prostat hastalıkları ve böbrek taşı tedavisinde 20 yılı aşkın deneyime sahiptir.', 'Over 20 years of experience in laparoscopic and robotic urologic surgery, prostate disease and kidney stone treatment.'),
        subspecialties: [L('Robotik Ürolojik Cerrahi', 'Robotic Urologic Surgery'), L('Prostat Hastalıkları', 'Prostate Disease'), L('Böbrek Taşı', 'Kidney Stones')],
        email: 'basri.cakiroglu@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Prof. Dr. Basri Çakıroğlu, üroloji alanında 20 yılı aşkın klinik ve akademik deneyime sahip bir uzmandır. Özellikle laparoskopik ve robotik ürolojik cerrahi, prostat hastalıkları, böbrek taşı tedavisi ve endoüroloji alanlarında ulusal ve uluslararası düzeyde çalışmalar yürütmektedir.', 'Prof. Dr. Basri Çakıroğlu is a specialist with more than 20 years of clinical and academic experience in urology. He works at national and international level, particularly in laparoscopic and robotic urologic surgery, prostate disease, kidney stone treatment and endourology.'),
                L('Hastalarına kanıta dayalı, minimal invaziv ve bireyselleştirilmiş bir yaklaşımla hizmet veren Prof. Dr. Çakıroğlu, tanıdan tedaviye kadar tüm süreçte açık iletişim ve şeffaf bilgilendirmeyi önceliklendirir.', 'Serving his patients with an evidence-based, minimally invasive and individualised approach, Prof. Çakıroğlu prioritises open communication and transparent information throughout the entire process, from diagnosis to treatment.'),
            ],
            interventional: [
                L('Robot yardımlı radikal prostatektomi', 'Robot-assisted radical prostatectomy'),
                L('Laparoskopik böbrek cerrahisi', 'Laparoscopic kidney surgery'),
                L('Perkütan nefrolitotomi (PNL)', 'Percutaneous nephrolithotomy (PNL)'),
                L('Retrograd intrarenal cerrahi (RIRS)', 'Retrograde intrarenal surgery (RIRS)'),
                L('Prostatın lazerle tedavisi (HoLEP)', 'Laser treatment of the prostate (HoLEP)'),
                L('Üriner inkontinans cerrahisi', 'Urinary incontinence surgery'),
            ],
            education: [
                L('İstanbul Üniversitesi İstanbul Tıp Fakültesi', 'Istanbul University Istanbul Faculty of Medicine'),
                L('Üroloji Uzmanlık Eğitimi — Haseki Eğitim ve Araştırma Hastanesi', 'Urology Residency — Haseki Training & Research Hospital'),
                L('Doçentlik / Profesörlük — Üroloji', 'Associate Professorship / Professorship — Urology'),
                L('Yurt dışı klinik gözlem programları (Almanya, İtalya)', 'International clinical observation programmes (Germany, Italy)'),
            ],
            experience: [
                L('Eğitim ve araştırma hastanelerinde uzun yıllar üroloji uzmanlığı ve eğiticilik', 'Many years of urology practice and teaching at training and research hospitals'),
                L('Özel hastanelerde bölüm başkanlığı görevleri', 'Head-of-department roles at private hospitals'),
                L('Halen Hisar Hospital Intercontinental Üroloji bölümünde aktif olarak görev yapmaktadır', 'Currently practising actively in the Urology department at Hisar Hospital Intercontinental'),
            ],
            publications: L('SCI ve SCI-E kapsamlı dergilerde 100’ü aşkın uluslararası makale, çok sayıda kongre bildirisi ve kitap bölümü. Prostat, böbrek taşı ve endoüroloji konularında ödüllü çalışmalar.', 'More than 100 international articles in SCI and SCI-E indexed journals, numerous congress presentations and book chapters. Award-winning work on the prostate, kidney stones and endourology.'),
            memberships: [
                L('Türk Üroloji Derneği', 'Turkish Association of Urology'),
                L('Avrupa Üroloji Derneği (EAU)', 'European Association of Urology (EAU)'),
                L('Endoüroloji Derneği', 'Endourological Society'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd12', name: S('Doç. Dr. Elif Evrim Ekin'), departmentSlug: 'radyoloji', hospitalSlug: 'camlica',
        title: L('Radyoloji Uzmanı', 'Radiology Specialist'),
        bio: L('MR ve BT görüntüleme ile girişimsel radyoloji uygulamalarında deneyimlidir.', 'Experienced in MRI and CT imaging and interventional radiology procedures.'),
        subspecialties: [L('MR Görüntüleme', 'MRI'), L('Girişimsel Radyoloji', 'Interventional Radiology'), L('Görüntüleme Eşliğinde Biyopsi', 'Image-Guided Biopsy')],
        email: 'elif.ekin@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Doç. Dr. Elif Evrim Ekin, MR ve BT görüntüleme ile girişimsel radyoloji uygulamalarında deneyimli bir radyoloji uzmanıdır.', 'Assoc. Prof. Dr. Elif Evrim Ekin is a radiology specialist experienced in MRI and CT imaging and interventional radiology procedures.'),
            ],
            interventional: [
                L('Görüntüleme eşliğinde biyopsi', 'Image-guided biopsy'),
                L('Girişimsel radyoloji uygulamaları', 'Interventional radiology procedures'),
            ],
            education: [
                L('Uludağ Üniversitesi Tıp Fakültesi', 'Uludağ University Faculty of Medicine'),
                L('Radyoloji Uzmanlık Eğitimi — Şişli Etfal Eğitim ve Araştırma Hastanesi', 'Radiology Residency — Şişli Etfal Training & Research Hospital'),
                L('Doçentlik — Radyoloji', 'Associate Professorship — Radiology'),
            ],
            experience: [
                L('Hisar Hospital Çamlıca — Radyoloji Uzmanı', 'Hisar Hospital Çamlıca — Radiology Specialist'),
                L('Görüntüleme merkezlerinde 11+ yıl deneyim', '11+ years of experience at imaging centres'),
            ],
            publications: L('Kas-iskelet ve abdominal görüntüleme alanında uluslararası dergilerde makaleler ve kongre bildirileri.', 'Articles in international journals and congress presentations in musculoskeletal and abdominal imaging.'),
            memberships: [
                L('Türk Radyoloji Derneği (TRD)', 'Turkish Society of Radiology (TRD)'),
                L('Avrupa Radyoloji Derneği (ESR)', 'European Society of Radiology (ESR)'),
            ],
        },
    },
    {
        id: 'd13', name: S('Prof. Dr. Levent Kılıçkan'), departmentSlug: 'anesteziyoloji', hospitalSlug: 'intercontinental',
        title: L('Anesteziyoloji ve Reanimasyon Uzmanı', 'Anaesthesiology & Reanimation Specialist'),
        bio: L('Kardiyak ve yüksek riskli cerrahi anestezisi ile ağrı yönetiminde 20 yılı aşkın deneyime sahiptir; ultrason rehberli rejyonal anestezi uygulamalarında uzmandır.', 'Over 20 years of experience in cardiac and high-risk surgical anaesthesia and pain management, with expertise in ultrasound-guided regional anaesthesia.'),
        subspecialties: [L('Kardiyak Anestezi', 'Cardiac Anaesthesia'), L('Rejyonal Anestezi', 'Regional Anaesthesia'), L('Ağrı Yönetimi', 'Pain Management')],
        email: 'levent.kilickan@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Prof. Dr. Levent Kılıçkan, anesteziyoloji ve reanimasyon alanında 20 yılı aşkın klinik ve akademik deneyime sahip bir uzmandır. Özellikle kardiyak anestezi, yüksek riskli cerrahi anestezisi, ultrason rehberli rejyonal anestezi ve girişimsel ağrı tedavisi alanlarında çalışmalar yürütmektedir.', 'Prof. Dr. Levent Kılıçkan is a specialist with more than 20 years of clinical and academic experience in anaesthesiology and reanimation. He works particularly in cardiac anaesthesia, high-risk surgical anaesthesia, ultrasound-guided regional anaesthesia and interventional pain treatment.'),
                L('Hastalarına kanıta dayalı ve bireyselleştirilmiş bir yaklaşımla hizmet veren Prof. Dr. Kılıçkan, ameliyat öncesi değerlendirmeden ağrısız iyileşme sürecine kadar hasta güvenliğini ve konforunu önceliklendirir.', 'Serving his patients with an evidence-based, individualised approach, Prof. Kılıçkan prioritises patient safety and comfort from the pre-operative assessment through to a pain-free recovery.'),
            ],
            interventional: [
                L('Ultrason rehberli periferik sinir blokları', 'Ultrasound-guided peripheral nerve blocks'),
                L('Kardiyak cerrahide anestezi yönetimi', 'Anaesthesia management in cardiac surgery'),
                L('Epidural ve spinal anestezi uygulamaları', 'Epidural and spinal anaesthesia procedures'),
                L('Girişimsel ağrı tedavisi (radyofrekans, epidural enjeksiyon)', 'Interventional pain treatment (radiofrequency, epidural injection)'),
            ],
            education: [
                L('İstanbul Üniversitesi, Cerrahpaşa Tıp Fakültesi', 'Istanbul University, Cerrahpaşa Faculty of Medicine'),
                L('Anesteziyoloji ve Reanimasyon Uzmanlık Eğitimi — Cerrahpaşa Tıp Fakültesi', 'Anaesthesiology & Reanimation Residency — Cerrahpaşa Faculty of Medicine'),
                L('Doçentlik / Profesörlük — Anesteziyoloji ve Reanimasyon', 'Associate Professorship / Professorship — Anaesthesiology & Reanimation'),
            ],
            experience: [
                L('Hisar Hospital Intercontinental — Anesteziyoloji ve Reanimasyon Bölüm Başkanı', 'Hisar Hospital Intercontinental — Head of Anaesthesiology & Reanimation'),
                L('Üniversite hastanelerinde 15+ yıl öğretim üyeliği ve eğiticilik', '15+ years of faculty and teaching roles at university hospitals'),
                L('Binlerce kardiyak ve yüksek riskli cerrahi anestezi uygulaması', 'Thousands of cardiac and high-risk surgical anaesthesia procedures'),
            ],
            publications: L('SCI ve SCI-E kapsamlı dergilerde çok sayıda uluslararası makale, kongre bildirisi ve kitap bölümü. Kardiyak anestezi ve ağrı yönetimi konularında çalışmalar.', 'Numerous international articles in SCI and SCI-E indexed journals, congress presentations and book chapters. Work on cardiac anaesthesia and pain management.'),
            memberships: [
                L('Türk Anesteziyoloji ve Reanimasyon Derneği (TARD)', 'Turkish Society of Anaesthesiology and Reanimation (TARD)'),
                L('Avrupa Anesteziyoloji Derneği (ESAIC)', 'European Society of Anaesthesiology and Intensive Care (ESAIC)'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd14', name: S('Prof. Dr. Yakup Tomak'), departmentSlug: 'anesteziyoloji', hospitalSlug: 'intercontinental',
        title: L('Anesteziyoloji ve Reanimasyon Uzmanı', 'Anaesthesiology & Reanimation Specialist'),
        bio: L('Yoğun bakım, obezite cerrahisi anestezisi ve total intravenöz anestezi (TIVA) konularında deneyimlidir.', 'Experienced in intensive care, bariatric surgery anaesthesia and total intravenous anaesthesia (TIVA).'),
        subspecialties: [L('Yoğun Bakım', 'Intensive Care'), L('Obezite Cerrahisi Anestezisi', 'Bariatric Anaesthesia'), L('TIVA', 'TIVA')],
        email: 'yakup.tomak@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Prof. Dr. Yakup Tomak, anesteziyoloji ve reanimasyon alanında deneyimli bir uzmandır. Yoğun bakım, obezite cerrahisi anestezisi, total intravenöz anestezi (TIVA) ve perioperatif hasta güvenliği konularında çalışmalar yürütmektedir.', 'Prof. Dr. Yakup Tomak is an experienced anaesthesiology and reanimation specialist. He works on intensive care, bariatric surgery anaesthesia, total intravenous anaesthesia (TIVA) and perioperative patient safety.'),
            ],
            interventional: [
                L('Total intravenöz anestezi (TIVA) uygulamaları', 'Total intravenous anaesthesia (TIVA) procedures'),
                L('Obezite ve yüksek riskli cerrahide anestezi yönetimi', 'Anaesthesia management in bariatric and high-risk surgery'),
                L('Yoğun bakım ve ileri yaşam desteği', 'Intensive care and advanced life support'),
            ],
            education: [
                L('Ondokuz Mayıs Üniversitesi Tıp Fakültesi', 'Ondokuz Mayıs University Faculty of Medicine'),
                L('Anesteziyoloji ve Reanimasyon Uzmanlık Eğitimi — Şişli Etfal Eğitim ve Araştırma Hastanesi', 'Anaesthesiology & Reanimation Residency — Şişli Etfal Training & Research Hospital'),
                L('Doçentlik / Profesörlük — Anesteziyoloji ve Reanimasyon', 'Associate Professorship / Professorship — Anaesthesiology & Reanimation'),
            ],
            experience: [
                L('Hisar Hospital Intercontinental — Anesteziyoloji ve Reanimasyon Uzmanı', 'Hisar Hospital Intercontinental — Anaesthesiology & Reanimation Specialist'),
                L('Üniversite ve eğitim hastanelerinde 15+ yıl deneyim', '15+ years of experience at university and training hospitals'),
            ],
            publications: L('Yoğun bakım ve perioperatif anestezi alanında uluslararası hakemli dergilerde makaleler ve kongre bildirileri.', 'Articles in international peer-reviewed journals and congress presentations in intensive care and perioperative anaesthesia.'),
            memberships: [
                L('Türk Anesteziyoloji ve Reanimasyon Derneği (TARD)', 'Turkish Society of Anaesthesiology and Reanimation (TARD)'),
                L('Türk Yoğun Bakım Derneği', 'Turkish Society of Intensive Care'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd15', name: S('Uzm. Dr. Nermin Ünlü'), departmentSlug: 'anesteziyoloji', hospitalSlug: 'camlica',
        title: L('Anesteziyoloji ve Reanimasyon Uzmanı', 'Anaesthesiology & Reanimation Specialist'),
        bio: L('Ağrısız doğum, obstetrik anestezi ve pediatrik anestezi uygulamalarında geniş klinik deneyime sahiptir.', 'Extensive clinical experience in painless labour, obstetric anaesthesia and paediatric anaesthesia.'),
        subspecialties: [L('Obstetrik Anestezi', 'Obstetric Anaesthesia'), L('Ağrısız Doğum', 'Painless Labour'), L('Pediatrik Anestezi', 'Paediatric Anaesthesia')],
        email: 'nermin.unlu@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Uzm. Dr. Nermin Ünlü, obstetrik anestezi, ağrısız doğum (epidural analjezi) ve pediatrik anestezi konularında geniş klinik deneyime sahip bir anesteziyoloji ve reanimasyon uzmanıdır.', 'Dr. Nermin Ünlü is an anaesthesiology and reanimation specialist with broad clinical experience in obstetric anaesthesia, painless labour (epidural analgesia) and paediatric anaesthesia.'),
            ],
            interventional: [
                L('Ağrısız doğumda epidural analjezi', 'Epidural analgesia for painless labour'),
                L('Sezaryen ve jinekolojik girişimlerde anestezi', 'Anaesthesia for caesarean section and gynaecological procedures'),
                L('Pediatrik hastalarda anestezi ve sedasyon', 'Anaesthesia and sedation in paediatric patients'),
            ],
            education: [
                L('Marmara Üniversitesi Tıp Fakültesi', 'Marmara University Faculty of Medicine'),
                L('Anesteziyoloji ve Reanimasyon Uzmanlık Eğitimi — Zeynep Kamil Kadın ve Çocuk Hastalıkları Hastanesi', 'Anaesthesiology & Reanimation Residency — Zeynep Kamil Women’s and Children’s Hospital'),
            ],
            experience: [
                L('Hisar Hospital Çamlıca — Anesteziyoloji ve Reanimasyon Uzmanı', 'Hisar Hospital Çamlıca — Anaesthesiology & Reanimation Specialist'),
                L('Kadın-doğum ve çocuk hastanelerinde 10+ yıl klinik deneyim', '10+ years of clinical experience at maternity and children’s hospitals'),
            ],
            publications: L('Obstetrik anestezi ve ağrısız doğum konularında ulusal kongre bildirileri ve dergi yayınları.', 'National congress presentations and journal publications on obstetric anaesthesia and painless labour.'),
            memberships: [
                L('Türk Anesteziyoloji ve Reanimasyon Derneği (TARD)', 'Turkish Society of Anaesthesiology and Reanimation (TARD)'),
                L('Obstetrik Anestezi Derneği', 'Obstetric Anaesthesia Society'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd16', name: S('Doç. Dr. Serpil Şehirlioğlu'), departmentSlug: 'anesteziyoloji', hospitalSlug: 'intercontinental',
        title: L('Anesteziyoloji ve Reanimasyon Uzmanı', 'Anaesthesiology & Reanimation Specialist'),
        bio: L('Girişimsel algoloji, kronik ağrı tedavisi ve nöromodülasyon uygulamalarında deneyimlidir.', 'Experienced in interventional algology, chronic pain treatment and neuromodulation.'),
        subspecialties: [L('Algoloji', 'Algology'), L('Kronik Ağrı', 'Chronic Pain'), L('Nöromodülasyon', 'Neuromodulation')],
        email: 'serpil.sehirlioglu@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Doç. Dr. Serpil Şehirlioğlu, girişimsel algoloji, kronik ağrı tedavisi, radyofrekans termokoagülasyon ve nöromodülasyon uygulamalarında deneyimli bir anesteziyoloji ve algoloji uzmanıdır.', 'Assoc. Prof. Dr. Serpil Şehirlioğlu is an anaesthesiology and algology specialist experienced in interventional algology, chronic pain treatment, radiofrequency thermocoagulation and neuromodulation.'),
            ],
            interventional: [
                L('Epidural ve transforaminal enjeksiyonlar', 'Epidural and transforaminal injections'),
                L('Radyofrekans termokoagülasyon', 'Radiofrequency thermocoagulation'),
                L('Nöromodülasyon ve ağrı pili uygulamaları', 'Neuromodulation and pain-pacemaker procedures'),
            ],
            education: [
                L('Ankara Üniversitesi Tıp Fakültesi', 'Ankara University Faculty of Medicine'),
                L('Anesteziyoloji ve Reanimasyon Uzmanlık Eğitimi — Ankara Numune Eğitim ve Araştırma Hastanesi', 'Anaesthesiology & Reanimation Residency — Ankara Numune Training & Research Hospital'),
                L('Algoloji Yan Dal Uzmanlığı', 'Algology (Pain Medicine) Fellowship'),
            ],
            experience: [
                L('Hisar Hospital Intercontinental — Ağrı Polikliniği Sorumlusu', 'Hisar Hospital Intercontinental — Head of the Pain Clinic'),
                L('Ağrı merkezlerinde 12+ yıl klinik deneyim', '12+ years of clinical experience at pain centres'),
            ],
            publications: L('Girişimsel ağrı tedavisi ve nöromodülasyon alanında uluslararası dergilerde makaleler ve kongre bildirileri.', 'Articles in international journals and congress presentations in interventional pain treatment and neuromodulation.'),
            memberships: [
                L('Türk Algoloji (Ağrı) Derneği', 'Turkish Algology (Pain) Society'),
                L('Türk Anesteziyoloji ve Reanimasyon Derneği (TARD)', 'Turkish Society of Anaesthesiology and Reanimation (TARD)'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
    {
        id: 'd17', name: S('Uzm. Dr. Barış Arslan'), departmentSlug: 'anesteziyoloji', hospitalSlug: 'camlica',
        title: L('Anesteziyoloji ve Reanimasyon Uzmanı', 'Anaesthesiology & Reanimation Specialist'),
        bio: L('Ortopedik protez cerrahisi anestezisi, rejyonal blok uygulamaları ve nöromonitorizasyon konularında çalışır.', 'Works on anaesthesia for orthopaedic joint-replacement surgery, regional block procedures and neuromonitoring.'),
        subspecialties: [L('Ortopedik Anestezi', 'Orthopaedic Anaesthesia'), L('Rejyonal Blok', 'Regional Block'), L('Nöromonitorizasyon', 'Neuromonitoring')],
        email: 'baris.arslan@hisarhospital.com', languages: LANGS,
        cv: {
            about: [
                L('Uzm. Dr. Barış Arslan, ortopedik protez cerrahisi anestezisi, ultrason rehberli rejyonal blok uygulamaları ve ameliyat içi nöromonitorizasyon konularında çalışan bir anesteziyoloji ve reanimasyon uzmanıdır.', 'Dr. Barış Arslan is an anaesthesiology and reanimation specialist working on anaesthesia for orthopaedic joint-replacement surgery, ultrasound-guided regional block procedures and intraoperative neuromonitoring.'),
            ],
            interventional: [
                L('Ultrason rehberli rejyonal sinir blokları', 'Ultrasound-guided regional nerve blocks'),
                L('Ortopedik protez cerrahisinde anestezi yönetimi', 'Anaesthesia management in orthopaedic joint-replacement surgery'),
                L('Ameliyat içi nöromonitorizasyon', 'Intraoperative neuromonitoring'),
            ],
            education: [
                L('Ege Üniversitesi Tıp Fakültesi', 'Ege University Faculty of Medicine'),
                L('Anesteziyoloji ve Reanimasyon Uzmanlık Eğitimi — İzmir Katip Çelebi Üniversitesi Atatürk Eğitim ve Araştırma Hastanesi', 'Anaesthesiology & Reanimation Residency — İzmir Katip Çelebi University Atatürk Training & Research Hospital'),
            ],
            experience: [
                L('Hisar Hospital Çamlıca — Anesteziyoloji ve Reanimasyon Uzmanı', 'Hisar Hospital Çamlıca — Anaesthesiology & Reanimation Specialist'),
                L('Eğitim ve araştırma hastanelerinde 8+ yıl klinik deneyim', '8+ years of clinical experience at training and research hospitals'),
            ],
            publications: L('Rejyonal anestezi ve nöromonitorizasyon konularında ulusal kongre bildirileri ve dergi yayınları.', 'National congress presentations and journal publications on regional anaesthesia and neuromonitoring.'),
            memberships: [
                L('Türk Anesteziyoloji ve Reanimasyon Derneği (TARD)', 'Turkish Society of Anaesthesiology and Reanimation (TARD)'),
                L('Rejyonal Anestezi Derneği', 'Regional Anaesthesia Society'),
                L('Türk Tabipleri Birliği', 'Turkish Medical Association'),
            ],
        },
    },
];
function resolveDoctor(d: DoctorSrc, l: Locale): Doctor {
    return {
        id: d.id, name: d.name[l], title: d.title[l], bio: d.bio[l],
        department: deptName(d.departmentSlug, l), departmentSlug: d.departmentSlug,
        hospitalSlug: d.hospitalSlug, photo: d.photo, subspecialties: d.subspecialties.map((s) => s[l]),
        email: d.email,
        languages: d.languages ? d.languages.map((x) => x[l]) : undefined,
        cv: d.cv
            ? {
                  about: d.cv.about.map((x) => x[l]),
                  interventional: d.cv.interventional ? d.cv.interventional.map((x) => x[l]) : undefined,
                  education: d.cv.education.map((x) => x[l]),
                  experience: d.cv.experience.map((x) => x[l]),
                  publications: d.cv.publications[l],
                  memberships: d.cv.memberships.map((x) => x[l]),
              }
            : undefined,
    };
}
export function getDoctors(l: Locale): Doctor[] { return DOCTORS_SRC.map((d) => resolveDoctor(d, l)); }
export function useDoctors(): Doctor[] { const l = useLocale(); const c = useCatalog<Doctor>('doctors'); return c ?? getDoctors(l); }
export function getDoctorById(id: string, l: Locale): Doctor | undefined {
    const __r = readRecordProp(); if (__r && __r.id === id) return __r as Doctor;
    const d = DOCTORS_SRC.find((x) => x.id === id);
    return d ? resolveDoctor(d, l) : undefined;
}
/** Doctors linked to a department slug (relation helper for detail pages). */
export function getDoctorsForDept(deptSlug: string, l: Locale): Doctor[] {
    const rel = readRelatedProp();
    if (rel && Array.isArray(rel.doctors)) return rel.doctors as unknown as Doctor[];
    const cat = useCatalog<Doctor>('doctors');
    if (cat) return cat.filter((d) => d.departmentSlug === deptSlug);
    return DOCTORS_SRC.filter((d) => d.departmentSlug === deptSlug).map((d) => resolveDoctor(d, l));
}
/** Published hospitals where a department has doctors, with the doctor count (relation helper). */
export function getHospitalsForDept(deptSlug: string, l: Locale): { hospital: Hospital; count: number }[] {
    const rel = readRelatedProp();
    if (rel && Array.isArray(rel.hospitals)) {
        return rel.hospitals as unknown as { hospital: Hospital; count: number }[];
    }
    const catH = useCatalog<Hospital>('hospitals');
    const catD = useCatalog<Doctor>('doctors');
    if (catH && catD) {
        const counts = new Map<string, number>();
        for (const d of catD) {
            if (d.departmentSlug === deptSlug) counts.set(d.hospitalSlug, (counts.get(d.hospitalSlug) ?? 0) + 1);
        }
        return catH
            .filter((h) => !h.comingSoon && counts.has(h.slug))
            .map((h) => ({ hospital: h, count: counts.get(h.slug)! }));
    }
    const counts = new Map<string, number>();
    for (const d of DOCTORS_SRC) {
        if (d.departmentSlug === deptSlug) counts.set(d.hospitalSlug, (counts.get(d.hospitalSlug) ?? 0) + 1);
    }
    return HOSPITALS_SRC.filter((h) => !h.comingSoon && counts.has(h.slug)).map((h) => ({
        hospital: resolveHospital(h, l),
        count: counts.get(h.slug)!,
    }));
}
/** Resolve a single hospital by slug (relation helper for detail pages). */
export function getHospitalBySlug(slug: string, l: Locale): Hospital | undefined {
    const __r = readRecordProp(); if (__r && __r.slug === slug) return __r as Hospital;
    const h = HOSPITALS_SRC.find((x) => x.slug === slug);
    return h ? resolveHospital(h, l) : undefined;
}
/** All doctors practising at a hospital (relation helper for the hospital detail page). */
export function getDoctorsForHospital(hospitalSlug: string, l: Locale): Doctor[] {
    const cat = useCatalog<Doctor>('doctors');
    if (cat) return cat.filter((d) => d.hospitalSlug === hospitalSlug);
    return DOCTORS_SRC.filter((d) => d.hospitalSlug === hospitalSlug).map((d) => resolveDoctor(d, l));
}
/**
 * Departments shown on a hospital detail page. Prefers the explicit editorial list passed as
 * the `related.departments` prop (Hospital↔Department link, with doctor-derived fallback resolved
 * server-side); otherwise derives them from the hospital's doctors, in canonical department order.
 */
export function getDepartmentsForHospital(hospitalSlug: string, l: Locale): Department[] {
    const rel = readRelatedProp();
    if (rel && Array.isArray(rel.departments)) {
        return (rel.departments as Array<Record<string, unknown>>).map((d) => ({
            ...(d as unknown as Department),
            icon: iconFor((d as { icon?: string }).icon),
        }));
    }
    const slugs = new Set(DOCTORS_SRC.filter((d) => d.hospitalSlug === hospitalSlug).map((d) => d.departmentSlug));
    return DEPARTMENTS_SRC.filter((d) => slugs.has(d.slug)).map((d) => resolveDept(d, l));
}

/* ── Hospital detail (long-form "Hakkında" + features/tech/gallery/rooms/transport), keyed by hospital slug ── */
type HospitalDetailSrc = {
    about: Loc[];
    features: { title: Loc; desc: Loc }[];
    technologies: { name: Loc; desc: Loc }[];
    gallery: { image: string; caption: Loc }[];
    rooms: { name: Loc; desc: Loc; image: string }[];
    transport: Loc[];
    emergency: Loc;
    workingHours: Loc;
    mapQuery: string;
};
const HOSPITAL_DETAILS_SRC: Record<string, HospitalDetailSrc> = {
    intercontinental: {
        about: [
            L(
                'Hisar Hospital Intercontinental; onkolojiden robotik cerrahiye, ileri kardiyolojiden görüntülemeye kadar çok disiplinli sağlık hizmeti sunan JCI onaylı bir kampüstür. Hasta odaklı hizmet anlayışı ve ileri klinik altyapısıyla tanıdan tedaviye, rehabilitasyondan takibe kadar bütüncül bir deneyim sağlar.',
                'Hisar Hospital Intercontinental is a JCI-accredited campus offering multidisciplinary care from oncology to robotic surgery, and from advanced cardiology to imaging. With its patient-centred approach and advanced clinical infrastructure, it delivers a holistic experience from diagnosis to treatment and from rehabilitation to follow-up.',
            ),
            L(
                'Kampüs; multidisipliner tümör konseyi, Da Vinci robotik cerrahi platformu, 3T MR ve PET-CT gibi ileri görüntüleme sistemleri, dijital anjiyografi laboratuvarı ve 7/24 acil servisiyle geniş bir hizmet yelpazesi sunar. Uluslararası hasta birimi; çok dilli hizmet, tercümanlık ve konaklama desteğiyle yurt dışından gelen hastaların tüm sürecini yönetir.',
                'The campus offers a broad range of services with a multidisciplinary tumour board, the Da Vinci robotic surgery platform, advanced imaging systems such as 3T MRI and PET-CT, a digital angiography laboratory and a 24/7 emergency department. The international patient unit manages the entire journey of patients coming from abroad with multilingual service, interpreting and accommodation support.',
            ),
            L(
                'Konforlu hasta odaları, geniş poliklinik alanları ve deneyimli hekim kadrosuyla Hisar Hospital Intercontinental, İstanbul’un Anadolu yakasında referans bir sağlık merkezidir. Kalite ve hasta güvenliği standartları uluslararası akreditasyonlarla güvence altına alınmıştır.',
                'With comfortable patient rooms, spacious outpatient areas and an experienced medical team, Hisar Hospital Intercontinental is a reference health centre on the Anatolian side of Istanbul. Quality and patient-safety standards are secured by international accreditations.',
            ),
        ],
        features: [
            { title: L('JCI Akreditasyonu', 'JCI Accreditation'), desc: L('Uluslararası kalite ve hasta güvenliği standartları.', 'International quality and patient-safety standards.') },
            { title: L('Onkoloji Merkezi', 'Oncology Centre'), desc: L('Multidisipliner tümör konseyi ve kişiye özel tedavi.', 'Multidisciplinary tumour board and personalised treatment.') },
            { title: L('Da Vinci Robotik Cerrahi', 'Da Vinci Robotic Surgery'), desc: L('Yüksek hassasiyetli robotik ameliyat platformu.', 'High-precision robotic surgery platform.') },
            { title: L('İleri Görüntüleme', 'Advanced Imaging'), desc: L('3T MR, PET-CT ve dijital anjiyografi.', '3T MRI, PET-CT and digital angiography.') },
            { title: L('24 Saat Acil', '24-Hour Emergency'), desc: L('Deneyimli acil ekibi ve travma ünitesi.', 'Experienced emergency team and trauma unit.') },
            { title: L('Uluslararası Hasta', 'International Patients'), desc: L('Çok dilli hasta hizmetleri ve konaklama desteği.', 'Multilingual patient services and accommodation support.') },
        ],
        technologies: [
            { name: L('Da Vinci Robotik Cerrahi', 'Da Vinci Robotic Surgery'), desc: L('Üç boyutlu görüntü ile minimal invaziv cerrahi.', 'Minimally invasive surgery with 3D vision.') },
            { name: L('PET-CT / 3T MR', 'PET-CT / 3T MRI'), desc: L('Yüksek çözünürlüklü ileri görüntüleme.', 'High-resolution advanced imaging.') },
            { name: L('MR-LINAC Radyoterapi', 'MR-LINAC Radiotherapy'), desc: L('Görüntü rehberli, hedefe yönelik ışın tedavisi.', 'Image-guided, targeted radiotherapy.') },
            { name: L('Dijital Anjiyografi', 'Digital Angiography'), desc: L('Girişimsel kardiyoloji için kateter laboratuvarı.', 'Catheter laboratory for interventional cardiology.') },
        ],
        gallery: [
            { image: IMG.lobby, caption: L('Ana Lobi', 'Main Lobby') },
            { image: IMG.waitingRoom, caption: L('Bekleme Salonu', 'Waiting Lounge') },
            { image: IMG.roomSuperior, caption: L('Superior Hasta Odası', 'Superior Patient Room') },
            { image: IMG.imaging, caption: L('MR-LINAC Radyoterapi', 'MR-LINAC Radiotherapy') },
            { image: IMG.onco, caption: L('Kemoterapi Ünitesi', 'Chemotherapy Unit') },
            { image: IMG.corridor, caption: L('Poliklinik Bekleme', 'Outpatient Waiting') },
            { image: IMG.exterior, caption: L('Hastane Binası', 'Hospital Building') },
        ],
        rooms: [
            { name: L('Standart Oda', 'Standard Room'), image: IMG.roomStandard, desc: L('Tek kişilik konfor, refakatçi kanepesi, klimalı ve sessiz ortam.', 'Single-occupancy comfort, companion sofa, air-conditioned and quiet.') },
            { name: L('Superior Oda', 'Superior Room'), image: IMG.roomSuperior, desc: L('Geniş banyo, akıllı TV, ücretsiz Wi-Fi ve şehir manzarası.', 'Spacious bathroom, smart TV, free Wi-Fi and a city view.') },
            { name: L('Suit Oda', 'Suite Room'), image: IMG.roomSuite, desc: L('Ayrı oturma alanı, doğa temalı tasarım ve premium konaklama.', 'Separate sitting area, nature-themed design and premium accommodation.') },
        ],
        transport: [
            L('Metro: Çakmak (M5) — 8 dk', 'Metro: Çakmak (M5) — 8 min'),
            L('Metrobüs: Söğütlüçeşme yönünden erişim', 'Metrobus: access from the Söğütlüçeşme direction'),
            L('Otopark: Kapalı, ücretsiz vale hizmeti', 'Parking: indoor, free valet service'),
        ],
        emergency: L('24 Saat Acil Servis', '24-Hour Emergency Service'),
        workingHours: L('7/24 Açık', 'Open 24/7'),
        mapQuery: 'Hisar Hospital Intercontinental',
    },
    camlica: {
        about: [
            L(
                'Hisar Hospital Çamlıca; İstanbul Üsküdar’da, kadın hastalıkları ve doğum, çocuk sağlığı, kulak burun boğaz ve radyoloji başta olmak üzere geniş bir branş yelpazesinde hizmet veren, aileye yakın konumlu bir hastanedir. Sıcak ve güler yüzlü hizmet anlayışıyla poliklinikten yatışa kadar konforlu bir deneyim sunar.',
                'Hisar Hospital Çamlıca is a family-friendly hospital in Üsküdar, Istanbul, serving a broad range of specialties led by obstetrics and gynaecology, paediatrics, ENT and radiology. With a warm and welcoming approach, it offers a comfortable experience from outpatient visits to admission.',
            ),
            L(
                'Modern doğumhane, yenidoğan bakım üniteleri ve gebe okulu programlarıyla anne-bebek sağlığında güçlü bir merkezdir. Görüntüleme ve laboratuvar altyapısı, hızlı ve güvenilir tanı süreçlerini destekler.',
                'With a modern delivery suite, newborn care units and antenatal school programmes, it is a strong centre for maternal and infant health. Its imaging and laboratory infrastructure supports fast, reliable diagnostic processes.',
            ),
        ],
        features: [
            { title: L('Kadın-Doğum Merkezi', 'Obstetrics & Gynaecology Centre'), desc: L('Modern doğumhane ve gebe okulu programları.', 'Modern delivery suite and antenatal school programmes.') },
            { title: L('Çocuk Sağlığı', 'Child Health'), desc: L('Yenidoğan takibi, aşılama ve büyüme-gelişim izlemi.', 'Newborn follow-up, vaccination and growth monitoring.') },
            { title: L('İleri Görüntüleme', 'Advanced Imaging'), desc: L('MR, BT ve ultrason ile hızlı tanı.', 'Fast diagnosis with MRI, CT and ultrasound.') },
            { title: L('Aileye Yakın Konum', 'Family-Friendly Location'), desc: L('Üsküdar’da kolay ulaşılabilir kampüs.', 'An easily accessible campus in Üsküdar.') },
        ],
        technologies: [
            { name: L('4D Ultrason', '4D Ultrasound'), desc: L('Gebelik takibinde ayrıntılı görüntüleme.', 'Detailed imaging in pregnancy follow-up.') },
            { name: L('Dijital Mamografi', 'Digital Mammography'), desc: L('Meme sağlığı taramasında düşük doz görüntüleme.', 'Low-dose imaging for breast health screening.') },
            { name: L('Manyetik Rezonans (MR)', 'Magnetic Resonance (MRI)'), desc: L('Radyasyonsuz, yüksek çözünürlüklü tanı.', 'Radiation-free, high-resolution diagnosis.') },
        ],
        gallery: [
            { image: IMG.hospitalB, caption: L('Hastane Girişi', 'Hospital Entrance') },
            { image: IMG.lobby, caption: L('Ana Lobi', 'Main Lobby') },
            { image: IMG.women, caption: L('Doğumhane', 'Delivery Suite') },
            { image: IMG.roomStandard, caption: L('Hasta Odası', 'Patient Room') },
            { image: IMG.child, caption: L('Çocuk Polikliniği', 'Paediatric Clinic') },
        ],
        rooms: [
            { name: L('Standart Oda', 'Standard Room'), image: IMG.roomStandard, desc: L('Tek kişilik konfor ve refakatçi kanepesi.', 'Single-occupancy comfort and a companion sofa.') },
            { name: L('Anne-Bebek Odası', 'Mother & Baby Room'), image: IMG.roomSuperior, desc: L('Doğum sonrası konfor için tasarlanmış aile odası.', 'A family room designed for postnatal comfort.') },
        ],
        transport: [
            L('Metro: Ünalan (M4) üzerinden erişim', 'Metro: access via Ünalan (M4)'),
            L('Otobüs: Üsküdar hatlarıyla ulaşım', 'Bus: access via Üsküdar lines'),
            L('Otopark: Ücretsiz hasta otoparkı', 'Parking: free patient parking'),
        ],
        emergency: L('24 Saat Acil Servis', '24-Hour Emergency Service'),
        workingHours: L('7/24 Açık', 'Open 24/7'),
        mapQuery: 'Hisar Hospital Çamlıca',
    },
    avrupa: {
        about: [
            L(
                'Hisar Hospital Avrupa; İstanbul’un Avrupa yakasında yakında hizmete girecek yeni kampüsümüzdür. Açılışıyla birlikte çok disiplinli sağlık hizmetleri, ileri teknoloji altyapısı ve konforlu hasta deneyimi bu bölgede de sunulacaktır.',
                'Hisar Hospital Avrupa is our new campus opening soon on the European side of Istanbul. With its opening, multidisciplinary healthcare, advanced technology infrastructure and a comfortable patient experience will also be offered in this region.',
            ),
        ],
        features: [],
        technologies: [],
        gallery: [],
        rooms: [],
        transport: [],
        emergency: L('Yakında', 'Coming soon'),
        workingHours: L('Yakında', 'Coming soon'),
        mapQuery: 'Hisar Hospital Avrupa İstanbul',
    },
};
function resolveHospitalDetail(d: HospitalDetailSrc, l: Locale): HospitalDetail {
    return {
        about: d.about.map((p) => p[l]),
        features: d.features.map((f) => ({ title: f.title[l], desc: f.desc[l] })),
        technologies: d.technologies.map((t) => ({ name: t.name[l], desc: t.desc[l] })),
        gallery: d.gallery.map((g) => ({ image: g.image, caption: g.caption[l] })),
        rooms: d.rooms.map((r) => ({ name: r.name[l], desc: r.desc[l], image: r.image })),
        transport: d.transport.map((t) => t[l]),
        emergency: d.emergency[l],
        workingHours: d.workingHours[l],
        mapQuery: d.mapQuery,
    };
}
/** Long-form detail for a hospital slug, or undefined when the hospital has no authored detail. */
export function getHospitalDetail(slug: string, l: Locale): HospitalDetail | undefined {
    const __r = readRecordProp(); if (__r && __r.slug === slug) return __r.detail as HospitalDetail;
    const d = HOSPITAL_DETAILS_SRC[slug];
    return d ? resolveHospitalDetail(d, l) : undefined;
}
export function useHospitalDetail(slug: string): HospitalDetail | undefined {
    return getHospitalDetail(slug, useLocale());
}

/* ── Treatments — representative sample enriched with detail, related by slug ── */
type TreatmentSrc = {
    slug: string;
    name: Loc;
    summary: Loc;
    deptSlug: string;
    cover: string;
    detail: {
        procedure: Loc;
        advantages: Loc[];
        process: { title: Loc; desc: Loc }[];
        what?: Loc;
        candidates?: Loc[];
        cautions?: Loc[];
        relatedDiseases?: Loc[];
        technologies?: Loc[];
        faqs?: { q: Loc; a: Loc }[];
    };
};
const TREATMENTS_SRC: TreatmentSrc[] = [
    {
        slug: 'acik-kalp-ameliyati', deptSlug: 'kalp-damar-cerrahisi', cover: IMG.cardio,
        name: L('Açık Kalp Ameliyatı', 'Open-Heart Surgery'),
        summary: L('Koroner, kapak ve aort hastalıklarında kalbin doğrudan görülerek onarıldığı ileri kardiyovasküler cerrahi girişim.', 'Advanced cardiovascular surgery in which the heart is repaired under direct vision for coronary, valve and aortic disease.'),
        detail: {
            procedure: L('İşlem genel anestezi altında yapılır; göğüs kemiği açılır, kalp-akciğer makinesi devreye alınarak sorunlu bölge onarılır veya değiştirilir. İşlem cerrahiye göre 3-6 saat sürer.', 'Performed under general anaesthesia; the sternum is opened, the heart-lung machine is engaged and the affected area is repaired or replaced. The procedure takes 3-6 hours depending on the surgery.'),
            advantages: [L('Kompleks patolojilerde kalıcı çözüm', 'Durable solution for complex pathologies'), L('Deneyimli KVC ekibi', 'Experienced cardiovascular team'), L('7/24 kardiyak yoğun bakım', '24/7 cardiac intensive care')],
            process: [
                { title: L('Hazırlık', 'Preparation'), desc: L('Anjiyografi, ekokardiyografi ve anestezi değerlendirmesi.', 'Angiography, echocardiography and anaesthesia assessment.') },
                { title: L('İşlem Günü', 'Procedure Day'), desc: L('Genel anestezi altında cerrahi onarım ve yoğun bakım takibi.', 'Surgical repair under general anaesthesia and intensive-care follow-up.') },
                { title: L('İyileşme', 'Recovery'), desc: L('Servis takibi ve kademeli kardiyak rehabilitasyon.', 'Ward follow-up and gradual cardiac rehabilitation.') },
            ],
            what: L('Açık kalp cerrahisinde göğüs kemiği (sternum) ortadan açılarak kalbe doğrudan ulaşılır. İşlem sırasında genellikle kalp-akciğer makinesi (pompa) devreye alınır ve kalp kısa süreliğine durdurularak damar, kapak veya duvar onarımları gerçekleştirilir. Hisar Hospital Kalp ve Damar Cerrahisi ekibi; koroner baypas, kapak değişimi/onarımı, aort cerrahisi ve doğumsal kalp hastalıklarında modern protokollerle bu girişimleri uygular.', 'In open-heart surgery, the breastbone (sternum) is opened down the middle to reach the heart directly. During the procedure the heart-lung machine (pump) is usually engaged and the heart is briefly stopped so that vessel, valve or wall repairs can be performed. The Hisar Hospital Cardiovascular Surgery team performs these procedures with modern protocols for coronary bypass, valve replacement/repair, aortic surgery and congenital heart disease.'),
            candidates: [
                L('Çok damar hastalığı bulunan ileri koroner arter hastaları', 'Advanced coronary artery patients with multi-vessel disease'),
                L('Ciddi darlık veya yetmezlik gösteren kalp kapak hastaları', 'Heart valve patients with severe stenosis or regurgitation'),
                L('Aort anevrizması veya diseksiyonu tanısı alan hastalar', 'Patients diagnosed with an aortic aneurysm or dissection'),
                L('Doğumsal kalp defekti bulunan çocuk ve erişkin hastalar', 'Paediatric and adult patients with a congenital heart defect'),
                L('Girişimsel yöntemlerin (stent, TAVI vb.) uygun olmadığı olgular', 'Cases where interventional methods (stent, TAVI, etc.) are unsuitable'),
            ],
            cautions: [
                L('Sternum iyileşmesi için ilk 6-8 hafta ağır kaldırmaktan kaçınılmalıdır', 'Avoid heavy lifting for the first 6-8 weeks while the sternum heals'),
                L('Tansiyon, şeker ve kolesterol değerleri düzenli takip edilmelidir', 'Blood pressure, blood sugar and cholesterol should be monitored regularly'),
                L('Reçete edilen antiagregan/antikoagülan ilaçlar aksatılmadan kullanılmalıdır', 'Prescribed antiplatelet/anticoagulant medication must be taken without interruption'),
                L('Sigara ve yoğun stresten kesinlikle uzak durulmalıdır', 'Smoking and intense stress must be strictly avoided'),
                L('Kontrol randevuları ve rehabilitasyon seansları ihmal edilmemelidir', 'Follow-up appointments and rehabilitation sessions must not be neglected'),
            ],
            relatedDiseases: [
                L('Koroner Arter Hastalığı', 'Coronary Artery Disease'),
                L('Kalp Kapak Hastalıkları', 'Heart Valve Disease'),
                L('Aort Anevrizması', 'Aortic Aneurysm'),
                L('Doğumsal Kalp Hastalıkları', 'Congenital Heart Disease'),
            ],
            technologies: [
                L('Kalp-Akciğer Pompası', 'Heart-Lung Machine'),
                L('Intraoperatif TEE', 'Intraoperative TEE'),
                L('Kardiyak Yoğun Bakım', 'Cardiac Intensive Care'),
                L('Hibrit Ameliyathane', 'Hybrid Operating Room'),
            ],
            faqs: [
                { q: L('Açık kalp ameliyatı ne kadar sürer?', 'How long does open-heart surgery take?'), a: L('Uygulanan cerrahiye göre değişmekle birlikte ortalama 3-6 saat arasındadır.', 'It varies by the surgery performed but averages between 3 and 6 hours.') },
                { q: L('Hastanede yatış süresi ne kadardır?', 'How long is the hospital stay?'), a: L('Genellikle 1-2 gün yoğun bakım, ardından 5-7 gün servis olmak üzere toplam 7-10 gündür.', 'Usually 1-2 days in intensive care followed by 5-7 days on the ward, for a total of 7-10 days.') },
                { q: L('Normal yaşama ne zaman dönebilirim?', 'When can I return to normal life?'), a: L('Hafif günlük aktivitelere 3-4 hafta içinde, sedanter işlere 6-8 hafta içinde, ağır işlere ise 3 ay civarında dönülebilir.', 'You can return to light daily activities within 3-4 weeks, sedentary work within 6-8 weeks and heavy work at around 3 months.') },
                { q: L('Kardiyak rehabilitasyon şart mı?', 'Is cardiac rehabilitation essential?'), a: L('Evet. Kalp kasının toparlanması, kondisyonun artması ve tekrar hastalık riskinin azaltılması için önemle önerilir.', 'Yes. It is strongly recommended to help the heart muscle recover, improve fitness and reduce the risk of recurrence.') },
            ],
        },
    },
    {
        slug: 'koroner-anjiyografi', deptSlug: 'kardiyoloji', cover: IMG.cardio,
        name: L('Koroner Anjiyografi', 'Coronary Angiography'),
        summary: L('Kalbi besleyen damarlardaki darlık ve tıkanıklıkların görüntülendiği girişimsel tanı yöntemi.', 'An interventional diagnostic method that visualizes narrowing and blockages in the arteries feeding the heart.'),
        detail: {
            procedure: L('Kasık veya bilekten girilerek koroner damarlara kontrast madde verilir ve anjiyografi cihazıyla görüntü alınır. Genellikle günübirlik uygulanır.', 'Accessed via the groin or wrist, contrast is delivered to the coronary arteries and imaged with an angiography device. Usually a day procedure.'),
            advantages: [L('Hızlı ve güvenilir tanı', 'Fast, reliable diagnosis'), L('Gerekirse aynı seansta stent', 'Stenting in the same session if needed'), L('Günübirlik uygulama', 'Day-case procedure')],
            process: [
                { title: L('Hazırlık', 'Preparation'), desc: L('Kan testleri ve kısa açlık dönemi.', 'Blood tests and a short fasting period.') },
                { title: L('İşlem', 'Procedure'), desc: L('Lokal anestezi ile kateter yerleştirilir ve görüntüleme yapılır.', 'A catheter is placed under local anaesthesia and imaging is performed.') },
                { title: L('Takip', 'Follow-up'), desc: L('Kısa gözlem sonrası taburculuk.', 'Discharge after a short observation.') },
            ],
        },
    },
    {
        slug: 'robotik-cerrahi', deptSlug: 'uroloji', cover: IMG.robotic,
        name: L('Robotik Cerrahi', 'Robotic Surgery'),
        summary: L('Da Vinci platformuyla küçük kesilerden yapılan, yüksek hassasiyetli minimal invaziv cerrahi.', 'High-precision, minimally invasive surgery performed through small incisions with the Da Vinci platform.'),
        detail: {
            procedure: L('Cerrah konsol başında oturarak robotik kolları yönlendirir; üç boyutlu görüntü altında dar alanlarda dahi hassas cerrahi uygulanır.', 'The surgeon guides the robotic arms from a console; precise surgery is performed even in narrow areas under 3D vision.'),
            advantages: [L('Küçük kesi, düşük kanama', 'Small incisions, low bleeding'), L('Daha az ağrı ve hızlı iyileşme', 'Less pain and faster recovery'), L('Kısa hastanede kalış', 'Short hospital stay')],
            process: [
                { title: L('Değerlendirme', 'Assessment'), desc: L('Hastanın robotik cerrahiye uygunluğunun belirlenmesi.', 'Determining the patient’s suitability for robotic surgery.') },
                { title: L('Operasyon', 'Operation'), desc: L('Genel anestezi altında robotik platformla cerrahi.', 'Surgery with the robotic platform under general anaesthesia.') },
                { title: L('İyileşme', 'Recovery'), desc: L('Erken mobilizasyon ve hızlı taburculuk.', 'Early mobilization and rapid discharge.') },
            ],
        },
    },
    {
        slug: 'katarakt-ameliyati', deptSlug: 'goz-hastaliklari', cover: IMG.cataract,
        name: L('Katarakt Ameliyatı', 'Cataract Surgery'),
        summary: L('Bulanıklaşan göz merceğinin çıkarılıp yerine yapay göz içi lensi yerleştirildiği mikrocerrahi.', 'Microsurgery in which the clouded lens is removed and replaced with an artificial intraocular lens.'),
        detail: {
            procedure: L('Damla anestezisi altında, milimetrik kesiden ultrasonik enerji ile mercek parçalanır ve kişiye uygun lens yerleştirilir. Genellikle dikişsiz ve günübirliktir.', 'Under drop anaesthesia, the lens is broken up with ultrasonic energy through a millimetric incision and a suitable lens is placed. Usually sutureless and day-case.'),
            advantages: [L('Dikişsiz, günübirlik uygulama', 'Sutureless, day-case procedure'), L('Hızlı görme iyileşmesi', 'Fast visual recovery'), L('Akıllı / multifokal lens seçenekleri', 'Smart / multifocal lens options')],
            process: [
                { title: L('Hazırlık', 'Preparation'), desc: L('Detaylı göz muayenesi, biyometri ve lens seçimi.', 'Detailed eye exam, biometry and lens selection.') },
                { title: L('İşlem Günü', 'Procedure Day'), desc: L('Damla anestezisiyle dikişsiz mikrocerrahi.', 'Sutureless microsurgery with drop anaesthesia.') },
                { title: L('İyileşme', 'Recovery'), desc: L('1-2 hafta içinde belirgin görme artışı.', 'Marked vision improvement within 1-2 weeks.') },
            ],
        },
    },
    {
        slug: 'diz-protezi', deptSlug: 'ortopedi', cover: IMG.ortho,
        name: L('Diz Protezi', 'Knee Replacement'),
        summary: L('İleri kireçlenmede hasarlı diz ekleminin yapay protezle değiştirildiği cerrahi.', 'Surgery in which a damaged knee joint from advanced arthritis is replaced with a prosthesis.'),
        detail: {
            procedure: L('Hasarlı kıkırdak ve kemik yüzeyleri çıkarılarak diz eklemi metal ve polietilen bileşenlerle yeniden yapılandırılır.', 'The damaged cartilage and bone surfaces are removed and the knee joint is reconstructed with metal and polyethylene components.'),
            advantages: [L('Ağrının belirgin azalması', 'Marked reduction of pain'), L('Hareket kabiliyetinin geri kazanımı', 'Restored mobility'), L('Uzun ömürlü protez', 'Long-lasting prosthesis')],
            process: [
                { title: L('Hazırlık', 'Preparation'), desc: L('Radyolojik değerlendirme ve ameliyat planlaması.', 'Radiological assessment and surgical planning.') },
                { title: L('Operasyon', 'Operation'), desc: L('Protez yerleştirme cerrahisi.', 'Prosthesis implantation surgery.') },
                { title: L('Rehabilitasyon', 'Rehabilitation'), desc: L('Fizik tedavi ile kademeli yürüme programı.', 'A gradual walking program with physiotherapy.') },
            ],
        },
    },
    {
        slug: 'artroskopik-meniskus-cerrahisi', deptSlug: 'ortopedi', cover: IMG.spine,
        name: L('Artroskopik Menisküs Cerrahisi', 'Arthroscopic Meniscus Surgery'),
        summary: L('Menisküs yırtıklarının kapalı yöntemle (artroskopi) onarıldığı veya düzeltildiği cerrahi.', 'Surgery in which meniscus tears are repaired or trimmed with a closed (arthroscopic) technique.'),
        detail: {
            procedure: L('Küçük kesilerden yerleştirilen kamera ve enstrümanlarla eklem içine girilerek yırtık onarılır ya da düzeltilir.', 'A camera and instruments placed through small incisions enter the joint to repair or trim the tear.'),
            advantages: [L('Kapalı, minimal invaziv yöntem', 'Closed, minimally invasive method'), L('Hızlı günlük yaşama dönüş', 'Quick return to daily life'), L('Küçük izler', 'Minimal scarring')],
            process: [
                { title: L('Değerlendirme', 'Assessment'), desc: L('MR ile yırtığın tipinin belirlenmesi.', 'Determining the tear type with MRI.') },
                { title: L('Artroskopi', 'Arthroscopy'), desc: L('Kapalı cerrahi onarım.', 'Closed surgical repair.') },
                { title: L('Rehabilitasyon', 'Rehabilitation'), desc: L('Egzersiz programıyla güçlendirme.', 'Strengthening with an exercise program.') },
            ],
        },
    },
    {
        slug: 'endoskopik-sinus-cerrahisi', deptSlug: 'kbb', cover: IMG.ent,
        name: L('Endoskopik Sinüs Cerrahisi', 'Endoscopic Sinus Surgery'),
        summary: L('Kronik sinüzit ve polip tedavisinde burun içinden endoskopla yapılan kapalı cerrahi.', 'Closed surgery performed through the nose with an endoscope for chronic sinusitis and polyps.'),
        detail: {
            procedure: L('Burun deliğinden ilerletilen endoskopla hastalıklı doku ve polipler temizlenir, sinüs ağızları genişletilir; dıştan kesi yapılmaz.', 'An endoscope advanced through the nostril clears diseased tissue and polyps and widens the sinus openings; no external incision is made.'),
            advantages: [L('Dıştan kesi olmaması', 'No external incision'), L('Nefes almada belirgin rahatlama', 'Marked improvement in breathing'), L('Hızlı iyileşme', 'Fast recovery')],
            process: [
                { title: L('Değerlendirme', 'Assessment'), desc: L('Endoskopik muayene ve BT görüntüleme.', 'Endoscopic exam and CT imaging.') },
                { title: L('Operasyon', 'Operation'), desc: L('Endoskopik cerrahi girişim.', 'Endoscopic surgical procedure.') },
                { title: L('Takip', 'Follow-up'), desc: L('Burun bakımı ve kontrol muayeneleri.', 'Nasal care and follow-up visits.') },
            ],
        },
    },
    {
        slug: 'kemoterapi', deptSlug: 'onkoloji', cover: IMG.onco,
        name: L('Kemoterapi', 'Chemotherapy'),
        summary: L('Kanser hücrelerini hedefleyen ilaç tedavisinin planlı protokollerle uygulandığı süreç.', 'A process in which drug therapy targeting cancer cells is applied through planned protocols.'),
        detail: {
            procedure: L('Tümör tipi ve evresine göre belirlenen ilaçlar, damar yolu veya ağızdan seanslar hâlinde uygulanır; her seans öncesi kan değerleri kontrol edilir.', 'Drugs determined by tumour type and stage are given intravenously or orally in sessions; blood values are checked before each session.'),
            advantages: [L('Kişiye özel protokol', 'Personalized protocol'), L('Multidisipliner konsey kararı', 'Multidisciplinary board decision'), L('Yan etki yönetiminde destek', 'Support in side-effect management')],
            process: [
                { title: L('Planlama', 'Planning'), desc: L('Konsey değerlendirmesi ve protokol seçimi.', 'Board assessment and protocol selection.') },
                { title: L('Uygulama', 'Administration'), desc: L('Seans hâlinde ilaç uygulaması ve takip.', 'Session-based drug administration and monitoring.') },
                { title: L('Değerlendirme', 'Evaluation'), desc: L('Yanıtın görüntüleme ile değerlendirilmesi.', 'Assessing response with imaging.') },
            ],
        },
    },
    {
        slug: 'tup-bebek', deptSlug: 'kadin-hastaliklari-dogum', cover: IMG.women,
        name: L('Tüp Bebek', 'IVF Treatment'),
        summary: L('Yardımcı üreme teknikleriyle yumurta ve spermin laboratuvarda birleştirilerek gebeliğin sağlandığı tedavi.', 'A treatment in which egg and sperm are combined in the laboratory using assisted reproduction to achieve pregnancy.'),
        detail: {
            procedure: L('Yumurtalıklar uyarılır, olgunlaşan yumurtalar toplanır ve laboratuvarda döllenir; oluşan embriyo uygun dönemde rahime transfer edilir.', 'The ovaries are stimulated, mature eggs are collected and fertilized in the laboratory; the resulting embryo is transferred to the uterus at the right time.'),
            advantages: [L('Kişiye özel tedavi planı', 'Personalized treatment plan'), L('Deneyimli embriyoloji laboratuvarı', 'Experienced embryology laboratory'), L('Süreç boyunca yakın takip', 'Close follow-up throughout the process')],
            process: [
                { title: L('Hazırlık', 'Preparation'), desc: L('Hormon değerlendirmesi ve yumurtalık uyarımı.', 'Hormone assessment and ovarian stimulation.') },
                { title: L('Toplama & Döllenme', 'Collection & Fertilization'), desc: L('Yumurta toplama ve laboratuvar döllenmesi.', 'Egg retrieval and laboratory fertilization.') },
                { title: L('Transfer', 'Transfer'), desc: L('Embriyo transferi ve gebelik takibi.', 'Embryo transfer and pregnancy follow-up.') },
            ],
        },
    },
    {
        slug: 'laparoskopik-safra-kesesi', deptSlug: 'genel-cerrahi', cover: IMG.stomach,
        name: L('Laparoskopik Safra Kesesi Ameliyatı', 'Laparoscopic Gallbladder Surgery'),
        summary: L('Safra kesesi taşlarında kapalı (laparoskopik) yöntemle safra kesesinin çıkarıldığı cerrahi.', 'Surgery in which the gallbladder is removed with a closed (laparoscopic) technique for gallstones.'),
        detail: {
            procedure: L('Karından yapılan birkaç küçük kesiden kamera ve enstrümanlar yerleştirilerek safra kesesi çıkarılır. Genellikle 1-2 gün hastanede kalış yeterlidir.', 'The gallbladder is removed through a few small abdominal incisions with a camera and instruments. A 1-2 day hospital stay is usually enough.'),
            advantages: [L('Küçük kesiler ve az ağrı', 'Small incisions and less pain'), L('Kısa hastanede kalış', 'Short hospital stay'), L('Günlük yaşama hızlı dönüş', 'Quick return to daily life')],
            process: [
                { title: L('Hazırlık', 'Preparation'), desc: L('Ultrason ve kan tetkikleri.', 'Ultrasound and blood tests.') },
                { title: L('Operasyon', 'Operation'), desc: L('Laparoskopik safra kesesi çıkarımı.', 'Laparoscopic gallbladder removal.') },
                { title: L('İyileşme', 'Recovery'), desc: L('Kısa takip sonrası taburculuk.', 'Discharge after a short follow-up.') },
            ],
        },
    },
    {
        slug: 'mr-goruntuleme-tanisi', deptSlug: 'radyoloji', cover: IMG.imaging,
        name: L('MR ile İleri Görüntüleme', 'Advanced MRI Imaging'),
        summary: L('Manyetik rezonans ile yumuşak dokuların yüksek çözünürlükte ve radyasyonsuz görüntülendiği tanı yöntemi.', 'A diagnostic method using magnetic resonance to image soft tissues at high resolution without radiation.'),
        detail: {
            procedure: L('Hasta MR cihazına alınır; manyetik alan ve radyo dalgalarıyla detaylı kesitsel görüntüler elde edilir. Gerektiğinde kontrast madde kullanılır.', 'The patient is placed in the MRI scanner; detailed cross-sectional images are obtained with a magnetic field and radio waves. Contrast is used when needed.'),
            advantages: [L('Radyasyonsuz görüntüleme', 'Radiation-free imaging'), L('Yumuşak dokuda üstün çözünürlük', 'Superior soft-tissue resolution'), L('Girişimsiz tanı', 'Non-invasive diagnosis')],
            process: [
                { title: L('Hazırlık', 'Preparation'), desc: L('Metal implant sorgusu ve bilgilendirme.', 'Metal implant screening and information.') },
                { title: L('Çekim', 'Scan'), desc: L('Sessiz kalınarak görüntüleme yapılır.', 'Imaging is performed while remaining still.') },
                { title: L('Raporlama', 'Reporting'), desc: L('Radyolog tarafından değerlendirme ve rapor.', 'Assessment and report by the radiologist.') },
            ],
        },
    },
    {
        slug: 'kronik-agri-tedavisi', deptSlug: 'anesteziyoloji', cover: IMG.pain,
        name: L('Kronik Ağrı Tedavisi', 'Chronic Pain Treatment'),
        summary: L('Kronik bel-boyun ağrısı, nöropatik ağrı ve kanser ağrısında girişimsel algoloji yöntemleriyle uygulanan kişiye özel ağrı yönetimi.', 'Personalized pain management applied with interventional algology methods for chronic low-back and neck pain, neuropathic pain and cancer pain.'),
        detail: {
            procedure: L('Ağrının kaynağına göre epidural enjeksiyon, radyofrekans termokoagülasyon veya nöromodülasyon gibi yöntemler görüntüleme eşliğinde uygulanır; çoğu işlem günübirliktir.', 'Depending on the source of pain, methods such as epidural injection, radiofrequency thermocoagulation or neuromodulation are applied under imaging guidance; most procedures are day-case.'),
            advantages: [L('İlaç yükünde azalma', 'Reduced medication burden'), L('Hedefe yönelik girişim', 'Targeted intervention'), L('Yaşam kalitesinde artış', 'Improved quality of life')],
            process: [
                { title: L('Değerlendirme', 'Assessment'), desc: L('Ağrı öyküsü, muayene ve görüntüleme ile planlama.', 'Planning with pain history, examination and imaging.') },
                { title: L('Uygulama', 'Application'), desc: L('Görüntüleme eşliğinde girişimsel ağrı tedavisi.', 'Image-guided interventional pain treatment.') },
                { title: L('Takip', 'Follow-up'), desc: L('Ağrı skorlarının izlenmesi ve gerekirse tekrar.', 'Monitoring of pain scores and repetition if needed.') },
            ],
        },
    },
    {
        slug: 'epidural-enjeksiyon', deptSlug: 'anesteziyoloji', cover: IMG.spine,
        name: L('Epidural Enjeksiyon', 'Epidural Injection'),
        summary: L('Bel ve boyun fıtığına bağlı ağrılarda epidural aralığa ilaç uygulanarak sinir kökü iltihabının azaltıldığı girişim.', 'A procedure in which medication is applied to the epidural space to reduce nerve-root inflammation in pain due to lumbar and cervical disc herniation.'),
        detail: {
            procedure: L('Skopi veya ultrason eşliğinde ince bir iğneyle epidural aralığa ulaşılır ve steroid ile lokal anestezik karışımı uygulanır. İşlem kısa sürer ve genellikle günübirliktir.', 'Under fluoroscopy or ultrasound guidance, the epidural space is reached with a fine needle and a steroid–local-anaesthetic mixture is applied. The procedure is short and usually day-case.'),
            advantages: [L('Cerrahiye alternatif', 'An alternative to surgery'), L('Hızlı ağrı kontrolü', 'Rapid pain control'), L('Günübirlik uygulama', 'Day-case procedure')],
            process: [
                { title: L('Hazırlık', 'Preparation'), desc: L('MR değerlendirmesi ve uygunluk kontrolü.', 'MRI review and suitability check.') },
                { title: L('İşlem', 'Procedure'), desc: L('Görüntüleme eşliğinde epidural enjeksiyon.', 'Image-guided epidural injection.') },
                { title: L('İyileşme', 'Recovery'), desc: L('Kısa gözlem sonrası taburculuk.', 'Discharge after a short observation.') },
            ],
            what: L('Epidural enjeksiyon; bel ve boyun fıtığına bağlı sinir kökü basısında, omuriliği saran zarın dışındaki epidural aralığa steroid ve lokal anestezik karışımı uygulanarak iltihabın ve ödemin azaltıldığı girişimsel bir ağrı tedavisidir. Cerrahiye alternatif olarak, özellikle bacağa yayılan (siyatik tarzı) ağrılarda tercih edilir.', 'An epidural injection is an interventional pain treatment in which a steroid–local-anaesthetic mixture is applied to the epidural space outside the membrane surrounding the spinal cord to reduce inflammation and oedema in nerve-root compression from lumbar or cervical disc herniation. As an alternative to surgery, it is preferred especially for pain radiating to the leg (sciatica-type).'),
            candidates: [
                L('Bel veya boyun fıtığına bağlı bacağa/kola yayılan ağrısı olanlar', 'Those with pain radiating to the leg/arm from a lumbar or cervical hernia'),
                L('Konservatif tedaviye (ilaç, fizik tedavi) yeterli yanıt vermeyen hastalar', 'Patients who do not respond adequately to conservative treatment (medication, physiotherapy)'),
                L('Cerrahi düşünülen ancak ameliyatı ertelemek isteyen olgular', 'Cases where surgery is considered but the patient wishes to postpone it'),
                L('Ameliyat sonrası devam eden sinir kökü ağrısı olan hastalar', 'Patients with persistent nerve-root pain after surgery'),
            ],
            cautions: [
                L('Kanama bozukluğu veya kan sulandırıcı ilaç kullanımı önceden bildirilmelidir', 'Bleeding disorders or the use of blood thinners must be reported in advance'),
                L('İşlem bölgesinde aktif enfeksiyon varsa uygulama ertelenir', 'The procedure is postponed if there is active infection at the injection site'),
                L('İşlem sonrası ilk saatlerde hafif his değişikliği olabilir, dinlenmek gerekir', 'Mild sensory changes may occur in the first hours after the procedure; rest is advised'),
                L('Etki kişiden kişiye değişir; gerektiğinde tekrar planlanabilir', 'The effect varies from person to person and may be repeated when necessary'),
            ],
            relatedDiseases: [
                L('Bel Fıtığı', 'Lumbar Disc Herniation'),
                L('Boyun Fıtığı', 'Cervical Disc Herniation'),
                L('Spinal Darlık', 'Spinal Stenosis'),
                L('Kronik Ağrı', 'Chronic Pain'),
            ],
            technologies: [
                L('Skopi (C-Kollu) Eşliğinde Girişim', 'Fluoroscopy (C-arm) Guidance'),
                L('Ultrason Rehberliğinde Blok', 'Ultrasound-Guided Block'),
            ],
            faqs: [
                { q: L('Epidural enjeksiyon ameliyat mıdır?', 'Is an epidural injection a surgery?'), a: L('Hayır. Lokal anestezi ile, iğne ucu kalınlığında yapılan girişimsel bir işlemdir; genellikle günübirliktir.', 'No. It is an interventional procedure performed under local anaesthesia with a needle; it is usually a day case.') },
                { q: L('Etkisi ne kadar sürer?', 'How long does the effect last?'), a: L('Kişiden kişiye değişmekle birlikte etki haftalar-aylar boyunca sürebilir ve gerektiğinde tekrarlanabilir.', 'Although it varies from person to person, the effect can last weeks to months and may be repeated when necessary.') },
                { q: L('İşlemden sonra ne zaman evime dönebilirim?', 'When can I go home after the procedure?'), a: L('Kısa bir gözlem süresinin ardından çoğu hasta aynı gün evine döner.', 'After a short observation period, most patients return home the same day.') },
            ],
        },
    },
    {
        slug: 'agrisiz-dogum', deptSlug: 'anesteziyoloji', cover: IMG.women,
        name: L('Ağrısız Doğum', 'Painless Labour'),
        summary: L('Doğum sürecinde epidural analjezi ile ağrının belirgin biçimde azaltıldığı, anne konforunu artıran uygulama.', 'A procedure that markedly reduces pain during labour with epidural analgesia, increasing maternal comfort.'),
        detail: {
            procedure: L('Uygun doğum aşamasında bele yerleştirilen ince bir kateterden epidural aralığa ağrı kesici verilir; anne bilinci açık şekilde doğumu konforlu biçimde tamamlar.', 'At the appropriate stage of labour, an analgesic is delivered to the epidural space through a fine catheter placed in the lower back; the mother completes the birth comfortably while fully conscious.'),
            advantages: [L('Doğum ağrısında belirgin azalma', 'Marked reduction of labour pain'), L('Anne konforu ve iş birliği', 'Maternal comfort and cooperation'), L('Gerektiğinde sezaryene hızlı geçiş', 'Rapid conversion to caesarean if needed')],
            process: [
                { title: L('Değerlendirme', 'Assessment'), desc: L('Anestezi uzmanı değerlendirmesi ve onam.', 'Anaesthesiologist assessment and consent.') },
                { title: L('Uygulama', 'Application'), desc: L('Uygun aşamada epidural kateter yerleştirilmesi.', 'Placement of the epidural catheter at the right stage.') },
                { title: L('Doğum', 'Delivery'), desc: L('Doğum boyunca ağrı ve canlı takip.', 'Pain control and continuous monitoring throughout delivery.') },
            ],
        },
    },
];
function resolveTreatment(t: TreatmentSrc, l: Locale): Treatment {
    return {
        slug: t.slug, name: t.name[l], summary: t.summary[l],
        department: deptName(t.deptSlug, l), deptSlug: t.deptSlug, cover: t.cover,
        detail: {
            procedure: t.detail.procedure[l],
            advantages: t.detail.advantages.map((a) => a[l]),
            process: t.detail.process.map((p) => ({ title: p.title[l], desc: p.desc[l] })),
            what: t.detail.what ? t.detail.what[l] : undefined,
            candidates: t.detail.candidates ? t.detail.candidates.map((c) => c[l]) : undefined,
            cautions: t.detail.cautions ? t.detail.cautions.map((c) => c[l]) : undefined,
            relatedDiseases: t.detail.relatedDiseases ? t.detail.relatedDiseases.map((d) => d[l]) : undefined,
            technologies: t.detail.technologies ? t.detail.technologies.map((x) => x[l]) : undefined,
            faqs: t.detail.faqs ? t.detail.faqs.map((f) => ({ q: f.q[l], a: f.a[l] })) : undefined,
        },
    };
}
export function getTreatments(l: Locale): Treatment[] { return TREATMENTS_SRC.map((t) => resolveTreatment(t, l)); }
export function useTreatments(): Treatment[] { const l = useLocale(); const c = useCatalog<Treatment>('treatments'); return c ?? getTreatments(l); }
export function getTreatmentBySlug(slug: string, l: Locale): Treatment | undefined {
    const __r = readRecordProp(); if (__r && __r.slug === slug) return __r as Treatment;
    const t = TREATMENTS_SRC.find((x) => x.slug === slug);
    return t ? resolveTreatment(t, l) : undefined;
}
/** Treatments linked to a department slug (relation helper for detail pages). */
export function getTreatmentsForDept(deptSlug: string, l: Locale): Treatment[] {
    const rel = readRelatedProp();
    if (rel && Array.isArray(rel.treatments)) return rel.treatments as unknown as Treatment[];
    const cat = useCatalog<Treatment>('treatments');
    if (cat) return cat.filter((t) => t.deptSlug === deptSlug);
    return TREATMENTS_SRC.filter((t) => t.deptSlug === deptSlug).map((t) => resolveTreatment(t, l));
}
/**
 * Treatments shown on a hospital detail page. Prefers the editor's manual picks / auto-by-
 * department slice passed as the `related.treatments` prop (Faz 2 AUTO/MANUAL); falls back to
 * the treatments whose department is represented at the hospital — with NO irrelevant padding
 * (the section hides itself when there are none).
 */
export function getTreatmentsForHospital(hospitalSlug: string, l: Locale): Treatment[] {
    const rel = readRelatedProp();
    if (rel && Array.isArray(rel.treatments)) return rel.treatments as unknown as Treatment[];
    const deptSlugs = new Set(getDepartmentsForHospital(hospitalSlug, l).map((d) => d.slug));
    return getTreatments(l).filter((t) => deptSlugs.has(t.deptSlug));
}

/* ── Diseases — representative sample with detail, related by slug ── */
type DiseaseSrc = {
    slug: string;
    name: Loc;
    summary: Loc;
    deptSlug: string;
    cover: string;
    detail: {
        what: Loc;
        symptoms: Loc[];
        causes: Loc[];
        diagnosis: Loc[];
        treatment: Loc[];
        risks?: Loc[];
        diagnosisDetail?: { name: Loc; desc: Loc }[];
        treatments?: { name: Loc; desc: Loc }[];
        whenToDoctor?: Loc[];
        technologies?: Loc[];
        faqs?: { q: Loc; a: Loc }[];
        warning?: Loc;
        midCta?: Loc;
    };
};
const DISEASES_SRC: DiseaseSrc[] = [
    {
        slug: 'hipertansiyon', deptSlug: 'kardiyoloji', cover: IMG.cardio,
        name: L('Hipertansiyon (Yüksek Tansiyon)', 'Hypertension (High Blood Pressure)'),
        summary: L('Kan basıncının damar duvarında sürekli olarak yüksek seyretmesiyle ortaya çıkan, çoğu zaman belirti vermeden ilerleyen ve kalp, böbrek ve beyin gibi organları hedef alan yaygın bir hastalıktır.', 'A common disease in which blood pressure is persistently elevated against the vessel wall; it often progresses without symptoms and targets organs such as the heart, kidneys and brain.'),
        detail: {
            what: L('Hipertansiyon; kalbin kanı damarlara pompalarken oluşturduğu basıncın normal sınırların üzerinde seyretmesidir. Genellikle 140/90 mmHg ve üzeri değerler yüksek kabul edilir. "Sessiz hastalık" olarak da bilinir; çünkü uzun süre belirti vermeden damarlara ve organlara zarar verebilir. Erken tanı ve düzenli takip ile kontrol altına alınabilir.', 'Hypertension is when the pressure the heart generates while pumping blood into the vessels runs above normal limits. Values of 140/90 mmHg and above are generally considered high. It is also known as the "silent disease" because it can damage vessels and organs for a long time without symptoms. It can be controlled with early diagnosis and regular follow-up.'),
            symptoms: [
                L('Çoğu zaman belirti vermez (sessiz seyir)', 'Often causes no symptoms (silent course)'),
                L('Baş ağrısı, özellikle sabah saatlerinde', 'Headache, especially in the morning'),
                L('Baş dönmesi ve kulak çınlaması', 'Dizziness and ringing in the ears'),
                L('Çarpıntı ve nefes darlığı', 'Palpitations and shortness of breath'),
                L('Burun kanaması', 'Nosebleeds'),
            ],
            causes: [
                L('Aşırı tuz tüketimi', 'Excessive salt consumption'),
                L('Obezite ve hareketsiz yaşam', 'Obesity and a sedentary lifestyle'),
                L('Aile öyküsü (genetik yatkınlık)', 'Family history (genetic predisposition)'),
                L('Aşırı alkol ve sigara kullanımı', 'Excessive alcohol and smoking'),
                L('Kronik stres', 'Chronic stress'),
                L('Böbrek ve hormonal hastalıklar', 'Kidney and hormonal disorders'),
            ],
            diagnosis: [L('Tansiyon ölçümü ve takibi', 'Blood pressure measurement and monitoring'), L('24 saat ritim (Holter) tansiyon takibi', '24-hour ambulatory blood pressure monitoring'), L('EKG ve ekokardiyografi', 'ECG and echocardiography'), L('Kan ve idrar tetkikleri', 'Blood and urine tests')],
            treatment: [L('Yaşam tarzı değişiklikleri', 'Lifestyle changes'), L('Tuz kısıtlaması ve diyet', 'Salt restriction and diet'), L('Antihipertansif ilaç tedavisi', 'Antihypertensive medication'), L('Düzenli takip ve kontrol', 'Regular follow-up and monitoring')],
            risks: [
                L('45 yaş üstü olmak', 'Being over 45 years old'),
                L('Ailede hipertansiyon öyküsü', 'Family history of hypertension'),
                L('Diyabet ve yüksek kolesterol', 'Diabetes and high cholesterol'),
                L('Fazla kilo ve düşük fiziksel aktivite', 'Excess weight and low physical activity'),
                L('Tuzlu ve işlenmiş gıda ağırlıklı beslenme', 'A diet high in salty and processed foods'),
            ],
            diagnosisDetail: [
                { name: L('Ofis ve Ev Tansiyon Ölçümü', 'Office and Home Blood Pressure Measurement'), desc: L('Farklı zamanlarda tekrarlanan ölçümlerle kan basıncının doğrulanması.', 'Confirming blood pressure with repeated measurements at different times.') },
                { name: L('24 Saat Ambulatuvar Tansiyon Holteri', '24-Hour Ambulatory Blood Pressure Holter'), desc: L('Gün boyu tansiyon değişimlerinin kaydedilerek gizli hipertansiyonun saptanması.', 'Recording blood pressure changes throughout the day to detect masked hypertension.') },
                { name: L('Ekokardiyografi ve EKG', 'Echocardiography and ECG'), desc: L('Kalbin yapısı ve hipertansiyonun kalp üzerindeki etkilerinin değerlendirilmesi.', 'Assessing the heart’s structure and the effects of hypertension on the heart.') },
                { name: L('Kan ve İdrar Tetkikleri', 'Blood and Urine Tests'), desc: L('Böbrek fonksiyonu, kolesterol ve şeker düzeylerinin ölçülmesi.', 'Measuring kidney function, cholesterol and blood sugar levels.') },
            ],
            treatments: [
                { name: L('Yaşam Tarzı Değişiklikleri', 'Lifestyle Changes'), desc: L('Tuz kısıtlaması, kilo kontrolü, düzenli egzersiz ve sigaranın bırakılması.', 'Salt restriction, weight control, regular exercise and quitting smoking.') },
                { name: L('Beslenme Düzenlemesi (DASH Diyeti)', 'Dietary Adjustment (DASH Diet)'), desc: L('Sebze, meyve ve tam tahıl ağırlıklı, düşük tuzlu beslenme planı.', 'A low-salt eating plan rich in vegetables, fruit and whole grains.') },
                { name: L('Antihipertansif İlaç Tedavisi', 'Antihypertensive Medication'), desc: L('Hastaya özel seçilen ilaçlarla kan basıncının hedef değerlerde tutulması.', 'Keeping blood pressure at target values with medication selected for the patient.') },
                { name: L('Düzenli Takip', 'Regular Follow-up'), desc: L('Tansiyon değerlerinin ve organ etkilenmesinin periyodik kontrolü.', 'Periodic monitoring of blood pressure values and organ involvement.') },
            ],
            whenToDoctor: [
                L('Tansiyon değerleriniz sürekli 140/90 mmHg üzerinde seyrediyorsa', 'If your readings are consistently above 140/90 mmHg'),
                L('Şiddetli baş ağrısı, göğüs ağrısı veya nefes darlığı varsa', 'If you have severe headache, chest pain or shortness of breath'),
                L('Görme bulanıklığı veya bilinç değişikliği yaşıyorsanız', 'If you experience blurred vision or altered consciousness'),
                L('Ailede erken yaşta kalp hastalığı öyküsü varsa', 'If there is a family history of early heart disease'),
            ],
            technologies: [
                L('24 Saat Tansiyon Holteri', '24-Hour Blood Pressure Holter'),
                L('Ekokardiyografi', 'Echocardiography'),
                L('Efor Testi', 'Exercise Stress Test'),
            ],
            faqs: [
                { q: L('Hipertansiyon tamamen geçer mi?', 'Does hypertension go away completely?'), a: L('Çoğu hastada kronik bir durumdur; ancak yaşam tarzı düzenlemeleri ve ilaç tedavisiyle etkin biçimde kontrol altına alınabilir.', 'In most patients it is a chronic condition; however, it can be effectively controlled with lifestyle changes and medication.') },
                { q: L('İlaca başladıktan sonra ömür boyu kullanmam gerekir mi?', 'Once I start medication, do I have to take it for life?'), a: L('Bu, tansiyonun derecesine ve organ etkilenmesine bağlıdır. Bazı hastalarda yaşam tarzı değişiklikleriyle ilaç dozu azaltılabilir; kararı hekiminiz verir.', 'This depends on the severity and organ involvement. In some patients the dose can be reduced with lifestyle changes; your doctor decides.') },
                { q: L('Evde tansiyon ölçümü güvenilir mi?', 'Is home blood pressure measurement reliable?'), a: L('Doğru cihaz ve teknikle yapılan ev ölçümleri, tedavi takibinde çok değerlidir ve hekiminize önemli bilgi sağlar.', 'Home measurements made with the right device and technique are very valuable in treatment follow-up and give your doctor important information.') },
            ],
            warning: L('Tansiyonunuz aniden çok yükselir (örn. 180/120 mmHg üzeri) ve buna göğüs ağrısı, nefes darlığı, konuşma bozukluğu veya görme kaybı eşlik ederse bu bir hipertansif acildir; derhal acil servise başvurun.', 'If your blood pressure rises suddenly and very high (e.g. above 180/120 mmHg) accompanied by chest pain, shortness of breath, speech difficulty or vision loss, this is a hypertensive emergency; go to the emergency department immediately.'),
            midCta: L('Tansiyonunuzu düzenli takip etmek ve kalbinizi korumak için uzmanlarımızla görüşün.', 'Talk to our specialists to monitor your blood pressure regularly and protect your heart.'),
        },
    },
    {
        slug: 'retina-dekolmani', deptSlug: 'goz-hastaliklari', cover: IMG.eye,
        name: L('Retina Dekolmanı', 'Retinal Detachment'),
        summary: L('Retina tabakasının göz arka duvarından ayrılmasıyla ortaya çıkan, acil müdahale gerektirebilen göz hastalığı.', 'An eye condition, sometimes requiring emergency care, caused by the retina separating from the back wall of the eye.'),
        detail: {
            what: L('Retina, gözün arka duvarını döşeyen ışığa duyarlı ince sinir tabakasıdır. Bu tabakanın zemininden ayrılması retina dekolmanıdır ve görme fonksiyonunu bozar.', 'The retina is a thin, light-sensitive nerve layer lining the back of the eye. Its separation from the underlying tissue is retinal detachment, which impairs vision.'),
            symptoms: [L('Görme alanında uçuşan noktalar', 'Floating spots in the field of vision'), L('Ani ışık çakmaları', 'Sudden flashes of light'), L('Görme alanında perde/gölge hissi', 'A curtain or shadow over the vision'), L('Ani ve ağrısız görme kaybı', 'Sudden, painless vision loss')],
            causes: [L('İleri yaşa bağlı retina yırtıkları', 'Age-related retinal tears'), L('Yüksek miyop', 'High myopia'), L('Göz travmaları', 'Eye trauma'), L('Diyabetik retinopati', 'Diabetic retinopathy')],
            diagnosis: [L('Detaylı fundus muayenesi', 'Detailed fundus examination'), L('OCT (optik koherens tomografi)', 'OCT (optical coherence tomography)'), L('Göz ultrasonografisi', 'Ocular ultrasonography')],
            treatment: [L('Lazer fotokoagülasyon', 'Laser photocoagulation'), L('Kriyoterapi', 'Cryotherapy'), L('Vitrektomi', 'Vitrectomy'), L('Skleral çökertme', 'Scleral buckling')],
        },
    },
    {
        slug: 'koroner-arter-hastaligi', deptSlug: 'kardiyoloji', cover: IMG.cardio,
        name: L('Koroner Arter Hastalığı', 'Coronary Artery Disease'),
        summary: L('Kalbi besleyen damarların daralması sonucu göğüs ağrısı ve kalp krizi riskine yol açan hastalık.', 'A disease in which narrowing of the arteries feeding the heart causes chest pain and the risk of a heart attack.'),
        detail: {
            what: L('Koroner damarların iç duvarında plak birikmesi (ateroskleroz) sonucu kan akışı azalır; kalp kası yeterli oksijen alamaz.', 'Plaque build-up (atherosclerosis) on the inner wall of the coronary arteries reduces blood flow so the heart muscle receives insufficient oxygen.'),
            symptoms: [L('Efor ile artan göğüs ağrısı', 'Chest pain that worsens with exertion'), L('Nefes darlığı', 'Shortness of breath'), L('Çarpıntı', 'Palpitations'), L('Kola veya çeneye yayılan ağrı', 'Pain radiating to the arm or jaw')],
            causes: [L('Yüksek kolesterol', 'High cholesterol'), L('Hipertansiyon', 'Hypertension'), L('Sigara', 'Smoking'), L('Diyabet ve obezite', 'Diabetes and obesity')],
            diagnosis: [L('EKG ve efor testi', 'ECG and stress test'), L('Ekokardiyografi', 'Echocardiography'), L('Koroner anjiyografi', 'Coronary angiography')],
            treatment: [L('Yaşam tarzı değişiklikleri', 'Lifestyle changes'), L('İlaç tedavisi', 'Medication'), L('Stent (anjiyoplasti)', 'Stenting (angioplasty)'), L('Baypas cerrahisi', 'Bypass surgery')],
        },
    },
    {
        slug: 'migren', deptSlug: 'noroloji', cover: IMG.brain,
        name: L('Migren', 'Migraine'),
        summary: L('Genellikle tek taraflı, zonklayıcı baş ağrısı atakları ile seyreden nörolojik hastalık.', 'A neurological condition marked by recurrent, usually one-sided, throbbing headache attacks.'),
        detail: {
            what: L('Migren; beyin damar ve sinir aktivitesindeki değişikliklerle ortaya çıkan, ışık ve sese duyarlılıkla birlikte görülebilen tekrarlayıcı baş ağrısıdır.', 'Migraine is a recurrent headache arising from changes in cerebral vascular and nerve activity, often with sensitivity to light and sound.'),
            symptoms: [L('Zonklayıcı baş ağrısı', 'Throbbing headache'), L('Bulantı ve kusma', 'Nausea and vomiting'), L('Işık ve sese hassasiyet', 'Sensitivity to light and sound'), L('Aura (görsel belirtiler)', 'Aura (visual symptoms)')],
            causes: [L('Stres ve uyku düzensizliği', 'Stress and irregular sleep'), L('Hormonal değişiklikler', 'Hormonal changes'), L('Bazı besinler ve kafein', 'Certain foods and caffeine'), L('Genetik yatkınlık', 'Genetic predisposition')],
            diagnosis: [L('Nörolojik muayene', 'Neurological examination'), L('Ağrı günlüğü değerlendirmesi', 'Headache diary review'), L('Gerekirse MR görüntüleme', 'MRI imaging if needed')],
            treatment: [L('Atak tedavisi ilaçları', 'Acute attack medication'), L('Koruyucu tedavi', 'Preventive treatment'), L('Tetikleyicilerden kaçınma', 'Avoiding triggers'), L('Yaşam düzeni önerileri', 'Lifestyle recommendations')],
        },
    },
    {
        slug: 'meniskus-yirtigi', deptSlug: 'ortopedi', cover: IMG.ortho,
        name: L('Menisküs Yırtığı', 'Meniscus Tear'),
        summary: L('Diz ekleminde yastıkçık görevi gören menisküsün zorlanma veya yaşa bağlı yırtılması.', 'A tear of the meniscus — the cushioning cartilage of the knee — from strain or age-related wear.'),
        detail: {
            what: L('Menisküs, diz ekleminde kıkırdaktan yastıkçıktır. Ani dönme hareketleri veya dejenerasyon sonucu yırtılabilir ve ağrıya yol açar.', 'The meniscus is a cartilage cushion in the knee. It can tear from sudden twisting movements or degeneration, causing pain.'),
            symptoms: [L('Diz ağrısı ve şişlik', 'Knee pain and swelling'), L('Dizde kilitlenme hissi', 'Locking sensation in the knee'), L('Hareket kısıtlılığı', 'Restricted movement'), L('Çömelmede zorlanma', 'Difficulty squatting')],
            causes: [L('Spor yaralanmaları', 'Sports injuries'), L('Ani dönme hareketleri', 'Sudden twisting movements'), L('Yaşa bağlı dejenerasyon', 'Age-related degeneration')],
            diagnosis: [L('Fizik muayene testleri', 'Physical examination tests'), L('MR görüntüleme', 'MRI imaging')],
            treatment: [L('İstirahat ve fizik tedavi', 'Rest and physiotherapy'), L('İlaç tedavisi', 'Medication'), L('Artroskopik cerrahi', 'Arthroscopic surgery')],
        },
    },
    {
        slug: 'prostat-buyumesi', deptSlug: 'uroloji', cover: IMG.robotic,
        name: L('İyi Huylu Prostat Büyümesi', 'Benign Prostatic Enlargement'),
        summary: L('Yaşla birlikte prostat bezinin büyümesine bağlı idrar yakınmalarına yol açan durum.', 'A condition causing urinary symptoms due to age-related enlargement of the prostate gland.'),
        detail: {
            what: L('Prostat bezinin iyi huylu büyümesi idrar kanalına bası yaparak idrar akışını zorlaştırır ve alt üriner sistem yakınmalarına yol açar.', 'Benign enlargement of the prostate presses on the urethra, obstructing urine flow and causing lower urinary tract symptoms.'),
            symptoms: [L('Sık idrara çıkma', 'Frequent urination'), L('Zayıf idrar akımı', 'Weak urine stream'), L('Gece idrara kalkma', 'Waking at night to urinate'), L('Tam boşalamama hissi', 'Feeling of incomplete emptying')],
            causes: [L('İlerleyen yaş', 'Advancing age'), L('Hormonal değişiklikler', 'Hormonal changes'), L('Aile öyküsü', 'Family history')],
            diagnosis: [L('Ürolojik muayene', 'Urological examination'), L('PSA kan testi', 'PSA blood test'), L('Üroflowmetri ve ultrason', 'Uroflowmetry and ultrasound')],
            treatment: [L('İlaç tedavisi', 'Medication'), L('Lazer tedavisi (HoLEP)', 'Laser treatment (HoLEP)'), L('Cerrahi (TUR-P)', 'Surgery (TUR-P)')],
        },
    },
    {
        slug: 'sinuzit', deptSlug: 'kbb', cover: IMG.ent,
        name: L('Sinüzit', 'Sinusitis'),
        summary: L('Sinüs boşluklarının iltihaplanmasıyla burun tıkanıklığı ve yüz ağrısına yol açan hastalık.', 'A disease in which inflammation of the sinus cavities causes nasal congestion and facial pain.'),
        detail: {
            what: L('Sinüzit, yüz kemiklerindeki hava boşluklarının (sinüsler) enfeksiyon veya alerjiye bağlı iltihaplanmasıdır; akut veya kronik olabilir.', 'Sinusitis is inflammation of the air cavities in the facial bones (sinuses) due to infection or allergy; it may be acute or chronic.'),
            symptoms: [L('Burun tıkanıklığı', 'Nasal congestion'), L('Yüzde baskı ve ağrı', 'Facial pressure and pain'), L('Geniz akıntısı', 'Postnasal drip'), L('Koku alma azalması', 'Reduced sense of smell')],
            causes: [L('Viral üst solunum yolu enfeksiyonları', 'Viral upper respiratory infections'), L('Alerji', 'Allergy'), L('Burun eti büyümesi veya polip', 'Enlarged turbinates or polyps')],
            diagnosis: [L('Endoskopik muayene', 'Endoscopic examination'), L('BT görüntüleme', 'CT imaging')],
            treatment: [L('İlaç tedavisi', 'Medication'), L('Burun spreyleri ve yıkama', 'Nasal sprays and rinses'), L('Endoskopik sinüs cerrahisi', 'Endoscopic sinus surgery')],
        },
    },
    {
        slug: 'meme-kanseri', deptSlug: 'onkoloji', cover: IMG.onco,
        name: L('Meme Kanseri', 'Breast Cancer'),
        summary: L('Meme dokusundaki hücrelerin kontrolsüz çoğalmasıyla oluşan, erken tanıda tedavi başarısı yüksek kanser türü.', 'A cancer formed by uncontrolled growth of cells in breast tissue, with high treatment success when caught early.'),
        detail: {
            what: L('Meme kanseri, meme kanalları veya lobüllerindeki hücrelerin kontrolsüz büyümesiyle gelişir. Erken evrede yakalandığında tedavi başarısı yüksektir.', 'Breast cancer develops from uncontrolled growth of cells in the breast ducts or lobules. Treatment success is high when detected at an early stage.'),
            symptoms: [L('Memede ele gelen kitle', 'A palpable lump in the breast'), L('Meme derisinde değişiklik', 'Changes in the breast skin'), L('Meme başında akıntı', 'Nipple discharge'), L('Koltuk altında şişlik', 'Swelling in the armpit')],
            causes: [L('Genetik yatkınlık (BRCA)', 'Genetic predisposition (BRCA)'), L('Hormonal faktörler', 'Hormonal factors'), L('İleri yaş', 'Advancing age'), L('Yaşam tarzı faktörleri', 'Lifestyle factors')],
            diagnosis: [L('Mamografi', 'Mammography'), L('Meme ultrasonu ve MR', 'Breast ultrasound and MRI'), L('Biyopsi', 'Biopsy')],
            treatment: [L('Cerrahi', 'Surgery'), L('Kemoterapi', 'Chemotherapy'), L('Radyoterapi', 'Radiotherapy'), L('Hormonal ve hedefe yönelik tedavi', 'Hormonal and targeted therapy')],
        },
    },
    {
        slug: 'safra-kesesi-tasi', deptSlug: 'genel-cerrahi', cover: IMG.stomach,
        name: L('Safra Kesesi Taşı', 'Gallstones'),
        summary: L('Safra kesesinde oluşan taşların karın ağrısı ve hazımsızlığa yol açtığı sık görülen durum.', 'A common condition in which stones forming in the gallbladder cause abdominal pain and indigestion.'),
        detail: {
            what: L('Safra taşları, safranın bileşenlerinin kristalleşmesiyle oluşur. Safra kesesi ağzını tıkadığında ağrı ve iltihap gelişebilir.', 'Gallstones form when components of bile crystallize. When they block the gallbladder opening, pain and inflammation can develop.'),
            symptoms: [L('Sağ üst karın ağrısı', 'Upper-right abdominal pain'), L('Yağlı yemek sonrası şişkinlik', 'Bloating after fatty meals'), L('Bulantı ve kusma', 'Nausea and vomiting'), L('Sırta yayılan ağrı', 'Pain radiating to the back')],
            causes: [L('Yağlı beslenme', 'High-fat diet'), L('Obezite', 'Obesity'), L('Hızlı kilo kaybı', 'Rapid weight loss'), L('Genetik faktörler', 'Genetic factors')],
            diagnosis: [L('Karın ultrasonografisi', 'Abdominal ultrasonography'), L('Kan tetkikleri', 'Blood tests')],
            treatment: [L('Beslenme düzenlemesi', 'Dietary adjustment'), L('Laparoskopik safra kesesi ameliyatı', 'Laparoscopic gallbladder surgery')],
        },
    },
    {
        slug: 'gebelik-takibi', deptSlug: 'kadin-hastaliklari-dogum', cover: IMG.women,
        name: L('Gebelik Takibi', 'Pregnancy Follow-up'),
        summary: L('Sağlıklı bir gebelik için anne ve bebeğin düzenli kontrollerle izlendiği süreç.', 'The process of regularly monitoring mother and baby for a healthy pregnancy.'),
        detail: {
            what: L('Gebelik takibi; anne ve bebeğin sağlığının düzenli muayene, ultrason ve tarama testleriyle izlendiği kapsamlı bir bakım sürecidir.', 'Pregnancy follow-up is a comprehensive care process in which the health of mother and baby is monitored with regular exams, ultrasound and screening tests.'),
            symptoms: [L('Adet gecikmesi', 'Missed period'), L('Bulantı ve halsizlik', 'Nausea and fatigue'), L('Meme hassasiyeti', 'Breast tenderness')],
            causes: [L('Rutin trimester kontrolleri', 'Routine trimester check-ups'), L('Riskli gebelik durumları', 'High-risk pregnancy situations')],
            diagnosis: [L('Obstetrik ultrason', 'Obstetric ultrasound'), L('İkili ve dörtlü tarama testleri', 'First- and second-trimester screening tests'), L('Gestasyonel diyabet taraması', 'Gestational diabetes screening')],
            treatment: [L('Düzenli muayene ve takip', 'Regular examination and follow-up'), L('Beslenme ve vitamin desteği', 'Nutrition and vitamin support'), L('Doğum planlaması', 'Birth planning')],
        },
    },
    {
        slug: 'cocuklarda-ates', deptSlug: 'cocuk-sagligi', cover: IMG.child,
        name: L('Çocuklarda Ateş', 'Fever in Children'),
        summary: L('Çocuklarda sık görülen, çoğunlukla enfeksiyonlara bağlı vücut sıcaklığı yükselmesi.', 'A common rise in body temperature in children, usually due to infection.'),
        detail: {
            what: L('Ateş, vücudun enfeksiyonlara karşı savunma yanıtıdır. Çoğu zaman iyi huyludur ancak süresi ve eşlik eden belirtiler önemlidir.', 'Fever is the body’s defence response to infection. It is usually benign, but its duration and accompanying symptoms matter.'),
            symptoms: [L('Vücut sıcaklığında artış', 'Increased body temperature'), L('Halsizlik ve iştahsızlık', 'Fatigue and loss of appetite'), L('Titreme', 'Shivering'), L('Huzursuzluk', 'Irritability')],
            causes: [L('Viral enfeksiyonlar', 'Viral infections'), L('Bakteriyel enfeksiyonlar', 'Bacterial infections'), L('Aşı sonrası reaksiyon', 'Post-vaccination reaction')],
            diagnosis: [L('Çocuk muayenesi', 'Paediatric examination'), L('Gerekirse kan ve idrar tetkikleri', 'Blood and urine tests if needed')],
            treatment: [L('Sıvı alımının artırılması', 'Increasing fluid intake'), L('Ateş düşürücüler', 'Antipyretics'), L('Altta yatan nedenin tedavisi', 'Treating the underlying cause')],
        },
    },
    {
        slug: 'kronik-agri', deptSlug: 'anesteziyoloji', cover: IMG.pain,
        name: L('Kronik Ağrı', 'Chronic Pain'),
        summary: L('Üç aydan uzun süren, günlük yaşamı ve yaşam kalitesini olumsuz etkileyen kalıcı ağrı durumu.', 'A persistent pain condition lasting more than three months that adversely affects daily life and quality of life.'),
        detail: {
            what: L('Kronik ağrı; bel-boyun ağrısı, nöropatik ağrı, kanser ağrısı ve baş ağrısı gibi farklı kaynaklardan doğabilen, üç aydan uzun süren ağrıdır. Ağrı Polikliniği kapsamında girişimsel yöntemlerle yönetilir.', 'Chronic pain is pain lasting more than three months that can arise from various sources such as low-back and neck pain, neuropathic pain, cancer pain and headache. It is managed with interventional methods within the Pain Clinic.'),
            symptoms: [L('Sürekli veya tekrarlayan ağrı', 'Constant or recurrent pain'), L('Uyku bozukluğu', 'Sleep disturbance'), L('Hareket kısıtlılığı', 'Restricted movement'), L('Yaşam kalitesinde düşüş', 'Reduced quality of life')],
            causes: [L('Bel ve boyun fıtığı', 'Lumbar and cervical disc herniation'), L('Nöropatik hasar', 'Neuropathic damage'), L('Kanser ağrısı', 'Cancer pain'), L('Kas-iskelet sistemi hastalıkları', 'Musculoskeletal disorders')],
            diagnosis: [L('Ayrıntılı ağrı öyküsü ve muayene', 'Detailed pain history and examination'), L('Görüntüleme (MR, BT)', 'Imaging (MRI, CT)'), L('Ağrı skorlaması', 'Pain scoring')],
            treatment: [L('İlaç tedavisi', 'Medication'), L('Epidural enjeksiyon', 'Epidural injection'), L('Radyofrekans termokoagülasyon', 'Radiofrequency thermocoagulation'), L('Nöromodülasyon', 'Neuromodulation')],
        },
    },
    {
        slug: 'agri-poliklinigi', deptSlug: 'anesteziyoloji', cover: IMG.pain,
        name: L('Ağrı Polikliniği', 'Pain Clinic'),
        summary: L('Kronik ağrıların girişimsel algoloji yöntemleriyle değerlendirilip tedavi edildiği özel poliklinik hizmeti.', 'A dedicated clinic where chronic pain is assessed and treated with interventional algology methods.'),
        detail: {
            what: L('Ağrı Polikliniği; kronik bel-boyun ağrısı, migren, trigeminal nevralji, kanser ağrısı ve nöropatik ağrı gibi durumların multidisipliner yaklaşımla yönetildiği birimdir.', 'The Pain Clinic is a unit where conditions such as chronic low-back and neck pain, migraine, trigeminal neuralgia, cancer pain and neuropathic pain are managed with a multidisciplinary approach.'),
            symptoms: [L('Dinmeyen kronik ağrı', 'Unrelenting chronic pain'), L('İlaçlara yetersiz yanıt', 'Inadequate response to medication'), L('Günlük aktivitelerde kısıtlanma', 'Limitation in daily activities')],
            causes: [L('Bel ve boyun fıtığı', 'Lumbar and cervical disc herniation'), L('Trigeminal nevralji', 'Trigeminal neuralgia'), L('Kanser kaynaklı ağrı', 'Cancer-related pain'), L('Nöropatik ağrı', 'Neuropathic pain')],
            diagnosis: [L('Algoloji uzmanı değerlendirmesi', 'Assessment by an algology specialist'), L('Görüntüleme yöntemleri', 'Imaging methods'), L('Tanısal sinir blokları', 'Diagnostic nerve blocks')],
            treatment: [L('Girişimsel ağrı tedavileri', 'Interventional pain treatments'), L('Epidural ve transforaminal enjeksiyon', 'Epidural and transforaminal injection'), L('Radyofrekans uygulamaları', 'Radiofrequency procedures'), L('İlaç yönetimi', 'Medication management')],
            risks: [
                L('Uzun süreli hareketsiz masa başı çalışma', 'Prolonged, sedentary desk work'),
                L('Kontrolsüz diyabet', 'Uncontrolled diabetes'),
                L('Kronik stres ve uyku bozuklukları', 'Chronic stress and sleep disorders'),
                L('Sigara ve obezite', 'Smoking and obesity'),
                L('Geçirilmiş omurga cerrahileri', 'Previous spinal surgeries'),
            ],
            diagnosisDetail: [
                { name: L('Detaylı Algoloji Muayenesi', 'Detailed Algology Examination'), desc: L('Ağrının karakteri, süresi ve yayılımı; nörolojik ve kas-iskelet sistemi değerlendirmesi.', 'The character, duration and radiation of the pain; neurological and musculoskeletal assessment.') },
                { name: L('MR / BT Görüntüleme', 'MRI / CT Imaging'), desc: L('Omurga, sinir kökü ve yumuşak dokuların yüksek çözünürlükte değerlendirilmesi.', 'High-resolution evaluation of the spine, nerve roots and soft tissues.') },
                { name: L('EMG (Elektromiyografi)', 'EMG (Electromyography)'), desc: L('Sinir ileti hızları ve kas fonksiyonlarının nesnel ölçümü.', 'Objective measurement of nerve conduction velocities and muscle function.') },
                { name: L('Diagnostik Sinir Blokları', 'Diagnostic Nerve Blocks'), desc: L('Ağrının kaynağını doğrulamak için hedefe yönelik lokal anestezik uygulaması.', 'Targeted local-anaesthetic application to confirm the source of the pain.') },
            ],
            treatments: [
                { name: L('Epidural Steroid Enjeksiyonu', 'Epidural Steroid Injection'), desc: L('Bel ve boyun fıtığına bağlı sinir kökü basısında iltihabı azaltarak ağrıyı kontrol altına alır.', 'Controls pain by reducing inflammation in nerve-root compression from lumbar and cervical herniation.') },
                { name: L('Radyofrekans Termokoagülasyon', 'Radiofrequency Thermocoagulation'), desc: L('Faset eklem, trigeminal ve sempatik ağrılarda hedef sinire kontrollü ısı uygulanır; etki uzun sürelidir.', 'Controlled heat is applied to the target nerve in facet-joint, trigeminal and sympathetic pain; the effect is long-lasting.') },
                { name: L('Sinir ve Ganglion Blokları', 'Nerve and Ganglion Blocks'), desc: L('Ultrason/skopi eşliğinde hedefe yönelik ilaç uygulaması ile ağrının kırılması.', 'Breaking the pain with targeted medication under ultrasound/fluoroscopy guidance.') },
                { name: L('Nöromodülasyon (Omurilik Stimülasyonu)', 'Neuromodulation (Spinal Cord Stimulation)'), desc: L('Dirençli nöropatik ağrılarda elektriksel uyarı ile ağrı sinyalinin baskılanması.', 'Suppressing the pain signal with electrical stimulation in resistant neuropathic pain.') },
                { name: L('İntratekal Pompa Uygulamaları', 'Intrathecal Pump Therapy'), desc: L('İleri evre kanser ağrısında düşük doz ilacın omurilik sıvısına doğrudan verilmesi.', 'Delivering low-dose medication directly into the spinal fluid in advanced cancer pain.') },
                { name: L('Multidisipliner Rehabilitasyon', 'Multidisciplinary Rehabilitation'), desc: L('Fizik tedavi, egzersiz, psikolojik destek ve ilaç yönetimi ile bütüncül yaklaşım.', 'A holistic approach with physiotherapy, exercise, psychological support and medication management.') },
            ],
            whenToDoctor: [
                L('Ağrınız üç aydan uzun sürdüğünde', 'When your pain lasts more than three months'),
                L('Ağrı kesicilere rağmen yakınmalarınız devam ediyorsa', 'If your complaints persist despite painkillers'),
                L('Uyku, iş ve günlük yaşamınız etkileniyorsa', 'If your sleep, work and daily life are affected'),
                L('Bacak/kola yayılan güçsüzlük veya uyuşma varsa', 'If there is weakness or numbness radiating to the leg/arm'),
                L('Kanser tedavisi sürecinde ağrınız kontrol altına alınamıyorsa', 'If your pain cannot be controlled during cancer treatment'),
            ],
            technologies: [
                L('Skopi (C-Kollu) Eşliğinde Girişim', 'Fluoroscopy (C-arm) Guided Intervention'),
                L('Ultrason Rehberliğinde Blok', 'Ultrasound-Guided Block'),
                L('Radyofrekans Jeneratörü', 'Radiofrequency Generator'),
                L('Nöromodülasyon Sistemleri', 'Neuromodulation Systems'),
            ],
            faqs: [
                { q: L('Girişimsel ağrı tedavileri ameliyat mıdır?', 'Are interventional pain treatments surgery?'), a: L('Hayır. Genellikle lokal anestezi ile, iğne ucu kalınlığında girişimlerdir. Çoğu işlem günübirlik yapılır ve aynı gün taburculuk mümkündür.', 'No. They are generally needle-tip interventions under local anaesthesia. Most procedures are day cases and same-day discharge is possible.') },
                { q: L('Etkisi ne kadar sürer?', 'How long does the effect last?'), a: L('Uygulanan yönteme ve tanıya göre değişir. Radyofrekans uygulamalarında etki 6-18 ay arasında sürebilir; gerektiğinde tekrarlanabilir.', 'It varies by the method and diagnosis. With radiofrequency procedures the effect can last 6-18 months and may be repeated when needed.') },
                { q: L('İlaç kullanmadan ağrı kontrol edilebilir mi?', 'Can pain be controlled without medication?'), a: L('Birçok hastada girişimsel yöntemler, fizik tedavi ve yaşam tarzı düzenlemeleriyle ilaç ihtiyacı belirgin şekilde azaltılabilir.', 'In many patients, the need for medication can be markedly reduced with interventional methods, physiotherapy and lifestyle changes.') },
                { q: L('Hangi durumlarda Ağrı Polikliniğine başvurmalıyım?', 'When should I visit the Pain Clinic?'), a: L('Üç aydan uzun süren, günlük yaşamı etkileyen her türlü ağrıda; özellikle bel-boyun fıtığı, migren, trigeminal nevralji, diyabetik nöropati ve kanser ağrısında Algoloji değerlendirmesi önerilir.', 'For any pain lasting more than three months that affects daily life; an algology assessment is recommended especially for lumbar/cervical herniation, migraine, trigeminal neuralgia, diabetic neuropathy and cancer pain.') },
            ],
            warning: L('Ani başlayan şiddetli bel/boyun ağrısı, bacakta güç kaybı, idrar-gaita kontrolünde bozulma veya ateşle birlikte ağrı acil değerlendirme gerektirir. Vakit kaybetmeden başvurun.', 'Sudden severe low-back/neck pain, leg weakness, loss of bladder or bowel control, or pain accompanied by fever requires emergency evaluation. Seek care without delay.'),
            midCta: L('Ağrınız yaşam kalitenizi etkiliyorsa uzmanlarımızla görüşün.', 'If pain is affecting your quality of life, talk to our specialists.'),
        },
    },
    {
        slug: 'ameliyat-oncesi-degerlendirme', deptSlug: 'anesteziyoloji', cover: IMG.surgery,
        name: L('Ameliyat Öncesi Değerlendirme', 'Pre-operative Assessment'),
        summary: L('Cerrahi öncesinde hastanın anestezi açısından güvenli biçimde değerlendirildiği ve risklerin planlandığı süreç.', 'The process in which a patient is safely evaluated for anaesthesia before surgery and risks are planned for.'),
        detail: {
            what: L('Ameliyat öncesi değerlendirme; anestezi uzmanının hastanın sağlık durumunu, ilaçlarını ve risk faktörlerini gözden geçirerek her hastaya özel güvenli bir anestezi planı oluşturduğu aşamadır.', 'Pre-operative assessment is the stage in which the anaesthesiologist reviews the patient’s health status, medications and risk factors to create a safe anaesthesia plan tailored to each patient.'),
            symptoms: [L('Kronik hastalık öyküsü', 'History of chronic disease'), L('İlaç ve alerji öyküsü', 'Medication and allergy history'), L('Önceki anestezi deneyimleri', 'Previous anaesthesia experience')],
            causes: [L('Planlı cerrahi girişim', 'Planned surgical procedure'), L('Yüksek riskli hasta grubu', 'High-risk patient group'), L('Eşlik eden hastalıklar', 'Comorbidities')],
            diagnosis: [L('Anestezi uzmanı muayenesi', 'Anaesthesiologist examination'), L('Kan tetkikleri ve EKG', 'Blood tests and ECG'), L('Gerekirse ileri tetkikler', 'Advanced tests if needed')],
            treatment: [L('Kişiye özel anestezi planı', 'Personalized anaesthesia plan'), L('Risk azaltıcı öneriler', 'Risk-reduction recommendations'), L('Ameliyat öncesi bilgilendirme ve onam', 'Pre-operative information and consent')],
        },
    },
];
function resolveDisease(d: DiseaseSrc, l: Locale): Disease {
    return {
        slug: d.slug, name: d.name[l], summary: d.summary[l], deptSlug: d.deptSlug, cover: d.cover,
        detail: {
            what: d.detail.what[l],
            symptoms: d.detail.symptoms.map((s) => s[l]),
            causes: d.detail.causes.map((s) => s[l]),
            diagnosis: d.detail.diagnosis.map((s) => s[l]),
            treatment: d.detail.treatment.map((s) => s[l]),
            risks: d.detail.risks ? d.detail.risks.map((s) => s[l]) : undefined,
            diagnosisDetail: d.detail.diagnosisDetail ? d.detail.diagnosisDetail.map((x) => ({ name: x.name[l], desc: x.desc[l] })) : undefined,
            treatments: d.detail.treatments ? d.detail.treatments.map((x) => ({ name: x.name[l], desc: x.desc[l] })) : undefined,
            whenToDoctor: d.detail.whenToDoctor ? d.detail.whenToDoctor.map((s) => s[l]) : undefined,
            technologies: d.detail.technologies ? d.detail.technologies.map((s) => s[l]) : undefined,
            faqs: d.detail.faqs ? d.detail.faqs.map((f) => ({ q: f.q[l], a: f.a[l] })) : undefined,
            warning: d.detail.warning ? d.detail.warning[l] : undefined,
            midCta: d.detail.midCta ? d.detail.midCta[l] : undefined,
        },
    };
}
export function getDiseases(l: Locale): Disease[] { return DISEASES_SRC.map((d) => resolveDisease(d, l)); }
export function useDiseases(): Disease[] { const l = useLocale(); const c = useCatalog<Disease>('diseases'); return c ?? getDiseases(l); }
export function getDiseaseBySlug(slug: string, l: Locale): Disease | undefined {
    const __r = readRecordProp(); if (__r && __r.slug === slug) return __r as Disease;
    const d = DISEASES_SRC.find((x) => x.slug === slug);
    return d ? resolveDisease(d, l) : undefined;
}
/** Diseases linked to a department slug (relation helper for detail pages). */
export function getDiseasesForDept(deptSlug: string, l: Locale): Disease[] {
    const rel = readRelatedProp();
    if (rel && Array.isArray(rel.diseases)) return rel.diseases as unknown as Disease[];
    const cat = useCatalog<Disease>('diseases');
    if (cat) return cat.filter((d) => d.deptSlug === deptSlug);
    return DISEASES_SRC.filter((d) => d.deptSlug === deptSlug).map((d) => resolveDisease(d, l));
}

/* ── Technologies — representative sample with detail, related by dept slugs ── */
type TechnologySrc = {
    slug: string;
    name: Loc;
    desc: Loc;
    deptSlugs: string[];
    cover: string;
    detail: { what: Loc; how: Loc; advantages: Loc[]; diseaseSlugs?: string[]; treatmentSlugs?: string[] };
};
const TECHNOLOGIES_SRC: TechnologySrc[] = [
    {
        slug: 'da-vinci-robotik-cerrahi', deptSlugs: ['genel-cerrahi', 'uroloji', 'onkoloji'], cover: IMG.robotic,
        name: L('Da Vinci Robotik Cerrahi Sistemi', 'Da Vinci Robotic Surgery System'),
        desc: L('Üç boyutlu görüntü ve insan bileğini aşan hareket kabiliyetiyle çalışan robotik cerrahi platformu.', 'A robotic surgery platform working with 3D vision and a range of motion beyond the human wrist.'),
        detail: {
            what: L('Ürolojik, jinekolojik ve genel cerrahi ameliyatlarında kullanılan gelişmiş minimal invaziv platformdur.', 'An advanced minimally invasive platform used in urologic, gynaecological and general surgery.'),
            how: L('Cerrahın hareketleri titreşim filtrelenip ölçeklendirilerek robotik kollara aktarılır; üç boyutlu HD kamera cerrahi alanı büyütür.', 'The surgeon’s movements are tremor-filtered and scaled to the robotic arms; a 3D HD camera magnifies the operative field.'),
            advantages: [L('Küçük kesi, düşük kanama', 'Small incisions, low bleeding'), L('Hızlı iyileşme', 'Fast recovery'), L('Hassas kontrol', 'Precise control')],
            diseaseSlugs: ['prostat-buyumesi', 'meme-kanseri', 'safra-kesesi-tasi'],
            treatmentSlugs: ['robotik-cerrahi', 'laparoskopik-safra-kesesi'],
        },
    },
    {
        slug: 'mr-goruntuleme', deptSlugs: ['radyoloji', 'noroloji'], cover: IMG.imaging,
        name: L('Manyetik Rezonans (MR)', 'Magnetic Resonance Imaging (MRI)'),
        desc: L('Radyasyon kullanmadan yumuşak dokuların yüksek çözünürlükte görüntülendiği ileri tanı sistemi.', 'An advanced diagnostic system that images soft tissues at high resolution without radiation.'),
        detail: {
            what: L('Manyetik alan ve radyo dalgalarıyla vücudun kesitsel görüntülerini elde eden görüntüleme yöntemidir.', 'An imaging method that produces cross-sectional images of the body using a magnetic field and radio waves.'),
            how: L('Güçlü manyetik alan içindeki dokulardan alınan sinyaller bilgisayarda detaylı görüntülere dönüştürülür.', 'Signals from tissues within a strong magnetic field are converted into detailed images by computer.'),
            advantages: [L('Radyasyonsuz', 'Radiation-free'), L('Yumuşak dokuda üstün detay', 'Superior soft-tissue detail'), L('Girişimsiz', 'Non-invasive')],
            diseaseSlugs: ['migren', 'meniskus-yirtigi', 'koroner-arter-hastaligi'],
            treatmentSlugs: ['mr-goruntuleme-tanisi'],
        },
    },
    {
        slug: 'bilgisayarli-tomografi', deptSlugs: ['radyoloji'], cover: IMG.imaging,
        name: L('Bilgisayarlı Tomografi (BT)', 'Computed Tomography (CT)'),
        desc: L('X-ışını ile vücudun kesitsel görüntülerini hızlıca elde eden görüntüleme teknolojisi.', 'An imaging technology that rapidly produces cross-sectional images of the body using X-rays.'),
        detail: {
            what: L('Acil ve planlı durumlarda organ, kemik ve damar yapılarının ayrıntılı değerlendirilmesini sağlar.', 'Enables detailed evaluation of organs, bones and vessels in both emergency and planned settings.'),
            how: L('Dönen X-ışını kaynağı çok sayıda kesit alır; bilgisayar bu kesitleri birleştirerek üç boyutlu görüntü oluşturur.', 'A rotating X-ray source takes many slices; the computer combines them into a three-dimensional image.'),
            advantages: [L('Hızlı görüntüleme', 'Fast imaging'), L('Acil tanıda güçlü', 'Strong in emergency diagnosis'), L('Yüksek çözünürlük', 'High resolution')],
        },
    },
    {
        slug: 'refraktif-lazer-goz', deptSlugs: ['goz-hastaliklari'], cover: IMG.cataract,
        name: L('Refraktif Lazer Göz Tedavisi', 'Refractive Laser Eye Treatment'),
        desc: L('Miyop, hipermetrop ve astigmatın lazerle düzeltildiği gözlük bağımlılığını azaltan yöntem.', 'A method that corrects myopia, hyperopia and astigmatism with a laser, reducing dependence on glasses.'),
        detail: {
            what: L('Kornea şeklinin lazerle yeniden düzenlenerek kırma kusurlarının giderildiği bir tedavidir.', 'A treatment that eliminates refractive errors by reshaping the cornea with a laser.'),
            how: L('Ölçümlere göre planlanan lazer, kornea dokusunu mikron düzeyinde düzenleyerek odaklanmayı iyileştirir.', 'A laser planned from measurements reshapes corneal tissue at the micron level to improve focusing.'),
            advantages: [L('Kısa işlem süresi', 'Short procedure time'), L('Hızlı görme kazanımı', 'Rapid visual gain'), L('Gözlük bağımlılığında azalma', 'Reduced dependence on glasses')],
        },
    },
    {
        slug: 'anjiyografi-laboratuvari', deptSlugs: ['kardiyoloji', 'kalp-damar-cerrahisi'], cover: IMG.cardio,
        name: L('Anjiyografi Laboratuvarı', 'Angiography Laboratory'),
        desc: L('Kalp ve damar hastalıklarında tanı ve girişimsel tedavinin yapıldığı ileri kateter laboratuvarı.', 'An advanced catheter lab for diagnosis and interventional treatment of heart and vascular disease.'),
        detail: {
            what: L('Koroner damar hastalıklarının görüntülendiği ve gerektiğinde stentle tedavi edildiği birimdir.', 'A unit where coronary artery disease is imaged and, when needed, treated with stents.'),
            how: L('Damar içine ilerletilen kateter ve kontrast madde ile gerçek zamanlı görüntüleme yapılır.', 'Real-time imaging is performed with a catheter advanced into the vessel and contrast material.'),
            advantages: [L('Aynı seansta tanı ve tedavi', 'Diagnosis and treatment in one session'), L('Girişimsel yaklaşım', 'Interventional approach'), L('Günübirlik uygulama', 'Day-case procedure')],
        },
    },
    {
        slug: 'lineer-hizlandirici-radyoterapi', deptSlugs: ['onkoloji'], cover: IMG.onco,
        name: L('Lineer Hızlandırıcı (Radyoterapi)', 'Linear Accelerator (Radiotherapy)'),
        desc: L('Kanser tedavisinde tümöre hedefli yüksek enerjili ışın uygulayan radyoterapi sistemi.', 'A radiotherapy system delivering targeted high-energy beams to the tumour in cancer treatment.'),
        detail: {
            what: L('Sağlıklı dokuları koruyarak tümör bölgesine hassas ışın tedavisi uygulayan cihazdır.', 'A device that delivers precise beam therapy to the tumour region while sparing healthy tissue.'),
            how: L('Görüntü rehberliğinde planlanan ışın, tümörün şekline uyacak biçimde yönlendirilir.', 'Image-guided planning shapes and directs the beam to match the tumour’s geometry.'),
            advantages: [L('Hedefe yönelik tedavi', 'Targeted treatment'), L('Sağlıklı dokunun korunması', 'Sparing of healthy tissue'), L('Ayaktan uygulama', 'Outpatient delivery')],
        },
    },
    {
        slug: 'artroskopi-sistemi', deptSlugs: ['ortopedi'], cover: IMG.ortho,
        name: L('Artroskopi Sistemi', 'Arthroscopy System'),
        desc: L('Eklem içi hastalıkların kapalı yöntemle görüntülenip tedavi edildiği kamera destekli sistem.', 'A camera-assisted system for closed visualization and treatment of intra-articular conditions.'),
        detail: {
            what: L('Diz, omuz ve diğer eklemlerdeki sorunların küçük kesilerle tanı ve tedavisini sağlar.', 'Enables diagnosis and treatment of knee, shoulder and other joint problems through small incisions.'),
            how: L('Ekleme yerleştirilen ince kamera görüntüyü ekrana aktarır; enstrümanlarla onarım yapılır.', 'A thin camera placed in the joint transmits the image to a screen; repair is performed with instruments.'),
            advantages: [L('Minimal invaziv', 'Minimally invasive'), L('Hızlı iyileşme', 'Fast recovery'), L('Küçük izler', 'Minimal scarring')],
        },
    },
    {
        slug: 'endoskopi-sistemi', deptSlugs: ['genel-cerrahi'], cover: IMG.stomach,
        name: L('Endoskopi Sistemi', 'Endoscopy System'),
        desc: L('Sindirim sistemi hastalıklarının görüntülenip biyopsi alınabildiği ileri tanı sistemi.', 'An advanced diagnostic system for visualizing digestive-system conditions and taking biopsies.'),
        detail: {
            what: L('Gastroskopi ve kolonoskopi ile sindirim sistemi iç yüzeylerinin değerlendirilmesini sağlar.', 'Enables assessment of the inner surfaces of the digestive tract via gastroscopy and colonoscopy.'),
            how: L('Ucunda kamera bulunan esnek tüp ile görüntü alınır; gerektiğinde biyopsi ve girişim yapılır.', 'Imaging is obtained with a flexible tube bearing a camera at its tip; biopsy and intervention are performed when needed.'),
            advantages: [L('Erken tanı imkânı', 'Opportunity for early diagnosis'), L('Biyopsi alabilme', 'Ability to take biopsies'), L('Girişimsiz değerlendirme', 'Non-surgical assessment')],
        },
    },
    {
        slug: 'fakoemulsifikasyon', deptSlugs: ['goz-hastaliklari'], cover: IMG.cataract,
        name: L('Fakoemülsifikasyon', 'Phacoemulsification'),
        desc: L('Katarakt cerrahisinde merceğin ultrasonla parçalanıp temizlendiği modern yöntem.', 'A modern method in cataract surgery where the lens is broken up and removed with ultrasound.'),
        detail: {
            what: L('Bulanıklaşan göz merceğinin küçük kesiden ultrasonik enerjiyle çıkarıldığı tekniktir.', 'A technique in which the clouded lens is removed with ultrasonic energy through a small incision.'),
            how: L('Ultrasonik prob mercek çekirdeğini parçalar ve aspire eder; ardından göz içi lens yerleştirilir.', 'An ultrasonic probe fragments and aspirates the lens nucleus; an intraocular lens is then placed.'),
            advantages: [L('Dikişsiz uygulama', 'Sutureless procedure'), L('Hızlı iyileşme', 'Fast recovery'), L('Günübirlik cerrahi', 'Day-case surgery')],
        },
    },
    {
        slug: 'hiperbarik-oksijen-tedavisi', deptSlugs: ['genel-cerrahi'], cover: IMG.lab,
        name: L('Hiperbarik Oksijen Tedavisi', 'Hyperbaric Oxygen Therapy'),
        desc: L('Basınç odasında yüksek oksijen ile doku iyileşmesinin hızlandırıldığı tedavi yöntemi.', 'A treatment that accelerates tissue healing with high-concentration oxygen in a pressure chamber.'),
        detail: {
            what: L('Diyabetik ayak yarası ve zor iyileşen yaralarda dokuların oksijenlenmesini artıran tedavidir.', 'A treatment that increases tissue oxygenation in diabetic foot wounds and hard-to-heal wounds.'),
            how: L('Hasta basınç odasında yüksek basınç altında saf oksijen soluyarak dokuya ulaşan oksijeni artırır.', 'The patient breathes pure oxygen under high pressure in a chamber, increasing oxygen delivery to tissue.'),
            advantages: [L('Yara iyileşmesini hızlandırma', 'Accelerated wound healing'), L('Enfeksiyonla mücadeleye destek', 'Support against infection'), L('Ağrısız uygulama', 'Painless application')],
        },
    },
];
function resolveTechnology(t: TechnologySrc, l: Locale): Technology {
    return {
        slug: t.slug, name: t.name[l], desc: t.desc[l], deptSlugs: t.deptSlugs, cover: t.cover,
        detail: { what: t.detail.what[l], how: t.detail.how[l], advantages: t.detail.advantages.map((a) => a[l]), diseaseSlugs: t.detail.diseaseSlugs, treatmentSlugs: t.detail.treatmentSlugs },
    };
}
export function getTechnologies(l: Locale): Technology[] { return TECHNOLOGIES_SRC.map((t) => resolveTechnology(t, l)); }
export function useTechnologies(): Technology[] { const l = useLocale(); const c = useCatalog<Technology>('technologies'); return c ?? getTechnologies(l); }
export function getTechnologyBySlug(slug: string, l: Locale): Technology | undefined {
    const __r = readRecordProp(); if (__r && __r.slug === slug) return __r as Technology;
    const t = TECHNOLOGIES_SRC.find((x) => x.slug === slug);
    return t ? resolveTechnology(t, l) : undefined;
}
/** Technologies linked to a department slug (relation helper for detail pages). */
export function getTechnologiesForDept(deptSlug: string, l: Locale): Technology[] {
    const rel = readRelatedProp();
    if (rel && Array.isArray(rel.technologies)) return rel.technologies as unknown as Technology[];
    const cat = useCatalog<Technology>('technologies');
    if (cat) return cat.filter((t) => t.deptSlugs.includes(deptSlug));
    return TECHNOLOGIES_SRC.filter((t) => t.deptSlugs.includes(deptSlug)).map((t) => resolveTechnology(t, l));
}

/* ── Events ── */
type EventSrc = { slug: string; title: Loc; excerpt: Loc; body: Loc; date: string; place: Loc; cover: string };
const EVENTS_SRC: EventSrc[] = [
    {
        slug: 'kalp-sagligi-gunu-2026', date: '2026-02-14', cover: IMG.cardio,
        title: L('Kalp Sağlığı Farkındalık Günü', 'Heart Health Awareness Day'),
        place: L('Hisar Hospital Intercontinental — Konferans Salonu', 'Hisar Hospital Intercontinental — Conference Hall'),
        excerpt: L('Kardiyoloji ve KVC uzmanlarımızla risk faktörleri, önleme ve modern tedavi seçenekleri.', 'Risk factors, prevention and modern treatment options with our cardiology and cardiovascular surgery specialists.'),
        body: L('Kardiyoloji ve Kalp-Damar Cerrahisi ekiplerimizin birlikte hazırladığı bu farkındalık gününde koroner arter hastalığı, hipertansiyon ve ritim bozukluklarında güncel yaklaşımları konuşuyoruz. Etkinlik ücretsizdir ve önceden kayıt gereklidir.', 'On this awareness day, prepared jointly by our cardiology and cardiovascular surgery teams, we discuss current approaches to coronary artery disease, hypertension and arrhythmias. The event is free and prior registration is required.'),
    },
    {
        slug: 'gebe-okulu-bahar-donemi', date: '2026-03-22', cover: IMG.women,
        title: L('Gebe Okulu Bahar Dönemi', 'Spring Antenatal School'),
        place: L('Hisar Hospital Çamlıca — Eğitim Salonu', 'Hisar Hospital Çamlıca — Training Hall'),
        excerpt: L('Anne adaylarına yönelik doğum öncesi ve sonrası bakım eğitim programı.', 'A prenatal and postnatal care education program for expectant mothers.'),
        body: L('Gebe okulu programımızda anne adaylarına doğum süreci, emzirme, yenidoğan bakımı ve doğum sonrası dönem hakkında uzman hekim ve hemşirelerimiz tarafından kapsamlı eğitim verilir.', 'In our antenatal school, our specialist doctors and nurses provide comprehensive education on the birth process, breastfeeding, newborn care and the postpartum period for expectant mothers.'),
    },
    {
        slug: 'goz-taramasi-etkinligi', date: '2026-04-05', cover: IMG.eye,
        title: L('Ücretsiz Göz Taraması Etkinliği', 'Free Eye Screening Event'),
        place: L('Hisar Hospital Intercontinental — Göz Merkezi', 'Hisar Hospital Intercontinental — Eye Centre'),
        excerpt: L('Erken tanı için 40 yaş üstü katılımcılara yönelik ücretsiz göz tarama günü.', 'A free eye screening day for participants over 40 for early diagnosis.'),
        body: L('Katarakt, glokom ve retina hastalıklarının erken tanısı için düzenlenen bu ücretsiz tarama gününde göz tansiyonu ölçümü ve uzman değerlendirmesi yapılır. Kontenjan sınırlıdır.', 'On this free screening day organized for the early diagnosis of cataract, glaucoma and retinal disease, eye-pressure measurement and specialist assessment are provided. Places are limited.'),
    },
    {
        slug: 'diyabet-farkindalik-gunu', date: '2026-05-18', cover: IMG.lab,
        title: L('Diyabet Farkındalık Günü', 'Diabetes Awareness Day'),
        place: L('Hisar Hospital Intercontinental — Konferans Salonu', 'Hisar Hospital Intercontinental — Conference Hall'),
        excerpt: L('Diyabetten korunma, beslenme ve kan şekeri yönetimi üzerine bilgilendirme.', 'Information on diabetes prevention, nutrition and blood-sugar management.'),
        body: L('Endokrinoloji ve beslenme uzmanlarımızın katılımıyla diyabetten korunma yolları, sağlıklı beslenme ve kan şekeri takibinin önemi ele alınır; ücretsiz kan şekeri ölçüm istasyonu bulunur.', 'With our endocrinology and nutrition specialists, we address ways to prevent diabetes, healthy eating and the importance of blood-sugar monitoring; a free blood-sugar measurement station is available.'),
    },
];
function resolveEvent(e: EventSrc, l: Locale): EventItem {
    return { slug: e.slug, title: e.title[l], excerpt: e.excerpt[l], body: e.body[l], date: e.date, place: e.place[l], cover: e.cover };
}
export function getEvents(l: Locale): EventItem[] { return EVENTS_SRC.map((e) => resolveEvent(e, l)); }
export function useEvents(): EventItem[] { const l = useLocale(); const c = useCatalog<EventItem>('events'); return c ?? getEvents(l); }
export function getEventBySlug(slug: string, l: Locale): EventItem | undefined {
    const __r = readRecordProp(); if (__r && __r.slug === slug) return __r as EventItem;
    const e = EVENTS_SRC.find((x) => x.slug === slug);
    return e ? resolveEvent(e, l) : undefined;
}

/* ── Packages / Check-up ── */
type PackageSrc = { slug: string; name: Loc; summary: Loc; scope: Loc[]; cover: string };
const PACKAGES_SRC: PackageSrc[] = [
    {
        slug: 'genel-check-up', cover: IMG.checkup,
        name: L('Genel Check-Up', 'General Check-Up'),
        summary: L('Kalp-damar, metabolik ve genel sağlık durumunuzun bir gün içinde kapsamlı değerlendirildiği proaktif sağlık taraması.', 'A proactive health screening that comprehensively evaluates your cardiovascular, metabolic and general health in a single day.'),
        scope: [L('Kapsamlı laboratuvar tetkikleri', 'Comprehensive laboratory tests'), L('EKG ve ekokardiyografi', 'ECG and echocardiography'), L('Akciğer grafisi ve batın ultrasonu', 'Chest X-ray and abdominal ultrasound'), L('Dahiliye uzman değerlendirmesi', 'Internal medicine specialist assessment')],
    },
    {
        slug: 'kadin-check-up', cover: IMG.women,
        name: L('Kadın Check-Up', 'Women’s Check-Up'),
        summary: L('Kadın sağlığına özel taramaların bir araya getirildiği kapsamlı check-up paketi.', 'A comprehensive check-up package bringing together screenings specific to women’s health.'),
        scope: [L('Kadın hastalıkları muayenesi', 'Gynaecological examination'), L('Meme ultrasonu ve mamografi', 'Breast ultrasound and mammography'), L('Smear testi', 'Pap smear test'), L('Kemik yoğunluğu ölçümü', 'Bone density measurement')],
    },
    {
        slug: 'erkek-check-up', cover: IMG.checkup,
        name: L('Erkek Check-Up', 'Men’s Check-Up'),
        summary: L('Erkek sağlığına yönelik kalp, prostat ve metabolik risk taramalarını içeren check-up paketi.', 'A check-up package covering heart, prostate and metabolic risk screenings for men’s health.'),
        scope: [L('Üroloji ve prostat taraması (PSA)', 'Urology and prostate screening (PSA)'), L('Kalp ve efor testi', 'Cardiac and exercise stress test'), L('Metabolik risk değerlendirmesi', 'Metabolic risk assessment'), L('Kapsamlı kan tetkikleri', 'Comprehensive blood tests')],
    },
    {
        slug: 'dogum-paketi', cover: IMG.women,
        name: L('Doğum Paketi', 'Birth Package'),
        summary: L('Doğum sürecini ve sonrasını konforlu kılan hizmetleri kapsayan doğum paketi.', 'A birth package covering services that make the delivery process and its aftermath comfortable.'),
        scope: [L('Doğum ve yenidoğan bakımı', 'Delivery and newborn care'), L('Anne konforuna özel oda seçenekleri', 'Room options for maternal comfort'), L('Doğum sonrası kontrol paketi', 'Postnatal follow-up package'), L('Emzirme danışmanlığı', 'Breastfeeding counselling')],
    },
];
function resolvePackage(p: PackageSrc, l: Locale): HealthPackage {
    return { slug: p.slug, name: p.name[l], summary: p.summary[l], scope: p.scope.map((s) => s[l]), cover: p.cover };
}
export function getPackages(l: Locale): HealthPackage[] { return PACKAGES_SRC.map((p) => resolvePackage(p, l)); }
export function usePackages(): HealthPackage[] { const l = useLocale(); const c = useCatalog<HealthPackage>('packages'); return c ?? getPackages(l); }
export function getPackageBySlug(slug: string, l: Locale): HealthPackage | undefined {
    const __r = readRecordProp(); if (__r && __r.slug === slug) return __r as HealthPackage;
    const p = PACKAGES_SRC.find((x) => x.slug === slug);
    return p ? resolvePackage(p, l) : undefined;
}

/* ── Press (Basında Hastanemiz) ── */
type PressSrc = { slug: string; title: Loc; excerpt: Loc; source: Loc; date: string; cover: string };
const PRESS_SRC: PressSrc[] = [
    {
        slug: 'da-vinci-robotik-cerrahi-hasta-deneyimi', date: '2025-03-12', cover: IMG.robotic, source: S('Sağlık Aktüel'),
        title: L('Hisar Hospital’da Da Vinci robotik cerrahi hasta deneyimi', 'The Da Vinci robotic surgery patient experience at Hisar Hospital'),
        excerpt: L('Da Vinci platformuyla gerçekleştirilen minimal invaziv operasyonlar iyileşme sürecine belirgin katkı sağlıyor.', 'Minimally invasive operations performed with the Da Vinci platform contribute markedly to recovery.'),
    },
    {
        slug: 'hisar-hospital-yeni-onkoloji-merkezi', date: '2025-05-08', cover: IMG.onco, source: S('Medikal Haber'),
        title: L('Hisar Hospital yeni onkoloji merkezini hizmete açtı', 'Hisar Hospital opens its new oncology centre'),
        excerpt: L('Bütünleşik kanser tanı ve tedavisi sunan yeni merkez, ileri radyoterapi altyapısıyla donatıldı.', 'The new centre offering integrated cancer diagnosis and treatment is equipped with advanced radiotherapy infrastructure.'),
    },
    {
        slug: 'kalp-kapak-tedavisinde-tavi', date: '2025-06-20', cover: IMG.cardio, source: S('Kardiyoloji Bülteni'),
        title: L('Kapalı yöntemle kalp kapağı tedavisi (TAVI) yaygınlaşıyor', 'Transcatheter heart valve treatment (TAVI) is becoming widespread'),
        excerpt: L('Açık cerrahiye uygun olmayan hastalarda kateter yoluyla kapak tedavisi umut veriyor.', 'Catheter-based valve treatment offers hope for patients unsuitable for open surgery.'),
    },
    {
        slug: 'cocuk-sagliginda-erken-tani', date: '2025-07-15', cover: IMG.child, source: S('Aile ve Sağlık'),
        title: L('Çocuk sağlığında erken tanının önemi', 'The importance of early diagnosis in child health'),
        excerpt: L('Uzmanlarımız düzenli çocuk kontrollerinin gelişim sorunlarını erkenden yakalamadaki rolünü anlattı.', 'Our specialists explained the role of regular paediatric check-ups in catching developmental issues early.'),
    },
    {
        slug: 'obezite-cerrahisinde-guncel-yaklasimlar', date: '2025-08-30', cover: IMG.stomach, source: S('Sağlık Gündemi'),
        title: L('Obezite cerrahisinde güncel yaklaşımlar', 'Current approaches in obesity surgery'),
        excerpt: L('Laparoskopik ve metabolik cerrahi yöntemleri, uygun hastalarda kalıcı kilo kontrolü sağlıyor.', 'Laparoscopic and metabolic surgery methods provide durable weight control in suitable patients.'),
    },
    {
        slug: 'saglikli-yaslanma-ve-check-up', date: '2025-09-22', cover: IMG.checkup, source: S('Yaşam ve Sağlık'),
        title: L('Sağlıklı yaşlanmada düzenli check-up’ın rolü', 'The role of regular check-ups in healthy ageing'),
        excerpt: L('Belirti vermeden ilerleyen hastalıkların erken yakalanmasında düzenli taramanın önemi vurgulandı.', 'The importance of regular screening in catching silently progressing diseases early was emphasized.'),
    },
];
function resolvePress(p: PressSrc, l: Locale): PressItem {
    return { slug: p.slug, title: p.title[l], excerpt: p.excerpt[l], source: p.source[l], date: p.date, cover: p.cover };
}
export function getPress(l: Locale): PressItem[] { return PRESS_SRC.map((p) => resolvePress(p, l)); }
export function usePress(): PressItem[] { const l = useLocale(); const c = useCatalog<PressItem>('press'); return c ?? getPress(l); }
export function getPressBySlug(slug: string, l: Locale): PressItem | undefined {
    const __r = readRecordProp(); if (__r && __r.slug === slug) return __r as PressItem;
    const p = PRESS_SRC.find((x) => x.slug === slug);
    return p ? resolvePress(p, l) : undefined;
}

/* ── FAQ — grouped by category ── */
type FaqSrc = { slug: string; title: Loc; items: { q: Loc; a: Loc }[] };
const FAQ_SRC: FaqSrc[] = [
    {
        slug: 'randevu', title: L('Randevu', 'Appointments'),
        items: [
            { q: L('Randevuyu nasıl alabilirim?', 'How can I book an appointment?'), a: L('Online randevu formundan, çağrı merkezimizden veya hastane danışmasından randevu oluşturabilirsiniz.', 'You can book through our online appointment form, call centre or the hospital reception desk.') },
            { q: L('Randevumu nasıl iptal edebilirim?', 'How can I cancel my appointment?'), a: L('Çağrı merkezimizi arayarak randevunuzu iptal edebilir veya yeni bir tarihe erteleyebilirsiniz.', 'You can cancel or reschedule your appointment by calling our call centre.') },
        ],
    },
    {
        slug: 'tedavi-oncesi', title: L('Tedavi Öncesi', 'Before Treatment'),
        items: [
            { q: L('Ameliyat öncesi aç kalmam gerekir mi?', 'Do I need to fast before surgery?'), a: L('Genel anestezi gerektiren işlemlerde genellikle 6-8 saat açlık istenir; hekiminiz size özel bilgi verecektir.', 'For procedures requiring general anaesthesia, 6-8 hours of fasting is usually required; your doctor will give you specific instructions.') },
            { q: L('Tetkik sonuçlarımı yanımda getirmeli miyim?', 'Should I bring my previous test results?'), a: L('Önceki tetkik ve görüntülemelerinizi getirmeniz değerlendirmeyi hızlandırır.', 'Bringing your previous tests and imaging speeds up the evaluation.') },
        ],
    },
    {
        slug: 'odeme-sigorta', title: L('Ödeme ve Sigorta', 'Payment & Insurance'),
        items: [
            { q: L('Özel sigorta anlaşmanız var mı?', 'Do you work with private insurance?'), a: L('Birçok özel sağlık sigortası ile anlaşmamız bulunmaktadır; güncel durumu çağrı merkezimizden teyit edebilirsiniz.', 'We have agreements with many private health insurers; you can confirm the current status via our call centre.') },
            { q: L('Ödeme seçenekleri nelerdir?', 'What are the payment options?'), a: L('Nakit, kredi kartı ve taksit seçenekleri sunulmaktadır.', 'Cash, credit card and instalment options are available.') },
        ],
    },
    {
        slug: 'ziyaret', title: L('Ziyaret ve Yatış', 'Visiting & Admission'),
        items: [
            { q: L('Ziyaret saatleri nedir?', 'What are the visiting hours?'), a: L('Ziyaret saatleri servis ve klinik durumuna göre değişir; güncel bilgiyi danışmadan alabilirsiniz.', 'Visiting hours vary by ward and clinical condition; you can get current information from the reception.') },
            { q: L('Refakatçi kalabilir mi?', 'Can a companion stay?'), a: L('Uygun oda tiplerinde refakatçi konaklaması mümkündür.', 'Companion accommodation is possible in suitable room types.') },
        ],
    },
    {
        slug: 'genel', title: L('Genel', 'General'),
        items: [
            { q: L('Yabancı hastalara hizmet veriyor musunuz?', 'Do you serve international patients?'), a: L('Uluslararası hasta birimimiz tercümanlık ve süreç yönetimi desteği sağlar.', 'Our international patient unit provides interpreting and process-management support.') },
            { q: L('Otopark imkânı var mı?', 'Is parking available?'), a: L('Hastane kampüsümüzde ücretsiz hasta ve ziyaretçi otoparkı bulunmaktadır.', 'Free patient and visitor parking is available on our hospital campus.') },
        ],
    },
];
function resolveFaq(c: FaqSrc, l: Locale): FaqCategory {
    return { slug: c.slug, title: c.title[l], items: c.items.map((i) => ({ q: i.q[l], a: i.a[l] })) };
}
export function getFaq(l: Locale): FaqCategory[] { return FAQ_SRC.map((c) => resolveFaq(c, l)); }
export function useFaq(): FaqCategory[] { const l = useLocale(); const c = useCatalog<FaqCategory>('faq'); return c ?? getFaq(l); }

/* ── Videos ── */
type VideoSrc = { id: string; title: Loc; youtubeId: string; deptSlug?: string; category: Loc; duration: string };
const VIDEOS_SRC: VideoSrc[] = [
    { id: 'v1', youtubeId: 'dQw4w9WgXcQ', deptSlug: 'uroloji', duration: '6:24', category: L('Tedavi', 'Treatment'), title: L('Da Vinci Robotik Cerrahi Nasıl Uygulanır?', 'How Is Da Vinci Robotic Surgery Performed?') },
    { id: 'v2', youtubeId: '3JZ_D3ELwOQ', deptSlug: 'goz-hastaliklari', duration: '4:12', category: L('Hasta Bilgilendirme', 'Patient Information'), title: L('Katarakt Ameliyatı Sonrası İyileşme Süreci', 'Recovery After Cataract Surgery') },
    { id: 'v3', youtubeId: 'M7lc1UVf-VE', deptSlug: 'ortopedi', duration: '5:48', category: L('Rehabilitasyon', 'Rehabilitation'), title: L('Diz Protezi Sonrası Rehabilitasyon', 'Rehabilitation After Knee Replacement') },
    { id: 'v4', youtubeId: 'e-ORhEE9VVg', deptSlug: 'genel-cerrahi', duration: '7:03', category: L('Tedavi', 'Treatment'), title: L('Obezite Cerrahisi: Kimler Uygun Aday?', 'Obesity Surgery: Who Is a Suitable Candidate?') },
    { id: 'v5', youtubeId: 'kJQP7kiw5Fk', deptSlug: 'kadin-hastaliklari-dogum', duration: '3:55', category: L('Sağlıklı Yaşam', 'Healthy Living'), title: L('Gebelikte Beslenme Önerileri', 'Nutrition Advice During Pregnancy') },
    { id: 'v6', youtubeId: 'fJ9rUzIMcZQ', deptSlug: 'kardiyoloji', duration: '4:40', category: L('Sağlıklı Yaşam', 'Healthy Living'), title: L('Kalp Sağlığı İçin 5 Altın Kural', '5 Golden Rules for Heart Health') },
    { id: 'v7', youtubeId: 'RgKAFK5djSk', deptSlug: 'noroloji', duration: '3:48', category: L('Hasta Bilgilendirme', 'Patient Information'), title: L('İnme Belirtilerini Tanımak', 'Recognizing the Signs of Stroke') },
    { id: 'v8', youtubeId: 'OPf0YbXqDm0', deptSlug: 'kbb', duration: '5:02', category: L('Tedavi', 'Treatment'), title: L('Sinüzit Tedavisinde Endoskopik Cerrahi', 'Endoscopic Surgery in Sinusitis Treatment') },
    { id: 'v9', youtubeId: 'ScMzIvxBSi4', deptSlug: 'anesteziyoloji', duration: '4:36', category: L('Hasta Bilgilendirme', 'Patient Information'), title: L('Anestezi Öncesi Bilmeniz Gerekenler', 'What You Should Know Before Anaesthesia') },
    { id: 'v10', youtubeId: 'lYBUbBu4W08', deptSlug: 'anesteziyoloji', duration: '5:20', category: L('Tedavi', 'Treatment'), title: L('Ağrısız Doğum Nasıl Uygulanır?', 'How Is Painless Labour Performed?') },
];
function resolveVideo(v: VideoSrc, l: Locale): Video {
    return { id: v.id, title: v.title[l], youtubeId: v.youtubeId, deptSlug: v.deptSlug, category: v.category[l], duration: v.duration };
}
export function getVideos(l: Locale): Video[] { return VIDEOS_SRC.map((v) => resolveVideo(v, l)); }
/** Videos linked to a department slug (relation helper for detail pages). */
export function getVideosForDept(deptSlug: string, l: Locale): Video[] {
    const rel = readRelatedProp();
    if (rel && Array.isArray(rel.videos)) return rel.videos as unknown as Video[];
    const cat = useCatalog<Video>('videos');
    if (cat) return cat.filter((v) => v.deptSlug === deptSlug);
    return VIDEOS_SRC.filter((v) => v.deptSlug === deptSlug).map((v) => resolveVideo(v, l));
}
export function useVideos(): Video[] { const l = useLocale(); const c = useCatalog<Video>('videos'); return c ?? getVideos(l); }

/* ── Backward-compat (Turkish-resolved) consts for existing consumers (e.g. header search) ── */
export const departments: Department[] = getDepartments('tr');
export const hospitals: Hospital[] = getHospitals('tr');
export const blogPosts: BlogPost[] = getBlogPosts('tr');
export const doctors: Doctor[] = getDoctors('tr');
export const treatments: Treatment[] = getTreatments('tr');
export const diseases: Disease[] = getDiseases('tr');
export const technologies: Technology[] = getTechnologies('tr');
export const events: EventItem[] = getEvents('tr');
export const packages: HealthPackage[] = getPackages('tr');
export const press: PressItem[] = getPress('tr');
export const faq: FaqCategory[] = getFaq('tr');
export const videos: Video[] = getVideos('tr');
export const SYMPTOM_TO_DEPT: SymptomMap[] = getSymptomMap('tr');

/** Turkish-insensitive normaliser for search/matching. */
export function normalizeTr(s: string): string {
    return (s || '')
        .toLocaleLowerCase('tr')
        .replaceAll('ı', 'i').replaceAll(' İ', 'i').replaceAll('ş', 's')
        .replaceAll('ğ', 'g').replaceAll('ü', 'u').replaceAll('ö', 'o').replaceAll('ç', 'c')
        .trim();
}
