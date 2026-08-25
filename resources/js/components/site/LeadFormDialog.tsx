import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { BizeUlasin } from '@/components/site/BizeUlasin';
import { useLocale } from '@/lib/i18n';

const COPY = {
    tr: { close: 'Kapat', fallbackTitle: 'Bize Ulaşın' },
    en: { close: 'Close', fallbackTitle: 'Contact Us' },
} as const;

/**
 * Accessible lead/contact dialog reusing the shared `BizeUlasin` form
 * (same fields, KVKK consent, validation and submission behaviour).
 * Desktop → centered modal. Mobile → bottom sheet.
 */
export function LeadFormDialog({
    open,
    onClose,
    title,
    subtitle,
    context,
}: {
    open: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    context?: string;
}) {
    const c = COPY[useLocale()];
    const labelId = useId();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        panelRef.current?.focus();
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
            <button
                type="button"
                aria-label={c.close}
                onClick={onClose}
                className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelId}
                tabIndex={-1}
                className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card shadow-elevated outline-none pb-[env(safe-area-inset-bottom)]"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={c.close}
                    className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/90 border border-border text-primary hover:bg-muted transition"
                >
                    <X className="h-4 w-4" />
                </button>
                <div className="sm:hidden mx-auto mt-2 h-1.5 w-10 rounded-full bg-border" />
                <div id={labelId} className="sr-only">
                    {title ?? c.fallbackTitle}
                </div>
                <BizeUlasin bare title={title} subtitle={subtitle} context={context} />
            </div>
        </div>,
        document.body,
    );
}
