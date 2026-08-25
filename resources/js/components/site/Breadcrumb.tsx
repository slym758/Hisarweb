import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import type { ReactNode } from 'react';

import { useLocale, useLocalizedPath } from '@/lib/i18n';

export type Crumb = { label: string; to?: string };

const COPY = {
    tr: { home: 'Anasayfa' },
    en: { home: 'Home' },
} as const;

export function Breadcrumb({ items }: { items: Crumb[] }) {
    const c = COPY[useLocale()];
    const lp = useLocalizedPath();
    return (
        <nav aria-label="breadcrumb" className="border-border/60 bg-surface/50 border-b">
            <div className="container-x text-muted-foreground scrollbar-thin flex items-center gap-1.5 overflow-x-auto py-3 text-[12px] lg:text-[13px]">
                <Link href={lp('/')} className="hover:text-primary inline-flex items-center gap-1 transition">
                    <Home className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{c.home}</span>
                </Link>
                {items.map((it, i) => (
                    <BreadcrumbItem key={i} item={it} isLast={i === items.length - 1} lp={lp} />
                ))}
            </div>
        </nav>
    );
}

function BreadcrumbItem({ item, isLast, lp }: { item: Crumb; isLast: boolean; lp: (path: string) => string }): ReactNode {
    return (
        <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
            {item.to && !isLast ? (
                <Link href={lp(item.to)} className="hover:text-primary whitespace-nowrap transition">
                    {item.label}
                </Link>
            ) : (
                <span className="text-primary max-w-[45vw] truncate font-semibold whitespace-nowrap">{item.label}</span>
            )}
        </>
    );
}
