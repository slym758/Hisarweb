import { Link } from '@inertiajs/react';

import { useCurrentPath, useLocale, useLocalizedPath } from '@/lib/i18n';

const PATHS = [
    '/butunlesik-onkoloji',
    '/butunlesik-onkoloji/medikal-kadro',
    '/moral-takimi',
] as const;

const COPY = {
    tr: { aria: 'Bütünleşik Onkoloji', tabs: ['Genel Bakış', 'Medikal Kadro', 'Moral Takımı'] },
    en: { aria: 'Integrated Oncology', tabs: ['Overview', 'Medical Staff', 'Morale Team'] },
} as const;

export function OnkolojiSubNav() {
    const c = COPY[useLocale()];
    const lp = useLocalizedPath();
    const pathname = useCurrentPath();
    const tabs = PATHS.map((to, i) => ({ to, label: c.tabs[i] }));
    return (
        <div className="sticky top-[var(--sticky-h,var(--header-h,84px))] z-30 border-b border-border/70 bg-background transition-[top] duration-300 will-change-[top]">
            <div className="container-x relative overflow-hidden">
                <nav
                    aria-label={c.aria}
                    className="-mx-4 flex gap-1.5 overflow-x-auto px-4 py-2 pr-[22vw] lg:mx-0 lg:px-0 lg:pr-2 lg:py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {tabs.map((t) => {
                        const active = pathname === t.to;
                        return (
                            <Link
                                key={t.to}
                                href={lp(t.to)}
                                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${
                                    active
                                        ? 'bg-primary text-primary-foreground shadow-elevated'
                                        : 'text-primary/80 hover:bg-primary-soft/60'
                                }`}
                            >
                                {t.label}
                            </Link>
                        );
                    })}
                </nav>
                <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 lg:hidden bg-gradient-to-l from-background via-background/95 to-transparent"
                />
            </div>
        </div>
    );
}
