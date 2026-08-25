import { Info, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

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
        submit: 'Gönder',
        prototype: 'Bu form tasarım prototipidir; gönderim aktif değildir.',
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
        submit: 'Send',
        prototype: 'This form is a design prototype; submission is not active.',
        contextMessage: (ctx: string) => `I would like to get information about ${ctx}.`,
    },
} as const;

/**
 * Universal "Bize Ulaşın" contact block for detail pages.
 * Passive prototype — no backend wiring.
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
    const c = COPY[useLocale()];
    const resolvedTitle = title ?? c.defaultTitle;
    const resolvedSubtitle = subtitle ?? c.defaultSubtitle;
    const [form, setForm] = useState({
        name: '',
        phone: '',
        message: context ? c.contextMessage(context) : '',
        kvkk: false,
    });

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

            <form onSubmit={(e) => e.preventDefault()} className="mt-5 grid gap-3 sm:grid-cols-2">
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
                <div className="flex flex-wrap items-center gap-3 pt-1 sm:col-span-2">
                    <button
                        type="button"
                        disabled
                        className="bg-gradient-orange text-brand-orange-foreground shadow-orange inline-flex cursor-not-allowed items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold opacity-60"
                    >
                        <Send className="h-4 w-4" /> {c.submit}
                    </button>
                    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[11.5px]">
                        <Info className="h-3.5 w-3.5" /> {c.prototype}
                    </span>
                </div>
            </form>
        </section>
    );
}
