import type { ReactNode } from 'react';

import { useTranslations } from '@/lib/i18n';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { DesktopRail } from '@/components/site/DesktopRail';
import { MobileAppPromo } from '@/components/site/MobileAppPromo';
import { MobileBottomNav } from '@/components/site/MobileBottomNav';
import { LangSwitcher } from '@/components/site/LangSwitcher';

/**
 * Persistent public-site shell — the Inertia equivalent of the source `SiteLayout`
 * (header + main + footer + desktop rail + mobile app promo). MobileBottomNav and
 * LangSwitcher, which the source mounted globally from its router root, live here so
 * they appear on every public page (but not on auth/dashboard).
 */
export function SiteLayout({ children }: { children: ReactNode }) {
    const { t } = useTranslations();
    return (
        <div className="min-h-screen flex w-full max-w-full min-w-0 flex-col">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-elevated focus:outline-none focus:ring-2 focus:ring-brand-orange"
            >
                {t('common.skip_to_content')}
            </a>
            <SiteHeader />
            <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 w-full max-w-full min-w-0 box-border focus:outline-none"
            >
                {children}
            </main>
            <SiteFooter />
            <DesktopRail />
            <MobileAppPromo />
            <MobileBottomNav />
            <LangSwitcher />
        </div>
    );
}

/** Inertia persistent-layout helper: `Page.layout = siteLayout`. */
export const siteLayout = (page: ReactNode) => <SiteLayout>{page}</SiteLayout>;

export function PageHeader({
    title,
    subtitle: _subtitle,
    children,
}: {
    title: string;
    /** @deprecated Subtitle is no longer rendered site-wide. Kept for backwards compatibility. */
    subtitle?: string;
    children?: ReactNode;
}) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 via-surface to-background border-b border-border/60">
            <div
                className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_55%)]"
                aria-hidden
            />
            <div className="container-x relative py-6 lg:py-12 text-center">
                <h1 className="text-xl lg:text-4xl font-black tracking-tight text-primary">{title}</h1>
                {children && <div className="mx-auto mt-4 lg:mt-6 max-w-4xl">{children}</div>}
            </div>
        </section>
    );
}
