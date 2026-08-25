import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquareText } from 'lucide-react';

import { LeadFormDialog } from '@/components/site/LeadFormDialog';
import { useLocale } from '@/lib/i18n';
import {
    registerDetailLead,
    openDetailLead,
    closeDetailLead,
    useDetailLead,
    type DetailPageType,
} from '@/lib/detail-lead-store';

export type { DetailPageType };

const COPY = {
    tr: {
        primary: 'Detaylı Bilgi Al',
        formTitle: 'Detaylı Bilgi Al',
        formSubtitle: 'Formu doldurun, ekibimiz sizinle iletişime geçsin.',
    },
    en: {
        primary: 'Get Detailed Information',
        formTitle: 'Get Detailed Information',
        formSubtitle: 'Fill in the form and our team will contact you.',
    },
} as const;

/** Only one conversion system may be visible per page. */
let mountedCount = 0;

export function DetailLeadConversion({
    pageTitle,
    pageType = 'generic',
    desktopTrigger = false,
}: {
    pageTitle: string;
    pageType?: DetailPageType;
    /** Set false on templates where a right-edge tab could collide with content. */
    desktopTrigger?: boolean;
}) {
    const locale = useLocale();
    const t = COPY[locale];
    const [owner, setOwner] = useState(true);
    const state = useDetailLead();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        mountedCount += 1;
        setOwner(mountedCount === 1);
        setMounted(true);
        return () => {
            mountedCount -= 1;
        };
    }, []);

    useEffect(() => {
        if (!owner) return;
        return registerDetailLead({ pageTitle, pageType, lang: locale });
    }, [owner, pageTitle, pageType, locale]);

    if (!owner) return null;

    const context = pageTitle;

    return (
        <>
            {desktopTrigger &&
                mounted &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div className="hidden md:flex fixed right-0 top-1/2 z-[60] -translate-y-1/2 flex-col items-center gap-1">
                        <button
                            type="button"
                            onClick={openDetailLead}
                            className="group cta-attention inline-flex flex-col items-center gap-2 rounded-l-2xl rounded-r-none border border-r-0 border-[#48d7fe]/30 bg-white px-3 py-4 text-[12px] font-bold text-[#0f2f5f] shadow-elevated transition-all duration-200 hover:-translate-x-0.5 hover:border-[#48d7fe] hover:bg-[#48d7fe]/12 hover:shadow-[0_10px_30px_-8px_rgba(72,215,254,0.65)] hover:text-[#0f2f5f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48d7fe]/60"
                        >
                            <span className="cta-attention-halo text-[#0f2f5f]">
                                <MessageSquareText className="h-3.5 w-3.5" />
                            </span>
                            <span className="cta-label vertical-rl [writing-mode:vertical-rl] rotate-180 tracking-wide">{t.primary}</span>
                        </button>
                    </div>,
                    document.body,
                )}

            <LeadFormDialog
                open={state.open}
                onClose={closeDetailLead}
                title={t.formTitle}
                subtitle={t.formSubtitle}
                context={context}
            />
        </>
    );
}
