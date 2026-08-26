import { CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

import { useLocale } from '@/lib/i18n';

const COPY = {
    tr: {
        defaultTitle: 'Bize Ulaşın',
        defaultSubtitle: 'Sorularınız için formu doldurun; ekibimiz en kısa sürede sizi arasın.',
        contactBadge: 'İletişim',
        name: 'Ad Soyad',
        phone: 'Telefon',
        message: 'Mesajınız',
        kvkk: 'KVKK aydınlatma metnini okudum, kişisel verilerimin işlenmesine onay veriyorum.',
        kvkkError: 'KVKK onayı zorunludur.',
        submit: 'Gönder',
        sentTitle: 'Talebiniz alındı',
        sentBody: 'Talebiniz alındı, ekibimiz en kısa sürede sizinle iletişime geçecektir.',
        contextMessage: (ctx: string) => `${ctx} hakkında bilgi almak istiyorum.`,
    },
    en: {
        defaultTitle: 'Contact Us',
        defaultSubtitle: 'Fill out the form with your questions; our team will call you back as soon as possible.',
        contactBadge: 'Contact',
        name: 'Full Name',
        phone: 'Phone',
        message: 'Your Message',
        kvkk: 'I have read the KVKK disclosure text and consent to the processing of my personal data.',
        kvkkError: 'KVKK consent is required.',
        submit: 'Send',
        sentTitle: 'Your request has been received',
        sentBody: 'Your request has been received; our team will get back to you as soon as possible.',
        contextMessage: (ctx: string) => `I would like to get information about ${ctx}.`,
    },
} as const;

/**
 * Universal "Bize Ulaşın" contact block for detail pages. Submits to the shared contact
 * form endpoint (`/form/iletisim`) with KVKK consent + a honeypot, mirroring the other
 * live forms.
 */
export function BizeUlasin({
    title,
    subtitle,
    context,
    bare = false,
}: {
    title?: string;
    subtitle?: string;
    context?: string;
    /** Renders without the outer card chrome (used inside the lead dialog). */
    bare?: boolean;
}) {
    const locale = useLocale();
    const c = COPY[locale];
    const resolvedTitle = title ?? c.defaultTitle;
    const resolvedSubtitle = subtitle ?? c.defaultSubtitle;
    const [form, setForm] = useState({
        name: '',
        phone: '',
        message: context ? c.contextMessage(context) : '',
        kvkk: false,
    });
    const [hp, setHp] = useState(''); // honeypot
    const [sent, setSent] = useState(false);
    const [kvkkErr, setKvkkErr] = useState<string | null>(null);
    const { post, transform, processing } = useForm({});

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.kvkk) {
            setKvkkErr(c.kvkkError);
            return;
        }
        setKvkkErr(null);
        transform(() => ({
            name: form.name,
            phone: form.phone,
            message: form.message,
            subject: context ?? '',
            kvkk: form.kvkk,
            website: hp,
            locale,
        }));
        post('/form/iletisim', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setSent(true),
        });
    };

    return (
        <section
            className={
                bare
                    ? 'p-5 sm:p-7'
                    : 'border-border/70 from-primary-soft/40 via-card to-surface rounded-3xl border bg-gradient-to-br p-6 shadow-[0_8px_30px_-16px_oklch(0.28_0.16_268/0.15)] lg:p-8'
            }
        >
            <div className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground hidden h-10 w-10 shrink-0 items-center justify-center rounded-full sm:inline-flex">
                    <MessageSquare className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-brand-orange text-[11px] font-bold tracking-widest uppercase">{c.contactBadge}</p>
                    <h3 className="text-primary mt-1 text-lg leading-tight font-black tracking-tight lg:text-2xl">{resolvedTitle}</h3>
                    <p className="text-muted-foreground mt-1 max-w-lg text-sm">{resolvedSubtitle}</p>
                </div>
            </div>

            {sent ? (
                <div className="border-success/30 bg-success/10 mt-5 rounded-2xl border p-6 text-center">
                    <span className="bg-success/20 text-success inline-flex h-12 w-12 items-center justify-center rounded-full">
                        <CheckCircle2 className="h-6 w-6" />
                    </span>
                    <h4 className="text-primary mt-3 text-lg font-black">{c.sentTitle}</h4>
                    <p className="text-muted-foreground mx-auto mt-1 max-w-md text-[13px]">{c.sentBody}</p>
                </div>
            ) : (
                <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
                    {/* Honeypot — real users never fill this; bots do. Kept off-screen. */}
                    <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={hp}
                        onChange={(e) => setHp(e.target.value)}
                        style={{ position: 'absolute', left: '-9999px', top: 0, height: 0, width: 0, opacity: 0 }}
                    />
                    <label className="text-primary/90 text-[12px] font-semibold">
                        {c.name}
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="bg-card border-border focus:border-primary/40 focus:ring-primary/15 mt-1 h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2"
                        />
                    </label>
                    <label className="text-primary/90 text-[12px] font-semibold">
                        {c.phone}
                        <input
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="bg-card border-border focus:border-primary/40 focus:ring-primary/15 mt-1 h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2"
                        />
                    </label>
                    <label className="text-primary/90 text-[12px] font-semibold sm:col-span-2">
                        {c.message}
                        <textarea
                            rows={4}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="bg-card border-border focus:border-primary/40 focus:ring-primary/15 mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2"
                        />
                    </label>
                    <label className="text-muted-foreground flex items-start gap-2 text-[12px] sm:col-span-2">
                        <input
                            type="checkbox"
                            checked={form.kvkk}
                            onChange={(e) => setForm({ ...form, kvkk: e.target.checked })}
                            className="border-border mt-0.5 h-4 w-4 rounded"
                        />
                        <span>{c.kvkk}</span>
                    </label>
                    {kvkkErr && <p className="text-destructive text-xs sm:col-span-2">{kvkkErr}</p>}
                    <div className="flex flex-wrap items-center gap-3 pt-1 sm:col-span-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-orange text-brand-orange-foreground shadow-orange inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Send className="h-4 w-4" /> {c.submit}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
