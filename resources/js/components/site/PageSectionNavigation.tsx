import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useId, useState } from 'react';

import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export type PageSection = { id: string; label: string };

type Props = {
    sections: PageSection[];
    title?: string;
    className?: string;
    /** Extra pixels added to the sticky-header scroll offset when jumping. */
    scrollOffset?: number;
    /** Optional: hide on desktop (when the parent renders another desktop nav). */
    mobileOnly?: boolean;
    /** Optional: hide on mobile (when parent renders another mobile nav). */
    desktopOnly?: boolean;
    /** UI language for built-in strings. Falls back to the active locale. */
    lang?: 'tr' | 'en';
};

const COPY = {
    tr: { title: 'Bu sayfada', count: (n: number) => `${n} bölüm` },
    en: { title: 'On this page', count: (n: number) => `${n} sections` },
} as const;

/**
 * Unified in-page navigation ("Bu sayfada") used across department, blog,
 * treatment, hospital and policy pages. Renders a compact, sticky, collapsible
 * accordion on mobile and a sticky list on desktop. Scroll-spy powered by
 * a scroll listener.
 */
export function PageSectionNavigation({ sections, title, className, scrollOffset = 24, mobileOnly, desktopOnly, lang }: Props) {
    const autoLocale = useLocale();
    const copy = COPY[lang ?? autoLocale];
    const heading = title ?? copy.title;
    // Only render links that resolve to a real section element on the page.
    const [resolved, setResolved] = useState<PageSection[]>(sections);
    const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
    const [open, setOpen] = useState(false);
    const panelId = useId();

    // Keep only sections that actually exist in the DOM (no dead anchors).
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const check = () => {
            const next = sections.filter((s) => document.getElementById(s.id));
            setResolved(next.length ? next : sections);
        };
        check();
        const raf = window.requestAnimationFrame(check);
        return () => window.cancelAnimationFrame(raf);
    }, [sections]);

    // Scroll-spy — plain scroll listener so the active row is always correct,
    // both while scrolling and immediately after a click-driven jump.
    useEffect(() => {
        if (typeof window === 'undefined' || !resolved.length) return;
        let frame = 0;
        const compute = () => {
            frame = 0;
            const line = getHeaderOffset() + scrollOffset + 8;
            const els = resolved
                .map((s) => ({ id: s.id, el: document.getElementById(s.id) }))
                .filter((x): x is { id: string; el: HTMLElement } => !!x.el);
            if (!els.length) return;
            // Bottom of page → last section.
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
                setActiveId(els[els.length - 1].id);
                return;
            }
            let current = els[0].id;
            for (const { id, el } of els) {
                if (el.getBoundingClientRect().top <= line) current = id;
            }
            setActiveId(current);
        };
        const onScroll = () => {
            if (!frame) frame = window.requestAnimationFrame(compute);
        };
        compute();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [resolved, scrollOffset]);

    const scrollTo = useCallback(
        (id: string) => {
            const el = document.getElementById(id);
            if (!el) return;
            const y = el.getBoundingClientRect().top + window.scrollY - (getHeaderOffset() + scrollOffset);
            const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
            setActiveId(id);
            setOpen(false);
            if (history.replaceState) {
                history.replaceState(null, '', `#${id}`);
            } else {
                window.location.hash = id;
            }
        },
        [scrollOffset],
    );

    const activeLabel = resolved.find((s) => s.id === activeId)?.label ?? resolved[0]?.label ?? '';
    if (!resolved.length) return null;

    return (
        <nav aria-label={heading} className={cn(!desktopOnly && 'lg:contents', className)}>
            {/* MOBILE — sticky compact accordion */}
            {!desktopOnly && (
                <div
                    className={cn(
                        'sticky z-30 transition-[top] duration-300 will-change-[top] lg:hidden',
                        'top-[var(--sticky-h,var(--header-h,84px))]',
                    )}
                >
                    <div
                        className={cn(
                            'border-border/70 rounded-xl border bg-white/95 backdrop-blur',
                            'shadow-[0_2px_10px_-6px_rgba(15,23,42,0.18)]',
                            open && 'shadow-[0_10px_30px_-14px_rgba(15,23,42,0.28)]',
                            'transition-shadow',
                        )}
                    >
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            aria-expanded={open}
                            aria-controls={panelId}
                            className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left"
                        >
                            <span className="bg-brand-orange/10 text-brand-orange grid h-9 w-9 shrink-0 place-items-center rounded-lg" aria-hidden>
                                <BookOpen className="h-4 w-4" strokeWidth={2} />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="text-muted-foreground block text-[10.5px] font-bold tracking-wider uppercase">{heading}</span>
                                <span className="text-primary mt-0.5 block truncate text-[13.5px] font-bold">{activeLabel}</span>
                            </span>
                            <span className="text-muted-foreground flex shrink-0 items-center gap-1.5">
                                <span className="text-[11px] font-semibold">{copy.count(resolved.length)}</span>
                                <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
                            </span>
                        </button>

                        <div
                            id={panelId}
                            className={cn(
                                'grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out',
                                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                                'motion-reduce:transition-none',
                            )}
                        >
                            <ul className="border-border/60 min-h-0 overflow-hidden border-t">
                                {resolved.map((s, i) => {
                                    const active = s.id === activeId;
                                    return (
                                        <li key={s.id}>
                                            <button
                                                type="button"
                                                onClick={() => scrollTo(s.id)}
                                                aria-current={active ? 'true' : undefined}
                                                className={cn(
                                                    'flex w-full items-center gap-2.5 py-3 pr-3 pl-[14px] text-left',
                                                    'border-border/50 min-h-12 border-b last:border-b-0',
                                                    'transition-colors duration-[180ms] ease-out',
                                                    active ? 'bg-primary-soft/40 text-primary' : 'text-foreground/85 hover:bg-muted/60',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'block h-[24px] w-[3px] shrink-0 rounded-full',
                                                        'transition-[background-color,opacity] duration-[180ms] ease-out',
                                                        active ? 'bg-brand-orange opacity-100' : 'bg-transparent opacity-0',
                                                    )}
                                                    aria-hidden
                                                />

                                                <span
                                                    className={cn(
                                                        'shrink-0 text-[11px] font-bold tabular-nums',
                                                        active ? 'text-brand-orange' : 'text-muted-foreground/70',
                                                    )}
                                                    aria-hidden
                                                >
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <span
                                                    className={cn('min-w-0 flex-1 text-[14px] leading-snug', active ? 'font-bold' : 'font-semibold')}
                                                >
                                                    {s.label}
                                                </span>
                                                <ChevronRight className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0" aria-hidden />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* DESKTOP — sticky sidebar list */}
            {!mobileOnly && (
                <div className="hidden lg:block">
                    <div className="border-border/70 rounded-2xl border bg-white/90 p-3.5 backdrop-blur-sm">
                        <p className="text-muted-foreground px-1.5 pt-1 pb-2 text-[10px] font-bold tracking-wider uppercase">{heading}</p>
                        <ul className="space-y-0.5">
                            {resolved.map((s, i) => {
                                const active = s.id === activeId;
                                return (
                                    <li key={s.id}>
                                        <button
                                            type="button"
                                            onClick={() => scrollTo(s.id)}
                                            aria-current={active ? 'true' : undefined}
                                            className={cn(
                                                'flex w-full items-center gap-2.5 rounded-lg py-2 pr-2.5 pl-[14px] text-left',
                                                'transition-colors duration-[180ms] ease-out',
                                                active
                                                    ? 'bg-primary-soft/50 text-primary'
                                                    : 'text-foreground/80 hover:bg-muted/60 hover:text-primary',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'block h-[22px] w-[3px] shrink-0 rounded-full',
                                                    'transition-[background-color,opacity] duration-[180ms] ease-out',
                                                    active ? 'bg-brand-orange opacity-100' : 'bg-transparent opacity-0',
                                                )}
                                                aria-hidden
                                            />

                                            <span
                                                className={cn(
                                                    'w-5 shrink-0 text-[10.5px] font-bold tabular-nums',
                                                    active ? 'text-brand-orange' : 'text-muted-foreground/70',
                                                )}
                                                aria-hidden
                                            >
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span className={cn('min-w-0 flex-1 text-[13px] leading-snug', active ? 'font-bold' : 'font-semibold')}>
                                                {s.label}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
}

function getHeaderOffset(): number {
    if (typeof window === 'undefined') return 84;
    const cs = getComputedStyle(document.documentElement);
    // Prefer the live sticky height (condensed header) and fall back to the full header.
    for (const name of ['--sticky-h', '--header-h']) {
        const px = parseInt(cs.getPropertyValue(name), 10);
        if (Number.isFinite(px) && px > 0) return px;
    }
    return window.innerWidth >= 1024 ? 121 : 84;
}
