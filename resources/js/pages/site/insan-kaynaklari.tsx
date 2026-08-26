import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Briefcase, GraduationCap, Heart, MapPin, Users, Clock, ArrowRight, Upload, Stethoscope, ChevronDown, CheckCircle2 } from 'lucide-react';

import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { useLocale, useLocalizedPath } from '@/lib/i18n';

type GroupKey = 'Sağlık' | 'İdari' | 'Teknik' | 'Staj';
const GROUP_KEYS: GroupKey[] = ['Sağlık', 'İdari', 'Teknik', 'Staj'];

type Job = {
    id: string;
    group: GroupKey;
    location: string;
    tr: { title: string; department: string; type: string };
    en: { title: string; department: string; type: string };
};

const JOBS: Job[] = [
    {
        id: '1',
        group: 'Sağlık',
        location: 'Intercontinental',
        tr: { title: 'Yoğun Bakım Hemşiresi', department: 'Anestezi ve Reanimasyon', type: 'Tam zamanlı' },
        en: { title: 'Intensive Care Nurse', department: 'Anesthesiology and Reanimation', type: 'Full-time' },
    },
    {
        id: '2',
        group: 'Sağlık',
        location: 'Çamlıca',
        tr: { title: 'Ameliyathane Teknikeri', department: 'Ameliyathane', type: 'Tam zamanlı' },
        en: { title: 'Operating Room Technician', department: 'Operating Room', type: 'Full-time' },
    },
    {
        id: '3',
        group: 'İdari',
        location: 'Intercontinental',
        tr: { title: 'Hasta İlişkileri Uzmanı', department: 'Hasta Deneyimi', type: 'Tam zamanlı' },
        en: { title: 'Patient Relations Specialist', department: 'Patient Experience', type: 'Full-time' },
    },
    {
        id: '4',
        group: 'Teknik',
        location: 'Çamlıca',
        tr: { title: 'Biyomedikal Teknikeri', department: 'Teknik Hizmetler', type: 'Tam zamanlı' },
        en: { title: 'Biomedical Technician', department: 'Technical Services', type: 'Full-time' },
    },
    {
        id: '5',
        group: 'Staj',
        location: 'Intercontinental',
        tr: { title: 'Radyoloji Stajyeri', department: 'Radyoloji', type: 'Staj' },
        en: { title: 'Radiology Intern', department: 'Radiology', type: 'Internship' },
    },
    {
        id: '6',
        group: 'İdari',
        location: 'Intercontinental',
        tr: { title: 'Muhasebe Uzman Yardımcısı', department: 'Mali İşler', type: 'Tam zamanlı' },
        en: { title: 'Assistant Accounting Specialist', department: 'Finance', type: 'Full-time' },
    },
];

const CARD_ICONS = [Heart, GraduationCap, Users];

const COPY = {
    tr: {
        head: {
            title: 'İnsan Kaynakları — Hisar Hospital',
            description: "Hisar Hospital'da kariyer fırsatları, açık pozisyonlar ve başvuru süreci.",
        },
        pageTitle: 'İnsan Kaynakları',
        crumbCorporate: 'Kurumsal',
        crumbCurrent: 'İnsan Kaynakları',
        cards: [
            { title: 'Kültürümüz', desc: 'İnsan odaklı, çok disiplinli ve öğrenmeye açık bir çalışma kültürü.' },
            { title: 'Gelişim İmkânları', desc: 'Sürekli eğitim, mentorluk ve uluslararası kongre destekleri.' },
            { title: 'Değerlerimiz', desc: 'Hasta güvenliği, ekip çalışması, dürüstlük ve şeffaflık.' },
        ],
        openTitle: 'Açık Pozisyonlar',
        openDesc: 'Size uygun rolü bulun ve başvurun.',
        groupLabels: { Tümü: 'Tümü', Sağlık: 'Sağlık', İdari: 'İdari', Teknik: 'Teknik', Staj: 'Staj' },
        details: 'Detayları Gör',
        empty: 'Bu kategoride şu an açık pozisyon bulunmuyor.',
        faqEyebrow: '— SSS',
        faqTitle: 'Sık Sorulan Sorular',
        faq: [
            [
                'Başvuru nasıl değerlendiriliyor?',
                'Başvurular İK ekibimizce incelenir; uygun profillerle görüşme ve teknik değerlendirme aşamalarına geçilir.',
            ],
            [
                'Staj başvurusu yapabilir miyim?',
                "Sağlık ve idari birimlerimizde stajyer kabul edilmektedir. Genel başvuru formundan 'Staj' seçeneğiyle iletebilirsiniz.",
            ],
            [
                'Bilgilerim ne kadar süre saklanır?',
                'Başvuru bilgileriniz KVKK Politikamız çerçevesinde işlenir ve azami saklama süresi sonunda imha edilir.',
            ],
        ],
        app: {
            badge: 'Başvuru',
            title: 'Aramıza katılın',
            desc: 'Aradığınız pozisyonu bulamadıysanız aşağıdaki formdan başvuru yapabilirsiniz. Hekim adayları için ayrı bir sekme sunuyoruz.',
            note: 'Form yalnızca tasarım prototipidir; kayıt gönderimi aktif değildir.',
            tablistAria: 'Başvuru türü',
            tabGeneral: 'Genel Başvuru',
            tabPhysician: 'Hekim Başvurusu',
            name: 'Ad Soyad',
            email: 'E-posta',
            phone: 'Telefon',
            positionAria: 'Pozisyon',
            positionPlaceholder: 'İlgilendiğiniz pozisyon',
            cvAria: 'Kısa özgeçmiş',
            cvGeneralPlaceholder: 'Kısa özgeçmiş / not',
            submitGeneral: 'Başvuruyu Gönder',
            titleAria: 'Unvan',
            titlePlaceholder: 'Unvan seçin',
            titleOptions: ['Prof. Dr.', 'Doç. Dr.', 'Uzm. Dr.', 'Op. Dr.', 'Dr.'],
            specialtyAria: 'Uzmanlık alanı',
            specialtyPlaceholder: 'Uzmanlık alanı seçin',
            specialtyOptions: [
                'Kardiyoloji',
                'Kalp ve Damar Cerrahisi',
                'Genel Cerrahi',
                'Üroloji',
                'Göz Hastalıkları',
                'Onkoloji',
                'Ortopedi ve Travmatoloji',
                'Anestezi ve Reanimasyon',
                'Diğer',
            ],
            uploadLabel: 'CV / belge yükleyin (PDF, DOC, DOCX — maks. 5MB)',
            cvPhysicianPlaceholder: 'Kısa özgeçmiş, deneyim, yayınlar',
            submitPhysician: 'Hekim Başvurusunu Gönder',
            cvUploadLabel: 'CV yükleyin (PDF, DOC, DOCX — maks. 5MB)',
            cvChosen: 'Seçilen dosya:',
            kvkkPre: '',
            kvkkLink: 'KVKK Aydınlatma Metni',
            kvkkPost: '’ni okudum, kişisel verilerimin işe alım süreçlerinde işlenmesine onay veriyorum.',
            kvkkError: 'KVKK onayı zorunludur',
            successTitle: 'Başvurunuz alındı',
            successBody: 'Talebiniz alındı, İK ekibimiz başvurunuzu değerlendirip en kısa sürede dönüş yapacaktır.',
        },
    },
    en: {
        head: {
            title: 'Human Resources — Hisar Hospital',
            description: 'Career opportunities, open positions and the application process at Hisar Hospital.',
        },
        pageTitle: 'Human Resources',
        crumbCorporate: 'Corporate',
        crumbCurrent: 'Human Resources',
        cards: [
            { title: 'Our Culture', desc: 'A human-focused, multidisciplinary work culture open to learning.' },
            { title: 'Development Opportunities', desc: 'Continuous training, mentorship and international congress support.' },
            { title: 'Our Values', desc: 'Patient safety, teamwork, honesty and transparency.' },
        ],
        openTitle: 'Open Positions',
        openDesc: 'Find the role that suits you and apply.',
        groupLabels: { Tümü: 'All', Sağlık: 'Health', İdari: 'Administrative', Teknik: 'Technical', Staj: 'Internship' },
        details: 'View Details',
        empty: 'There are currently no open positions in this category.',
        faqEyebrow: '— FAQ',
        faqTitle: 'Frequently Asked Questions',
        faq: [
            [
                'How is an application evaluated?',
                'Applications are reviewed by our HR team; suitable profiles proceed to the interview and technical assessment stages.',
            ],
            [
                'Can I apply for an internship?',
                "We accept interns in our health and administrative units. You can submit your application through the general form using the 'Internship' option.",
            ],
            [
                'How long is my information stored?',
                'Your application information is processed within the framework of our KVKK Policy and destroyed at the end of the maximum retention period.',
            ],
        ],
        app: {
            badge: 'Application',
            title: 'Join our team',
            desc: "If you couldn't find the position you're looking for, you can apply through the form below. We offer a separate tab for physician candidates.",
            note: 'This form is only a design prototype; submission is not active.',
            tablistAria: 'Application type',
            tabGeneral: 'General Application',
            tabPhysician: 'Physician Application',
            name: 'Full Name',
            email: 'Email',
            phone: 'Phone',
            positionAria: 'Position',
            positionPlaceholder: 'Position of interest',
            cvAria: 'Short CV',
            cvGeneralPlaceholder: 'Short CV / note',
            submitGeneral: 'Submit Application',
            titleAria: 'Title',
            titlePlaceholder: 'Select title',
            titleOptions: ['Prof. Dr.', 'Assoc. Prof. Dr.', 'Specialist Dr.', 'Surgeon (Op. Dr.)', 'Dr.'],
            specialtyAria: 'Specialty',
            specialtyPlaceholder: 'Select specialty',
            specialtyOptions: [
                'Cardiology',
                'Cardiovascular Surgery',
                'General Surgery',
                'Urology',
                'Ophthalmology',
                'Oncology',
                'Orthopedics and Traumatology',
                'Anesthesiology and Reanimation',
                'Other',
            ],
            uploadLabel: 'Upload your CV / document (PDF, DOC, DOCX — max 5MB)',
            cvPhysicianPlaceholder: 'Short CV, experience, publications',
            submitPhysician: 'Submit Physician Application',
            cvUploadLabel: 'Upload your CV (PDF, DOC, DOCX — max 5MB)',
            cvChosen: 'Selected file:',
            kvkkPre: 'I have read the ',
            kvkkLink: 'KVKK Disclosure Statement',
            kvkkPost: ' and consent to the processing of my personal data in recruitment processes.',
            kvkkError: 'KVKK consent is required',
            successTitle: 'Your application has been received',
            successBody: 'Your request has been received; our HR team will review your application and get back to you shortly.',
        },
    },
} as const;

export default function Page() {
    const locale = useLocale();
    const c = COPY[locale];
    const [group, setGroup] = useState<'Tümü' | GroupKey>('Tümü');
    const filtered = group === 'Tümü' ? JOBS : JOBS.filter((j) => j.group === group);

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/insan-kaynaklari" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/insan-kaynaklari" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/insan-kaynaklari" />
            </Head>

            <PageHeader title={c.pageTitle} />
            <Breadcrumb items={[{ label: c.crumbCorporate, to: '/kurumsal' }, { label: c.crumbCurrent }]} />

            <section className="py-10 lg:py-14 space-y-12">
                <div className="container-x grid lg:grid-cols-3 gap-5">
                    {c.cards.map((card, i) => {
                        const Icon = CARD_ICONS[i];
                        return (
                            <article key={card.title} className="rounded-2xl border border-border/70 bg-gradient-card p-6">
                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft">
                                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                                </span>
                                <h3 className="mt-3 text-[15px] font-bold text-primary">{card.title}</h3>
                                <p className="mt-1.5 text-sm text-muted-foreground">{card.desc}</p>
                            </article>
                        );
                    })}
                </div>

                <div className="container-x">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                        <div>
                            <h2 className="text-2xl font-black text-primary">{c.openTitle}</h2>
                            <p className="text-sm text-muted-foreground mt-1">{c.openDesc}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(['Tümü', ...GROUP_KEYS] as const).map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGroup(g)}
                                    aria-pressed={group === g}
                                    className={`h-9 rounded-full px-4 text-xs font-bold transition ${group === g ? 'bg-primary text-primary-foreground' : 'bg-primary-soft/60 text-primary hover:bg-primary-soft'}`}
                                >
                                    {c.groupLabels[g]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {filtered.map((j) => {
                            const jc = j[locale];
                            return (
                                <article key={j.id} className="hover-lift rounded-2xl border border-border/70 bg-card p-5">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-0.5 text-[10px] font-bold text-primary">
                                        {c.groupLabels[j.group]}
                                    </span>
                                    <h3 className="mt-2 text-[15px] font-bold text-primary">{jc.title}</h3>
                                    <p className="text-xs text-muted-foreground">{jc.department}</p>
                                    <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin className="h-3 w-3" aria-hidden /> {j.location}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="h-3 w-3" aria-hidden /> {jc.type}
                                        </span>
                                    </div>
                                    <button className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-orange">
                                        {c.details} <ArrowRight className="h-3 w-3" />
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                    {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">{c.empty}</p>}
                </div>

                <div className="container-x">
                    <ApplicationTabs />
                </div>

                <div className="container-x">
                    <div className="mx-auto max-w-3xl">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">{c.faqEyebrow}</p>
                        <h3 className="mt-2 text-xl lg:text-2xl font-black text-primary tracking-tight">{c.faqTitle}</h3>
                        <div className="mt-6 divide-y divide-border/60 border-y border-border/60">
                            {c.faq.map(([q, a]) => (
                                <details key={q} className="group py-4">
                                    <summary className="cursor-pointer text-sm font-bold text-primary flex items-center justify-between gap-3">
                                        <span>{q}</span>
                                        <ChevronDown
                                            className="h-4 w-4 shrink-0 text-brand-orange transition-transform duration-200 ease-out group-open:rotate-180"
                                            aria-hidden
                                        />
                                    </summary>
                                    <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Page.layout = siteLayout;

function ApplicationTabs() {
    const locale = useLocale();
    const lp = useLocalizedPath();
    const c = COPY[locale].app;
    const [tab, setTab] = useState<'genel' | 'hekim'>('genel');
    const [submitted, setSubmitted] = useState(false);
    const [kvkkErr, setKvkkErr] = useState<string | null>(null);
    const { data, setData, post, processing, errors, transform } = useForm<{
        name: string;
        email: string;
        phone: string;
        position: string;
        title: string;
        specialty: string;
        message: string;
        cv: File | null;
        kvkk: boolean;
        website: string;
    }>({
        name: '',
        email: '',
        phone: '',
        position: '',
        title: '',
        specialty: '',
        message: '',
        cv: null,
        kvkk: false,
        website: '',
    });
    const commonInput = 'h-11 rounded-xl border border-border/70 bg-background px-3 text-sm';

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!data.kvkk) {
            setKvkkErr(c.kvkkError);
            return;
        }
        setKvkkErr(null);
        transform((d) => ({ ...d, applicationType: tab, locale }));
        post('/form/insan-kaynaklari', {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setSubmitted(true),
        });
    }

    // Honeypot — real users never fill this; bots do. Kept off-screen.
    const honeypot = (
        <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={data.website}
            onChange={(e) => setData('website', e.target.value)}
            style={{ position: 'absolute', left: '-9999px', top: 0, height: 0, width: 0, opacity: 0 }}
        />
    );

    const kvkkField = (
        <>
            <label className="sm:col-span-2 flex items-start gap-2 text-[12.5px] text-muted-foreground">
                <input
                    type="checkbox"
                    checked={data.kvkk}
                    onChange={(e) => setData('kvkk', e.target.checked)}
                    className="accent-primary mt-0.5 h-4 w-4"
                />
                <span>
                    {c.kvkkPre}
                    <Link href={lp('/kvkk-politikamiz')} className="text-primary font-semibold hover:underline">
                        {c.kvkkLink}
                    </Link>
                    {c.kvkkPost}
                </span>
            </label>
            {(kvkkErr || errors.kvkk) && <p className="sm:col-span-2 text-destructive text-xs">{kvkkErr ?? errors.kvkk}</p>}
        </>
    );

    return (
        <div className="rounded-3xl border border-border/70 bg-gradient-card p-6 lg:p-10">
            <div className="grid lg:grid-cols-2 gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold text-primary">
                        <Briefcase className="h-3.5 w-3.5" aria-hidden /> {c.badge}
                    </div>
                    <h3 className="mt-3 text-2xl font-black text-primary">{c.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </div>
                <div>
                    {submitted ? (
                        <div className="rounded-2xl border border-success/30 bg-success/10 p-6 text-center">
                            <span className="bg-success/20 text-success inline-flex h-12 w-12 items-center justify-center rounded-full">
                                <CheckCircle2 className="h-6 w-6" />
                            </span>
                            <h4 className="text-primary mt-3 text-lg font-black">{c.successTitle}</h4>
                            <p className="text-muted-foreground mx-auto mt-1 max-w-md text-[13px]">{c.successBody}</p>
                        </div>
                    ) : (
                        <>
                            <div role="tablist" aria-label={c.tablistAria} className="inline-flex rounded-full border border-border/70 bg-background p-1">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={tab === 'genel'}
                                    onClick={() => setTab('genel')}
                                    className={`h-9 rounded-full px-4 text-xs font-bold transition ${tab === 'genel' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-primary-soft/60'}`}
                                >
                                    <Briefcase className="inline h-3.5 w-3.5 -mt-0.5 mr-1" /> {c.tabGeneral}
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={tab === 'hekim'}
                                    onClick={() => setTab('hekim')}
                                    className={`h-9 rounded-full px-4 text-xs font-bold transition ${tab === 'hekim' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-primary-soft/60'}`}
                                >
                                    <Stethoscope className="inline h-3.5 w-3.5 -mt-0.5 mr-1" /> {c.tabPhysician}
                                </button>
                            </div>

                            {tab === 'genel' ? (
                                <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={submit}>
                                    {honeypot}
                                    <input aria-label={c.name} placeholder={c.name} value={data.name} onChange={(e) => setData('name', e.target.value)} className={commonInput} />
                                    <input aria-label={c.email} type="email" placeholder={c.email} value={data.email} onChange={(e) => setData('email', e.target.value)} className={commonInput} />
                                    <input aria-label={c.phone} placeholder={c.phone} value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={commonInput} />
                                    <input aria-label={c.positionAria} placeholder={c.positionPlaceholder} value={data.position} onChange={(e) => setData('position', e.target.value)} className={commonInput} />
                                    <label className="sm:col-span-2 rounded-xl border border-dashed border-primary/30 bg-background/60 px-3 py-3 text-sm text-muted-foreground flex items-center gap-2 cursor-pointer">
                                        <Upload className="h-4 w-4 text-primary" />
                                        <span>{data.cv ? `${c.cvChosen} ${data.cv.name}` : c.cvUploadLabel}</span>
                                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setData('cv', e.target.files?.[0] ?? null)} />
                                    </label>
                                    {errors.cv && <p className="sm:col-span-2 text-destructive text-xs">{errors.cv}</p>}
                                    <textarea
                                        aria-label={c.cvAria}
                                        placeholder={c.cvGeneralPlaceholder}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="sm:col-span-2 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm min-h-[110px]"
                                    />
                                    {kvkkField}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="sm:col-span-2 h-11 rounded-full bg-gradient-orange text-brand-orange-foreground text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {c.submitGeneral}
                                    </button>
                                </form>
                            ) : (
                                <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={submit}>
                                    {honeypot}
                                    <input aria-label={c.name} placeholder={c.name} value={data.name} onChange={(e) => setData('name', e.target.value)} className={commonInput} />
                                    <input aria-label={c.email} type="email" placeholder={c.email} value={data.email} onChange={(e) => setData('email', e.target.value)} className={commonInput} />
                                    <input aria-label={c.phone} placeholder={c.phone} value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={commonInput} />
                                    <select aria-label={c.titleAria} value={data.title} onChange={(e) => setData('title', e.target.value)} className={commonInput}>
                                        <option value="">{c.titlePlaceholder}</option>
                                        {c.titleOptions.map((o) => (
                                            <option key={o}>{o}</option>
                                        ))}
                                    </select>
                                    <select
                                        aria-label={c.specialtyAria}
                                        value={data.specialty}
                                        onChange={(e) => setData('specialty', e.target.value)}
                                        className="sm:col-span-2 h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
                                    >
                                        <option value="">{c.specialtyPlaceholder}</option>
                                        {c.specialtyOptions.map((o) => (
                                            <option key={o}>{o}</option>
                                        ))}
                                    </select>
                                    <label className="sm:col-span-2 rounded-xl border border-dashed border-primary/30 bg-background/60 px-3 py-3 text-sm text-muted-foreground flex items-center gap-2 cursor-pointer">
                                        <Upload className="h-4 w-4 text-primary" />
                                        <span>{data.cv ? `${c.cvChosen} ${data.cv.name}` : c.uploadLabel}</span>
                                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setData('cv', e.target.files?.[0] ?? null)} />
                                    </label>
                                    {errors.cv && <p className="sm:col-span-2 text-destructive text-xs">{errors.cv}</p>}
                                    <textarea
                                        aria-label={c.cvAria}
                                        placeholder={c.cvPhysicianPlaceholder}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="sm:col-span-2 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm min-h-[110px]"
                                    />
                                    {kvkkField}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="sm:col-span-2 h-11 rounded-full bg-gradient-orange text-brand-orange-foreground text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {c.submitPhysician}
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
