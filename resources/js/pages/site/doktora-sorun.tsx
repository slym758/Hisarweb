import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle2, Info, MessageCircleQuestion, ShieldCheck, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { usePageCopy } from '@/lib/page-content';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Doktora Sorun — Hisar Hospital',
            description: 'Sağlığınızla ilgili sorularınızı Hisar Hospital uzman hekimlerine iletin; en kısa sürede e-posta ile dönüş alın.',
            ogTitle: 'Doktora Sorun — Hisar Hospital',
            ogDescription: 'Hisar Hospital uzman hekimlerine sağlık sorularınızı kolayca iletin.',
        },
        header: 'Doktora Sorun',
        departments: [
            'Kardiyoloji',
            'Kalp ve Damar Cerrahisi',
            'Genel Cerrahi',
            'Ortopedi ve Travmatoloji',
            'Üroloji',
            'Kadın Hastalıkları ve Doğum',
            'Çocuk Sağlığı ve Hastalıkları',
            'Göz Hastalıkları',
            'Kulak Burun Boğaz',
            'Nöroloji',
            'Beyin ve Sinir Cerrahisi',
            'Dahiliye',
            'Diğer / Emin değilim',
        ],
        labels: {
            fullName: 'Ad Soyad',
            email: 'E-posta',
            phone: 'Telefon (opsiyonel)',
            department: 'Bölüm',
            question: 'Sorunuz',
            questionPlaceholder: 'Sağlık durumunuzu ve sorunuzu olabildiğince açık şekilde yazın…',
            selectPlaceholder: 'Seçiniz…',
            submit: 'Soruyu Gönder',
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
            department: 'Lütfen bir bölüm seçin',
            question: 'Sorunuz en az 20 karakter olmalı',
            kvkk: 'KVKK onayı zorunludur',
        },
        success: {
            title: 'Sorunuz alındı',
            body: 'Talebiniz alındı, en kısa sürede uzman hekimimiz e-posta ile dönüş yapacaktır.',
            backLabel: 'Online Hizmetler’e dön',
        },
        tiles: [
            {
                title: 'Bilgi amaçlıdır',
                body: 'Verilen yanıtlar bilgilendirme amaçlıdır ve fiziksel muayene yerine geçmez. Tanı ve tedavi için randevu önerilebilir.',
            },
            {
                title: 'Doğru bölüm yönlendirmesi',
                body: 'Bölüm seçiminden emin değilseniz “Diğer / Emin değilim” seçeneğini işaretleyin; ekibimiz uygun uzmana yönlendirir.',
            },
            {
                title: 'Gizlilik',
                body: 'Sağlık bilgileriniz yalnızca sorunuzu yanıtlamak amacıyla ilgili uzmanla paylaşılır.',
            },
        ],
    },
    en: {
        head: {
            title: 'Ask a Doctor — Hisar Hospital',
            description: "Send your health questions to Hisar Hospital's expert physicians and receive a reply by email as soon as possible.",
            ogTitle: 'Ask a Doctor — Hisar Hospital',
            ogDescription: "Easily send your health questions to Hisar Hospital's expert physicians.",
        },
        header: 'Ask a Doctor',
        departments: [
            'Cardiology',
            'Cardiovascular Surgery',
            'General Surgery',
            'Orthopedics and Traumatology',
            'Urology',
            'Obstetrics and Gynecology',
            'Pediatric Health and Diseases',
            'Ophthalmology',
            'Ear, Nose and Throat',
            'Neurology',
            'Neurosurgery',
            'Internal Medicine',
            "Other / I'm not sure",
        ],
        labels: {
            fullName: 'Full Name',
            email: 'Email',
            phone: 'Phone (optional)',
            department: 'Department',
            question: 'Your Question',
            questionPlaceholder: 'Describe your health situation and question as clearly as possible…',
            selectPlaceholder: 'Select…',
            submit: 'Send Question',
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
            department: 'Please select a department',
            question: 'Your question must be at least 20 characters',
            kvkk: 'KVKK consent is required',
        },
        success: {
            title: 'Your question has been received',
            body: 'Your request has been received; one of our specialists will get back to you by email shortly.',
            backLabel: 'Back to Online Services',
        },
        tiles: [
            {
                title: 'For information only',
                body: 'The answers provided are for information only and do not replace a physical examination. An appointment may be recommended for diagnosis and treatment.',
            },
            {
                title: 'Routing to the right department',
                body: 'If you are not sure which department to choose, select “Other / I’m not sure”; our team will direct you to the appropriate specialist.',
            },
            {
                title: 'Privacy',
                body: 'Your health information is shared with the relevant specialist only in order to answer your question.',
            },
        ],
    },
} as const;

function buildSchema(
    departments: readonly [string, ...string[]],
    err: { fullName: string; email: string; phone: string; department: string; question: string; kvkk: string },
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
        department: z.enum(departments, { message: err.department }),
        question: z.string().trim().min(20, err.question).max(2000),
        kvkk: z.literal(true, { message: err.kvkk }),
    });
}

export default function DoktoraSorun() {
    const locale = useLocale();
    const lp = useLocalizedPath();
    const c = usePageCopy('doktora-sorun', COPY[locale]);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { post, transform, processing } = useForm({});

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data = {
            fullName: String(fd.get('fullName') ?? ''),
            email: String(fd.get('email') ?? ''),
            phone: String(fd.get('phone') ?? ''),
            department: String(fd.get('department') ?? ''),
            question: String(fd.get('question') ?? ''),
            kvkk: fd.get('kvkk') === 'on',
        };
        const r = buildSchema(c.departments, c.errors).safeParse(data);
        if (!r.success) {
            const errs: Record<string, string> = {};
            for (const issue of r.error.issues) errs[issue.path[0] as string] = issue.message;
            setErrors(errs);
            return;
        }
        setErrors({});
        transform(() => ({ ...data, website: String(fd.get('website') ?? ''), locale }));
        post('/form/doktora-sorun', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setSubmitted(true),
        });
    }

    const tileIcons = [Info, Stethoscope, ShieldCheck];

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.ogTitle} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/doktora-sorun" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/doktora-sorun" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/doktora-sorun" />
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
                                {/* Honeypot — real users never fill this; bots do. Kept off-screen. */}
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                    style={{ position: 'absolute', left: '-9999px', top: 0, height: 0, width: 0, opacity: 0 }}
                                />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label={c.labels.fullName} name="fullName" required error={errors.fullName} />
                                    <Field label={c.labels.email} name="email" type="email" required error={errors.email} />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label={c.labels.phone} name="phone" type="tel" error={errors.phone} />
                                    <SelectField
                                        label={c.labels.department}
                                        name="department"
                                        options={c.departments}
                                        placeholder={c.labels.selectPlaceholder}
                                        error={errors.department}
                                    />
                                </div>
                                <div>
                                    <label className="text-primary mb-1.5 block text-[13px] font-semibold">
                                        {c.labels.question} <span className="text-brand-orange">*</span>
                                    </label>
                                    <textarea
                                        name="question"
                                        rows={6}
                                        maxLength={2000}
                                        placeholder={c.labels.questionPlaceholder}
                                        className="border-border bg-background focus:border-primary/40 focus:ring-primary/15 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
                                    />
                                    {errors.question && <p className="text-destructive mt-1 text-xs">{errors.question}</p>}
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
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-gradient-orange text-brand-orange-foreground shadow-orange inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    <MessageCircleQuestion className="h-4 w-4" /> {c.labels.submit}
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

DoktoraSorun.layout = siteLayout;

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

function InfoTile({ icon: Icon, title, body }: { icon: typeof Info; title: string; body: string }) {
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
