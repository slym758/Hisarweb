import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, ClipboardList, Star } from 'lucide-react';
import { useMemo, useState } from 'react';

import { PageHeader, siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';

/* Stable question ids — locale-independent (labels live in COPY). */
const QUESTION_IDS = ['appointment', 'doctor', 'nursing', 'facility', 'wait', 'overall'] as const;

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Anketimize Katılın — Hisar Hospital',
            description: 'Hisar Hospital hasta deneyimi anketine katılın; hizmet kalitemizi birlikte geliştirelim.',
            ogTitle: 'Anketimize Katılın — Hisar Hospital',
            ogDescription: 'Kısa anketimizi doldurarak Hisar Hospital deneyiminizi değerlendirin.',
        },
        header: 'Anketimize Katılın',
        questions: [
            'Randevu ve karşılama süreci',
            'Hekim iletişimi ve bilgilendirme',
            'Hemşire ve yardımcı sağlık personeli',
            'Hastane temizliği ve fiziksel ortam',
            'Bekleme süreleri',
            'Genel memnuniyet',
        ],
        visitTypes: ['Poliklinik', 'Yatış / Servis', 'Acil Servis', 'Tetkik / Görüntüleme', 'Diğer'],
        labels: {
            progress: 'İlerleme',
            visitType: 'Ziyaret türü',
            nps: 'Hisar Hospital’ı bir yakınınıza tavsiye eder misiniz? (0–10)',
            comment: 'Eklemek istedikleriniz (opsiyonel)',
            commentPlaceholder: 'Görüş, öneri veya teşekkürlerinizi yazabilirsiniz…',
            name: 'Ad Soyad (opsiyonel)',
            email: 'E-posta (opsiyonel)',
            submit: 'Anketi Gönder',
            starWord: 'yıldız',
        },
        kvkk: {
            pre: '',
            link: 'KVKK Aydınlatma Metni',
            post: '’ni okudum ve kişisel verilerimin işlenmesini onaylıyorum.',
        },
        errors: {
            ratings: 'Lütfen tüm soruları puanlayın.',
            visitType: 'Lütfen ziyaret türünü seçin.',
            recommend: 'Lütfen tavsiye puanınızı verin (0–10).',
            kvkk: 'KVKK onayı zorunludur.',
        },
        prototypeNote: 'Bu form bir prototiptir; gönderim aktif değildir.',
        success: {
            title: 'Form doğrulandı (demo)',
            body: 'Bu bir prototiptir; anket gönderimi aktif değildir ve hiçbir bilgi iletilmemiştir.',
            backLabel: 'Ana sayfaya dön',
        },
        aside: {
            badge: '1–2 dakika',
            title: 'Görüşünüz bizim için değerli',
            body: 'Yanıtlarınız anonim olarak değerlendirilebilir; iletişim bilgisi paylaşmanız zorunlu değildir.',
            improveTitle: 'Neyi geliştiriyoruz?',
            improve: ['Randevu ve bekleme süreçleri', 'Hekim ve hemşire iletişimi', 'Fiziksel ortam ve konfor', 'Dijital hizmet deneyimi'],
        },
    },
    en: {
        head: {
            title: 'Take Our Survey — Hisar Hospital',
            description: "Take the Hisar Hospital patient experience survey; let's improve our service quality together.",
            ogTitle: 'Take Our Survey — Hisar Hospital',
            ogDescription: 'Rate your Hisar Hospital experience by completing our short survey.',
        },
        header: 'Take Our Survey',
        questions: [
            'Appointment and reception process',
            'Physician communication and information',
            'Nurses and auxiliary healthcare staff',
            'Hospital cleanliness and physical environment',
            'Waiting times',
            'Overall satisfaction',
        ],
        visitTypes: ['Outpatient Clinic', 'Inpatient / Ward', 'Emergency', 'Test / Imaging', 'Other'],
        labels: {
            progress: 'Progress',
            visitType: 'Visit type',
            nps: 'Would you recommend Hisar Hospital to a friend or relative? (0–10)',
            comment: "Anything you'd like to add (optional)",
            commentPlaceholder: 'You can write your opinions, suggestions or thanks…',
            name: 'Full Name (optional)',
            email: 'Email (optional)',
            submit: 'Submit Survey',
            starWord: 'star',
        },
        kvkk: {
            pre: 'I have read the ',
            link: 'KVKK Disclosure Statement',
            post: ' and consent to the processing of my personal data.',
        },
        errors: {
            ratings: 'Please rate all questions.',
            visitType: 'Please select the visit type.',
            recommend: 'Please provide your recommendation score (0–10).',
            kvkk: 'KVKK consent is required.',
        },
        prototypeNote: 'This form is a prototype; submission is not active.',
        success: {
            title: 'Form validated (demo)',
            body: 'This is a prototype; survey submission is not active and no information has been sent.',
            backLabel: 'Back to home',
        },
        aside: {
            badge: '1–2 minutes',
            title: 'Your opinion is valuable to us',
            body: 'Your responses may be evaluated anonymously; sharing your contact details is not mandatory.',
            improveTitle: 'What are we improving?',
            improve: [
                'Appointment and waiting processes',
                'Physician and nurse communication',
                'Physical environment and comfort',
                'Digital service experience',
            ],
        },
    },
} as const;

export default function AnketimizeKatilin() {
    const locale = useLocale();
    const lp = useLocalizedPath();
    const c = COPY[locale];

    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [visitType, setVisitType] = useState<string>('');
    const [recommend, setRecommend] = useState<number>(0); // NPS 0-10
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [kvkk, setKvkk] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const questions = QUESTION_IDS.map((id, i) => ({ id, label: c.questions[i] }));

    const completed = useMemo(() => Object.keys(ratings).length, [ratings]);
    const progress = Math.round(((completed / questions.length) * 0.7 + (visitType ? 0.1 : 0) + (recommend > 0 ? 0.1 : 0) + (kvkk ? 0.1 : 0)) * 100);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (completed < questions.length) {
            setError(c.errors.ratings);
            return;
        }
        if (!visitType) {
            setError(c.errors.visitType);
            return;
        }
        if (recommend === 0) {
            setError(c.errors.recommend);
            return;
        }
        if (!kvkk) {
            setError(c.errors.kvkk);
            return;
        }
        setError(null);
        setSubmitted(true);
    }

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.ogTitle} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/anketimize-katilin" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/anketimize-katilin" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/anketimize-katilin" />
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
                            <form onSubmit={onSubmit} className="space-y-6" noValidate>
                                {/* Progress */}
                                <div>
                                    <div className="text-muted-foreground mb-1.5 flex items-center justify-between text-[12px]">
                                        <span>{c.labels.progress}</span>
                                        <span className="text-primary font-semibold">{locale === 'en' ? `${progress}%` : `%${progress}`}</span>
                                    </div>
                                    <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                                        <div
                                            className="bg-gradient-orange h-full transition-[width] duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Visit type */}
                                <div>
                                    <label className="text-primary mb-2 block text-[13px] font-semibold">
                                        {c.labels.visitType} <span className="text-brand-orange">*</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {c.visitTypes.map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setVisitType(t)}
                                                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold transition ${
                                                    visitType === t
                                                        ? 'bg-primary text-primary-foreground border-transparent'
                                                        : 'bg-card text-primary border-border/70 hover:border-primary/40'
                                                }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Ratings */}
                                <div className="space-y-4">
                                    {questions.map((q) => (
                                        <div key={q.id} className="border-border/60 bg-background rounded-xl border p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-primary text-[13.5px] font-semibold">{q.label}</p>
                                                {ratings[q.id] && <span className="text-brand-orange text-[11px] font-bold">{ratings[q.id]}/5</span>}
                                            </div>
                                            <StarRow
                                                value={ratings[q.id] ?? 0}
                                                onChange={(v) => setRatings((m) => ({ ...m, [q.id]: v }))}
                                                starWord={c.labels.starWord}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* NPS */}
                                <div>
                                    <label className="text-primary mb-2 block text-[13px] font-semibold">
                                        {c.labels.nps} <span className="text-brand-orange">*</span>
                                    </label>
                                    <div className="grid grid-cols-11 gap-1.5">
                                        {Array.from({ length: 11 }).map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setRecommend(i)}
                                                className={`h-9 rounded-lg border text-[12.5px] font-bold transition ${
                                                    recommend === i
                                                        ? 'bg-primary text-primary-foreground border-transparent'
                                                        : 'bg-card text-primary border-border/70 hover:border-primary/40'
                                                }`}
                                            >
                                                {i}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comment */}
                                <div>
                                    <label className="text-primary mb-1.5 block text-[13px] font-semibold">{c.labels.comment}</label>
                                    <textarea
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        maxLength={1000}
                                        className="border-border bg-background focus:border-primary/40 focus:ring-primary/15 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
                                        placeholder={c.labels.commentPlaceholder}
                                    />
                                </div>

                                {/* Optional contact */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-primary mb-1.5 block text-[13px] font-semibold">{c.labels.name}</label>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="border-border bg-background focus:border-primary/40 focus:ring-primary/15 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-primary mb-1.5 block text-[13px] font-semibold">{c.labels.email}</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="border-border bg-background focus:border-primary/40 focus:ring-primary/15 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
                                        />
                                    </div>
                                </div>

                                <label className="text-muted-foreground flex items-start gap-2 text-[12.5px]">
                                    <input
                                        type="checkbox"
                                        checked={kvkk}
                                        onChange={(e) => setKvkk(e.target.checked)}
                                        className="accent-primary mt-0.5 h-4 w-4"
                                    />
                                    <span>
                                        {c.kvkk.pre}
                                        <Link href={lp('/kvkk-politikamiz')} className="text-primary font-semibold hover:underline">
                                            {c.kvkk.link}
                                        </Link>
                                        {c.kvkk.post}
                                    </span>
                                </label>

                                {error && <p className="text-destructive text-xs">{error}</p>}

                                <p className="text-muted-foreground text-xs">{c.prototypeNote}</p>

                                <button
                                    type="submit"
                                    className="bg-gradient-orange text-brand-orange-foreground shadow-orange inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition hover:-translate-y-0.5 sm:w-auto"
                                >
                                    <ClipboardList className="h-4 w-4" /> {c.labels.submit}
                                </button>
                            </form>
                        )}
                    </div>

                    <aside className="space-y-4">
                        <div className="border-border/70 from-card to-primary-soft/30 shadow-card rounded-2xl border bg-gradient-to-br p-5 lg:p-6">
                            <span className="bg-brand-orange/12 text-brand-orange inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.16em] uppercase">
                                {c.aside.badge}
                            </span>
                            <h3 className="text-primary mt-3 text-lg leading-tight font-bold">{c.aside.title}</h3>
                            <p className="text-muted-foreground mt-2 text-[13px] leading-relaxed">{c.aside.body}</p>
                        </div>
                        <div className="border-border/70 bg-card shadow-card rounded-2xl border p-5">
                            <h4 className="text-primary text-[14.5px] font-bold">{c.aside.improveTitle}</h4>
                            <ul className="text-muted-foreground mt-2 list-disc space-y-1.5 pl-5 text-[13px]">
                                {c.aside.improve.map((it) => (
                                    <li key={it}>{it}</li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}

AnketimizeKatilin.layout = siteLayout;

function StarRow({ value, onChange, starWord }: { value: number; onChange: (v: number) => void; starWord: string }) {
    return (
        <div className="mt-2 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} ${starWord}`} className="p-1">
                    <Star className={`h-6 w-6 transition ${n <= value ? 'fill-brand-orange text-brand-orange' : 'text-muted-foreground/40'}`} />
                </button>
            ))}
        </div>
    );
}
