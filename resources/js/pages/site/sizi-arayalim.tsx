import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Clock, PhoneCall, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Sizi Arayalım — Hisar Hospital',
            description: 'İletişim bilgilerinizi bırakın, Hisar Hospital iletişim merkezi en kısa sürede sizi arasın.',
            ogTitle: 'Sizi Arayalım — Hisar Hospital',
            ogDescription: 'Çağrı merkezimiz randevu, bilgi ve yönlendirme talepleriniz için sizi arasın.',
        },
        header: 'Sizi Arayalım',
        times: ['09:00 – 12:00', '12:00 – 15:00', '15:00 – 18:00', 'Fark etmez'],
        topics: ['Randevu talebi', 'Bölüm / doktor bilgisi', 'Anlaşmalı kurum & sigorta', 'Tetkik / sonuç bilgisi', 'Diğer'],
        labels: {
            fullName: 'Ad Soyad',
            phone: 'Telefon',
            phonePlaceholder: '0(5xx) xxx xx xx',
            topic: 'Konu',
            preferredTime: 'Tercih edilen arama saati',
            note: 'Not (opsiyonel)',
            notePlaceholder: 'Eklemek istediğiniz kısa bir not…',
            selectPlaceholder: 'Seçiniz…',
            submit: 'Beni Arayın',
        },
        kvkk: {
            pre: '',
            link: 'KVKK Aydınlatma Metni',
            post: '’ni okudum ve kişisel verilerimin işlenmesini onaylıyorum.',
        },
        errors: {
            fullName: 'Ad Soyad en az 2 karakter olmalı',
            phone: 'Telefon numaranızı kontrol edin',
            topic: 'Lütfen bir konu seçin',
            preferredTime: 'Lütfen tercih ettiğiniz saat aralığını seçin',
            kvkk: 'KVKK onayı zorunludur',
        },
        prototypeNote: 'Bu form bir prototiptir; gönderim aktif değildir.',
        success: {
            title: 'Form doğrulandı (demo)',
            body: 'Bu bir prototiptir; çağrı talebi gönderimi aktif değildir ve hiçbir bilgi iletilmemiştir.',
            backLabel: 'Online Hizmetler’e dön',
        },
        tiles: [
            {
                title: 'Hızlı dönüş',
                body: 'Talebiniz alındıktan sonra iletişim merkezimiz çalışma saatleri içinde en kısa sürede sizi arar.',
            },
            {
                title: 'Gizlilik',
                body: 'Paylaştığınız bilgiler yalnızca sizinle iletişim kurmak amacıyla kullanılır, üçüncü kişilerle paylaşılmaz.',
            },
            {
                title: 'Hemen iletişim',
                body: 'Acil durumlar için iletişim merkezimizi doğrudan arayabilirsiniz: 444 5 888',
            },
        ],
    },
    en: {
        head: {
            title: "We'll Call You — Hisar Hospital",
            description: 'Leave your contact details and let the Hisar Hospital contact center call you as soon as possible.',
            ogTitle: "We'll Call You — Hisar Hospital",
            ogDescription: 'Let our contact center call you for your appointment, information and guidance requests.',
        },
        header: "We'll Call You",
        times: ['09:00 – 12:00', '12:00 – 15:00', '15:00 – 18:00', 'No preference'],
        topics: [
            'Appointment request',
            'Department / doctor information',
            'Contracted institution & insurance',
            'Test / result information',
            'Other',
        ],
        labels: {
            fullName: 'Full Name',
            phone: 'Phone',
            phonePlaceholder: '0(5xx) xxx xx xx',
            topic: 'Subject',
            preferredTime: 'Preferred call time',
            note: 'Note (optional)',
            notePlaceholder: 'A short note you would like to add…',
            selectPlaceholder: 'Select…',
            submit: 'Call Me',
        },
        kvkk: {
            pre: 'I have read the ',
            link: 'KVKK Disclosure Statement',
            post: ' and consent to the processing of my personal data.',
        },
        errors: {
            fullName: 'Full name must be at least 2 characters',
            phone: 'Please check your phone number',
            topic: 'Please select a subject',
            preferredTime: 'Please select your preferred time range',
            kvkk: 'KVKK consent is required',
        },
        prototypeNote: 'This form is a prototype; submission is not active.',
        success: {
            title: 'Form validated (demo)',
            body: 'This is a prototype; call-request submission is not active and no information has been sent.',
            backLabel: 'Back to Online Services',
        },
        tiles: [
            {
                title: 'Quick response',
                body: 'Once your request is received, our contact center will call you as soon as possible during working hours.',
            },
            {
                title: 'Privacy',
                body: 'The information you share is used only to contact you and is not shared with third parties.',
            },
            {
                title: 'Immediate contact',
                body: 'For emergencies, you can call our contact center directly: 444 5 888',
            },
        ],
    },
} as const;

function buildSchema(
    topics: readonly [string, ...string[]],
    times: readonly [string, ...string[]],
    err: { fullName: string; phone: string; topic: string; preferredTime: string; kvkk: string },
) {
    return z.object({
        fullName: z.string().trim().min(2, err.fullName).max(100),
        phone: z
            .string()
            .trim()
            .min(7, err.phone)
            .max(20)
            .regex(/^[+0-9\s()-]+$/, err.phone),
        topic: z.enum(topics, { message: err.topic }),
        preferredTime: z.enum(times, { message: err.preferredTime }),
        note: z.string().trim().max(500).optional(),
        kvkk: z.literal(true, { message: err.kvkk }),
    });
}

export default function SiziArayalim() {
    const locale = useLocale();
    const lp = useLocalizedPath();
    const c = COPY[locale];
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data = {
            fullName: String(fd.get('fullName') ?? ''),
            phone: String(fd.get('phone') ?? ''),
            topic: String(fd.get('topic') ?? ''),
            preferredTime: String(fd.get('preferredTime') ?? ''),
            note: String(fd.get('note') ?? ''),
            kvkk: fd.get('kvkk') === 'on',
        };
        const r = buildSchema(c.topics, c.times, c.errors).safeParse(data);
        if (!r.success) {
            const errs: Record<string, string> = {};
            for (const issue of r.error.issues) errs[issue.path[0] as string] = issue.message;
            setErrors(errs);
            return;
        }
        setErrors({});
        setSubmitted(true);
    }

    const tileIcons = [Clock, ShieldCheck, PhoneCall];

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.ogTitle} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/sizi-arayalim" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/sizi-arayalim" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/sizi-arayalim" />
            </Head>

            <PageHeader title={c.header} />

            <section className="py-10 lg:py-14">
                <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                    <div className="border-border/70 bg-card shadow-card rounded-2xl border p-6 lg:p-8">
                        {submitted ? (
                            <div className="flex flex-col items-center py-8 text-center">
                                <span className="bg-success/15 text-success ring-success/30 flex h-14 w-14 items-center justify-center rounded-2xl ring-1">
                                    <CheckCircle2 className="h-7 w-7" />
                                </span>
                                <h2 className="text-primary mt-4 text-xl font-bold">{c.success.title}</h2>
                                <p className="text-muted-foreground mt-2 max-w-md text-sm">{c.success.body}</p>
                                <Link
                                    href={lp('/online-hizmetler')}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold transition"
                                >
                                    {c.success.backLabel}
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} className="space-y-5" noValidate>
                                <Field label={c.labels.fullName} name="fullName" required error={errors.fullName} />
                                <Field
                                    label={c.labels.phone}
                                    name="phone"
                                    type="tel"
                                    placeholder={c.labels.phonePlaceholder}
                                    required
                                    error={errors.phone}
                                />
                                <SelectField
                                    label={c.labels.topic}
                                    name="topic"
                                    options={c.topics}
                                    placeholder={c.labels.selectPlaceholder}
                                    error={errors.topic}
                                />
                                <SelectField
                                    label={c.labels.preferredTime}
                                    name="preferredTime"
                                    options={c.times}
                                    placeholder={c.labels.selectPlaceholder}
                                    error={errors.preferredTime}
                                />
                                <div>
                                    <label className="text-primary mb-1.5 block text-[13px] font-semibold">{c.labels.note}</label>
                                    <textarea
                                        name="note"
                                        rows={4}
                                        maxLength={500}
                                        className="border-border bg-background focus:border-primary/40 focus:ring-primary/15 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
                                        placeholder={c.labels.notePlaceholder}
                                    />
                                </div>
                                <label className="text-muted-foreground flex items-start gap-2 text-[12.5px]">
                                    <input type="checkbox" name="kvkk" className="accent-primary mt-0.5 h-4 w-4" />
                                    <span>
                                        {c.kvkk.pre}
                                        <Link href={lp('/kvkk-politikamiz')} className="text-primary font-semibold hover:underline">
                                            {c.kvkk.link}
                                        </Link>
                                        {c.kvkk.post}
                                    </span>
                                </label>
                                {errors.kvkk && <p className="text-destructive text-xs">{errors.kvkk}</p>}
                                <p className="text-muted-foreground text-xs">{c.prototypeNote}</p>
                                <button
                                    type="submit"
                                    className="bg-gradient-orange text-brand-orange-foreground shadow-orange inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition hover:-translate-y-0.5 sm:w-auto"
                                >
                                    <PhoneCall className="h-4 w-4" /> {c.labels.submit}
                                </button>
                            </form>
                        )}
                    </div>

                    <aside className="space-y-4">
                        {c.tiles.map((t, i) => (
                            <InfoTile key={t.title} icon={tileIcons[i]} title={t.title} body={t.body} />
                        ))}
                    </aside>
                </div>
            </section>
        </>
    );
}

SiziArayalim.layout = siteLayout;

function Field({
    label,
    name,
    type = 'text',
    required,
    error,
    placeholder,
}: {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    error?: string;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="text-primary mb-1.5 block text-[13px] font-semibold">
                {label} {required && <span className="text-brand-orange">*</span>}
            </label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                className="border-border bg-background focus:border-primary/40 focus:ring-primary/15 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
            />
            {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
        </div>
    );
}

function SelectField({
    label,
    name,
    options,
    placeholder,
    error,
}: {
    label: string;
    name: string;
    options: readonly string[];
    placeholder: string;
    error?: string;
}) {
    return (
        <div>
            <label className="text-primary mb-1.5 block text-[13px] font-semibold">
                {label} <span className="text-brand-orange">*</span>
            </label>
            <select
                name={name}
                defaultValue=""
                className="border-border bg-background focus:border-primary/40 focus:ring-primary/15 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
            {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
        </div>
    );
}

function InfoTile({ icon: Icon, title, body }: { icon: typeof Clock; title: string; body: string }) {
    return (
        <div className="border-border/70 bg-card shadow-card rounded-2xl border p-5">
            <div className="flex items-start gap-3">
                <span className="bg-primary-soft text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                    <h4 className="text-primary text-[14.5px] leading-tight font-bold">{title}</h4>
                    <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">{body}</p>
                </div>
            </div>
        </div>
    );
}
