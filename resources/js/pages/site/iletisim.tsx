import { Head } from '@inertiajs/react';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Headphones, Info, Mail, MapPin, MessageSquare, Navigation, Phone, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { z } from 'zod';

import { Breadcrumb } from '@/components/site/Breadcrumb';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale } from '@/lib/i18n';
import { useSettings, waHref } from '@/lib/settings';

/* ───────────────── Data (locale-independent) ───────────────── */

type CampusSlug = 'intercontinental' | 'camlica' | 'avrupa';

type Campus = {
    slug: CampusSlug;
    name: string;
    area: string;
    phone?: string;
    email?: string;
    address?: string;
    comingSoon?: boolean;
    query: string;
    hours?: string;
};

const CAMPUS_META: {
    slug: CampusSlug;
    phone?: string;
    email?: string;
    comingSoon?: boolean;
    query: string;
}[] = [
    {
        slug: 'intercontinental',
        phone: '0216 524 13 00',
        email: 'info@hisarhospital.com',
        query: 'Hisar Intercontinental Hospital, Ümraniye, İstanbul',
    },
    {
        slug: 'camlica',
        phone: '0216 524 13 00',
        email: 'info@hisarhospital.com',
        query: 'Hisar Hospital Çamlıca, Üsküdar, İstanbul',
    },
    {
        slug: 'avrupa',
        comingSoon: true,
        query: 'İstanbul Avrupa Yakası',
    },
];

const mapsEmbed = (q: string) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
const mapsDirections = (q: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'İletişim — Hisar Hospital',
            description: 'Randevu, bilgi ve yol tarifi talepleriniz için Hisar Hospital iletişim kanallarına kolayca ulaşın.',
            ogTitle: 'İletişim — Hisar Hospital',
            ogDescription: 'Hisar Hospital kampüsleri, harita ve mesaj formu.',
        },
        breadcrumb: 'İletişim',
        hero: {
            eyebrow: 'İletişim',
            title: 'Size en yakın kanaldan ulaşın',
            desc: 'Randevu, ikinci görüş, uluslararası hasta ve genel bilgi talepleriniz için 7/24 İletişim Merkezi, hastane telefonları veya mesaj formumuz üzerinden bize ulaşabilirsiniz.',
        },
        channels: [
            { label: 'İletişim Merkezi', sub: '7/24 kesintisiz' },
            { label: 'Santral', sub: 'Hastane bağlantısı' },
            { label: 'E-Posta', sub: 'İş günü içinde yanıt' },
            { label: 'WhatsApp', sub: 'Hızlı mesaj' },
        ],
        rail: {
            selectHospital: 'Hastane seçin',
            soonBadge: 'Yakında',
            getDirections: 'Yol Tarifi Al',
            mapSoonTitle: 'Avrupa hastanemiz yakında hizmete girecek.',
            mapSoonBody: 'Açılış duyuruları için bültenimize kayıt olabilirsiniz.',
            mapTitleSuffix: 'harita',
        },
        grid: {
            eyebrow: 'Hastanelerimiz',
            title: 'Tüm Hisar Hospital adresleri',
            soonBadge: 'Yakında',
            viewOnMap: 'Haritada Gör',
            openingSoon: 'Yakında Açılıyor',
        },
        form: {
            subjects: ['Randevu Talebi', 'Uluslararası Hasta', 'Kurumsal', 'Basın', 'Öneri / Şikayet', 'Kariyer', 'Diğer'],
            eyebrow: 'Mesaj Formu',
            title: 'Bize mesaj bırakın',
            desc: 'Formu doldurun, ekibimiz iş günü içinde size dönüş yapsın. Acil durumlar için lütfen İletişim Merkezini arayın.',
            sentTitle: 'Form doğrulandı (demo)',
            sentBodyPre: 'Bu bir prototiptir; mesaj gönderimi aktif değildir ve hiçbir bilgi iletilmemiştir. Acil durumlar için İletişim Merkezi (',
            sentBodyPost: ') 7/24 hizmetinizdedir.',
            labels: {
                name: 'Ad Soyad',
                phone: 'Telefon',
                phonePlaceholder: '0 5xx xxx xx xx',
                email: 'E-Posta',
                subject: 'Konu',
                message: 'Mesajınız',
                selectPlaceholder: 'Seçiniz…',
                kvkk: 'KVKK aydınlatma metnini okudum, kişisel verilerimin işlenmesine onay veriyorum.',
                info: 'Ortalama yanıt süresi: iş günü içinde 4 saat.',
                submit: 'Gönder',
            },
            prototypeNote: 'Bu form bir prototiptir; gönderim aktif değildir.',
            errors: {
                name: 'Ad soyad gerekli',
                phone: 'Geçerli bir telefon girin',
                email: 'Geçerli bir e-posta girin',
                subject: 'Konu seçin',
                message: 'Lütfen en az 10 karakter yazın',
                kvkk: 'KVKK onayı gerekli',
            },
        },
        campuses: {
            intercontinental: {
                name: 'Hisar Hospital Intercontinental',
                area: 'Ümraniye, İstanbul',
                address: 'Yanyanevler Mah. Site Yolu Cd. No:7, Ümraniye / İstanbul',
                hours: '7/24 Acil • Poliklinik 08:00–20:00',
            },
            camlica: {
                name: 'Hisar Hospital Çamlıca',
                area: 'Üsküdar, İstanbul',
                address: 'Çamlıca Mah, Üsküdar / İstanbul',
                hours: '7/24 Acil • Poliklinik 08:00–20:00',
            },
            avrupa: {
                name: 'Hisar Hospital Avrupa',
                area: 'İstanbul Avrupa Yakası',
            },
        },
    },
    en: {
        head: {
            title: 'Contact — Hisar Hospital',
            description: "Easily reach Hisar Hospital's communication channels for your appointment, information and directions requests.",
            ogTitle: 'Contact — Hisar Hospital',
            ogDescription: 'Hisar Hospital campuses, map and message form.',
        },
        breadcrumb: 'Contact',
        hero: {
            eyebrow: 'Contact',
            title: 'Reach us through the channel nearest you',
            desc: 'For appointments, second opinions, international patient and general information requests, you can reach us via our 24/7 Contact Center, hospital phone lines or our message form.',
        },
        channels: [
            { label: 'Contact Center', sub: '24/7, uninterrupted' },
            { label: 'Switchboard', sub: 'Hospital connection' },
            { label: 'Email', sub: 'Reply within a business day' },
            { label: 'WhatsApp', sub: 'Quick message' },
        ],
        rail: {
            selectHospital: 'Select a hospital',
            soonBadge: 'Soon',
            getDirections: 'Get Directions',
            mapSoonTitle: 'Our European-side hospital will open soon.',
            mapSoonBody: 'You can subscribe to our newsletter for opening announcements.',
            mapTitleSuffix: 'map',
        },
        grid: {
            eyebrow: 'Our Hospitals',
            title: 'All Hisar Hospital addresses',
            soonBadge: 'Soon',
            viewOnMap: 'View on Map',
            openingSoon: 'Opening Soon',
        },
        form: {
            subjects: ['Appointment Request', 'International Patient', 'Corporate', 'Press', 'Suggestion / Complaint', 'Career', 'Other'],
            eyebrow: 'Message Form',
            title: 'Leave us a message',
            desc: 'Fill out the form and our team will get back to you within a business day. For emergencies, please call the Contact Center.',
            sentTitle: 'Form validated (demo)',
            sentBodyPre:
                'This is a prototype; message submission is not active and no information has been sent. For emergencies, the Contact Center (',
            sentBodyPost: ') is available 24/7.',
            labels: {
                name: 'Full Name',
                phone: 'Phone',
                phonePlaceholder: '0 5xx xxx xx xx',
                email: 'Email',
                subject: 'Subject',
                message: 'Your Message',
                selectPlaceholder: 'Select…',
                kvkk: 'I have read the KVKK disclosure statement and consent to the processing of my personal data.',
                info: 'Average response time: 4 hours within a business day.',
                submit: 'Send',
            },
            prototypeNote: 'This form is a prototype; submission is not active.',
            errors: {
                name: 'Full name is required',
                phone: 'Please enter a valid phone number',
                email: 'Please enter a valid email',
                subject: 'Please select a subject',
                message: 'Please write at least 10 characters',
                kvkk: 'KVKK consent is required',
            },
        },
        campuses: {
            intercontinental: {
                name: 'Hisar Hospital Intercontinental',
                area: 'Ümraniye, Istanbul',
                address: 'Yanyanevler Mah. Site Yolu Cd. No:7, Ümraniye / Istanbul',
                hours: '24/7 Emergency • Outpatient Clinic 08:00–20:00',
            },
            camlica: {
                name: 'Hisar Hospital Çamlıca',
                area: 'Üsküdar, Istanbul',
                address: 'Çamlıca Mah, Üsküdar / Istanbul',
                hours: '24/7 Emergency • Outpatient Clinic 08:00–20:00',
            },
            avrupa: {
                name: 'Hisar Hospital Avrupa',
                area: 'European Side of Istanbul',
            },
        },
    },
} as const;

type FormCopy = (typeof COPY)['tr']['form'] | (typeof COPY)['en']['form'];

/* ───────────────── Page ───────────────── */

export default function Iletisim() {
    const locale = useLocale();
    const c = COPY[locale];
    const settings = useSettings();

    const campusesText = c.campuses as Record<CampusSlug, { name: string; area: string; address?: string; hours?: string }>;
    const CAMPUSES: Campus[] = CAMPUS_META.map((m) => ({ ...m, ...campusesText[m.slug] }));

    const [activeSlug, setActiveSlug] = useState<CampusSlug>('intercontinental');
    const active = useMemo(() => CAMPUSES.find((x) => x.slug === activeSlug)!, [CAMPUSES, activeSlug]);

    const channelMeta = [
        { icon: Headphones, value: settings.phone_display, href: settings.phone_href },
        { icon: Phone, value: '0216 524 13 00', href: 'tel:02165241300' },
        { icon: Mail, value: 'info@hisarhospital.com', href: 'mailto:info@hisarhospital.com' },
        { icon: MessageSquare, value: '0530 000 00 00', href: waHref(settings.whatsapp_number, settings.whatsapp_message) },
    ];
    const channels = channelMeta.map((m, i) => ({ ...m, ...c.channels[i] }));

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.ogTitle} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/iletisim" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/iletisim" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/iletisim" />
            </Head>

            <Breadcrumb items={[{ label: c.breadcrumb }]} />

            {/* Hero */}
            <section className="border-border/60 from-primary-soft/40 via-surface to-background relative overflow-hidden border-b bg-gradient-to-b">
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_90%_0%,rgba(244,138,45,0.12),transparent_55%)] opacity-40"
                    aria-hidden
                />
                <div className="container-x relative grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:py-14">
                    <div className="min-w-0">
                        <p className="text-brand-orange inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.18em] uppercase">
                            <span className="bg-brand-orange h-px w-6" /> {c.hero.eyebrow}
                        </p>
                        <h1 className="text-primary mt-3 text-2xl font-black tracking-tight lg:text-4xl">{c.hero.title}</h1>
                        <p className="text-muted-foreground mt-3 max-w-xl text-[13.5px] leading-relaxed lg:text-sm">{c.hero.desc}</p>
                    </div>
                </div>
            </section>

            {/* Quick channels */}
            <section className="container-x relative z-10 -mt-4 lg:-mt-6">
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    {channels.map((ch) => (
                        <a
                            key={ch.label}
                            href={ch.href}
                            className="group border-border/70 bg-card hover:border-primary/30 hover:shadow-card flex items-center gap-3 rounded-2xl border p-4 transition"
                        >
                            <span className="bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition">
                                <ch.icon className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">{ch.label}</p>
                                <p className="text-primary truncate text-[14px] font-bold">{ch.value}</p>
                                <p className="text-muted-foreground text-[11.5px]">{ch.sub}</p>
                            </div>
                            <ArrowRight className="text-muted-foreground group-hover:text-brand-orange h-4 w-4 transition group-hover:translate-x-0.5" />
                        </a>
                    ))}
                </div>
            </section>

            {/* Form + Sticky sidebar (map + campus switcher) */}
            <section className="container-x grid items-start gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10 lg:py-14">
                {/* Form */}
                <ContactForm copy={c.form} />

                {/* Sticky right rail */}
                <aside>
                    <div className="space-y-4 lg:sticky lg:top-36">
                        {/* Campus switcher */}
                        <div className="border-border/70 bg-card shadow-card rounded-2xl border p-4">
                            <p className="text-brand-orange text-[11px] font-bold tracking-widest uppercase">{c.rail.selectHospital}</p>
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {CAMPUSES.map((cp) => (
                                    <button
                                        key={cp.slug}
                                        onClick={() => !cp.comingSoon && setActiveSlug(cp.slug)}
                                        disabled={cp.comingSoon}
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold transition ${
                                            activeSlug === cp.slug
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : cp.comingSoon
                                                  ? 'border-border/60 bg-muted/50 text-muted-foreground cursor-not-allowed'
                                                  : 'border-border bg-card text-primary hover:border-primary/40'
                                        }`}
                                    >
                                        {cp.name.replace('Hisar Hospital ', '')}
                                        {cp.comingSoon && <span className="text-brand-orange text-[10px] font-bold">{c.rail.soonBadge}</span>}
                                    </button>
                                ))}
                            </div>

                            {/* Active campus details */}
                            <div className="mt-4 space-y-2.5 text-[13px]">
                                <div className="flex items-start gap-2">
                                    <MapPin className="text-brand-orange mt-0.5 h-4 w-4 shrink-0" />
                                    <span className="text-foreground/85">{active.address ?? active.area}</span>
                                </div>
                                {active.phone && (
                                    <a
                                        href={`tel:${active.phone.replace(/\s/g, '')}`}
                                        className="hover:text-primary flex items-start gap-2 transition"
                                    >
                                        <Phone className="text-brand-orange mt-0.5 h-4 w-4 shrink-0" />
                                        <span className="text-foreground/85 font-semibold">{active.phone}</span>
                                    </a>
                                )}
                                {active.email && (
                                    <a href={`mailto:${active.email}`} className="hover:text-primary flex items-start gap-2 transition">
                                        <Mail className="text-brand-orange mt-0.5 h-4 w-4 shrink-0" />
                                        <span className="text-foreground/85">{active.email}</span>
                                    </a>
                                )}
                                {active.hours && (
                                    <div className="flex items-start gap-2">
                                        <Clock className="text-brand-orange mt-0.5 h-4 w-4 shrink-0" />
                                        <span className="text-foreground/85">{active.hours}</span>
                                    </div>
                                )}
                            </div>

                            {!active.comingSoon && (
                                <a
                                    href={mapsDirections(active.query)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-primary text-primary-foreground hover:shadow-elevated mt-4 flex h-10 items-center justify-center gap-1.5 rounded-full text-[13px] font-bold transition"
                                >
                                    <Navigation className="h-4 w-4" /> {c.rail.getDirections}
                                </a>
                            )}
                        </div>

                        {/* Map */}
                        <div className="border-border/70 bg-card shadow-card overflow-hidden rounded-2xl border">
                            {active.comingSoon ? (
                                <div className="bg-primary-soft/40 flex aspect-[4/3] flex-col items-center justify-center gap-2 p-6 text-center">
                                    <span className="bg-brand-orange/10 text-brand-orange inline-flex h-11 w-11 items-center justify-center rounded-full">
                                        <Info className="h-5 w-5" />
                                    </span>
                                    <p className="text-primary text-[13px] font-bold">{c.rail.mapSoonTitle}</p>
                                    <p className="text-muted-foreground text-[12px]">{c.rail.mapSoonBody}</p>
                                </div>
                            ) : (
                                <iframe
                                    key={active.slug}
                                    title={`${active.name} ${c.rail.mapTitleSuffix}`}
                                    src={mapsEmbed(active.query)}
                                    loading="lazy"
                                    className="aspect-[4/3] w-full border-0"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            )}
                        </div>
                    </div>
                </aside>
            </section>

            {/* Campus grid */}
            <section className="container-x pb-16 lg:pb-24">
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-brand-orange inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.18em] uppercase">
                            <span className="bg-brand-orange h-px w-6" /> {c.grid.eyebrow}
                        </p>
                        <h2 className="text-primary mt-2 text-xl font-black lg:text-2xl">{c.grid.title}</h2>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {CAMPUSES.map((cp) => (
                        <article
                            key={cp.slug}
                            className={`flex flex-col rounded-2xl border p-5 transition ${
                                cp.comingSoon
                                    ? 'border-brand-orange/40 bg-brand-orange/[0.03] border-dashed'
                                    : 'border-border/70 bg-card hover:shadow-card hover:border-primary/30'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                                        cp.comingSoon ? 'bg-brand-orange/10 text-brand-orange' : 'bg-primary-soft text-primary'
                                    }`}
                                >
                                    <MapPin className="h-5 w-5" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-primary text-[15px] leading-tight font-black">{cp.name}</h3>
                                    <p className="text-muted-foreground text-[12.5px]">{cp.area}</p>
                                </div>
                                {cp.comingSoon && (
                                    <span className="text-brand-orange text-[10px] font-bold tracking-widest uppercase">{c.grid.soonBadge}</span>
                                )}
                            </div>

                            <div className="text-foreground/85 mt-3 flex-1 space-y-1.5 text-[12.5px]">
                                {cp.address && (
                                    <p className="flex gap-2">
                                        <MapPin className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
                                        {cp.address}
                                    </p>
                                )}
                                {cp.phone && (
                                    <p className="flex gap-2">
                                        <Phone className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
                                        {cp.phone}
                                    </p>
                                )}
                                {cp.hours && (
                                    <p className="flex gap-2">
                                        <Clock className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
                                        {cp.hours}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 flex gap-2">
                                {!cp.comingSoon ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setActiveSlug(cp.slug);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="bg-primary text-primary-foreground inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-full text-[12.5px] font-bold"
                                        >
                                            {c.grid.viewOnMap}
                                        </button>
                                        <a
                                            href={mapsDirections(cp.query)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="border-border bg-card text-primary hover:border-primary/40 inline-flex h-9 items-center justify-center gap-1 rounded-full border px-3 text-[12.5px] font-bold transition"
                                        >
                                            <Navigation className="h-3.5 w-3.5" />
                                        </a>
                                    </>
                                ) : (
                                    <button
                                        disabled
                                        className="border-brand-orange/40 bg-brand-orange/5 text-brand-orange h-9 flex-1 cursor-not-allowed rounded-full border text-[12.5px] font-bold"
                                    >
                                        {c.grid.openingSoon}
                                    </button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}

Iletisim.layout = siteLayout;

/* ───────────────── Form component ───────────────── */

function buildFormSchema(err: FormCopy['errors']) {
    return z.object({
        name: z.string().min(2, err.name),
        phone: z.string().min(7, err.phone),
        email: z.string().email(err.email),
        subject: z.string().min(2, err.subject),
        message: z.string().min(10, err.message),
        kvkk: z.literal(true, { message: err.kvkk }),
    });
}

function ContactForm({ copy }: { copy: FormCopy }) {
    const [values, setValues] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
        kvkk: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [sent, setSent] = useState(false);

    const set = <K extends keyof typeof values>(k: K, v: (typeof values)[K]) => setValues((s) => ({ ...s, [k]: v }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = buildFormSchema(copy.errors).safeParse(values);
        if (!parsed.success) {
            const errs: Record<string, string> = {};
            parsed.error.issues.forEach((i) => {
                errs[i.path[0] as string] = i.message;
            });
            setErrors(errs);
            return;
        }
        setErrors({});
        setSent(true);
    };

    return (
        <div className="border-border/70 bg-card shadow-card rounded-3xl border p-6 lg:p-8">
            <div className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:inline-flex">
                    <Send className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                    <p className="text-brand-orange text-[11px] font-bold tracking-widest uppercase">{copy.eyebrow}</p>
                    <h2 className="text-primary mt-1 text-xl font-black tracking-tight lg:text-2xl">{copy.title}</h2>
                    <p className="text-muted-foreground mt-1.5 max-w-lg text-[13px]">{copy.desc}</p>
                </div>
            </div>

            {sent ? (
                <div className="border-success/30 bg-success/10 mt-6 rounded-2xl border p-6 text-center">
                    <span className="bg-success/20 text-success inline-flex h-12 w-12 items-center justify-center rounded-full">
                        <CheckCircle2 className="h-6 w-6" />
                    </span>
                    <h3 className="text-primary mt-3 text-lg font-black">{copy.sentTitle}</h3>
                    <p className="text-muted-foreground mx-auto mt-1 max-w-md text-[13px]">
                        {copy.sentBodyPre}
                        {CALL_CENTER}
                        {copy.sentBodyPost}
                    </p>
                </div>
            ) : (
                <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Field label={copy.labels.name} error={errors.name}>
                        <input value={values.name} onChange={(e) => set('name', e.target.value)} className={inputCls(!!errors.name)} />
                    </Field>
                    <Field label={copy.labels.phone} error={errors.phone}>
                        <input
                            value={values.phone}
                            onChange={(e) => set('phone', e.target.value)}
                            placeholder={copy.labels.phonePlaceholder}
                            className={inputCls(!!errors.phone)}
                        />
                    </Field>
                    <Field label={copy.labels.email} error={errors.email}>
                        <input
                            type="email"
                            value={values.email}
                            onChange={(e) => set('email', e.target.value)}
                            className={inputCls(!!errors.email)}
                        />
                    </Field>
                    <Field label={copy.labels.subject} error={errors.subject}>
                        <select value={values.subject} onChange={(e) => set('subject', e.target.value)} className={inputCls(!!errors.subject)}>
                            <option value="">{copy.labels.selectPlaceholder}</option>
                            {copy.subjects.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label={copy.labels.message} error={errors.message} className="sm:col-span-2">
                        <textarea
                            rows={5}
                            value={values.message}
                            onChange={(e) => set('message', e.target.value)}
                            className={inputCls(!!errors.message) + ' py-2.5'}
                        />
                    </Field>
                    <label className="text-muted-foreground flex items-start gap-2 text-[12.5px] sm:col-span-2">
                        <input
                            type="checkbox"
                            checked={values.kvkk}
                            onChange={(e) => set('kvkk', e.target.checked)}
                            className="border-border mt-0.5 h-4 w-4 rounded"
                        />
                        <span>
                            {copy.labels.kvkk}
                            {errors.kvkk && (
                                <span className="text-brand-orange mt-0.5 block flex items-center gap-1 font-semibold">
                                    <AlertCircle className="h-3 w-3" /> {errors.kvkk}
                                </span>
                            )}
                        </span>
                    </label>
                    <p className="text-muted-foreground text-xs sm:col-span-2">{copy.prototypeNote}</p>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 sm:col-span-2">
                        <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[11.5px]">
                            <Info className="h-3.5 w-3.5" /> {copy.labels.info}
                        </span>
                        <button
                            type="submit"
                            className="bg-gradient-orange text-brand-orange-foreground shadow-orange hover:shadow-elevated inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition hover:-translate-y-0.5"
                        >
                            <Send className="h-4 w-4" /> {copy.labels.submit}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

const inputCls = (err: boolean) =>
    `w-full rounded-xl bg-card border h-11 px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/15 ${
        err ? 'border-brand-orange/60 focus:border-brand-orange' : 'border-border focus:border-primary/40'
    }`;

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
    return (
        <label className={`text-primary/90 block text-[12px] font-semibold ${className ?? ''}`}>
            {label}
            <div className="mt-1">{children}</div>
            {error && (
                <span className="text-brand-orange mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold">
                    <AlertCircle className="h-3 w-3" /> {error}
                </span>
            )}
        </label>
    );
}
