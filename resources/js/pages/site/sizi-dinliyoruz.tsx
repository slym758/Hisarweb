import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Ear, Heart, MessageSquare, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Sizi Dinliyoruz — Hisar Hospital',
            description: 'Görüş, öneri, teşekkür ve şikayetlerinizi Hisar Hospital ile paylaşın. Geri bildirimleriniz bizim için değerli.',
            ogTitle: 'Sizi Dinliyoruz — Hisar Hospital',
            ogDescription: 'Hisar Hospital deneyiminizi paylaşın; hizmet kalitemizi birlikte geliştirelim.',
        },
        header: 'Sizi Dinliyoruz',
        types: ['Teşekkür', 'Öneri', 'Şikayet', 'Görüş / Geri bildirim'],
        departments: [
            'Bilmiyorum / Genel',
            'Poliklinik',
            'Acil Servis',
            'Yatış / Servis',
            'Ameliyathane',
            'Laboratuvar / Görüntüleme',
            'İletişim Merkezi',
            'Hasta Karşılama / Resepsiyon',
            'Diğer',
        ],
        labels: {
            fullName: 'Ad Soyad',
            email: 'E-posta',
            phone: 'Telefon (opsiyonel)',
            type: 'Geri bildirim türü',
            department: 'İlgili birim',
            message: 'Mesajınız',
            messagePlaceholder: 'Deneyiminizi mümkün olduğunca detaylı paylaşın…',
            selectPlaceholder: 'Seçiniz…',
            submit: 'Gönder',
        },
        kvkk: {
            pre: '',
            link: 'KVKK Aydınlatma Metni',
            post: '’ni okudum ve kişisel verilerimin işlenmesini onaylıyorum.',
        },
        errors: {
            fullName: 'Ad Soyad en az 2 karakter olmalı',
            email: 'Geçerli bir e-posta giriniz',
            phone: 'Telefon numaranızı kontrol edin',
            type: 'Lütfen geri bildirim türünü seçin',
            department: 'Lütfen ilgili birimi seçin',
            message: 'Mesajınız en az 10 karakter olmalı',
            kvkk: 'KVKK onayı zorunludur',
        },
        prototypeNote: 'Bu form bir prototiptir; gönderim aktif değildir.',
        success: {
            title: 'Form doğrulandı (demo)',
            body: 'Bu bir prototiptir; geri bildirim gönderimi aktif değildir ve hiçbir bilgi iletilmemiştir.',
            backLabel: 'Ana sayfaya dön',
        },
        tiles: [
            {
                title: 'Her görüş değerli',
                body: 'Hasta deneyiminizi geliştirebilmemiz için olumlu olumsuz tüm geri bildirimlerinizi önemsiyoruz.',
            },
            {
                title: 'Teşekkürleriniz ekibimize iletilir',
                body: 'Memnun kaldığınız personel ve birimleri belirtirseniz mesajınız ilgili ekiple paylaşılır.',
            },
            {
                title: 'Gizlilik',
                body: 'Bilgileriniz yalnızca süreç yönetimi için kullanılır; üçüncü kişilerle paylaşılmaz.',
            },
        ],
    },
    en: {
        head: {
            title: "We're Listening — Hisar Hospital",
            description: 'Share your opinions, suggestions, thanks and complaints with Hisar Hospital. Your feedback is valuable to us.',
            ogTitle: "We're Listening — Hisar Hospital",
            ogDescription: "Share your Hisar Hospital experience; let's improve our service quality together.",
        },
        header: "We're Listening",
        types: ['Thanks', 'Suggestion', 'Complaint', 'Opinion / Feedback'],
        departments: [
            "I'm not sure / General",
            'Outpatient Clinic',
            'Emergency',
            'Inpatient / Ward',
            'Operating Room',
            'Laboratory / Imaging',
            'Contact Center',
            'Patient Reception / Front Desk',
            'Other',
        ],
        labels: {
            fullName: 'Full Name',
            email: 'Email',
            phone: 'Phone (optional)',
            type: 'Feedback type',
            department: 'Relevant unit',
            message: 'Your Message',
            messagePlaceholder: 'Share your experience in as much detail as possible…',
            selectPlaceholder: 'Select…',
            submit: 'Send',
        },
        kvkk: {
            pre: 'I have read the ',
            link: 'KVKK Disclosure Statement',
            post: ' and consent to the processing of my personal data.',
        },
        errors: {
            fullName: 'Full name must be at least 2 characters',
            email: 'Please enter a valid email',
            phone: 'Please check your phone number',
            type: 'Please select the feedback type',
            department: 'Please select the relevant unit',
            message: 'Your message must be at least 10 characters',
            kvkk: 'KVKK consent is required',
        },
        prototypeNote: 'This form is a prototype; submission is not active.',
        success: {
            title: 'Form validated (demo)',
            body: 'This is a prototype; feedback submission is not active and no information has been sent.',
            backLabel: 'Back to home',
        },
        tiles: [
            {
                title: 'Every opinion matters',
                body: 'We value all your feedback, positive or negative, so that we can improve your patient experience.',
            },
            {
                title: 'Your thanks are passed on to our team',
                body: 'If you mention the staff and units you were pleased with, your message is shared with the relevant team.',
            },
            {
                title: 'Privacy',
                body: 'Your information is used only for process management; it is not shared with third parties.',
            },
        ],
    },
} as const;

function buildSchema(
    types: readonly [string, ...string[]],
    departments: readonly [string, ...string[]],
    err: { fullName: string; email: string; phone: string; type: string; department: string; message: string; kvkk: string },
) {
    return z.object({
        fullName: z.string().trim().min(2, err.fullName).max(100),
        email: z.string().trim().email(err.email).max(200),
        phone: z
            .string()
            .trim()
            .max(20)
            .regex(/^$|^[+0-9\s()-]+$/, err.phone)
            .optional(),
        type: z.enum(types, { message: err.type }),
        department: z.enum(departments, { message: err.department }),
        message: z.string().trim().min(10, err.message).max(2000),
        kvkk: z.literal(true, { message: err.kvkk }),
    });
}

export default function SiziDinliyoruz() {
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
            email: String(fd.get('email') ?? ''),
            phone: String(fd.get('phone') ?? ''),
            type: String(fd.get('type') ?? ''),
            department: String(fd.get('department') ?? ''),
            message: String(fd.get('message') ?? ''),
            kvkk: fd.get('kvkk') === 'on',
        };
        const r = buildSchema(c.types, c.departments, c.errors).safeParse(data);
        if (!r.success) {
            const errs: Record<string, string> = {};
            for (const issue of r.error.issues) errs[issue.path[0] as string] = issue.message;
            setErrors(errs);
            return;
        }
        setErrors({});
        setSubmitted(true);
    }

    const tileIcons = [Ear, Heart, ShieldCheck];

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.ogTitle} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/sizi-dinliyoruz" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/sizi-dinliyoruz" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/sizi-dinliyoruz" />
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
                                    href={lp('/')}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold transition"
                                >
                                    {c.success.backLabel}
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} className="space-y-5" noValidate>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label={c.labels.fullName} name="fullName" required error={errors.fullName} />
                                    <Field label={c.labels.email} name="email" type="email" required error={errors.email} />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label={c.labels.phone} name="phone" type="tel" error={errors.phone} />
                                    <SelectField
                                        label={c.labels.type}
                                        name="type"
                                        options={c.types}
                                        placeholder={c.labels.selectPlaceholder}
                                        error={errors.type}
                                    />
                                </div>
                                <SelectField
                                    label={c.labels.department}
                                    name="department"
                                    options={c.departments}
                                    placeholder={c.labels.selectPlaceholder}
                                    error={errors.department}
                                />
                                <div>
                                    <label className="text-primary mb-1.5 block text-[13px] font-semibold">
                                        {c.labels.message} <span className="text-brand-orange">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={6}
                                        maxLength={2000}
                                        placeholder={c.labels.messagePlaceholder}
                                        className="border-border bg-background focus:border-primary/40 focus:ring-primary/15 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
                                    />
                                    {errors.message && <p className="text-destructive mt-1 text-xs">{errors.message}</p>}
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
                                    <MessageSquare className="h-4 w-4" /> {c.labels.submit}
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

SiziDinliyoruz.layout = siteLayout;

function Field({ label, name, type = 'text', required, error }: { label: string; name: string; type?: string; required?: boolean; error?: string }) {
    return (
        <div>
            <label className="text-primary mb-1.5 block text-[13px] font-semibold">
                {label} {required && <span className="text-brand-orange">*</span>}
            </label>
            <input
                type={type}
                name={name}
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

function InfoTile({ icon: Icon, title, body }: { icon: typeof Ear; title: string; body: string }) {
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
